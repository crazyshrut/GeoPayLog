# Product Requirements Document (v2)
## GeoPayLog — Location-Based Expense Tracker

---

## Phase 1 — Problem Framing

### Product Vision
GeoPayLog helps users understand their spending patterns through location intelligence, answering the question: **"Where does my money go?"**

### Jobs To Be Done (JTBD)

**Functional JTBD:**
> "When I'm reviewing my month-end finances, I want to know where (physically) I overspent, so I can cut the right habits."

**Emotional JTBD:**
> "I want to feel in control of my money without the guilt of not using a complicated app."

**Social JTBD:**
> "I want to be the kind of person who tracks expenses — but without it being a whole thing."

### Problem Statement
Existing expense trackers require lengthy signup flows, ignore location context entirely, and treat GPS as an afterthought. Users forget where they made purchases, lose motivation due to app complexity, and have no easy way to see spending patterns by geography. GeoPayLog flips this by making location the **primary lens** for financial awareness.

### Constraints
- Student project — limited infrastructure budget (free tier services only)
- No authentication infrastructure — device-based identity via UUID
- Relies on GPS accuracy — indoor accuracy may vary
- Single developer, rapid iteration cycles
- Expo Go development (no native module ejection)

### Out of Scope (v1/v2)
- Bank/UPI integration
- Multi-device sync
- Budget setting and alerts
- Social features
- Recurring transaction detection
- Receipt scanning / OCR

---

## Phase 2 — Customers & Market

### Market Sizing

| Metric | Estimate | Rationale |
|--------|----------|-----------|
| **TAM** | ~500M | Urban smartphone users in India (18–35 age bracket) who are financially aware |
| **SAM** | ~50M | College students + young professionals in Tier 1/2 Indian cities who actively try expense tracking |
| **SOM** | ~500K | Early adopters frustrated with Walnut, Money Manager, or manual spreadsheets |

### User Personas

#### Persona 1: Aryan — The Engineering Student
- **Age**: 21 | **Location**: Pune | **Income**: ₹5,000/month (pocket money)
- **Context**: Lives in a hostel, spends impulsively at cafes and on Swiggy. Uses UPI for everything. Has tried Money Manager twice but abandoned it both times.
- **Pain Point**: "I have no idea where my ₹5,000 disappears every month. I download expense apps, use them for 3 days, then forget."
- **Scenario**: Aryan grabs coffee at Blue Tokai, takes an auto to college, and orders lunch on Swiggy — all before 2 PM. He opens GeoPayLog, taps the + button, enters ₹320 and selects "Food" — done in 6 seconds. At month-end, his map shows 15 pins clustered around Koregaon Park and he realizes 40% of his spending happens at 3 cafes within 500m of each other.
- **Quote from imagined interview**: *"I don't need budget charts. I just need to see that I spent ₹3,000 at cafes in one neighborhood and go 'oh, that's the problem.'"*

#### Persona 2: Priya — The Early-Career Professional
- **Age**: 26 | **Location**: Bangalore | **Income**: ₹60,000/month
- **Context**: Works in tech, recently moved to HSR Layout. Commutes via Uber/Rapido. Orders food frequently. Wants to save but doesn't track consistently.
- **Pain Point**: "I use Walnut but it auto-reads SMS which feels invasive. I want something I control, where I just quickly note what I spent."
- **Scenario**: Priya logs her Uber ride to office (₹180, Travel), her lunch at a restaurant (₹320, Food), and an evening coffee (₹150, Cafe). Her Insights screen shows she's averaging ₹650/day and her top spending city area is Koramangala. She sets a mental target to reduce food spending there.
- **Quote from imagined interview**: *"I like the map view — it makes spending feel real. Seeing pins everywhere in Koramangala makes me think twice before ordering."*

---

## Phase 3 — Competition & Positioning

### Competitive Landscape

