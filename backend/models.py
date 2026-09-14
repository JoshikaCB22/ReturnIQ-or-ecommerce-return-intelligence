import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import pickle
import os

class ReturnRiskModel:
    def __init__(self):
        self.model = None
        self.feature_names = []
        self.label_encoders = {}
        self.performance_metrics = {}
        
    def prepare_features(self, df):
        """Prepare features for training or prediction"""
        feature_df = df.copy()
        
        # Categorical encoding
        categorical_cols = ['category', 'shipping_method', 'payment_method']
        
        for col in categorical_cols:
            if col in feature_df.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    self.label_encoders[col].fit(feature_df[col])
                
                feature_df[col + '_encoded'] = self.label_encoders[col].transform(feature_df[col])
        
        # Feature engineering
        feature_df['discount_rate'] = (feature_df['discount'] / feature_df['price'] * 100).fillna(0)
        feature_df['high_discount'] = (feature_df['discount_rate'] > 20).astype(int)
        feature_df['low_rating'] = (feature_df['product_rating'] < 3.5).astype(int)
        feature_df['slow_delivery'] = (feature_df['delivery_days_estimate'] > 5).astype(int)
        feature_df['frequent_returner'] = (feature_df['customer_return_count'] > 2).astype(int)
        
        # Select features
        self.feature_names = [
            'price', 'discount', 'discount_rate', 'customer_return_count',
            'delivery_days_estimate', 'product_rating', 'order_value',
            'category_encoded', 'shipping_method_encoded', 'payment_method_encoded',
            'high_discount', 'low_rating', 'slow_delivery', 'frequent_returner'
        ]
        
        return feature_df[self.feature_names]
    
    def train(self, df):
        """Train the return risk model"""
        print("Training return risk model...")
        
        if 'returned' not in df.columns:
            raise ValueError("Training data must include 'returned' column")
        
        X = self.prepare_features(df)
        y = df['returned']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=20,
            min_samples_leaf=10,
            class_weight='balanced',
            random_state=42
        )
        
        self.model.fit(X_train, y_train)
        
        # Calculate performance metrics
        y_pred = self.model.predict(X_test)
        y_pred_proba = self.model.predict_proba(X_test)[:, 1]
        
        self.performance_metrics = {
            'precision': round(precision_score(y_test, y_pred), 3),
            'recall': round(recall_score(y_test, y_pred), 3),
            'f1_score': round(f1_score(y_test, y_pred), 3),
            'roc_auc': round(roc_auc_score(y_test, y_pred_proba), 3),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist()
        }
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        self.performance_metrics['feature_importance'] = feature_importance.to_dict('records')
        
        print(f"Model trained. ROC-AUC: {self.performance_metrics['roc_auc']}")
        
        return self.performance_metrics
    
    def predict_single(self, order_data):
        """Predict return risk for a single order"""
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Convert to DataFrame
        df = pd.DataFrame([order_data])
        
        X = self.prepare_features(df)
        
        proba = self.model.predict_proba(X)[0, 1]
        risk_score = int(proba * 100)
        
        if risk_score >= 70:
            risk_level = "HIGH"
        elif risk_score >= 40:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        return {
            'return_probability': round(proba, 3),
            'risk_score': risk_score,
            'risk_level': risk_level,
            'confidence': round(max(proba, 1 - proba), 3)
        }
    
    def predict_batch(self, df):
        """Predict return risk for multiple orders"""
        if self.model is None:
            raise ValueError("Model not trained.")
        
        X = self.prepare_features(df)
        probas = self.model.predict_proba(X)[:, 1]
        
        predictions = []
        for proba in probas:
            risk_score = int(proba * 100)
            
            if risk_score >= 70:
                risk_level = "HIGH"
            elif risk_score >= 40:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
            
            predictions.append({
                'return_probability': round(proba, 3),
                'risk_score': risk_score,
                'risk_level': risk_level,
                'confidence': round(max(proba, 1 - proba), 3)
            })
        
        return predictions
    
    def simulate_intervention(self, simulation_params):
        """Simulate what-if scenarios"""
        # Current scenario
        current_data = {
            'price': simulation_params.get('price', 1000),
            'discount': simulation_params.get('current_discount', 200),
            'delivery_days_estimate': simulation_params.get('current_delivery_days', 5),
            'product_rating': simulation_params.get('current_product_rating', 3.5),
            'customer_return_count': simulation_params.get('customer_return_count', 2),
            'order_value': simulation_params.get('order_value', 1000),
            'category': simulation_params.get('category', 'Electronics'),
            'shipping_method': simulation_params.get('shipping_method', 'standard'),
            'payment_method': simulation_params.get('payment_method', 'card')
        }
        
        current_prediction = self.predict_single(current_data)
        
        # Simulated scenario
        simulated_data = current_data.copy()
        simulated_data['delivery_days_estimate'] = simulation_params.get('simulated_delivery_days', 3)
        simulated_data['discount'] = simulation_params.get('simulated_discount', 100)
        simulated_data['product_rating'] = simulation_params.get('simulated_product_rating', 4.5)
        
        simulated_prediction = self.predict_single(simulated_data)
        
        from financial import FinancialCalculator
        calc = FinancialCalculator()
        
        return_cost = calc.calculate_return_cost(
            current_data['price'],
            current_data['category']
        )
        
        return {
            'current_risk': current_prediction['risk_score'],
            'current_probability': current_prediction['return_probability'],
            'current_expected_loss': round(return_cost * current_prediction['return_probability'], 2),
            'simulated_risk': simulated_prediction['risk_score'],
            'simulated_probability': simulated_prediction['return_probability'],
            'simulated_expected_loss': round(return_cost * simulated_prediction['return_probability'], 2)
        }
    
    def get_performance_metrics(self):
        """Return model performance metrics"""
        return self.performance_metrics
    
    def save(self, path='model.pkl'):
        """Save model to disk"""
        with open(path, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'feature_names': self.feature_names,
                'label_encoders': self.label_encoders,
                'performance_metrics': self.performance_metrics
            }, f)
    
    def load(self, path='model.pkl'):
        """Load model from disk"""
        with open(path, 'rb') as f:
            data = pickle.load(f)
            self.model = data['model']
            self.feature_names = data['feature_names']
            self.label_encoders = data['label_encoders']
            self.performance_metrics = data['performance_metrics']
