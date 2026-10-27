import axios from 'axios'

// Set VITE_API_URL on your FRONTEND host, e.g. https://your-backend.onrender.com  (no trailing slash)
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')




const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
});




// Send the saved token on every request (cross-site cookies are often blocked)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
