import { useEffect, useContext, useRef } from 'react';
import AuthContext from '../context/auth/authContext';

const useTokenMonitor = () => {
  const authContext = useContext(AuthContext);
  const { refreshAuthToken, logout, isAuthenticated } = authContext;
  const intervalRef = useRef(null);

  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token expires in the next 10 minutes (600 seconds)
      return payload.exp < (currentTime + 600);
    } catch (error) {
      return true;
    }
  };

  const checkAndRefreshToken = async () => {
    const token = localStorage.getItem('token');
    
    if (!token || !isAuthenticated) {
      return;
    }

    if (isTokenExpired(token)) {
      try {
        await refreshAuthToken();
        console.log('Token refreshed successfully');
      } catch (error) {
        console.error('Failed to refresh token:', error);
        logout();
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Check token immediately
      checkAndRefreshToken();
      
      // Set up interval to check every 5 minutes
      intervalRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
    } else {
      // Clear interval if not authenticated
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated]);

  // Also check when the page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        checkAndRefreshToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);
};

export default useTokenMonitor;
