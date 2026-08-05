import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LandingGlobal from './pages/LandingGlobal';
import LandingLocal from './pages/LandingLocal';
import Dashboard from './pages/Dashboard';
import PublicQuote from './pages/PublicQuote';

function RootHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const search = window.location.search;
    const isEnglishQuery = search.includes('lang=en') || search.includes('en=true');

    // אם המשתמש ביקש במפורש אנגלית, אל תפנה אותו לעברית!
    if (isEnglishQuery) {
      return;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLang = navigator.language || navigator.userLanguage || '';
    
    // זיהוי משתמש מישראל לפי אזור זמן או שפת דפדפן עברית והפניה אוטומטית לגרסה המקומית
    if (timeZone === 'Asia/Jerusalem' || browserLang.toLowerCase().startsWith('he')) {
      navigate('/he', { replace: true });
    }
  }, [navigate]);

  return <LandingGlobal />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootHandler />} />
        <Route path="/he" element={<LandingLocal />} />
        <Route path="/en" element={<LandingGlobal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/public-quote/:id" element={<PublicQuote />} />
        <Route path="*" element={<LandingGlobal />} />
      </Routes>
    </BrowserRouter>
  );
}