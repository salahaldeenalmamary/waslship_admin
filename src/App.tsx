import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { LanguageProvider } from './providers/LanguageProvider';

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  // If we're authenticated, we show the dashboard layout.
  // The AppRoutes will handle the /login redirect if NOT authenticated.
  // However, we only want the layout for authenticated users on protected pages.
  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <AppRoutes />
      </DashboardLayout>
    );
  }

  // For non-authenticated users (like on the Login page)
  return <AppRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
