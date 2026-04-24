import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trip, ItineraryItem, ItemType } from '../types';

const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState(1);
  const [newType, setNewType] = useState<ItemType>('Activity');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, itemsRes] = await Promise.all([
          axios.get<Trip>(`${API_URL}/trips/id/${id}`),
          axios.get<ItineraryItem[]>(`${API_URL}/itinerary/${id}`)
        ]);
        setTrip(tripRes.data);
        setItems(itemsRes.data);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/itinerary`, {
        trip_id: id,
        title: newTitle,
        day: newDay,
        type: newType,
        time: newTime
      });
      setItems([...items, response.data]);
      setNewTitle('');
      setNewTime('');
      setShowForm(false);
    } catch (err) {
      alert('Error adding item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await axios.delete(`${API_URL}/itinerary/${itemId}`);
      setItems(items.filter(i => i.id !== itemId));
    } catch (err) {
      alert('Error deleting item');
    }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm('Are you sure you want to delete this adventure?')) return;
    try {
      await axios.delete(`${API_URL}/trips/${id}`);
      navigate('/');
    } catch (err) {
      alert('Error deleting trip');
    }
  };

  if (loading) return <div className="container"><h2>Loading itinerary...</h2></div>;
  if (!trip) return <div className="container"><h2>Adventure not found</h2></div>;

  return (
    <main className="animate-fade-in">
      <header style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
          ← Back to Adventures
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-1.5px' }}>{trip.title}</h1>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1.5rem', color: 'var(--text-muted)' }}>
              <span>📅 {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
              <span>📍 {items.length} Activities planned</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleDeleteTrip} className="btn-secondary" style={{ color: '#f87171' }}>Delete Trip</button>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? 'Cancel' : '+ Add Item'}
            </button>
          </div>
        </div>
      </header>

      {showForm && (
        <section className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>What's the next step?</h2>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label>Activity Title</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="e.g. Dinner at Shibuya Sky" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Day Number</label>
                <input type="number" min="1" value={newDay} onChange={e => setNewDay(parseInt(e.target.value))} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={newType} onChange={e => setNewType(e.target.value as ItemType)}>
                  <option value="Activity">🎡 Activity</option>
                  <option value="Flight">✈️ Flight</option>
                  <option value="Hotel">🏨 Hotel</option>
                  <option value="Food">🍽️ Food</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time (Optional)</label>
                <input type="text" placeholder="e.g. 09:00 PM" value={newTime} onChange={e => setNewTime(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Add to Timeline</button>
          </form>
        </section>
      )}

      <section>
        {items.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Your timeline is empty. Start adding activities!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.sort((a, b) => a.day - b.day).map(item => (
              <div key={item.id} className="event-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="day-badge">Day {item.day}</span>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{item.title}</h4>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{item.time || 'Flexible Time'}</span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span style={{ color: 'var(--text-muted)' }}>{item.type}</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteItem(item.id)} style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  fontSize: '1.2rem', 
                  cursor: 'pointer',
                  opacity: 0.5,
                  transition: 'opacity 0.2s'
                }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0.5'}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default TripDetails;
