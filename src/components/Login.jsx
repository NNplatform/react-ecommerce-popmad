import React, { useState } from 'react';
import config from '../config';
import { useAuth } from '../contexts/AuthContext';
import { signIn, signOut } from '../apis/auth'; 
import './styles/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState('');
  const { login, logout, userId, role } = useAuth(); // Include logout and userId from context
  const url = `${config.apiBaseUrl}/auth-svc/auth/login`;
  const logoutUrl = `${config.apiBaseUrl}/auth-svc/auth/logout`; // URL for logout API

  const handleLogin = async () => {
    try {
      setWarning(''); 
      const response = await signIn(url, email, password);
      console.log('Login Response:', response.data);
      
      if (response.data.code === "0") {
        const userId = extractUserId(response.data);
        const userRole = extractUserRole(response.data); // Extract the role
  
        if (userId) {
          login(userId, userRole); // Pass the role to the login function
        }
      } else {
        setWarning(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setWarning('An error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(logoutUrl);
      logout(); 
    } catch (error) {
      console.error('Error logging out:', error);
      setWarning('An error occurred while logging out. Please try again.');
    }
  };

  function extractUserId(data) {
    if (data.code === "0" && data.result) {
      return data.result.userId; 
    }
    return null;
  }

  function extractUserRole(data) {
    if (data.code === "0" && data.result) {
      return data.result.role; // Extract the role from the result
    }
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: 'auto' }}>
      <h2>{userId ? 'Welcome Back!' : 'Login'}</h2>
      {!userId ? (
        <>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px' }}
          />
          <button 
            onClick={handleLogin}
            style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Login
          </button>
        </>
      ) : (
        <>
          <p>You are logged in! (userId:{userId}, role:{role})</p>
          <button 
            onClick={handleLogout}
            style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Logout
          </button>
        </>
      )}
      {warning && <p style={{ color: 'red', marginTop: '10px' }}>{warning}</p>}
    </div>
  );
};

export default Login;
