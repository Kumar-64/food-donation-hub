import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardHome from './pages/DashboardHome'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome role="ADMIN" />} />
      <Route path="/dashboard" element={<DashboardHome role="ADMIN" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
