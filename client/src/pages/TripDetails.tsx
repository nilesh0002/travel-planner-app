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
    if (!window.confirm('Delete this activity?')) return;
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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="animate-pulse" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
        Loading itinerary...
      </div>
    </div>
  );
  
  if (!trip) return <div className="container"><h2>Adventure not found</h2></div>;

  const getTypeIcon = (type: ItemType) => {
    switch(type) {
      case 'Flight': return '✈️';
      case 'Hotel': return '🏨';
      case 'Food': return '🍽️';
      default: return '🎡';
    }
  };

  return (
    <main className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link to="/" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginLeft: '-1rem' }}>
          ← Back to Dashboard
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontWeight: '800' }}>{trip.title}</h1>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <span>📅</span>
                <span style={{ fontWeight: '500' }}>
                  {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <span>📍</span>
                <span style={{ fontWeight: '500' }}>{items.length} {items.length === 1 ? 'Activity' : 'Activities'}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleDeleteTrip} style={{ 
              background: 'rgba(239, 68, 68, 0.05)', 
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}>Delete</button>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ minHeight: 'auto', padding: '0.75rem 1.5rem' }}>
              {showForm ? 'Cancel' : '+ Add Activity'}
            </button>
          </div>
        </div>
      </header>

      {showForm && (
        <section className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>New Activity</h2>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label htmlFor="activityTitle">Activity Title</label>
              <input id="activityTitle" type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="e.g. Morning Walk at Central Park" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="dayNumber">Day Number</label>
                <input id="dayNumber" type="number" min="1" value={newDay} onChange={e => setNewDay(parseInt(e.target.value))} required />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" value={newType} onChange={e => setNewType(e.target.value as ItemType)}>
                  <option value="Activity">🎡 Activity</option>
                  <option value="Flight">✈️ Flight</option>
                  <option value="Hotel">🏨 Hotel</option>
                  <option value="Food">🍽️ Food</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="time">Time (Optional)</label>
                <input id="time" type="text" placeholder="e.g. 09:00 AM" value={newTime} onChange={e => setNewTime(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Add to Timeline</button>
          </form>
        </section>
      )}

      <section style={{ position: 'relative', marginTop: '2rem' }}>
        {items.length > 0 && (
          <div style={{
            position: 'absolute',
            left: '32px',
            top: '0',
            bottom: '0',
            width: '2px',
            background: 'linear-gradient(to bottom, var(--primary), var(--secondary))',
            opacity: 0.2,
            zIndex: 0
          }}></div>
        )}

        {items.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', zIndex: 1, position: 'relative' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your timeline is currently empty. Start adding activities to see them here!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 1, position: 'relative' }}>
            {items.sort((a, b) => {
              if (a.day !== b.day) return a.day - b.day;
              return (a.time || '').localeCompare(b.time || '');
            }).map(item => (
              <div key={item.id} className="glass-card" style={{ 
                padding: '1.25rem 1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem',
                marginLeft: '0'
              }}>
                <div style={{ 
                  minWidth: '64px', 
                  height: '64px', 
                  background: 'var(--bg-dark)', 
                  border: '1px solid var(--primary-glow)',
                  color: 'var(--primary)', 
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  boxShadow: 'var(--card-shadow)',
                  zIndex: 2
                }}>
                  <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.7 }}>Day</span>
                  <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{item.day}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{getTypeIcon(item.type)}</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.title}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{item.time || 'Flexible Time'}</span>
                    <span>•</span>
                    <span style={{ textTransform: 'capitalize' }}>{item.type}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteItem(item.id)} 
                  aria-label="Delete Activity"
                  style={{ 
                    background: 'var(--primary-light)', 
                    border: 'none', 
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    color: 'var(--text-muted)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.color = '#f87171';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'var(--primary-light)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
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
