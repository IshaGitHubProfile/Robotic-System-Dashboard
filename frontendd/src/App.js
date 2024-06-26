import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import './App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={token ? <Dashboard /> : <AuthPage setToken={setToken} />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <AuthPage setToken={setToken} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
