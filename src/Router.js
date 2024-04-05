// Router.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import other components
import HomePage from './HomePage';
import SellerLoginPage from './SellerLoginPage';
import ManufacturerLoginPage from './ManufacturerLoginPage';
import SellerInsightPage from './SellerInsightPage';
import ManufacturerInsightPage from './ManufacturerInsightPage';
import SellerOptimizedInsights from './SellerOptimizedInsights';
import SupplierRecommendation from './SupplierRecommendation';
import FutureSalePrediction from './FutureSalePrediction';
import DemandForecast from './DemandForecast';
import LoginPage from './LoginPage'; // Import LoginPage component
import SupplierLinkagePage from './SupplierLinkagePage'; // Import SupplierLinkagePage component

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home/seller" element={<SellerLoginPage />} />
        <Route path="/home/manufacturer" element={<ManufacturerLoginPage />} />
        <Route path="/seller-insight" element={<SellerInsightPage />} />
        <Route path="/manufacturer-insight" element={<ManufacturerInsightPage />} />
        <Route path="/seller-optimized-insights" element={<SellerOptimizedInsights />} />
        <Route path="/supplier-recommendation" element={<SupplierRecommendation />} />
        <Route path="/future-sale-prediction" element={<FutureSalePrediction />} />
        <Route path="/demand-forecast" element={<DemandForecast />} />
        {/* Add routes for the new components */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/supplier-linkage/:supplierId" element={<SupplierLinkagePage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
