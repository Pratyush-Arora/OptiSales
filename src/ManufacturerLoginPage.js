// ManufacturerLoginPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManufacturerLoginPage = () => {
  const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  };

  const loginBoxStyle = {
    textAlign: 'center',
    padding: '20px 150px',
    backgroundColor: '#007bff', // Blue color
    color: '#fff', // White text color
    borderRadius: '8px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '18px',
    backgroundColor: '#fff', // White background for the button
    color: '#007bff', // Blue text color for the button
    border: '2px solid #007bff', // Blue border for the button
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const handleLogin = () => {
    // Directly navigate to the manufacturer insight page
    navigate('/manufacturer-insight');
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <h2>Manufacturer Login</h2>
        <button style={buttonStyle} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default ManufacturerLoginPage;
