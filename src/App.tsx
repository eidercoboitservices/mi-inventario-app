import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/inventory/Products';
import Movements from './pages/inventory/Movements';
import History from './pages/reports/History';
import UserManagement from './pages/admin/UserManagement';
import Profile from './pages/auth/Profile';
import Subscription from './pages/subscription/Subscription';
import NotFound from './pages/NotFound';

// Backup/Restore buttons
const BackupRestoreButtons = () => {
  const handleBackup = () => {
    // @ts-ignore
    window.api.backup();
  };

  const handleRestore = () => {
    // @ts-ignore
    window.api.restore();
  };

  return (
    <div className="p-4 space-x-2">
      <button onClick={handleBackup} className="bg-blue-500 text-white px-4 py-2 rounded">
        Crear Respaldo
      </button>
      <button onClick={handleRestore} className="bg-green-500 text-white px-4 py-2 rounded">
        Restaurar Respaldo
      </button>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <InventoryProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Protected routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <BackupRestoreButtons />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory/products" element={<Products />} />
                <Route path="/inventory/movements" element={<Movements />} />
                <Route path="/reports/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/subscription" element={<Subscription />} />

                {/* Admin routes */}
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <UserManagement />
                    </AdminRoute>
                  }
                />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>

            <ToastContainer position="top-right" autoClose={3000} />
          </InventoryProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;