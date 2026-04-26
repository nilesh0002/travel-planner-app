import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface CreateTripProps {
  userId: string;
}

const CreateTrip: React.FC<CreateTripProps> = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/trips`, {
        title,
        start_date: startDate,
        end_date: endDate,
        user_id: userId
      });
      navigate('/');
    } catch (err) {
      alert('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="animate-fade-in" style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <Link to="/" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginLeft: '-1rem' }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Plan a new journey</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Set your destination and dates to begin.</p>
      </header>

      <section className="glass-panel" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tripTitle">Trip Destination / Title</label>
            <input 
              id="tripTitle"
              type="text" 
              placeholder="e.g. Summer in Tokyo" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="date-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
            <div className="form-group">
              <label htmlFor="startDate">Departure Date</label>
              <input 
                id="startDate"
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">Return Date</label>
              <input 
                id="endDate"
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn-primary" style={{ flex: 2, minWidth: '200px' }} disabled={loading}>
              {loading ? 'Creating Adventure...' : 'Start Planning'}
            </button>
            <Link to="/" className="btn-primary btn-secondary" style={{ flex: 1, minWidth: '120px', minHeight: '48px', textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
