# ReturnIQ Deployment to Render

This guide walks you through deploying ReturnIQ to Render.com for free hosting.

## Prerequisites

1. **GitHub Account** - Your code must be pushed to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Application Ready** - Backend and frontend working locally

## Deployment Steps

### Step 1: Prepare Your Repository

Ensure your GitHub repository has the latest code:

```bash
cd c:\Users\JOSHIKA S\Desktop\Ecommerce Intelligence System
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **Sign Up** (GitHub recommended)
3. Authorize Render to access your GitHub repositories

### Step 3: Deploy Backend Service

1. From Render dashboard, click **New +** → **Web Service**
2. Select your GitHub repository
3. Configure:
   - **Name**: `returniq-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (to start)
   
4. Click **Deploy Web Service**

**Note the backend URL**: Render will assign a URL like `https://returniq-backend.onrender.com`

### Step 4: Deploy Frontend Service

1. Click **New +** → **Static Site**
2. Select your GitHub repository
3. Configure:
   - **Name**: `returniq-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free
   
4. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://returniq-backend.onrender.com` (from Step 3)

5. Click **Deploy**

### Step 5: Link Frontend to Backend

After both services are deployed:

1. Go to **Frontend Settings** → **Environment**
2. Update `VITE_API_URL` to match your backend URL
3. Trigger a redeploy by pushing a commit or manually redeploying

## Step 6: Access Your Application

Once both services are deployed:

- **Frontend**: `https://returniq-frontend.onrender.com` (your static site URL)
- **Backend API**: `https://returniq-backend.onrender.com/api` (your web service URL)

Open the frontend URL in your browser to access ReturnIQ.

## Important Notes

### Free Plan Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- No custom domain (unless upgraded)
- 1 GB storage per service

**Solution**: Upgrade to Starter ($7/month) for always-on services.

### Database Persistence

The application uses SQLite. For production, consider:

1. **PostgreSQL** (Render offers free PostgreSQL)
2. **MongoDB** (external service like MongoDB Atlas)

### Environment Variables

If needed, add to your services:

```
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=info
```

### Monitoring

- Check logs in Render dashboard
- Monitor service health from the dashboard
- Set up Slack notifications for deployment failures

## Troubleshooting

### Backend Service Won't Start

**Check logs**:
1. Go to Service → Logs
2. Look for errors like:
   - Missing dependencies
   - Port conflicts
   - Database connection issues

**Common fixes**:
```bash
# Ensure requirements.txt is in backend folder
# Ensure main.py is in backend folder
# Check Python version compatibility
```

### Frontend Can't Connect to Backend

**Solution**: 
1. Verify `VITE_API_URL` environment variable is set correctly
2. Ensure backend service is running (check Render dashboard)
3. Check browser console for CORS errors

If CORS issues occur, update backend `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Data Loss on Redeploy

SQLite data is lost when services are redeployed. For persistence:

1. Set up Render PostgreSQL
2. Update database configuration
3. Connect frontend and backend to PostgreSQL

## Upgrading Services

To upgrade from free to paid plans:

1. Go to Service Settings
2. Click **Change Plan**
3. Select desired plan (Starter $7/month or higher)
4. Redeploy service

## Custom Domain (Optional)

1. Go to Service Settings → Custom Domains
2. Add your domain (e.g., returniq.example.com)
3. Update DNS records as instructed
4. Wait for SSL certificate (usually instant)

## Next Steps

After deployment:

1. **Monitor Performance** - Check Render dashboard regularly
2. **Set Up Alerts** - Configure email notifications
3. **Connect Real Data** - Replace sample data with production data
4. **Optimize** - Move from free to starter plan for always-on performance
5. **Backup** - Set up regular database backups

## Support

- **Render Docs**: https://render.com/docs
- **Community**: https://community.render.com
- **Email Support**: support@render.com

## Cost Breakdown

| Service | Plan | Monthly Cost | Notes |
|---------|------|-------------|-------|
| Backend | Free | $0 | Hibernates after 15 min |
| Frontend | Free | $0 | Static site |
| **Total** | **Free** | **$0** | To start |
| Backend | Starter | $7 | Always-on |
| Frontend | Starter | $7 | Always-on |
| **Total** | **Starter** | **$14** | Production ready |

---

**Deployed?** Your ReturnIQ instance is now live and accessible from anywhere! 🚀
