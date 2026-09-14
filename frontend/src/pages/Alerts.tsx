import { useEffect, useState } from 'react'
import axios from 'axios'
import { AlertTriangle, AlertCircle } from 'lucide-react'

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts')
      setAlerts(response.data)
    } catch (error) {
      console.error('Failed to load alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading alerts...</div>
  }

  const criticalAlerts = alerts.filter(a => a.severity === 'critical')
  const warningAlerts = alerts.filter(a => a.severity === 'warning')

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Alerts & Early Warnings</h1>
        <p className="page-subtitle">Automated detection of anomalies and emerging return trends</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Alerts</div>
          <div className="kpi-value">{alerts.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Critical Alerts</div>
          <div className="kpi-value" style={{ color: '#ef4444' }}>{criticalAlerts.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Warnings</div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>{warningAlerts.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Status</div>
          <div className="kpi-value" style={{ fontSize: '20px', color: criticalAlerts.length > 0 ? '#ef4444' : '#10b981' }}>
            {criticalAlerts.length > 0 ? 'Action Required' : 'All Clear'}
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '48px', color: '#718096' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No Active Alerts</div>
            <div style={{ fontSize: '14px' }}>All metrics are within normal ranges. The system will notify you of any anomalies.</div>
          </div>
        </div>
      ) : (
        <>
          {criticalAlerts.length > 0 && (
            <div className="card">
              <h3 className="card-title" style={{ color: '#ef4444' }}>
                <AlertTriangle size={20} style={{ display: 'inline', marginRight: '8px' }} />
                Critical Alerts
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {criticalAlerts.map((alert, idx) => (
                  <div key={idx} className="alert alert-critical">
                    <div className="alert-icon">
                      <AlertTriangle size={20} />
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">{alert.type.replace(/_/g, ' ').toUpperCase()}</div>
                      <div className="alert-message">{alert.message}</div>
                      <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 600, color: '#742a2a' }}>
                        Recommendation: {alert.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {warningAlerts.length > 0 && (
            <div className="card">
              <h3 className="card-title" style={{ color: '#f59e0b' }}>
                <AlertCircle size={20} style={{ display: 'inline', marginRight: '8px' }} />
                Warnings
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {warningAlerts.map((alert, idx) => (
                  <div key={idx} className="alert alert-warning">
                    <div className="alert-icon">
                      <AlertCircle size={20} />
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">{alert.type.replace(/_/g, ' ').toUpperCase()}</div>
                      <div className="alert-message">{alert.message}</div>
                      <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 600, color: '#975a16' }}>
                        Recommendation: {alert.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="card">
        <h3 className="card-title">Alert Types</h3>
        <p style={{ marginBottom: '16px', color: '#718096' }}>
          The Early Warning System automatically monitors for:
        </p>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
            <strong>🚨 High Return Rate Products</strong>
            <div style={{ fontSize: '14px', color: '#4a5568', marginTop: '4px' }}>
              Products with return rates exceeding 25% threshold
            </div>
          </div>
          <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
            <strong>📈 Category Return Spikes</strong>
            <div style={{ fontSize: '14px', color: '#4a5568', marginTop: '4px' }}>
              Category return rates significantly above baseline
            </div>
          </div>
          <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px', borderLeft: '3px solid #60a5fa' }}>
            <strong>👥 Customer Behavior Anomalies</strong>
            <div style={{ fontSize: '14px', color: '#4a5568', marginTop: '4px' }}>
              Unusual customer return patterns or segment shifts
            </div>
          </div>
          <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px', borderLeft: '3px solid #8b5cf6' }}>
            <strong>📍 Regional Issues</strong>
            <div style={{ fontSize: '14px', color: '#4a5568', marginTop: '4px' }}>
              Delivery regions with elevated return rates
            </div>
          </div>
          <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
            <strong>💰 High Financial Impact</strong>
            <div style={{ fontSize: '14px', color: '#4a5568', marginTop: '4px' }}>
              Products/orders with high return probability and high cost
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
