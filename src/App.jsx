import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingGlobal from './pages/LandingGlobal';
import LandingLocal from './pages/LandingLocal';
import Dashboard from './pages/Dashboard';
import PublicQuote from './pages/PublicQuote';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingGlobal />} />
        <Route path="/he" element={<LandingLocal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quote/:id" element={<PublicQuote />} />
      </Routes>
    </Router>
  );
}