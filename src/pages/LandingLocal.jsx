import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ProFlowLogo from '../components/ProFlowLogo';
import AccessibilityModal from '../components/AccessibilityModal';

export default function LandingLocal() {
  const navigate = useNavigate();
  const [showAccessibility, setShowAccessibility] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  return (
    <div dir="rtl" style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', color: '#1e293b' }}>
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} isHebrew={true} />
      
      {/* Header */}
      <header style={{ padding: '20px 40px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <ProFlowLogo size={40} />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/?force=en" style={{ fontSize: '0.95rem', color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>English</a>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}>
            התחבר / הירשם
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            🇮🇱 מערכת מתקדמת לניהול עסק והצעות מחיר בישראל
          </span>
          <h1 style={{ fontSize: '3.5rem', color: '#0f172a', margin: '20px 0', fontWeight: '900', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
            הפקת הצעות מחיר בקליק וניהול עסק חכם
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            צור הצעות מחיר מקצועיות בשקלים (כולל מע"מ 18%), קבל חתימות דיגיטליות מאובטחות מלקוחות, נהל ספר לקוחות CRM ועקוב אחר הכנסות והוצאות בקלות.
          </p>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}>
            התחל עכשיו בחינם
          </button>
        </section>

        {/* Features Section */}
        <section style={{ background: 'white', padding: '70px 20px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' }}>הפתרון המושלם לעסקים שרוצים לחסוך זמן</h2>
              <p style={{ color: '#64748b', fontSize: '1.05rem' }}>כל הכלים המתקדמים ביותר לניהול ההצעות והלקוחות במקום אחד.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px' }}>
              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>✍️</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>חתימה דיגיטלית</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>הלקוח חותם דיגיטלית מכל מכשיר, המסמך ננעל אוטומטית כמאושר למניעת מחלוקות.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📄</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>הפקת PDF מקצועי</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>יצירת קובצי PDF רשמיים עם חישובי מע"מ מדויקים (18% בארץ) והורדה מהירה.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>👥</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>ניהול לקוחות CRM</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>מעקב אחר היסטוריית לקוחות, סוג לקוח (עסקי/פרטי), ח.פ. ותנאי תשלום.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>💬</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>שליחה בוואטסאפ</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>שליחת הצעות מחיר וקישורים ישירות לוואטסאפ של הלקוח בלחיצת כפתור אחת.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' }}>מחירון שקוף והוגן</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '50px' }}>בחר את המסלול שמתאים בדיוק לגודל העסק שלך.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', textAlign: 'right' }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '35px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 10px 0' }}>מסלול חינמי (Free)</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px' }}>₪0 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/ חודש</span></div>
              <ul style={{ margin: '0 0 30px 0', padding: '0 20px 0 0', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.8', flex: 1 }}>
                <li>עד 5 הצעות מחיר בחודש</li>
                <li>ניהול לקוחות בסיסי</li>
                <li>הפקת PDF רשמי</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>התחל בחינם</button>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '35px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 10px 0' }}>מסלול בסיסי (Basic)</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#4f46e5', marginBottom: '20px' }}>₪49 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/ חודש</span></div>
              <ul style={{ margin: '0 0 30px 0', padding: '0 20px 0 0', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.8', flex: 1 }}>
                <li>עד 20 הצעות מחיר בחודש</li>
                <li>עריכה ושכפול הצעות מחיר</li>
                <li>קטלוג שירותים אישי</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>בחר מסלול Basic</button>
            </div>

            <div style={{ background: 'white', border: '2px solid #4f46e5', borderRadius: '16px', padding: '35px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 15px 30px -10px rgba(79, 70, 229, 0.2)' }}>
              <span style={{ position: 'absolute', top: '-12px', left: '30px', background: '#4f46e5', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>מומלץ</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 10px 0' }}>מסלול PRO</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#4f46e5', marginBottom: '20px' }}>₪99 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/ חודש</span></div>
              <ul style={{ margin: '0 0 30px 0', padding: '0 20px 0 0', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.8', flex: 1 }}>
                <li>הצעות מחיר ללא הגבלה (∞)</li>
                <li>שליחת הצעות ישירות בוואטסאפ</li>
                <li>הוספת לוגו עסקי מותאם אישית</li>
                <li>דוחות עסק ומעקב צפיות חכם</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>בחר מסלול PRO</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: '#94a3b8', padding: '40px 20px', textAlign: 'center', fontSize: '0.9rem' }}>
        <p style={{ margin: '0 0 10px 0' }}>&copy; {new Date().getFullYear()} ProFlow ישראל. כל הזכויות שמורות.</p>
        <button onClick={() => setShowAccessibility(true)} style={{ background: 'none', border: 'none', color: '#38bdf8', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>
          הצהרת נגישות
    import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProFlowLogo from '../components/ProFlowLogo';
import AccessibilityModal from '../components/AccessibilityModal';

export default function LandingLocal() {
  const navigate = useNavigate();
  const [showAccessibility, setShowAccessibility] = useState(false);

  return (
    <div dir="rtl" style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
      
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} isHebrew={true} />

      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/he')}>
          <ProFlowLogo size={36} />
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: '1px solid #cbd5e1', color: '#475569', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
            English (Global) 🌐
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}>
            כניסה למערכת / התחברות
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#e0e7ff', color: '#4f46e5', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '20px' }}>
          ✨ המערכת המובילה לעסקים בישראל
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#0f172a', lineHeight: '1.2', marginBottom: '20px' }}>
          ניהול עסק, הפקת הצעות מחיר וגבייה <br />
          <span style={{ color: '#4f46e5' }}>בקלות, במהירות ובחכמה</span>
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          פלטפורמת SaaS מתקדמת המותאמת במיוחד לשוק הישראלי (כולל ניהול מע"מ 18% כחוק, מטבע שקלי, חתימות דיגיטליות וניהול לקוחות).
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '60px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
            התחל בחינם עכשיו 🚀
          </button>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', textAlign: 'right', marginBottom: '60px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⚡</div>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '10px' }}>הפקת הצעות מחיר בדקה</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>צור הצעות מחיר מקצועיות ומהודרות הכוללות חישוב מע"מ אוטומטי, הנחות ומוצרים מהקטלוג שלך.</p>
          </div>
          
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>✍️</div>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '10px' }}>חתימה דיגיטלית ואישור לקוח</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>שלח לינק ללקוח שיוכל לצפות במסמך, לחתום דיגיטלית ולאשר את ההזמנה מכל סמארטפון או מחשב.</p>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📊</div>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '10px' }}>ניהול הכנסות והוצאות</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>עקוב אחר רווחי העסק, נהל הוצאות שוטפות וצפה בדוחות פיננסיים מדויקים בזמן אמת.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: '#94a3b8', padding: '30px 20px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: '0 0 10px 0' }}>&copy; {new Date().getFullYear()} ProFlow Israel. כל הזכויות שמורות.</p>
        <button onClick={() => setShowAccessibility(true)} style={{ background: 'none', border: 'none', color: '#38bdf8', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>
          ♿ הצהרת נגישות
        </button>
      </footer>

    </div>
  );
}    </button>
      </footer>
    </div>
  );
}