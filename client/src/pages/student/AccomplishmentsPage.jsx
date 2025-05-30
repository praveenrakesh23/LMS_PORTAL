import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import './accomplishments.css'; // Import the new CSS file
import NoNetworkImage from '../../assets/no-network.png'; // Corrected import path

const AccomplishmentsPage = () => {
  const navigate = useNavigate();
  const [accomplishments, setAccomplishments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call to fetch accomplishments
    // fetch('/api/accomplishments', {})
    //   .then(res => res.json())
    //   .then(data => {
    //     setAccomplishments(data);
    //     setLoading(false);
    //   });

    // Dummy data matching the table structure
    const dummyData = [
      { id: 1, course: 'Dynamic Programming', performance: 'Top', completedOn: 'Apr 23\n11:59 PM IST', grade: 100 },
      { id: 2, course: 'Greedy Algorithms', performance: 'Merit', completedOn: 'Apr 23\n11:59 PM IST', grade: 85 },
      { id: 3, course: 'Spring - Ecosystem and Core', performance: 'Merit', completedOn: 'Apr 23\n11:59 PM IST', grade: 80 },
      { id: 4, course: 'Spring - Cloud Overview', performance: 'Passed', completedOn: 'Apr 23\n11:59 PM IST', grade: 75 },
    ];

    setTimeout(() => {
      setAccomplishments(dummyData);
      setLoading(false);
    }, 1000);

    // Set loading to false immediately to show the empty state (commented out to use dummy data)
    // setLoading(false);

  }, []);

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="ac-root">
      <DashboardHeader />
      <div className="ac-content-row">
        {/* Back button positioned similar to sidebar's back button area */}
        <div className="ac-back-button-container">
          <button onClick={handleBackClick} className="ac-back-button">
            &larr; Back
          </button>
        </div>
        <main className="ac-main">
          <h1 className="ac-title">Accomplishments</h1>

          {loading ? (
            // Basic Skeleton Loader (optional)
            <div className="ac-skeleton"></div>
          ) : accomplishments.length === 0 ? (
            <div className="ac-empty-state">
              <img src={NoNetworkImage} alt="No Accomplishments" className="ac-empty-image" />
              <div className="ac-empty-text">No Accomplishments!</div>
              <div className="ac-empty-subtext">Your journey is just beginning. Start learning and unlock your achievements!</div>
            </div>
          ) : (
            <div className="ac-table-container">
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Performance level</th>
                    <th>Completed on</th>
                    <th>Grade(%)</th>
                  </tr>
                </thead>
                <tbody>
                  {accomplishments.map(item => (
                    <tr key={item.id}>
                      <td>{item.course}</td>
                      <td><span className={`ac-badge ac-badge-${item.performance.toLowerCase()}`}>{item.performance}</span></td>
                      <td>{item.completedOn.split('\n').map((line, i) => <div key={i}>{line}</div>)}</td>
                      <td><span className={`ac-badge ac-badge-${item.grade >= 80 ? 'merit' : 'passed'}`}>{item.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AccomplishmentsPage; 