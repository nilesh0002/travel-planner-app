import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const CreateTrip: React.FC = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission to create a new trip
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/trips`, {
        title,
        start_date: startDate,
        end_date: endDate,
        user_id: 'default-user'
      });
      navigate('/'); // Go back to dashboard
    } catch (err) {
      alert('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container animate-fade-in" style={{ maxWidth: '600px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Adventures</Link>
        <h1 style={{ marginTop: '1rem' }}>Plan New Trip</h1>
      </header>

      <section className="glass-panel" style={{ padding: '2rem' }}>
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
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Adventure'}
            </button>
            <Link to="/" className="btn-secondary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;

