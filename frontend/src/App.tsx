import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PublicLayout from './public/PublicLayout';
import PersonnelLayout from './personnel/PersonnelLayout';
import PublicDashboard from './public/PublicDashboard';
import PublicMap from './public/PublicMap';
import PersonnelDashboard from './personnel/PersonnelDashboard';
import PersonnelMap from './personnel/PersonnelMap';
import PersonnelAlerts from './personnel/PersonnelAlerts';
import PersonnelChat from './personnel/PersonnelChat';
import PersonnelSAR from './personnel/PersonnelSAR';
import Login from './auth/Login';
import { useAuthStore } from './stores/authStore';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/personnel/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicDashboard />} />
            <Route path="map" element={<PublicMap />} />
          </Route>

          {/* Personnel Routes */}
          <Route path="/personnel/login" element={<Login />} />
          <Route
            path="/personnel"
            element={
              <ProtectedRoute>
                <PersonnelLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PersonnelDashboard />} />
            <Route path="map" element={<PersonnelMap />} />
            <Route path="alerts" element={<PersonnelAlerts />} />
            <Route path="chat" element={<PersonnelChat />} />
            <Route path="sar" element={<PersonnelSAR />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

