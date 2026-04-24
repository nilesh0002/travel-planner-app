import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Trip } from '../types';

const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Get all trips (using the logged-in user ID)
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get<Trip[]>(`${API_URL}/trips/${userId}`);
        setTrips(response.data);
      } catch (err) {
        console.error('Failed to load trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <div className="container"><h2>Loading your trips...</h2></div>;
  }

  return (
    <main className="container animate-fade-in">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '3rem'
      }}>
        <div>
          <h1>My Adventures</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back! Where are we going next?</p>
        </div>
        <Link to="/create-trip" className="btn-primary">
          + New Trip
        </Link>
      </header>

      <section>
        {trips.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ marginBottom: '2rem' }}>No trips planned yet. Time to explore!</p>
            <Link to="/create-trip" className="btn-primary">Start Planning</Link>
          </div>
        ) : (
          <div className="trip-grid">
            {trips.map((trip) => (
              <Link key={trip.id} to={`/trip/${trip.id}`} className="card trip-card" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{trip.title}</h3>
                  <span>✈️</span>
                </div>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                </p>
                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '600' }}>View Itinerary →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;

