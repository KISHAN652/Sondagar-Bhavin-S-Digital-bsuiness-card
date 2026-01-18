# 🔐 Environment Variables Setup Guide

## Quick Setup Checklist

Follow these steps to configure your environment variables:

---

## ✅ Step 1: Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Enter project name: `digital-business-card`
4. Disable Google Analytics (optional)
5. Click **"Create Project"**

---

## ✅ Step 2: Enable Required Services (3 minutes)

### Enable Firestore
1. In Firebase Console → **Build** → **Firestore Database**
2. Click **"Create Database"**
3. Select **"Start in production mode"**
4. Choose location (closest to your users)
5. Click **"Enable"**

### Enable Authentication
1. In Firebase Console → **Build** → **Authentication**
2. Click **"Get Started"**
3. Click **"Email/Password"**
4. Toggle **Enable**
5. Click **"Save"**

---

## ✅ Step 3: Get Frontend Credentials (2 minutes)

### Get Firebase Web Config

1. In Firebase Console → Click **⚙️ (Settings)** → **Project Settings**
2. Scroll to **"Your apps"** section
3. Click the **Web icon** (`</>`)
4. Register app:
   - App nickname: `Digital Card Frontend`
   - Don't check "Firebase Hosting"
   - Click **"Register app"**
5. Copy the `firebaseConfig` object

### Update `frontend/.env.local`

Open `frontend/.env.local` and replace these values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (from apiKey)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com (from authDomain)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id (from projectId)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com (from storageBucket)
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 (from messagingSenderId)
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...:web:abc... (from appId)
```

**Leave these as-is for local development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✅ Step 4: Get Backend Credentials (3 minutes)

### Generate Service Account Key

1. In Firebase Console → **⚙️ (Settings)** → **Project Settings**
2. Go to **"Service Accounts"** tab
3. Click **"Generate New Private Key"**
4. Click **"Generate Key"** (downloads a JSON file)
5. **Save this file securely** (you'll need it)

### Update `backend/.env`

Open the downloaded JSON file and copy these values to `backend/.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
# Copy from "project_id" in JSON

FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# Copy from "private_key" in JSON
# IMPORTANT: Keep the \n characters and wrap in quotes!

FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
# Copy from "client_email" in JSON
```

### Generate JWT Secrets

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this command twice to generate two different secrets.

**Option 2: Using Online Generator**
Go to [randomkeygen.com](https://randomkeygen.com) and copy a "CodeIgniter Encryption Key"

Update in `backend/.env`:
```env
JWT_SECRET=paste_first_generated_secret_here
JWT_REFRESH_SECRET=paste_second_generated_secret_here
```

**Leave this as-is for local development:**
```env
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Step 5: Create Admin User (2 minutes)

### Create User in Firebase Auth

1. Firebase Console → **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - Email: `admin@example.com` (or your email)
   - Password: `Admin@123` (change this!)
4. Click **"Add User"**
5. **Copy the User UID** (you'll need this next)

### Create User Document in Firestore

1. Firebase Console → **Firestore Database**
2. Click **"Start Collection"**
3. Collection ID: `users`
4. Click **"Next"**
5. Document ID: **Paste the User UID** from above
6. Add fields:
   - Field: `email` | Type: `string` | Value: `admin@example.com`
   - Field: `role` | Type: `string` | Value: `ADMIN`
7. Click **"Save"**

---

## ✅ Step 6: Create Sample Card (2 minutes)

1. Firestore Database → Click **"Start Collection"**
2. Collection ID: `cards`
3. Click **"Next"**
4. Document ID: **Auto-ID** (let Firebase generate)
5. Add fields:

```
ownerUid: (string) YOUR_ADMIN_UID_FROM_STEP_5
name: (string) Bhavin Sondagar
title: (string) Full Stack Developer
phone: (string) +91 1234567890
email: (string) bhavin@example.com
website: (string) https://example.com
profileImage: (string) https://i.pravatar.cc/300
active: (boolean) true
connectEnabled: (boolean) true
updatedAt: (timestamp) Click "Set to current time"
```

6. Click **"Save"**
7. **Copy the Document ID** (this is your card ID)

---

## ✅ Step 7: Verify Your Setup

### Check Frontend `.env.local`

```bash
cd frontend
cat .env.local  # Mac/Linux
type .env.local  # Windows
```

Should have all values filled (no "your-project-id" placeholders).

### Check Backend `.env`

```bash
cd backend
cat .env  # Mac/Linux
type .env  # Windows
```

Should have all values filled, including:
- Firebase credentials from JSON
- Strong JWT secrets (not the example values)

---

## ✅ Step 8: Test Locally

### Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (in new terminal)
cd backend
npm install
```

### Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
🎴 Digital Business Card API
Server running on port 5000
```

### Start Frontend (new terminal)

```bash
cd frontend
npm run dev
```

You should see:
```
✓ Ready on http://localhost:3000
```

### Test the App

1. **View Card:**
   ```
   http://localhost:3000/card/YOUR_CARD_ID
   ```
   (Use the card ID from Step 6)

2. **Login to Admin:**
   ```
   http://localhost:3000/admin
   ```
   - Email: `admin@example.com`
   - Password: (what you set in Step 5)

---

## 🔒 Security Checklist

Before deploying, verify:

- [ ] `.env.local` is in `frontend/.gitignore`
- [ ] `.env` is in `backend/.gitignore`
- [ ] JWT secrets are strong and random (not example values)
- [ ] Firebase private key is properly formatted with `\n`
- [ ] Admin password is strong
- [ ] Service account JSON file is stored securely

---

## 🚨 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
→ Check `NEXT_PUBLIC_FIREBASE_API_KEY` in `frontend/.env.local`

### "Firebase Admin error: invalid private key"
→ Ensure `FIREBASE_PRIVATE_KEY` has `\n` characters and is wrapped in quotes

### "CORS error"
→ Check `FRONTEND_URL` in `backend/.env` matches your frontend URL

### "Card not found"
→ Verify card `active: true` in Firestore and card ID is correct

### Backend won't start
→ Check all environment variables are set in `backend/.env`

---

## 📝 Quick Reference

### Frontend `.env.local` Location
```
frontend/.env.local
```

### Backend `.env` Location
```
backend/.env
```

### Get Firebase Config
```
Firebase Console → Settings → Your apps → Web
```

### Get Service Account Key
```
Firebase Console → Settings → Service Accounts → Generate Key
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✅ You're Done!

Once you've completed all steps:

1. ✅ Frontend `.env.local` configured
2. ✅ Backend `.env` configured
3. ✅ Admin user created
4. ✅ Sample card created
5. ✅ Both servers running
6. ✅ Can view card
7. ✅ Can login to admin

**Next:** Follow [DEPLOYMENT.md](docs/DEPLOYMENT.md) to deploy to production!

---

**Need help?** Check [QUICK_START.md](QUICK_START.md) for more details.
