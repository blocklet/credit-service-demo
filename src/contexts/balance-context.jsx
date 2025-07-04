import { fromUnitToToken } from '@ocap/util';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import paymentApi from '../libs/payment';
import { useSessionContext } from '../libs/session';

const BalanceContext = createContext();

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

// eslint-disable-next-line react/prop-types
export function BalanceProvider({ children = null }) {
  const { session } = useSessionContext();
  const customerId = session?.user?.did || 'demo_user';

  // 余额状态
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // 格式化余额（用于业务逻辑判断）
  const availableMinutes = balance ? fromUnitToToken(balance.balance, balance.paymentCurrency?.decimal || 0) : 0;

  // 获取余额信息
  const fetchBalance = useCallback(async () => {
    if (!customerId || customerId === 'demo_user') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await paymentApi.getCreditBalance(customerId);

      if (result.success) {
        const balanceData = result.data;
        setBalance(balanceData);

        // 检查是否为新用户
        setIsNewUser(balanceData.isNewUser || false);
      } else {
        setError(result.error || '获取余额失败');
        setIsNewUser(true); // 如果获取失败，假设是新用户
      }
    } catch (err) {
      console.error('获取余额失败:', err);
      setError('网络错误，请稍后重试');
      setIsNewUser(true);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // 为新用户创建试听奖励
  const grantWelcomeBonus = useCallback(async () => {
    try {
      const result = await paymentApi.createWelcomeListeningCredits(customerId);

      if (result.success) {
        setIsNewUser(false);
        await fetchBalance(); // 重新获取余额
        return { success: true };
      }
      setError(result.error || '创建试听奖励失败');
      return { success: false, error: result.error || '创建试听奖励失败' };
    } catch (err) {
      console.error('创建试听奖励失败:', err);
      const errorMsg = '创建试听奖励时发生错误';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [customerId, fetchBalance]);

  // 创建充值订单
  const createCheckout = useCallback(
    async (params = {}) => {
      try {
        const result = await paymentApi.createCheckout(customerId, params);

        if (result.success && result.data?.url) {
          // 跳转到支付页面
          const url = new URL(result.data.url);
          url.host = window.location.host;
          window.open(url.toString(), '_blank');
          return { success: true, url: url.toString() };
        }
        const errorMsg = result.error || '创建充值订单失败';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } catch (err) {
        console.error('创建充值订单失败:', err);
        const errorMsg = '创建充值订单时发生错误';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [customerId],
  );

  // 检查播放资格
  const checkPlaybackEligibility = useCallback(() => {
    const canPlay = availableMinutes > 0;
    return {
      canPlay,
      availableMinutes,
      reason: canPlay ? null : '余额不足，无法播放视频',
      balanceData: balance,
    };
  }, [availableMinutes, balance]);

  // 刷新余额（供外部调用）
  const refreshBalance = useCallback(() => {
    return fetchBalance();
  }, [fetchBalance]);

  // 格式化余额显示
  const formatBalance = useCallback(
    (balanceData = balance) => {
      if (!balanceData) return '0 Minutes';
      const formattedValue = fromUnitToToken(balanceData.balance, balanceData.paymentCurrency?.decimal);
      return `${formattedValue} ${balanceData.paymentCurrency?.symbol || 'Minutes'}`;
    },
    [balance],
  );

  // 获取余额状态颜色
  const getBalanceColor = useCallback(() => {
    if (availableMinutes === 0) return 'error';
    if (availableMinutes < 1) return 'warning';
    return 'success';
  }, [availableMinutes]);

  // 初始化时获取余额
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    // 状态
    balance,
    loading,
    error,
    isNewUser,
    availableMinutes,

    // 方法
    fetchBalance,
    refreshBalance,
    grantWelcomeBonus,
    createCheckout,
    checkPlaybackEligibility,
    formatBalance,
    getBalanceColor,

    // 辅助方法
    setError,
  };

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
}
