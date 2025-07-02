import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (authStatus === 'true' && loginTime) {
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      
      if (currentTime - parseInt(loginTime) < sessionDuration) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        logout();
      }
    }
    
    setIsLoading(false);
  };

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };
}