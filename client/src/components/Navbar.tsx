import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, theme, onToggleTheme }) => {
  return (
    <nav style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" style={{ 
        fontSize: '1.5rem', 
        fontWeight: '800', 
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ fontSize: '1.8rem' }}>🌍</span>
        <span className="text-gradient">TravelPlanner</span>
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <button 
          onClick={onToggleTheme} 
          style={{
            background: 'var(--primary-light)',
            border: 'none',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/" style={{ 
              color: 'var(--text-main)', 
              textDecoration: 'none', 
              fontSize: '0.95rem', 
              fontWeight: '600' 
            }}>Dashboard</Link>
            <button onClick={onLogout} className="btn-primary btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ 
              color: 'var(--text-main)', 
              textDecoration: 'none', 
              fontWeight: '600',
              fontSize: '0.95rem',
              padding: '0.6rem 1rem'
            }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
