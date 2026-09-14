from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import pandas as pd
import json

from models import ReturnRiskModel
from data_pipeline import DataPipeline
from explainability import ExplainabilityEngine
from financial import FinancialCalculator
from recommendations import RecommendationEngine

app = FastAPI(title="ReturnIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
model = ReturnRiskModel()
pipeline = DataPipeline()
explainer = ExplainabilityEngine()
financial = FinancialCalculator()
recommender = RecommendationEngine()

# Load demo data and train model on startup
@app.on_event("startup")
async def startup_event():
    try:
        df = pd.read_csv("data/orders.csv")
        print(f"Loaded {len(df)} orders")
        model.train(df)
        explainer.initialize(model.model, model.feature_names)
        print("Model trained and ready")
    except FileNotFoundError:
        print("No data file found. Run generate_data.py first")

class OrderPredictionRequest(BaseModel):
    product_id: str
    category: str
    price: float
    discount: float
    customer_return_count: int
    delivery_days_estimate: int
    shipping_method: str
    product_rating: float
    order_value: float
    payment_method: str

class WhatIfSimulation(BaseModel):
    order_id: Optional[str] = None
    current_delivery_days: int
    simulated_delivery_days: int
    current_discount: float
    simulated_discount: float
    current_product_rating: float
    simulated_product_rating: float

@app.get("/")
def root():
    return {"message": "ReturnIQ API", "status": "operational"}

@app.get("/api/dashboard/kpis")
def get_kpis():
    try:
        df = pd.read_csv("data/orders.csv")
        
        total_orders = len(df)
        total_returns = df['returned'].sum()
        return_rate = (total_returns / total_orders * 100) if total_orders > 0 else 0
        
        predictions = model.predict_batch(df)
        high_risk_orders = sum(1 for p in predictions if p['risk_score'] >= 70)
        predicted_returns = sum(p['return_probability'] for p in predictions)
        
        estimated_return_cost = sum(
            financial.calculate_return_cost(row['price'], row['category']) * predictions[i]['return_probability']
            for i, (_, row) in enumerate(df.iterrows())
        )
        
        profit_at_risk = estimated_return_cost * 0.3
        potential_savings = estimated_return_cost * 0.15
        
        return {
            "total_orders": total_orders,
            "total_returns": int(total_returns),
            "return_rate": round(return_rate, 2),
            "high_risk_orders": high_risk_orders,
            "predicted_returns": round(predicted_returns, 1),
            "estimated_return_cost": round(estimated_return_cost, 2),
            "profit_at_risk": round(profit_at_risk, 2),
            "potential_savings": round(potential_savings, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/trends")
def get_trends():
    try:
        df = pd.read_csv("data/orders.csv")
        df['order_date'] = pd.to_datetime(df['order_date'])
        
        trends = df.groupby(df['order_date'].dt.to_period('M')).agg({
            'order_id': 'count',
            'returned': 'sum'
        }).reset_index()
        
        trends['return_rate'] = (trends['returned'] / trends['order_id'] * 100).round(2)
        trends['month'] = trends['order_date'].astype(str)
        
        return trends[['month', 'order_id', 'returned', 'return_rate']].to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/return-by-category")
def get_return_by_category():
    try:
        df = pd.read_csv("data/orders.csv")
        
        category_stats = df.groupby('category').agg({
            'order_id': 'count',
            'returned': 'sum'
        }).reset_index()
        
        category_stats['return_rate'] = (category_stats['returned'] / category_stats['order_id'] * 100).round(2)
        category_stats.columns = ['category', 'total_orders', 'returns', 'return_rate']
        
        return category_stats.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/return-reasons")
def get_return_reasons():
    try:
        df = pd.read_csv("data/orders.csv")
        returns_df = df[df['returned'] == 1]
        
        if 'return_reason' in returns_df.columns:
            reasons = returns_df['return_reason'].value_counts().head(10)
            return [{"reason": k, "count": int(v)} for k, v in reasons.items()]
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict/order")
def predict_order(request: OrderPredictionRequest):
    try:
        prediction = model.predict_single(request.dict())
        
        explanation = explainer.explain_prediction(
            request.dict(),
            model.feature_names
        )
        
        return_cost = financial.calculate_return_cost(request.price, request.category)
        expected_loss = return_cost * prediction['return_probability']
        
        recommendations = recommender.generate_recommendations(
            prediction,
            explanation,
            request.dict()
        )
        
        return {
            "risk_score": prediction['risk_score'],
            "risk_level": prediction['risk_level'],
            "return_probability": prediction['return_probability'],
            "confidence": prediction['confidence'],
            "explanation": explanation,
            "financial_impact": {
                "product_value": request.price,
                "return_cost": round(return_cost, 2),
                "expected_loss": round(expected_loss, 2),
                "profit_at_risk": round(expected_loss * 0.3, 2)
            },
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/simulate/what-if")
def simulate_what_if(simulation: WhatIfSimulation):
    try:
        result = model.simulate_intervention(simulation.dict())
        
        savings = result['current_expected_loss'] - result['simulated_expected_loss']
        roi_estimate = savings * 10
        
        return {
            **result,
            "potential_savings": round(savings, 2),
            "estimated_roi": round(roi_estimate, 2),
            "risk_reduction_percentage": round(
                (result['current_risk'] - result['simulated_risk']) / result['current_risk'] * 100, 1
            ) if result['current_risk'] > 0 else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products/health")
def get_product_health():
    try:
        df = pd.read_csv("data/orders.csv")
        
        product_stats = df.groupby('product_id').agg({
            'order_id': 'count',
            'returned': 'sum',
            'price': 'mean',
            'product_rating': 'mean'
        }).reset_index()
        
        product_stats['return_rate'] = (product_stats['returned'] / product_stats['order_id'] * 100).round(2)
        
        product_stats['health_score'] = (
            (100 - product_stats['return_rate']) * 0.5 +
            product_stats['product_rating'] * 10 * 0.3 +
            (product_stats['order_id'] / product_stats['order_id'].max() * 100) * 0.2
        ).round(0)
        
        product_stats['status'] = product_stats['health_score'].apply(
            lambda x: 'HEALTHY' if x >= 75 else 'WATCH' if x >= 50 else 'AT RISK' if x >= 25 else 'CRITICAL'
        )
        
        product_stats.columns = ['product_id', 'total_orders', 'returns', 'avg_price', 'avg_rating', 'return_rate', 'health_score', 'status']
        
        return product_stats.sort_values('health_score').to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/customers/segments")
def get_customer_segments():
    try:
        df = pd.read_csv("data/orders.csv")
        
        customer_stats = df.groupby('customer_id').agg({
            'order_id': 'count',
            'returned': 'sum',
            'price': 'sum'
        }).reset_index()
        
        customer_stats['return_rate'] = (customer_stats['returned'] / customer_stats['order_id'] * 100).round(2)
        
        customer_stats['segment'] = customer_stats.apply(
            lambda x: 'Reliable Customers' if x['return_rate'] < 10 else
                     'Occasional Returners' if x['return_rate'] < 30 else
                     'Frequent Returners' if x['price'] < 500 else
                     'High-Value High-Risk',
            axis=1
        )
        
        segments = customer_stats.groupby('segment').agg({
            'customer_id': 'count',
            'order_id': 'sum',
            'returned': 'sum',
            'return_rate': 'mean'
        }).reset_index()
        
        segments.columns = ['segment', 'customer_count', 'total_orders', 'total_returns', 'avg_return_rate']
        
        return segments.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/alerts")
def get_alerts():
    alerts = []
    
    try:
        df = pd.read_csv("data/orders.csv")
        
        # High return rate products
        product_returns = df.groupby('product_id').agg({
            'returned': lambda x: (x.sum() / len(x) * 100)
        }).reset_index()
        
        high_return_products = product_returns[product_returns['returned'] > 25]
        
        for _, row in high_return_products.iterrows():
            alerts.append({
                "type": "high_return_rate",
                "severity": "critical",
                "message": f"Product {row['product_id']} has {row['returned']:.1f}% return rate",
                "recommendation": "Review product quality, description, and images"
            })
        
        # Category spikes
        category_returns = df.groupby('category')['returned'].mean() * 100
        if category_returns.max() > 20:
            max_cat = category_returns.idxmax()
            alerts.append({
                "type": "category_spike",
                "severity": "warning",
                "message": f"{max_cat} category experiencing elevated returns ({category_returns.max():.1f}%)",
                "recommendation": "Investigate common issues in this category"
            })
        
        return alerts[:10]
    except Exception as e:
        return []

@app.get("/api/model/performance")
def get_model_performance():
    try:
        metrics = model.get_performance_metrics()
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/data/quality")
def get_data_quality():
    try:
        df = pd.read_csv("data/orders.csv")
        
        # Convert numpy types to native Python types for JSON serialization
        missing_values = df.isnull().sum()
        missing_dict = {col: int(count) for col, count in missing_values.items()}
        
        quality_report = {
            "total_records": int(len(df)),
            "missing_values": missing_dict,
            "duplicate_records": int(df.duplicated().sum()),
            "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "class_balance": {
                "returned": int(df['returned'].sum()),
                "not_returned": int((1 - df['returned']).sum()),
                "imbalance_ratio": float(round(df['returned'].mean(), 3))
            }
        }
        
        return quality_report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
