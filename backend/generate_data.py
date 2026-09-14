import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

np.random.seed(42)

# Configuration
NUM_ORDERS = 10000
NUM_CUSTOMERS = 2000
NUM_PRODUCTS = 20

print("Generating ReturnIQ demo dataset...")

# Generate customers
customer_ids = [f"CUST{str(i).zfill(5)}" for i in range(1, NUM_CUSTOMERS + 1)]

# Generate products
categories = ['Electronics', 'Fashion', 'Home & Lifestyle', 'Beauty', 'Books']
products = []
for i in range(1, NUM_PRODUCTS + 1):
    products.append({
        'product_id': f"PROD{str(i).zfill(3)}",
        'category': np.random.choice(categories),
        'base_price': np.random.choice([299, 499, 799, 1299, 1999, 2999, 4999]),
        'base_rating': round(np.random.uniform(2.5, 4.8), 1),
        'return_propensity': np.random.uniform(0.05, 0.35)  # Some products are more likely to be returned
    })

products_df = pd.DataFrame(products)

# Generate orders
orders = []
start_date = datetime.now() - timedelta(days=365)

for i in range(1, NUM_ORDERS + 1):
    customer_id = np.random.choice(customer_ids)
    product = products_df.sample(1).iloc[0]
    
    # Customer return history (some customers return more)
    customer_return_rate = np.random.uniform(0, 0.5)
    customer_order_history = np.random.randint(1, 20)
    customer_return_count = int(customer_order_history * customer_return_rate)
    
    # Order details
    price = product['base_price']
    
    # Discount (higher discounts correlate with returns)
    discount_rate = np.random.choice([0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4], p=[0.3, 0.2, 0.15, 0.15, 0.1, 0.05, 0.05])
    discount = round(price * discount_rate, 2)
    
    # Rating variation
    product_rating = product['base_rating'] + np.random.uniform(-0.3, 0.3)
    product_rating = round(max(1.0, min(5.0, product_rating)), 1)
    
    # Delivery
    shipping_method = np.random.choice(['standard', 'express', 'economy'], p=[0.6, 0.3, 0.1])
    if shipping_method == 'express':
        delivery_days = np.random.randint(1, 3)
    elif shipping_method == 'standard':
        delivery_days = np.random.randint(3, 7)
    else:
        delivery_days = np.random.randint(7, 12)
    
    payment_method = np.random.choice(['card', 'upi', 'cod', 'wallet'], p=[0.5, 0.3, 0.15, 0.05])
    
    order_value = price - discount
    order_date = start_date + timedelta(days=np.random.randint(0, 365))
    
    # Calculate return probability based on risk factors
    return_prob = product['return_propensity']
    
    # Risk factors that increase return probability
    if customer_return_count > 2:
        return_prob += 0.15
    if discount_rate > 0.25:
        return_prob += 0.12
    if delivery_days > 5:
        return_prob += 0.10
    if product_rating < 3.5:
        return_prob += 0.15
    if product['category'] == 'Fashion':
        return_prob += 0.10
    if payment_method == 'cod':
        return_prob += 0.08
    
    return_prob = min(0.8, return_prob)  # Cap at 80%
    
    # Determine if returned
    returned = 1 if np.random.random() < return_prob else 0
    
    # Return reason if returned
    return_reasons = [
        'Wrong Size', 'Product Not as Expected', 'Damaged/Defective',
        'Better Price Elsewhere', 'Ordered by Mistake', 'Quality Issues',
        'Late Delivery', 'Changed Mind'
    ]
    
    return_reason = np.random.choice(return_reasons) if returned else None
    
    orders.append({
        'order_id': f"ORD{str(i).zfill(6)}",
        'customer_id': customer_id,
        'product_id': product['product_id'],
        'category': product['category'],
        'price': price,
        'discount': discount,
        'order_value': order_value,
        'product_rating': product_rating,
        'customer_return_count': customer_return_count,
        'delivery_days_estimate': delivery_days,
        'shipping_method': shipping_method,
        'payment_method': payment_method,
        'order_date': order_date.strftime('%Y-%m-%d'),
        'returned': returned,
        'return_reason': return_reason
    })

orders_df = pd.DataFrame(orders)

# Create data directory
os.makedirs('data', exist_ok=True)

# Save datasets
orders_df.to_csv('data/orders.csv', index=False)
products_df.to_csv('data/products.csv', index=False)

print(f"\n✓ Generated {len(orders_df)} orders")
print(f"✓ Generated {len(products_df)} products")
print(f"✓ Total returns: {orders_df['returned'].sum()} ({orders_df['returned'].mean()*100:.1f}%)")
print(f"✓ Categories: {', '.join(categories)}")
print(f"\nDataset saved to data/orders.csv and data/products.csv")
print("\nSample statistics:")
print(f"  - Average order value: ₹{orders_df['order_value'].mean():.2f}")
print(f"  - Return rate by category:")
for cat in categories:
    cat_returns = orders_df[orders_df['category'] == cat]['returned'].mean() * 100
    print(f"    • {cat}: {cat_returns:.1f}%")
