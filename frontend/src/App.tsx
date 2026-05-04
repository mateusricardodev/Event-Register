import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { CreateEvent } from './pages/CreateEvent'
import { EventDetail } from './pages/EventDetail'
import { NewRegistration } from './pages/NewRegistration'
import { EditRegistration } from './pages/EditRegistration'
import { SearchRegistrations } from './pages/SearchRegistrations'
import { EventSetupPayment } from './pages/EventSetupPayment'
import { EventSetupForm } from './pages/EventSetupForm'
import { EventSetupPage } from './pages/EventSetupPage'
import { EventPublic } from './pages/EventPublic'
import { PublicRegistration } from './pages/PublicRegistration'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/evento/:slug" element={<EventPublic />} />
        <Route path="/evento/:slug/inscricao" element={<PublicRegistration />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/new"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/setup/payment"
          element={
            <ProtectedRoute>
              <EventSetupPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/setup/form"
          element={
            <ProtectedRoute>
              <EventSetupForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/setup/page"
          element={
            <ProtectedRoute>
              <EventSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/registrations/new"
          element={
            <ProtectedRoute>
              <NewRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/registrations/:regId/edit"
          element={
            <ProtectedRoute>
              <EditRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buscar-inscricoes"
          element={
            <ProtectedRoute>
              <SearchRegistrations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
