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
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: 'background 0.4s, border-bottom 0.4s'
    }}>
      <style>{`
        @media (max-width: 640px) {
          nav { padding: 0 1rem !important; height: 70px !important; }
          .nav-logo span:last-child { display: none; }
        }
      `}</style>

      <Link to="/" className="nav-logo" style={{ 
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
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button 
          onClick={onToggleTheme} 
          aria-label="Toggle Theme"
          style={{
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-glow)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: 'var(--primary)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 5px 15px var(--primary-glow)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link to="/" className="nav-link">Dashboard</Link>
            <button 
              onClick={onLogout} 
              className="btn-primary btn-secondary" 
              style={{ 
                padding: '0.5rem 1rem', 
                minHeight: '40px',
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link to="/login" className="nav-link">Login</Link>
            <Link 
              to="/signup" 
              className="btn-primary" 
              style={{ 
                padding: '0.5rem 1.2rem',
                minHeight: '40px',
                fontSize: '0.9rem'
              }}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
