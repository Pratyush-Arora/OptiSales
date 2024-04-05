import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierRecommendation = () => {
  const [supplierId, setSupplierId] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = () => {
    axios.get(`http://localhost:5000/api/supplier_recommendations/${supplierId}`)
      .then(response => {
        setRecommendations(response.data.recommendations);
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error);
      });
  };

  return (
    <div>
      <h1>Supplier Recommendations</h1>
      <label htmlFor="supplierId">Enter Supplier ID:</label>
      <input
        type="text"
        id="supplierId"
        value={supplierId}
        onChange={(e) => setSupplierId(e.target.value)}
      />
      <button onClick={fetchRecommendations}>Get Recommendations</button>
      <ul>
        {recommendations.map((recommendation) => (
          <li key={recommendation}>{recommendation}</li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierRecommendation;
