# Credit Service Demo  
**Smart video billing powered by Credits**

This project demonstrates how to implement per‑minute billing for video watching using Blocklet Payment's Credit system. Users can sign in, claim a free trial, and recharge when balance is low—delivering end‑to‑end metering, settlement, and a clear user experience.

---

## ✨ Why this demo?

- **Per‑minute billing, out of the box**  
  Credit‑based metering and settlement with minute‑level precision.

- **Real‑time balance and playback control**  
  Show remaining time during playback; auto‑stop on insufficient balance with recharge guidance.

- **New‑user friendly**  
  One‑click to claim a 3‑minute free trial on first login.

- **DID Wallet sign‑in and session**  
  Integrated with @arcblock/did-connect for seamless login/logout and session management.

- **Ready‑to‑run Blocklet app**  
  One command to develop/deploy locally, and bundle for Blocklet Store.

---

## 🧩 Core capabilities

- 🎬 **Advanced video player**: fullscreen, seeking, skip ±10s/±30s, volume, multiple files
- 💳 **Credit billing**: per‑minute (ceil), real‑time balance, checkout recharge
- 🎁 **Free trial credits**: grant 3 minutes via a simple backend API
- 🔐 **Authentication**: DID wallet login with built‑in session management
- 🌍 **Internationalization**: Chinese/English UI
- 🛡 **Anti‑cheat**: auto‑settlement on page leave/refresh

---

## 🚀 Get started in minutes

**Step 1: Launch the app**  
Install and start the app on your local Blocklet Server.

**Step 2: Sign in**  
Click “Login Now” and authorize with your DID wallet.

**Step 3: Claim free credits (optional)**  
New users can claim a 3‑minute free trial on the welcome screen.

**Step 4: Watch and get billed**  
Pick a video to play. The system bills per minute and shows remaining time; recharge when needed.

---

## 🔌 Key integrations

- Blocklet Payment (@blocklet/payment-js): Credit billing, pricing, and checkout
- DID Connect (@arcblock/did-connect): authentication and session
- React + Vite + Material‑UI: frontend app and components
- Express.js: backend API and billing routes

> 🎯 See `README.md` for a more complete feature list and usage guide.

---

## 🧑‍💻 Developer toolkit

- [📘 Payment Kit Documentation](https://www.arcblock.io/docs/arcblock-payment-kit/en/payment-intro)
- [🧭 Blocklet Developer Guide](https://www.arcblock.io/docs/blocklet-developer)

---

**Credit Service Demo helps you quickly spin up a credit‑based multimedia service—launch now and validate faster.**