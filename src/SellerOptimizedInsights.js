import React, { useState } from 'react';
import axios from 'axios';

const SellerOptimizedInsights = () => {
  const [imageData, setImageData] = useState('');
  const [buttonVisible, setButtonVisible] = useState(true);

  const handleSellerClick = () => {
    // Make a request to Flask backend for the seller graph
    axios.get('http://localhost:5000/get_optimized_route')
      .then(response => {
        setImageData(response.data.image);
        // Hide the button after successful click
        setButtonVisible(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#007bff', fontSize: '24px', marginBottom: '20px' }}>AI optimized path</h1>
      {buttonVisible && (
        <button
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
          onClick={handleSellerClick}
        >
          Generate Path
        </button>
      )}
      {imageData && <img style={{ maxWidth: '100%', height: 'auto', marginTop: '20px', border: '1px solid #007bff', borderRadius: '5px' }} src={`data:image/png;base64,${imageData}`} alt="Optimized Route" />}
    </div>
  );
};

export default SellerOptimizedInsights;
