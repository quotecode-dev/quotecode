import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { supabase } from './supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

// ==========================================
// TODO / FUTURE ARCHITECTURE NOTE (מנויים ושינוי מסלולים):
// לקראת חיבור מערכת הסליקה (Stripe/Tranzilla), יש להוסיף כאן מנגנון לשינוי מסלולים 
// אמצע תקופה (Upgrade/Downgrade עם חישוב יחסי - Proration).
// ==========================================

const formatNum = (val) => Math.round(Number(val || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function ProFlowLogo({ size = 45 }) {
  return (
    <div dir="ltr" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexDirection: 'row' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="proflowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path d="M15 50 L45 20 L60 35 L40 55 L60 75 L45 90 Z" fill="url(#proflowGrad)" />
        <path d="M40 50 L78 20 L85 35 L65 55 L85 75 L70 90 Z" fill="#1e293b" opacity="0.9" />
      </svg>
      <span style={{ fontSize: `${size * 0.4}px`, fontWeight: '900', color: '#1e293b', letterSpacing: '-0.03em' }}>
        Pro<span style={{ color: '#4f46e5' }}>Flow</span>
      </span>
    </div>
  );
}

const DEFAULT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyODUgMTAwIiB3aWR0aD0iMjg1IiBoZWlnaHQ9IjEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50 idPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGY0NmU1Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTE1IDUwIEw0NSAyMCBMNjAgMzUgTDQwIDU1IEw2MCA3NSBMNDUgOTAgWiIgZmlsbD0idXJsKCNnKSIvPjxwYXRo dD0iTS00MCA1MCBMNzggMjAgTDg1IDM1IEw2NSA1NSBMODUgNzUgTDcwIDkwIFoiIGZpbGw9IiMxZTI5M2IiIG9wYWNpdHk9IjAuOSIvPjx0ZXh0IHg9IjEwNSIgeT0iNjYiIGZvbnQtZmFtaWx5PSJTZWdvZSBVSSwgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ0IiBmb250LXdlaWdodD05OTAiIGZpbGw9IiMxZTI5M2IiPlBybzx0c3BhbiBmaWxsPSIjNGY0NmU1Ij5GbG93PC90c3Bhbj48L3RleHQ+PC9zdmc+";

function AccessibilityModal({ isOpen, onClose, isHebrew }) {
  if (!isOpen) return null;

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', textAlign: isHebrew ? 'right' : 'left' }}>
        <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.4rem', marginBottom: '15px' }}>
          {isHebrew ? '♿ הצהרת נגישות' : '♿ Accessibility Statement'}
        </h3>
        
        {isHebrew ? (
          <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <p>אנו ב-<strong>ProFlow</strong> רואים חשיבות עליונה בהנגשת המערכת והשירותים שלנו לכלל הציבור, כולל אנשים עם מוגבלויות, מתוך אמונה כי לכל אדם מגיעה הזכות לשוויון, כבוד, נוחות ועצמאות.</p>
            <p>המערכת שלנו נמצאת כעת בשלבי הרצה (Beta), ואנו פועלים באופן שוטף לשפר את הנגישות שלה בהתאם להנחיות תקן הנגישות (WCAG 2.1).</p>
            <p>אם במהלך הגלישה באתר או במערכת נתקלתם בבעיה, תקלה, או שיש לכם הצעה לשיפור בנושא נגישות, אנו נשמח לשמוע מכם ולטפל בנושא בהקדם האפשרי.</p>
          </div>
        ) : (
          <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <p>At <strong>ProFlow</strong>, we are committed to making our platform and services accessible to everyone, including people with disabilities, believing that everyone deserves the right to equality, dignity, comfort, and independence.</p>
            <p>Our system is currently in its Beta launch phase, and we are actively working to improve its accessibility in accordance with the WCAG 2.1 guidelines.</p>
            <p>If you encounter any accessibility barriers or have suggestions for improvement, we would love to hear from you and address the issue as soon as possible.</p>
          </div>
        )}

        <button onClick={onClose} style={{ marginTop: '25px', width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
          {isHebrew ? 'סגור' : 'Close'}
        </button>
      </div>
    </div>
  );
}

function PricingModal({ isOpen, onClose, isHebrew }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  if (!isOpen) return null;

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '720px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: isHebrew ? 'right' : 'left', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', [isHebrew ? 'left' : 'right']: '15px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}>✕</button>

        <h2 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.5rem', textAlign: 'center', marginBottom: '5px' }}>
          {isHebrew ? '🚀 שדרג את העסק שלך עם ProFlow' : '🚀 Upgrade Your Business with ProFlow'}
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>
          {isHebrew ? 'בחר את המסלול המתאים ביותר לצרכים שלך והתחל לעבוד ללא הגבלות' : 'Choose the best plan for your needs and work without limits'}
        </p>

        {/* מתג בחירה בין חודשי לשנתי */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
          <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '30px', display: 'flex', gap: '4px', border: '1px solid #cbd5e1' }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                background: billingCycle === 'monthly' ? '#4f46e5' : 'transparent',
                color: billingCycle === 'monthly' ? 'white' : '#475569',
                border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {isHebrew ? 'חיוב חודשי' : 'Monthly Billing'}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                background: billingCycle === 'yearly' ? '#4f46e5' : 'transparent',
                color: billingCycle === 'yearly' ? 'white' : '#475569',
                border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              {isHebrew ? 'חיוב שנתי (חודשיים מתנה! 20% הנחה)' : 'Yearly Billing (2 Months Free!)'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' }}>
          
          {/* מנוי Basic */}
          <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.2rem' }}>{isHebrew ? 'מנוי בסיסי (Basic)' : 'Basic Plan'}</h3>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#4f46e5', marginBottom: '5px' }}>
              {billingCycle === 'monthly' ? '₪49' : '₪39'} 
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>{isHebrew ? '/ חודש' : '/ month'}</span>
            </div>
            {billingCycle === 'yearly' && (
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', marginBottom: '15px' }}>
                {isHebrew ? 'חיוב שנתי של ₪468 (חסוך ₪120 בשנה)' : 'Billed annually at ₪468'}
              </div>
            )}
            {billingCycle === 'monthly' && <div style={{ height: '20px', marginBottom: '15px' }}></div>}
            
            <ul style={{ margin: '0 0 20px 0', padding: isHebrew ? '0 20px 0 0' : '0 0 0 20px', color: '#475569', fontSize: '0.85rem', lineHeight: '1.6', flex: 1 }}>
              <li>{isHebrew ? 'עד 20 הצעות מחיר בחודש' : 'Up to 20 quotes/month'}</li>
              <li>{isHebrew ? 'עריכה ושכפול הצעות מחיר' : 'Edit & duplicate quotes'}</li>
              <li>{isHebrew ? 'קטלוג מוצרים אישי' : 'Personal product catalog'}</li>
              <li>{isHebrew ? 'הפקת קובצי PDF רשמיים' : 'Official PDF exports'}</li>
            </ul>
            <button onClick={() => { alert(isHebrew ? `לשדרוג מיידי למסלול Basic (${billingCycle === 'yearly' ? 'שנתי' : 'חודשי'}), פנה לתמיכה.` : 'Please contact support to upgrade.'); onClose(); }} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
              {isHebrew ? 'בחר מסלול Basic' : 'Select Basic'}
            </button>
          </div>

          {/* מנוי PRO */}
          <div style={{ border: '2px solid #4f46e5', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', background: 'white', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.1)' }}>
            <div style={{ background: '#4f46e5', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', alignSelf: 'flex-start', marginBottom: '8px' }}>POPULAR</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.2rem' }}>{isHebrew ? 'מנוי PRO (מומלץ)' : 'PRO Plan (Recommended)'}</h3>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#4f46e5', marginBottom: '5px' }}>
              {billingCycle === 'monthly' ? '₪99' : '₪79'} 
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>{isHebrew ? '/ חודש' : '/ month'}</span>
            </div>
            {billingCycle === 'yearly' && (
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', marginBottom: '15px' }}>
                {isHebrew ? 'חיוב שנתי של ₪948 (חסוך ₪240 בשנה)' : 'Billed annually at ₪948'}
              </div>
            )}
            {billingCycle === 'monthly' && <div style={{ height: '20px', marginBottom: '15px' }}></div>}

            <ul style={{ margin: '0 0 20px 0', padding: isHebrew ? '0 20px 0 0' : '0 0 0 20px', color: '#475569', fontSize: '0.85rem', lineHeight: '1.6', flex: 1 }}>
              <li>{isHebrew ? 'הצעות מחיר ללא הגבלה (∞)' : 'Unlimited quotes (∞)'}</li>
              <li>{isHebrew ? 'שליחת הצעות מחיר ישירות בווצאפ' : 'Send quotes directly via WhatsApp'}</li>
              <li>{isHebrew ? 'הוספת לוגו עסקי מותאם אישית' : 'Custom business logo upload'}</li>
              <li>{isHebrew ? 'מחיקה וניהול מתקדם של הצעות' : 'Advanced quote management & deletion'}</li>
              <li>{isHebrew ? 'מעקב צפיות חכם (הצעות חמות)' : 'Smart view tracking (Hot quotes)'}</li>
            </ul>
            <button onClick={() => { alert(isHebrew ? `לשדרוג מיידי למסלול PRO (${billingCycle === 'yearly' ? 'שנתי' : 'חודשי'}), פנה לתמיכה.` : 'Please contact support to upgrade.'); onClose(); }} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
              {isHebrew ? 'בחר מסלול PRO' : 'Select PRO'}
            </button>
          </div>

        </div>

        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
          {isHebrew ? 'יש לך שאלות? צור איתנו קשר דרך עוזר ה-AI או במייל.' : 'Have questions? Contact us via AI assistant or email.'}
        </div>

      </div>
    </div>
  );
}

function EmailConfirmModal({ isOpen, onClose, onConfirm, clientEmail, isHebrew }) {
  if (!isOpen) return null;

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', textAlign: 'center', animation: 'popupBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
        
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '1.4rem' }}>
          ✉️
        </div>

        <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.25rem', marginBottom: '10px', fontWeight: '700' }}>
          {isHebrew ? 'שליחת הצעת מחיר במייל' : 'Send Quote via Email'}
        </h3>
        
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>
          {isHebrew ? 'האם לשלוח את הצעת המחיר לכתובת:' : 'Do you want to send the quote to:'}
          <br />
          <strong style={{ color: '#1e293b', direction: 'ltr', display: 'inline-block', marginTop: '5px' }}>{clientEmail}</strong>
        </p>

        <div style={{ display: 'flex', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
          <button onClick={onClose} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}>
            {isHebrew ? 'ביטול' : 'Cancel'}
          </button>
          <button onClick={onConfirm} style={{ flex: 1, background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)' }}>
            {isHebrew ? 'כן, שלח מייל' : 'Yes, Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AIChatWidget({ isHebrew }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: isHebrew ? 'שלום! אני עוזר ה-AI של ProFlow. איך אעזור לך היום?' : 'Hello! I am ProFlow AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      setTimeout(() => {
        let reply = isHebrew 
          ? "הבנתי אותך. כדי לשלוח הצעת מחיר בווצאפ, לחץ על אייקון הוואטסאפ (💬) בשורת הפעולות בטבלה."
          : "I understand. To send a quote via WhatsApp, click the WhatsApp icon (💬) in the quote actions row.";
        
        if (userText.toLowerCase().includes('price') || userText.includes('מחיר') || userText.includes('הצעה')) {
          reply = isHebrew ? "ניתן ליצור הצעת מחיר חדשה דרך כפתור 'צור הצעת מחיר חדשה' במסך הראשי." : "You can create a new quote using the 'Create New Quote' button on the main dashboard.";
        }
        setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
        setLoading(false);
      }, 600);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: isHebrew ? 'אירעה שגיאה. נסה שוב.' : 'An error occurred. Please try again.' }]);
      setLoading(false);
    }
  };

  const modernBotSVG = (
    <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="botBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#e2e8f0"/>
        </linearGradient>
        <linearGradient id="botScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b"/>
          <stop offset="100%" stopColor="#0f172a"/>
        </linearGradient>
      </defs>
      <rect x="10" y="45" width="80" height="20" rx="10" fill="#6366f1" />
      <rect x="47" y="10" width="6" height="25" fill="#cbd5e1" />
      <circle cx="50" cy="10" r="8" fill="#38bdf8" />
      <rect x="20" y="25" width="60" height="55" rx="22" fill="url(#botBase)" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="28" y="38" width="44" height="28" rx="10" fill="url(#botScreen)" />
      <circle cx="40" cy="52" r="4" fill="#38bdf8" />
      <circle cx="60" cy="52" r="4" fill="#38bdf8" />
      <path d="M46 60 Q 50 64 54 60" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        {modernBotSVG}
        {isHebrew ? 'שירות לקוחות AI' : 'AI Support'}
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', top: '75px', right: '25px', width: '320px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', zIndex: 99999, overflow: 'hidden' }} dir={isHebrew ? 'rtl' : 'ltr'}>
          <div style={{ background: '#4f46e5', color: 'white', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {modernBotSVG}
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{isHebrew ? 'שירות לקוחות ProFlow (AI)' : 'ProFlow Support (AI)'}</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>✕</button>
          </div>
          <div style={{ height: '220px', overflowY: 'auto', padding: '10px', fontSize: '0.85rem', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: isHebrew ? 'right' : 'left' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ textAlign: m.sender === 'user' ? (isHebrew ? 'left' : 'right') : (isHebrew ? 'right' : 'left') }}>
                <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '8px', background: m.sender === 'user' ? '#4f46e5' : 'white', color: m.sender === 'user' ? 'white' : '#1e293b', border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0', maxWidth: '85%', wordBreak: 'break-word' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>{isHebrew ? 'ה-AI חושב...' : 'AI is thinking...'}</div>}
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', padding: '8px', background: 'white', borderTop: '1px solid #e2e8f0', gap: '5px' }}>
            <input
              type="text"
              placeholder={isHebrew ? "שאל משהו..." : "Ask something..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', textAlign: isHebrew ? 'right' : 'left', background: '#eff6ff' }}
            />
            <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}>{isHebrew ? 'שלח' : 'Send'}</button>
          </form>
        </div>
      )}
    </div>
  );
}

