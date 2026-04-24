import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SignupProps {
  onSignup: (user: any) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password });
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('travel_token', res.data.token);
      localStorage.setItem('travel_user', JSON.stringify(res.data.user));
      onSignup(res.data.user);
      navigate('/');
    } catch (err: any) {
      console.error('Signup Error:', err);
      const serverMsg = err.response?.data?.error;
      const networkError = !err.response ? 'Connection failed. Check Vercel Env Variables!' : '';
      setError(serverMsg || networkError || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: 'calc(100vh - 80px)',
      gap: '4rem',
      alignItems: 'center'
    }} className="animate-fade-in">
      
      {/* Left Side: Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel login-card">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-1px' }}>Start Journey</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Create an account to start planning your trips.
          </p>

          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#f87171', 
              padding: '1rem', 
              borderRadius: '12px', 
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Nilesh Singh"
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="nilesh@example.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)' }}>
            Already a traveler? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Hero */}
      <div style={{ 
        flex: 1, 
        display: 'none', 
        '@media (min-width: 1024px)': { display: 'block' } 
      } as any}>
        <div style={{ position: 'relative' }}>
          <img 
            src={heroImage} 
            alt="Travel" 
            style={{ 
              width: '100%', 
              height: '600px', 
              objectFit: 'cover', 
              borderRadius: '24px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              transform: 'scaleX(-1)' // Flip image for variety
            }} 
          />
          <div style={{ 
            position: 'absolute', 
            bottom: '40px', 
            left: '40px', 
            right: '40px',
            padding: '2rem',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.1' }}>Your world, organized.</h2>
            <p style={{ marginTop: '1rem', color: '#cbd5e1', fontSize: '1.1rem' }}>
              Join thousands of travelers who plan their dream vacations with us.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Signup;
