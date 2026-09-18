# 🌾 Farmer Trade — Smart Farm-Gate Sales & Net-Price Discovery Platform

> **Smart India Hackathon (SIH) 2026 Prototype**
> Strengthening market linkages and price discovery for farmers through FPO aggregation, live bidding, and transparent net realization calculation.

---

## 🎯 Problem

Smallholder farmers in India sell produce at below-market prices due to:
- **Opaque pricing** — no visibility into real mandi rates
- **Individual selling** — high per-unit transport & handling costs
- **Middleman dependency** — arhatiya commissions eat into margins
- **No trust layer** — no way to verify buyer reliability

## 💡 Solution — Farmer Trade

Farmer Trade bridges the gap between farmers and buyers through:

| Feature | What It Does |
|---------|-------------|
| **Net Realization Engine** | Calculates true net return after all deductions — lets farmers compare mandi vs direct buyer vs FPO bulk sale |
| **FPO Aggregation** | Groups individual farmer lots into bulk lots for better negotiation power |
| **Live Bidding** | Real-time Socket.io bidding rooms where buyers compete transparently |
| **Multi-Criteria Recommendations** | Scores and ranks sale options based on price, trust, speed, and logistics |
| **Digital Trust Layer** | Buyer reliability scoring, QR traceability, grievance ticketing |
| **Payment Tracking** | Escrow-based payment flow with farmer payout splits |

### Demo Impact Numbers (20q Grade-A Onion, Nashik)

| Sale Option | Gross | Deductions | **Net** |
|-------------|-------|------------|---------|
| Nearby Mandi | ₹1,600/q | ₹20/q | ₹1,580/q |
| Direct Buyer | ₹1,950/q | ₹280/q | ₹1,670/q |
| **Farmer Trade FPO Bulk** ✅ | ₹1,950/q | ₹130/q | **₹1,820/q** |

> **+₹240/quintal advantage → +₹4,800 additional income for 20 quintals**

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express.js | REST API server |
| Turso (libSQL) | Primary SQL database (edge-distributed SQLite) |
| MongoDB (Mongoose) | Bid histories, evidence logs |
| Socket.io | Real-time bidding rooms |
| JWT + OTP | Authentication |
| Razorpay (Sandbox) | Payment simulation |
| QRCode | Digital lot traceability |

### Frontend
| Technology | Purpose |
|-----------|---------|
| HTML5 + Vanilla JS | Current Hackathon Prototype UI |
| CSS3 | Styling & Layout |
| React 18 + TypeScript | UI framework (Upcoming Next Phase) |
| Zustand + Tailwind | State management & styling (Upcoming) |

---

## 📁 Project Structure

```
Farmer Trade/
├── .gitignore
├── README.md
├── Farmer Trade-backend/
│   ├── config/               # Database configs (turso, mongo)
│   ├── controllers/          # API route controllers
│   ├── middleware/           # Auth and role guards
│   ├── models/               # SQL schema and Mongo models
│   ├── routes/               # Express route definitions
│   ├── services/             # Business logic (OTP, JWT, etc.)
│   ├── scripts/
│   │   └── seedDemoData.js   # Demo data seeder
│   ├── local.db              # SQLite DB for hackathon fallback
│   ├── server.js             # Entry point
│   ├── package.json
│   └── .env                  # Secrets (optional for hackathon)
└── Farmer Trade-frontend/
    ├── index.html            # Landing page
    ├── login.html            # OTP Login page
    ├── dashboard.html        # Farmer Dashboard
    ├── buyer-dashboard.html  # Buyer Dashboard
    ├── lots.html             # Market/Lots browsing
    ├── bidding.html          # Live bidding interface
    ├── css/                  # Stylesheets
    ├── js/                   # Vanilla JS logic & API wrappers
    │   ├── api.js            # Centralized backend fetch logic
    │   ├── login.js          # Authentication flow
    │   └── dashboard.js      # Dashboard state logic
    └── assets/               # Images and icons
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** ≥ 18.x ([download](https://nodejs.org/))
- **npm** ≥ 9.x
- **Git** ([download](https://git-scm.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/ssislive/Farmer Trade.git
cd Farmer Trade
```

### 2. Backend Setup

```bash
cd Farmer Trade-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env   # (if .env.example exists)
# OR create .env manually with the variables below
```

### 3. Configure Environment Variables (Optional for Hackathon)

