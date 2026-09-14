import { useEffect, useState } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { BarChart3 } from 'lucide-react'

export default function ModelPerformance() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = async () => {
    try {
      const response = await axios.get('/api/model/performance')
      setMetrics(response.data)
    } catch (error) {
      console.error('Failed to load model metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading model performance...</div>
  }

  if (!metrics) {
    return <div className="error">Model metrics not available</div>
  }

  const performanceData = [
    { metric: 'Precision', value: metrics.precision * 100 },
    { metric: 'Recall', value: metrics.recall * 100 },
    { metric: 'F1-Score', value: metrics.f1_score * 100 },
    { metric: 'ROC-AUC', value: metrics.roc_auc * 100 }
  ]

  const confusionMatrix = metrics.confusion_matrix || [[0, 0], [0, 0]]
  const [tn, fp] = confusionMatrix[0] || [0, 0]
  const [fn, tp] = confusionMatrix[1] || [0, 0]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Model Performance</h1>
        <p className="page-subtitle">Machine learning model metrics and evaluation</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Precision</div>
          <div className="kpi-value">{(metrics.precision * 100).toFixed(1)}%</div>
          <div className="kpi-change">High precision reduces false alarms</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Recall</div>
          <div className="kpi-value">{(metrics.recall * 100).toFixed(1)}%</div>
          <div className="kpi-change">High recall catches more returns</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">F1-Score</div>
          <div className="kpi-value">{(metrics.f1_score * 100).toFixed(1)}%</div>
          <div className="kpi-change">Balanced performance metric</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">ROC-AUC</div>
          <div className="kpi-value">{(metrics.roc_auc * 100).toFixed(1)}%</div>
          <div className="kpi-change">Overall model quality</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="chart-container">
          <h3 className="chart-title">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#60a5fa" name="Score %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Confusion Matrix</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
            <div style={{ textAlign: 'center', padding: '24px', background: '#c6f6d5', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#22543d' }}>{tn}</div>
              <div style={{ fontSize: '14px', color: '#22543d', marginTop: '4px' }}>True Negatives</div>
              <div style={{ fontSize: '12px', color: '#4a5568', marginTop: '4px' }}>Correctly predicted no return</div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px', background: '#fed7d7', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#742a2a' }}>{fp}</div>
              <div style={{ fontSize: '14px', color: '#742a2a', marginTop: '4px' }}>False Positives</div>
              <div style={{ fontSize: '12px', color: '#4a5568', marginTop: '4px' }}>Predicted return incorrectly</div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px', background: '#fed7d7', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#742a2a' }}>{fn}</div>
              <div style={{ fontSize: '14px', color: '#742a2a', marginTop: '4px' }}>False Negatives</div>
              <div style={{ fontSize: '12px', color: '#4a5568', marginTop: '4px' }}>Missed actual returns</div>
            </div>
            <div style={{ textAlign: 'center', padding: '24px', background: '#c6f6d5', borderRadius: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#22543d' }}>{tp}</div>
              <div style={{ fontSize: '14px', color: '#22543d', marginTop: '4px' }}>True Positives</div>
              <div style={{ fontSize: '12px', color: '#4a5568', marginTop: '4px' }}>Correctly predicted return</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          <BarChart3 size={20} style={{ display: 'inline', marginRight: '8px' }} />
          Feature Importance
        </h3>
        <p style={{ marginBottom: '16px', color: '#718096' }}>
          Top features contributing to return risk predictions:
        </p>
        {metrics.feature_importance && metrics.feature_importance.slice(0, 10).map((feat: any, idx: number) => (
          <div key={idx} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600 }}>{feat.feature}</span>
              <span style={{ color: '#718096' }}>{(feat.importance * 100).toFixed(1)}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${feat.importance * 100}%`,
                height: '100%',
                background: '#60a5fa',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="card-title">Model Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Algorithm</h4>
            <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Random Forest Classifier</div>
              <div style={{ fontSize: '14px', color: '#718096' }}>
                Ensemble learning method using multiple decision trees
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Training Strategy</h4>
            <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Balanced Class Weights</div>
              <div style={{ fontSize: '14px', color: '#718096' }}>
                Handles imbalanced return data effectively
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Metric Explanations</h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <strong>Precision ({(metrics.precision * 100).toFixed(1)}%):</strong> When the model predicts a return, it's correct {(metrics.precision * 100).toFixed(0)}% of the time.
            </div>
            <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <strong>Recall ({(metrics.recall * 100).toFixed(1)}%):</strong> The model catches {(metrics.recall * 100).toFixed(0)}% of all actual returns.
            </div>
            <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <strong>F1-Score ({(metrics.f1_score * 100).toFixed(1)}%):</strong> Harmonic mean of precision and recall, providing a balanced performance measure.
            </div>
            <div style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
              <strong>ROC-AUC ({(metrics.roc_auc * 100).toFixed(1)}%):</strong> Model's ability to distinguish between returns and non-returns. Higher is better.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
