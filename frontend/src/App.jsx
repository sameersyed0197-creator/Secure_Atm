// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import SettingsPage from './pages/SettingsPage'
import CreateUpiPinPage from './pages/CreateUpiPinPage'
import DepositPage from './pages/DepositPage'
import WithdrawPage from './pages/WithdrawPage'
import TransactionsPage from './pages/TransactionsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/create-upi-pin" element={<CreateUpiPinPage />} />
      <Route path="/deposit" element={<DepositPage />} />
      <Route path="/withdraw" element={<WithdrawPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      {/* Catch-all route - redirect to dashboard or login */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
