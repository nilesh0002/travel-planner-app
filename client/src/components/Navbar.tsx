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
    <nav className="navbar">
      <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        🌍 TravelPlanner
      </Link>
      
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {/* Theme Toggle Button */}
        <button 
          onClick={onToggleTheme} 
          className="theme-toggle" 
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/" className="hide-mobile" style={{ color: 'var(--text-white)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>Dashboard</Link>
            <button onClick={onLogout} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', textDecoration: 'none', minHeight: 'auto' }}>Join</Link>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .hide-mobile { display: none; }
          .nav-brand { font-size: 1.1rem; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
