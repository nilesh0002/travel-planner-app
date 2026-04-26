import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message);
      if (response.data.token) {
        setResetToken(response.data.token);
      }
    } catch (err: any) {
      console.error('Forgot Password Error:', err);
      if (!err.response) {
        setError('Server connection failed. Please ensure the backend is running.');
      } else {
        setError(err.response.data?.error || 'Failed to process request. Please try again.');
      }
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
      <div className="glass-panel login-card" style={{ maxWidth: '450px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-1px' }}>Forgot Password</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1rem' }}>
          Enter your email and we'll send you a reset token to access your account.
        </p>

        {message && (
          <div style={{ 
            background: 'rgba(34, 197, 94, 0.1)', 
            color: '#4ade80', 
            padding: '1rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            animation: 'fadeIn 0.3s ease'
          }}>
            {message}
          </div>
        )}

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
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Processing...' : 'Send Reset Token'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/login" className="nav-link" style={{ fontSize: '0.95rem' }}>Back to Login</Link>
        </div>

        {resetToken && (
          <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--primary-glow)', background: 'var(--primary-light)', animation: 'fadeIn 0.4s ease' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Demo Recovery Token</p>
            <code style={{ display: 'block', padding: '0.75rem', background: 'var(--bg-dark)', borderRadius: '8px', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem' }}>{resetToken}</code>
            <Link to={`/reset-password?email=${email}&token=${resetToken}`} style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Proceed to Reset →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
