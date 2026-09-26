import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { apiClient } from '../services/api'

export default function Dashboard() {
  const [kpis, setKpis] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [returnReasons, setReturnReasons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [kpisRes, trendsRes, categoryRes, reasonsRes] = await Promise.all([
        apiClient.get('/dashboard/kpis'),
        apiClient.get('/dashboard/trends'),
        apiClient.get('/dashboard/return-by-category'),
        apiClient.get('/dashboard/return-reasons')
      ])

      // Handle both plain arrays and Azure-wrapped format
      const extractData = (data: any) => {
        if (data && typeof data === 'object' && 'value' in data && Array.isArray(data.value)) {
          return data.value
        }
        return Array.isArray(data) ? data : data
      }

      setKpis(kpisRes.data)
      setTrends(extractData(trendsRes.data))
      setCategoryData(extractData(categoryRes.data))
      setReturnReasons(extractData(reasonsRes.data))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  const COLORS = ['#60a5fa', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Executive Dashboard</h1>
        <p className="page-subtitle">Real-time return intelligence and profit metrics</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Orders</div>
          <div className="kpi-value">{kpis?.total_orders?.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Returns</div>
          <div className="kpi-value">{kpis?.total_returns?.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Return Rate</div>
          <div className="kpi-value">{kpis?.return_rate}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">High-Risk Orders</div>
          <div className="kpi-value">{kpis?.high_risk_orders?.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Predicted Returns</div>
          <div className="kpi-value">{kpis?.predicted_returns?.toFixed(0)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Estimated Return Cost</div>
          <div className="kpi-value">₹{(kpis?.estimated_return_cost / 1000).toFixed(1)}K</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Profit at Risk</div>
          <div className="kpi-value">₹{(kpis?.profit_at_risk / 1000).toFixed(1)}K</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Potential Savings</div>
          <div className="kpi-value kpi-change">₹{(kpis?.potential_savings / 1000).toFixed(1)}K</div>
        </div>
      </div>

      <div className="chart-container">
        <h3 className="chart-title">Return Rate Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="return_rate" stroke="#ef4444" name="Return Rate %" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2">
        <div className="chart-container">
          <h3 className="chart-title">Returns by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="return_rate" fill="#60a5fa" name="Return Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Top Return Reasons</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={returnReasons}
                dataKey="count"
                nameKey="reason"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {returnReasons.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Category Performance</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Orders</th>
              <th>Returns</th>
              <th>Return Rate</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((cat) => (
              <tr key={cat.category}>
                <td>{cat.category}</td>
                <td>{cat.total_orders}</td>
                <td>{cat.returns}</td>
                <td>
                  <span className={`risk-badge ${cat.return_rate > 20 ? 'high' : cat.return_rate > 15 ? 'medium' : 'low'}`}>
                    {cat.return_rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
