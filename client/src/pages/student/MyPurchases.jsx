import React, { useEffect, useState } from "react";
import './my-purchases.css'; // Import the new CSS file
// Remove shadcn/ui imports
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call
    // fetch("/api/purchases", {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${token}`, // Assuming token is available from AuthContext
    //   },
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     setPurchases(data);
    //     setLoading(false);
    //   });

    // Dummy Data
    const dummyData = [ 
      {
        id: 1,
        course: "Data Science Masterclass",
        date: "2025-05-01",
        price: "₹999",
        status: "Active",
        link: "/courses/data-science",
      },
      {
        id: 2,
        course: "Web Development Bootcamp",
        date: "2025-03-15",
        price: "₹799",
        status: "Completed",
        link: "/courses/web-dev",
      },
    ];
    setTimeout(() => {
      setPurchases(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="mp-container">
      <h1 className="mp-title">My Purchases</h1>

      {loading ? (
        // Basic Skeleton Loader (replace with more detailed if needed)
        <div className="mp-skeleton"></div> 
      ) : purchases.length === 0 ? (
        <p className="mp-empty-state">No purchases found.</p>
      ) : (
        <div className="mp-list">
          {purchases.map((item) => (
            <div key={item.id} className="mp-card">
              <div className="mp-card-content">
                <div className="mp-card-details">
                  <h2 className="mp-course-title">{item.course}</h2>
                  <p className="mp-purchase-date">
                    Purchased on: {item.date}
                  </p>
                </div>
                <div className="mp-card-meta">
                  <span className="mp-price">{item.price}</span>
                  <span className="mp-status">{item.status}</span>
                  <a href={item.link} className="mp-link">
                    Go to Course →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchases; 