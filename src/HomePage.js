// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const userRoles = ['seller', 'manufacturer'];

  const containerStyle = {
    margin: '-20px',
    maxWidth: '1200px',
  };

  const flexContainerStyle = {
    display: 'flex',
    height: '100vh', // Make the flex container fill the viewport height
  };

  const sidebarStyle = {
    flex: '0 0 25%',
    backgroundColor: '#007bff', // Blue color
    padding: '20px',
    borderRadius: '5px',
    marginRight: '20px', // Add margin to the right
  };

  const mainContentStyle = {
    flex: '1', // Make the main content div occupy the remaining space
    overflow: 'hidden', // Hide any content overflow
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const headerStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const taglineStyle = {
    fontSize: '24px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={flexContainerStyle}>
        {/* Sidebar */}
        <div style={sidebarStyle}>
          <div style={{ marginBottom: '200px' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
          </div>
          <div style={{ marginBottom: '200px' }}>
            <Link to="/recents" style={{ color: '#fff', textDecoration: 'none' }}>Recents</Link>
          </div>
          {userRoles.map((role) => (
            <div key={role} style={{ marginBottom: '200px' }}>
              <Link to={`/home/${role}`} style={{ color: '#fff', textDecoration: 'none' }}>
                {role.charAt(0).toUpperCase() + role.slice(1)} Login
              </Link>
            </div>
          ))}
          {/* Add a link to the login page */}
          <div style={{ marginBottom: '200px' }}>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={mainContentStyle}>
          <div style={headerStyle}>
            OptiSales
          </div>
          <div style={taglineStyle}>
            Your Supply Chain Partner for Success
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
