# Product Requirements Document
**GeoPayLog - Location-Based Expense Tracker**

---

## 1. Overview

### Product Vision
GeoPayLog helps users understand their spending patterns through location intelligence, answering the question: "Where does my money go?"

### Target User
College students and young professionals who want quick expense tracking without the overhead of traditional finance apps.

### Goals
- Demonstrate full-stack mobile development capabilities
- Showcase location-based data analytics
- Provide frictionless user experience (no authentication barriers)

---

## 2. Problem & Opportunity

### User Pain Points
- Existing expense trackers require lengthy signup flows
- Users forget where they made purchases
- No easy way to see spending patterns by location

### Our Solution
A zero-friction mobile app that automatically tags expenses with GPS coordinates and provides city-level spending analytics.

---

## 3. Core Features

### 3.1 Frictionless Entry
**User Story**: *As a user, I want to log an expense in under 10 seconds without creating an account.*

**Acceptance Criteria**:
- App opens directly to usable interface (no login screen)
- Device generates unique ID on first launch
- Transaction form has only 2 required fields: Amount & Note

### 3.2 Automatic Location Tagging
**User Story**: *As a user, I want my expenses automatically tagged with location so I don't have to remember where I spent.*

**Acceptance Criteria**:
- GPS coordinates captured when transaction is saved
- Works in background (no user action required)
- Graceful fallback if location permission denied

### 3.3 Transaction History
**User Story**: *As a user, I want to see all my past transactions in one place.*

**Acceptance Criteria**:
- Chronological list (newest first)
- Shows: Amount, Note, Date, Location
- Pull-to-refresh to sync latest data

### 3.4 Map Visualization
**User Story**: *As a user, I want to see where I've spent money on a map.*

**Acceptance Criteria**:
- Interactive map with transaction pins
- Tapping pin shows transaction details
- Auto-zoom to fit all pins

### 3.5 City-Level Analytics
**User Story**: *As a user, I want to know how much I've spent in each city.*

**Acceptance Criteria**:
- Reverse geocoding converts GPS to city names
- Aggregated view: City → Total Amount + Transaction Count
- Sorted by spending (highest first)
- Pull-to-refresh to recalculate

---

## 4. User Experience

### Navigation Structure
Bottom Tab Navigation (4 screens):
1. **Home** - Transaction list
2. **Add** - Quick entry form
3. **Map** - Spending locations
4. **Cities** - Analytics dashboard

### Key User Flow
```
Open App → [No Login] → Home Screen
         ↓
    Tap "Add" Tab
         ↓
    Enter: ₹500, "Coffee"
         ↓
    Tap "Save" → [Auto GPS Tag]
         ↓
    View in: Home List | Map Pin | City Total
```

---

## 5. Technical Architecture

### Stack
- **Mobile**: React Native (Expo)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Location**: expo-location (GPS + Reverse Geocoding)

### API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/log` | Save new transaction |
| GET | `/api/history` | Fetch device transactions |

### Data Model
```javascript
{
  deviceId: "uuid-v4",
  amount: Number,
  note: String,
  location: { lat: Number, long: Number },
  timestamp: Date
}
```

---

## 6. Success Metrics

### User Experience
- Time to log transaction: **< 10 seconds**
- App launch to usable state: **< 2 seconds**

### Technical
- API response time: **< 500ms**
- Offline resilience: In-memory fallback if DB unavailable

### Feature Adoption
- City Summary usage: Track tab navigation analytics
- Map engagement: Monitor pin interactions

---

## 7. Launch Readiness

### Definition of Done
- All 4 screens functional
- GPS tagging works on physical device
- City analytics displays correctly
- Works with network interruptions (offline mode)
- Code pushed to GitHub
- Demo video recorded
