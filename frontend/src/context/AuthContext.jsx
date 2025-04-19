// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken, refreshSession } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await verifyToken(token);
          setCurrentUser(userData);
          setIsAuthenticated(true);
          startSessionTimer();
        } catch (error) {
          console.error("Authentication failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
    
    // Set up inactivity timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const resetInactivityTimer = () => {
      if (isAuthenticated) {
        startSessionTimer();
      }
    };
    
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (sessionTimeout) clearTimeout(sessionTimeout);
    };
  }, [isAuthenticated]);

  const startSessionTimer = () => {
    if (sessionTimeout) clearTimeout(sessionTimeout);
    
    // 5 minutes inactivity timeout
    const timeout = setTimeout(() => {
      console.log("Session expired due to inactivity");
      logout();
    }, 5 * 60 * 1000);
    
    setSessionTimeout(timeout);
  };

  const login = async (userData, token) => {
    localStorage.setItem('token', token);
    setCurrentUser(userData);
    setIsAuthenticated(true);
    startSessionTimer();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
    if (sessionTimeout) clearTimeout(sessionTimeout);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};