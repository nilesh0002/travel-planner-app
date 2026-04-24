import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';

// Components
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="container"><h2>Connecting to the world...</h2></div>;
  }

  return (
    <Router>
      <Navbar session={session} />
      <div className="container">
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={session ? <Dashboard user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/create-trip" element={session ? <CreateTrip user={session.user} /> : <Navigate to="/login" />} />
          <Route path="/trip/:id" element={session ? <TripDetails /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

