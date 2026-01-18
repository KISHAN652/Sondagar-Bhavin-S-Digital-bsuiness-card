# Quick Start Guide

Get your Digital Business Card SaaS running in 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase account
- Git (optional)

---

## Step 1: Install Dependencies (2 minutes)

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

---

## Step 2: Firebase Setup (3 minutes)

### Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Add Project"
3. Name it "digital-business-card"
4. Click "Create Project"

### Enable Firestore
1. Build → Firestore Database → Create Database
2. Start in production mode
3. Choose location → Enable

### Enable Authentication
1. Build → Authentication → Get Started
2. Email/Password → Enable → Save

### Create Admin User
1. Authentication → Users → Add User
2. Email: `admin@example.com`
3. Password: `admin123` (change later!)
4. Copy the **User UID**

### Add Admin to Firestore
1. Firestore Database → Start Collection
2. Collection ID: `users`
3. Document ID: Paste User UID
4. Fields:
   - `email`: `admin@example.com`
   - `role`: `ADMIN`
5. Save

---

## Step 3: Get Firebase Credentials (2 minutes)

### Frontend Config
1. Project Settings → Your apps → Web
2. Register app → Copy config
3. Create `frontend/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend Config
1. Project Settings → Service Accounts
2. Generate New Private Key → Download JSON
3. Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
JWT_SECRET=my-super-secret-key-123
JWT_REFRESH_SECRET=my-refresh-secret-key-456
FRONTEND_URL=http://localhost:3000
```

**Note:** Copy `private_key`, `client_email`, and `project_id` from the downloaded JSON.

---

## Step 4: Create Sample Card (1 minute)

1. Firestore → Start Collection
2. Collection ID: `cards`
3. Auto-ID
4. Fields:
```
ownerUid: YOUR_ADMIN_UID
name: "Bhavin Sondagar"
title: "Full Stack Developer"
phone: "+91 1234567890"
email: "bhavin@example.com"
website: "https://example.com"
profileImage: "https://i.pravatar.cc/300"
active: true
connectEnabled: true
updatedAt: (timestamp) Now
```
5. Save → Copy Document ID

---

## Step 5: Run the App (1 minute)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
🎴 Digital Business Card API
Server running on port 5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
✓ Ready on http://localhost:3000
```

---

## Step 6: Test Everything (1 minute)

### View Card
```
http://localhost:3000/card/YOUR_CARD_ID
```

You should see your beautiful glassmorphism card! 🎉

### Login to Admin
```
http://localhost:3000/admin
```

Login with:
- Email: `admin@example.com`
- Password: `admin123`

---

## Troubleshooting

### "Module not found"
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Firebase error"
- Check `.env` files are created
- Verify all credentials are correct
- Ensure Firestore and Auth are enabled

### "CORS error"
- Check `FRONTEND_URL` in backend `.env`
- Restart backend server

### "Card not found"
- Verify card `active: true` in Firestore
- Check card ID in URL matches Firestore

---

## Next Steps

1. **Customize Design**
   - Edit `frontend/components/CardView.tsx`
   - Modify colors in `tailwind.config.js`

2. **Add More Cards**
   - Create more documents in `cards` collection
   - Each gets unique URL

3. **Deploy to Production**
   - Follow `docs/DEPLOYMENT.md`

4. **Set Up NFC**
   - Follow `docs/NFC_GUIDE.md`

---

## Common Tasks

### Add New Admin User
1. Authentication → Add User
2. Copy UID
3. Firestore → `users` → Add Document
4. Set `role: "ADMIN"`

### Change Card Data
1. Admin Panel → Edit Card
2. Or Firestore → `cards` → Edit Document

### View Analytics
1. Admin Panel → Analytics tab
2. Or Firestore → `analytics` collection

---

## Development Tips

### Hot Reload
Both frontend and backend support hot reload. Just save files and see changes instantly.

### Debug Mode
```bash
# Frontend - check browser console
# Backend - check terminal output
```

### Test on Mobile
```bash
# Find your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Access from phone
http://YOUR_IP:3000/card/CARD_ID
```

---

## File Structure Quick Reference

```
frontend/
  app/card/[cardId]/page.tsx  ← Public card page
  components/CardView.tsx      ← Main card UI
  lib/firebase.ts              ← Firebase config

backend/
  server.js                    ← Main server
  src/routes/auth.js           ← Login endpoint
  src/routes/admin.js          ← Admin API
```

---

## Support

- **Firebase Issues:** `docs/FIREBASE_SETUP.md`
- **Deployment:** `docs/DEPLOYMENT.md`
- **NFC Setup:** `docs/NFC_GUIDE.md`
- **Full Structure:** `PROJECT_STRUCTURE.md`

---

**🎉 Congratulations! Your Digital Business Card SaaS is running!**

Share your first card:
```
http://localhost:3000/card/YOUR_CARD_ID
```
