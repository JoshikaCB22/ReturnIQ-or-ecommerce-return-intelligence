import { useState } from 'react'
import axios from 'axios'
import { AlertCircle, TrendingUp, DollarSign } from 'lucide-react'

export default function RiskAnalysis() {
  const [formData, setFormData] = useState({
    product_id: 'PROD001',
    category: 'Electronics',
    price: 2000,
    discount: 400,
    customer_return_count: 3,
    delivery_days_estimate: 5,
    shipping_method: 'standard',
    product_rating: 3.8,
    order_value: 1600,
    payment_method: 'card'
  })
  
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.post('/api/predict/order', formData)
      setPrediction(response.data)
    } catch (error) {
      console.error('Prediction failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Return Risk Analysis</h1>
        <p className="page-subtitle">Analyze individual order return probability and risk factors</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title">Order Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product ID</label>
              <input
                type="text"
                name="product_id"
                className="form-input"
                value={formData.product_id}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Lifestyle">Home & Lifestyle</option>
                <option value="Beauty">Beauty</option>
                <option value="Books">Books</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount (₹)</label>
              <input
                type="number"
                name="discount"
                className="form-input"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Customer Previous Returns</label>
              <input
                type="number"
                name="customer_return_count"
                className="form-input"
                value={formData.customer_return_count}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Delivery Days</label>
              <input
                type="number"
                name="delivery_days_estimate"
                className="form-input"
                value={formData.delivery_days_estimate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shipping Method</label>
              <select name="shipping_method" className="form-select" value={formData.shipping_method} onChange={handleChange}>
                <option value="express">Express</option>
                <option value="standard">Standard</option>
                <option value="economy">Economy</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Product Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                name="product_rating"
                className="form-input"
                value={formData.product_rating}
                onChange={handleChange}
                min="1"
                max="5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select name="payment_method" className="form-select" value={formData.payment_method} onChange={handleChange}>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="cod">Cash on Delivery</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Analyzing...' : 'Analyze Return Risk'}
            </button>
          </form>
        </div>

        {prediction && (
          <div>
            <div className="card">
              <h3 className="card-title">Risk Assessment</h3>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div className={`risk-score ${prediction.risk_level.toLowerCase()}`}>
                  {prediction.risk_score}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '12px' }}>
                  Risk Level: <span className={`risk-badge ${prediction.risk_level.toLowerCase()}`}>
                    {prediction.risk_level}
                  </span>
                </div>
                <div style={{ marginTop: '16px', fontSize: '14px', color: '#718096' }}>
                  Return Probability: {(prediction.return_probability * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '14px', color: '#718096' }}>
                  Confidence: {(prediction.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">
                <DollarSign size={20} style={{ display: 'inline', marginRight: '8px' }} />
                Financial Impact
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
                  <span>Product Value:</span>
                  <strong>₹{prediction.financial_impact.product_value}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
                  <span>Return Cost:</span>
                  <strong>₹{prediction.financial_impact.return_cost}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#fed7d7', borderRadius: '8px' }}>
                  <span>Expected Loss:</span>
                  <strong style={{ color: '#742a2a' }}>₹{prediction.financial_impact.expected_loss}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
                  <span>Profit at Risk:</span>
                  <strong>₹{prediction.financial_impact.profit_at_risk}</strong>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">
                <AlertCircle size={20} style={{ display: 'inline', marginRight: '8px' }} />
                Why is this order high risk?
              </h3>
              {prediction.explanation.top_factors.map((factor: any, idx: number) => (
                <div key={idx} style={{ padding: '12px', marginBottom: '8px', background: '#f7fafc', borderRadius: '8px', borderLeft: `3px solid ${factor.impact === 'increases risk' ? '#ef4444' : '#10b981'}` }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{factor.factor}</div>
                  <div style={{ fontSize: '14px', color: '#4a5568' }}>{factor.value}</div>
                  <div style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>
                    Impact: {factor.impact} ({Math.abs(factor.contribution * 100).toFixed(0)}%)
                  </div>
                </div>
              ))}
            </div>

            {prediction.recommendations && prediction.recommendations.length > 0 && (
              <div className="card">
                <h3 className="card-title">
                  <TrendingUp size={20} style={{ display: 'inline', marginRight: '8px' }} />
                  Recommended Actions
                </h3>
                {prediction.recommendations.map((rec: any, idx: number) => (
                  <div key={idx} style={{ padding: '16px', marginBottom: '12px', background: '#f7fafc', borderRadius: '8px', borderLeft: `3px solid ${rec.priority === 'HIGH' ? '#ef4444' : rec.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className={`risk-badge ${rec.priority.toLowerCase()}`}>{rec.priority}</span>
                      <span style={{ fontSize: '13px', color: '#718096' }}>Effort: {rec.effort}</span>
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Problem:</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>{rec.problem}</div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Action:</div>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>{rec.action}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', color: '#4a5568' }}>
                      <div>Expected Reduction: {rec.expected_risk_reduction}</div>
                      <div>Est. Savings: {rec.estimated_savings}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
