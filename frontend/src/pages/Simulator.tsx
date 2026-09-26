import { useState } from 'react'
import { apiClient } from '../services/api'
import { Sliders, TrendingDown, DollarSign } from 'lucide-react'

export default function Simulator() {
  const [simulation, setSimulation] = useState({
    price: 2000,
    current_delivery_days: 6,
    simulated_delivery_days: 3,
    current_discount: 500,
    simulated_discount: 200,
    current_product_rating: 3.5,
    simulated_product_rating: 4.5,
    customer_return_count: 2,
    order_value: 1500,
    category: 'Electronics',
    shipping_method: 'standard',
    payment_method: 'card'
  })
  
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSimulate = async () => {
    setLoading(true)
    try {
      const response = await apiClient.post('/simulate/what-if', simulation)
      setResult(response.data)
    } catch (error) {
      console.error('Simulation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: number) => {
    setSimulation({ ...simulation, [field]: value })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Prevention Simulator</h1>
        <p className="page-subtitle">Simulate business interventions and estimate ROI on return reduction</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title">
            <Sliders size={20} style={{ display: 'inline', marginRight: '8px' }} />
            Simulation Parameters
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Delivery Days</label>
              <span style={{ fontSize: '14px', color: '#718096' }}>
                Current: {simulation.current_delivery_days} → Simulated: {simulation.simulated_delivery_days}
              </span>
            </div>
            <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#4a5568' }}>
                Current Delivery Days: {simulation.current_delivery_days}
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={simulation.current_delivery_days}
                onChange={(e) => handleChange('current_delivery_days', parseInt(e.target.value))}
                style={{ width: '100%', marginBottom: '16px' }}
              />
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#4a5568' }}>
                Simulated Delivery Days: {simulation.simulated_delivery_days}
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={simulation.simulated_delivery_days}
                onChange={(e) => handleChange('simulated_delivery_days', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Discount Amount (₹)</label>
              <span style={{ fontSize: '14px', color: '#718096' }}>
                Current: ₹{simulation.current_discount} → Simulated: ₹{simulation.simulated_discount}
              </span>
            </div>
            <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#4a5568' }}>
                Current Discount: ₹{simulation.current_discount}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={simulation.current_discount}
                onChange={(e) => handleChange('current_discount', parseInt(e.target.value))}
                style={{ width: '100%', marginBottom: '16px' }}
              />
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#4a5568' }}>
                Simulated Discount: ₹{simulation.simulated_discount}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={simulation.simulated_discount}
                onChange={(e) => handleChange('simulated_discount', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Product Rating</label>
              <span style={{ fontSize: '14px', color: '#718096' }}>
                Current: {simulation.current_product_rating} → Simulated: {simulation.simulated_product_rating}
              </span>
            </div>
            <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#4a5568' }}>
                Current Rating: {simulation.current_product_rating} ⭐
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={simulation.current_product_rating}
                onChange={(e) => handleChange('current_product_rating', parseFloat(e.target.value))}
                style={{ width: '100%', marginBottom: '16px' }}
              />
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#4a5568' }}>
                Simulated Rating: {simulation.simulated_product_rating} ⭐
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={simulation.simulated_product_rating}
                onChange={(e) => handleChange('simulated_product_rating', parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={handleSimulate} 
            disabled={loading}
            style={{ width: '100%', fontSize: '16px', padding: '14px' }}
          >
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>

        {result && (
          <div>
            <div className="card">
              <h3 className="card-title">
                <TrendingDown size={20} style={{ display: 'inline', marginRight: '8px' }} />
                Risk Reduction Analysis
              </h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#fed7d7', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#742a2a', marginBottom: '8px', fontWeight: 600 }}>
                    CURRENT RETURN RISK
                  </div>
                  <div style={{ fontSize: '48px', fontWeight: 700, color: '#742a2a' }}>
                    {result.current_risk}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#742a2a', marginTop: '4px' }}>
                    Probability: {(result.current_probability * 100).toFixed(1)}%
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981' }}>↓</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#10b981' }}>
                    {result.risk_reduction_percentage}% REDUCTION
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: '20px', background: '#c6f6d5', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#22543d', marginBottom: '8px', fontWeight: 600 }}>
                    SIMULATED RETURN RISK
                  </div>
                  <div style={{ fontSize: '48px', fontWeight: 700, color: '#22543d' }}>
                    {result.simulated_risk}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#22543d', marginTop: '4px' }}>
                    Probability: {(result.simulated_probability * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">
                <DollarSign size={20} style={{ display: 'inline', marginRight: '8px' }} />
                Financial Impact
              </h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#f7fafc', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Current Expected Loss:</span>
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>₹{result.current_expected_loss}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#f7fafc', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Simulated Expected Loss:</span>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>₹{result.simulated_expected_loss}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#c6f6d5', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Potential Savings:</span>
                  <span style={{ color: '#22543d', fontWeight: 700, fontSize: '18px' }}>₹{result.potential_savings}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: '#e0e7ff', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Estimated ROI:</span>
                  <span style={{ color: '#3730a3', fontWeight: 700, fontSize: '18px' }}>₹{result.estimated_roi}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #60a5fa' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>💡 Simulation Insight</div>
                <p style={{ fontSize: '14px', color: '#4a5568', margin: 0 }}>
                  By implementing these changes, you could reduce return risk by {result.risk_reduction_percentage} percentage points,
                  potentially saving ₹{result.potential_savings} per order. The estimated ROI of ₹{result.estimated_roi} 
                  represents the long-term value creation from preventing this single return.
                </p>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Recommended Actions</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {simulation.current_delivery_days > simulation.simulated_delivery_days && (
                  <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>✓ Improve Delivery Speed</div>
                    <div style={{ fontSize: '14px', color: '#4a5568' }}>
                      Reduce delivery time from {simulation.current_delivery_days} to {simulation.simulated_delivery_days} days
                      by upgrading logistics partner or shipping method.
                    </div>
                  </div>
                )}
                {simulation.current_discount > simulation.simulated_discount && (
                  <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>✓ Optimize Discount Strategy</div>
                    <div style={{ fontSize: '14px', color: '#4a5568' }}>
                      Reduce discount from ₹{simulation.current_discount} to ₹{simulation.simulated_discount}
                      to reduce impulse purchases and improve profit margins.
                    </div>
                  </div>
                )}
                {simulation.current_product_rating < simulation.simulated_product_rating && (
                  <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>✓ Improve Product Quality & Satisfaction</div>
                    <div style={{ fontSize: '14px', color: '#4a5568' }}>
                      Improve product rating from {simulation.current_product_rating} to {simulation.simulated_product_rating}
                      through better quality, accurate descriptions, and improved customer experience.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
