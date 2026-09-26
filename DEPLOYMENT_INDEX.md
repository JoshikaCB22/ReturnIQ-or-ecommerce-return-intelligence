# ReturnIQ - Deployment Documentation Index

## 🚀 Quick Links

### Start Here
- **Want to deploy NOW?** → [RENDER_QUICK_SETUP.md](./RENDER_QUICK_SETUP.md) (5-minute deployment)
- **Want detailed instructions?** → [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) (comprehensive guide)
- **Want to see architecture?** → See artifacts (visual guides available in IDE)

### Local Development
- **Backend API**: `http://localhost:8000`
- **Frontend App**: `http://localhost:5173`
- **Setup**: See [QUICKSTART.md](./QUICKSTART.md)

### Cloud Deployment
- **Platform**: Render.com (render.com)
- **Time to Deploy**: 5-10 minutes
- **Cost**: Free to start ($0), Starter tier ($14/month)

---

## 📚 Documentation Files

### Render Deployment Guides
| File | Purpose | Read Time |
|------|---------|-----------|
| **RENDER_QUICK_SETUP.md** | Step-by-step deployment guide with screenshots | 10 min |
| **RENDER_DEPLOYMENT.md** | Comprehensive guide with troubleshooting | 20 min |
| **DEPLOYMENT_INDEX.md** | This file - navigation guide | 5 min |

### Project Documentation
| File | Purpose | Status |
|------|---------|--------|
| **README.md** | Project overview | ✅ Updated |
| **QUICKSTART.md** | Local development setup | ✅ Current |
| **PROJECT_SUMMARY.md** | Project details | ✅ Available |
| **GITHUB_SETUP.md** | GitHub setup instructions | ✅ Available |

---

## 🎯 Deployment Scenarios

### Scenario 1: "I just want it live ASAP"
1. Open [RENDER_QUICK_SETUP.md](./RENDER_QUICK_SETUP.md)
2. Follow the 5 deployment steps
3. Your app is live in 5-10 minutes
4. Share the URL with your team

**Time**: 5-10 minutes  
**Cost**: $0 (free tier)

