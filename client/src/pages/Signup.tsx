import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const getApiUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    if (envUrl.includes('onrender.com') && !envUrl.toLowerCase().endsWith('/api')) {
      envUrl = envUrl.replace(/\/$/, '') + '/api';
    }
    return envUrl;
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

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
    } catch (err: any) {
      console.error('Signup Error:', err);
      const serverMsg = err.response?.data?.error;
      setError(serverMsg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0',
      minHeight: 'calc(100vh - 120px)'
    }}>
      <style>{`
        .auth-layout {
          display: flex;
          flex-direction: row-reverse;
          width: 100%;
          max-width: 1100px;
          gap: 4rem;
          align-items: center;
        }
        .hero-side {
          flex: 1.2;
          position: relative;
          display: block;
        }
        .form-side {
          flex: 1;
          display: flex;
          justify-content: center;
        }
        @media (max-width: 1024px) {
          .hero-side { display: none; }
          .auth-layout { justify-content: center; }
        }
      `}</style>

      <div className="auth-layout">
        {/* Right Side: Hero (Inverted for Signup for variety) */}
        <div className="hero-side">
          <div style={{ position: 'relative', height: '600px' }}>
            <img 
              src={heroImage} 
              alt="Travel Planning" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '32px',
                boxShadow: 'var(--shadow)',
                transform: 'scaleX(-1)'
              }} 
            />
            <div style={{ 
              position: 'absolute', 
              bottom: '30px', 
              left: '30px', 
              right: '30px',
              padding: '2.5rem',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1rem' }}>Your world, organized.</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                Join thousands of travelers who plan their dream vacations with us.
              </p>
            </div>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="form-side">
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
                border: '1px solid rgba(239, 68, 68, 0.2)',
                animation: 'fadeIn 0.3s ease'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  id="name"
                  type="text" 
                  placeholder="Nilesh Singh"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="name@example.com"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  id="password"
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

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Already a traveler? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
