# Credit Service Demo - API Architecture Documentation

This is a video billing system backend API based on `@blocklet/payment-js`.

## 🏗️ Actual Project Architecture

### File Structure

```
api/
├── functions/
│   └── app.js              # Express app configuration and route registration
├── libs/
│   ├── payment.js          # Payment service configuration and helper functions
│   └── logger.js           # Logging utilities
├── routes/
│   ├── payment.js          # Payment related route implementations
│   └── user.js             # User related route implementations
├── hooks/
│   └── pre-start.js        # Pre-start hooks
├── index.js                # Application entry point
└── dev.js                  # Development server
```

## 📋 Actual API Endpoints

Based on code implementation, the system provides the following API endpoints:

### Payment Related APIs (`/api/payment`)

#### 1. Claim Trial Credits
```http
POST /api/payment/credits/grants
```
- Requires session authentication
- Request parameters: `{ "customerId": "string" }`
- Creates 3 minutes of trial credits

#### 2. Report Watching Duration
```http
POST /api/payment/meter/report
```
- Requires session authentication
- Request parameters: `{ "customerId": "string", "minutes": number, "sessionId": "string", "metadata": {} }`
- Reports video watching duration for billing

#### 3. Query Credit Balance
```http
GET /api/payment/credits/balance/:customerId
```
- Requires session authentication
- Returns user's current credit balance and new user status

#### 4. Create Payment Session
```http
POST /api/payment/credits/checkout
```
- Requires session authentication
- Creates a payment session for purchasing credit

#### 5. Webhook Handler
```http
POST /api/payment/webhook
```
- Handles webhook events from payment system

### User Related APIs (`/api`)

#### Get User Information
```http
GET /api/user
```
- Requires session authentication
- Returns current logged-in user information

#### Test Interface
```http
GET /api/data
```
- Returns test data

## 🔧 Core Components

### Helper Functions Provided by payment.js

- `ensureMeter()` - Ensures `video_watching` meter exists
- `ensureCustomer(userDid)` - Ensures customer exists
- `ensureCreditPrice()` - Ensures credit product price exists
- `ensureCreditCheckoutSession()` - Creates payment session
- `ensureWebhooks()` - Ensures webhook endpoints exist

### Meter Configuration

Auto-created meter configuration:
```javascript
{
  name: 'video_watching',
  description: '视频服务计量器',
  event_name: 'video_watching',
  aggregation_method: 'sum',
  unit: 'Minutes'
}
```

## 🚀 Startup Methods

According to project configuration, the API service starts via:

```bash
# Development environment
npm run dev

# Production environment  
npm start
```

Application entry point is `api/index.js`, port is read from environment variable `BLOCKLET_PORT`, defaults to 3030.

## 🔐 Authentication Mechanism

All payment-related API endpoints use `middlewares.session()` for session authentication.

