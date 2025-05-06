import { useState } from 'react'
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import LandingPage from './pages/Landing';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import TransferPage from './pages/TransferPage';
import SecurityPage from './pages/SecurityPage';
import MainLayout from './layouts/MainLayout';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/securebank" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/securebank" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <MainLayout>
              <TransactionsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/transfer" element={
          <ProtectedRoute>
            <MainLayout>
              <TransferPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/security" element={
          <ProtectedRoute>
            <MainLayout>
              <SecurityPage />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;