The backend is configured to fall back to a local SQLite database (`local.db`) and a default dummy JWT secret if no `.env` file is present. This ensures the prototype runs out-of-the-box. 

If you want to use cloud databases, create `Farmer Trade-backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Turso Database
TURSO_DATABASE_URL="libsql://your-db-name.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"
```

### 4. Start the Backend (Terminal 1)

```bash
cd Farmer Trade-backend

# Seed Demo Data (Creates local.db and populates it)
node scripts/seedDemoData.js

# Start the server (auto-reload on file changes)
npm run dev
```

Server starts at `http://localhost:5000`

### 5. Start the Frontend Prototype (Terminal 2)

Since the frontend uses `fetch` to talk to the backend, it must be served via a local web server to avoid CORS issues.

```bash
cd Farmer Trade-frontend

# Serve the static files using npx
npx serve .
```

Open the URL provided by `serve` (usually `http://localhost:3000`) in your browser to interact with the prototype.

---

## 📡 API Endpoints

### Auth Module
```
POST   /api/auth/send-otp          → Send OTP to phone
POST   /api/auth/verify-otp        → Verify OTP, get JWT
GET    /api/auth/me                 → Get profile (🔒)
```

### Farmer Module (🔒 FARMER role)
```
POST   /api/farmer/lots             → Create produce listing
GET    /api/farmer/lots/my-lots     → Get all my lots
GET    /api/farmer/summary          → Earnings & lot summary
```

### FPO Aggregation Module
```
GET    /api/fpo/available-lots      → Browse farmer lots (🔒)
POST   /api/fpo/aggregate           → Aggregate into bulk lot (🔒 FPO)
GET    /api/fpo/bulk-lots           → My bulk lots (🔒 FPO)
```

### Market & Recommendation Module
```
GET    /api/market/prices           → Mandi prices by district
GET    /api/market/net-realization  → 3-scenario comparison
GET    /api/recommendations/:bulkId → Ranked sale recommendations (🔒)
```

### Buyer Module (🔒 BUYER role)
```
GET    /api/buyer/lots              → Browse open bulk lots
GET    /api/buyer/transactions      → My deal history
GET    /api/buyer/summary           → Purchase & reliability stats
```

### Real-Time Bidding
```
WS     /socket.io                   → Connect with JWT
  → join_lot_room { bulkLotId, userId }
  → place_bid { bulkLotId, buyerId, bidAmount }
  ← bid_updated (broadcast to room)
  ← deal_accepted (FPO closes deal)
```

### Logistics Module
```
POST   /api/logistics/assign        → Assign transporter (🔒 FPO/TRANSPORTER)
PATCH  /api/logistics/status        → Update delivery status (🔒 TRANSPORTER)
GET    /api/logistics/status/:id    → Check delivery status (🔒)
```

### Payment Module
```
POST   /api/payments/mock-pay       → Initiate mock payment (🔒 BUYER)
POST   /api/payments/hold-escrow    → Hold in escrow (🔒)
POST   /api/payments/release        → Release payment (🔒 FPO)
GET    /api/payments/status/:id     → Payment status (🔒)
```

### QR & Grievance
```
POST   /api/qr/generate/:bulkLotId  → Generate QR code (🔒 FPO)
GET    /api/qr/verify/:bulkLotId    → Verify lot via QR (🔒)
POST   /api/grievance/create        → File grievance (🔒)
GET    /api/grievance/:transactionId → View grievances (🔒)
```

> 🔒 = Requires `Authorization: Bearer <JWT>` header

---


## 🔐 Security Notes

- `.env` is **never committed** (in `.gitignore`)
- JWT tokens expire after 7 days
- Role-based middleware protects all sensitive endpoints
- OTP is auto-deleted after successful verification
- Payment uses Razorpay sandbox (no real money)

---

## 📊 Database Schema (Turso/SQLite)

| Table | Purpose |
|-------|---------|
| `users` | Farmers, FPOs, Buyers, Transporters |
| `farmer_lots` | Individual produce listings |
| `fpo_bulk_lots` | Aggregated bulk lots |
| `fpo_lot_mappings` | Links farmer lots to bulk lots |
| `transactions` | Deals with payment & delivery status |
| `otp_store` | Temporary OTP storage |
| `grievances` | Dispute tickets |

---


## 📄 License

This project is part of the Smart India Hackathon 2026 prototype.

---

<p align="center">
  <b>🌾 Farmer Trade — Bridging Farms to Markets, Transparently</b>
</p>
