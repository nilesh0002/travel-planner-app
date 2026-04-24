import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

interface NavbarProps {
  session: Session | null;
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        🌍 TravelPlanner
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {session ? (
          <>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