function SignaturePadModal({ isOpen, onClose, onSave, isHebrew }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.nativeEvent && e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX || (e.nativeEvent && e.nativeEvent.clientX);
      clientY = e.clientY || (e.nativeEvent && e.nativeEvent.clientY);
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '25px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.3rem', marginBottom: '10px' }}>
          {isHebrew ? '✍️ חתימה דיגיטלית ואישור הזמנה' : '✍️ Digital Signature & Approval'}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '15px', marginTop: 0 }}>
          {isHebrew ? 'אנא חתום בתוך המסגרת כדי לאשר את הצעת המחיר.' : 'Please sign within the box below to approve this quote.'}
        </p>

        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.8rem', fontWeight: 'bold', lineHeight: '1.4' }}>
          {isHebrew ? '⚠️ בלחיצה על "אשר וחתום" הינך מאשר את הפרטים בהצעה.' : 'By clicking approve and sign, you confirm the details in the quote.'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <canvas
            ref={canvasRef}
            width={320}
            height={180}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', background: '#f8fafc', cursor: 'crosshair', touchAction: 'none', maxWidth: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px' }}>
          <button onClick={clearCanvas} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
            {isHebrew ? '🧹 נקה חתימה' : '🧹 Clear'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
          <button onClick={onClose} style={{ flex: 1, background: 'white', color: '#64748b', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
            {isHebrew ? 'ביטול' : 'Cancel'}
          </button>
          <button onClick={handleSave} style={{ flex: 2, background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
            {isHebrew ? '✔️ אשר וחתום' : '✔️ Approve & Sign'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PublicQuote() {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvedSuccess, setApprovedSuccess] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: quoteData } = await supabase
        .from('quotes')
        .select(`*, clients ( company_name, email, phone, client_type, tax_id, address, terms ), quote_items ( * )`)
        .eq('id', id)
        .single();
      
      let settingsData = null;
      if (quoteData && quoteData.user_id) {
        const { data } = await supabase
          .from('business_settings')
          .select('*')
          .eq('user_id', quoteData.user_id)
          .maybeSingle();
        settingsData = data;
      } else if (quoteData) {
        const { data } = await supabase
          .from('business_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        settingsData = data;
      }

      if (quoteData) {
        const currentViews = (quoteData.view_count || 0) + 1;
        const { error: rpcErr } = await supabase.rpc('increment_quote_views', { quote_id: id });
        if (rpcErr) {
          await supabase.from('quotes').update({ view_count: currentViews }).eq('id', id);
        }
        quoteData.view_count = currentViews;
      }

      setQuote(quoteData);
      setSettings(settingsData || { business_name: 'ProFlow', plan: 'free' });
      if (quoteData && (quoteData.status === 'approved' || quoteData.status === 'paid')) {
        setApprovedSuccess(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const isLocalIsraeliBusiness = settings?.country === 'Israel (Local)' || settings?.country === 'Local';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const navLang = navigator.language || '';
  const browserHebrew = navLang.startsWith('he') || tz === 'Asia/Jerusalem';
  const isHebrew = settings ? isLocalIsraeliBusiness : (browserHebrew || isLocalIsraeliBusiness);

  const handleClientApproveClick = () => {
    setShowSignatureModal(true);
  };

  const processApprovalWithSignature = async (signatureDataUrl) => {
    const { error: updateError } = await supabase
      .from('quotes')
      .update({ status: 'approved', signature: signatureDataUrl })
      .eq('id', id);

    if (!updateError) {
      setQuote(prev => ({ ...prev, status: 'approved', signature: signatureDataUrl }));
      setApprovedSuccess(true);
      setShowSignatureModal(false);
    } else {
      const { error: rpcError } = await supabase.rpc('approve_quote_public', { quote_id: id });
      if (!rpcError) {
        setQuote(prev => ({ ...prev, status: 'approved' }));
        setApprovedSuccess(true);
        setShowSignatureModal(false);
      } else {
        alert(isHebrew ? `שגיאה באישור ההצעה: ${updateError.message}` : `Error: ${updateError.message}`);
      }
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById('quote-document-container');
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Quote_${quote.id.slice(0, 8).toUpperCase()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(isHebrew ? 'אירעה שגיאה ביצירת קובץ ה-PDF.' : 'An error occurred while generating the PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>{isHebrew ? 'טוען את הצעת המחיר...' : 'Loading quote...'}</div>;
  if (!quote) return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>{isHebrew ? 'הצעת המחיר לא נמצאה.' : 'Quote not found.'}</div>;

  const isPrivate = quote.client_type === 'private';
  const bizTaxId = settings?.tax_id || '';
  const bizEmail = settings?.email || '';
  const bizPhone = settings?.phone || '';
  const isProPlan = settings?.plan === 'pro';
  const bizLogo = (isProPlan && settings?.logo_url && settings.logo_url.trim() !== '') ? settings.logo_url : DEFAULT_LOGO;

  const getCurrencySymbol = (curr) => {
    if (isLocalIsraeliBusiness) return '₪';
    if (!curr) return '$';
    if (curr === 'EUR') return '€';
    if (curr === 'GBP') return '£';
    if (curr === 'ILS') return '₪';
    return '$';
  };
  const quoteSym = getCurrencySymbol(quote.currency);

  const quoteSub = quote.subtotal || quote.quote_items?.reduce((sum, item) => sum + Number(item.total_price || 0), 0) || 0;
  const quoteDiscount = quote.discount || 0;
  const quoteDiscountAmount = (quoteSub * quoteDiscount) / 100;
  const baseAmount = quoteSub - quoteDiscountAmount;
  
  const quoteTaxRate = (quote.tax_rate !== undefined && quote.tax_rate !== null) ? Number(quote.tax_rate) : (isHebrew ? 0.18 : 0.00);
  const hasVat = quoteTaxRate > 0;
  
  let quoteTaxAmount = 0;
  let quoteTotal = 0;

  if (hasVat && isPrivate) {
      quoteTotal = baseAmount;
      quoteTaxAmount = quoteTotal - (quoteTotal / (1 + quoteTaxRate));
  } else {
      quoteTaxAmount = baseAmount * quoteTaxRate;
      quoteTotal = baseAmount + quoteTaxAmount;
  }

  const quoteTerms = quote.terms || quote.clients?.terms || '';

  return (
    <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '20px 10px', color: '#333', display: 'flex', flexDirection: 'column' }}>
      
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} isHebrew={isHebrew} />
      <SignaturePadModal isOpen={showSignatureModal} onClose={() => setShowSignatureModal(false)} onSave={processApprovalWithSignature} isHebrew={isHebrew} />

      <div style={{ flex: '1 0 auto' }}>
        <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{isHebrew ? 'מסמך רשמי מאושר' : 'Official Document'}</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: isGeneratingPDF ? 'wait' : 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', opacity: isGeneratingPDF ? 0.7 : 1 }}>
              <span>🖨️</span> {isGeneratingPDF ? (isHebrew ? 'מייצר PDF...' : 'Generating...') : (isHebrew ? 'הורד כ-PDF' : 'Download PDF')}
            </button>
          </div>
        </div>

        <div id="quote-document-container" style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '40px 30px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          
          {approvedSuccess && (
            <div data-html2canvas-ignore="true" style={{ background: '#dcfce7', border: '1px solid #22c55e', color: '#166534', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center', fontWeight: 'bold' }}>
              {isHebrew ? '✅ הצעת המחיר אושרה ונחתמה בהצלחה על ידך! תודה רבה.' : '✅ Quote successfully approved & signed! Thank you for your business.'}
            </div>
          )}

          {/* ראש המסמך מותאם לסטנדרט ישראלי: לוגו ופרטי עסק בימין, כותרת ותאריכים בשמאל */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px', flexDirection: 'row', flexWrap: 'wrap', gap: '15px' }}>
            
            {/* צד ימין: לוגו ופרטי העסק */}
            <div style={{ textAlign: 'right' }}>
              <img src={bizLogo} alt="Business Logo" style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain', marginBottom: '8px', display: 'block', marginLeft: 'auto', marginRight: '0' }} crossOrigin="anonymous" />
              <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                {bizPhone && <span dir="ltr">{bizPhone}</span>}
                {bizEmail && <span> | <span dir="ltr">{bizEmail}</span></span>}
                {bizTaxId && <span> | {isHebrew ? 'עוסק/ח.פ:' : 'Tax ID:'} <span dir="ltr">{bizTaxId}</span></span>}
              </p>
            </div>

            {/* צד שמאל: כותרת הצעת מחיר ותאריכים */}
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ margin: 0, color: '#111827', fontSize: '22px', textTransform: 'uppercase' }}>{isHebrew ? 'הצעת מחיר' : 'QUOTE'}</h2>
              <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }} dir="ltr">#{quote.id.slice(0, 8).toUpperCase()}</p>
              <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '14px' }}>{isHebrew ? 'תאריך:' : 'Date:'} <span dir="ltr">{new Date(quote.created_at).toLocaleDateString('en-US')}</span></p>
              <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '14px' }}>{isHebrew ? 'בתוקף עד:' : 'Valid Until:'} <span dir="ltr">{quote.valid_until || 'N/A'}</span></p>
            </div>
          </div>

          <div style={{ marginBottom: '40px', textAlign: isHebrew ? 'right' : 'left' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>{isHebrew ? 'הוכן עבור:' : 'Prepared For:'}</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{quote.clients?.company_name || 'N/A'}</p>
            {quote.clients?.tax_id && (
               <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '14px' }}>{isHebrew ? 'ח.פ / ת.ז:' : 'Tax ID:'} <span dir="ltr">{quote.clients.tax_id}</span></p>
            )}
            <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '15px' }}>
               <span dir="ltr">{quote.clients?.email || ''}</span>
            </p>
            {quote.clients?.phone && (
               <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '15px' }}>
                 <span dir="ltr">{quote.clients.phone}</span>
               </p>
            )}
            {quote.clients?.address && (
               <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '15px' }}>{quote.clients.address}</p>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', textAlign: isHebrew ? 'right' : 'left', minWidth: '450px' }}>
              <thead>
                <tr>
                  <th style={{ background: '#f9fafb', padding: '14px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #111827' }}>{isHebrew ? 'תיאור' : 'Description'}</th>
                  <th style={{ background: '#f9fafb', padding: '14px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #111827', textAlign: 'center' }}>{isHebrew ? 'כמות' : 'Qty'}</th>
                  <th style={{ background: '#f9fafb', padding: '14px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #111827', textAlign: isHebrew ? 'left' : 'right' }}>{isHebrew ? 'מחיר יחידה' : 'Unit Price'}</th>
                  <th style={{ background: '#f9fafb', padding: '14px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #111827', textAlign: isHebrew ? 'left' : 'right' }}>{isHebrew ? 'סה"כ' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {quote.quote_items && quote.quote_items.length > 0 ? (
                  quote.quote_items.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{item.description}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', textAlign: 'center', color: '#4b5563' }}>{item.quantity}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', textAlign: isHebrew ? 'left' : 'right', color: '#4b5563' }}><span dir="ltr">{quoteSym}{formatNum(item.unit_price)}</span></td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', textAlign: isHebrew ? 'left' : 'right', fontWeight: 'bold', color: '#111827' }}><span dir="ltr">{quoteSym}{formatNum(item.total_price)}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ padding: '14px', borderBottom: '1px solid #e5e7eb' }}>{isHebrew ? 'שירותים מקצועיים' : 'Professional Services'}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: isHebrew ? 'left' : 'right', color: '#4b5563', fontSize: '15px' }}>
            {hasVat && isPrivate ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: isHebrew ? '0' : 'auto', marginRight: isHebrew ? 'auto' : '0', marginBottom: '6px' }}>
                  <span>{isHebrew ? 'סה"כ ללא מע"מ:' : 'Subtotal (Inc. VAT):'}</span>
                  <span dir="ltr">{quoteSym}{formatNum(quoteSub)}</span>
                </div>
                {quoteDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: isHebrew ? '0' : 'auto', marginRight: isHebrew ? 'auto' : '0', marginBottom: '6px', color: '#ef4444', fontWeight: '600' }}>
                    <span>{isHebrew ? `הנחה (${quoteDiscount}%):` : `Discount (${quoteDiscount}%):`}</span>
                    <span dir="ltr">-{quoteSym}{formatNum(quoteDiscountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: isHebrew ? '0' : 'auto', marginRight: isHebrew ? 'auto' : '0', marginBottom: '6px' }}>
                  <span>{isHebrew ? 'מע"מ (18%):' : 'VAT (18%):'}</span>
                  <span dir="ltr">{quoteSym}{formatNum(quoteTaxAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: isHebrew ? '0' : 'auto', marginRight: isHebrew ? 'auto' : '0', fontSize: '22px', fontWeight: '900', color: '#4f46e5', marginTop: '12px', borderTop: '2px solid #e5e7eb', paddingTop: '8px' }}>
                  <span>{isHebrew ? 'סה"כ לתשלום:' : 'Total Amount:'}</span>
                  <span dir="ltr">{quoteSym}{formatNum(quoteTotal)}</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: isHebrew ? '0' : 'auto', marginRight: isHebrew ? 'auto' : '0', marginBottom: '6px' }}>
                  <span>{isHebrew ? 'סה"כ ללא מע"מ:' : 'Subtotal:'}</span>
                  <span dir="ltr">{quoteSym}{formatNum(baseAmount)}</span>
                </div>
                {quoteDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: isHebrew ? '0' : 'auto', marginRight: isHebrew ? 'auto' : '0', marginBottom: '6px', color: '#ef4444', fontWeight: '600' }}>
                    <span>{isHebrew ? `הנחה (${quoteDiscount}%):` : `Discount (${quoteDiscount}%):`}</span>
                    <span dir="ltr">-{quoteSym}{formatNum(quoteDiscountAmount)}</span>
                  </div>
                )}
                {hasVat && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: isHebrew ? '0' : 'auto', marginRight: isHebrew ? 'auto' : '0', marginBottom: '6px' }}>
                    <span>{isHebrew ? 'מע"מ (18%):' : 'VAT (18%):'}</span>
                    <span dir="ltr">{quoteSym}{formatNum(quoteTaxAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', marginLeft: isHebrew ? '0' : 'auto', marginRight: isHebrew ? 'auto' : '0', fontSize: '22px', fontWeight: '900', color: '#4f46e5', marginTop: '12px', borderTop: '2px solid #e5e7eb', paddingTop: '8px' }}>
                  <span>{isHebrew ? 'סה"כ לתשלום:' : 'Total Amount:'}</span>
                  <span dir="ltr">{quoteSym}{formatNum(quoteTotal)}</span>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: '50px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '20px' }}>
            
            <div style={{ flex: 1, minWidth: '250px' }}>
              {quoteTerms && (
                <div style={{ textAlign: isHebrew ? 'right' : 'left', marginBottom: '20px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>{isHebrew ? 'תנאים והגבלות' : 'Terms & Conditions'}</p>
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '13px', whiteSpace: 'pre-wrap' }}>{quoteTerms}</p>
                </div>
              )}

              {quote.signature && (
                <div style={{ textAlign: isHebrew ? 'right' : 'left', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>{isHebrew ? 'חתימת לקוח מאושרת:' : 'Approved Client Signature:'}</p>
                  <img src={quote.signature} alt="Client Signature" style={{ maxHeight: '80px', display: 'block', objectFit: 'contain' }} crossOrigin="anonymous" />
                </div>
              )}
            </div>

            {!approvedSuccess && !quote.signature && (
              <div data-html2canvas-ignore="true" className="no-print">
                <button 
                  onClick={handleClientApproveClick}
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                >
                  {isHebrew ? '✔️ אשר הצעת מחיר זו' : '✔️ Approve Quote'}
                </button>
              </div>
            )}
          </div>

          {/* כיתוב מיתוג ProFlow כקישור דינמי בתוך המסגרת למטה */}
          <div style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '15px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
            מסמך זה נערך ע"י <a href="https://proflow.co.il" target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'none' }}>ProFlow</a> - התוכנה שעושה לעסקים את החיים קלים.
          </div>

        </div>
      </div>

      <footer className="no-print" style={{ textAlign: 'center', padding: '20px', marginTop: '40px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
        <button onClick={() => setShowAccessibility(true)} style={{ background: 'none', border: 'none', color: '#4f46e5', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
          {isHebrew ? 'הצהרת נגישות' : 'Accessibility Statement'}
        </button>
      </footer>
      
    </div>
  );
}

function LandingPage({ onLoginClick, isHebrew }) {
  return (
    <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#1e293b' }}>
      
      {/* Header / Nav */}
      <header style={{ background: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <ProFlowLogo size={35} />
        <div>
          <button 
            onClick={onLoginClick}
            style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}
          >
            {isHebrew ? 'התחברות / הרשמה' : 'Sign In / Register'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '20px', lineHeight: '1.2' }}>
            {isHebrew ? 'הפקת הצעות מחיר וניהול עסק מעולם לא היו קלות יותר' : 'Quoting and Business Management Made Simple'}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: '0.9', marginBottom: '35px', lineHeight: '1.5' }}>
            {isHebrew ? 'ProFlow היא המערכת המובילה לעסקים, קבלנים וחברות לשליחת הצעות מחיר מקצועיות, חתימה דיגיטלית וניהול לקוחות חכם.' : 'ProFlow is the leading platform for businesses to send professional quotes, collect digital signatures, and manage clients.'}
          </p>
          <button 
            onClick={onLoginClick}
            style={{ background: 'white', color: '#4f46e5', border: 'none', padding: '15px 35px', borderRadius: '10px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
          >
            {isHebrew ? 'התחל בחינם עכשיו 🚀' : 'Get Started Free 🚀'}
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '800', marginBottom: '40px', color: '#1e293b' }}>
          {isHebrew ? 'למה לעבוד עם ProFlow?' : 'Why Choose ProFlow?'}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📄</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: '#1e293b' }}>{isHebrew ? 'הצעות מחיר רשמיות' : 'Official Quotes'}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{isHebrew ? 'הפק הצעות מחיר מעוצבות הכוללות חישובי מע"מ אוטומטיים, הנחות והורדה מיידית לקובץ PDF.' : 'Generate beautifully designed quotes with automated VAT calculations and PDF export.'}</p>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>✍️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: '#1e293b' }}>{isHebrew ? 'חתימה דיגיטלית' : 'Digital Signatures'}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{isHebrew ? 'לקוחות הקצה חותמים ישירות מהנייד או מהמחשב, והמסמך ננעל משפטית כחוזה מחייב.' : 'Clients sign directly from mobile or desktop, locking the quote legally.'}</p>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📊</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px', color: '#1e293b' }}>{isHebrew ? 'ניהול הכנסות והוצאות' : 'Financial Reports'}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{isHebrew ? 'עקוב אחר ההכנסות, ניהול ההוצאות העסקיות וקבל דוחות רווח והפסד בזמן אמת.' : 'Track revenues, business expenses, and view real-time P&L reports.'}</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '25px', marginTop: 'auto', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', background: 'white' }}>
        <p style={{ margin: '0 0 5px 0' }}>
          © 2026 <strong>ProFlow</strong> - {isHebrew ? 'כל הזכויות שמורות' : 'All rights reserved'}.
        </p>
      </footer>
    </div>
  );
}

