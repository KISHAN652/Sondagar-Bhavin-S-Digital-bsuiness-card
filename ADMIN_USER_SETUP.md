# 🔐 Admin User Setup - Step by Step

## Problem
You're getting: `Firebase: Error (auth/invalid-credential)`

This means the user doesn't exist in Firebase Authentication.

---

## Solution: Create Admin User

### Step 1: Go to Firebase Console

1. Open: https://console.firebase.google.com
2. Select your project: `digital-business-card` (or whatever you named it)

---

### Step 2: Create User in Authentication

1. Click **"Authentication"** in left sidebar (under "Build")
2. Click **"Users"** tab
3. Click **"Add User"** button (top right)
4. Enter details:
   ```
   Email: admin@example.com
   Password: Admin@123
   ```
   (You can use any email/password you want)
5. Click **"Add User"**
6. **IMPORTANT:** Copy the **User UID** (looks like: `abc123xyz456...`)
   - You'll need this in the next step!

---

### Step 3: Create User Document in Firestore

1. Click **"Firestore Database"** in left sidebar (under "Build")
2. If you see "Create database", click it and select "Start in production mode"
3. Click **"Start Collection"** button
4. Collection ID: `users` (exactly this, lowercase)
5. Click **"Next"**
6. **Document ID:** Paste the **User UID** you copied in Step 2
7. Add fields by clicking "Add field":

   **Field 1:**
   - Field: `email`
   - Type: `string`
   - Value: `admin@example.com` (same as Step 2)

   **Field 2:**
   - Field: `role`
   - Type: `string`
   - Value: `ADMIN` (exactly this, uppercase)

8. Click **"Save"**

---

### Step 4: Test Login

1. Go to: http://localhost:3000/admin
2. Enter credentials:
   ```
   Email: admin@example.com
   Password: Admin@123
   ```
3. Click "Sign In"

**You should now be logged in! 🎉**

---

## Troubleshooting

### Still getting "invalid-credential" error?

**Check these:**

1. **Email matches exactly:**
   - Authentication email: `admin@example.com`
   - Firestore email field: `admin@example.com`
   - Login email: `admin@example.com`

2. **Password is correct:**
   - Use the password you set in Step 2

3. **User exists in Authentication:**
   - Go to Authentication → Users
   - You should see your user listed

4. **User document exists in Firestore:**
   - Go to Firestore Database
   - You should see `users` collection
   - Inside it, a document with your User UID
   - With `email` and `role` fields

---

### Getting "User not found" error?

This means:
- User exists in Authentication ✅
- But user document is missing in Firestore ❌

**Solution:** Repeat Step 3 above.

---

### Getting "Cannot connect to server" error?

This means backend is not running.

**Solution:**
```bash
cd backend
npm run dev
```

Wait for:
```
🎴 Digital Business Card API
Server running on port 5000
```

---

## Quick Test Checklist

Before trying to login, verify:

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database enabled
- [ ] User created in Authentication
- [ ] User UID copied
- [ ] User document created in Firestore with:
  - [ ] Document ID = User UID
  - [ ] Field: `email` (string)
  - [ ] Field: `role` = `ADMIN` (string)
- [ ] Backend running (`npm run dev` in backend folder)
- [ ] Frontend running (`npm run dev` in frontend folder)

---

## Example Values

Here's an example of what everything should look like:

**Authentication User:**
```
Email: admin@example.com
UID: abc123xyz456def789ghi012jkl345
```

**Firestore Document:**
```
Collection: users
Document ID: abc123xyz456def789ghi012jkl345
Fields:
  - email: "admin@example.com"
  - role: "ADMIN"
```

**Login Credentials:**
```
Email: admin@example.com
Password: Admin@123
```

---

## Next Steps

Once logged in successfully:

1. You'll see the Admin Dashboard
2. Create a sample card in Firestore
3. View it at: http://localhost:3000/card/CARD_ID
4. Edit it from Admin Panel

---

**Need more help?** Check the browser console for detailed error messages.
