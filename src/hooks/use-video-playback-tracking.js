/* eslint-disable no-console */
import { useCallback, useEffect, useRef, useState } from 'react';

import { useBalance } from '../contexts/balance-context';
import paymentApi from '../libs/payment';
import { useSessionContext } from '../libs/session';

/**
 * 视频播放追踪钩子
 * 管理视频播放状态、时长计算、余额检查等
 * 按分钟计费：不足1分钟按1分钟计费
 */
const useVideoPlaybackTracking = () => {
  const { session } = useSessionContext();
  const customerId = session?.user?.did || 'demo_user';

  // 从 BalanceContext 获取余额信息
  const { availableMinutes, refreshBalance, checkPlaybackEligibility } = useBalance();

  // 播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackLimited, setPlaybackLimited] = useState(false);
  const [error, setError] = useState(null);

  // 时间状态
  const [sessionTime, setSessionTime] = useState(0); // 当前会话时间（秒）
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [currentVideo, setCurrentVideo] = useState('');

  // 引用
  const sessionIdRef = useRef(null);
  const videoPlaybackTimeRef = useRef(0); // 视频真实播放时间
  const isSessionSettledRef = useRef(false); // 防重复上报标记

  /**
   * 上报播放结束（用于额度用尽等情况）
   */
  const reportPlaybackEnd = useCallback(
    async (billedMinutes, reason, currentSessionTime) => {
      if (!sessionIdRef.current || billedMinutes <= 0 || isSessionSettledRef.current) return;

      try {
        // 设置已结算标记，防止重复上报
        isSessionSettledRef.current = true;

        await paymentApi.reportListeningTime(customerId, billedMinutes, sessionIdRef.current, {
          video_file: currentVideo,
          session_type: 'auto_settlement',
          session_duration_seconds: currentSessionTime,
          billed_minutes: billedMinutes,
          actual_video_time: videoPlaybackTimeRef.current,
          billing_method: 'per_minute_ceil',
          settlement_reason: reason,
          settlement_note: `自动结算: ${reason}, 播放 ${currentSessionTime}秒，按 ${billedMinutes}分钟计费`,
        });

        // 刷新余额
        await refreshBalance();
      } catch (err) {
        setError('自动结算播放时长失败');
        // 如果上报失败，重置标记，允许重试
        isSessionSettledRef.current = false;
        throw err;
      }
    },
    [customerId, currentVideo, refreshBalance],
  );

  /**
   * 更新播放时间（由视频播放器调用）
   */
  const updatePlaybackTime = useCallback(
    (currentTime) => {
      videoPlaybackTimeRef.current = currentTime;

      if (sessionStartTime && isPlaying) {
        const elapsedTime = Math.floor((Date.now() - sessionStartTime) / 1000);
        setSessionTime(elapsedTime);

        // 检查是否超过可用播放时长（按实际分钟数的秒数计算）
        const availableSeconds = availableMinutes * 60;

        if (elapsedTime >= availableSeconds && availableMinutes > 0) {
          console.log(`⏰ 播放时长已达上限: ${elapsedTime}秒 >= ${availableSeconds}秒`);

          // 立即上报消费的分钟数
          const billedMinutes = Math.ceil(elapsedTime / 60);
          reportPlaybackEnd(billedMinutes, 'time_limit_reached', elapsedTime).catch((err) => {
            console.error('上报时长失败:', err);
          });

          setPlaybackLimited(true);
          setIsPlaying(false);
        }
      }
    },
    [sessionStartTime, isPlaying, availableMinutes, reportPlaybackEnd],
  );

  /**
   * 最终结算播放时长
   */
  const finalizeSession = useCallback(async () => {
    if (!sessionIdRef.current || sessionTime <= 0 || isSessionSettledRef.current) return;

    // 按分钟计费：不足1分钟按1分钟计费
    const billedMinutes = Math.ceil(sessionTime / 60);
    if (billedMinutes <= 0) return;

    try {
      // 设置已结算标记，防止重复上报
      isSessionSettledRef.current = true;

      // 统一上报最终播放时长（这个操作同时也会消费信用额度）
      await paymentApi.reportListeningTime(customerId, billedMinutes, sessionIdRef.current, {
        video_file: currentVideo,
        session_type: 'final_settlement',
        session_duration_seconds: sessionTime,
        billed_minutes: billedMinutes,
        actual_video_time: videoPlaybackTimeRef.current,
        billing_method: 'per_minute_ceil',
        settlement_note: `播放 ${sessionTime}秒，按 ${billedMinutes}分钟计费`,
      });

      console.log(`📊 会话结算完成: 播放${sessionTime}秒 → 计费${billedMinutes}分钟`);

      // 刷新余额
      await refreshBalance();
    } catch (err) {
      console.error('会话结算失败:', err);
      setError('结算播放时长失败');
      // 如果上报失败，重置标记，允许重试
      isSessionSettledRef.current = false;
      throw err;
    }
  }, [customerId, sessionTime, currentVideo, refreshBalance]);

  /**
   * 开始播放
   */
  const startPlayback = useCallback(
    (videoFile) => {
      try {
        // 检查播放资格
        const eligibility = checkPlaybackEligibility();
        if (!eligibility.canPlay) {
          setError(eligibility.reason);
          return { success: false, reason: eligibility.reason };
        }

        // 生成新的会话ID
        sessionIdRef.current = `video_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // 重置状态
        setSessionTime(0);
        setSessionStartTime(Date.now());
        setCurrentVideo(videoFile);
        setIsPlaying(true);
        setPlaybackLimited(false);
        setError(null);
        videoPlaybackTimeRef.current = 0;
        isSessionSettledRef.current = false; // 重置结算标记

        console.log('开始播放视频:', videoFile, '会话ID:', sessionIdRef.current);
        return { success: true };
      } catch (err) {
        const errorMsg = '开始播放失败';
        setError(errorMsg);
        console.error('开始播放失败:', err);
        return { success: false, reason: errorMsg };
      }
    },
    [checkPlaybackEligibility],
  );

  /**
   * 停止播放
   */
  const stopPlayback = useCallback(async () => {
    setIsPlaying(false);

    let needsBalanceRefresh = false;

    // 结算会话
    if (sessionTime > 0) {
      try {
        const result = await finalizeSession();
        needsBalanceRefresh = result?.needsBalanceRefresh || false;
      } catch (err) {
        console.error('停止播放时结算失败:', err);
      }
    }

    // 重置会话状态
    setSessionTime(0);
    setSessionStartTime(null);
    setCurrentVideo('');
    sessionIdRef.current = null;
    videoPlaybackTimeRef.current = 0;
    isSessionSettledRef.current = false; // 重置结算标记

    console.log('停止播放');
    return { needsBalanceRefresh };
  }, [finalizeSession, sessionTime]);

  /**
   * 暂停播放
   */
  const pausePlayback = useCallback(() => {
    setIsPlaying(false);
    console.log('暂停播放');
  }, []);

  /**
   * 恢复播放
   */
  // eslint-disable-next-line require-await
  const resumePlayback = useCallback(async () => {
    // 检查播放资格
    const eligibility = checkPlaybackEligibility();
    if (!eligibility.canPlay) {
      setError(eligibility.reason);
      return { success: false, reason: eligibility.reason };
    }

    // 检查当前计费是否已超限
    const billedMinutes = Math.ceil(sessionTime / 60);
    if (billedMinutes >= availableMinutes && availableMinutes > 0) {
      setPlaybackLimited(true);
      return { success: false, reason: '观看时长已达上限' };
    }

    setIsPlaying(true);
    setError(null);

    console.log('恢复播放');
    return { success: true };
  }, [checkPlaybackEligibility, availableMinutes, sessionTime]);

  // 格式化时间显示
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formatMinutes = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}秒`;
    }
    if (remainingSeconds === 0) {
      return `${minutes}分钟`;
    }
    return `${minutes}分${remainingSeconds}秒`;
  }, []);

  // 计算剩余时间（基于实际播放时间）
  const billedMinutes = Math.ceil(sessionTime / 60);
  const totalAvailableSeconds = availableMinutes * 60;
  const remainingSeconds = Math.max(0, totalAvailableSeconds - sessionTime);
  const usedPercentage = totalAvailableSeconds > 0 ? (sessionTime / totalAvailableSeconds) * 100 : 0;

  const remainingTime = {
    seconds: remainingSeconds,
    formatted: formatMinutes(remainingSeconds),
    percentage: Math.min(usedPercentage, 100),
  };

  // 专门用于页面卸载的简化上报方法（无副作用，直接调用 API）
  const reportUnloadSettlement = useCallback(
    (minutes) => {
      // 检查是否已经结算过，防止重复上报
      if (isSessionSettledRef.current) {
        console.log(`⚠️ 会话已结算，跳过页面卸载上报: 会话ID ${sessionIdRef.current}`);
        return false;
      }

      // 设置已结算标记
      isSessionSettledRef.current = true;

      const data = {
        customerId,
        minutes,
        sessionId: sessionIdRef.current,
        metadata: {
          video_file: currentVideo,
          session_type: 'page_unload_settlement',
          session_duration_seconds: sessionTime,
          billed_minutes: minutes,
          actual_video_time: videoPlaybackTimeRef.current,
          billing_method: 'per_minute_ceil',
          settlement_reason: 'page_unload_confirmed',
          settlement_note: `用户确认离开页面，播放 ${sessionTime}秒，按 ${minutes}分钟计费`,
        },
      };

      // 方法1：使用 navigator.sendBeacon (推荐)
      if (navigator.sendBeacon) {
        try {
          const blob = new Blob([JSON.stringify(data)], {
            type: 'application/json',
          });
          const success = navigator.sendBeacon('/api/payment/meter/report', blob);
          console.log(
            `🚨 页面离开计费(sendBeacon): ${success ? '成功' : '失败'} - 播放${sessionTime}秒 → 计费${minutes}分钟`,
          );
          return success;
        } catch (err) {
          console.error('sendBeacon 上报失败:', err);
        }
      } else {
        // 方法2：使用 fetch 的 keepalive 选项作为备选
        try {
          fetch('/api/payment/meter/report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            keepalive: true,
          }).catch((err) => {
            console.error('fetch keepalive 上报失败:', err);
          });
          console.log(`🚨 页面离开计费(fetch keepalive): 播放${sessionTime}秒 → 计费${minutes}分钟`);
          return true;
        } catch (err) {
          console.error('fetch keepalive 上报失败:', err);
          return false;
        }
      }
      return null;
    },
    [customerId, currentVideo, sessionTime],
  );

  // 页面刷新/关闭时立即上报计费
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (sessionIdRef.current && sessionTime > 0) {
        const minutes = Math.ceil(sessionTime / 60);

        // 💡 现在可以直接调用专门的上报方法
        reportUnloadSettlement(minutes);

        // 显示确认提示
        event.returnValue = `检测到视频正在播放，关闭页面将按已播放时长计费(${minutes}分钟)。确定要离开吗？`;
        return event.returnValue;
      }
      return null;
    };

    // 额外添加 visibilitychange 事件处理，提供更多上报机会
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && sessionIdRef.current && sessionTime > 0) {
        const minutes = Math.ceil(sessionTime / 60);

        // 检查是否已经结算过，防止重复上报
        if (isSessionSettledRef.current) {
          console.log(`⚠️ 会话已结算，跳过页面隐藏上报: 会话ID ${sessionIdRef.current}`);
          return;
        }

        // 设置已结算标记
        isSessionSettledRef.current = true;

        const originalSessionTime = sessionTime;
        const data = {
          customerId,
          minutes,
          sessionId: sessionIdRef.current,
          metadata: {
            video_file: currentVideo,
            session_type: 'page_hidden_settlement',
            session_duration_seconds: originalSessionTime,
            billed_minutes: minutes,
            actual_video_time: videoPlaybackTimeRef.current,
            billing_method: 'per_minute_ceil',
            settlement_reason: 'page_hidden',
            settlement_note: `页面隐藏时上报，播放 ${originalSessionTime}秒，按 ${minutes}分钟计费`,
          },
        };

        // 使用 sendBeacon 进行后台上报
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(data)], {
            type: 'application/json',
          });
          const success = navigator.sendBeacon('/api/payment/meter/report', blob);
          console.log(
            `📱 页面隐藏计费: ${success ? '成功' : '失败'} - 播放${originalSessionTime}秒 → 计费${minutes}分钟`,
          );
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [customerId, sessionTime, currentVideo, reportUnloadSettlement]);

  return {
    // 播放状态
    isPlaying,
    playbackLimited,
    error,

    // 时间信息
    sessionTime,
    formattedSessionTime: formatTime(sessionTime),
    remainingTime,
    billedMinutes,

    // 控制方法
    startPlayback,
    stopPlayback,
    pausePlayback,
    resumePlayback,
    updatePlaybackTime,
  };
};

export default useVideoPlaybackTracking;
