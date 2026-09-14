class RecommendationEngine:
    def generate_recommendations(self, prediction, explanation, order_data):
        """Generate actionable recommendations based on risk factors"""
        recommendations = []
        
        risk_score = prediction['risk_score']
        top_factors = explanation.get('top_factors', [])
        
        # Analyze each risk factor and provide specific recommendations
        for factor in top_factors:
            factor_name = factor.get('factor', '')
            impact = factor.get('impact', '')
            
            if impact != 'increases risk':
                continue
            
            if 'Customer Return History' in factor_name:
                recommendations.append({
                    'problem': 'Customer has high return history',
                    'action': 'Contact customer before shipment to verify product requirements and expectations',
                    'expected_risk_reduction': '15-20%',
                    'estimated_savings': '₹150-200',
                    'priority': 'HIGH',
                    'effort': 'Low',
                    'implementation': 'Automated email/SMS with product confirmation'
                })
            
            elif 'High Discount' in factor_name:
                recommendations.append({
                    'problem': 'Large discount may indicate impulse purchase',
                    'action': 'Send detailed product information and use-case guide post-purchase',
                    'expected_risk_reduction': '10-15%',
                    'estimated_savings': '₹100-150',
                    'priority': 'MEDIUM',
                    'effort': 'Low',
                    'implementation': 'Automated product guide email'
                })
            
            elif 'Slow Delivery' in factor_name or 'Delivery' in factor_name:
                recommendations.append({
                    'problem': 'Long delivery time increases return risk',
                    'action': 'Upgrade to express shipping or switch logistics partner for this region',
                    'expected_risk_reduction': '20-25%',
                    'estimated_savings': '₹200-300',
                    'priority': 'HIGH',
                    'effort': 'Medium',
                    'implementation': 'Logistics optimization or carrier switch'
                })
            
            elif 'Low Product Rating' in factor_name:
                recommendations.append({
                    'problem': 'Product has low customer ratings',
                    'action': 'Improve product images, add detailed specifications, and include customer review highlights',
                    'expected_risk_reduction': '15-20%',
                    'estimated_savings': '₹150-250',
                    'priority': 'HIGH',
                    'effort': 'High',
                    'implementation': 'Product page enhancement and quality review'
                })
            
            elif 'Category' in factor_name:
                category = order_data.get('category', '')
                
                if category == 'Fashion':
                    recommendations.append({
                        'problem': 'Fashion items have high return rates due to sizing',
                        'action': 'Add detailed size chart, model measurements, and fit guide. Consider virtual try-on.',
                        'expected_risk_reduction': '25-30%',
                        'estimated_savings': '₹250-350',
                        'priority': 'HIGH',
                        'effort': 'Medium',
                        'implementation': 'Enhanced size guide and AR try-on feature'
                    })
                
                elif category == 'Electronics':
                    recommendations.append({
                        'problem': 'Electronics have quality and expectation issues',
                        'action': 'Improve packaging protection, add setup guides, and offer installation support',
                        'expected_risk_reduction': '15-20%',
                        'estimated_savings': '₹200-300',
                        'priority': 'MEDIUM',
                        'effort': 'Medium',
                        'implementation': 'Enhanced packaging and support resources'
                    })
        
        # General high-risk recommendations
        if risk_score >= 70 and len(recommendations) == 0:
            recommendations.append({
                'problem': 'Order flagged as high risk',
                'action': 'Manual review before shipment and customer confirmation call',
                'expected_risk_reduction': '20-30%',
                'estimated_savings': '₹200-400',
                'priority': 'HIGH',
                'effort': 'High',
                'implementation': 'Human review process'
            })
        
        # Sort by priority
        priority_order = {'HIGH': 0, 'MEDIUM': 1, 'LOW': 2}
        recommendations.sort(key=lambda x: priority_order.get(x['priority'], 3))
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def generate_product_recommendations(self, product_stats):
        """Generate recommendations for specific products"""
        recommendations = []
        
        return_rate = product_stats.get('return_rate', 0)
        main_reason = product_stats.get('main_return_reason', 'Unknown')
        
        if return_rate > 30:
            if 'size' in main_reason.lower():
                recommendations.append({
                    'action': 'Critical: Revise size chart and add fit guide',
                    'priority': 'CRITICAL',
                    'expected_impact': 'Reduce returns by 20-30%'
                })
            elif 'quality' in main_reason.lower() or 'damaged' in main_reason.lower():
                recommendations.append({
                    'action': 'Critical: Review product quality and improve packaging',
                    'priority': 'CRITICAL',
                    'expected_impact': 'Reduce returns by 15-25%'
                })
            elif 'expectation' in main_reason.lower() or 'description' in main_reason.lower():
                recommendations.append({
                    'action': 'Critical: Update product images and description',
                    'priority': 'CRITICAL',
                    'expected_impact': 'Reduce returns by 15-20%'
                })
            else:
                recommendations.append({
                    'action': 'Critical: Conduct detailed return reason analysis',
                    'priority': 'CRITICAL',
                    'expected_impact': 'Identify root cause'
                })
        
        elif return_rate > 20:
            recommendations.append({
                'action': 'Monitor closely and analyze return patterns',
                'priority': 'HIGH',
                'expected_impact': 'Prevent further increase'
            })
        
        return recommendations
