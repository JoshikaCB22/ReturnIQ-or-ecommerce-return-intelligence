# ReturnIQ Quick Start Guide

## Prerequisites

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- Command line access (Terminal on Mac/Linux, CMD/PowerShell on Windows)

## Installation (5 minutes)

### Option 1: Automated Setup (Recommended)

**On Windows:**
```bash
setup.bat
```

**On Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

**Step 1: Backend Setup**
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python generate_data.py
```

**Step 2: Frontend Setup**
```bash
cd frontend
npm install
```

## Running the Application

You need **two terminal windows**.

### Terminal 1: Start Backend
```bash
cd backend
# Activate virtual environment (if not already activated)
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
uvicorn main:app --reload
```

Backend will start at: `http://localhost:8000`

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will start at: `http://localhost:5173`

## Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## First-Time User Guide

### 1. Executive Dashboard (Home)
- View overall return metrics
- See KPI cards: return rate, high-risk orders, estimated costs
- Explore visualizations: trends, categories, return reasons

### 2. Try Return Risk Analysis
- Navigate to "Return Risk Analysis" in the sidebar
- Leave default values or modify them:
  - Category: Electronics
  - Price: ₹2000
  - Discount: ₹400
  - Customer Previous Returns: 3
  - Delivery Days: 5
- Click "Analyze Return Risk"
- Review:
  - Risk Score (0-100)
  - Financial Impact
  - Why this order is high risk (Explainable AI)
  - Recommended actions

### 3. Test the Prevention Simulator
- Navigate to "Prevention Simulator"
- Use sliders to adjust:
  - **Current Delivery Days: 6** → **Simulated: 3**
  - **Current Discount: ₹500** → **Simulated: ₹200**
  - **Current Rating: 3.5** → **Simulated: 4.5**
- Click "Run Simulation"
- See risk reduction and potential savings

### 4. Explore Product Intelligence
- Navigate to "Product Intelligence"
- View the Product Health Leaderboard
- Find products with low health scores
- Identify critical products needing attention

### 5. Check Customer Segments
- Navigate to "Customer Segments"
- View the distribution of:
  - Reliable Customers
  - Occasional Returners
  - Frequent Returners
  - High-Value High-Risk customers

### 6. Review Alerts
- Navigate to "Alerts & Warnings"
- See automatically detected issues:
  - High return rate products
  - Category spikes
  - Recommendations for each alert

### 7. Monitor Model Performance
- Navigate to "Model Performance"
- View model metrics:
  - Precision, Recall, F1-Score, ROC-AUC
  - Confusion Matrix
  - Feature Importance

### 8. Check Data Quality
- Navigate to "Data Quality"
- Review data health:
  - Total records
  - Missing values
  - Data quality score
  - Class balance

## Understanding the Demo Data

The system includes **10,000 synthetic orders** with realistic patterns:
- 20 products across 5 categories
- 2,000 customers with varied behavior
- ~38% return rate (realistic e-commerce baseline)
- Multiple return reasons
- Correlated risk factors

**This is demo data.** In production, replace it with your actual e-commerce data.

## Key Features to Try

### ✨ Explainable AI
Every prediction shows:
- Top contributing factors
- Impact direction (increases/decreases risk)
- Contribution percentage

### 💰 Financial Intelligence
Comprehensive cost calculation including:
- Shipping (reverse + forward)
- Handling
- Restocking
- Inventory holding
- Lost profit

### 🎯 What-If Simulator
Model business interventions:
- Faster delivery
- Lower discounts
- Improved product quality
- See ROI estimates

### 🏥 Product Health Scoring
0-100 score based on:
- Return rate (50%)
- Product rating (30%)
- Order volume (20%)

### 👥 Customer Segmentation
Behavioral clustering:
- Reliable Customers
- Occasional Returners
- Frequent Returners
- High-Value High-Risk

## API Testing

Backend API is available at `http://localhost:8000`

**Interactive API Documentation:**
```
http://localhost:8000/docs
```

**Example API Calls:**

Get KPIs:
```bash
curl http://localhost:8000/api/dashboard/kpis
```

Predict order risk:
```bash
curl -X POST http://localhost:8000/api/predict/order \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "PROD001",
    "category": "Electronics",
    "price": 2000,
    "discount": 400,
    "customer_return_count": 3,
    "delivery_days_estimate": 5,
    "shipping_method": "standard",
    "product_rating": 3.8,
    "order_value": 1600,
    "payment_method": "card"
  }'
```

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python --version`
- Activate virtual environment
- Install dependencies: `pip install -r requirements.txt`
- Generate data: `python generate_data.py`

### Frontend won't start
- Ensure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### "Module not found" errors
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

### Port already in use
- Backend (port 8000): Change in `uvicorn main:app --reload --port 8001`
- Frontend (port 5173): Automatically finds next available port

### No data displayed
- Ensure backend is running
- Check browser console for errors
- Verify `backend/data/orders.csv` exists
- Regenerate data: `python generate_data.py`

## Next Steps

### For Evaluation
1. Explore all 8 pages in the application
2. Try different scenarios in Risk Analysis
3. Run multiple simulations in Prevention Simulator
4. Review the comprehensive FEATURES.md document

### For Development
1. Review `backend/models.py` for ML implementation
2. Check `backend/main.py` for API endpoints
3. Explore `frontend/src/pages/` for UI components
4. Modify cost parameters in `backend/financial.py`

### For Production
1. Replace synthetic data with real data
2. Switch from SQLite to PostgreSQL
3. Add authentication & authorization
4. Set up proper hosting (AWS, GCP, Azure)
5. Configure production WSGI server
6. Implement monitoring and logging

## Key Files

```
returniq/
├── backend/
│   ├── main.py              # FastAPI application & endpoints
│   ├── models.py            # ML model training & prediction
│   ├── financial.py         # Cost calculation engine
│   ├── recommendations.py   # Recommendation engine
│   ├── explainability.py    # Explainable AI
│   ├── generate_data.py     # Demo data generator
│   └── data/
│       └── orders.csv       # Generated demo data
├── frontend/
│   └── src/
│       ├── App.tsx          # Main application
│       ├── pages/           # All page components
│       │   ├── Dashboard.tsx
│       │   ├── RiskAnalysis.tsx
│       │   ├── ProductIntelligence.tsx
│       │   ├── CustomerSegments.tsx
│       │   ├── Simulator.tsx
│       │   ├── Alerts.tsx
│       │   ├── DataQuality.tsx
│       │   └── ModelPerformance.tsx
│       └── index.css        # Styling
├── README.md               # Project overview
├── FEATURES.md            # Complete feature documentation
└── QUICKSTART.md          # This guide
```

## Support

For detailed feature documentation, see `FEATURES.md`

For technical implementation details, review the code comments in:
- `backend/models.py` - Machine learning
- `backend/main.py` - API endpoints
- `frontend/src/App.tsx` - UI structure

## Demo Credentials

This is a demo application without authentication.
For production deployment, implement proper user management.

---

**You're ready to explore ReturnIQ!** Start with the Executive Dashboard and work through each feature systematically.
