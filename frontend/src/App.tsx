import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Home, TrendingUp, Package, Users, DollarSign, 
  Sliders, AlertTriangle, Database, BarChart3 
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import RiskAnalysis from './pages/RiskAnalysis'
import ProductIntelligence from './pages/ProductIntelligence'
import CustomerSegments from './pages/CustomerSegments'
import Simulator from './pages/Simulator'
import Alerts from './pages/Alerts'
import DataQuality from './pages/DataQuality'
import ModelPerformance from './pages/ModelPerformance'

function Sidebar() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Executive Dashboard' },
    { path: '/risk-analysis', icon: TrendingUp, label: 'Return Risk Analysis' },
    { path: '/products', icon: Package, label: 'Product Intelligence' },
    { path: '/customers', icon: Users, label: 'Customer Segments' },
    { path: '/simulator', icon: Sliders, label: 'Prevention Simulator' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alerts & Warnings' },
    { path: '/data-quality', icon: Database, label: 'Data Quality' },
    { path: '/model', icon: BarChart3, label: 'Model Performance' }
  ]
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">ReturnIQ</div>
        <div className="sidebar-subtitle">Return Intelligence System</div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link 
            key={path}
            to={path} 
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/risk-analysis" element={<RiskAnalysis />} />
            <Route path="/products" element={<ProductIntelligence />} />
            <Route path="/customers" element={<CustomerSegments />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/data-quality" element={<DataQuality />} />
            <Route path="/model" element={<ModelPerformance />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
