import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './services/store';
import { CustomerView } from './components/CustomerView';
import { AdminPanel } from './components/AdminPanel';
import { AIBarista } from './components/AIBarista';
import { Button, Input } from './components/ui';
import { Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { loginAdmin, isAdmin } = useStore();

  if (isAdmin) return <Navigate to="/admin" />;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      loginAdmin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-coffee-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="bg-coffee-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-coffee-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
          <p className="text-gray-500">Enter password to access dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input 
              type="password" 
              placeholder="Password (hint: admin123)" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className={error ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm mt-1">Incorrect password</p>}
          </div>
          <Button type="submit" className="w-full py-3">Login</Button>
        </form>
        <div className="mt-6 text-center">
          <a href="#/" className="text-sm text-coffee-600 hover:text-coffee-800">Back to Customer View</a>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useStore();
  if (!isAdmin) return <Navigate to="/login" />;
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="bg-coffee-50 min-h-screen font-sans">
      {children}
      {!isAdminRoute && <AIBarista />}
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
     <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CustomerView />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;