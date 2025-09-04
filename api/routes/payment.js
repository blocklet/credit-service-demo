import { middlewares } from '@blocklet/sdk';
import { BN } from '@ocap/util';
import { Router } from 'express';

import logger from '../libs/logger.js';
import { ensureCreditCheckoutSession, ensureCustomer, ensureMeter, payment } from '../libs/payment.js';

const router = Router();

/**
 * 核心功能 1：领取试听额度 - 创建 creditGrant
 */
router.post('/credits/grants', middlewares.session(), async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        error: 'customerId is required',
        message: '用户ID不能为空',
      });
    }

    // 确保客户存在
    const customer = await ensureCustomer(customerId);

    const meter = await ensureMeter();

    // 创建信用额度
    const creditGrant = await payment.creditGrants.create({
      customer_id: customer.id,
      amount: '3',
      currency_id: meter.currency_id,
      applicability_config: {
        scope: {
          price_type: 'metered',
        },
      },
      category: 'promotional',
      name: 'New User Welcome',
      metadata: {
        granted_at: new Date().toISOString(),
        service_type: 'video_watching',
        granted_by: 'system',
      },
    });

    logger.info('created credit grant', {
      customerId,
      amount: 3,
      grantId: creditGrant.id,
    });

    return res.json({
      success: true,
      data: creditGrant,
      message: '成功领取 3 分钟试听额度',
    });
  } catch (error) {
    logger.error('credit grant failed', {
      customerId: req.body.customerId,
      error,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
      message: '领取试听额度失败',
    });
  }
});

/**
 * 核心功能 2：播放音乐，上报消耗量
 */
router.post('/meter/report', middlewares.session(), async (req, res) => {
  try {
    // 简化处理，统一使用 JSON 格式
    const { customerId, minutes, sessionId, metadata = {} } = req.body;

    if (!customerId || !minutes || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'customerId, minutes, sessionId 都是必填字段',
      });
    }

    // 确保客户存在
    await ensureCustomer(customerId);

    // 上报视频播放时长
    const meterEvent = await payment.meterEvents.create({
      event_name: 'video_watching', // 保持与 meter 名称一致
      timestamp: Math.floor(Date.now() / 1000),
      payload: {
        customer_id: customerId,
        value: String(minutes),
      },
      identifier: `${customerId}_${sessionId}_${Date.now()}`,
      metadata,
    });

    logger.info('settled watching session', {
      customerId,
      billedMinutes: Number(minutes),
      sessionId,
      eventId: meterEvent.id,
      metadata,
    });

    return res.json({
      success: true,
      data: {
        event_id: meterEvent.id,
        identifier: meterEvent.identifier,
        timestamp: meterEvent.timestamp,
        minutes: Number(minutes),
      },
      message: '观看时长上报成功',
    });
  } catch (error) {
    logger.error('meter report failed', {
      customerId: req.body.customerId,
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
      message: '观看时长上报失败',
    });
  }
});

/**
 * 辅助功能：查询用户 credit 余额
 */
router.get('/credits/balance/:customerId', middlewares.session(), async (req, res) => {
  try {
    const { customerId } = req.params;

    // 确保客户存在
    const customer = await ensureCustomer(customerId);

    const meter = await ensureMeter();

    const creditBalance = await payment.creditGrants.summary({
      customer_id: customerId,
    });

    const pendingCredit = await payment.meterEvents.pendingAmount({
      customer_id: customerId,
    });

    logger.info('retrieved credit balance', {
      customerId,
      amount: creditBalance.amount,
      currency: creditBalance.currency_id,
    });

    const paymentCurrency = meter?.paymentCurrency;
    // 当前Credit 余额
    let balance = new BN(creditBalance?.[meter.currency_id]?.remainingAmount || 0);
    // 未结算 Credit
    const pending = new BN(pendingCredit?.[meter.currency_id] || 0);
    if (pending.gt(balance)) {
      balance = balance.sub(pending);
    }

    const { count } = await payment.creditGrants.list({
      customer_id: customer.id,
    });

    res.json({
      success: true,
      data: {
        balance: balance.toString(),
        paymentCurrency,
        isNewUser: count === 0,
      },
      message: '信用余额查询成功',
    });
  } catch (error) {
    logger.error('credit balance get failed', {
      customerId: req.params.customerId,
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: error.message,
      message: '信用余额查询失败',
    });
  }
});

router.post('/credits/checkout', middlewares.session(), async (req, res) => {
  try {
    const checkoutSession = await ensureCreditCheckoutSession();
    res.json({
      success: true,
      data: checkoutSession,
      message: 'checkout session created',
    });
  } catch (error) {
    logger.error('checkout session creation failed', { error });
  }
});

const handleWebhook = (req, res) => {
  try {
    const { body } = req;
    const { type } = body;

    logger.info('received payment-kit webhook', {
      eventId: body.id,
      objectId: body.data.object.id,
      eventType: type,
    });

    if (type === 'customer.credit.insufficient') {
      logger.info('customer credit insufficient', { body });
      return;
    }
    res.status(200).json({ message: 'success' });
  } catch (error) {
    logger.error('handle webhook error', { error, body: JSON.stringify(req.body, null, 2) });
    res.status(500).json({ message: `handle webhook error: ${error.message}` });
  }
};
router.post('/webhook', handleWebhook);
export default {
  init(app) {
    app.use('/api/payment', router);
  },
};
