import paymentModule from '@blocklet/payment-js';
import { component } from '@blocklet/sdk';

import logger from './logger.js';

export const payment = paymentModule.default || paymentModule;

/**
 * 确保 webhook 端点存在
 */
export const ensureWebhooks = async () => {
  const { list: endpoints } = await payment.webhookEndpoints.list();
  const data = {
    url: component.getUrl('/api/payment/webhook'),
    enabled_events: [
      'customer.credit.insufficient',
      'customer.subscription.updated',
      'checkout.session.completed',
      'customer.subscription.renewed',
    ],
  };

  if (endpoints.length > 0) {
    const webhook = await payment.webhookEndpoints.update(endpoints[0]?.id, data);
    logger.info('webhooks updated', webhook);
    return webhook;
  }

  const webhook = await payment.webhookEndpoints.create(data);
  logger.info('webhooks created', webhook);
  return null;
};

export const ensureMeter = async () => {
  try {
    const meter = await payment.meters.retrieve('video_watching');
    return meter;
  } catch (error) {
    const meter = await payment.meters.create({
      name: 'video_watching',
      description: '视频服务计量器',
      event_name: 'video_watching',
      aggregation_method: 'sum',
      unit: 'Minutes',
    });
    return meter;
  }
};

export const VIDEO_WATCHING_PRICE_KEY = 'video_watching_per_minute';

export const ensureCreditPrice = async () => {
  try {
    const price = await payment.prices.retrieve(VIDEO_WATCHING_PRICE_KEY);
    return price;
  } catch {
    try {
      const paymentCurrencies = await payment.paymentCurrencies.list();
      if (paymentCurrencies.length === 0) {
        logger.error('No payment currencies found');
        return null;
      }
      const meter = await ensureMeter();
      if (!meter) {
        logger.error('No meter found');
        return null;
      }
      await payment.products.create({
        name: 'Video Watching Credit',
        description: 'Video Watching Charge Credit, we can ...',
        type: 'credit',
        prices: [
          {
            type: 'one_time',
            unit_amount: '0.01',
            currency_id: paymentCurrencies[0].id,
            currency_options: paymentCurrencies.map((currency) => ({
              currency_id: currency.id,
              unit_amount: '0.01',
            })),
            lookup_key: VIDEO_WATCHING_PRICE_KEY,
            nickname: 'Per Unit Credit For Video Watching',
            metadata: {
              credit_config: {
                priority: 50,
                valid_duration_value: 0,
                valid_duration_unit: 'days',
                currency_id: meter.currency_id,
                credit_amount: '10',
              },
              meter_id: meter.id,
            },
          },
        ],
      });
      const price = await payment.prices.retrieve(VIDEO_WATCHING_PRICE_KEY);
      return price;
    } catch (error) {
      logger.error('failed to ensure credit price', { error });
      return null;
    }
  }
};

export const ensureCreditCheckoutSession = async () => {
  try {
    const price = await ensureCreditPrice();
    if (!price) {
      logger.error('no price found');
      throw new Error('no price found');
    }
    const checkoutSession = await payment.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_id: price.id,
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 100,
          },
        },
      ],
      success_url: component.getUrl('/home'),
      cancel_url: component.getUrl('/home'),
    });
    return checkoutSession;
  } catch (error) {
    logger.error('failed to ensure credit checkout session', { error });
    throw error;
  }
};

/**
 * 创建当前用户信息
 */
export const ensureCustomer = async (userDid) => {
  try {
    const customer = await payment.customers.retrieve(userDid, {
      create: true,
    });

    logger.info('found existing customer', { customerId: userDid, customer });
    return customer;
  } catch (error) {
    logger.error('failed to ensure customer', { userDid, error });
    throw error;
  }
};
