import { useEffect, useState } from 'react'
import { apiClient } from '../services/api'
import { Package, TrendingDown } from 'lucide-react'

export default function ProductIntelligence() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await apiClient.get('/products/health')
      setProducts(response.data)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading product intelligence...</div>
  }

  const criticalProducts = products.filter(p => p.status === 'CRITICAL')
  const atRiskProducts = products.filter(p => p.status === 'AT RISK')

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Product Intelligence</h1>
        <p className="page-subtitle">Product return health scores and performance analysis</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Products</div>
          <div className="kpi-value">{products.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Critical Products</div>
          <div className="kpi-value" style={{ color: '#ef4444' }}>{criticalProducts.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">At Risk Products</div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>{atRiskProducts.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Health Score</div>
          <div className="kpi-value">
            {products.length > 0 ? (products.reduce((sum, p) => sum + p.health_score, 0) / products.length).toFixed(0) : 0}
          </div>
        </div>
      </div>

      {criticalProducts.length > 0 && (
        <div className="alert alert-critical">
          <div className="alert-icon">
            <TrendingDown size={20} />
          </div>
          <div className="alert-content">
            <div className="alert-title">Critical Products Detected</div>
            <div className="alert-message">
              {criticalProducts.length} products have critically low health scores and require immediate attention.
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="card-title">
          <Package size={20} style={{ display: 'inline', marginRight: '8px' }} />
          Product Return Health Leaderboard
        </h3>
        <table className="table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Orders</th>
              <th>Returns</th>
              <th>Return Rate</th>
              <th>Avg Price</th>
              <th>Avg Rating</th>
              <th>Health Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id}>
                <td><strong>{product.product_id}</strong></td>
                <td>{product.total_orders}</td>
                <td>{product.returns}</td>
                <td>
                  <span className={`risk-badge ${product.return_rate > 25 ? 'high' : product.return_rate > 15 ? 'medium' : 'low'}`}>
                    {product.return_rate}%
                  </span>
                </td>
                <td>₹{product.avg_price.toFixed(0)}</td>
                <td>{product.avg_rating.toFixed(1)} ⭐</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${product.health_score}%`,
                        height: '100%',
                        background: product.health_score >= 75 ? '#10b981' : product.health_score >= 50 ? '#f59e0b' : '#ef4444',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <span style={{ fontWeight: 600, minWidth: '40px' }}>{product.health_score}/100</span>
                  </div>
                </td>
                <td>
                  <span className={`risk-badge ${
                    product.status === 'HEALTHY' ? 'low' : 
                    product.status === 'WATCH' ? 'medium' : 
                    'high'
                  }`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="card-title">Product Health Score Calculation</h3>
        <p style={{ marginBottom: '16px', color: '#718096' }}>
          Product Health Score is calculated based on multiple factors:
        </p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
            <strong>Return Rate (50%):</strong> Lower return rates increase the score
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
            <strong>Product Rating (30%):</strong> Higher customer ratings improve the score
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
            <strong>Order Volume (20%):</strong> Popular products get a boost
          </li>
        </ul>
        <div style={{ marginTop: '16px', padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
          <strong>Status Classification:</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
            <div>
              <span className="risk-badge low">HEALTHY</span>
              <div style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>75-100</div>
            </div>
            <div>
              <span className="risk-badge medium">WATCH</span>
              <div style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>50-74</div>
            </div>
            <div>
              <span className="risk-badge high">AT RISK</span>
              <div style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>25-49</div>
            </div>
            <div>
              <span className="risk-badge high">CRITICAL</span>
              <div style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>0-24</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
