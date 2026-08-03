import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { supabase } from './supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

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

const DEFAULT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyODUgMTAwIiB3aWR0aD0iMjg1IiBoZWlnaHQ9IjEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGY0NmU1Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTE1IDUwIEw0NSAyMCBMNjAgMzUgTDQwIDU1IEw2MCA3NSBMNDUgOTAgWiIgZmlsbD0idXJsKCNnKSIvPjxwYXRoIGQ9Ik00MCA1MCBMNzggMjAgTDg1IDM1IEw2NSA1NSBMODUgNzUgTDcwIDkwIFoiIGZpbGw9IiMxZTI5M2IiIG9wYWNpdHk9IjAuOSIvPjx0ZXh0IHg9IjEwNSIgeT0iNjYiIGZvbnQtZmFtaWx5PSJTZWdvZSBVSSwgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ0IiBmb250LXdlaWdodD05OTAiIGZpbGw9IiMxZTI5M2IiPlBybzx0c3BhbiBmaWxsPSIjNGY0NmU1Ij5GbG93PC90c3Bhbj48L3RleHQ+PC9zdmc+";

function AccessibilityModal({ isOpen, onClose, isHebrew }) {
  if (!isOpen) return null;

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: isHebrew ? 'right' : 'left' }}>
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

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
      >
        💬 {isHebrew ? 'שירות לקוחות AI' : 'AI Support'}
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', top: '75px', right: '25px', width: '320px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', zIndex: 99999, overflow: 'hidden' }} dir={isHebrew ? 'rtl' : 'ltr'}>
          <div style={{ background: '#4f46e5', color: 'white', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{isHebrew ? 'שירות לקוחות ProFlow (AI)' : 'ProFlow Support (AI)'}</span>
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

function PublicQuote() {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvedSuccess, setApprovedSuccess] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const navLang = navigator.language || '';
  const isHebrew = navLang.startsWith('he') || tz === 'Asia/Jerusalem';

  useEffect(() => {
    async function fetchData() {
      const { data: quoteData } = await supabase
        .from('quotes')
        .select(`*, clients ( company_name, email, phone, client_type, tax_id, address ), quote_items ( * )`)
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

      setQuote(quoteData);
      setSettings(settingsData || { business_name: 'ProFlow', plan: 'free' });
      if (quoteData && (quoteData.status === 'approved' || quoteData.status === 'paid')) {
        setApprovedSuccess(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleClientApprove = async () => {
    const confirmMsg = isHebrew 
      ? 'לחיצה על אישור הצעה זו מהווה הסכמתך לביצוע העבודה. האם להמשיך?' 
      : 'Clicking approve means you agree to proceed with the work. Do you want to continue?';

    if (!window.confirm(confirmMsg)) return;

    const { error: rpcError } = await supabase.rpc('approve_quote_public', { quote_id: id });

    if (!rpcError) {
      setApprovedSuccess(true);
    } else {
      const { error: updateError } = await supabase
        .from('quotes')
        .update({ status: 'approved' })
        .eq('id', id);

      if (!updateError) {
        setApprovedSuccess(true);
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
  const isLocalIsraeliBusiness = settings?.country === 'Israel (Local)';

  const getCurrencySymbol = (curr) => {
    if (isLocalIsraeliBusiness) return '₪';
    if (!curr) return '$';
    if (curr === 'EUR') return '€';
    if (curr === 'GBP') return '£';
    if (curr === 'ILS') return '₪';
    return '$';
  };
  const quoteSym = getCurrencySymbol(quote.currency);
  const formatNum = (val) => Math.round(Number(val || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

  return (
    <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '20px 10px', color: '#333', display: 'flex', flexDirection: 'column' }}>
      
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} isHebrew={isHebrew} />

      <div style={{ flex: '1 0 auto' }}>
        <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{isHebrew ? 'מסמך רשמי מאושר' : 'Official Document'}</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setLang(isHebrew ? 'en' : 'he')} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
              🌐 {isHebrew ? 'English' : 'עברית'}
            </button>
            <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: isGeneratingPDF ? 'wait' : 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', opacity: isGeneratingPDF ? 0.7 : 1 }}>
              <span>🖨️</span> {isGeneratingPDF ? (isHebrew ? 'מייצר PDF...' : 'Generating...') : (isHebrew ? 'הורד כ-PDF' : 'Download PDF')}
            </button>
          </div>
        </div>

        <div id="quote-document-container" style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '40px 30px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          
          {approvedSuccess && (
            <div data-html2canvas-ignore="true" style={{ background: '#dcfce7', border: '1px solid #22c55e', color: '#166534', padding: '15px 20px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center', fontWeight: 'bold' }}>
              {isHebrew ? '✅ הצעת המחיר אושרה בהצלחה על ידך! תודה רבה.' : '✅ Quote successfully approved! Thank you for your business.'}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <img src={bizLogo} alt="Business Logo" style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain', marginBottom: '8px', display: 'block' }} crossOrigin="anonymous" />
              <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                {bizTaxId && `${isHebrew ? 'עוסק/ח.פ:' : 'Tax ID:'} ${bizTaxId} | `} {bizEmail} {bizPhone ? `| ${bizPhone}` : ''}
              </p>
            </div>
            <div style={{ textAlign: isHebrew ? 'left' : 'right' }}>
              <h2 style={{ margin: 0, color: '#111827', fontSize: '22px', textTransform: 'uppercase' }}>{isHebrew ? 'הצעת מחיר' : 'QUOTE'}</h2>
              <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>#{quote.id.slice(0, 8).toUpperCase()}</p>
              <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '14px' }}>{isHebrew ? 'תאריך:' : 'Date:'} {new Date(quote.created_at).toLocaleDateString('en-US')}</p>
              <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '14px' }}>{isHebrew ? 'בתוקף עד:' : 'Valid Until:'} {quote.valid_until || 'N/A'}</p>
            </div>
          </div>

          <div style={{ marginBottom: '40px', textAlign: isHebrew ? 'right' : 'left' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>{isHebrew ? 'הוכן עבור:' : 'Prepared For:'}</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{quote.clients?.company_name || 'N/A'}</p>
            {quote.clients?.tax_id && (
               <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '14px' }}>{isHebrew ? 'ח.פ / ת.ז:' : 'Tax ID:'} {quote.clients.tax_id}</p>
            )}
            <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '15px' }}>{quote.clients?.email || ''}</p>
            {quote.clients?.phone && (
               <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '15px' }}>{quote.clients.phone}</p>
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
                      <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', textAlign: isHebrew ? 'left' : 'right', color: '#4b5563' }}>{quoteSym}{formatNum(item.unit_price)}</td>
                      <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', textAlign: isHebrew ? 'left' : 'right', fontWeight: 'bold', color: '#111827' }}>{quoteSym}{formatNum(item.total_price)}</td>
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
                <div>{isHebrew ? 'סכום ביניים (כולל מע"מ):' : 'Subtotal (Inc. VAT):'} {quoteSym}{formatNum(quoteSub)}</div>
                {quoteDiscount > 0 && <div style={{ color: '#ef4444', fontWeight: '600', marginTop: '6px' }}>{isHebrew ? `הנחה (${quoteDiscount}%):` : `Discount (${quoteDiscount}%):`} -{quoteSym}{formatNum(quoteDiscountAmount)}</div>}
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#4f46e5', marginTop: '12px' }}>{isHebrew ? 'סה"כ לתשלום:' : 'Total Amount:'} {quoteSym}{formatNum(quoteTotal)}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{isHebrew ? `(הסכום כולל מע"מ בסך ${quoteSym}{formatNum(quoteTaxAmount)})` : `(Includes VAT: ${quoteSym}${formatNum(quoteTaxAmount)})`}</div>
              </>
            ) : (
              <>
                <div>{isHebrew ? 'סכום ביניים:' : 'Subtotal:'} {quoteSym}{formatNum(quoteSub)}</div>
                {quoteDiscount > 0 && <div style={{ color: '#ef4444', fontWeight: '600', marginTop: '6px' }}>{isHebrew ? `הנחה (${quoteDiscount}%):` : `Discount (${quoteDiscount}%):`} -{quoteSym}{formatNum(quoteDiscountAmount)}</div>}
                {hasVat && <div style={{ marginTop: '6px' }}>{isHebrew ? 'מע"מ (18%):' : 'VAT (18%):'} {quoteSym}{formatNum(quoteTaxAmount)}</div>}
                <div style={{ fontSize: '22px', fontWeight: '900', color: '#4f46e5', marginTop: '12px' }}>{isHebrew ? 'סה"כ לתשלום:' : 'Total Amount:'} {quoteSym}{formatNum(quoteTotal)}</div>
              </>
            )}
          </div>

          <div style={{ marginTop: '50px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '20px' }}>
            
            {quote.terms && (
              <div style={{ textAlign: isHebrew ? 'right' : 'left' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>{isHebrew ? 'תנאים והגבלות' : 'Terms & Conditions'}</p>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '13px', whiteSpace: 'pre-wrap' }}>{quote.terms}</p>
              </div>
            )}

            {!quote.terms && <div></div>}

            {!approvedSuccess && (
              <div data-html2canvas-ignore="true" className="no-print">
                <button 
                  onClick={handleClientApprove}
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                >
                  {isHebrew ? '✔️ אשר הצעת מחיר זו' : '✔️ Approve Quote'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="no-print" style={{ textAlign: 'center', padding: '20px', marginTop: '40px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
        <p style={{ margin: '0 0 5px 0' }}>
          Powered by <strong>ProFlow</strong> - {isHebrew ? 'מערכת ניהול עסק והצעות מחיר' : 'Business & Quoting Platform'}
        </p>
        <button onClick={() => setShowAccessibility(true)} style={{ background: 'none', border: 'none', color: '#4f46e5', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
          {isHebrew ? 'הצהרת נגישות' : 'Accessibility Statement'}
        </button>
      </footer>
      
    </div>
  );
}

function Dashboard() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const browserLang = navigator.language || '';
  const isHebrew = (browserLang.startsWith('he') || tz === 'Asia/Jerusalem') && !window.location.search.includes('lang=en');

  const [session, setSession] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: 'System connected to Supabase.', type: 'success' });

  const [activeTab, setActiveTab] = useState('main');
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [financeReportType, setFinanceReportType] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [settingId, setSettingId] = useState(null);
  const [bizName, setBizName] = useState('ProFlow');
  const [bizTaxId, setBizTaxId] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizLogoUrl, setBizLogoUrl] = useState('');
  const [bizPlan, setBizPlan] = useState('free');
  const [bizRole, setBizRole] = useState('user');
  const [bizCountry, setBizCountry] = useState('');
  const [trialEndsAt, setTrialEndsAt] = useState(null);
  const [allAccounts, setAllAccounts] = useState([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  
  const [sortField, setSortField] = useState('email');
  const [sortDirection, setSortDirection] = useState('asc');

  const [showAccessibility, setShowAccessibility] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientType, setClientType] = useState('');
  const [clientTaxId, setClientTaxId] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  
  const [currency, setCurrency] = useState('USD');
  const [quoteStatus, setQuoteStatus] = useState('Draft');
  const [validUntil, setValidUntil] = useState('');
  const [discount, setDiscount] = useState(0);
  const [terms, setTerms] = useState('');
  
  const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: 0 }]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Hosting / Cloud');
  const [isRecurring, setIsRecurring] = useState(false);

  const isLocalIsraeliBusiness = bizCountry === 'Israel (Local)';

  const t = {
    appName: bizName || 'ProFlow',
    appSub: isHebrew ? 'מערכת ניהול עסק והצעות מחיר גלובלית' : 'Global SaaS Business & Quoting Platform',
    totalQuotes: isHebrew ? 'סך הכל הצעות' : 'TOTAL QUOTES',
    approvedPaid: isHebrew ? 'אושר / שולם' : 'APPROVED / PAID',
    totalRevenue: isHebrew ? 'סך הכנסות' : 'TOTAL REVENUE',
    totalExpenses: isHebrew ? 'סך הוצאות' : 'TOTAL EXPENSES',
    netProfit: isHebrew ? 'רווח נקי' : 'NET PROFIT',
    clientName: isHebrew ? 'שם הלקוח' : 'Client Name',
    clientEmail: isHebrew ? 'אימייל הלקוח' : 'Client Email',
    clientPhone: isHebrew ? 'טלפון הלקוח' : 'Client Phone',
    currency: isHebrew ? 'מטבע' : 'Currency',
    status: isHebrew ? 'סטטוס' : 'Status',
    validUntil: isHebrew ? 'בתוקף עד' : 'Valid Until',
    discount: isHebrew ? 'הנחה (%)' : 'Discount (%)',
    quoteItems: isHebrew ? 'פריטי ההצעה' : 'Quote Items',
    addItem: isHebrew ? '+ הוסף פריט ידנית' : '+ Add Custom Item',
    quickAdd: isHebrew ? 'בחר שירות מהקטלוג...' : 'Choose from catalog...',
    description: isHebrew ? 'תיאור' : 'Description',
    total: isHebrew ? 'סה"כ' : 'Total',
    subtotal: isHebrew ? 'סכום ביניים:' : 'Subtotal:',
    vat: isHebrew ? 'מע"מ (18%):' : 'VAT (18%):',
    totalAmount: isHebrew ? 'סה"כ לתשלום:' : 'Total Amount:',
    generateSave: isHebrew ? 'הפק ושמור בענן' : 'Generate & Save to Cloud',
    updateQuote: isHebrew ? 'עדכן הצעה בענן' : 'Update Quote in Cloud',
    cancelEdit: isHebrew ? 'ביטול עריכה' : 'Cancel Edit',
    recentHistory: isHebrew ? 'היסטוריית הצעות מחיר' : 'Recent Quotes History',
    servicesCatalog: isHebrew ? 'קטלוג שירותים ומוצרים' : 'Services & Products Catalog',
    expensesManagement: isHebrew ? 'ניהול הוצאות עסק' : 'Business Expenses Management',
    addExpenseBtn: isHebrew ? 'הוסף הוצאה' : 'Add Expense',
    businessSettings: isHebrew ? 'הגדרות עסק וחבילה' : 'Business Settings',
    saveSettings: isHebrew ? 'שמור הגדרות עסק' : 'Save Business Settings',
    businessNameLabel: isHebrew ? 'שם העסק' : 'Business Name',
    taxIdLabel: isHebrew ? 'ח.פ / עוסק מורשה / פטור' : 'Tax ID / Lic No',
    logoUrlLabel: isHebrew ? 'כתובת תמונת לוגו (URL)' : 'Logo Image URL',
    addService: isHebrew ? 'הוסף לקטלוג' : 'Add to Catalog',
    serviceName: isHebrew ? 'שם השירות / המוצר' : 'Service Name',
    defaultPrice: isHebrew ? 'מחיר קבוע' : 'Default Price',
    searchQuote: isHebrew ? 'חיפוש שם לקוח או מס׳ הצעה...' : 'Search client or quote #...',
    filterStatus: isHebrew ? 'כל הסטטוסים' : 'All Statuses',
    actions: isHebrew ? 'פעולות' : 'Actions',
    edit: isHebrew ? 'ערוך' : 'Edit',
    duplicate: isHebrew ? 'שכפל' : 'Duplicate',
    delete: isHebrew ? 'מחק' : 'Delete',
    clientsManagement: isHebrew ? 'ניהול לקוחות' : 'Clients Management'
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  async function loadData() {
    await fetchQuotes();
    await fetchClients();
    await fetchServices();
    await fetchExpenses();
    await fetchSettings();
  }

  async function fetchQuotes() {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from('quotes')
      .select(`*, clients ( company_name, email, phone, client_type, tax_id, address ), quote_items ( * )`)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching quotes:', error.message);
    else setQuotes(data || []);
  }

  async function fetchClients() {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from('clients')
      .select('id, company_name, email, phone, client_type, created_at, user_id, tax_id, address')
      .eq('user_id', session.user.id);
    if (error) {
      console.error('Error fetching clients:', error.message);
    } else {
      setClients(data || []);
    }
  }

  async function fetchServices() {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    if (error) console.error('Error fetching services:', error.message);
    else setServices(data || []);
  }

  async function fetchExpenses() {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('expense_date', { ascending: false });
    if (error) console.error('Error fetching expenses:', error.message);
    else setExpenses(data || []);
  }

  async function fetchSettings() {
    if (!session?.user?.id) return;
    
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isIL = tz === 'Asia/Jerusalem';
    const detectedCountry = isIL ? 'Israel (Local)' : (tz ? tz.split('/')[1]?.replace('_', ' ') : 'International');
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (data) {
      setSettingId(data.id);
      setBizName(data.business_name || 'ProFlow');
      setBizTaxId(data.tax_id || '');
      setBizEmail(data.email || '');
      setBizPhone(data.phone || '');
      setBizLogoUrl(data.logo_url || '');
      setBizPlan(data.plan || 'free');
      setBizRole(data.role || 'user');
      setBizCountry(data.country || '');
      setTrialEndsAt(data.trial_ends_at || null);
      
      if (data.country === 'Israel (Local)') {
        setCurrency('ILS');
      } else {
        setCurrency('USD');
      }

      await supabase
        .from('business_settings')
        .update({ last_sign_in: nowIso, country: detectedCountry })
        .eq('user_id', session.user.id);

      if (data.role === 'super_admin') {
        fetchAllAccounts();
      }
    } else {
      const defaultPayload = {
        user_id: session.user.id,
        email: session.user.email,
        business_name: 'New Business',
        country: detectedCountry,
        plan: 'free',
        role: 'user',
        last_sign_in: nowIso
      };

      const { data: newData, error: insertError } = await supabase
        .from('business_settings')
        .insert([defaultPayload])
        .select()
        .maybeSingle();

      if (insertError) console.error("Auto-init error:", insertError);

      if (newData) {
        setSettingId(newData.id);
        setBizName(newData.business_name);
        setBizEmail(newData.email);
        setBizPlan(newData.plan);
        setBizRole(newData.role);
        setBizCountry(newData.country || '');
        setTrialEndsAt(null);
        if (newData.country === 'Israel (Local)') {
          setCurrency('ILS');
        } else {
          setCurrency('USD');
        }
      } else {
        setSettingId(null);
        setBizPlan('free');
        setBizRole('user');
        setTrialEndsAt(null);
      }
    }
  }

  async function fetchAllAccounts() {
    const { data, error } = await supabase.from('business_settings').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setAllAccounts(data);
    }
  }

  async function handleAdminPlanChange(accountId, newPlan) {
    const updatePayload = { plan: newPlan };
    
    if (newPlan !== 'free') {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30);
      updatePayload.trial_ends_at = trialEndDate.toISOString();
    } else {
      updatePayload.trial_ends_at = null;
    }

    const { error } = await supabase.from('business_settings').update(updatePayload).eq('id', accountId);
    
    if (error) {
      setStatusMsg({ text: 'Error updating user plan: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: 'User plan updated successfully!', type: 'success' });
      fetchAllAccounts();
    }
  }

  async function handleMakeLifetime(accountId) {
    if (!window.confirm(isHebrew ? 'האם אתה בטוח שברצונך להעניק למשתמש זה מנוי לכל החיים ולבטל את תקופת הניסיון?' : 'Are you sure you want to grant this user a lifetime subscription?')) return;
    
    const { error } = await supabase.from('business_settings').update({ trial_ends_at: null }).eq('id', accountId);
    if (error) {
      setStatusMsg({ text: 'Error updating user: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: isHebrew ? 'מנוי לכל החיים עודכן בהצלחה!' : 'Lifetime access granted successfully!', type: 'success' });
      fetchAllAccounts();
    }
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    if (!session?.user?.id) return;

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isIL = tz === 'Asia/Jerusalem';
    const detectedCountry = isIL ? 'Israel (Local)' : (tz ? tz.split('/')[1]?.replace('_', ' ') : 'International');

    const payload = {
      business_name: bizName,
      tax_id: bizTaxId,
      email: bizEmail,
      phone: bizPhone,
      logo_url: bizLogoUrl,
      country: detectedCountry,
      user_id: session.user.id
    };

    if (settingId) {
      const { error } = await supabase.from('business_settings').update(payload).eq('id', settingId);
      if (error) setStatusMsg({ text: 'Error updating settings: ' + error.message, type: 'error' });
      else setStatusMsg({ text: isHebrew ? 'הגדרות העסק עודכנו בהצלחה!' : 'Business settings updated successfully!', type: 'success' });
    } else {
      const { data, error } = await supabase.from('business_settings').insert([payload]).select();
      if (error) setStatusMsg({ text: 'Error saving settings: ' + error.message, type: 'error' });
      else if (data && data[0]) {
        setSettingId(data[0].id);
        setStatusMsg({ text: isHebrew ? 'הגדרות העסק נשמרו בהצלחה!' : 'Business settings saved successfully!', type: 'success' });
      }
    }
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    if (!session?.user?.id) return;

    const { error } = await supabase.from('expenses').insert([{
      user_id: session.user.id,
      description: expenseDesc,
      amount: Number(expenseAmount),
      category: expenseCategory,
      is_recurring: isRecurring,
      expense_date: new Date().toISOString().split('T')[0]
    }]);

    if (error) {
      setStatusMsg({ text: 'Error adding expense: ' + error.message, type: 'error' });
    } else {
      setExpenseDesc('');
      setExpenseAmount('');
      setIsRecurring(false);
      fetchExpenses();
      setStatusMsg({ text: isHebrew ? 'ההוצאה נוספה בהצלחה!' : 'Expense added successfully!', type: 'success' });
    }
  }

  async function handleDeleteExpense(expenseId) {
    if (!window.confirm(isHebrew ? 'למחוק הוצאה זו?' : 'Delete this expense?')) return;
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
    if (error) setStatusMsg({ text: 'Error deleting expense: ' + error.message, type: 'error' });
    else fetchExpenses();
  }

  const exportToCSV = (dataArray, filename) => {
    if (!dataArray || dataArray.length === 0) {
      alert(isHebrew ? 'אין נתונים לייצוא.' : 'No data to export.');
      return;
    }
    const keys = Object.keys(dataArray[0]);
    const csvContent = [
      keys.join(','),
      ...dataArray.map(row => keys.map(key => JSON.stringify(row[key] ?? '')).join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportQuotes = () => {
    const exportData = filteredQuotes.map(q => ({
      ID: q.id,
      Client: q.clients?.company_name || '',
      Email: q.clients?.email || '',
      Status: q.status,
      Total: q.total,
      ValidUntil: q.valid_until || '',
      CreatedAt: q.created_at
    }));
    exportToCSV(exportData, 'quotes_report.csv');
  };

  const handleExportExpenses = () => {
    const exportData = filteredExpensesForReport.map(e => ({
      ID: e.id,
      Description: e.description,
      Category: e.category,
      Amount: e.amount,
      Date: e.expense_date,
      Recurring: e.is_recurring ? 'Yes' : 'No'
    }));
    exportToCSV(exportData, 'expenses_report.csv');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (isSignUp) {
      const { data: existingBiz, error: checkErr } = await supabase
        .from('business_settings')
        .select('email')
        .eq('email', emailInput)
        .maybeSingle();

      if (existingBiz) {
        setAuthError(isHebrew ? 'כתובת האימייל כבר קיימת במערכת! אנא התחבר או השתמש בשחזור סיסמה.' : 'Email already registered! Please sign in or use password reset.');
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email: emailInput, password: passwordInput });
      if (error) {
        setAuthError(isHebrew ? 'כתובת האימייל כבר קיימת במערכת! אנא התחבר או השתמש בשחזור סיסמה.' : 'Email already registered! Please sign in or use password reset.');
      } else {
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          setAuthError(isHebrew ? 'כתובת האימייל כבר קיימת במערכת! אנא התחבר.' : 'Email already exists! Please sign in.');
        } else {
          setAuthSuccess(isHebrew ? 'ההרשמה הצליחה! המערכת יוצרת כעת פרופיל משתמש...' : 'Sign up successful! Initializing user profile...');
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passwordInput });
      if (error) {
        setAuthError(isHebrew ? 'שגיאה בהתחברות: בדוק את האימייל והסיסמה או השתמש בשחזור סיסמה.' : 'Login error: check your credentials or reset password.');
      } else {
        setStatusMsg({ text: isHebrew ? 'התחברת בהצלחה' : 'Logged in successfully', type: 'success' });
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!emailInput) {
      setAuthError(isHebrew ? 'נא להזין כתובת אימייל בתיבת האימייל למעלה לשחזור סיסמה.' : 'Please enter your email above to reset password.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(emailInput, {
      redirectTo: window.location.origin,
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess(isHebrew ? 'קישור לשחזור סיסמה נשלח לאימייל שלך בהצלחה.' : 'Password reset link sent to your email.');
    }
  };

  const handleSignOut = async () => await supabase.auth.signOut();

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);

  const handleAddFromCatalog = (e) => {
    const sId = e.target.value;
    if (!sId) return;
    const svc = services.find(s => s.id.toString() === sId);
    if (svc) {
      if (items.length === 1 && items[0].description === '' && items[0].unit_price === 0) {
        setItems([{ description: svc.name, quantity: 1, unit_price: svc.price }]);
      } else {
        setItems([...items, { description: svc.name, quantity: 1, unit_price: svc.price }]);
      }
    }
    e.target.value = ''; 
  };

  const removeItem = (index) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  async function handleAddService(e) {
    e.preventDefault();
    const { error } = await supabase.from('services').insert([{ name: newServiceName, price: Number(newServicePrice) }]);
    if (error) setStatusMsg({ text: 'Error adding service: ' + error.message, type: 'error' });
    else {
      setNewServiceName('');
      setNewServicePrice('');
      fetchServices();
      setStatusMsg({ text: isHebrew ? 'שירות נוסף לקטלוג בהצלחה' : 'Service added to catalog successfully', type: 'success' });
    }
  }

  async function handleDeleteService(id) {
    if (!window.confirm(isHebrew ? 'למחוק שירות זה מהקטלוג?' : 'Delete this service from catalog?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) setStatusMsg({ text: 'Error deleting service: ' + error.message, type: 'error' });
    else fetchServices();
  }

  async function handleDeleteClient(clientId) {
    if (!window.confirm(isHebrew ? 'למחוק לקוח זה? שים לב שהדבר עלול להשפיע על הצעות מחיר קשורות.' : 'Delete this client?')) return;
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) setStatusMsg({ text: 'Error deleting client: ' + error.message, type: 'error' });
    else {
      setStatusMsg({ text: isHebrew ? 'הלקוח נמחק בהצלחה.' : 'Client deleted successfully.', type: 'success' });
      fetchClients();
    }
  }

  async function handleDeleteQuote(quoteId) {
    if (!window.confirm(isHebrew ? 'למחוק הצעת מחיר זו לצמיתות?' : 'Delete this quote permanently?')) return;
    await supabase.from('quote_items').delete().eq('quote_id', quoteId);
    const { error } = await supabase.from('quotes').delete().eq('id', quoteId);
    if (error) {
      setStatusMsg({ text: 'Error deleting quote: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: isHebrew ? 'ההצעה נמחקה בהצלחה!' : 'Quote deleted successfully!', type: 'success' });
      fetchQuotes();
    }
  }

  async function handleStatusChange(quoteId, newStatus) {
    const { error } = await supabase.from('quotes').update({ status: newStatus.toLowerCase() }).eq('id', quoteId);
    if (error) {
      setStatusMsg({ text: 'Error updating status: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: isHebrew ? 'סטטוס ההצעה עודכן בהצלחה!' : 'Quote status updated successfully!', type: 'success' });
      fetchQuotes();
    }
  }

  const sendWhatsApp = (proposal) => {
    const clientNameVal = proposal.clients?.company_name || 'לקוח';
    const text = isHebrew 
      ? `הי ${clientNameVal}, הנה הצעת המחיר שלך מספר #${proposal.id.slice(0, 6)} על סך ₪${formatNum(proposal.total)}. בתוקף עד ${proposal.validUntil || 'N/A'}.`
      : `Hi ${clientNameVal}, here is your quote #${proposal.id.slice(0, 6)} totaling ${sym}${formatNum(proposal.total)}. Valid until ${proposal.validUntil || 'N/A'}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEmailQuote = async (quote) => {
    if (!quote.clients?.email) {
      alert(isHebrew ? 'ללקוח זה אין כתובת אימייל מעודכנת.' : 'This client does not have an email address.');
      return;
    }

    const confirmMsg = isHebrew
      ? `האם לשלוח את הצעת המחיר לכתובת: ${quote.clients.email}?`
      : `Send quote to: ${quote.clients.email}?`;

    if (!window.confirm(confirmMsg)) return;

    setStatusMsg({ text: isHebrew ? 'שולח אימייל ללקוח דרך הענן...' : 'Sending email via cloud...', type: 'success' });

    try {
      const quoteSym = getCurrencySymbol(quote.currency);
      const quoteLink = `${window.location.origin}/quote/${quote.id}`;
      
      const { error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          to: quote.clients.email,
          clientName: quote.clients.company_name,
          quoteId: quote.id,
          total: formatNum(quote.total),
          currencySymbol: quoteSym,
          quoteLink: quoteLink,
          businessName: bizName
        }
      });

      if (error) throw error;
      setStatusMsg({ text: isHebrew ? '📧 האימייל נשלח בהצלחה ללקוח!' : '📧 Email sent successfully!', type: 'success' });
    } catch (err) {
      console.error("Email send error:", err);
      const quoteSym = getCurrencySymbol(quote.currency);
      const quoteLink = `${window.location.origin}/quote/${quote.id}`;
      const subject = isHebrew ? `הצעת מחיר #${quote.id.slice(0, 6).toUpperCase()} מ-${bizName}` : `Quote #${quote.id.slice(0, 6).toUpperCase()} from ${bizName}`;
      const body = isHebrew
        ? `שלום ${quote.clients?.company_name || ''},\n\nמצורפת הצעת המחיר שלך.\nסך הכל לתשלום: ${quoteSym}${formatNum(quote.total)}\n\nלצפייה בהצעה המלאה לחץ כאן:\n${quoteLink}\n\nבברכה,\nצוות ${bizName}`
        : `Hello ${quote.clients?.company_name || ''},\n\nPlease find your quote details below.\nTotal Amount: ${quoteSym}${formatNum(quote.total)}\n\nView your full quote here:\n${quoteLink}\n\nBest regards,\n${bizName} Team`;

      window.location.href = `mailto:${quote.clients.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const formatNum = (val) => Math.round(Number(val || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
  const discountAmount = (subtotal * Number(discount)) / 100;
  const baseAmount = subtotal - discountAmount;
  let taxRate = isHebrew ? 0.18 : 0.00;
  
  let taxAmount = 0;
  let totalAmount = 0;

  if (isHebrew && clientType === 'private') {
    totalAmount = baseAmount;
    taxAmount = totalAmount - (totalAmount / (1 + taxRate));
  } else {
    taxAmount = baseAmount * taxRate;
    totalAmount = baseAmount + taxAmount;
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyQuotesCount = quotes.filter(q => {
    const qDate = new Date(q.created_at);
    return qDate.getMonth() === currentMonth && qDate.getFullYear() === currentYear;
  }).length;

  const planLimit = bizPlan === 'free' ? 5 : bizPlan === 'basic' ? 20 : '∞';

  const totalQuotesCount = quotes.length;
  const totalRevenue = quotes.filter(q => q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid').reduce((sum, q) => sum + Number(q.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const now = new Date();
  const reportYear = now.getFullYear();
  const reportMonth = now.getMonth();

  const filteredQuotesForReport = quotes.filter(q => {
    if (!(q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid')) return false;
    const qDate = new Date(q.created_at);

    if (financeReportType === 'custom') {
      if (!startDate && !endDate) return true;
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return qDate >= start && qDate <= end;
    }

    if (qDate.getFullYear() !== reportYear) return false;

    if (financeReportType === 'monthly') {
      return qDate.getMonth() === reportMonth;
    } else if (financeReportType === 'quarterly') {
      const currentQuarter = Math.floor(reportMonth / 3);
      const qQuarter = Math.floor(qDate.getMonth() / 3);
      return qQuarter === currentQuarter;
    } else if (financeReportType === 'half-yearly') {
      const currentHalf = reportMonth < 6 ? 0 : 1;
      const qHalf = qDate.getMonth() < 6 ? 0 : 1;
      return qHalf === currentHalf;
    } else {
      return true;
    }
  });

  const filteredExpensesForReport = expenses.filter(exp => {
    const expDate = new Date(exp.expense_date);
    if (exp.is_recurring) return true;

    if (financeReportType === 'custom') {
      if (!startDate && !endDate) return true;
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return expDate >= start && expDate <= end;
    }

    if (expDate.getFullYear() !== reportYear) return false;

    if (financeReportType === 'monthly') {
      return expDate.getMonth() === reportMonth;
    } else if (financeReportType === 'quarterly') {
      const currentQuarter = Math.floor(reportMonth / 3);
      const expQuarter = Math.floor(expDate.getMonth() / 3);
      return expQuarter === currentQuarter;
    } else if (financeReportType === 'half-yearly') {
      const currentHalf = reportMonth < 6 ? 0 : 1;
      const expHalf = expDate.getMonth() < 6 ? 0 : 1;
      return expHalf === currentHalf;
    } else {
      return true;
    }
  });

  const adminTotalQuotesCount = filteredQuotesForReport.length;
  const adminTotalRevenue = filteredQuotesForReport.reduce((sum, q) => sum + Number(q.total || 0), 0);
  const adminTotalExpenses = filteredExpensesForReport.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const adminNetProfit = adminTotalRevenue - adminTotalExpenses;

  const monthNames = isHebrew ? ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = monthNames.map((name, index) => {
    let income = 0;
    let expense = 0;
    
    quotes.forEach(q => {
      if (q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid') {
        const d = new Date(q.created_at);
        if (d.getFullYear() === reportYear && d.getMonth() === index) {
          income += Number(q.total || 0);
        }
      }
    });

    expenses.forEach(exp => {
      const d = new Date(exp.expense_date);
      if (exp.is_recurring) {
        if (d.getFullYear() < reportYear || (d.getFullYear() === reportYear && d.getMonth() <= index)) {
          expense += Number(exp.amount || 0);
        }
      } else if (d.getFullYear() === reportYear && d.getMonth() === index) {
        expense += Number(exp.amount || 0);
      }
    });

    return { name, [isHebrew ? 'הכנסות' : 'Income']: income, [isHebrew ? 'הוצאות' : 'Expenses']: expense };
  });

  const getCurrencySymbol = (curr) => {
    if (isLocalIsraeliBusiness) return '₪';
    if (!curr) return '$';
    if (curr === 'EUR') return '€';
    if (curr === 'GBP') return '£';
    if (curr === 'ILS') return '₪';
    return '$';
  };
  const sym = getCurrencySymbol(currency);

  const showQuoteForm = isCreatingQuote || editingQuoteId !== null;

  const handleEditClick = (quote) => {
    setEditingQuoteId(quote.id);
    setIsCreatingQuote(false);
    setClientName(quote.clients?.company_name || '');
    setClientEmail(quote.clients?.email || '');
    setClientPhone(quote.clients?.phone || '');
    setClientType(quote.client_type || quote.clients?.client_type || '');
    setClientTaxId(quote.clients?.tax_id || '');
    setClientAddress(quote.clients?.address || '');
    
    if (isLocalIsraeliBusiness) {
      setCurrency('ILS');
    } else {
      let c = quote.currency || 'USD';
      if (c === 'ILS') c = 'USD';
      setCurrency(c);
    }

    setQuoteStatus(quote.status ? quote.status.charAt(0).toUpperCase() + quote.status.slice(1) : 'Draft');
    setValidUntil(quote.valid_until || '');
    setDiscount(quote.discount || 0); 
    setTerms(quote.terms || '');
    
    if (quote.quote_items && quote.quote_items.length > 0) {
      setItems(quote.quote_items.map(item => ({ description: item.description, quantity: item.quantity, unit_price: item.unit_price })));
    } else {
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMsg({ text: isHebrew ? `טוען לעריכה הצעה #${quote.id.slice(0, 6)}...` : `Editing Quote #${quote.id.slice(0, 6)}...`, type: 'success' });
  };

  const handleDuplicateQuote = (quote) => {
    setEditingQuoteId(null); 
    setIsCreatingQuote(true);
    setClientName(quote.clients?.company_name || '');
    setClientEmail(quote.clients?.email || '');
    setClientPhone(quote.clients?.phone || '');
    setClientType(quote.client_type || quote.clients?.client_type || '');
    setClientTaxId(quote.clients?.tax_id || '');
    setClientAddress(quote.clients?.address || '');
    
    if (isLocalIsraeliBusiness) {
      setCurrency('ILS');
    } else {
      let c = quote.currency || 'USD';
      if (c === 'ILS') c = 'USD';
      setCurrency(c);
    }

    setQuoteStatus('Draft');
    setValidUntil(quote.valid_until || '');
    setDiscount(quote.discount || 0);
    setTerms(quote.terms || '');
    
    if (quote.quote_items && quote.quote_items.length > 0) {
      setItems(quote.quote_items.map(item => ({ description: item.description, quantity: item.quantity, unit_price: item.unit_price })));
    } else {
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMsg({ text: isHebrew ? 'ההצעה נטענה לשכפול בהצלחה.' : 'Quote loaded for duplication.', type: 'success' });
  };

  const handleCancelEdit = () => {
    setEditingQuoteId(null);
    setIsCreatingQuote(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientType('');
    setClientTaxId('');
    setClientAddress('');
    setValidUntil('');
    setDiscount(0);
    setTerms('');
    setCurrency(isLocalIsraeliBusiness ? 'ILS' : 'USD');
    setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    setStatusMsg({ text: isHebrew ? 'הפעולה בוטלה. הנה רשימת ההצעות.' : 'Action cancelled. Here are your quotes.', type: 'success' });
  };

  async function handleSaveQuote(e) {
    e.preventDefault();
    if (!session?.user?.id) return;

    if (clientType === 'business' && (!terms || terms.trim() === '')) {
      setStatusMsg({ text: isHebrew ? 'שגיאה: חובה לבחור תנאי תשלום ללקוח עסקי.' : 'Error: Payment terms are required for business clients.', type: 'error' });
      return;
    }

    try {
      if (!editingQuoteId && bizRole !== 'super_admin') {
        const limit = bizPlan === 'free' ? 5 : bizPlan === 'basic' ? 20 : Infinity;
        if (monthlyQuotesCount >= limit) {
          setStatusMsg({ 
            text: isHebrew 
              ? `הגעת למגבלת ההצעות החודשית בחבילה שלך (${limit} הצעות). שדרג חבילה כדי ליצור הצעות נוספות!` 
              : `Monthly quote limit reached for your plan (${limit} quotes). Upgrade to create more!`, 
            type: 'error' 
          });
          return;
        }
      }

      let clientId;
      const existingClient = clients.find(c => c.company_name?.toLowerCase() === clientName.toLowerCase() && c.user_id === session.user.id);
      
      if (existingClient) {
        clientId = existingClient.id;
        if (clientPhone !== existingClient.phone || clientType !== existingClient.client_type || clientTaxId !== existingClient.tax_id || clientAddress !== existingClient.address) {
          await supabase.from('clients').update({ phone: clientPhone, client_type: clientType, tax_id: clientTaxId, address: clientAddress }).eq('id', clientId);
        }
      } else {
        const { data: newClientData, error: clientError } = await supabase.from('clients').insert([{ company_name: clientName, email: clientEmail, phone: clientPhone, client_type: clientType, tax_id: clientTaxId, address: clientAddress, user_id: session.user.id }]).select();
        if (clientError) throw clientError;
        clientId = newClientData[0].id;
      }

      let dbCurrency = isLocalIsraeliBusiness ? 'ILS' : currency;

      const quotePayload = {
        client_id: clientId,
        client_type: clientType,
        currency: dbCurrency,
        subtotal: subtotal,
        tax_rate: taxRate,
        total: totalAmount,
        status: quoteStatus.toLowerCase(),
        valid_until: validUntil || null,
        discount: Number(discount),
        terms: terms,
        user_id: session.user.id
      };

      let quoteId;

      if (editingQuoteId) {
        const { error: updateError } = await supabase.from('quotes').update(quotePayload).eq('id', editingQuoteId);
        if (updateError) throw updateError;
        quoteId = editingQuoteId;
        await supabase.from('quote_items').delete().eq('quote_id', quoteId);
      } else {
        const { data: quoteData, error: quoteError } = await supabase.from('quotes').insert([quotePayload]).select();
        if (quoteError) throw quoteError;
        quoteId = quoteData[0].id;
      }

      const quoteItemsToInsert = items.map(item => ({
        quote_id: quoteId,
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        total_price: Number(item.quantity) * Number(item.unit_price)
      }));

      const { error: itemsError } = await supabase.from('quote_items').insert(quoteItemsToInsert);
      if (itemsError) throw itemsError;

      setStatusMsg({ 
        text: editingQuoteId 
          ? (isHebrew ? `הצעה #${editingQuoteId.slice(0, 6)} עודכנה בהצלחה!` : `Quote #${editingQuoteId.slice(0, 6)} successfully updated!`) 
          : (isHebrew ? `ההצעה הופקה ונשמרה בענן בהצלחה! סה"כ: ${sym}${formatNum(totalAmount)}` : `Quote successfully created and saved to cloud! Total: ${sym}${formatNum(totalAmount)}`), 
        type: 'success' 
      });
      
      setEditingQuoteId(null);
      setIsCreatingQuote(false);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setClientType('');
      setClientTaxId('');
      setClientAddress('');
      setValidUntil('');
      setDiscount(0);
      setTerms('');
      setCurrency(isLocalIsraeliBusiness ? 'ILS' : 'USD');
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
      loadData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: isHebrew ? `שגיאה בשמירת ההצעה: ${err.message}` : `Error saving quote: ${err.message}`, type: 'error' });
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = (quote.clients?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (quote.status || 'draft').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredAdminAccounts = allAccounts.filter(acc => {
    const term = adminSearchTerm.toLowerCase();
    return (acc.email && acc.email.toLowerCase().includes(term)) || 
           (acc.business_name && acc.business_name.toLowerCase().includes(term));
  }).sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === null || aVal === undefined) aVal = '';
    if (bVal === null || bVal === undefined) bVal = '';

    if (sortField === 'last_sign_in' || sortField === 'trial_ends_at') {
      const timeA = aVal ? new Date(aVal).getTime() : 0;
      const timeB = bVal ? new Date(bVal).getTime() : 0;
      return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    }

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  let trialDaysLeft = null;
  let isTrialExpired = false;
  if (trialEndsAt) {
    const end = new Date(trialEndsAt);
    const now = new Date();
    const diffTime = end - now;
    trialDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isTrialExpired = trialDaysLeft <= 0;
  }

  if (!session) {
    return (
      <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: isHebrew ? 'right' : 'left' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ProFlowLogo size={50} />
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '12px' }}>
              {isSignUp 
                ? (isHebrew ? 'יצירת חשבון חדש במערכת' : 'Create a new account') 
                : (isHebrew ? 'התחברות למערכת הניהול' : 'Sign in to your dashboard')}
            </p>
          </div>

          {authSuccess && <div style={{ padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', background: '#dcfce7', color: '#166534' }}>{authSuccess}</div>}
          {authError && <div style={{ padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', background: '#fee2e2', color: '#991b1b' }}>{authError}</div>}

          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'אימייל' : 'Email'}</label>
              <input type="email" name="loginEmail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required placeholder="user@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#eff6ff' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'סיסמה' : 'Password'}</label>
              <input type="password" name="loginPassword" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', background: '#eff6ff' }} />
            </div>
            <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
              {isSignUp ? (isHebrew ? 'הירשם' : 'Sign Up') : (isHebrew ? 'התחבר' : 'Sign In')}
            </button>
          </form>

          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: '600', padding: 0 }}
            >
              {isSignUp ? (isHebrew ? 'כבר יש לך חשבון? התחבר' : 'Already have an account?') : (isHebrew ? 'אין חשבון? הירשם כאן' : "Don't have an account?")}
            </button>
            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                {isHebrew ? 'שכחת סיסמה?' : 'Forgot password?'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} isHebrew={isHebrew} />

      <div style={{ flex: '1 0 auto', padding: '15px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
              {(bizLogoUrl && bizLogoUrl.trim() !== '' && bizPlan === 'pro') ? (
                <img src={bizLogoUrl} alt="" style={{ height: '36px', maxWidth: '150px', objectFit: 'contain' }} />
              ) : (
                <ProFlowLogo size={32} />
              )}
            </div>

            <div style={{ flex: '0 1 auto', textAlign: 'center' }}>
              <AIChatWidget isHebrew={isHebrew} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
              {bizRole === 'super_admin' && <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>SUPER ADMIN</span>}
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{session.user.email}</span>
              <button onClick={handleSignOut} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>Sign Out</button>
            </div>
          </div>

          {statusMsg.text && statusMsg.text !== 'System connected to Supabase.' && (
            <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: statusMsg.type === 'success' ? '#166534' : '#991b1b', fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' }}>
              {statusMsg.text}
            </div>
          )}

          {trialEndsAt && !isTrialExpired && bizRole !== 'super_admin' && (
            <div style={{ background: '#eff6ff', border: '1px solid #3b82f6', color: '#1d4ed8', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '500', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px', fontSize: '0.9rem' }}>
              <span>{isHebrew ? '🚀 תקופת ניסיון פעילה' : '🚀 Active Trial Period'}</span>
              <span>{isHebrew ? `נותרו עוד ${trialDaysLeft} ימים` : `${trialDaysLeft} days remaining`}</span>
            </div>
          )}

          {isTrialExpired && bizRole !== 'super_admin' && (
            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500', fontSize: '0.9rem' }}>
              {isHebrew ? '⚠️ תקופת הניסיון שלך הסתיימה. כדי להמשיך להפיק הצעות מחיר, אנא שדרג את החבילה.' : '⚠️ Your trial period has expired. Please upgrade to continue generating quotes.'}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setActiveTab('main'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
              style={{
                flex: '1 1 auto', minWidth: '130px', padding: '10px 15px', borderRadius: '10px', border: activeTab === 'main' ? '2px solid #4f46e5' : '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', background: activeTab === 'main' ? '#4f46e5' : 'white', color: activeTab === 'main' ? 'white' : '#475569', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {isHebrew ? '🏠 הצעות מחיר' : '🏠 Quotes'}
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
              style={{
                flex: '1 1 auto', minWidth: '130px', padding: '10px 15px', borderRadius: '10px', border: activeTab === 'settings' ? '2px solid #4f46e5' : '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', background: activeTab === 'settings' ? '#4f46e5' : 'white', color: activeTab === 'settings' ? 'white' : '#475569', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {isHebrew ? '⚙️ הגדרות עסק' : '⚙️ Business Settings'}
            </button>
            <button
              onClick={() => { setActiveTab('clients'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
              style={{
                flex: '1 1 auto', minWidth: '130px', padding: '10px 15px', borderRadius: '10px', border: activeTab === 'clients' ? '2px solid #4f46e5' : '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', background: activeTab === 'clients' ? '#4f46e5' : 'white', color: activeTab === 'clients' ? 'white' : '#475569', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {isHebrew ? '👥 לקוחות' : '👥 Clients'}
            </button>
            {bizRole === 'super_admin' && (
              <>
                <button
                  onClick={() => { setActiveTab('finances'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
                  style={{
                    flex: '1 1 auto', minWidth: '130px', padding: '10px 15px', borderRadius: '10px', border: activeTab === 'finances' ? '2px solid #4f46e5' : '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', background: activeTab === 'finances' ? '#4f46e5' : 'white', color: activeTab === 'finances' ? 'white' : '#475569', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  {isHebrew ? '📊 הוצאות/הכנסות' : '📊 Finances'}
                </button>
                <button
                  onClick={() => { setActiveTab('admin_clients'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
                  style={{
                    flex: '1 1 auto', minWidth: '130px', padding: '10px 15px', borderRadius: '10px', border: activeTab === 'admin_clients' ? '2px solid #4f46e5' : '1px solid #cbd5e1', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer', background: activeTab === 'admin_clients' ? '#4f46e5' : 'white', color: activeTab === 'admin_clients' ? 'white' : '#475569', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  {isHebrew ? '👑 משתמשים' : '👑 Users Admin'}
                </button>
              </>
            )}
          </div>

          {/* מראה את טבלת ההיסטוריה והסטטיסטיקות רק אם אנחנו לא במסך יצירה/עריכה */}
          {activeTab === 'main' && !showQuoteForm && (
            <>
              {bizRole !== 'super_admin' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #4f46e5' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #4f46e5' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.totalQuotes}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{totalQuotesCount}</div>
                    {bizPlan !== 'pro' && (
                      <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '5px', fontWeight: 'bold' }}>
                        {isHebrew ? `נוצרו החודש: ${monthlyQuotesCount} מתוך ${planLimit}` : `This month: ${monthlyQuotesCount} / ${planLimit}`}
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #22c55e' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #22c55e' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.totalRevenue}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22c55e' }}>{sym}{formatNum(totalRevenue)}</div>
                  </div>
                </div>
              )}

              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h2 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0 }}>{t.recentHistory}</h2>
                    <button 
                      onClick={() => setIsCreatingQuote(true)}
                      style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}
                    >
                      ➕ {isHebrew ? 'צור הצעת מחיר חדשה' : 'Create New Quote'}
                    </button>
                    <button 
                      onClick={handleExportQuotes}
                      style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                    >
                      📥 {isHebrew ? 'ייצא לאקסל (CSV)' : 'Export CSV'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', width: '100%', maxWidth: '450px' }}>
                    <input 
                      type="text" 
                      placeholder={t.searchQuote} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ flex: '1 1 180px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.9rem', background: '#eff6ff' }}
                    />
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ flex: '1 1 120px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#eff6ff', boxSizing: 'border-box', fontSize: '0.9rem' }}
                    >
                      <option value="All">{t.filterStatus}</option>
                      <option value="draft">{isHebrew ? 'טיוטה' : 'Draft'}</option>
                      <option value="sent">{isHebrew ? 'נשלח' : 'Sent'}</option>
                      <option value="approved">{isHebrew ? 'אושר' : 'Approved'}</option>
                      <option value="paid">{isHebrew ? 'שולם' : 'Paid'}</option>
                    </select>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '10px' }}>{isHebrew ? 'מספר הצעה' : 'Quote #'}</th>
                        <th style={{ padding: '10px' }}>{isHebrew ? 'לקוח' : 'Client'}</th>
                        <th style={{ padding: '10px' }}>{t.status}</th>
                        <th style={{ padding: '10px' }}>{t.total}</th>
                        <th style={{ padding: '10px' }}>{t.validUntil}</th>
                        <th style={{ padding: '10px' }}>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuotes.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                            {quotes.length === 0 
                              ? (isHebrew ? 'לא נמצאו הצעות מחיר במסד הנתונים.' : 'No quotes found in the database.') 
                              : (isHebrew ? 'לא נמצאו תוצאות לחיפוש הנוכחי.' : 'No results found for this search.')}
                          </td>
                        </tr>
                      ) : (
                        filteredQuotes.map((quote) => {
                          const quoteSym = isLocalIsraeliBusiness ? '₪' : getCurrencySymbol(quote.currency);
                          const currentStatus = quote.status ? quote.status.toLowerCase() : 'draft';
                          return (
                            <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                              <td style={{ padding: '10px', fontWeight: '600', color: '#4f46e5' }}>#{quote.id.slice(0, 6)}</td>
                              <td style={{ padding: '10px' }}>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{quote.clients?.company_name || 'N/A'}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>{quote.clients?.email}</div>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <select
                                  value={currentStatus}
                                  onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    background: currentStatus === 'approved' ? '#dcfce7' : currentStatus === 'paid' ? '#dbeafe' : currentStatus === 'sent' ? '#fef9c3' : '#f1f5f9',
                                    color: currentStatus === 'approved' ? '#166534' : currentStatus === 'paid' ? '#1e40af' : currentStatus === 'sent' ? '#854d0e' : '#475569',
                                    border: '1px solid #cbd5e1',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="draft">{isHebrew ? 'טיוטה' : 'Draft'}</option>
                                  <option value="sent">{isHebrew ? 'נשלח' : 'Sent'}</option>
                                  <option value="approved">{isHebrew ? 'אושר' : 'Approved'}</option>
                                  <option value="paid">{isHebrew ? 'שולם' : 'Paid'}</option>
                                </select>
                              </td>
                              <td style={{ padding: '10px', fontWeight: '600', color: '#1e293b' }}>
                                {quoteSym}{formatNum(quote.total)}
                              </td>
                              <td style={{ padding: '10px', color: '#64748b' }}>{quote.valid_until || '-'}</td>
                              <td style={{ padding: '8px', display: 'flex', gap: '5px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', justifyContent: isHebrew ? 'flex-start' : 'flex-end' }}>
                                <button 
                                  title={t.edit}
                                  onClick={() => handleEditClick(quote)}
                                  style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}
                                >
                                  {t.edit}
                                </button>
                                <button 
                                  title={t.duplicate}
                                  onClick={() => handleDuplicateQuote(quote)}
                                  style={{ background: '#ccfbf1', color: '#115e59', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}
                                >
                                  {t.duplicate}
                                </button>
                                <button 
                                  title="שלח בוואטסאפ"
                                  onClick={() => sendWhatsApp(quote)}
                                  style={{ background: '#d1fae5', color: '#065f46', border: 'none', padding: '5px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                  <svg style={{ width: '16px', height: '16px', fill: '#065f46' }} viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                  </svg>
                                </button>
                                <button 
                                  title="שלח אימייל"
                                  onClick={() => handleEmailQuote(quote)}
                                  style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}
                                >
                                  @
                                </button>
                                <button 
                                  title={t.delete}
                                  onClick={() => handleDeleteQuote(quote.id)}
                                  style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}
                                >
                                  {t.delete}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, marginBottom: '20px' }}>{t.servicesCatalog}</h2>
                
                <form onSubmit={handleAddService} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder={t.serviceName} 
                    value={newServiceName} 
                    onChange={(e) => setNewServiceName(e.target.value)} 
                    required 
                    style={{ flex: '2 1 180px', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.9rem', background: '#eff6ff' }} 
                  />
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder={t.defaultPrice} 
                    value={newServicePrice} 
                    onChange={(e) => setNewServicePrice(e.target.value)} 
                    required 
                    style={{ flex: '1 1 100px', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '0.9rem', background: '#eff6ff' }} 
                  />
                  <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
                    {t.addService}
                  </button>
                </form>

                <div style={{ overflowX: 'auto' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '350px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '10px' }}>{t.description}</th>
                        <th style={{ padding: '10px' }}>{t.defaultPrice}</th>
                        <th style={{ padding: '10px' }}>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                            {isHebrew ? 'הקטלוג שלך ריק. הוסף שירותים למעלה.' : 'Your catalog is empty. Add services above.'}
                          </td>
                        </tr>
                      ) : (
                        services.map((svc) => (
                          <tr key={svc.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                            <td style={{ padding: '10px', fontWeight: '600', color: '#1e293b' }}>{svc.name}</td>
                            <td style={{ padding: '10px', color: '#4f46e5', fontWeight: '600' }}>{formatNum(svc.price)}</td>
                            <td style={{ padding: '10px' }}>
                               <button 
                            title={t.delete}
                            onClick={() => handleDeleteService(svc.id)}
                            style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}
                            >
                              {t.delete}
                            </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* מראה את טופס היצירה / עריכה רק כאשר המשתמש לוחץ על יצירה או עריכה */}
          {activeTab === 'main' && showQuoteForm && (
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', border: editingQuoteId ? '2px solid #4f46e5' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h2 style={{ color: '#1e293b', marginTop: 0, fontSize: '1.2rem', marginBottom: '4px' }}>
                      {editingQuoteId ? `${isHebrew ? 'עריכת הצעה #' : 'Editing Quote #'}${editingQuoteId.slice(0, 6)}` : (isHebrew ? 'יצירת הצעת מחיר חדשה' : 'Create New Quote')}
                    </h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>
                      {isHebrew ? 'הזן את פרטי ההצעה ושמור את השינויים' : 'Enter the quote details and save changes'}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    {isHebrew ? 'ביטול וחזרה לרשימה' : 'Cancel & Return'}
                  </button>
                </div>

                <form onSubmit={handleSaveQuote}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.clientName}</label>
                      <input type="text" name="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Acme Corp" required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', background: '#eff6ff' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'סוג לקוח (חובה)' : 'Client Type'}</label>
                      <select 
                        name="clientType" 
                        value={clientType} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setClientType(val);
                          e.target.setCustomValidity('');
                          if (val === 'private') setTerms('');
                        }} 
                        onInvalid={(e) => e.target.setCustomValidity(isHebrew ? 'בחר סוג לקוח' : 'Select client type')}
                        onInput={(e) => e.target.setCustomValidity('')}
                        required 
                        style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#eff6ff', boxSizing: 'border-box' }}
                      >
                        <option value="" disabled>{isHebrew ? 'בחר סוג לקוח...' : 'Select Client Type...'}</option>
                        <option value="business">{isHebrew ? 'עסקי (חברה/עוסק)' : 'Business'}</option>
                        <option value="private">{isHebrew ? 'פרטי (B2C)' : 'Private'}</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.clientEmail}</label>
                      <input type="email" name="clientEmail" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="contact@acme.com" required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#eff6ff' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.clientPhone}</label>
                      <input type="text" name="clientPhone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+1 (555) 0192" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#eff6ff' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'ח.פ / עוסק / ת.ז' : 'Tax ID / ID'}</label>
                      <input type="text" name="clientTaxId" value={clientTaxId} onChange={(e) => setClientTaxId(e.target.value)} placeholder={isHebrew ? "לדוגמה: 512345678" : "e.g. 512345678"} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left', background: '#eff6ff' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'כתובת' : 'Address'}</label>
                      <input type="text" name="clientAddress" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder={isHebrew ? "רחוב, עיר, מיקוד" : "123 Main St, City"} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', background: '#eff6ff' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.currency}</label>
                      <select name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#eff6ff', boxSizing: 'border-box' }}>
                        {isLocalIsraeliBusiness ? (
                          <option value="ILS">ILS (₪)</option>
                        ) : (
                          <>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.status}</label>
                      <select name="quoteStatus" value={quoteStatus} onChange={(e) => setQuoteStatus(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#eff6ff', boxSizing: 'border-box' }}>
                        <option value="Draft">{isHebrew ? 'טיוטה' : 'Draft'}</option>
                        <option value="Sent">{isHebrew ? 'נשלח' : 'Sent'}</option>
                        <option value="Approved">{isHebrew ? 'אושר' : 'Approved'}</option>
                        <option value="Paid">{isHebrew ? 'שולם' : 'Paid'}</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.validUntil}</label>
                      <input type="date" name="validUntil" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', background: '#eff6ff' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.discount}</label>
                      <input type="number" name="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} min="0" max="100" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', background: '#eff6ff' }} />
                    </div>
                  </div>

                  {clientType === 'business' && (
                    <div style={{ marginBottom: '25px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'תנאי תשלום (חובה לעסקי)' : 'Payment Terms'}</label>
                      <select 
                        name="terms" 
                        value={terms} 
                        onChange={(e) => {
                          setTerms(e.target.value);
                          e.target.setCustomValidity('');
                        }} 
                        onInvalid={(e) => e.target.setCustomValidity(isHebrew ? 'בחר תנאי תשלום' : 'Select payment terms')}
                        onInput={(e) => e.target.setCustomValidity('')}
                        required 
                        style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#eff6ff', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }}
                      >
                        <option value="" disabled>{isHebrew ? 'בחר תנאי תשלום...' : 'Select terms...'}</option>
                        <option value={isHebrew ? "תשלום בגמר העבודה" : "Payment on completion"}>{isHebrew ? "תשלום בגמר העבודה" : "Payment on completion"}</option>
                        <option value={isHebrew ? "30 יום מגמר העבודה" : "Net 30 days"}>{isHebrew ? "30 יום מגמר העבודה" : "Net 30 days"}</option>
                        <option value={isHebrew ? "שוטף 30" : "EOM + 30 days"}>{isHebrew ? "שוטף 30" : "EOM + 30 days"}</option>
                        {terms && !["תשלום בגמר העבודה", "30 יום מגמר העבודה", "שוטף 30", "Payment on completion", "Net 30 days", "EOM + 30 days"].includes(terms) && (
                          <option value={terms}>{terms}</option>
                        )}
                      </select>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: 0 }}>{t.quoteItems}</h3>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                      <select onChange={handleAddFromCatalog} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#eff6ff', fontSize: '0.85rem' }}>
                        <option value="">{t.quickAdd}</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - {sym}{formatNum(s.price)}</option>
                        ))}
                      </select>
                      <button type="button" onClick={addItem} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>{t.addItem}</button>
                    </div>
                  </div>

                  {/* כותרות עמודות פריטי ההצעה מתוקנות */}
                  <div style={{ display: 'grid', gridTemplateColumns: items.length > 1 ? '2fr 1fr 1fr 1fr 40px' : '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '6px', padding: '0 10px', fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>
                    <div>{isHebrew ? 'תיאור פריט' : 'Description'}</div>
                    <div>{isHebrew ? 'כמות' : 'Qty'}</div>
                    <div>{isHebrew ? 'מחיר יחידה' : 'Unit Price'}</div>
                    <div>{isHebrew ? 'סה"כ' : 'Total'}</div>
                    {items.length > 1 && <div></div>}
                  </div>

                  {items.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: items.length > 1 ? '2fr 1fr 1fr 1fr 40px' : '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px', alignItems: 'stretch', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                      <input type="text" placeholder={isHebrew ? 'תיאור פריט' : 'Item description'} value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required style={{ padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', background: '#eff6ff', fontSize: '0.9rem', color: '#334155' }} />
                      <input type="number" placeholder={isHebrew ? 'כמות' : 'Qty'} min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required style={{ padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box', background: '#eff6ff', fontSize: '0.9rem', color: '#334155' }} />
                      <input type="number" placeholder={isHebrew ? 'מחיר' : 'Price'} step="0.01" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} required style={{ padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box', background: '#eff6ff', fontSize: '0.9rem', color: '#334155' }} />
                      
                      <div style={{ padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#eff6ff', fontWeight: '600', color: '#334155', textAlign: isHebrew ? 'left' : 'right', fontSize: '0.9rem', boxSizing: 'border-box', width: '100%', display: 'flex', alignItems: 'center', justifyContent: isHebrew ? 'flex-start' : 'flex-end', height: '100%' }}>
                        {sym}{formatNum(Number(item.quantity) * Number(item.unit_price))}
                      </div>

                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '9px 0', borderRadius: '6px', cursor: 'pointer', width: '100%', textAlign: 'center', height: '100%' }}>✕</button>
                      )}
                    </div>
                  ))}

                  <div style={{ borderTop: '2px solid #f1f5f9', marginTop: '20px', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', flexDirection: isHebrew ? 'row-reverse' : 'row', fontSize: '0.9rem' }}>
                      <span>{isHebrew && clientType === 'private' ? (isHebrew ? 'סכום ביניים (כולל מע"מ):' : 'Subtotal (Inc. VAT):') : t.subtotal}</span>
                      <span>{sym}{formatNum(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ef4444', flexDirection: isHebrew ? 'row-reverse' : 'row', fontSize: '0.9rem' }}>
                        <span>{isHebrew ? `הנחה (${discount}%):` : `Discount (${discount}%):`}</span>
                        <span>-{sym}{formatNum(discountAmount)}</span>
                      </div>
                    )}
                    {isHebrew && clientType === 'business' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', flexDirection: isHebrew ? 'row-reverse' : 'row', fontSize: '0.9rem' }}>
                        <span>{t.vat}</span>
                        <span>{sym}{formatNum(taxAmount)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginTop: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                      <span>{t.totalAmount}</span>
                      <span style={{ color: '#4f46e5' }}>{sym}{formatNum(totalAmount)} {isLocalIsraeliBusiness ? '' : (currency === 'EUR' ? 'EUR' : currency === 'GBP' ? 'GBP' : currency === 'USD' ? 'USD' : '')}</span>
                    </div>
                    {isHebrew && clientType === 'private' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                        <span></span>
                        <span>{isHebrew ? `(הסכום כולל מע"מ בסך ${sym}{formatNum(taxAmount)})` : `(Includes VAT: ${sym}{formatNum(taxAmount)})`}</span>
                      </div>
                    )}
                  </div>

                  <button type="submit" style={{ width: '100%', background: editingQuoteId ? '#10b981' : '#2563eb', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} disabled={isTrialExpired && bizRole !== 'super_admin'}>
                    {editingQuoteId ? t.updateQuote : t.generateSave}
                  </button>
                </form>
              </div>
          )}

          {activeTab === 'clients' && (
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#1e293b', marginTop: 0, marginBottom: '20px' }}>
                {isHebrew ? '👥 ניהול לקוחות' : '👥 Clients Management'}
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '450px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px' }}>{isHebrew ? 'שם חברה / לקוח' : 'Company / Name'}</th>
                      <th style={{ padding: '10px' }}>{isHebrew ? 'ח.פ / ת.ז' : 'Tax ID'}</th>
                      <th style={{ padding: '10px' }}>{isHebrew ? 'אימייל' : 'Email'}</th>
                      <th style={{ padding: '10px' }}>{isHebrew ? 'טלפון' : 'Phone'}</th>
                      <th style={{ padding: '10px' }}>{isHebrew ? 'כתובת' : 'Address'}</th>
                      <th style={{ padding: '10px' }}>{isHebrew ? 'סוג לקוח' : 'Type'}</th>
                      <th style={{ padding: '10px' }}>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          {isHebrew ? 'אין לקוחות רשומים במערכת עדיין.' : 'No clients recorded yet.'}
                        </td>
                      </tr>
                    ) : (
                      clients.map((client) => (
                        <tr key={client.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                          <td style={{ padding: '10px', fontWeight: '600', color: '#1e293b' }}>{client.company_name}</td>
                          <td style={{ padding: '10px', color: '#475569' }}>{client.tax_id || '-'}</td>
                          <td style={{ padding: '10px', color: '#475569', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>{client.email || '-'}</td>
                          <td style={{ padding: '10px', color: '#475569', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>{client.phone || '-'}</td>
                          <td style={{ padding: '10px', color: '#475569' }}>{client.address || '-'}</td>
                          <td style={{ padding: '10px', color: '#475569' }}>{client.client_type === 'business' ? (isHebrew ? 'עסקי' : 'Business') : (isHebrew ? 'פרטי' : 'Private')}</td>
                          <td style={{ padding: '10px' }}>
                            <button 
                              onClick={() => handleDeleteClient(client.id)}
                              style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}
                            >
                              {t.delete}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#1e293b', marginTop: 0, marginBottom: '20px' }}>
                {t.businessSettings}
              </h2>
              <form onSubmit={handleSaveSettings}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.businessNameLabel}</label>
                    <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', background: '#eff6ff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.taxIdLabel}</label>
                    <input type="text" value={bizTaxId} onChange={(e) => setBizTaxId(e.target.value)} placeholder="516000000" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#eff6ff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'אימייל עסק' : 'Business Email'}</label>
                    <input type="email" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} placeholder="business@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#eff6ff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'טלפון עסק' : 'Business Phone'}</label>
                    <input type="text" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} placeholder="050-0000000" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#eff6ff' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.logoUrlLabel} {bizPlan !== 'pro' && <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>(דורש חבילת Pro)</span>}</label>
                  <input type="url" value={bizLogoUrl} onChange={(e) => setBizLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" disabled={bizPlan !== 'pro'} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: bizPlan !== 'pro' ? '#f1f5f9' : '#eff6ff' }} />
                </div>

                <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  {t.saveSettings}
                </button>
              </form>
            </div>
          )}

          {bizRole === 'super_admin' && activeTab === 'finances' && (
             <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '2px solid #4f46e5' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#1e293b', margin: 0 }}>📊 {isHebrew ? 'הוצאות והכנסות ודוחות עסק' : 'Finances & Reports'}</h2>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>{isHebrew ? 'סוג דוח:' : 'Report Type:'}</span>
                      <select 
                        value={financeReportType} 
                        onChange={(e) => setFinanceReportType(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', fontSize: '0.9rem', fontWeight: 'bold', color: '#4f46e5' }}
                      >
                        <option value="monthly">{isHebrew ? 'חודשי (מתחיל מאפס כל חודש)' : 'Monthly'}</option>
                        <option value="quarterly">{isHebrew ? 'רבעוני (3 חודשים)' : 'Quarterly'}</option>
                        <option value="half-yearly">{isHebrew ? 'חצי שנתי (6 חודשים)' : 'Half-Yearly'}</option>
                        <option value="yearly">{isHebrew ? 'שנתי (12 חודשים)' : 'Yearly'}</option>
                        <option value="custom">{isHebrew ? 'בחירת טווח תאריכים אישי' : 'Custom Date Range'}</option>
                      </select>
                    </div>
                 </div>

                 {financeReportType === 'custom' && (
                   <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', border: '1px solid #cbd5e1' }}>
                     <div>
                       <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>{isHebrew ? 'מתאריך:' : 'Start Date:'}</label>
                       <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#eff6ff' }} />
                     </div>
                     <div>
                       <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>{isHebrew ? 'עד תאריך:' : 'End Date:'}</label>
                       <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#eff6ff' }} />
                     </div>
                   </div>
                 )}

                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #4f46e5' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #4f46e5' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.totalQuotes}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{adminTotalQuotesCount}</div>
                  </div>
                  <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #22c55e' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #22c55e' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.totalRevenue}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{sym}{formatNum(adminTotalRevenue)}</div>
                  </div>
                  <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #ef4444' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #ef4444' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.totalExpenses}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{sym}{formatNum(adminTotalExpenses)}</div>
                  </div>
                  <div style={{ background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #3b82f6' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #3b82f6' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.netProfit}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: adminNetProfit >= 0 ? '#3b82f6' : '#ef4444' }}>{sym}{formatNum(adminNetProfit)}</div>
                  </div>
                 </div>

                 <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', height: '350px' }} dir="ltr">
                   <h2 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0, marginBottom: '20px', textAlign: isHebrew ? 'right' : 'left' }}>{isHebrew ? 'סקירה שנתית - הכנסות מול הוצאות' : 'Yearly Overview - Income vs Expenses'}</h2>
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="name" />
                       <YAxis />
                       <Tooltip formatter={(value) => `${sym}${formatNum(value)}`} />
                       <Legend wrapperStyle={{ paddingTop: '10px' }} />
                       <Bar dataKey={isHebrew ? 'הכנסות' : 'Income'} fill="#22c55e" radius={[4, 4, 0, 0]} />
                       <Bar dataKey={isHebrew ? 'הוצאות' : 'Expenses'} fill="#ef4444" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>

                 <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                      <h2 style={{ fontSize: '1.1rem', color: '#1e293b', margin: 0 }}>{t.expensesManagement}</h2>
                      <button 
                        onClick={handleExportExpenses}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                      >
                        📥 {isHebrew ? 'ייצא הוצאות לאקסל (CSV)' : 'Export Expenses CSV'}
                      </button>
                    </div>

                    <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder={isHebrew ? 'תיאור ההוצאה (לדוגמה: אירוח שרת)' : 'Expense description'} 
                        value={expenseDesc} 
                        onChange={(e) => setExpenseDesc(e.target.value)} 
                        required 
                        style={{ flex: '2 1 180px', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.9rem', background: '#eff6ff' }} 
                      />
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder={isHebrew ? 'סכום' : 'Amount'} 
                        value={expenseAmount} 
                        onChange={(e) => setExpenseAmount(e.target.value)} 
                        required 
                        style={{ flex: '1 1 90px', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', fontSize: '0.9rem', background: '#eff6ff' }} 
                      />
                      <select 
                        value={expenseCategory} 
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        style={{ flex: '1 1 130px', padding: '9px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#eff6ff', boxSizing: 'border-box', fontSize: '0.9rem' }}
                      >
                        <option value="Hosting / Cloud">{isHebrew ? 'ענן ושרתים' : 'Hosting / Cloud'}</option>
                        <option value="Marketing">{isHebrew ? 'שיווק ופרסום' : 'Marketing'}</option>
                        <option value="Tools / Software">{isHebrew ? 'כלים ותוכנות' : 'Tools / Software'}</option>
                        <option value="Other">{isHebrew ? 'אחר' : 'Other'}</option>
                      </select>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
                        <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />
                        {isHebrew ? 'הוצאה חודשית קבועה' : 'Recurring monthly'}
                      </label>

                      <button type="submit" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
                        {t.addExpenseBtn}
                      </button>
                    </form>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '400px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '10px' }}>{t.description}</th>
                            <th style={{ padding: '10px' }}>{isHebrew ? 'קטגוריה' : 'Category'}</th>
                            <th style={{ padding: '10px' }}>{isHebrew ? 'סוג' : 'Type'}</th>
                            <th style={{ padding: '10px' }}>{isHebrew ? 'תאריך' : 'Date'}</th>
                            <th style={{ padding: '10px' }}>{t.total}</th>
                            <th style={{ padding: '10px' }}>{t.actions}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredExpensesForReport.length === 0 ? (
                            <tr>
                              <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                                {isHebrew ? 'אין הוצאות בתקופה הנבחרת.' : 'No expenses in this period.'}
                              </td>
                            </tr>
                          ) : (
                            filteredExpensesForReport.map((exp) => (
                              <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                                <td style={{ padding: '10px', fontWeight: '600', color: '#1e293b' }}>{exp.description}</td>
                                <td style={{ padding: '10px', color: '#64748b' }}>{exp.category}</td>
                                <td style={{ padding: '10px', color: '#64748b' }}>
                                  {exp.is_recurring ? (isHebrew ? '🔄 קבועה' : 'Recurring') : (isHebrew ? 'חד פעמית' : 'One-time')}
                                </td>
                                <td style={{ padding: '10px', color: '#64748b' }}>{exp.expense_date}</td>
                                <td style={{ padding: '10px', color: '#ef4444', fontWeight: '600' }}>{sym}{formatNum(exp.amount)}</td>
                                <td style={{ padding: '10px' }}>
                                  <button 
                                    onClick={() => handleDeleteExpense(exp.id)}
                                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}
                                  >
                                    {t.delete}
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                 </div>
             </div>
          )}

          {bizRole === 'super_admin' && activeTab === 'admin_clients' && (
            <div style={{ background: '#fef3c7', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '2px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '1.2rem', color: '#92400e', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  👑 Super Admin - Users
                </h2>
              </div>
              <p style={{ color: '#b45309', marginBottom: '20px', fontSize: '0.9rem' }}>
                {isHebrew ? 'כאן תוכל לראות את כל המשתמשים הרשומים במערכת ולנהל את החבילות שלהם.' : 'View all registered users and manage their subscription plans.'}
              </p>

              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder={isHebrew ? "חיפוש משתמש (אימייל או שם עסק)..." : "Search user (email or business)..."} 
                  value={adminSearchTerm}
                  onChange={(e) => setAdminSearchTerm(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #d97706', borderRadius: '6px', width: '280px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.9rem', background: '#eff6ff' }}
                />
              </div>
              
              <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #fde68a', color: '#92400e', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('email')}>
                        Email {sortField === 'email' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('business_name')}>
                        Business Name {sortField === 'business_name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('country')}>
                        Region / Country {sortField === 'country' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('plan')}>
                        Current Plan {sortField === 'plan' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('role')}>
                        Role {sortField === 'role' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('trial_ends_at')}>
                        Trial Ends {sortField === 'trial_ends_at' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('last_sign_in')}>
                        Last Sign In {sortField === 'last_sign_in' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdminAccounts.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#92400e' }}>
                          {isHebrew ? 'לא נמצאו משתמשים התואמים לחיפוש.' : 'No users found matching your search.'}
                        </td>
                      </tr>
                    ) : (
                      filteredAdminAccounts.map(acc => (
                        <tr key={acc.id} style={{ borderBottom: '1px solid #fef3c7', fontSize: '0.9rem' }}>
                          <td style={{ padding: '10px', color: '#92400e', fontSize: '0.8rem' }}>{acc.user_id?.slice(0,8)}...</td>
                          <td style={{ padding: '10px', fontWeight: 'bold' }}>{acc.email || 'N/A'}</td>
                          <td style={{ padding: '10px' }}>{acc.business_name}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{
                              background: acc.country === 'Israel (Local)' ? '#dbeafe' : '#dcfce7',
                              color: acc.country === 'Israel (Local)' ? '#1e40af' : '#166534',
                              padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'
                            }}>
                              {acc.country || 'Israel (Local)'}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <select 
                              value={acc.plan} 
                              onChange={(e) => handleAdminPlanChange(acc.id, e.target.value)}
                              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #d97706', background: '#fffbeb', fontSize: '0.85rem' }}
                            >
                              <option value="free">Free</option>
                              <option value="basic">Basic</option>
                              <option value="pro">Pro</option>
                            </select>
                          </td>
                          <td style={{ padding: '10px', color: acc.role === 'super_admin' ? '#ef4444' : '#64748b', fontWeight: 'bold' }}>
                            {acc.role}
                          </td>
                          <td style={{ padding: '10px', fontSize: '0.85rem', color: '#475569', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>
                            {acc.trial_ends_at ? (
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: isHebrew ? 'flex-start' : 'flex-end' }}>
                                <span>{new Date(acc.trial_ends_at).toLocaleDateString('en-GB')}</span>
                                <button 
                                  onClick={() => handleMakeLifetime(acc.id)} 
                                  title={isHebrew ? "הפוך למנוי לכל החיים (בטל תאריך תפוגה)" : "Make Lifetime (Remove expiration)"}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: 0 }}
                                >
                                  ♾️
                                </button>
                              </div>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '10px', fontSize: '0.85rem', color: '#475569', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>
                            {acc.last_sign_in ? new Date(acc.last_sign_in).toLocaleString('en-GB') : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      <footer className="no-print" style={{ textAlign: 'center', padding: '20px', marginTop: '40px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
        <p style={{ margin: '0 0 5px 0' }}>
          Powered by <strong>ProFlow</strong> - {isHebrew ? 'מערכת ניהול עסק והצעות מחיר' : 'Business & Quoting Platform'}
        </p>
        <button onClick={() => setShowAccessibility(true)} style={{ background: 'none', border: 'none', color: '#4f46e5', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
          {isHebrew ? 'הצהרת נגישות' : 'Accessibility Statement'}
        </button>
      </footer>
    </div>
  );
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