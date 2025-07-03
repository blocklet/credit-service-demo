/* eslint-disable no-nested-ternary */
import { useLocaleContext } from '@arcblock/ux/lib/Locale/context';
import {
  CheckCircle,
  ErrorOutline,
  FastForward,
  FastRewind,
  Forward10,
  Fullscreen,
  FullscreenExit,
  Pause,
  PlayArrow,
  Replay10,
  Stop,
  Timer,
  VideoFile,
  VolumeOff,
  VolumeUp,
  Warning,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Slider,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { useBalance } from '../contexts/balance-context';
import useVideoPlaybackTracking from '../hooks/use-video-playback-tracking';

function VideoPlayer() {
  const theme = useTheme();
  const { t } = useLocaleContext();
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState('video_01.mp4');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  // 新增状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 可用视频列表
  const availableVideos = [
    { file: 'video_01.mp4', title: `${t('videoPlayer.demoVideo')} 1`, size: '27MB' },
    { file: 'video_02.mp4', title: `${t('videoPlayer.demoVideo')} 2`, size: '23MB' },
    { file: 'video_03.mp4', title: `${t('videoPlayer.demoVideo')} 3`, size: '16MB' },
  ];

  const currentVideo = availableVideos.find((v) => v.file === selectedVideo) || availableVideos[0];

  // 从 BalanceContext 获取余额信息
  const { availableMinutes } = useBalance();

  // 计算播放资格（基于可用分钟数）
  const canPlay = availableMinutes > 0;

  const {
    // 播放状态
    isPlaying,
    playbackLimited,
    error,

    // 时间信息
    sessionTime,
    formattedSessionTime,
    remainingTime,

    // 控制方法
    startPlayback,
    stopPlayback,
    pausePlayback,
    resumePlayback,
    updatePlaybackTime,
  } = useVideoPlaybackTracking();

  // 处理视频元数据加载
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      videoRef.current.volume = volume;
    }
  };

  // 处理视频时间更新
  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setVideoCurrentTime(videoRef.current.currentTime);
      // 通知 tracking hook 更新播放时间
      updatePlaybackTime(videoRef.current.currentTime);
    }
  };

  // 处理播放按钮点击
  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      await pausePlayback();
    } else if (sessionTime === 0) {
      // 开始新的播放会话
      const result = await startPlayback(selectedVideo);
      if (result.success) {
        videoRef.current.play();
      } else {
        console.error('播放失败:', result.reason);
      }
    } else {
      // 恢复播放
      const result = await resumePlayback();
      if (result.success) {
        videoRef.current.play();
      } else {
        console.error('恢复播放失败:', result.reason);
      }
    }
  };

  // 处理停止按钮点击
  const handleStop = async () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setVideoCurrentTime(0);
    }
    await stopPlayback();
  };

  // 处理视频选择变化
  const handleVideoChange = (event) => {
    const newVideo = event.target.value;

    // 如果正在播放，先停止
    if (isPlaying) {
      handleStop();
    }

    setSelectedVideo(newVideo);
    setVideoCurrentTime(0);

    // 重置视频播放位置
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // 全屏功能
  const handleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!isFullscreen) {
      // 进入全屏
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else if (videoContainerRef.current.webkitRequestFullscreen) {
        videoContainerRef.current.webkitRequestFullscreen();
      } else if (videoContainerRef.current.mozRequestFullScreen) {
        videoContainerRef.current.mozRequestFullScreen();
      } else if (videoContainerRef.current.msRequestFullscreen) {
        videoContainerRef.current.msRequestFullscreen();
      }
    } else {
      // 退出全屏
      // eslint-disable-next-line no-lonely-if
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 音量控制
  const handleVolumeChange = (event, newValue) => {
    const volumeValue = newValue / 100;
    setVolume(volumeValue);
    if (videoRef.current) {
      videoRef.current.volume = volumeValue;
    }
    if (volumeValue === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // 进度条控制
  const handleProgressChange = (event, newValue) => {
    if (videoRef.current && videoDuration > 0) {
      const newTime = (newValue / 100) * videoDuration;
      videoRef.current.currentTime = newTime;
      setVideoCurrentTime(newTime);
    }
  };

  const handleProgressMouseDown = () => {
    setIsDragging(true);
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  // 快进快退功能
  const handleSkip = (seconds) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(videoDuration, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setVideoCurrentTime(newTime);
    }
  };

  // 监听播放限制，自动暂停视频
  useEffect(() => {
    if (playbackLimited && videoRef.current) {
      videoRef.current.pause();
    }
  }, [playbackLimited]);

  // 获取播放状态颜色
  const getStatusColor = () => {
    if (error) return 'error.main';
    if (playbackLimited) return 'warning.main';
    if (isPlaying) return 'success.main';
    if (canPlay) return 'primary.main';
    return 'text.secondary';
  };

  // 获取播放状态文本
  const getStatusText = () => {
    if (error) return error;
    if (playbackLimited) return t('videoPlayer.status.limitReached');
    if (isPlaying) return t('videoPlayer.status.playing');
    if (sessionTime > 0) return t('videoPlayer.status.paused');
    if (canPlay) return t('videoPlayer.status.ready');
    return t('videoPlayer.status.cannotPlay');
  };

  // 获取播放状态图标
  const getStatusIcon = () => {
    if (error) return <ErrorOutline color="error" />;
    if (playbackLimited) return <Warning color="warning" />;
    if (isPlaying) return <VideoFile color="info" />;
    if (canPlay) return <CheckCircle color="primary" />;
    return <ErrorOutline color="error" />;
  };

  // 格式化时间显示
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度条值
  const progressValue = videoDuration > 0 ? (videoCurrentTime / videoDuration) * 100 : 0;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={3}>
          {/* 视频选择 */}
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              {t('videoPlayer.title')}
            </Typography>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <Select value={selectedVideo} onChange={handleVideoChange} disabled={isPlaying}>
                {availableVideos.map((video) => (
                  <MenuItem key={video.file} value={video.file}>
                    {video.title} ({video.size})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 视频播放器容器 */}
          <Box
            ref={videoContainerRef}
            sx={{
              position: 'relative',
              backgroundColor: theme.palette.grey[900],
              borderRadius: isFullscreen ? 0 : '8px',
              overflow: 'hidden',
            }}>
            <video
              ref={videoRef}
              style={{
                width: '100%',
                maxHeight: isFullscreen ? '100vh' : '400px',
                display: 'block',
                backgroundColor: theme.palette.background.paper,
              }}
              src={`/${selectedVideo}`}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleStop}
              controls={false} // 禁用默认控制栏
              preload="metadata">
              <track kind="captions" srcLang="zh" label="中文字幕" default />
            </video>

            {/* 自定义控制栏 */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                p: 2,
                color: 'white',
              }}>
              {/* 进度条 */}
              <Box sx={{ mb: 1 }}>
                <Slider
                  value={progressValue}
                  onChange={handleProgressChange}
                  onMouseDown={handleProgressMouseDown}
                  onMouseUp={handleProgressMouseUp}
                  sx={{
                    color: theme.palette.primary.main,
                    '& .MuiSlider-thumb': {
                      display: isDragging ? 'block' : 'none',
                    },
                    '&:hover .MuiSlider-thumb': {
                      display: 'block',
                    },
                  }}
                />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption">{formatTime(videoCurrentTime)}</Typography>
                  <Typography variant="caption">{formatTime(videoDuration)}</Typography>
                </Box>
              </Box>

              {/* 控制按钮 */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                {/* 左侧：播放控制 */}
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    onClick={handlePlayPause}
                    disabled={!canPlay && sessionTime === 0}
                    sx={{ color: 'white' }}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>

                  <IconButton onClick={handleStop} disabled={sessionTime === 0} sx={{ color: 'white' }}>
                    <Stop />
                  </IconButton>

                  <Tooltip title="后退10秒">
                    <IconButton onClick={() => handleSkip(-10)} sx={{ color: 'white' }}>
                      <Replay10 />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="前进10秒">
                    <IconButton onClick={() => handleSkip(10)} sx={{ color: 'white' }}>
                      <Forward10 />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="后退30秒">
                    <IconButton onClick={() => handleSkip(-30)} sx={{ color: 'white' }}>
                      <FastRewind />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="前进30秒">
                    <IconButton onClick={() => handleSkip(30)} sx={{ color: 'white' }}>
                      <FastForward />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* 右侧：音量和全屏 */}
                <Box display="flex" alignItems="center" gap={1}>
                  {/* 音量控制 */}
                  <IconButton onClick={handleMuteToggle} sx={{ color: 'white' }}>
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>

                  <Box sx={{ width: 100, mx: 1 }}>
                    <Slider
                      value={isMuted ? 0 : volume * 100}
                      onChange={handleVolumeChange}
                      sx={{
                        color: 'white',
                        '& .MuiSlider-thumb': {
                          width: 12,
                          height: 12,
                        },
                      }}
                    />
                  </Box>

                  {/* 全屏按钮 */}
                  <Tooltip title={isFullscreen ? '退出全屏' : '全屏播放'}>
                    <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
                      {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* 视频信息 */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentVideo.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('videoPlayer.duration')}: {formatTime(videoDuration)} • {t('videoPlayer.size')}: {currentVideo.size}
            </Typography>
            {videoDuration > 0 && (
              <Typography variant="caption" color="text.secondary">
                {t('videoPlayer.current')}: {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
              </Typography>
            )}
          </Box>

          {/* 播放状态 */}
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              {getStatusIcon()}
              <Typography variant="body2" sx={{ ml: 1 }} color={getStatusColor()}>
                {getStatusText()}
              </Typography>
            </Box>
          </Box>

          {/* 错误提示 */}
          {error && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small">
                  {t('videoPlayer.retry')}
                </Button>
              }>
              {error}
            </Alert>
          )}

          {/* 播放限制提示 */}
          {playbackLimited && <Alert severity="warning">{t('videoPlayer.limitReached')}</Alert>}

          {/* 时长信息 */}
          <Stack spacing={2}>
            {/* 播放时长 */}
            <Box>
              <Box display="flex" alignItems="center" justify="space-between" mb={1}>
                <Box display="flex" alignItems="center">
                  <Timer sx={{ mr: 1, fontSize: '1rem' }} />
                  <Typography variant="body2">
                    {t('videoPlayer.currentWatch')}: {formattedSessionTime}
                  </Typography>
                </Box>
                {availableMinutes > 0 && (
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {t('videoPlayer.remaining')}: {remainingTime.formatted}
                  </Typography>
                )}
              </Box>

              {/* 播放进度条 */}
              {availableMinutes > 0 && (
                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(remainingTime.percentage, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: (() => {
                          if (remainingTime.percentage > 80) return theme.palette.error.main;
                          if (remainingTime.percentage > 60) return theme.palette.warning.main;
                          return theme.palette.success.main;
                        })(),
                      },
                    }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      0:00
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(remainingTime.percentage)}% {t('videoPlayer.used')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(availableMinutes)}:00
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* 可用余额提示 */}
            {availableMinutes > 0 && (
              <Alert severity="info" sx={{ py: 1 }}>
                <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={{
                    __html: t('videoPlayer.availableTime', {
                      minutes: Math.round(availableMinutes * 100) / 100,
                    }),
                  }}
                />
              </Alert>
            )}
          </Stack>

          {/* 播放控制 */}
          <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
            <IconButton
              onClick={handlePlayPause}
              disabled={!canPlay && sessionTime === 0}
              color="primary"
              size="large"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
                '&:disabled': {
                  bgcolor: theme.palette.grey[300],
                  color: theme.palette.grey[500],
                },
              }}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            <Tooltip title={t('videoPlayer.controls.endPlay')} placement="top" arrow>
              <IconButton onClick={handleStop} disabled={sessionTime === 0} color="secondary" size="large">
                <Stop />
              </IconButton>
            </Tooltip>
          </Box>

          {/* 播放控制说明 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {(() => {
                if (!canPlay && sessionTime === 0) return t('videoPlayer.controls.insufficientBalance');
                if (isPlaying) return t('videoPlayer.controls.clickToPause');
                if (sessionTime > 0) return t('videoPlayer.controls.clickToContinue');
                return t('videoPlayer.controls.clickToStart');
              })()}
            </Typography>
          </Box>

          {/* 计费规则说明 */}
          <Alert severity="info" sx={{ py: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('videoPlayer.billing.title')}
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 0.5 } }}>
              <Typography
                component="li"
                variant="caption"
                dangerouslySetInnerHTML={{ __html: t('videoPlayer.billing.pauseRule') }}
              />
              <Typography
                component="li"
                variant="caption"
                dangerouslySetInnerHTML={{ __html: t('videoPlayer.billing.stopRule') }}
              />
              <Typography
                component="li"
                variant="caption"
                dangerouslySetInnerHTML={{ __html: t('videoPlayer.billing.pageCloseRule') }}
              />
              <Typography
                component="li"
                variant="caption"
                dangerouslySetInnerHTML={{ __html: t('videoPlayer.billing.limitRule') }}
              />
              <Typography
                component="li"
                variant="caption"
                dangerouslySetInnerHTML={{ __html: t('videoPlayer.billing.standardRule') }}
              />
            </Box>
          </Alert>

          {/* 播放统计 */}
          {sessionTime > 0 && (
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('videoPlayer.stats.title')}
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                <Typography variant="caption">
                  {t('videoPlayer.stats.watchTime')}: {formattedSessionTime}
                </Typography>
                <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                  {t('videoPlayer.stats.billedTime')}: {Math.ceil(sessionTime / 60)} {t('videoPlayer.stats.minutes')}
                </Typography>
                <Typography variant="caption">
                  {t('videoPlayer.stats.remainingTime')}: {Math.max(0, Math.floor(remainingTime.seconds / 60))}分
                  {Math.max(0, remainingTime.seconds % 60)}秒
                </Typography>
                <Typography variant="caption">
                  {t('videoPlayer.stats.playbackStatus')}:{' '}
                  {isPlaying ? t('videoPlayer.stats.playing') : t('videoPlayer.stats.paused')}
                </Typography>
              </Box>

              {/* 计费提醒 */}
              <Alert severity={isPlaying ? 'warning' : 'info'} sx={{ mt: 1, py: 0.5 }}>
                <Typography variant="caption">
                  {isPlaying
                    ? t('videoPlayer.stats.playingWarning', {
                        remaining: `${Math.max(0, Math.floor(remainingTime.seconds / 60))}分${Math.max(0, remainingTime.seconds % 60)}秒`,
                        billed: Math.ceil(sessionTime / 60),
                      })
                    : t('videoPlayer.stats.pausedInfo', {
                        billed: Math.ceil(sessionTime / 60),
                      })}
                </Typography>
              </Alert>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default VideoPlayer;
