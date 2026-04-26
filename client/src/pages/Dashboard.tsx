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
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }} className="animate-pulse">✈️</div>
          <h2 className="text-gradient">Preparing your adventures...</h2>
        </div>
      </div>
    );
  }

  return (
    <main className="animate-fade-in">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800' }}>My <span className="text-gradient">Adventures</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
            {trips.length} upcoming journeys waiting for you
          </p>
        </div>
        <Link to="/create-trip" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          + Plan New Trip
        </Link>
      </header>

      <section>
        {trips.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '8rem 2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🧭</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your map is currently empty</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
              The world is vast and full of wonders. Start planning your first itinerary today and let the journey begin.
            </p>
            <Link to="/create-trip" className="btn-primary">Start Your First Plan</Link>
          </div>
        ) : (
          <div className="trip-grid">
            {trips.map((trip) => (
              <Link key={trip.id} to={`/trip/${trip.id}`} className="glass-card" style={{ padding: '2rem', textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    padding: '0.8rem', 
                    background: 'var(--primary-light)', 
                    borderRadius: '16px',
                    fontSize: '1.5rem'
                  }}>
                    🏝️
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '700', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em',
                    padding: '0.4rem 0.8rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--secondary)',
                    borderRadius: '20px'
                  }}>
                    Upcoming
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '1rem' }}>{trip.title}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '1.1rem' }}>📅</span>
                  <p style={{ fontSize: '1rem', fontWeight: '500' }}>
                    {new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(trip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
                  <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.95rem' }}>View Itinerary</span>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    background: 'var(--primary)', 
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)'
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
