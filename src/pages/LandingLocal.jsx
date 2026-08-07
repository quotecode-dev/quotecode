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
    <div dir="rtl" style={{ fontFamily: 'Inter, Segoe UI, Tahoma, sans-serif', background: '#090d16', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
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
        .pain-box {
          box-shadow: 0 20px 40px -15px rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
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
        @media (max-width: 480px) {
          .nav-btn {
            padding: 8px 12px !important;
            font-size: 0.8rem !important;
          }
          .hero-title {
            font-size: 2.2rem !important;
          }
        }
      `}</style>

      {/* Top Banner Launch Special */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5, #10b981)', color: 'white', padding: '10px 20px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold' }}>
        🎉 מבצע! 14 יום חינם לגמרי - עם גישה מלאה לכל הפיצ'רים של מסלול ה-PRO!
      </div>

      {/* Header */}
      <header style={{ background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '10px' }}>
          <div style={{ cursor: 'pointer', background: 'rgba(255, 255, 255, 0.04)', padding: '4px 8px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', flexShrink: 0 }} onClick={() => navigate('/he')}>
            <ProFlowLogo size={32} rtl={true} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="nav-btn" onClick={() => navigate('/dashboard')} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)', whiteSpace: 'nowrap' }}>
              כניסה למערכת / התחברות
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-glow" style={{ flex: 1, padding: '60px 16px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))', color: '#34d399', padding: '8px 20px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: '800', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)' }}>
            🔥 מבצע השקה: 14 יום ניסיון חינם לכל פיצ'רי ה-PRO!
          </div>
          
          <h1 className="hero-title" style={{ fontSize: '3.2rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.2', marginBottom: '20px', letterSpacing: '-1px' }}>
            ניהול עסק, הפקת הצעות מחיר וגבייה <br />
            <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>בקלות, במהירות ובחכמה</span>
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 25px auto', lineHeight: '1.6' }}>
            פלטפורמת SaaS מתקדמת המותאמת במיוחד לשוק הישראלי (כולל ניהול מע"מ 18% כחוק, מטבע שקלי, חתימות דיגיטליות וניהול לקוחות).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px 30px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)' }}>
              התחל 14 יום ניסיון חינם ב-PRO עכשיו 🚀
            </button>
            <span style={{ color: '#34d399', fontSize: '0.95rem', fontWeight: '800' }}>
              14 יום חינם לגמרי לכל פיצ'רי ה-PRO!
            </span>
          </div>

          <div style={{ marginBottom: '50px', color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>⭐⭐⭐⭐⭐</span> מעל 500 עסקים כבר מפיקים הצעות מחיר בקלות
          </div>

          {/* Pain-Point Section with AI Image */}
          <div className="pain-box" style={{ background: '#111827', borderRadius: '16px', overflow: 'hidden', maxWidth: '850px', margin: '0 auto 40px auto', padding: '24px', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                🛑 מוכר לך היטב?
              </span>
              <h2 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', marginTop: '12px', marginBottom: '8px' }}>
                לא נמאס לך להסתבך עם הצעות מחיר וניירת אינסופית?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
                שכח משעות מול קבצי וורד מסורבלים, חישובי מע"מ ידניים ומרדפים מעייפים אחרי אישורים מלקוחות.
              </p>
            </div>
            
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img 
                src="/frustrated-user.png" 
                alt="בעל עסק מתוסכל מניירת והצעות מחיר" 
                style={{ width: '100%', display: 'block', maxHeight: '400px', objectFit: 'cover' }} 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'; }} 
              />
            </div>
            <div style={{ textAlign: 'center', color: '#34d399', fontWeight: 'bold', fontSize: '1rem' }}>
              ✨ יש דרך הרבה יותר קלה, חכמה ומקצועית לנהל את העסק שלך עם ProFlow!
            </div>
          </div>

          {/* Dashboard Preview Box */}
          <div className="preview-box" style={{ borderRadius: '16px', overflow: 'hidden', background: '#111827', maxWidth: '850px', margin: '0 auto 60px auto', padding: '24px', textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></div>
              </div>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>ProFlow SaaS Dashboard (IL)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#1f2937', padding: '16px', borderRadius: '10px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>הצעות מחיר החודש</div>
                <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>24</div>
              </div>
              <div style={{ background: '#1f2937', padding: '16px', borderRadius: '10px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>הכנסות (כולל מע"מ 18%)</div>
                <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>₪ 84,200</div>
              </div>
              <div style={{ background: '#1f2937', padding: '16px', borderRadius: '10px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>לקוחות פעילים</div>
                <div style={{ color: '#818cf8', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>142</div>
              </div>
            </div>
            <div style={{ background: '#1f2937', padding: '20px', borderRadius: '10px', textAlign: 'center', color: '#94a3b8', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
              תצוגה מקדימה חיה של מערכת ניהול הצעות המחיר והגבייה
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', textAlign: 'right', marginBottom: '60px' }}>
            <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '12px', background: 'rgba(251, 191, 36, 0.1)', display: 'inline-block', padding: '8px', borderRadius: '10px' }}>⚡</div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>הפקת הצעות מחיר בדקה</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>צור הצעות מחיר מקצועיות ומהודרות הכוללות חישוב מע"מ אוטומטי, הנחות ומוצרים מהקטלוג שלך.</p>
            </div>
            
            <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'inline-block', padding: '8px', borderRadius: '10px' }}>✍️</div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>חתימה דיגיטלית ואישור לקוח</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>שלח לינק ללקוח שיוכל לצפות במסמך, לחתום דיגיטלית ולאשר את ההזמנה מכל סמארטפון או מחשב.</p>
            </div>

            <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'inline-block', padding: '8px', borderRadius: '10px' }}>📊</div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>ניהול הכנסות והוצאות</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>עקוב אחר רווחי העסק, נהל הוצאות שוטפות וצפה בדוחות פיננסיים מדויקים בזמן אמת.</p>
            </div>
          </div>

          {/* Pricing Section - Israel */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>מסלולים ומחירים</h2>
            <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '1.05rem' }}>בחר את המסלול המתאים ביותר לעסק שלך. <strong style={{ color: '#10b981' }}>14 יום חינם לגמרי לכל פיצ'רי ה-PRO!</strong></p>
            
            <div style={{ display: 'inline-flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', background: '#111827', padding: '4px', borderRadius: '12px', marginBottom: '30px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button 
                onClick={() => setBillingCycle('annual')}
                style={{ background: billingCycle === 'annual' ? '#6366f1' : 'transparent', color: billingCycle === 'annual' ? '#ffffff' : '#94a3b8', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <span>מסלול שנתי</span>
                <span style={{ background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '6px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>חסוך 20%!</span>
              </button>
              <button 
                onClick={() => setBillingCycle('monthly')}
                style={{ background: billingCycle === 'monthly' ? '#6366f1' : 'transparent', color: billingCycle === 'monthly' ? '#ffffff' : '#94a3b8', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                מסלול חודשי
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', textAlign: 'right' }}>
              
              {/* Free */}
              <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>מסלול חינמי</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>מתאים לעסקים בתחילת הדרך.</p>
                <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', marginBottom: '16px' }}>0 ₪ <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#94a3b8' }}>/ חודש</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '2' }}>
                  <li>✓ עד 5 הצעות מחיר בחודש</li>
                  <li>✓ ניהול לקוחות בסיסי</li>
                  <li>✓ תמיכה במייל</li>
                </ul>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  התחל בחינם
                </button>
              </div>

              {/* Basic Plan */}
              <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>מסלול בסיסי (Basic)</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>לעסקים קטנים שצריכים פתרון מושלם.</p>
                <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#ffffff', marginBottom: '16px' }}>
                  {billingCycle === 'monthly' ? '49 ₪' : '39 ₪'} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#94a3b8' }}>/ חודש</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '-12px', marginBottom: '12px' }}>
                  {billingCycle === 'monthly' ? '* כולל מע"מ 18% (41.53 ₪ לפני מע"מ)' : '* חיוב שנתי, כולל מע"מ 18% (33.05 ₪ לפני מע"מ)'}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '2' }}>
                  <li>✓ <strong>14 יום ניסיון חינם!</strong></li>
                  <li>✓ עד 20 הצעות מחיר בחודש</li>
                  <li>✓ חתימה דיגיטלית וניהול לקוחות</li>
                  <li style={{ color: '#ef4444' }}>✗ ללא שליחה ישירה בווצאפ</li>
                </ul>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  התחל 14 יום חינם
                </button>
              </div>

              {/* Pro / Business Plan (Highlighted) */}
              <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '16px', border: '2px solid #6366f1', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#6366f1', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  הפופולרי ביותר ⭐
                </div>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>מסלול עסקי (Pro)</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>לסוכנויות ועסקים צומחים ללא מגבלות.</p>
                <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#818cf8', marginBottom: '16px' }}>
                  {billingCycle === 'monthly' ? '99 ₪' : '79 ₪'} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#94a3b8' }}>/ חודש</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '-12px', marginBottom: '12px' }}>
                  {billingCycle === 'monthly' ? '* כולל מע"מ 18% (83.90 ₪ לפני מע"מ)' : '* חיוב שנתי, כולל מע"מ 18% (66.95 ₪ לפני מע"מ)'}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '2' }}>
                  <li>✓ <strong>14 יום חינם לכל פיצ'רי ה-PRO!</strong></li>
                  <li>✓ הצעות מחיר ללא הגבלה כלל</li>
                  <li>✓ שליחה ישירה בווצאפ (WhatsApp)</li>
                  <li>✓ ניהול הכנסות והוצאות מלא</li>
                </ul>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#6366f1', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                  התחל 14 יום חינם ב-PRO
                </button>
              </div>

            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginBottom: '60px', textAlign: 'right', maxWidth: '800px', margin: '0 auto 60px auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', textAlign: 'center' }}>שאלות נפוצות</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '1rem', textAlign: 'center' }}>כל מה ששאלת על המערכת, במקום אחד.</p>
            
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item" style={{ padding: '16px', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '1rem', color: '#ffffff', gap: '10px' }}>
                  <span>{faq.q}</span>
                  <span style={{ color: '#818cf8', fontSize: '1.2rem', flexShrink: 0 }}>{openFaq === idx ? '−' : '+'}</span>
                </div>
                {openFaq === idx && (
                  <div style={{ marginTop: '10px', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#05070a', color: '#64748b', padding: '30px 16px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.9rem' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} ProFlow Israel. כל הזכויות שמורות.</p>
      </footer>

    </div>
  );
}