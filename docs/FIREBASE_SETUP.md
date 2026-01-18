# Firebase Setup Guide

This guide will walk you through setting up Firebase for your Digital Business Card SaaS.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "digital-business-card")
4. Disable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create Database"
3. Select "Start in production mode"
4. Choose a location (closest to your users)
5. Click "Enable"

## Step 3: Set Up Firestore Security Rules

Go to **Firestore Database** → **Rules** and paste the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - only authenticated users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only admins can create users (via backend)
    }
    
    // Cards collection
    match /cards/{cardId} {
      // Anyone can read active cards
      allow read: if resource.data.active == true;
      
      // Only card owner or admin can update
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.ownerUid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN');
      
      // Only admins can create/delete
      allow create, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
    
    // Analytics collection - anyone can write, only admins can read
    match /analytics/{analyticsId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['ADMIN', 'VIEWER'];
      allow create: if true; // Allow public analytics tracking
      allow update, delete: if false;
    }
  }
}
```

Click **Publish** to save the rules.

## Step 4: Enable Authentication

1. Go to **Build** → **Authentication**
2. Click "Get Started"
3. Click on **Email/Password**
4. Enable "Email/Password"
5. Click "Save"

## Step 5: Create Admin User

1. Go to **Authentication** → **Users**
2. Click "Add User"
3. Enter email and password
4. Click "Add User"
5. Copy the **User UID**

## Step 6: Create Admin User Document

1. Go to **Firestore Database**
2. Click "Start Collection"
3. Collection ID: `users`
4. Document ID: Paste the User UID from Step 5
5. Add fields:
   - `email` (string): Your admin email
   - `role` (string): `ADMIN`
6. Click "Save"

## Step 7: Get Firebase Config (Frontend)

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app (nickname: "Digital Card Frontend")
5. Copy the `firebaseConfig` object
6. Create `frontend/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 8: Generate Service Account Key (Backend)

1. Go to **Project Settings** → **Service Accounts**
2. Click "Generate New Private Key"
3. Click "Generate Key" (downloads JSON file)
4. Open the JSON file and extract:
   - `project_id`
   - `private_key`
   - `client_email`

5. Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com

JWT_SECRET=generate_a_random_secret_here
JWT_REFRESH_SECRET=generate_another_random_secret_here

FRONTEND_URL=http://localhost:3000
```

**Important:** Keep the private key format with `\n` for line breaks.

## Step 9: Create Sample Card

1. Go to **Firestore Database**
2. Click "Start Collection"
3. Collection ID: `cards`
4. Document ID: Auto-ID
5. Add fields:
   ```
   ownerUid: (string) - Your admin UID
   name: (string) - "John Doe"
   title: (string) - "CEO & Founder"
   phone: (string) - "+1234567890"
   email: (string) - "john@example.com"
   website: (string) - "https://example.com"
   profileImage: (string) - "https://i.pravatar.cc/300"
   active: (boolean) - true
   connectEnabled: (boolean) - true
   updatedAt: (timestamp) - Now
   ```
6. Click "Save"
7. Copy the **Document ID** (this is your `cardId`)

## Step 10: Test Your Setup

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Visit: `http://localhost:3000/card/YOUR_CARD_ID`
4. Login to admin: `http://localhost:3000/admin`

## Security Checklist

- ✅ Firestore security rules are set
- ✅ Environment variables are not committed to Git
- ✅ Service account key is stored securely
- ✅ JWT secrets are strong and random
- ✅ CORS is configured correctly
- ✅ Rate limiting is enabled

## Troubleshooting

### "Permission Denied" Error
- Check Firestore security rules
- Verify user has correct role in Firestore
- Ensure card is marked as `active: true`

### "Authentication Failed"
- Verify Firebase config in `.env.local`
- Check if user exists in Authentication
- Ensure user document exists in `users` collection

### "Failed to Initialize Firebase Admin"
- Check `FIREBASE_PRIVATE_KEY` format (must include `\n`)
- Verify service account email is correct
- Ensure project ID matches

## Next Steps

- Set up Firebase Storage for profile images
- Configure Firebase Analytics
- Set up Firebase Hosting for deployment
- Enable Firebase App Check for security

---

For more help, visit [Firebase Documentation](https://firebase.google.com/docs)
