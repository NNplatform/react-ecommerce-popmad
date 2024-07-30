// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || ''); // Add role state

  useEffect(() => {
    //console.log('AuthContext: Current userId:', userId);
    //console.log('AuthContext: Current role:', role);
  }, [userId, role]);

  const login = (id, userRole) => {
    //console.log('AuthContext: Logging in with id:', id);
    setUserId(id);
    setRole(userRole);
    localStorage.setItem('userId', id);
    localStorage.setItem('role', userRole); // Save role to localStorage
  };

  const logout = () => {
    //console.log('AuthContext: Logging out');
    setUserId('');
    setRole('');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  };

  const contextValue = {
    userId,
    role,
    login,
    logout
  };

  console.log('AuthContext: Providing context value:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  //console.log('useAuth hook called, returning:', context);
  return context;
}