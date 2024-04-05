import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const DemandForecast = () => {
  const [forecastData, setForecastData] = useState({ dates: [], sales: [] });

  useEffect(() => {
    const fetchDemandForecast = async () => {
      try {
        const response = await axios.get('/api/demand_forecast');
        setForecastData(response.data.forecast);
      } catch (error) {
        console.error('Error fetching demand forecast:', error);
      }
    };

    fetchDemandForecast();
  }, []);

  const chartData = {
    labels: forecastData.dates,
    datasets: [
      {
        label: 'Forecasted Sales',
        data: forecastData.sales,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        type: 'time',
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sales',
        },
      },
    },
  };
  

  return (
    <div>
      <h1>Demand Forecast</h1>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default DemandForecast;
