import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        🌍 TravelPlanner
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hi, {user.name}</span>
            <button onClick={onLogout} className="btn-secondary" style={{ padding: '0.4rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
