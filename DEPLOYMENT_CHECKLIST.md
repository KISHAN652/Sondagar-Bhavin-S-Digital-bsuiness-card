# 🚀 Production Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

---

## 📋 Pre-Deployment Checklist

### ✅ Firebase Setup
- [ ] Firebase project created
- [ ] Firestore Database enabled
- [ ] Authentication (Email/Password) enabled
- [ ] Admin user created in Authentication
- [ ] Admin user document created in Firestore `users` collection
- [ ] Sample card created in `cards` collection
- [ ] Firestore security rules configured
- [ ] Service account key downloaded
- [ ] Firebase config copied for frontend

### ✅ Environment Variables
- [ ] `frontend/.env.local` created with all Firebase config
- [ ] `backend/.env` created with Firebase Admin credentials
- [ ] JWT secrets generated (strong, random)
- [ ] All URLs configured correctly
- [ ] `.env` files added to `.gitignore`

### ✅ Local Testing
- [ ] Backend runs without errors (`npm run dev`)
- [ ] Frontend runs without errors (`npm run dev`)
- [ ] Can view card at `/card/CARD_ID`
- [ ] Can login to admin panel
- [ ] Can edit card in admin panel
- [ ] Changes reflect on public card
- [ ] Analytics tracking works
- [ ] All buttons functional (Connect, Share, QR, NFC)

### ✅ Code Quality
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] All TypeScript errors resolved
- [ ] Code is clean and commented
- [ ] No sensitive data in code
- [ ] `.gitignore` configured correctly

---

## 🌐 Backend Deployment (Render)

### Step 1: Prepare Repository
- [ ] Code committed to GitHub
- [ ] `.env` not committed (check `.gitignore`)
- [ ] `backend/.env.example` exists
- [ ] `package.json` has correct scripts

### Step 2: Create Render Service
- [ ] Render account created
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`

### Step 3: Configure Environment Variables
Add these in Render dashboard:
- [ ] `PORT=5000`
- [ ] `NODE_ENV=production`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_PRIVATE_KEY` (with `\n` preserved)
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `JWT_SECRET`
- [ ] `JWT_REFRESH_SECRET`
- [ ] `FRONTEND_URL` (your Vercel URL)

### Step 4: Deploy & Test
- [ ] Service deployed successfully
- [ ] Health check works: `https://your-api.com/health`
- [ ] API info works: `https://your-api.com/`
- [ ] No errors in logs
- [ ] Backend URL copied for frontend

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Repository
- [ ] Code committed to GitHub
- [ ] `.env.local` not committed
- [ ] `frontend/.env.example` exists
- [ ] Build works locally: `npm run build`

### Step 2: Create Vercel Project
- [ ] Vercel account created
- [ ] New project created
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] Framework preset: Next.js

### Step 3: Configure Environment Variables
Add these in Vercel dashboard:
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_API_URL` (your Render URL)
- [ ] `NEXT_PUBLIC_APP_URL` (your Vercel URL)

### Step 4: Deploy & Test
- [ ] Deployment successful
- [ ] No build errors
- [ ] Can access homepage
- [ ] Can view card
- [ ] Can login to admin
- [ ] All features work

---

## 🔗 Post-Deployment Configuration

### Update CORS
- [ ] Backend `FRONTEND_URL` updated to Vercel URL
- [ ] Backend redeployed
- [ ] CORS working (no errors in browser console)

### Update Firebase
- [ ] Vercel domain added to Firebase Authorized Domains
- [ ] Render domain added to Firebase Authorized Domains
- [ ] Test authentication works

### Update URLs
- [ ] `NEXT_PUBLIC_API_URL` points to Render URL
- [ ] `NEXT_PUBLIC_APP_URL` points to Vercel URL
- [ ] Frontend redeployed with new URLs

---

## 🧪 Production Testing

### Public Card
- [ ] Card loads at `https://your-app.com/card/CARD_ID`
- [ ] Profile image displays
- [ ] Contact details visible
- [ ] Connect button works
- [ ] Save Card button works
- [ ] Share modal opens
- [ ] WhatsApp share works
- [ ] QR modal opens
- [ ] QR code generates
- [ ] NFC button appears (on mobile)
- [ ] Social links work
- [ ] Animations smooth
- [ ] Mobile responsive

### Admin Panel
- [ ] Login page loads
- [ ] Can login with credentials
- [ ] Dashboard displays
- [ ] Card list shows
- [ ] Can select card
- [ ] Can edit card fields
- [ ] Can toggle active/inactive
- [ ] Can toggle connect button
- [ ] Changes save successfully
- [ ] Changes reflect on public card
- [ ] Analytics tab works
- [ ] Visitor count displays
- [ ] Can logout

### API
- [ ] Health check works
- [ ] Login endpoint works
- [ ] Token refresh works
- [ ] Analytics tracking works
- [ ] Rate limiting works
- [ ] Error handling works

---

## 🔒 Security Checklist

### Environment Variables
- [ ] All secrets in environment variables
- [ ] No secrets in code
- [ ] `.env` files in `.gitignore`
- [ ] Strong JWT secrets used
- [ ] Firebase private key secure

