# GeoPayLog 🌍💸

GeoPayLog is a minimalist, Full-Stack personal finance tracker that automatically tags your manual transaction entries with your physical location. Built for the modern student who forgets *where* they spent their money.

**Tech Stack:**
-   **Mobile:** React Native (Expo)
-   **Backend:** Node.js + Express
-   **Database:** MongoDB Atlas (Cloud)

## Features
-   📱 **Device-Based Auth**: No signup required. Your phone is your identity.
-   📍 **Auto-GeoTagging**: Captures GPS coordinates instantly when you log a spend.
-   🗺️ **Interactive Map**: Visualize your spending habits on a map.
-   🚀 **Real-time**: Transactions are saved instantly to the cloud.

## Setup & Run

### Prerequisites
-   Node.js installed.
-   Google Maps API Key (Optional for internal testing on Android, critical for production).

### Backend
```bash
cd server
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with **Expo Go**.

---
*Created for Final Year Project (3rd Year Undergrad).*
