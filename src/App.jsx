import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LandingGlobal from './pages/LandingGlobal';
import LandingLocal from './pages/LandingLocal';
import Dashboard from './pages/Dashboard';
import PublicQuote from './pages/PublicQuote';
import { supabase } from './supabase';

function RootHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const search = window.location.search;
    const hash = window.location.hash;
    const isEnglishQuery = search.includes('lang=en') || search.includes('en=true');

    // שמירת ה-Hash וה-Search המלאים (כולל טוקני האיפוס של Supabase) והפניה לדשבורד
    if (hash.includes('type=recovery') || search.includes('type=recovery')) {
      navigate('/dashboard' + hash + search, { replace: true });
      return;
    }

    if (isEnglishQuery) {
      return;
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserLang = navigator.language || navigator.userLanguage || '';
    
    if (timeZone === 'Asia/Jerusalem' || browserLang.toLowerCase().startsWith('he')) {
      navigate('/he', { replace: true });
    }
  }, [navigate]);

  return <LandingGlobal />;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }
    });

    if (window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery')) {
      setRecoveryMode(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      {recoveryMode && (
        <div style={{ background: '#fef2f2', border: '1px solid #ef4444', padding: '15px', textAlign: 'center', direction: 'rtl' }}>
          <span style={{ color: '#dc2626' }}><b>זוהתה בקשת איפוס סיסמה. אנא עדכן את סיסמתך בהגדרות החשבון או דרך טופס ההתחברות.</b></span>
        </div>
      )}
      <Routes>
        <Route path="/" element={<RootHandler />} />
        <Route path="/he" element={<LandingLocal />} />
        <Route path="/en" element={<LandingGlobal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/public-quote/:id" element={<PublicQuote />} />
        <Route path="/quote/:id" element={<PublicQuote />} />
        <Route path="*" element={<LandingGlobal />} />
      </Routes>
    </BrowserRouter>
  );
}