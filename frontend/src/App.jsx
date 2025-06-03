import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import SidebarLayout from './components/layout/SidebarLayout'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/dashboard/Dashboard'
import LeadsPage from './pages/leads/LeadsPage'
import LeadProfile from './pages/leads/LeadProfile'
import NewLeadForm from './pages/leads/NewLeadForm'
import ReportsPage from './pages/reports/Reports'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes with SidebarLayout */}
            <Route element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/leads/new" element={<NewLeadForm />} />
              <Route path="/leads/:id" element={<LeadProfile />} />
              <Route path="/reports" element={<ReportsPage />} />
              
              {/* Admin-only routes */}
              {/* Add future admin-only routes here */}
            </Route>
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
