require('dotenv-flow').config();
const payment = require('@blocklet/payment-js').default;

const packageName = require('../../package.json').name;
const { ensureWebhooks, ensureMeter, ensureCreditPrice } = require('../libs/payment');

payment.environments.setTestMode(String(process.env.PAYMENT_TEST_MODE) === 'true');

(async () => {
  try {
    await ensureWebhooks();
    await ensureMeter();
    await ensureCreditPrice();

    process.exit(0);
  } catch (err) {
    console.error(`${packageName} pre-start error`, err);
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
})();
