import numpy as np
import pandas as pd

class ExplainabilityEngine:
    """Lightweight explainability without SHAP dependency for demo"""
    
    def __init__(self):
        self.model = None
        self.feature_names = None
    
    def initialize(self, model, feature_names):
        """Initialize with trained model"""
        self.model = model
        self.feature_names = feature_names
    
    def explain_prediction(self, order_data, feature_names):
        """Generate explanation for prediction"""
        if self.model is None:
            return self._rule_based_explanation(order_data)
        
        # Get feature importance
        feature_importance = dict(zip(feature_names, self.model.feature_importances_))
        
        # Analyze key factors
        explanations = []
        
        # Customer return history
        return_count = order_data.get('customer_return_count', 0)
        if return_count > 2:
            explanations.append({
                'factor': 'Customer Return History',
                'value': f'{return_count} previous returns',
                'impact': 'increases risk',
                'contribution': 0.25
            })
        
        # Discount analysis
        discount_rate = (order_data.get('discount', 0) / order_data.get('price', 1)) * 100
        if discount_rate > 20:
            explanations.append({
                'factor': 'High Discount',
                'value': f'{discount_rate:.1f}% discount',
                'impact': 'increases risk',
                'contribution': 0.15
            })
        
        # Delivery time
        delivery_days = order_data.get('delivery_days_estimate', 0)
        if delivery_days > 5:
            explanations.append({
                'factor': 'Slow Delivery',
                'value': f'{delivery_days} days estimated',
                'impact': 'increases risk',
                'contribution': 0.12
            })
        
        # Product rating
        rating = order_data.get('product_rating', 5.0)
        if rating < 3.5:
            explanations.append({
                'factor': 'Low Product Rating',
                'value': f'{rating}/5.0 stars',
                'impact': 'increases risk',
                'contribution': 0.18
            })
        elif rating > 4.5:
            explanations.append({
                'factor': 'High Product Rating',
                'value': f'{rating}/5.0 stars',
                'impact': 'decreases risk',
                'contribution': -0.10
            })
        
        # Category risk
        category = order_data.get('category', '')
        high_risk_categories = ['Fashion', 'Apparel']
        if category in high_risk_categories:
            explanations.append({
                'factor': 'High-Risk Category',
                'value': category,
                'impact': 'increases risk',
                'contribution': 0.15
            })
        
        return {
            'top_factors': explanations[:5],
            'total_factors_analyzed': len(explanations)
        }
    
    def _rule_based_explanation(self, order_data):
        """Fallback rule-based explanation"""
        explanations = []
        
        if order_data.get('customer_return_count', 0) > 2:
            explanations.append({
                'factor': 'Customer Return History',
                'value': f"{order_data['customer_return_count']} returns",
                'impact': 'increases risk',
                'contribution': 0.3
            })
        
        discount_rate = (order_data.get('discount', 0) / order_data.get('price', 1)) * 100
        if discount_rate > 20:
            explanations.append({
                'factor': 'High Discount',
                'value': f'{discount_rate:.1f}%',
                'impact': 'increases risk',
                'contribution': 0.2
            })
        
        return {
            'top_factors': explanations,
            'total_factors_analyzed': len(explanations)
        }
