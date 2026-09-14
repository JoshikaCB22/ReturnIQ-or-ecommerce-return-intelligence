import pandas as pd
import numpy as np

class DataPipeline:
    def __init__(self):
        self.quality_report = {}
    
    def validate_data(self, df):
        """Validate and check data quality"""
        report = {
            'total_records': len(df),
            'missing_values': {},
            'duplicate_count': 0,
            'outliers': {},
            'data_types': {},
            'issues': []
        }
        
        # Missing values
        missing = df.isnull().sum()
        report['missing_values'] = {col: int(count) for col, count in missing.items() if count > 0}
        
        # Duplicates
        report['duplicate_count'] = int(df.duplicated().sum())
        
        # Data types
        report['data_types'] = {col: str(dtype) for col, dtype in df.dtypes.items()}
        
        # Outliers (simple IQR method for numeric columns)
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            outliers = ((df[col] < (Q1 - 1.5 * IQR)) | (df[col] > (Q3 + 1.5 * IQR))).sum()
            if outliers > 0:
                report['outliers'][col] = int(outliers)
        
        # Business logic validation
        if 'price' in df.columns:
            if (df['price'] <= 0).any():
                report['issues'].append("Some prices are zero or negative")
        
        if 'discount' in df.columns and 'price' in df.columns:
            if (df['discount'] > df['price']).any():
                report['issues'].append("Some discounts exceed product price")
        
        self.quality_report = report
        return report
    
    def clean_data(self, df):
        """Clean and preprocess data"""
        df_clean = df.copy()
        
        # Remove duplicates
        df_clean = df_clean.drop_duplicates()
        
        # Handle missing values
        numeric_cols = df_clean.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            df_clean[col] = df_clean[col].fillna(df_clean[col].median())
        
        categorical_cols = df_clean.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            df_clean[col] = df_clean[col].fillna(df_clean[col].mode()[0] if not df_clean[col].mode().empty else 'Unknown')
        
        # Cap outliers
        numeric_cols = df_clean.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            Q1 = df_clean[col].quantile(0.25)
            Q3 = df_clean[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            df_clean[col] = df_clean[col].clip(lower=lower_bound, upper=upper_bound)
        
        return df_clean
    
    def engineer_features(self, df):
        """Create additional features"""
        df_featured = df.copy()
        
        # Discount rate
        if 'discount' in df.columns and 'price' in df.columns:
            df_featured['discount_rate'] = (df['discount'] / df['price'] * 100).fillna(0)
        
        # Price categories
        if 'price' in df.columns:
            df_featured['price_category'] = pd.cut(
                df['price'],
                bins=[0, 500, 1000, 2000, float('inf')],
                labels=['Budget', 'Mid-Range', 'Premium', 'Luxury']
            )
        
        # Customer risk profile
        if 'customer_return_count' in df.columns:
            df_featured['customer_risk'] = df['customer_return_count'].apply(
                lambda x: 'Low' if x <= 1 else 'Medium' if x <= 3 else 'High'
            )
        
        return df_featured