| App | Friction to Log | Location Intelligence | Key Weakness |
|-----|----------------|----------------------|--------------|
| **Walnut** | Auto (SMS) | ❌ None | Invasive SMS permissions, shut down features |
| **Money Manager** | Manual (high) | ❌ None | Complex UI, 20+ fields per entry |
| **Spendee** | Medium | ❌ None | Requires signup, freemium walls |
| **Google Maps Timeline** | Auto | ✅ High | Not an expense tracker, no amounts |
| **GeoPayLog** | **Ultra-low** | **✅ GPS-first** | Early stage, no bank integration |

### Positioning Matrix

```
                    HIGH Location Intelligence
                            |
                            |  ★ GeoPayLog
                            |
         Google Maps -------|-------
         Timeline           |
                            |
    LOW Friction ←——————————+——————————→ HIGH Friction
                            |
                            |
              Walnut -------|------- Money Manager
                            |         Spendee
                            |
                    LOW Location Intelligence
```

### Key Differentiators
1. **Zero login** — device-based UUID, no signup screens
2. **GPS-first** — location is the primary lens, not an add-on
3. **10-second logging** — open → tap → amount → save
4. **Visual spending** — map view makes money feel spatially real
5. **Category intelligence** — color-coded spending types

---

## Phase 4 — Qualitative Research (Simulated Interviews)

### Interview 1: Rahul, 22, BBA Student, Mumbai
**Q: How do you currently track expenses?**
A: "I don't, honestly. I tried using Excel once but gave up after a week."

**Q: Have you ever wanted to know where you spent money?**
A: "Yes! Last month I was shocked at my credit card bill. I had no idea ₹4,000 went to food near college."

**Q: What made you stop using your last expense app?**
A: "It asked me to create an account, link my bank, set budgets — too much setup. I just wanted to note down ₹200 for lunch."

---

### Interview 2: Sneha, 24, UX Designer, Hyderabad
**Q: How do you currently track expenses?**
A: "I use Apple Notes. Just write 'Zomato 350' every day. It's ugly but fast."

**Q: Have you ever wanted to know where you spent money?**
A: "That's interesting — I never thought about the 'where' part. But now that you say it, I'd love to see if I spend more in Banjara Hills vs Jubilee Hills."

**Q: What would make you switch from Notes?**
A: "If it was literally as fast as typing in Notes, but also showed me a map. That would be cool."

---

### Interview 3: Vikram, 20, Engineering Student, Delhi
**Q: How do you currently track expenses?**
A: "I use Money Manager. It's decent but I skip entries because it takes too long."

**Q: What takes too long?**
A: "Selecting category, subcategory, payment method, account — I just spent ₹50 on chai, I don't need all that."

**Q: What feature would keep you using an app daily?**
A: "If I could log in under 5 seconds. No extra fields. Just amount and done."

---

### Interview 4: Ananya, 25, MBA Student, Pune
**Q: How do you currently track expenses?**
A: "I use Walnut. It reads my SMS which is convenient but also creepy."

**Q: What concerns you about Walnut?**
A: "Privacy. It reads all my messages. I'd prefer something where I manually log but it's super quick."

**Q: Would location tagging be useful?**
A: "100%. When I travel between Pune and Mumbai, my spending patterns change completely. Seeing that on a map would be powerful."

---

### Interview 5: Karthik, 23, Freelancer, Bangalore
**Q: How do you currently track expenses?**
A: "Google Sheets. I have a template with date, amount, category, notes."

**Q: Have you tried any apps?**
A: "Spendee was nice but the free version limits you. I don't want to pay for basic expense tracking."

**Q: What would the ideal expense app look like?**
A: "Free. No signup. Open it, type the amount, it saves with my location. Show me a map at the end of the month. That's it."

---

### Affinity Map — Clustered Themes

| Theme | Frequency | Key Insight |
|-------|-----------|-------------|
| **Friction kills habits** | 5/5 | Every interviewee abandoned apps due to setup/logging complexity |
| **Location context is missing** | 4/5 | Users want to know WHERE they spend, not just how much |
| **Existing apps feel overwhelming** | 4/5 | Too many fields, categories, accounts, budgets |
| **Privacy concerns with auto-reading** | 3/5 | SMS-based trackers feel invasive |
| **Free tier is essential** | 3/5 | Students won't pay; freemium paywalls cause abandonment |
| **Visual/map view excites users** | 5/5 | Universally positive reaction to map-based spending view |

