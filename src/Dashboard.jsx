import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { signOut } from 'aws-amplify/auth';
import { listAdLocations } from './graphql/queries';

const Dashboard = () => {
  const [adLocations, setAdLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const client = generateClient();

  // Fetch AdLocations for the logged-in user
  const fetchAdLocations = async () => {
    try {
      setLoading(true);
      const response = await client.graphql({
        query: listAdLocations,
        // This filter will automatically apply based on the user's profileOwner
        authMode: 'userPool'
      });
      
      setAdLocations(response.data.listAdLocations.items);
    } catch (err) {
      console.error('Error fetching ad locations:', err);
      setError('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdLocations();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      // Navigation will be handled by your auth listener/protected routes
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Your Ad Locations</h1>
      
      <div className="ad-locations-list">
        {adLocations.length === 0 ? (
          <p>No locations found</p>
        ) : (
          adLocations.map((location) => (
            <div key={location.id} className="location-card">
              <h3>Location: {location.location}</h3>
              <p>Object ID: {location.objectId}</p>
              <p>Scan Date: {new Date(location.scanDate).toLocaleDateString()}</p>
              <p>QR Code: {location.qrCode}</p>
            </div>
          ))
        )}
      </div>

      <button 
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

// Add some basic styling
const styles = `
  .dashboard-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .ad-locations-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }

  .location-card {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .logout-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .logout-button:hover {
    background-color: #d32f2f;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Dashboard;
