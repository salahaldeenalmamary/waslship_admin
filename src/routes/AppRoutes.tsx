import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import ShipmentsPage from '../features/shipments/pages/ShipmentsPage';
import RatesPage from '../features/rates/pages/RatesPage';
import WalletPage from '../features/wallet/pages/WalletPage';
import SettingsPage from '../features/settings/pages/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/shipments" element={<ShipmentsPage />} />
      <Route path="/rates" element={<RatesPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
