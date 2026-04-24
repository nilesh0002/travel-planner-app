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
    <main className="animate-fade-in" style={{ maxWidth: '700px', margin: '4rem auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
          ← Back to Dashboard
        </Link>
        <h1 style={{ marginTop: '1.5rem', fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1.5px' }}>Plan a new journey</h1>
      </header>

      <section className="glass-panel" style={{ padding: '3.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Trip Destination / Title</label>
            <input 
              type="text" 
              placeholder="e.g. Summer in Tokyo" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label>Departure Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Return Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Finalizing...' : 'Create Adventure'}
            </button>
            <Link to="/" className="btn-secondary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