### Firebase
- [ ] Firestore security rules set
- [ ] Authentication enabled
- [ ] Only authorized domains listed
- [ ] Service account key secure

### Backend
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Helmet middleware active
- [ ] Input validation in place
- [ ] Error messages don't expose secrets

### Frontend
- [ ] No API keys in client code (only NEXT_PUBLIC_*)
- [ ] Tokens stored in localStorage (not cookies for this app)
- [ ] Token refresh working
- [ ] Logout clears tokens

---

## 📊 Monitoring Setup

### Vercel
- [ ] Deployment notifications enabled
- [ ] Error tracking configured
- [ ] Analytics enabled (optional)

### Render
- [ ] Email notifications enabled
- [ ] Log retention configured
- [ ] Uptime monitoring (optional)

### Firebase
- [ ] Usage alerts configured
- [ ] Quota monitoring enabled
- [ ] Backup schedule set (optional)

---

## 🎯 Custom Domain (Optional)

### Frontend Domain
- [ ] Domain purchased
- [ ] DNS configured in Vercel
- [ ] SSL certificate issued
- [ ] Domain working
- [ ] `NEXT_PUBLIC_APP_URL` updated

### Backend Domain
- [ ] Subdomain configured (e.g., api.yourdomain.com)
- [ ] DNS configured in Render
- [ ] SSL certificate issued
- [ ] Domain working
- [ ] `NEXT_PUBLIC_API_URL` updated
- [ ] `FRONTEND_URL` updated in backend

---

## 📱 Mobile Testing

### iOS
- [ ] Card loads on Safari
- [ ] Responsive design works
- [ ] Buttons functional
- [ ] Share API works
- [ ] NFC reading works (tap tag)
- [ ] PWA installable

### Android
- [ ] Card loads on Chrome
- [ ] Responsive design works
- [ ] Buttons functional
- [ ] Share API works
- [ ] NFC reading works
- [ ] NFC writing works
- [ ] PWA installable

---

## 🔄 Maintenance Plan

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Check analytics monthly
- [ ] Update dependencies quarterly
- [ ] Rotate JWT secrets yearly
- [ ] Review security rules quarterly

### Backup Strategy
- [ ] Firestore backup enabled
- [ ] Code in Git (multiple remotes recommended)
- [ ] Environment variables documented securely
- [ ] Service account keys backed up securely

---

## 📈 Scaling Checklist

### When to Upgrade

**Vercel:**
- [ ] Bandwidth > 100GB/month → Upgrade to Pro ($20/mo)
- [ ] Need team collaboration → Upgrade to Pro
- [ ] Need advanced analytics → Upgrade to Pro

**Render:**
- [ ] Free tier sleeps → Upgrade to Starter ($7/mo)
- [ ] Need more resources → Upgrade to Standard ($25/mo)
- [ ] High traffic → Upgrade to Pro ($85/mo)

**Firebase:**
- [ ] Reads > 50K/day → Upgrade to Blaze (pay-as-you-go)
- [ ] Writes > 20K/day → Upgrade to Blaze
- [ ] Need backups → Upgrade to Blaze

---

## 🎉 Launch Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] No errors in production
- [ ] Analytics tracking verified
- [ ] Mobile tested
- [ ] Performance optimized
- [ ] SEO configured (if needed)

### Launch Day
- [ ] Create first real card
- [ ] Test end-to-end flow
- [ ] Share card with test users
- [ ] Monitor logs for errors
- [ ] Check analytics

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Fix any issues
- [ ] Gather user feedback
- [ ] Plan improvements

---

## 🆘 Troubleshooting

### Common Issues

**"Module not found" on Vercel**
- [ ] Check `package.json` has all dependencies
- [ ] Clear build cache and redeploy

**"CORS error" in browser**
- [ ] Verify `FRONTEND_URL` in backend
- [ ] Redeploy backend
- [ ] Check browser console for exact error

**"Firebase error" on login**
- [ ] Verify Firebase config in frontend
- [ ] Check authorized domains in Firebase
- [ ] Verify user exists in Authentication

**"500 Internal Server Error"**
- [ ] Check Render logs
- [ ] Verify environment variables
- [ ] Check Firebase Admin credentials

---

## ✅ Final Verification

Before going live, verify:

- [ ] ✅ Frontend deployed and accessible
- [ ] ✅ Backend deployed and accessible
- [ ] ✅ Database connected and working
- [ ] ✅ Authentication working
- [ ] ✅ All features functional
- [ ] ✅ Mobile responsive
- [ ] ✅ Security configured
- [ ] ✅ Monitoring enabled
- [ ] ✅ Documentation complete
- [ ] ✅ Team trained (if applicable)

---

## 🎊 You're Ready to Launch!

**Congratulations!** Your Digital Business Card SaaS is production-ready.

**Share your first card:**
```
https://your-app.com/card/YOUR_CARD_ID
```

**Admin panel:**
```
https://your-app.com/admin
```

---

**Need help?** Refer to:
- `docs/DEPLOYMENT.md` - Detailed deployment guide
- `docs/FIREBASE_SETUP.md` - Firebase configuration
- `docs/API_DOCUMENTATION.md` - API reference
- `PROJECT_SUMMARY.md` - Complete project overview

**Good luck! 🚀**
