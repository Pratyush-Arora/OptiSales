import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SupplierRecommendation from './SupplierRecommendation';
import FutureSalePrediction from './FutureSalePrediction';
import DemandForecast from './DemandForecast';

const SupplyChainInsightPage = () => {
  const [salesOverTimeURL, setSalesOverTimeURL] = useState('');
  const [marketDemandTrendsURL, setMarketDemandTrendsURL] = useState('');
  const [selectedOption, setSelectedOption] = useState('dashboard');

  useEffect(() => {
    const fetchSalesOverTime = async () => {
      try {
        const response1 = await axios.get('http://localhost:5000/api/sales_over_time');
        setSalesOverTimeURL(response1.data.image);
      } catch (error) {
        console.error('Error fetching sales over time data:', error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/market_demand_trends');
        setMarketDemandTrendsURL(response.data.image);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    fetchSalesOverTime();
  }, []);

  const navigationOptions = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'supplier-recommendation', label: 'Supplier Recommendation' },
    { id: 'future-sale-prediction', label: 'Future Sale Prediction' },
    { id: 'demand-forecast', label: 'Demand Forecast' },
  ];

  const renderContent = () => {
    switch (selectedOption) {
      case 'supplier-recommendation':
        return <SupplierRecommendation />;
      case 'future-sale-prediction':
        return <FutureSalePrediction />;
      case 'demand-forecast':
        return <DemandForecast />;
      default:
        return (
          <>
            <div>
              <h2>Sales Over Time:</h2>
              {salesOverTimeURL && (
                <img src={`data:image/png;base64,${salesOverTimeURL}`} alt="Sales Over Time Plot" />
              )}
            </div>

            <div>
              <h2>Market Demand Trends:</h2>
              {marketDemandTrendsURL && (
                <img src={`data:image/png;base64,${marketDemandTrendsURL}`} alt="Market Demand Trends Plot" />
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#007bff', padding: '20px', color: '#fff' }}>
        <h2>Dashboard</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navigationOptions.map(option => (
            <li key={option.id} onClick={() => setSelectedOption(option.id)}>
              {option.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default SupplyChainInsightPage;
