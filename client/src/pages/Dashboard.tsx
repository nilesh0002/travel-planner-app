import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trip } from '../types';

const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
  }, [userId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animate-fade-in">
          <h2 style={{ color: 'var(--primary)', fontWeight: '700' }}>Preparing your adventures...</h2>
        </div>
      </div>
    );
  }

  return (
    <main className="animate-fade-in">
      <header className="dashboard-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        marginBottom: '4rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '2rem'
      }}>
        <style>{`
          @media (max-width: 768px) {
            .dashboard-header {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 2rem !important;
              margin-bottom: 2.5rem !important;
            }
          }
        `}</style>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-1.5px' }}>My Adventures</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Explore your upcoming journeys and past explorations.
          </p>
        </div>
        <Link to="/create-trip" className="btn-primary" style={{ textDecoration: 'none' }}>
          + Plan New Trip
        </Link>
      </header>

      <section>
        {trips.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🧭</div>
            <h2 style={{ marginBottom: '1rem' }}>No trips found yet.</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
              The world is waiting for you. Start by planning your first adventure.
            </p>
            <Link to="/create-trip" className="btn-primary" style={{ textDecoration: 'none' }}>Start Planning</Link>
          </div>
        ) : (
          <div className="trip-grid">
            {trips.map((trip) => (
              <Link key={trip.id} to={`/trip/${trip.id}`} className="trip-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-white)' }}>{trip.title}</h3>
                  <span style={{ fontSize: '1.2rem' }}>🌴</span>
                </div>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--primary)' }}>📅</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                    {new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div style={{ 
                  marginTop: '2.5rem', 
                  paddingTop: '1.5rem', 
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>View Details</span>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    background: 'var(--primary)', 
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#000'
                  }}>→</div>
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
