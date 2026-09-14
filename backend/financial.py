class FinancialCalculator:
    def __init__(self):
        # Default cost parameters (configurable)
        self.cost_params = {
            'reverse_shipping_rate': 0.08,  # 8% of product price
            'forward_shipping_rate': 0.06,   # 6% of product price
            'handling_cost': 50,              # Fixed handling cost
            'restocking_cost_rate': 0.05,    # 5% of product price
            'packaging_cost': 30,             # Fixed packaging cost
            'inventory_holding_rate': 0.02,  # 2% of product price per month
            'discount_loss_rate': 1.0,       # 100% of discount is lost
            'profit_margin_rate': 0.30       # 30% profit margin
        }
    
    def calculate_return_cost(self, product_price, category=None, discount=0):
        """Calculate comprehensive return cost"""
        
        # Category-specific adjustments
        category_multipliers = {
            'Electronics': 1.2,      # Higher handling costs
            'Fashion': 0.9,          # Lower handling costs
            'Home & Lifestyle': 1.0,
            'Beauty': 0.8,
            'Books': 0.7
        }
        
        multiplier = category_multipliers.get(category, 1.0)
        
        # Calculate individual cost components
        reverse_shipping = product_price * self.cost_params['reverse_shipping_rate']
        forward_shipping = product_price * self.cost_params['forward_shipping_rate']
        handling = self.cost_params['handling_cost'] * multiplier
        restocking = product_price * self.cost_params['restocking_cost_rate']
        packaging = self.cost_params['packaging_cost']
        inventory_holding = product_price * self.cost_params['inventory_holding_rate']
        discount_loss = discount * self.cost_params['discount_loss_rate']
        lost_profit = product_price * self.cost_params['profit_margin_rate']
        
        total_cost = (
            reverse_shipping +
            forward_shipping +
            handling +
            restocking +
            packaging +
            inventory_holding +
            discount_loss +
            lost_profit
        )
        
        return total_cost
    
    def calculate_detailed_breakdown(self, product_price, category=None, discount=0):
        """Return detailed cost breakdown"""
        category_multipliers = {
            'Electronics': 1.2,
            'Fashion': 0.9,
            'Home & Lifestyle': 1.0,
            'Beauty': 0.8,
            'Books': 0.7
        }
        
        multiplier = category_multipliers.get(category, 1.0)
        
        breakdown = {
            'product_value': round(product_price, 2),
            'reverse_shipping': round(product_price * self.cost_params['reverse_shipping_rate'], 2),
            'forward_shipping': round(product_price * self.cost_params['forward_shipping_rate'], 2),
            'handling_cost': round(self.cost_params['handling_cost'] * multiplier, 2),
            'restocking_cost': round(product_price * self.cost_params['restocking_cost_rate'], 2),
            'packaging_cost': round(self.cost_params['packaging_cost'], 2),
            'inventory_holding': round(product_price * self.cost_params['inventory_holding_rate'], 2),
            'discount_loss': round(discount * self.cost_params['discount_loss_rate'], 2),
            'lost_profit': round(product_price * self.cost_params['profit_margin_rate'], 2)
        }
        
        breakdown['total_return_cost'] = round(sum([
            breakdown['reverse_shipping'],
            breakdown['forward_shipping'],
            breakdown['handling_cost'],
            breakdown['restocking_cost'],
            breakdown['packaging_cost'],
            breakdown['inventory_holding'],
            breakdown['discount_loss'],
            breakdown['lost_profit']
        ]), 2)
        
        return breakdown
    
    def calculate_expected_loss(self, product_price, return_probability, category=None, discount=0):
        """Calculate expected loss given return probability"""
        return_cost = self.calculate_return_cost(product_price, category, discount)
        expected_loss = return_cost * return_probability
        return round(expected_loss, 2)
    
    def calculate_savings_projection(self, current_return_rate, reduced_return_rate, 
                                    annual_orders, avg_order_value, category=None):
        """Project annual savings from return rate reduction"""
        
        current_returns = annual_orders * (current_return_rate / 100)
        reduced_returns = annual_orders * (reduced_return_rate / 100)
        returns_prevented = current_returns - reduced_returns
        
        cost_per_return = self.calculate_return_cost(avg_order_value, category)
        
        annual_savings = returns_prevented * cost_per_return
        
        return {
            'current_returns': int(current_returns),
            'reduced_returns': int(reduced_returns),
            'returns_prevented': int(returns_prevented),
            'cost_per_return': round(cost_per_return, 2),
            'annual_savings': round(annual_savings, 2),
            'monthly_savings': round(annual_savings / 12, 2)
        }
    
    def update_cost_parameters(self, params):
        """Update cost calculation parameters"""
        self.cost_params.update(params)
        return self.cost_params
