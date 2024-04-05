import React, { useState } from 'react';
import axios from 'axios';

const FutureSalePrediction = () => {
  const [futureStartDate, setFutureStartDate] = useState('');
  const [futureEndDate, setFutureEndDate] = useState('');
  const [futureSales, setFutureSales] = useState([]);
  const [error, setError] = useState('');

  const handlePredictFutureSales = async () => {
    try {
      // Convert date to a format compatible with Flask (YYYY-MM-DD)
      const formattedStartDate = new Date(futureStartDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(futureEndDate).toISOString().split('T')[0];

      const response = await axios.post('http://localhost:5000/api/future_sale_prediction', {
        future_start_date: formattedStartDate,
        future_end_date: formattedEndDate,
      });

      setFutureSales(response.data.futureSales);
      setError('');
    } catch (error) {
      setError('Error predicting future sales. Please check your input.');
    }
  };

  return (
    <div>
      <h1>Predict Future Sales</h1>
      <div>
        <label htmlFor="futureStartDate">Future Start Date:</label>
        <input
          type="date"
          id="futureStartDate"
          value={futureStartDate}
          onChange={(e) => setFutureStartDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="futureEndDate">Future End Date:</label>
        <input
          type="date"
          id="futureEndDate"
          value={futureEndDate}
          onChange={(e) => setFutureEndDate(e.target.value)}
        />
      </div>
      <button onClick={handlePredictFutureSales}>Predict Future Sales</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Future Sales Prediction:</h2>
      <ul>
        {futureSales.map((sale, index) => (
          <li key={index}>Day {index + 1}: {sale}</li>
        ))}
      </ul>
    </div>
  );
};

export default FutureSalePrediction;
