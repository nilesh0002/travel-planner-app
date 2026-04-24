import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
      // After register, log them in automatically
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('travel_token', res.data.token);
      localStorage.setItem('travel_user', JSON.stringify(res.data.user));
      onSignup(res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container animate-fade-in" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Join the travel planner community
        </p>

        {error && <div style={{ color: '#ff4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;
