# Credit Service Demo - Smart Video Streaming Platform

A video streaming demonstration project based on Blocklet Payment system, showcasing how to implement time-based billing for video watching services using Credit system.

## 🎯 Project Overview

This is a full-stack application (React.js + Express.js) with DID Wallet authentication and Credit billing system integration. Users can login with DID wallet, receive free trial time, and purchase additional watching time through the Credit system.

### 🌟 Key Features

- **🎬 Advanced Video Player**
  - Full-screen playback support
  - Progress bar scrubbing
  - Skip forward/backward (±10s, ±30s)
  - Volume control and mute
  - Multiple video file support

- **💳 Smart Billing System**
  - Per-minute billing (rounded up)
  - Real-time balance display
  - Automatic playback time tracking
  - Anti-cheat mechanism (auto-billing on page leave)

- **🎁 New User Benefits**
  - 3 minutes free trial for new users
  - One-click free credit claim
  - Eye-catching welcome interface

- **🔐 User Authentication**
  - DID Wallet integration
  - One-click login/logout
  - User session management

- **🌍 Internationalization**
  - Chinese/English interface switching
  - Complete multi-language support

### 🛠 Tech Stack

- **Frontend**: React.js + Material-UI + Vite
- **Backend**: Express.js + Node.js
- **Authentication**: @arcblock/did-connect
- **Payment**: @blocklet/payment-js ([Documentation](https://www.arcblock.io/docs/arcblock-payment-kit/capabilities-payment-js))
- **Deployment**: Blocklet Platform

### 📊 Billing Rules

1. **New User Package**: First-time login gets 3 minutes free watching time
2. **Per-minute Billing**: Any playback duration is billed per minute (rounded up)
3. **Real-time Tracking**: Real-time display of used time and remaining time during playback
4. **Smart Settlement**: 
   - Immediate billing when stopping playback
   - Auto-billing when leaving page
   - Auto-stop when reaching time limit
5. **Anti-cheat**: Confirmation popup and immediate billing on page refresh/close

## 🎮 Usage Guide

### First Time Use

1. **Access App**: Open the deployed application URL in browser
2. **Login**: Click "Login Now" button and use DID wallet to login
3. **Claim Free Time**: New users can claim 3 minutes free watching time in the welcome interface
4. **Start Watching**: Select a video and click play button to start watching


### Billing Information

- **Real-time Display**: Real-time display of watched time and remaining time during playback
- **Per-minute Billing**: Playing for 1 second will be billed as 1 minute
- **Pause No Billing**: No charges when pausing playback, can resume anytime
- **Auto Settlement**: Automatic billing settlement when stopping playback or leaving page

## 🚀 Quick Start

This project was bootstrapped with [Create Blocklet](https://github.com/blocklet/create-blocklet).

### Prerequisites

1. Install [@blocklet/cli](https://www.npmjs.com/package/@blocklet/cli)
   ```shell
   npm install -g @blocklet/cli
   ```

2. Initialize and start blocklet server
   ```shell
   blocklet server init
   blocklet server start
   ```

### Local Development

1. Go to project directory: `cd credit-service-demo`
2. Install dependencies: `npm install` or `pnpm install`
3. Start development server: `blocklet dev`

### Bundle & Deploy

```shell
# Bundle for production
npm run bundle

# Deploy to local blocklet server
blocklet deploy .blocklet/bundle

# Deploy to remote blocklet server
blocklet deploy .blocklet/bundle --endpoint {server_url} --access-key {key} --access-secret {secret}
```

### Upload to Store

```shell
# Bump version
npm run bump-version

# Connect to store
blocklet connect https://store.blocklet.dev/

# Upload new version
blocklet upload
```

## 📁 File Structure

- **public/** - Static files including demo video files (*.mp4)
- **api/** - Backend API code
  - **libs/** - Payment and logger utilities
  - **routes/** - Payment and user routes
- **src/** - Frontend React application
  - **components/** - React components (CreditBalance, VideoPlayer, Layout)
  - **contexts/** - Context providers (balance-context)
  - **hooks/** - Custom hooks (useVideoPlaybackTracking)
  - **libs/** - Client libraries (api, payment, session)
  - **locales/** - Internationalization files (Chinese/English)
  - **pages/** - Page components (home, profile)

## 🔗 Documentation & Resources

- [Blocklet Payment.js Documentation](https://www.arcblock.io/docs/payment-kit-sdk/en/payment-kit-sdk-core-concepts-credit-billing)
- [Blocklet Specification](https://github.com/blocklet/blocklet-specification/blob/main/docs/meta.md)
- [Blocklet Developer Guide](https://www.arcblock.io/docs/blocklet-developer)
- [Create Blocklet](https://github.com/blocklet/create-blocklet)

## 📄 License

The code is licensed under the Apache 2.0 license found in the [LICENSE](LICENSE) file. 