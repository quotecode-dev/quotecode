import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProFlowLogo from '../components/ProFlowLogo';

export default function LandingLocal() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'האם המחירים המוצגים כוללים מע"מ?',
      a: 'כן! כל המחירים במסלולים מותאמים לשוק הישראלי וכוללים מע"מ 18% כחוק (עם פירוט הסכום לפני מע"מ).'
    },
    {
      q: 'מה כוללת תקופת הניסיון של 14 יום?',
      a: 'תקופת הניסיון מעניקה לך גישה מלאה וחופשית לכל פיצ\'רי ה-PRO של המערכת (הצעות מחיר ללא הגבלה, שליחת וואטסאפ ועוד) למשך 14 יום ללא שום התחייבות.'
    },
    {
      q: 'מה קורה בתום 14 ימי הניסיון אם איני רוכש מנוי?',
      a: 'החשבון שלך יעבור אוטומטית למסלול החינמי (FREE) עם המגבלות שלו, כך שתוכל להמשיך להשתמש במערכת בראש שקט.'
    },
    {
      q: 'האם המערכת מותאמת לסמארטפון ולמחשב?',
      a: 'כן, ProFlow פותחה כפלטפורמת SaaS מודרנית רספונסיבית לחלוטין, המאפשרת לך להפיק הצעות ולנהל את העסק מכל מחשב, טאבלט או סמארטפון.'
    }
  ];

  return (
    <div dir="rtl" style={{ fontFamily: 'Inter, Segoe UI, Tahoma, sans-serif', background: '#090d16', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-6px);
          border-color: #6366f1;
          box-shadow: 0 20px 30px -10px rgba(99, 102, 241, 0.2);
        }
        .hero-glow {
          background: radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0) 60%);
        }
        .preview-box {
          box-shadow: 0 25px 60px -15px rgba(99, 102, 241, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .faq-item {
          background: #111827;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .faq-item:hover {
          border-color: rgba(99, 102, 241, 0.4);
        }
      `}</style>

      {/* Top Banner Launch Special */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5, #10b981)', color: 'white', padding: '10px 20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>
        🎉 מבצע! 14 יום חינם לגמרי - עם גישה מלאה לכל הפיצ'רים של מסלול ה-PRO!
      </div>

      {/* Header */}
      <header style={{ background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ cursor: 'pointer', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/he')}>
            <ProFlowLogo size={36} rtl={true} />
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
              🇬🇧 English
            </button>
            <button onClick={() => navigate('/dashboard')} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
              כניסה למערכת / התחברות
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-glow" style={{ flex: 1, padding: '80px 20px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Prominent Top Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))', color: '#34d399', padding: '10px 24px', borderRadius: '30px', fontSize: '1rem', fontWeight: '800', marginBottom: '24px', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)' }}>
            🔥 מבצע השקה: 14 יום ניסיון חינם לכל פיצ'רי ה-PRO!
          </div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.15', marginBottom: '24px', letterSpacing: '-1px' }}>
            ניהול עסק, הפקת הצעות מחיר וגבייה <br />
            <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>בקלות, במהירות ובחכמה</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 35px auto', lineHeight: '1.6' }}>
            פלטפורמת SaaS מתקדמת המותאמת במיוחד לשוק הישראלי (כולל ניהול מע"מ 18% כחוק, מטבע שקלי, חתימות דיגיטליות וניהול לקוחות).
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)' }}>
              התחל 14 יום ניסיון חינם ב-PRO עכשיו 🚀
            </button>
          </div>

          <div style={{ marginBottom: '60px', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ color: '#fbbf24', fontSize: '1.2rem' }}>⭐⭐⭐⭐⭐</span> מעל 500 עסקים כבר מפיקים הצעות מחיר בקלות
          </div>

          {/* Dashboard Preview Box */}
          <div className="preview-box" style={{ borderRadius: '16px', overflow: 'hidden', background: '#111827', maxWidth: '850px', margin: '0 auto 80px auto', padding: '30px', textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
              </div>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>ProFlow SaaS Dashboard (IL)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>הצעות מחיר החודש</div>
                <div style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 'bold', marginTop: '5px' }}>24</div>
              </div>
              <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>הכנסות (כולל מע"מ 18%)</div>
                <div style={{ color: '#10b981', fontSize: '1.8rem', fontWeight: 'bold', marginTop: '5px' }}>₪ 84,200</div>
              </div>
              <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>לקוחות פעילים</div>
                <div style={{ color: '#818cf8', fontSize: '1.8rem', fontWeight: 'bold', marginTop: '5px' }}>142</div>
              </div>
            </div>
            <div style={{ background: '#1f2937', padding: '25px', borderRadius: '10px', textAlign: 'center', color: '#94a3b8', border: '1px dashed rgba(255,255,255,0.1)' }}>
              תצוגה מקדימה חיה של מערכת ניהול הצעות המחיר והגבייה
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', textAlign: 'right', marginBottom: '80px' }}>
            <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px', background: 'rgba(251, 191, 36, 0.1)', display: 'inline-block', padding: '10px', borderRadius: '12px' }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>הפקת הצעות מחיר בדקה</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>צור הצעות מחיר מקצועיות ומהודרות הכוללות חישוב מע"מ אוטומטי, הנחות ומוצרים מהקטלוג שלך.</p>
            </div>
            
            <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px', background: 'rgba(99, 102, 241, 0.1)', display: 'inline-block', padding: '10px', borderRadius: '12px' }}>✍️</div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>חתימה דיגיטלית ואישור לקוח</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>שלח לינק ללקוח שיוכל לצפות במסמך, לחתום דיגיטלית ולאשר את ההזמנה מכל סמארטפון או מחשב.</p>
            </div>

            <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px', background: 'rgba(16, 185, 129, 0.1)', display: 'inline-block', padding: '10px', borderRadius: '12px' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>ניהול הכנסות והוצאות</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>עקוב אחר רווחי העסק, נהל הוצאות שוטפות וצפה בדוחות פיננסיים מדויקים בזמן אמת.</p>
            </div>
          </div>

          {/* Pricing Section - Israel */}
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>מסלולים ומחירים</h2>
            <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '1.1rem' }}>בחר את המסלול המתאים ביותר לעסק שלך. <strong style={{ color: '#10b981' }}>14 יום חינם לגמרי לכל פיצ'רי ה-PRO!</strong></p>
            
            <div style={{ display: 'inline-flex', background: '#111827', padding: '4px', borderRadius: '12px', marginBottom: '40px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button 
                onClick={() => setBillingCycle('monthly')}
                style={{ background: billingCycle === 'monthly' ? '#6366f1' : 'transparent', color: billingCycle === 'monthly' ? '#ffffff' : '#94a3b8', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
                תשלום חודשי
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                style={{ background: billingCycle === 'annual' ? '#6366f1' : 'transparent', color: billingCycle === 'annual' ? '#ffffff' : '#94a3b8', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
                תשלום שנתי <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', marginRight: '6px' }}>חסוך 20%!</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', textAlign: 'right' }}>
              
              {/* Free */}
              <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>מסלול חינמי</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>מתאים לעסקים בתחילת הדרך.</p>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#ffffff', marginBottom: '20px' }}>0 ₪ <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#94a3b8' }}>/ חודש</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '2.2' }}>
                  <li>✓ עד 5 הצעות מחיר בחודש</li>
                  <li>✓ ניהול לקוחות בסיסי</li>
                  <li>✓ תמיכה במייל</li>
                </ul>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  התחל בחינם
                </button>
              </div>

              {/* Basic Plan */}
              <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>מסלול בסיסי (Basic)</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>לעסקים קטנים שצריכים פתרון מושלם.</p>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#ffffff', marginBottom: '20px' }}>
                  {billingCycle === 'monthly' ? '49 ₪' : '39 ₪'} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#94a3b8' }}>/ חודש</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-15px', marginBottom: '15px' }}>
                  {billingCycle === 'monthly' ? '* כולל מע"מ 18% (41.53 ₪ לפני מע"מ)' : '* חיוב שנתי, כולל מע"מ 18% (33.05 ₪ לפני מע"מ)'}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '2.2' }}>
                  <li>✓ <strong>14 יום ניסיון חינם!</strong></li>
                  <li>✓ עד 20 הצעות מחיר בחודש</li>
                  <li>✓ חתימה דיגיטלית וניהול לקוחות</li>
                  <li style={{ color: '#ef4444' }}>✗ ללא שליחה ישירה בווצאפ</li>
                </ul>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  התחל 14 יום חינם
                </button>
              </div>

              {/* Pro / Business Plan (Highlighted) */}
              <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '2px solid #6366f1', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-14px', right: '20px', background: '#6366f1', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  הפופולרי ביותר ⭐
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>מסלול עסקי (Pro)</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>לסוכנויות ועסקים צומחים ללא מגבלות.</p>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#818cf8', marginBottom: '20px' }}>
                  {billingCycle === 'monthly' ? '99 ₪' : '79 ₪'} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#94a3b8' }}>/ חודש</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-15px', marginBottom: '15px' }}>
                  {billingCycle === 'monthly' ? '* כולל מע"מ 18% (83.90 ₪ לפני מע"מ)' : '* חיוב שנתי, כולל מע"מ 18% (66.95 ₪ לפני מע"מ)'}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '2.2' }}>
                  <li>✓ <strong>14 יום חינם לכל פיצ'רי ה-PRO!</strong></li>
                  <li>✓ הצעות מחיר ללא הגבלה כלל</li>
                  <li>✓ שליחה ישירה בווצאפ (WhatsApp)</li>
                  <li>✓ ניהול הכנסות והוצאות מלא</li>
                </ul>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#6366f1', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                  התחל 14 יום חינם ב-PRO
                </button>
              </div>

            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginBottom: '80px', textAlign: 'right', maxWidth: '800px', margin: '0 auto 80px auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>שאלות נפוצות</h2>
            <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '1.05rem', textAlign: 'center' }}>כל מה ששאלת על המערכת, במקום אחד.</p>
            
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '1.05rem', color: '#ffffff' }}>
                  <span>{faq.q}</span>
                  <span style={{ color: '#818cf8', fontSize: '1.2rem' }}>{openFaq === idx ? '−' : '+'}</span>
                </div>
                {openFaq === idx && (
                  <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#05070a', color: '#64748b', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} ProFlow Israel. כל הזכויות שמורות.</p>
      </footer>

    </div>
  );
}