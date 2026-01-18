# Project Structure

```
digital-business-card/
│
├── frontend/                          # Next.js Frontend Application
│   ├── app/                          # Next.js App Router
│   │   ├── card/
│   │   │   └── [cardId]/
│   │   │       └── page.tsx          # Public card view page
│   │   ├── admin/
│   │   │   └── page.tsx              # Admin panel page
│   │   ├── globals.css               # Global styles with glassmorphism
│   │   ├── layout.tsx                # Root layout with background
│   │   └── page.tsx                  # Home page (redirects to admin)
│   │
│   ├── components/                   # React Components
│   │   ├── CardView.tsx              # Main card display component
│   │   ├── ShareModal.tsx            # WhatsApp share modal
│   │   ├── QRModal.tsx               # QR code modal
│   │   ├── NFCButton.tsx             # NFC write button
│   │   ├── LoadingSpinner.tsx        # Loading component
│   │   └── AdminDashboard.tsx        # Admin dashboard component
│   │
│   ├── lib/                          # Utilities & Configuration
│   │   ├── firebase.ts               # Firebase client config
│   │   ├── api.ts                    # Axios API client with interceptors
│   │   └── utils.ts                  # Helper functions (NFC, contacts, etc.)
│   │
│   ├── public/                       # Static Assets
│   │   ├── manifest.json             # PWA manifest
│   │   ├── favicon.ico               # Favicon
│   │   ├── icon-192x192.png          # PWA icon (192x192)
│   │   └── icon-512x512.png          # PWA icon (512x512)
│   │
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Git ignore rules
│   ├── next.config.js                # Next.js configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── package.json                  # Frontend dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
├── backend/                          # Node.js Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js           # Firebase Admin SDK config
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT authentication middleware
│   │   │
│   │   └── routes/
│   │       ├── auth.js               # Authentication routes (login, refresh)
│   │       ├── admin.js              # Admin routes (card management)
│   │       └── analytics.js          # Analytics tracking routes
│   │
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Git ignore rules
│   ├── server.js                     # Main Express server
│   └── package.json                  # Backend dependencies
│
├── docs/                             # Documentation
│   ├── FIREBASE_SETUP.md             # Firebase setup guide
│   ├── DEPLOYMENT.md                 # Deployment guide (Vercel + Render)
│   └── NFC_GUIDE.md                  # NFC usage instructions
│
└── README.md                         # Project overview & quick start
```

## File Descriptions

### Frontend

#### App Router (`app/`)
- **`card/[cardId]/page.tsx`** - Dynamic route for public card view. Fetches card data from Firestore and tracks analytics.
- **`admin/page.tsx`** - Admin login and dashboard. Protected route with Firebase authentication.
- **`layout.tsx`** - Root layout with animated gradient background and global styles.
- **`globals.css`** - Custom CSS with glassmorphism effects, animations, and iOS-style design.

#### Components (`components/`)
- **`CardView.tsx`** - Main card component matching the reference design. Includes profile, contact details, and action buttons.
- **`ShareModal.tsx`** - iOS-style bottom sheet for WhatsApp sharing and native Web Share API.
- **`QRModal.tsx`** - Glass modal for displaying and downloading QR codes.
- **`NFCButton.tsx`** - NFC write functionality with loading states and error handling.
- **`AdminDashboard.tsx`** - Complete admin interface for managing cards and viewing analytics.

#### Libraries (`lib/`)
- **`firebase.ts`** - Firebase client initialization (Auth, Firestore, Analytics).
- **`api.ts`** - Axios instance with JWT token refresh logic and error handling.
- **`utils.ts`** - Helper functions for device detection, contacts API, NFC, sharing, validation.

### Backend

#### Configuration (`src/config/`)
- **`firebase.js`** - Firebase Admin SDK initialization with service account credentials.

#### Middleware (`src/middleware/`)
- **`auth.js`** - JWT verification and role-based access control middleware.

#### Routes (`src/routes/`)
- **`auth.js`** - Login endpoint (Firebase ID token → JWT) and token refresh.
- **`admin.js`** - Protected routes for card management and analytics (role-based).
- **`analytics.js`** - Public endpoint for tracking card visits.

#### Server (`server.js`)
- Express app with CORS, Helmet, rate limiting, and error handling.

