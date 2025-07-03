# Credit Service Demo - 支付系统 API

这是一个基于 `@blocklet/payment-js` 的完整信用系统和计量器实现，提供了灵活的按使用付费和信用额度管理功能。

## 🏗️ 架构设计

### 核心模块

```
api/
├── libs/
│   ├── payment.js           # 支付服务基础配置
│   ├── constant.js         # 常量和配置
│   └── modules/
│       ├── meter.js        # 计量器模块
│       └── credit.js       # 信用系统模块
├── routes/
│   └── payment.js          # 支付相关 API 路由
└── demo/
    └── payment-demo.js     # 完整演示脚本
```

### 功能特性

- **计量器管理**: 创建和管理各种类型的使用量计量器
- **信用系统**: 灵活的信用额度购买、赠送和消费
- **订阅管理**: 基于计量器的订阅产品创建
- **支付链接**: 自动生成支付链接，支持灵活数量调整
- **批量操作**: 支持批量事件上报和信用消费
- **完整追踪**: 详细的使用历史和交易记录

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install @blocklet/payment-js
```

### 2. 环境配置

在 `.env` 文件中设置必要的环境变量：

```env
# Blocklet 相关配置
BLOCKLET_DEV_APP_DID=your_app_did
BLOCKLET_APP_ID=your_app_id
BLOCKLET_SERVER_URL=http://localhost:3030

# 环境模式（development/production）
NODE_ENV=development
```

### 3. 运行演示

```bash
# 运行完整演示脚本
node api/demo/payment-demo.js

# 启动 API 服务
npm run start
```

## 📋 API 文档

### Meter 相关 API

#### 创建计量器
```http
POST /api/payment/meters
Content-Type: application/json

{
  "name": "API Calls",
  "eventName": "api_calls",
  "aggregationMethod": "sum",
  "unit": "Calls",
  "description": "Track API usage",
  "componentDid": "optional_component_did"
}
```

#### 获取计量器
```http
GET /api/payment/meters/{eventName}
```

#### 创建计量订阅产品
```http
POST /api/payment/meters/subscription
Content-Type: application/json

{
  "meter": {}, // 计量器对象
  "productName": "API Call Service",
  "productDescription": "Pay-per-use API service",
  "unitAmount": "0.01",
  "currencyId": "pc_9l5sh8bcjbLU",
  "interval": "month_1"
}
```

#### 上报计量事件
```http
POST /api/payment/meters/events
Content-Type: application/json

{
  "eventName": "api_calls",
  "customerId": "cus_customer_123",
  "value": "50",
  "subscriptionId": "optional_sub_id",
  "metadata": {
    "session_id": "session_001",
    "api_endpoint": "/api/data"
  }
}
```

#### 批量上报计量事件
```http
POST /api/payment/meters/events/batch
Content-Type: application/json

{
  "events": [
    {
      "eventName": "api_calls",
      "customerId": "cus_customer_123",
      "value": "30",
      "metadata": {}
    }
  ]
}
```

### Credit 相关 API

#### 创建信用产品
```http
POST /api/payment/credits/products
Content-Type: application/json

{
  "meter": {}, // 计量器对象
  "productName": "API Call Credits",
  "productDescription": "Purchase API call credits",
  "prices": [] // 可选的自定义价格配置
}
```

#### 创建支付链接
```http
POST /api/payment/credits/payment-links
Content-Type: application/json

{
  "priceId": "price_abc123",
  "linkName": "Buy API Credits",
  "quantity": 100,
  "adjustableQuantity": {
    "minimum": 10,
    "maximum": 10000
  }
}
```

#### 创建信用额度
```http
POST /api/payment/credits/grants
Content-Type: application/json

{
  "customerId": "cus_customer_123",
  "amount": 500,
  "currencyId": "pc_9l5sh8bcjbLU",
  "category": "promotional",
  "name": "Welcome Bonus",
  "metadata": {
    "promotion_code": "WELCOME500"
  }
}
```

#### 查询信用余额
```http
GET /api/payment/credits/balance/{customerId}
```

#### 消费信用额度
```http
POST /api/payment/credits/consume
Content-Type: application/json

{
  "customerId": "cus_customer_123",
  "eventName": "api_calls",
  "amount": 25,
  "sessionContext": {
    "sessionId": "session_001",
    "metadata": {
      "api_endpoint": "/api/analysis"
    }
  }
}
```

#### 查询信用历史
```http
GET /api/payment/credits/history/{customerId}?limit=10
```

### 一键设置 API

#### 创建完整支付系统
```http
POST /api/payment/setup/complete
Content-Type: application/json

{
  "meterConfig": {
    "name": "API Calls",
    "eventName": "api_calls",
    "aggregationMethod": "sum",
    "unit": "Calls",
    "description": "Track API usage"
  },
  "creditProductConfig": {
    "productName": "API Credits",
    "productDescription": "Purchase API credits",
    "createSubscription": true,
    "subscriptionConfig": {
      "productName": "API Subscription",
      "unitAmount": "0.01"
    }
  },
  "paymentLinkConfigs": [
    {
      "linkName": "Flexible Purchase",
      "quantity": 100,
      "adjustableQuantity": {
        "minimum": 10,
        "maximum": 10000
      }
    }
  ]
}
```

## 💡 使用示例

### 基本使用流程

```javascript
const meterModule = require('./libs/modules/meter');
const creditModule = require('./libs/modules/credit');

