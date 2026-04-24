import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Professional authentication handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {isSignUp ? 'Join the Adventure' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'Create your account to start planning.' : 'Sign in to access your itineraries.'}
          </p>
        </div>
        
        <form onSubmit={handleAuth}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="explorer@earth.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {isSignUp ? 'Already an explorer?' : "New to AeroTransit?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: 'none', color: 'var(--primary)', fontWeight: 700, padding: 0 }}
            >
              {isSignUp ? 'Sign In' : 'Join Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
