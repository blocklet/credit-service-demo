import { fromUnitToToken } from '@ocap/util';

import api from './api';

class PaymentApi {
  constructor() {
    this.baseUrl = '/api/payment';
  }

  // ============== Credit 相关 API ==============

  /**
   * 获取用户信用余额
   * @param {string} customerId - 用户ID
   */
  async getCreditBalance(customerId) {
    try {
      const response = await api.get(`${this.baseUrl}/credits/balance/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('获取信用余额失败:', error);
      throw error;
    }
  }

  /**
   * 创建信用额度（新用户奖励）
   * @param {Object} params - 信用额度参数
   */
  async createCreditGrant(params) {
    try {
      const response = await api.post(`${this.baseUrl}/credits/grants`, params);
      return response.data;
    } catch (error) {
      console.error('创建信用额度失败:', error);
      throw error;
    }
  }

  /**
   * 创建充值订单（跳转到支付页面）
   * @param {string} customerId - 用户ID
   * @param {Object} params - 充值参数
   */
  async createCheckout(customerId, params = {}) {
    try {
      const response = await api.post(`${this.baseUrl}/credits/checkout`, {
        customerId,
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error('创建充值订单失败:', error);
      throw error;
    }
  }

  /**
   * 获取信用历史
   * @param {string} customerId - 用户ID
   * @param {Object} options - 查询选项
   */
  async getCreditHistory(customerId, options = {}) {
    try {
      const queryParams = new URLSearchParams(options).toString();
      const url = `${this.baseUrl}/credits/history/${customerId}${queryParams ? `?${queryParams}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('获取信用历史失败:', error);
      throw error;
    }
  }

  // ============== Meter 相关 API ==============

  /**
   * 上报计量事件
   * @param {Object} params - 事件参数
   */
  async reportMeterEvent(params) {
    try {
      const response = await api.post(`${this.baseUrl}/meter/report`, params);
      return response.data;
    } catch (error) {
      console.error('上报计量事件失败:', error);
      throw error;
    }
  }

  // ============== 音乐场景专用方法 ==============

  /**
   * 为新用户创建试看额度
   * @param {string} customerId - 用户ID
   */
  createWelcomeListeningCredits(customerId) {
    return this.createCreditGrant({
      customerId,
      metadata: {
        promotion_code: 'WELCOME_VIDEO',
        granted_by: 'system',
        purpose: 'trial_watching',
      },
    });
  }

  /**
   * 检查用户是否可以播放音乐
   * @param {string} customerId - 用户ID
   */
  async checkPlaybackEligibility(customerId) {
    try {
      const balanceResult = await this.getCreditBalance(customerId);
      if (!balanceResult.success) {
        return {
          canPlay: false,
          availableMinutes: 0,
          reason: '无法获取余额信息',
        };
      }

      // 格式化余额
      const availableMinutes = fromUnitToToken(
        balanceResult.data.balance,
        balanceResult.data.paymentCurrency?.decimal || 0,
      );
      const canPlay = availableMinutes > 0;

      return {
        canPlay,
        availableMinutes,
        reason: canPlay ? null : '余额不足，无法播放音乐',
        balanceData: balanceResult.data,
      };
    } catch (error) {
      return {
        canPlay: false,
        availableMinutes: 0,
        reason: '检查播放资格时发生错误',
        error,
      };
    }
  }

  /**
   * 上报音乐播放时长
   * @param {string} customerId - 用户ID
   * @param {number} durationMinutes - 播放时长（分钟）
   * @param {string} sessionId - 会话ID
   * @param {Object} metadata - 播放元数据
   */
  reportListeningTime(customerId, durationMinutes, sessionId, metadata = {}) {
    let currentSessionId = sessionId;
    if (!sessionId) {
      currentSessionId = `music_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    return this.reportMeterEvent({
      customerId,
      minutes: durationMinutes,
      sessionId: currentSessionId,
      metadata: {
        listening_duration: durationMinutes,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });
  }
}

export default new PaymentApi();
