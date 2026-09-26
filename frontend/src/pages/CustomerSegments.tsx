import { useEffect, useState } from 'react'
import { apiClient } from '../services/api'
import { Users } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function CustomerSegments() {
  const [segments, setSegments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSegments()
  }, [])

  const loadSegments = async () => {
    try {
      const response = await apiClient.get('/customers/segments')
      setSegments(response.data)
    } catch (error) {
      console.error('Failed to load customer segments:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading customer segments...</div>
  }

  const COLORS = ['#10b981', '#60a5fa', '#f59e0b', '#ef4444']

  const pieData = segments.map(s => ({
    name: s.segment,
    value: s.customer_count
  }))

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customer Intelligence</h1>
        <p className="page-subtitle">Customer segmentation based on return behavior patterns</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Customers</div>
          <div className="kpi-value">{segments.reduce((sum, s) => sum + s.customer_count, 0)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Reliable Customers</div>
          <div className="kpi-value" style={{ color: '#10b981' }}>
            {segments.find(s => s.segment === 'Reliable Customers')?.customer_count || 0}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Frequent Returners</div>
          <div className="kpi-value" style={{ color: '#ef4444' }}>
            {segments.find(s => s.segment === 'Frequent Returners')?.customer_count || 0}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">High-Value High-Risk</div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>
            {segments.find(s => s.segment === 'High-Value High-Risk')?.customer_count || 0}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="chart-container">
          <h3 className="chart-title">Customer Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">
            <Users size={20} style={{ display: 'inline', marginRight: '8px' }} />
            Segment Profiles
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {segments.map((seg, idx) => (
              <div key={seg.segment} style={{ 
                padding: '16px', 
                background: '#f7fafc', 
                borderRadius: '8px',
                borderLeft: `4px solid ${COLORS[idx % COLORS.length]}`
              }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '16px' }}>
                  {seg.segment}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#4a5568' }}>
                  <div>Customers: {seg.customer_count}</div>
                  <div>Orders: {seg.total_orders}</div>
                  <div>Returns: {seg.total_returns}</div>
                  <div>Avg Return Rate: {seg.avg_return_rate.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Segment Details</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Segment</th>
              <th>Customers</th>
              <th>Total Orders</th>
              <th>Total Returns</th>
              <th>Avg Return Rate</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((seg) => (
              <tr key={seg.segment}>
                <td><strong>{seg.segment}</strong></td>
                <td>{seg.customer_count}</td>
                <td>{seg.total_orders}</td>
                <td>{seg.total_returns}</td>
                <td>{seg.avg_return_rate.toFixed(1)}%</td>
                <td>
                  <span className={`risk-badge ${
                    seg.avg_return_rate < 10 ? 'low' : 
                    seg.avg_return_rate < 30 ? 'medium' : 
                    'high'
                  }`}>
                    {seg.avg_return_rate < 10 ? 'LOW' : seg.avg_return_rate < 30 ? 'MEDIUM' : 'HIGH'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="card-title">Segment Descriptions</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
            <div style={{ fontWeight: 600, color: '#10b981', marginBottom: '8px' }}>✓ Reliable Customers</div>
            <p style={{ fontSize: '14px', color: '#4a5568', margin: 0 }}>
              Customers with low return rates (&lt;10%). These are your best customers who rarely return products.
              Focus on retention and increasing order frequency.
            </p>
          </div>
          <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
            <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: '8px' }}>○ Occasional Returners</div>
            <p style={{ fontSize: '14px', color: '#4a5568', margin: 0 }}>
              Customers with moderate return rates (10-30%). Understanding their return reasons can help reduce returns.
              Provide better product information and customer service.
            </p>
          </div>
          <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
            <div style={{ fontWeight: 600, color: '#f59e0b', marginBottom: '8px' }}>⚠ Frequent Returners</div>
            <p style={{ fontSize: '14px', color: '#4a5568', margin: 0 }}>
              Lower-value customers with high return rates (&gt;30%). Consider implementing return policies or
              improving product-customer fit through better recommendations.
            </p>
          </div>
          <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
            <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: '8px' }}>⚠ High-Value High-Risk</div>
            <p style={{ fontSize: '14px', color: '#4a5568', margin: 0 }}>
              High-spending customers with high return rates. Provide white-glove service, pre-purchase consultations,
              and detailed product information to reduce returns while maintaining the relationship.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
