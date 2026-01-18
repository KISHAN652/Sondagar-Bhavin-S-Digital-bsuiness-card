# Deployment Guide

This guide covers deploying your Digital Business Card SaaS to production.

## Prerequisites

- Vercel account (for frontend)
- Render or Railway account (for backend)
- Firebase project set up
- Domain name (optional)

---

## Part 1: Deploy Backend (Render)

### Step 1: Prepare Backend for Deployment

1. Ensure `backend/.env.example` exists
2. Add `.gitignore` to backend:

```
node_modules/
.env
*.log
```

3. Commit your code to GitHub

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 3: Configure Render Service

1. **Repository:** Select your GitHub repo
2. **Root Directory:** `backend`
3. **Environment:** Node
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. **Instance Type:** Free (or paid for production)

### Step 4: Add Environment Variables

In Render dashboard, add these environment variables:

```
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key_with_\n
FIREBASE_CLIENT_EMAIL=your_service_account_email
JWT_SECRET=your_strong_random_secret
JWT_REFRESH_SECRET=your_strong_random_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

**Important:** For `FIREBASE_PRIVATE_KEY`, paste the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` with `\n` for newlines.

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://your-app.onrender.com`)

---

## Part 2: Deploy Frontend (Vercel)

### Step 1: Prepare Frontend

1. Ensure `frontend/.env.example` exists
2. Update `next.config.js` if needed
3. Commit changes to GitHub

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New..." → "Project"

### Step 3: Import Project

1. Select your GitHub repository
2. **Root Directory:** `frontend`
3. **Framework Preset:** Next.js
4. Click "Deploy"

### Step 4: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
```

### Step 5: Redeploy

1. Go to Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## Alternative: Deploy Backend to Railway

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login and Initialize

```bash
cd backend
railway login
railway init
```

### Step 3: Add Environment Variables

```bash
railway variables set PORT=5000
railway variables set NODE_ENV=production
railway variables set FIREBASE_PROJECT_ID=your_project_id
# ... add all other variables
```

### Step 4: Deploy

```bash
railway up
```

### Step 5: Get URL

```bash
railway domain
```

---

## Part 3: Update CORS and URLs

### Update Backend CORS

In `backend/server.js`, update FRONTEND_URL to your Vercel domain.

### Update Frontend API URL

In Vercel, update `NEXT_PUBLIC_API_URL` to your backend URL.

### Update Firebase Auth Domain

In Firebase Console → Authentication → Settings → Authorized Domains:
- Add your Vercel domain
- Add your Render domain

---

## Part 4: Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel → Project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render Custom Domain

1. Go to Render → Service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

---

## Part 5: SSL/HTTPS

Both Vercel and Render provide automatic SSL certificates. No action needed.

---

## Part 6: Monitoring & Logs

### Vercel Logs

- Go to Deployments → Click deployment → View Function Logs

### Render Logs

- Go to Service → Logs tab

### Firebase Monitoring

- Firebase Console → Analytics
- Firebase Console → Crashlytics (if enabled)

---

## Part 7: Production Checklist

### Security
- ✅ All secrets in environment variables
- ✅ CORS configured correctly
- ✅ Rate limiting enabled
- ✅ Firestore security rules set
- ✅ HTTPS enabled

### Performance
- ✅ Images optimized
- ✅ Code minified (Next.js does this)
- ✅ Caching configured
- ✅ CDN enabled (Vercel provides this)

### Monitoring
- ✅ Error tracking set up
- ✅ Analytics enabled
- ✅ Uptime monitoring (optional)

### Backup
- ✅ Firestore backup enabled
- ✅ Code in Git
- ✅ Environment variables documented

---

## Troubleshooting

### "Module not found" Error
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### "CORS Error"
- Update `FRONTEND_URL` in backend `.env`
- Redeploy backend

### "Firebase Admin Error"
- Check `FIREBASE_PRIVATE_KEY` format
- Ensure all `\n` are preserved
- Try wrapping in quotes

### "Build Failed"
- Check build logs
- Ensure all environment variables are set
- Test build locally: `npm run build`

---

## Scaling Considerations

### Free Tier Limits

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless functions

**Render:**
- Free tier sleeps after 15 min inactivity
- Upgrade to paid for always-on

**Firebase:**
- Free tier: 50K reads/day, 20K writes/day
- Upgrade to Blaze (pay-as-you-go) for production

### Upgrade Path

1. **Month 1-3:** Free tiers
2. **Month 4+:** Upgrade Render to paid ($7/mo)
3. **Scale up:** Firebase Blaze, Vercel Pro ($20/mo)

---

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security issues
npm audit fix
```

### Backup Strategy

1. **Firestore:** Enable daily backups in Firebase Console
2. **Code:** Keep Git history
3. **Environment Variables:** Store securely (1Password, etc.)

---

## Support

- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Render:** [render.com/docs](https://render.com/docs)
- **Firebase:** [firebase.google.com/support](https://firebase.google.com/support)

---

**Congratulations! Your Digital Business Card SaaS is now live! 🎉**
