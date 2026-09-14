# How to Push ReturnIQ to GitHub

## Step-by-Step Instructions

### 1. Initialize Git Repository (if not already done)

Open PowerShell in your project root directory and run:

```powershell
cd "C:\Users\JOSHIKA S\Desktop\Ecommerce Intelligence System"
git init
```

### 2. Configure Git (First Time Only)

Set your name and email:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Add All Files to Git

```powershell
git add .
```

### 4. Create Initial Commit

```powershell
git commit -m "Initial commit: ReturnIQ - E-Commerce Return Risk Intelligence System"
```

### 5. Create GitHub Repository

1. Go to https://github.com
2. Click the **+** icon (top right)
3. Select **New repository**
4. Repository name: `ReturnIQ` or `ecommerce-return-intelligence`
5. Description: `AI-powered e-commerce return risk prediction and profit optimization system`
6. Choose **Public** or **Private**
7. **DO NOT** initialize with README (you already have one)
8. Click **Create repository**

### 6. Link Local Repository to GitHub

GitHub will show you commands. Use these (replace with your actual GitHub username):

```powershell
git remote add origin https://github.com/YOUR-USERNAME/ReturnIQ.git
git branch -M main
git push -u origin main
```

### 7. Verify Upload

1. Refresh your GitHub repository page
2. You should see all files uploaded
3. The README.md will display automatically

## Alternative: Using GitHub Desktop (Easier)

### Option 1: GitHub Desktop (Recommended for Beginners)

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Click **File** → **Add local repository**
4. Select your project folder: `C:\Users\JOSHIKA S\Desktop\Ecommerce Intelligence System`
5. Click **Publish repository**
6. Choose name and visibility
7. Click **Publish**

Done! ✅

## What Gets Uploaded

Your repository will include:

### Source Code
- ✅ Backend (Python/FastAPI) - 7 files
- ✅ Frontend (React/TypeScript) - 11 files
- ✅ Configuration files
- ✅ Documentation (5 markdown files)

### Data Files
- ✅ orders.csv (10,000 orders) - **Will be uploaded**
- ✅ products.csv (20 products) - **Will be uploaded**

### Excluded Files (via .gitignore)
- ❌ node_modules/ (too large, can be reinstalled)
- ❌ venv/ (virtual environment, can be recreated)
- ❌ __pycache__/ (Python cache files)
- ❌ .env files (sensitive data)

## Repository Structure on GitHub

```
ReturnIQ/
├── README.md                    ← Displays on GitHub homepage
├── QUICKSTART.md               ← Setup instructions
├── FEATURES.md                 ← Complete feature list
├── PROJECT_SUMMARY.md          ← Technical report
├── COMPLETION_CHECKLIST.md     ← Verification checklist
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── financial.py
│   ├── recommendations.py
│   ├── explainability.py
│   ├── data_pipeline.py
│   ├── generate_data.py
│   ├── requirements.txt
│   └── data/
│       ├── orders.csv
│       └── products.csv
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   └── pages/
│   ├── package.json
│   └── vite.config.ts
└── .gitignore
```

## Troubleshooting

### Error: "git is not recognized"
Install Git from: https://git-scm.com/download/win

### Error: "Permission denied"
Use HTTPS instead of SSH:
```powershell
git remote set-url origin https://github.com/YOUR-USERNAME/ReturnIQ.git
```

### Error: "Large files"
The CSV files are included and should upload fine (< 5 MB total).
If issues occur, Git LFS can handle large files.

### Error: "Remote already exists"
Remove and re-add:
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/ReturnIQ.git
```

## After Pushing

### Update README Badge (Optional)

Add this at the top of README.md:

```markdown
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
```

### Enable GitHub Pages (Optional)

To host documentation:
1. Go to repository **Settings**
2. Scroll to **Pages**
3. Select **main** branch
4. Save

### Create Release (Optional)

1. Go to **Releases**
2. Click **Create a new release**
3. Tag: `v1.0.0`
4. Title: `ReturnIQ v1.0 - Initial Release`
5. Description: Copy from PROJECT_SUMMARY.md
6. Click **Publish release**

## Sharing Your Project

### GitHub Repository URL
```
https://github.com/YOUR-USERNAME/ReturnIQ
```

### Clone Command (for others)
```bash
git clone https://github.com/YOUR-USERNAME/ReturnIQ.git
cd ReturnIQ
```

### For Evaluators
Share this link:
```
https://github.com/YOUR-USERNAME/ReturnIQ
```

They'll see:
- Complete source code
- Documentation
- Setup instructions
- Project structure

## Keeping It Updated

After making changes:

```powershell
git add .
git commit -m "Description of changes"
git push
```

---

**Need Help?** 
- GitHub Docs: https://docs.github.com
- Git Basics: https://git-scm.com/doc
- GitHub Desktop Help: https://docs.github.com/en/desktop