### Scenario 2: "I want to understand everything first"
1. Read [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
2. Understand architecture and configuration
3. Learn about troubleshooting
4. Then follow deployment steps

**Time**: 20-30 minutes  
**Cost**: $0 (free tier)

### Scenario 3: "I need production-ready setup"
1. Deploy to free tier first (test)
2. Upgrade to Starter tier ($7/month × 2 = $14)
3. Set up PostgreSQL database ($15/month)
4. Configure monitoring and alerts
5. Add custom domain (optional)

**Time**: 30 minutes  
**Cost**: $29/month (starter + database)

---

## 🔄 Deployment Workflow

```
1. Create Render Account (2 min)
   └─ Go to render.com
   └─ Sign up with GitHub
   └─ Connect your repo

2. Deploy Backend (3 min)
   └─ Create Web Service
   └─ Configure Python environment
   └─ Start service
   └─ Copy backend URL

3. Deploy Frontend (3 min)
   └─ Create Static Site
   └─ Configure build command
   └─ Set VITE_API_URL environment variable
   └─ Deploy

4. Test Application (2 min)
   └─ Open frontend URL
   └─ Test all pages
   └─ Verify backend connectivity

5. Share & Monitor
   └─ Share URL with team
   └─ Monitor on Render dashboard
   └─ Set up alerts

Total Time: 5-10 minutes
```

---

## 📦 What's Been Configured

### Configuration Files
```
✅ render.yaml              - Deployment config
✅ build.sh                 - Build script
✅ frontend/.env.production - Frontend env
✅ backend/.env.production  - Backend env
✅ frontend/src/config/api.ts - API config
✅ frontend/src/services/api.ts - API client
```

### Key Features
- ✅ Automatic deployments from GitHub
- ✅ Environment-based API URL
- ✅ CORS configured
- ✅ Error handling and logging
- ✅ Production-ready setup
- ✅ Database-ready for upgrades

---

## 💡 Key Configuration Details

### Frontend Environment
```env
VITE_API_URL=https://returniq-backend.onrender.com
```
- Automatically set during deployment
- Frontend auto-connects to backend
- Works on localhost too

### Backend Endpoints
```
GET    /api/dashboard/kpis
GET    /api/dashboard/trends
GET    /api/predict/order
POST   /api/simulate/what-if
GET    /api/customers/segments
GET    /api/products/health
GET    /api/data/quality
GET    /api/model/performance
GET    /api/alerts
```

### API Client
- Axios with interceptors
- Error handling
- Request/response logging
- CORS support

---

## ⚡ Features by Tier

| Feature | Free | Starter | Notes |
|---------|------|---------|-------|
| Hosting | ✅ | ✅ | |
| Auto Deploy | ✅ | ✅ | GitHub integration |
| HTTPS/SSL | ✅ | ✅ | Automatic |
| Monitoring | ✅ | ✅ | Dashboard + logs |
| Custom Domain | ❌ | ✅ | $10/month |
| Always-On | ❌ | ✅ | Free sleeps after 15 min |
| 24/7 Support | ❌ | ✅ | Email support |
| Uptime SLA | - | 99.9% | Service credits |

---

## 🆘 Troubleshooting Quick Links

### Common Issues

**"App won't load"**
- Check: Frontend deployment logs in Render
- Fix: Redeploy frontend

**"Can't connect to backend"**
- Check: `VITE_API_URL` environment variable
- Check: Backend service is running
- Fix: Wait 30 seconds (service might be sleeping)

**"Everything loads but slow"**
- Cause: Free tier service sleeping
- Fix: Wait 30 seconds first request, then fast
- Permanent: Upgrade to Starter tier

**"Data disappeared after redeploy"**
- Cause: SQLite doesn't persist
- Fix: Upgrade to PostgreSQL

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed troubleshooting.

---

## 📞 Support & Resources

### Render Resources
- **Render Docs**: https://render.com/docs
- **Status Page**: https://status.render.com
- **Community**: https://community.render.com
- **Email**: support@render.com

### Your Resources
- **GitHub Repo**: See settings for connected repo
- **Deployment Guides**: RENDER_DEPLOYMENT.md, RENDER_QUICK_SETUP.md
- **Local Dev**: QUICKSTART.md

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [ ] GitHub account created
- [ ] Render account created
- [ ] Repository pushed to GitHub
- [ ] Both backend and frontend working locally
- [ ] No sensitive data in .env files
- [ ] All required files in place (requirements.txt, package.json)

---

## 🎯 Recommended Path

### For Quick Demo
1. Go to [RENDER_QUICK_SETUP.md](./RENDER_QUICK_SETUP.md)
2. Follow 5 deployment steps
3. Get URL working in 5-10 minutes

### For Production
1. Deploy to free tier first
2. Test thoroughly
3. Upgrade to Starter tier
4. Set up PostgreSQL
5. Configure monitoring
6. Add custom domain if needed

### For Understanding
1. Read [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) first
2. Understand architecture
3. Know troubleshooting steps
4. Then deploy with confidence

---

## 📊 Deployment Status

| Component | Status | Location |
|-----------|--------|----------|
| Backend API | ✅ Ready | GitHub `/backend` |
| Frontend App | ✅ Ready | GitHub `/frontend` |
| Render Config | ✅ Ready | `render.yaml` |
| Environment Setup | ✅ Ready | `.env.production` files |
| Documentation | ✅ Complete | This folder |

---

## 🎉 Ready to Deploy?

1. **Quick Path**: Open [RENDER_QUICK_SETUP.md](./RENDER_QUICK_SETUP.md) right now
2. **Detailed Path**: Open [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
3. **Resources**: Check links above

**Your ReturnIQ is ready for the cloud! 🚀**

---

Last Updated: September 2026  
Documentation Version: 2.0  
Ready for Deployment: ✅ YES
