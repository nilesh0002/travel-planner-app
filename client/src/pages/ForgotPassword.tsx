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
  const [resetToken, setResetToken] = useState(''); // To help user in demo

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
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">Enter your email and we'll send you a reset token</p>

        {message && (
          <div className="message-box success">
            {message}
            {resetToken && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#f0f9ff', color: '#0369a1', borderRadius: '4px', fontWeight: 'bold' }}>
                DEMO TOKEN: {resetToken}
              </div>
            )}
          </div>
        )}
        {error && <div className="message-box error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Processing...' : 'Send Reset Token'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
      
      {resetToken && (
        <div className="auth-footer" style={{ marginTop: '20px' }}>
          <Link to={`/reset-password?email=${email}&token=${resetToken}`} style={{ color: '#2563eb', fontWeight: 'bold' }}>
            Go to Reset Page →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
