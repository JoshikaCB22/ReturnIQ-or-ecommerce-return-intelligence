// API Configuration for different environments

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    dashboard: `${API_BASE_URL}/api/dashboard`,
    customers: `${API_BASE_URL}/api/customers`,
    products: `${API_BASE_URL}/api/products`,
    model: `${API_BASE_URL}/api/model`,
    data: `${API_BASE_URL}/api/data`,
    predict: `${API_BASE_URL}/api/predict`,
    simulate: `${API_BASE_URL}/api/simulate`,
    alerts: `${API_BASE_URL}/api/alerts`,
  }
}

export default API_CONFIG
