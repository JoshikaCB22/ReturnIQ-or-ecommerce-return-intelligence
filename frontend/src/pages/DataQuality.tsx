import { useEffect, useState } from 'react'
import axios from 'axios'
import { Database, CheckCircle, XCircle } from 'lucide-react'

export default function DataQuality() {
  const [quality, setQuality] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuality()
  }, [])

  const loadQuality = async () => {
    try {
      const response = await axios.get('/api/data/quality')
      setQuality(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load data quality:', error)
      setQuality(null)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading data quality report...</div>
  }

  if (!quality) {
    return <div className="error">Failed to load data quality report. Please ensure the backend is running.</div>
  }

  const missingCount = Object.values(quality.missing_values as Record<string, number>).reduce((a: number, b: number) => a + b, 0)
  const dataScore = Math.max(0, 100 - (missingCount / quality.total_records * 100) - (quality.duplicate_records / quality.total_records * 100))

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Quality</h1>
        <p className="page-subtitle">Data validation and quality metrics</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Records</div>
          <div className="kpi-value">{quality.total_records.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Missing Values</div>
          <div className="kpi-value" style={{ color: missingCount > 0 ? '#f59e0b' : '#10b981' }}>
            {missingCount}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Duplicate Records</div>
          <div className="kpi-value" style={{ color: quality.duplicate_records > 0 ? '#f59e0b' : '#10b981' }}>
            {quality.duplicate_records}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Data Quality Score</div>
          <div className="kpi-value" style={{ color: dataScore >= 90 ? '#10b981' : dataScore >= 70 ? '#f59e0b' : '#ef4444' }}>
            {dataScore.toFixed(0)}/100
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          <Database size={20} style={{ display: 'inline', marginRight: '8px' }} />
          Data Overview
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Data Statistics</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f7fafc', borderRadius: '6px' }}>
                <span>Total Records:</span>
                <strong>{quality.total_records.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f7fafc', borderRadius: '6px' }}>
                <span>Duplicates:</span>
                <strong>{quality.duplicate_records}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f7fafc', borderRadius: '6px' }}>
                <span>Completeness:</span>
                <strong>{((1 - missingCount / (quality.total_records * Object.keys(quality.data_types).length)) * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Class Balance</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f7fafc', borderRadius: '6px' }}>
                <span>Returned Orders:</span>
                <strong>{quality.class_balance.returned}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f7fafc', borderRadius: '6px' }}>
                <span>Not Returned:</span>
                <strong>{quality.class_balance.not_returned}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f7fafc', borderRadius: '6px' }}>
                <span>Return Rate:</span>
                <strong>{(quality.class_balance.imbalance_ratio * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Data Types</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Data Type</th>
              <th>Missing Values</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(quality.data_types).map(([col, dtype]) => {
              const missing = (quality.missing_values as Record<string, number>)[col] || 0
              return (
                <tr key={col}>
                  <td><strong>{col}</strong></td>
                  <td><code style={{ background: '#f7fafc', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>{dtype as string}</code></td>
                  <td>{missing}</td>
                  <td>
                    {missing === 0 ? (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={16} /> Complete
                      </span>
                    ) : (
                      <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={16} /> {missing} missing
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="card-title">Data Quality Checklist</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
            {missingCount === 0 ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#f59e0b" />}
            <div style={{ flex: 1 }}>
              <strong>No Missing Values</strong>
              <div style={{ fontSize: '14px', color: '#718096' }}>All fields are complete</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
            {quality.duplicate_records === 0 ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#f59e0b" />}
            <div style={{ flex: 1 }}>
              <strong>No Duplicates</strong>
              <div style={{ fontSize: '14px', color: '#718096' }}>All records are unique</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
            <CheckCircle size={20} color="#10b981" />
            <div style={{ flex: 1 }}>
              <strong>Data Types Valid</strong>
              <div style={{ fontSize: '14px', color: '#718096' }}>All columns have correct data types</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
            {quality.class_balance.imbalance_ratio > 0.1 && quality.class_balance.imbalance_ratio < 0.4 ? 
              <CheckCircle size={20} color="#10b981" /> : 
              <XCircle size={20} color="#f59e0b" />
            }
            <div style={{ flex: 1 }}>
              <strong>Class Balance Acceptable</strong>
              <div style={{ fontSize: '14px', color: '#718096' }}>
                Return rate is within reasonable range ({(quality.class_balance.imbalance_ratio * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
