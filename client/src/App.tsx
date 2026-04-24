import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Components
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<{ id: string, email: string, name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('travel_theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('travel_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('travel_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('travel_user');
    localStorage.removeItem('travel_token');
    setUser(null);
  };

  if (loading) return <div className="container"><h2>Loading...</h2></div>;

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
      <div className="container">
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup onSignup={setUser} /> : <Navigate to="/" />} />
          
          <Route path="/" element={user ? <Dashboard userId={user.id} /> : <Navigate to="/login" />} />
          <Route path="/create-trip" element={user ? <CreateTrip userId={user.id} /> : <Navigate to="/login" />} />
          <Route path="/trip/:id" element={user ? <TripDetails /> : <Navigate to="/login" />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
