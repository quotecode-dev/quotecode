import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProFlowLogo from '../components/ProFlowLogo';

export default function LandingLocal() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
      
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
      <main style={{ flex: 1, padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
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

        {/* Pricing Section - Israel */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>מסלולים ומחירים</h2>
          <p style={{ color: '#64748b', marginBottom: '40px' }}>בחר את המסלול המתאים ביותר לעסק שלך (המחירים כוללים מע"מ 18% כחוק).</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', textAlign: 'right' }}>
            
            {/* Free Tier */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '10px' }}>מסלול חינמי</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>מתאים לעסקים בתחילת הדרך.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '20px' }}>0 ₪ <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#64748b' }}>/ חודש</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#475569', fontSize: '0.95rem', lineHeight: '2' }}>
                <li>✓ עד 5 הצעות מחיר בחודש</li>
                <li>✓ ניהול לקוחות בסיסי</li>
                <li>✓ תמיכה במייל</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                התחל בחינם
              </button>
            </div>

            {/* Pro Tier (Highlighted) */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '2px solid #4f46e5', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.1)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', right: '20px', background: '#4f46e5', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                הפופולרי ביותר ⭐
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '10px' }}>מסלול עסקי (Pro)</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>לסוכנויות ועסקים צומחים.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#4f46e5', marginBottom: '20px' }}>149 ₪ <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#64748b' }}>/ חודש</span></div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '-15px', marginBottom: '15px' }}>* כולל מע"מ 18% (126.27 ₪ לפני מע"מ)</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#475569', fontSize: '0.95rem', lineHeight: '2' }}>
                <li>✓ הצעות מחיר ללא הגבלה</li>
                <li>✓ חתימה דיגיטלית מתקדמת</li>
                <li>✓ ניהול הכנסות והוצאות מלא</li>
                <li>✓ תמיכה בוואטסאפ ובמהירות</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79,70,229,0.2)' }}>
                בחר מסלול עסקי
              </button>
            </div>

            {/* Enterprise Tier */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '10px' }}>מסלול פרימיום (Enterprise)</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>פתרונות מתקדמים לחברות גדולות.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '20px' }}>299 ₪ <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#64748b' }}>/ חודש</span></div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '-15px', marginBottom: '15px' }}>* כולל מע"מ 18% (253.39 ₪ לפני מע"מ)</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#475569', fontSize: '0.95rem', lineHeight: '2' }}>
                <li>✓ הכל כלול במסלול Pro</li>
                <li>✓ משתמשים מרובים בצוות</li>
                <li>✓ דוחות פיננסיים מתקדמים</li>
                <li>✓ ליווי אישי ומנהל תיק</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                צור קשר
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: '#94a3b8', padding: '30px 20px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} ProFlow Israel. כל הזכויות שמורות.</p>
      </footer>

    </div>
  );
}