---

## Phase 5 — Quantitative Analysis (AARRR Funnel)

### Pirate Metrics Funnel (Assumed, Pre-Launch)

| Stage | Metric | Target | Rationale |
|-------|--------|--------|-----------|
| **Acquisition** | App downloads | 1,000 | Via college WhatsApp groups + ProductHunt |
| **Activation** | Log first transaction | 600 (60%) | No signup barrier → high activation |
| **Retention** | Return after Day 7 | 200 (33%) | "10-second logging" reduces drop-off |
| **Revenue** | Upgrade to Pro (future) | 20 (10%) | Unlimited history + city reports |
| **Referral** | Share with a friend | 5 (2.5%) | Map screenshot sharing as growth hook |

### Key Insight
The **Activation → Retention** gap (60% → 33%) is the biggest lever. Users who see the map view and discover location patterns are 2x more likely to return. The map is our retention weapon.

---

## Phase 6 — Metrics & Experimentation

### North Star Metric
> **Weekly Active Loggers** — users who log ≥3 transactions in a 7-day window.

This captures both retention (they came back) and core value delivery (they're actually logging, not just opening the app).

### Supporting Metrics
| Metric | Target | Why |
|--------|--------|-----|
| Time to log | < 10 seconds | Core value prop |
| Day-7 retention | 33% | Habit formation threshold |
| Map tab visits / user / week | ≥ 2 | Indicates geo-insight value |
| Insight screen views | ≥ 1/week | Dashboard engagement |

### A/B Test Proposal

**Hypothesis:** "Showing a map pin animation after saving a transaction increases Day-3 retention by 15% because it reinforces the geo-tagged value."

| Variant | Experience | Measure |
|---------|-----------|---------|
| **A (Control)** | Plain "Success" alert toast | Day-3 retention rate |
| **B (Treatment)** | Animated map pin drop with location name | Day-3 retention rate |

**Success Criterion:** Variant B achieves ≥15% relative lift in Day-3 retention with p < 0.05.

**Sample Size:** ~500 users per variant (1,000 total) to detect 15% effect with 80% power.

---

## Phase 7 & 8 — Strategy, Business Model & Pricing

### Business Model: Freemium + B2B Data

#### Consumer Tier

| Plan | Price | Features |
|------|-------|----------|
| **Free** | ₹0 | 30-day history, 5 categories, map view, basic insights |
| **Pro** | ₹99/month | Unlimited history, city trend reports, CSV export, custom categories |

#### B2B Angle (Future Pivot)
Sell **anonymized, aggregated** location-spend heatmaps to retailers:
- *"Which neighborhoods are high-spend for cafes in Bangalore?"*
- *"What's the average food spend near Koramangala on weekends vs weekdays?"*

This is a genuinely defensible data product — no competitor has GPS-tagged expense data at this granularity.

### Kill Criteria
- If 90-day retention falls below 15% → re-evaluate core loop
- If MAU doesn't grow past 1,000 after 3 months of active marketing → kill paid tier
- If < 5% of Pro trials convert → pricing is wrong

---

## Phase 9 — MVP & Validation

### Core Hypothesis
> "We believe that college students will log expenses more consistently when each entry is automatically tagged with location, because the passive nature of GPS reduces cognitive load."

### Validation Metric
Do users who view the map tab log **2x more transactions** than those who don't?

### MVP Feature Set (Built ✅)
- [x] Zero-login device-based auth
- [x] 10-second transaction logging with custom numpad
- [x] Automatic GPS tagging
- [x] Category classification (Food, Cafe, Travel, Shop, Other)
- [x] Date-grouped transaction history with delete
- [x] Interactive dark map with amount bubbles
- [x] Insights dashboard with 7-day chart + city breakdown
- [x] Pull-to-refresh across all screens

---

## Phase 10 — Prioritization (RICE Scoring)

| Feature | Reach | Impact (1-3) | Confidence | Effort (weeks) | RICE Score |
|---------|-------|-------------|------------|----------------|------------|
| GPS auto-tag | 1000 | 3 | 80% | 2 | **1200** |
| Category chips | 800 | 2 | 90% | 1 | **1440** |
| Custom numpad | 800 | 2 | 70% | 2 | **560** |
| City analytics | 800 | 2 | 70% | 3 | **373** |
| Map view | 600 | 2 | 60% | 4 | **180** |
| Spending alerts | 400 | 3 | 50% | 5 | **120** |
| Export to CSV | 200 | 1 | 90% | 1 | **180** |
| Dark theme | 1000 | 1 | 95% | 1 | **950** |
| Delete transactions | 600 | 2 | 90% | 0.5 | **2160** |
| 7-day bar chart | 500 | 2 | 80% | 1.5 | **533** |

### Prioritization Memo
We built **GPS-first** because it scored highest on impact and directly delivers the core value proposition. Category chips followed because they were high-reach and low-effort. Alerts and CSV export were deferred — they're utility features that don't drive retention as strongly as the visual/map experience.

---

## Phase 11 — Roadmap & OKRs

### Now / Next / Later Roadmap

**🟢 NOW (v2 — Built)**
- Core logging with custom numpad
- GPS auto-tag + reverse geocoding
- Dark theme (GitHub-inspired)
- Floating pill nav with centered FAB
- Category classification (5 types)
- Date-grouped home with day totals
- Insights dashboard (stat cards + bar chart + city breakdown)
- Enhanced map (amount bubbles + time filters)
- Transaction deletion
- Profile screen

**🟡 NEXT (v3 — Planned)**
- Spending alerts by city threshold
- Weekly digest push notification
- Custom category tagging
- Note/payee field with autocomplete
- Offline-first with sync queue

**🔴 LATER (v4+ — Vision)**
- Social comparison ("your friends in Koramangala spend 30% more on food")
- B2B heatmap API
- Receipt photo attachment
- Multi-currency support
- Widget for home screen quick-log

### OKR — Q1

**Objective:** Make expense logging a weekly habit for students.

| Key Result | Target | Status |
|-----------|--------|--------|
| KR1: % of users logging ≥5 txns/week | 40% by Month 2 | 🔲 |
| KR2: Day-30 retention | 25% | 🔲 |
| KR3: Map tab engagement (views/user/week) | ≥ 2 | 🔲 |
| KR4: Avg time-to-log | < 8 seconds | 🔲 |

---

## Phase 12 — PRD & UX

### Navigation Structure
Bottom Tab Navigation (5 tabs, floating pill style):
1. **Home** 🏠 — Date-grouped transaction feed
2. **Map** 🗺️ — Geo-spending visualization
3. **+ (FAB)** — Quick expense entry
4. **Insights** 📊 — Analytics dashboard
5. **Profile** 👤 — Device info & settings

### User Stories with Acceptance Criteria

#### US-1: Frictionless Entry
*As a user, I want to log an expense in under 10 seconds without creating an account.*

**Acceptance Criteria:**
- App opens directly to usable interface (no login screen)
- Device generates unique UUID on first launch
- Custom numpad allows amount entry in 2-3 taps
- Category chips are visible and tappable on the add screen
- **Error State**: If GPS fails → show "Location unavailable" with manual retry button
- **Error State**: If network is down → queue transaction and show "Will sync when online"

#### US-2: Automatic Location Tagging
*As a user, I want my expenses automatically tagged with location so I don't have to remember where I spent.*

**Acceptance Criteria:**
- GPS coordinates captured when transaction is saved
- Reverse geocoding resolves coordinates to human-readable address
- Location bar shows resolved address below numpad
- **Error State**: If permission denied → show alert explaining why location matters, allow saving without location
- **Error State**: If GPS timeout → use last known location with "(approximate)" label

#### US-3: Category Classification
*As a user, I want to categorize my expenses to see what I spend on, not just where.*

**Acceptance Criteria:**
- 5 default categories with emoji icons and distinct colors
- Category chip selector on add screen
- Category icon and color shown in transaction list
- Top category shown in home header stat pills
- **Error State**: If no category selected → default to "Other"

#### US-4: Transaction History
*As a user, I want to see my transactions grouped by day with daily totals.*

**Acceptance Criteria:**
- Transactions grouped by date (Today, Yesterday, or date string)
- Each group shows sum total for that day
- Each item shows: category icon, note, location, amount
- Long-press on any transaction triggers delete confirmation
- Pull-to-refresh syncs latest data
- **Error State**: If API fails → show cached data with "Last updated X minutes ago"

#### US-5: Map Visualization
*As a user, I want to see where I've spent money on a dark-themed map.*

**Acceptance Criteria:**
- Dark custom map style matching GitHub dark theme
- Amount-labelled bubble markers colored by category
- Time filter chips: Today / Week / Month / All
- Tapping marker shows callout with note, amount, date
- Auto-zoom fits all visible pins
- Bottom overlay shows area total and transaction count
- **Error State**: If no transactions in selected filter → show "No spending in this period"
- **Error State**: If map fails to load → show error card with retry button

#### US-6: Insights Dashboard
*As a user, I want a dashboard summarizing my spending patterns for the current month.*

**Acceptance Criteria:**
- Header shows month name with streak counter (🔥 X-day streak)
- Three stat cards: This month total / Avg per day / Highest single
- 7-day bar chart with today highlighted in accent color
- City breakdown with progress bars (proportional to max)
- Pull-to-refresh recalculates all metrics
- **Error State**: If 0 transactions → show helpful empty state, not blank screen

### UX Flow Diagram

```
╔══════════════════════════════════╗
║     App Launch (Cold Start)      ║
╚═══════════════╤══════════════════╝
                │
    ┌───────────▼───────────┐
    │  Check Device ID      │
    │  (AsyncStorage)       │
    └───────────┬───────────┘
                │
    ┌─ Has ID? ─┤── No ID? ──┐
    │           │            │
    │   ┌───────▼──────┐     │
    │   │ Generate UUID │     │
    │   │ Save to Store │     │
    │   └───────┬──────┘     │
    │           │            │
    └─────┬─────┘            │
          │                  │
          ▼                  │
    ╔═══════════╗            │
    ║   HOME    ║◄───────────┘
    ║  Screen   ║
    ╚═════╤═════╝
          │
    ┌─────┴────────────────────────┐
    │    Bottom Tab Navigation     │
    ├──────┬──────┬──────┬────────┤
    │ Home │ Map  │  +   │Insights│
    │      │      │(FAB) │        │
    └──────┴──────┴──┬───┴────────┘
                     │
               ┌─────▼─────┐
               │  ADD FLOW  │
               │            │
               │ 1. Choose  │
               │   Category │
               │            │
               │ 2. Enter   │
               │   Amount   │
               │  (numpad)  │
               │            │
               │ 3. GPS Tag │
               │  (auto)    │
               │            │
               │ 4. Save    │
               └─────┬──────┘
                     │
               ┌─────▼─────┐
               │ Success →  │
               │ Navigate   │
               │ to Home    │
               └────────────┘
```

---

## Phase 13 — Delivery & Release

### Sprint Plan

#### Sprint 1: Core Logging + GPS (Completed ✅)
- Device-based auth (UUID)
- POST /api/log with GPS coordinates
- GET /api/history with device filtering
- Basic transaction list UI
- Location permission handling
- MongoDB Atlas integration
- In-memory fallback mode

#### Sprint 2: v2 Upgrade (Completed ✅)
- GitHub dark theme across all screens
- Floating pill tab bar with centered FAB
- Category model + 5-category chips
- Custom numpad for amount entry
- Date-grouped home with day totals + stat pills
- Dark map with amount bubble markers + time filters
- Insights dashboard (stat cards + bar chart + city progress bars)
- DELETE /api/transaction/:id endpoint
- Long-press delete on transactions
- Profile screen
- Updated PRD with all PM phases

### Monitoring & Observability
| Signal | Tool | Threshold |
|--------|------|-----------|
| App crashes | Expo built-in telemetry | < 1% crash rate |
| API p95 latency | Server console logs | < 500ms |
| MongoDB connection | Health check endpoint | 99.5% uptime |
| GPS acquisition time | Client-side logging | < 5 seconds |

---

## Phase 14 — GTM & Growth

### Launch Channels

| Channel | Action | Expected Reach |
|---------|--------|---------------|
| College WhatsApp groups | Share app link + 30-sec demo video | 500 downloads |
| r/IndiaInvestments | Post "I built a GPS expense tracker" | 200 downloads |
| r/reactnative | Technical showcase post | 150 downloads |
| ProductHunt | Launch with screenshots + story | 150 downloads |
| Instagram Reels | "Where do you spend the most?" hook | Viral potential |

### Activation Hook
> **"See your first week of spending on a map"** — users share their spending map as a screenshot.

The dark theme + teal pins make for highly shareable visual content. The map screenshot IS the marketing material.

### Growth Loop

```
User logs expenses for 1 week
          │
          ▼
Map fills up with colored pins
          │
          ▼
User screenshots their "spending map"
          │
          ▼
Shares on Instagram/WhatsApp: "Look where I spend 💸🗺️"
          │
          ▼
Friends see it → "What app is that?"
          │
          ▼
Download GeoPayLog → Log their own
          │
          ▼
Generate their own spending map → Share again
          │
          ▼
    [VIRAL LOOP REPEATS]
```

**Estimated Viral Coefficient:** k = 0.3 (each user brings 0.3 new users through sharing)

### Retention Strategy

| Trigger | Mechanism | Expected Impact |
|---------|-----------|----------------|
| Weekly digest | "Here's where you spent this week 🗺️" push notification with map thumbnail | +15% W2 retention |
| Streak counter | "🔥 7-day streak!" badge on Insights | +10% daily logging |
| Monthly summary | "You spent ₹X across Y locations in [Month]" | +12% monthly re-engagement |
| Milestone badges | "100th transaction logged!" | Emotional hook |

---

## Success Metrics Summary

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to log transaction | < 10 seconds | Client-side timer |
| App launch to usable state | < 2 seconds | Cold start measurement |
| API response time | < 500ms | Server p95 |
| Day-7 retention | 33% | Cohort analysis |
| Day-30 retention | 25% | Cohort analysis |
| Weekly Active Loggers | 40% of MAU | ≥3 txns in 7-day window |
| Map tab engagement | ≥2 views/user/week | Analytics |

---

## Technical Architecture

### Stack
- **Mobile**: React Native (Expo SDK 54)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (Cloud)
- **Location**: expo-location (GPS + Reverse Geocoding)
- **Maps**: react-native-maps (Custom dark style)
- **State**: React hooks + AsyncStorage
- **HTTP**: Axios with interceptors

### API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Health check |
| POST | `/api/log` | Save transaction (with category) |
| GET | `/api/history` | Fetch device transactions |
| DELETE | `/api/transaction/:id` | Delete transaction (ownership verified) |

### Data Model
```javascript
{
  deviceId: "uuid-v4",           // Device identity
  amount: Number,                // Spending amount in ₹
  note: String,                  // Description
  category: String,              // Food | Cafe | Travel | Shop | Other
  location: {
    lat: Number,                 // GPS latitude
    long: Number,                // GPS longitude
    address: String              // Optional resolved address
  },
  timestamp: Date                // Auto-generated
}
```

---

## Launch Readiness Checklist

- [x] All 5 screens functional (Home, Map, Add, Insights, Profile)
- [x] GPS tagging works on physical device
- [x] Category classification working end-to-end
- [x] Dark theme applied consistently
- [x] Insights dashboard displays correctly
- [x] Transaction deletion works
- [x] Works with network interruptions (offline memory mode)
- [x] Code pushed to GitHub
- [ ] Demo video recorded
- [ ] ProductHunt listing prepared

---

*Document Version: 2.0 | Last Updated: April 2026*
*Author: Shruti Verma | Final Year Project*
