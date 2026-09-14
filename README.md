# ReturnIQ — E-Commerce Return Risk & Profit Intelligence System

**PREDICT → EXPLAIN → QUANTIFY → SIMULATE → PREVENT → OPTIMIZE**

ReturnIQ is a production-quality ML-powered platform that helps e-commerce businesses move from reactive return management to proactive return prevention and profit optimization.

## Core Capabilities

- **Return Risk Prediction**: ML-powered risk scoring (0-100) for every order
- **Explainable AI**: Understand why orders are flagged as high-risk using SHAP
- **Financial Impact**: Calculate total return costs beyond just refunds
- **What-If Simulator**: Simulate business interventions and estimate ROI
- **Prevention Engine**: Generate actionable recommendations based on root causes
- **Product Health Scoring**: Identify products causing the greatest financial damage
- **Customer Intelligence**: Segment customers by return behavior patterns
- **Early Warning System**: Detect anomalies and emerging return trends

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Python + FastAPI
- **ML**: Scikit-learn + CatBoost + SHAP
- **Data**: Pandas + NumPy
- **Database**: SQLite (PostgreSQL-ready)
- **Visualization**: Recharts + Plotly

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│                   (React + TypeScript)                      │
├─────────────────────────────────────────────────────────────┤
│  Dashboard  │ Risk Analysis │ Products │ Customers │ More  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
┌──────────────────────▼──────────────────────────────────────┐
│                   FASTAPI BACKEND                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   ML Model   │  │  Financial   │  │ Recommendation  │  │
│  │  (RF-0.85)   │  │  Calculator  │  │     Engine      │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Explainable  │  │   Customer   │  │   What-If       │  │
│  │     AI       │  │ Segmentation │  │   Simulator     │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│   Orders (10K)  │  Products (20)  │  Predictions  │  Cache  │
└─────────────────────────────────────────────────────────────┘

WORKFLOW: DATA → VALIDATE → ENGINEER → PREDICT → EXPLAIN → 
          CALCULATE → RECOMMEND → SIMULATE → DASHBOARD
```

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python generate_data.py  # Generate demo dataset
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Access the application at `http://localhost:5173`

## Project Structure

```
returniq/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── models.py               # ML models & training
│   ├── data_pipeline.py        # Data processing
│   ├── explainability.py       # SHAP explanations
│   ├── financial.py            # Cost calculations
│   ├── recommendations.py      # Prevention engine
│   ├── database.py             # Database models
│   └── generate_data.py        # Demo data generator
├── frontend/
│   └── src/
│       ├── components/         # React components
│       ├── pages/              # Page components
│       ├── services/           # API services
│       └── types/              # TypeScript types
└── data/                       # Data storage
```

## Business Questions Answered

1. **Which orders are likely to be returned?** → Return Risk Score
2. **Why are they likely to be returned?** → Explainable AI
3. **How much money could the business lose?** → Financial Impact
4. **What action can prevent the return?** → Recommendation Engine
5. **How much money could be saved?** → What-If Simulator

## Key Features

### Executive Dashboard
- KPI cards with real-time metrics
- Interactive visualizations
- Multi-dimensional filtering
- Drill-down capabilities

### Return Risk Analysis
- Order-level risk scoring
- Contributing factor analysis
- Confidence intervals
- Visual risk indicators

### Financial Intelligence
- Multi-component cost calculation
- Profit-at-risk analysis
- Expected loss modeling
- Savings projection

### Prevention Simulator
- Interactive what-if scenarios
- ROI estimation
- Risk reduction calculation
- Parameter sensitivity analysis

### Product Intelligence
- Product health scoring
- Return performance leaderboard
- Category-level insights
- Root cause identification

### Customer Segmentation
- K-means clustering
- Behavioral analysis
- Segment profiling
- Risk stratification

## Demo Dataset

The application includes a synthetic dataset with realistic e-commerce patterns:
- 10,000 orders
- 20 products across 5 categories
- 2,000 customers
- Realistic return patterns (15-20% return rate)
- Multiple return reasons
- Financial and behavioral features

Replace with real data by updating the data pipeline.

## Model Performance

Current demo models achieve:
- **Precision**: ~0.75
- **Recall**: ~0.70
- **F1-Score**: ~0.72
- **ROC-AUC**: ~0.85

Performance varies with data quality and volume.

## License

MIT License
