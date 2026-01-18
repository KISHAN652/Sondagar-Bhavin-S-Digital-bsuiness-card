# 🎴 Digital Business Card SaaS

A premium, production-ready Digital Business Card SaaS platform with iOS-style glassmorphism design, NFC support, and comprehensive admin panel.

## ✨ Features

### 🎯 Public Card Features
- **Premium iOS-style UI** - Glassmorphism design with animated gradient background
- **Mobile-First** - Optimized for all devices
- **Contact Saving** - Web Contacts API integration (no VCF downloads)
- **QR Code Sharing** - Instant QR code generation
- **WhatsApp Share** - Direct sharing via WhatsApp
- **NFC Support** - Tap to share on compatible devices
- **Analytics Tracking** - Automatic visitor tracking

### 🔐 Admin Panel
- **Role-Based Access Control** - ADMIN, EDITOR, VIEWER roles
- **Live Card Editing** - Real-time updates to public cards
- **Toggle Controls** - Enable/disable card and connect button
- **Visitor Analytics** - Track card views and engagement
- **Firebase Authentication** - Secure login system

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Framer Motion
- PWA Support

### Backend
- Node.js
- Express
- Firebase Admin SDK
- JWT Authentication
- Rate Limiting

### Database
- Firebase Firestore
- Firebase Authentication
- Firebase Analytics

## 📁 Project Structure

```
digital-business-card/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── card/[cardId]/   # Public card view
│   │   ├── admin/           # Admin panel
│   │   └── api/             # API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   └── public/              # Static assets
│
├── backend/                 # Express API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   ├── controllers/     # Business logic
│   │   └── config/          # Configuration
│   └── server.js
│
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase Project
- npm or yarn

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd digital-business-card

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Generate service account key (Settings → Service Accounts)
5. Download the JSON key file

### 3. Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend (.env):**
```env
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin Panel: http://localhost:3000/admin

## 📱 NFC Usage

### Android (Chrome)
1. Open card URL
2. Tap "Share" → "Write to NFC Tag"
3. Hold phone near NFC tag
4. Tag is now programmed

### iOS (Safari)
1. Requires iOS 13+
2. Use third-party NFC writer app
3. Write URL to tag
4. Tap tag to open card

## 🔒 Security Features

- ✅ Environment variables for all secrets
- ✅ JWT access & refresh tokens
- ✅ Role-based access control
- ✅ Firestore security rules
- ✅ Rate limiting on API routes
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ XSS prevention

## 🌐 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

Set environment variables in Vercel dashboard.

### Backend (Render/Railway)

**Render:**
1. Connect GitHub repository
2. Select `backend` directory
3. Add environment variables
4. Deploy

**Railway:**
```bash
cd backend
railway login
railway init
railway up
```

## 📊 Firestore Structure

### Collections

**users/{uid}**
```json
{
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

**cards/{cardId}**
```json
{
  "ownerUid": "user_uid",
  "name": "John Doe",
  "title": "CEO & Founder",
  "phone": "+1234567890",
  "email": "john@example.com",
  "website": "https://example.com",
  "profileImage": "https://...",
  "active": true,
  "connectEnabled": true,
  "updatedAt": "timestamp"
}
```

**analytics/{autoId}**
```json
{
  "cardId": "card_123",
  "device": "mobile",
  "timestamp": "timestamp"
}
```

## 🎨 Design System

- **Colors:** Pink-Purple-Blue gradient
- **Typography:** SF Pro Display (Apple-like)
- **Effects:** Glassmorphism, soft glows
- **Animations:** Framer Motion (iOS-style)
- **Icons:** Thin SVG (SF Symbols style)

## 📝 API Endpoints

### Public
- `GET /api/cards/:cardId` - Get card data
- `POST /api/analytics` - Track visitor

### Protected (Admin)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/admin/cards` - List all cards
- `PUT /api/admin/cards/:cardId` - Update card
- `GET /api/admin/analytics/:cardId` - Get analytics

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Bhavin Sondagar**

---

Built with ❤️ using Next.js, Firebase, and modern web technologies
