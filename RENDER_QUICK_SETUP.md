# ReturnIQ on Render - Step-by-Step Setup

## Prerequisites

✅ GitHub repository with code pushed  
✅ Render account (free at render.com)  
✅ Both backend and frontend working locally

## Step 1: Push Latest Code to GitHub

```bash
cd c:\Users\JOSHIKA S\Desktop\Ecommerce Intelligence System
git status
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## Step 2: Go to Render Dashboard

1. Log in to [render.com](https://render.com)
2. Click your profile → Dashboard
3. You should see "ReturnIQ-or-ecommerce-return-intelligence" repository connected

## Step 3: Deploy Backend Service

**Click**: New + (top right) → Web Service

**Fill in the form**:
| Field | Value |
|-------|-------|
| Name | `returniq-backend` |
| Environment | `Python 3` |
| Build Command | `cd backend && pip install -r requirements.txt` |
| Start Command | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Plan | Free |

**Click**: Deploy Web Service

⏳ **Wait 2-3 minutes**... Deployment in progress

Once done, you'll see:
- Green checkmark next to service name
- URL like: `https://returniq-backend.onrender.com`

📋 **Copy this URL** - you'll need it next

## Step 4: Deploy Frontend Service

**Click**: New + (top right) → Static Site

**Fill in the form**:
| Field | Value |
|-------|-------|
| Name | `returniq-frontend` |
| Build Command | `cd frontend && npm install && npm run build` |
| Publish Directory | `frontend/dist` |
| Plan | Free |

**Before Deploying**, add environment variable:

1. Scroll down to "Environment"
2. Click **Add Environment Variable**
3. Fill in:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://returniq-backend.onrender.com` (the URL from Step 3)
4. Click **Deploy Static Site**

⏳ **Wait 1-2 minutes**... Building and deploying

Once done, you'll see:
- Green checkmark next to service name
- URL like: `https://returniq-frontend.onrender.com`

## Step 5: Access Your Application

Open browser and go to:
```
https://returniq-frontend.onrender.com
```

You should see the ReturnIQ dashboard with all charts and data!

## Verify Everything Works

1. **Dashboard Page** - See KPIs and charts
2. **Risk Analysis** - Try filling the form and clicking "Analyze"
3. **Simulator** - Try adjusting sliders and running simulation
4. **All Pages** - Click through sidebar navigation

✅ If all pages load and show data → **Success!**

## What Happens When Service Sleeps

Free plan services sleep after 15 minutes of inactivity.

**First request after sleep:**
- Takes 30-45 seconds to respond
- Console shows: "Application startup complete"
- Then everything works normally

**To prevent sleep** (upgrade to Starter):
1. Go to Service Settings
2. Click **Change Plan**
3. Select **Starter** ($7/month per service)
4. Services now stay awake 24/7

## Troubleshooting

### "Cannot connect to backend" Error
```
This usually means:
1. Backend service is sleeping → Wait 30 seconds and refresh
2. VITE_API_URL not set → Go to frontend settings, check env var
3. Backend failed to deploy → Check backend logs in Render
```

**Fix**:
1. Go to backend service in Render
2. Click "Logs"
3. Look for error messages
4. Common issues: Missing file, wrong Python version, import errors

### "Building..." Takes Too Long
```
Normal build times:
- Backend: 1-2 minutes
- Frontend: 2-3 minutes

If it takes longer than 5 minutes, something might be wrong.
Check the build log for errors.
```

### Application is Very Slow
```
This is normal on free plan!

Causes:
- Service was sleeping → First request wakes it up (30s)
- Database query is slow → Check your backend code
- Network latency → Nothing we can do

Solutions:
- Upgrade to Starter for always-on
- Optimize database queries
- Add caching to frontend
```

## Advanced: Connect Real Database

Currently uses SQLite (resets on redeploy). For production:

### Option 1: Use Render PostgreSQL
1. Go to Render Dashboard
2. Click **New +** → **PostgreSQL**
3. Name: `returniq-db`
4. Region: Same as backend
5. Click **Create**
6. Copy connection string
7. Update backend to use PostgreSQL
8. Set DATABASE_URL environment variable
9. Redeploy backend

### Option 2: Use MongoDB Atlas (Free)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update backend code to use MongoDB
5. Set MONGO_URL environment variable
6. Redeploy backend

## Environment Variables Reference

Backend environment variables (if needed):
```
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=info
DATABASE_URL=sqlite:///./orders.db
```

Frontend environment variables:
```
VITE_API_URL=https://returniq-backend.onrender.com
```

## Monitor Your Services

On Render Dashboard:

1. **Health** - Green = running, Red = error
2. **Logs** - Real-time service logs
3. **Metrics** - CPU, Memory, Network usage
4. **Deployments** - History of all deployments

### Set Up Alerts

1. Click service name
2. Settings → Notifications
3. Add email for deployment failures
4. Now you'll get notified if something breaks

## Custom Domain (Optional)

If you want `returniq.mycompany.com` instead of `returniq-frontend.onrender.com`:

1. Buy domain (GoDaddy, Namecheap, etc.)
2. In Render, go to frontend service
3. Click Settings → Custom Domains
4. Enter your domain
5. Update DNS records as instructed
6. Wait for SSL certificate (usually instant)

Cost: Domain depends on provider ($10-15/year)

## Monthly Costs

| Item | Free | Starter | Notes |
|------|------|---------|-------|
| Backend | $0 | $7 | Always-on |
| Frontend | $0 | $7 | Always-on |
| PostgreSQL | - | $15 | Optional |
| Custom Domain | - | $10/yr | Optional |
| **Total** | **$0** | **$14-39** | **/month** |

## Next Steps

1. ✅ Create accounts and deploy
2. ✅ Test the application
3. ✅ Share the URL with team
4. ✅ Monitor performance
5. ✅ Upgrade to Starter when ready
6. ✅ Set up PostgreSQL for production data

## Support & Docs

- **Render Docs**: https://render.com/docs
- **API Status**: https://status.render.com
- **Community**: https://community.render.com

---

**Deployed?** Visit your live app at `https://returniq-frontend.onrender.com` 🚀

For detailed troubleshooting, see `RENDER_DEPLOYMENT.md`