function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const browserLang = navigator.language || '';
  const isHebrew = (browserLang.startsWith('he') || tz === 'Asia/Jerusalem') && !window.location.search.includes('lang=en');

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email: emailInput, password: passwordInput });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthSuccess(isHebrew ? 'ההרשמה הצליחה! מתחבר...' : 'Sign up successful! Signing in...');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passwordInput });
      if (error) {
        setAuthError(isHebrew ? 'שגיאה בהתחברות: בדוק את האימייל והסיסמה.' : 'Login error: check credentials.');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!emailInput) {
      setAuthError(isHebrew ? 'נא להזין אימייל לשחזור סיסמה.' : 'Please enter email to reset password.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(emailInput);
    if (error) setAuthError(error.message);
    else setAuthSuccess(isHebrew ? 'קישור לשחזור נשלח למייל.' : 'Reset link sent.');
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>{isHebrew ? 'טוען מערכת...' : 'Loading...'}</div>;

  if (!session) {
    return (
      <div>
        <LandingPage onLoginClick={() => {
          const el = document.getElementById('auth-box');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} isHebrew={isHebrew} />
        
        <div id="auth-box" style={{ background: '#f1f5f9', padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: isHebrew ? 'right' : 'left' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e293b' }}>
              {isSignUp ? (isHebrew ? 'יצירת חשבון חדש' : 'Create Account') : (isHebrew ? 'התחברות למערכת' : 'Sign In')}
            </h3>

            {authSuccess && <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' }}>{authSuccess}</div>}
            {authError && <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' }}>{authError}</div>}

            <form onSubmit={handleAuth}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'אימייל' : 'Email'}</label>
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required placeholder="user@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#eff6ff' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'סיסמה' : 'Password'}</label>
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', background: '#eff6ff' }} />
              </div>
              <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
                {isSignUp ? (isHebrew ? 'הירשם' : 'Sign Up') : (isHebrew ? 'התחבר' : 'Sign In')}
              </button>
            </form>

            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: '600', padding: 0 }}>
                {isSignUp ? (isHebrew ? 'כבר יש לך חשבון? התחבר' : 'Already have an account?') : (isHebrew ? 'אין חשבון? הירשם כאן' : "Don't have an account?")}
              </button>
              {!isSignUp && (
                <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                  {isHebrew ? 'שכחת סיסמה?' : 'Forgot password?'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardContent session={session} />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/quote/:id" element={<PublicQuote />} />
      </Routes>
    </Router>
  );
}