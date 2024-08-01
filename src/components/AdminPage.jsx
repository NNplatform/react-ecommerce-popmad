import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext';
import config from '../config'; 
import './styles/AdminPage.css'; 
import { getAdminPageResult } from '../apis/admin'; 
import { UserOutlined, ClockCircleOutlined, ShoppingCartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';


const AdminPage = () => {
  const { role } = useAuth();
  const [adminInfo, setAdminInfo] = useState(null); 

  // Redirect if the user is not an admin
  if (role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />; 
  }

  const url = `${config.apiBaseUrl}/order-svc/admin/result`; 

  useEffect(() => {
    getAdminPageResult(url)
      .then((response) => {
        console.log('Admin Dashboard Response:', response.data);
        const result = extractAdminData(response.data);
        setAdminInfo(result);
      })
      .catch((error) => {
        console.error('Error fetching admin dashboard:', error);
      });
  }, [url]);

  function extractAdminData(data) {
    if (data.code === '0' && data.result) {
      return {
        column1: data.result.totalUser,
        column2: data.result.pendingUser,
        column3: data.result.orderedUser,
        column4: data.result.attemptDepletedProductUser
      };
    }
    return {};
  }

  
  return (
    <div>
      {adminInfo ? (
        <ul className="admin-dashboard">

          <li className="dashboard-item">
            <UserOutlined className="dashboard-icon" />
            <span className="dashboard-value">{adminInfo.column1}</span>
            <span className="dashboard-label">Total Users</span>
          </li>

          <li className="dashboard-item">
            <ClockCircleOutlined className="dashboard-icon" />
            <span className="dashboard-value">{adminInfo.column2}</span>
            <span className="dashboard-label">Pending Users</span>
          </li>

          <li className="dashboard-item">
            <ShoppingCartOutlined className="dashboard-icon" />
            <span className="dashboard-value">{adminInfo.column3}</span>
            <span className="dashboard-label">Ordered Users</span>
          </li>

          <li className="dashboard-item">
            <ExclamationCircleOutlined className="dashboard-icon" />
            <span className="dashboard-value">{adminInfo.column4}</span>
            <span className="dashboard-label">Attempt Depleted Product Users</span>
          </li>
          
        </ul>
      ) : (
        <p>Loading admin data...</p>
      )}
    </div>
  );
};

export default AdminPage;