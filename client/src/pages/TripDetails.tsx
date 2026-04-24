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

  // Form state for adding new itinerary items
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState(1);
  const [newType, setNewType] = useState<ItemType>('Activity');
  const [newTime, setNewTime] = useState('');

  // Fetch trip and its itinerary
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

  // Handle adding a new item
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

  // Handle deleting an item
  const handleDeleteItem = async (itemId: string) => {
    try {
      await axios.delete(`${API_URL}/itinerary/${itemId}`);
      setItems(items.filter(i => i.id !== itemId));
    } catch (err) {
      alert('Error deleting item');
    }
  };

  // Handle deleting the entire trip
  const handleDeleteTrip = async () => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await axios.delete(`${API_URL}/trips/${id}`);
      navigate('/');
    } catch (err) {
      alert('Error deleting trip');
    }
  };

  if (loading) return <div className="container"><h2>Loading adventure...</h2></div>;
  if (!trip) return <div className="container"><h2>Trip not found</h2></div>;

  return (
    <main className="container animate-fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Dashboard</Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <h1>{trip.title}</h1>
          <div>
            <button onClick={handleDeleteTrip} className="btn-secondary" style={{ marginRight: '1rem', color: 'red' }}>Delete Trip</button>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? 'Cancel' : '+ Add Item'}
            </button>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
        </p>
      </header>

      {showForm && (
        <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Add New Activity</h3>
          <form onSubmit={handleAddItem} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>What's the plan?</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="e.g. Hiking" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Day</label>
                <input type="number" min="1" value={newDay} onChange={e => setNewDay(parseInt(e.target.value))} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value as ItemType)}>
                  <option value="Activity">Activity</option>
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Food">Food</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="text" placeholder="10:00 AM" value={newTime} onChange={e => setNewTime(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Add to Itinerary</button>
          </form>
        </section>
      )}

      <section className="itinerary-section">
        {items.length === 0 ? (
          <p>No activities added yet.</p>
        ) : (
          items.sort((a, b) => a.day - b.day).map(item => (
            <div key={item.id} className="event-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span className="day-badge">Day {item.day}</span>
                <h4 style={{ marginTop: '0.5rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{item.time || 'All Day'} | {item.type}</p>
              </div>
              <button onClick={() => handleDeleteItem(item.id)} className="btn-secondary" style={{ padding: '0.5rem' }}>🗑️</button>
            </div>
          ))
        )}
      </section>
    </main>
  );
};

export default TripDetails;