### Documentation (`docs/`)
- **`FIREBASE_SETUP.md`** - Step-by-step Firebase project setup with security rules.
- **`DEPLOYMENT.md`** - Production deployment to Vercel (frontend) and Render/Railway (backend).
- **`NFC_GUIDE.md`** - Complete NFC usage guide for Android and iOS.

## Key Features by File

### Public Card Features
- **CardView.tsx** - Premium glassmorphism UI, profile display, contact buttons
- **ShareModal.tsx** - WhatsApp sharing, native share API
- **QRModal.tsx** - QR code generation and download
- **NFCButton.tsx** - NFC tag writing (Web NFC API)
- **utils.ts** - Web Contacts API, VCF fallback, device detection

### Admin Panel Features
- **AdminDashboard.tsx** - Card editing, toggle controls, analytics dashboard
- **admin/page.tsx** - Firebase authentication, JWT token management
- **admin.js** (backend) - Role-based access (ADMIN, EDITOR, VIEWER)

### Backend API
- **auth.js** - JWT-based authentication with refresh tokens
- **admin.js** - Protected card management endpoints
- **analytics.js** - Public analytics tracking
- **auth.js** (middleware) - Token verification and role checking

### Security
- **firebase.js** (backend) - Secure Firebase Admin SDK initialization
- **auth.js** (middleware) - JWT verification and role-based access
- **server.js** - CORS, Helmet, rate limiting
- **Firestore rules** - Database-level security (see FIREBASE_SETUP.md)

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, Tailwind CSS
- **Animations:** Framer Motion
- **State:** React Hooks
- **API Client:** Axios
- **Database:** Firebase Firestore (client SDK)
- **Auth:** Firebase Authentication
- **PWA:** manifest.json, service worker ready

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** Firebase Firestore (Admin SDK)
- **Auth:** JWT (jsonwebtoken)
- **Security:** Helmet, CORS, express-rate-limit
- **Logging:** Morgan

### Database (Firebase Firestore)
- **Collections:**
  - `users` - User accounts with roles
  - `cards` - Business card data
  - `analytics` - Visit tracking

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_APP_URL
```

### Backend (`.env`)
```
PORT
NODE_ENV
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
JWT_SECRET
JWT_REFRESH_SECRET
FRONTEND_URL
```

## API Endpoints

### Public
- `POST /api/analytics` - Track card visit

### Authentication
- `POST /api/auth/login` - Login with Firebase ID token
- `POST /api/auth/refresh` - Refresh access token

### Admin (Protected)
- `GET /api/admin/verify` - Verify JWT token
- `GET /api/admin/cards` - List all cards (ADMIN)
- `PUT /api/admin/cards/:cardId` - Update card (ADMIN, EDITOR)
- `GET /api/admin/analytics/:cardId` - Get card analytics (ADMIN, VIEWER, EDITOR)

## User Roles

- **ADMIN** - Full access (create, read, update, delete cards + analytics)
- **EDITOR** - Edit cards only
- **VIEWER** - View analytics only

## Design System

### Colors
- **Primary Gradient:** Pink (#ec4899) → Purple (#8b5cf6) → Blue (#3b82f6)
- **Glass Background:** `rgba(255, 255, 255, 0.1)`
- **Glass Border:** `rgba(255, 255, 255, 0.2)`

### Effects
- **Glassmorphism:** `backdrop-filter: blur(20px)`
- **Glow:** `box-shadow: 0 0 30px rgba(139, 92, 246, 0.4)`
- **Animations:** Framer Motion spring animations

### Typography
- **Font:** SF Pro Display (Apple-like)
- **Weights:** Regular (400), Medium (500), Semibold (600), Bold (700)

## Development Workflow

1. **Setup:** Follow FIREBASE_SETUP.md
2. **Development:**
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd frontend && npm run dev`
3. **Testing:** Test on mobile devices for NFC and responsive design
4. **Deployment:** Follow DEPLOYMENT.md

## Production Checklist

- ✅ Environment variables set
- ✅ Firebase security rules configured
- ✅ CORS configured correctly
- ✅ Rate limiting enabled
- ✅ SSL/HTTPS enabled
- ✅ Error tracking set up
- ✅ Analytics enabled
- ✅ Backup strategy in place

---

**Built with ❤️ by Bhavin Sondagar**
