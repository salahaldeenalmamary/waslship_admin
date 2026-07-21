import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ShipmentsPage from '../features/shipments/pages/ShipmentsPage';
import RatesPage from '../features/rates/pages/RatesPage';
import WalletPage from '../features/wallet/pages/WalletPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import UsersPage from '../features/users/pages/UsersPage';
import LoginPage from '../features/auth/pages/LoginPage';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Navigate to="/dashboard" replace />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/shipments" element={<ProtectedRoute><ShipmentsPage /></ProtectedRoute>} />
      <Route path="/rates" element={<ProtectedRoute><RatesPage /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
