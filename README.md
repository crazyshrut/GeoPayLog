# GeoPayLog 🌍💸

> **"Where does my money go?"** — A zero-friction, GPS-first expense tracker for students and young professionals.

GeoPayLog is a full-stack personal finance tracker that automatically tags every transaction with your physical location. Built for people who forget *where* they spent their money. **No login. No signup. Just open and log.**

---

## ✨ What's New in v2

| Feature | v1 | v2 |
|---------|----|----|
| Theme | Light (default) | GitHub Dark Mode 🌙 |
| Tab Bar | Flat 4-tab | Floating pill + centered FAB |
| Categories | ❌ | ✅ Food, Cafe, Travel, Shop, Other |
| Add Flow | Text inputs | Custom numpad + category chips |
| Home | Flat list | Date-grouped with day totals |
| Analytics | City list | Insights dashboard (charts + streaks) |
| Map | Plain pins | Amount-labelled color bubbles + filters |
| Delete | ❌ | ✅ Long-press to delete |
| Profile | ❌ | ✅ Device info screen |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | React Native (Expo SDK 54) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas (Cloud) |
| **Location** | expo-location (GPS + Reverse Geocoding) |
| **Maps** | react-native-maps |

---

## 🎨 Design System

- **Theme**: GitHub Dark Default (`#0d1117` background)
- **Accent**: Deep Teal `#0D9488`
- **Typography**: System font with weight hierarchy (400–800)
- **Cards**: `#161b22` with `#30363d` borders
- **Category Colors**: 🍔 Orange · ☕ Purple · 🚗 Red · 🛍️ Blue · 📦 Gray

---

## 📱 Screens

### Home
- Greeting based on time of day
- Monthly total + transaction count + location count
- Quick stat pills (avg/txn, highest, top category)
- Date-grouped transaction list with day totals
- Category icons on each transaction
- Long-press to delete

### Add (Log Expense)
- Category chip selector (Food, Cafe, Travel, Shop, Other)
- Large currency display with custom numpad
- Auto GPS location with reverse geocoded address
- Teal "Save transaction" button

### Map (Spending Map)
- Dark custom map style matching GitHub theme
- Amount-labelled colored bubble markers
- Time filter chips: Today / Week / Month / All
- Auto-zoom to fit all pins
- Bottom overlay: area total + transaction count

### Insights
- Month/year header with 🔥 streak counter
- Three stat cards: This month / Avg per day / Highest
- 7-day bar chart (today highlighted in teal)
- City breakdown with progress bars

### Profile
- Device-based ID display
- Privacy info
- Version number

---

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/` | Health check |
| `POST` | `/api/log` | Save new transaction (with category) |
| `GET` | `/api/history` | Fetch device transactions |
| `DELETE` | `/api/transaction/:id` | Delete a transaction |

---

## 📦 Data Model

```javascript
{
  deviceId: "uuid-v4",
  amount: Number,
  note: String,
  category: "Food" | "Cafe" | "Travel" | "Shop" | "Other",
  location: { lat: Number, long: Number },
  timestamp: Date
}
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js (v18+)
- Expo Go app on your phone
- MongoDB Atlas account (connection string in `.env`)

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

> **⚠️ Important**: Update the `API_BASE_URL` in `mobile/src/services/api.js` with your computer's local IP address.

---

## 📂 Project Structure

```
GeoPayLog/
├── mobile/
│   ├── App.js                          # Navigation + dark theme
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.js           # Date-grouped transaction list
│   │   │   ├── AddTransactionScreen.js # Category chips + numpad
│   │   │   ├── MapScreen.js            # Dark map + amount bubbles
│   │   │   └── InsightsScreen.js       # Dashboard + bar chart
│   │   ├── services/
│   │   │   └── api.js                  # Axios API layer
│   │   ├── theme/
│   │   │   └── colors.js              # GitHub dark design tokens
│   │   └── utils/
│   │       └── device.js              # UUID device identity
│   ├── app.json                        # Expo config (dark mode)
│   └── package.json
├── server/
│   ├── server.js                       # Express API (v2 + delete)
│   ├── models/
│   │   └── Transaction.js             # Mongoose schema + category
│   ├── .env                           # MongoDB connection
│   └── package.json
├── PRD.md                              # Full Product Requirements
└── README.md                           # This file
```

---

*Built as a Final Year Project — Demonstrating full-stack mobile development with location intelligence.*
