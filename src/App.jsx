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
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      setMessage('שגיאה בעדכון הסיסמה: ' + error.message);
    } else {
      setMessage('הסיסמה עודכנה בהצלחה! מעביר אותך למערכת...');
      setTimeout(() => {
        setRecoveryMode(false);
        window.location.href = '/dashboard';
      }, 2000);
    }
  };

  return (
    <BrowserRouter>
      {recoveryMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 9999, direction: 'rtl', fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h2 style={{ color: '#0f172a', marginBottom: '15px' }}>איפוס סיסמה חדשה</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>הזן את הסיסמה החדשה שלך לחשבון</p>
            <form onSubmit={handleUpdatePassword}>
              <input
                type="password"
                placeholder="סיסמה חדשה"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {loading ? 'מעדכן...' : 'עדכן סיסמה ושמור'}
              </button>
            </form>
            {message && <p style={{ marginTop: '15px', color: message.includes('שגיאה') ? '#dc2626' : '#16a34a', fontWeight: 'bold' }}>{message}</p>}
          </div>
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