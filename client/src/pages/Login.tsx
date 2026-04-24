import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('travel_token', res.data.token);
      localStorage.setItem('travel_user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 'calc(100vh - 120px)',
      gap: '2rem',
      justifyContent: 'center',
      padding: '1rem 0'
    }} className="animate-fade-in login-container">
      
      <style>{`
        @media (min-width: 1024px) {
          .login-container { 
            flex-direction: row !important;
            gap: 4rem !important;
          }
          .hero-side { display: block !important; }
        }
      `}</style>
      
      {/* Left Side: Hero */}
      <div className="hero-side" style={{ 
        flex: 1, 
        display: 'none'
      }}>
        <div style={{ position: 'relative' }}>
          <img 
            src={heroImage} 
            alt="Travel" 
            style={{ 
              width: '100%', 
              height: '600px', 
              objectFit: 'cover', 
              borderRadius: '24px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
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
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.1' }}>Adventure awaits.</h2>
            <p style={{ marginTop: '1rem', color: '#cbd5e1', fontSize: '1.1rem' }}>
              Plan your next journey with the world's most intuitive itinerary planner.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel login-card">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-1px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Enter your credentials to access your trips.
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
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)' }}>
            New traveler? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