// 1. 创建计量器
const meterResult = await meterModule.createMeter({
  name: 'API Calls',
  eventName: 'api_calls',
  aggregationMethod: 'sum',
  unit: 'Calls',
  description: 'Track API usage'
});

const meter = meterResult.data;

// 2. 创建信用产品
const creditResult = await creditModule.createCreditProduct({
  meter,
  productName: 'API Call Credits',
  productDescription: 'Purchase credits for API usage'
});

// 3. 为用户赠送初始信用额度
await creditModule.createCreditGrant({
  customerId: 'cus_customer_123',
  amount: 100,
  currencyId: meter.currency_id,
  category: 'promotional',
  name: 'Welcome Bonus'
});

// 4. 用户使用 API 时消费信用
await creditModule.consumeCredit({
  customerId: 'cus_customer_123',
  eventName: 'api_calls',
  amount: 10,
  sessionContext: {
    sessionId: 'session_001'
  }
});

// 5. 查询用户余额
const balance = await creditModule.getCreditBalance('cus_customer_123');
console.log('Current balance:', balance.data);
```

### 前端集成示例

```javascript
// 查询用户余额
async function getUserBalance(customerId) {
  const response = await fetch(`/api/payment/credits/balance/${customerId}`);
  const result = await response.json();
  return result.data;
}

// 消费信用额度
async function consumeCredits(customerId, amount, metadata = {}) {
  const response = await fetch('/api/payment/credits/consume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId,
      eventName: 'api_calls',
      amount,
      sessionContext: {
        sessionId: generateSessionId(),
        metadata
      }
    })
  });
  
  return await response.json();
}

// 创建支付链接（管理员功能）
async function createPaymentLink(priceId, quantity) {
  const response = await fetch('/api/payment/credits/payment-links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      linkName: 'Purchase API Credits',
      quantity,
      adjustableQuantity: {
        minimum: 10,
        maximum: 10000
      }
    })
  });
  
  return await response.json();
}
```

## 🔧 配置选项

### 货币配置

在 `api/libs/constant.js` 中配置支持的货币：

```javascript
DEFAULT_CURRENCIES: {
  ABT: 'pc_9l5sh8bcjbLU',
  USDC: 'pc_aW2zy2y8yoi7',
  ETH: 'pc_ByBkyhRQmedm',
  BTC: 'pc_Dp4lY5ejkALH',
}
```

### 信用系统配置

```javascript
CREDIT_CONFIG: {
  DEFAULT_PRIORITY: 50,
  DEFAULT_VALID_DURATION: {
    VALUE: 0,    // 0 表示永不过期
    UNIT: 'days',
  },
}
```

### 计量事件配置

```javascript
METER_EVENTS: {
  API_CALLS: 'api_calls',
  DATA_USAGE: 'data_usage',
  COMPUTE_TIME: 'compute_time',
}
```

## 🧪 测试和演示

### 运行完整演示

```bash
node api/demo/payment-demo.js
```

演示脚本将展示：
1. 创建计量器和订阅产品
2. 创建信用产品和支付链接
3. 信用额度管理（赠送、查询）
4. 模拟 API 使用和信用消费
5. 批量操作和历史查询
6. 一键设置功能

### 使用 curl 测试 API

```bash
# 创建计量器
curl -X POST http://localhost:3030/api/payment/meters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test API Calls",
    "eventName": "test_api_calls",
    "aggregationMethod": "sum",
    "unit": "Calls",
    "description": "Test meter for API calls"
  }'

# 查询计量器
curl http://localhost:3030/api/payment/meters/test_api_calls

# 消费信用额度
curl -X POST http://localhost:3030/api/payment/credits/consume \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "test_customer",
    "eventName": "test_api_calls",
    "amount": 10,
    "sessionContext": {
      "sessionId": "test_session"
    }
  }'
```

## 🔐 安全考虑

1. **身份验证**: 所有 API 端点都使用 `middlewares.session()` 进行身份验证
2. **参数验证**: 每个 API 端点都包含必要的参数验证
3. **错误处理**: 完善的错误处理和日志记录
4. **余额检查**: 消费信用前自动检查余额是否充足

## 📊 监控和日志

系统提供详细的日志记录：

- 计量器创建和使用
- 信用额度变化
- 支付链接生成
- API 调用统计
- 错误和异常情况

## 🔄 扩展功能

### 添加新的计量事件类型

```javascript
// 在 constant.js 中添加新事件类型
METER_EVENTS: {
  API_CALLS: 'api_calls',
  DATA_USAGE: 'data_usage',
  COMPUTE_TIME: 'compute_time',
  FILE_UPLOADS: 'file_uploads', // 新增
}
```

### 自定义信用产品价格

```javascript
const customPrices = [
  {
    type: 'one_time',
    unit_amount: '5',
    currency_id: DEFAULT_CURRENCIES.ABT,
    lookup_key: 'small_pack',
    nickname: 'Small Pack (500 credits)',
    metadata: {
      credit_config: {
        credit_amount: '500',
      }
    }
  }
];

await creditModule.createCreditProduct({
  meter,
  productName: 'Custom Credit Product',
  prices: customPrices
});
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目使用 MIT 许可证。详情请见 [LICENSE](../LICENSE) 文件。

## 📞 支持

如有问题或建议，请：
1. 查看 [API 文档](#-api-文档)
2. 运行 [演示脚本](#-测试和演示)
3. 提交 Issue 或 Pull Request

---

*本文档最后更新于 2025 年 7 月* 