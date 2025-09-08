import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = React.useState(false);

  // Add timeout to prevent infinite loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, []);

  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (timeoutReached && loading) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;