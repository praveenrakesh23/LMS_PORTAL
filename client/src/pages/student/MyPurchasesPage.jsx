import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import MyPurchases from './MyPurchases';
import './my-purchases.css'; // Import the shared CSS

const MyPurchasesPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="mp-root">
      <DashboardHeader />
      <div className="mp-content-row">
        {/* Back button positioned similar to sidebar's back button area */}
        <div className="mp-back-button-container">
          <button onClick={handleBackClick} className="mp-back-button">
            &larr; Back
          </button>
        </div>
        <main className="mp-main">
          <MyPurchases />
        </main>
      </div>
    </div>
  );
};

export default MyPurchasesPage; 