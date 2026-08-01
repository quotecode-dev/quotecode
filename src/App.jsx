import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { supabase } from './supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './App.css';

const DEFAULT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyODUgMTAwIiB3aWR0aD0iMjg1IiBoZWlnaHQ9IjEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGY0NmU1Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTE1IDUwIEw0NSAyMCBMNjAgMzUgTDQwIDU1IEw2MCA3NSBMNDUgOTAgWiIgZmlsbD0idXJsKCNnKSIvPjxwYXRoIGQ9Ik00MCA1MCBMNzggMjAgTDg1IDM1IEw2NSA1NSBMODUgNzUgTDcwIDkwIFoiIGZpbGw9IiMxZTI5M2IiIG9wYWNpdHk9IjAuOSIvPjx0ZXh0IHg9IjEwNSIgeT0iNjYiIGZvbnQtZmFtaWx5PSJTZWdvZSBVSSwgU2Fucy1zZXJpZiIgZm9udC1zaXplPSI0NCIgZm9udC13ZWlnaHQ9IjkwMCIgZmlsbD0iIzFlMjkzYiI+UHJvPHRzcGFuIGZpbGw9IiM0ZjQ2ZTUiPkZsb3c8L3RzcGFuPjwvdGV4dD48L3N2Zz4=";

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

function PublicQuote() {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approvedSuccess, setApprovedSuccess] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [lang, setLang] = useState(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const navLang = navigator.language || '';
    return (navLang.startsWith('he') || tz === 'Asia/Jerusalem') ? 'he' : 'en';
  });
  const isHebrew = lang === 'he';

  useEffect(() => {
    async function fetchData() {
      const { data: quoteData } = await supabase
        .from('quotes')
        .select(`*, clients ( company_name, email, phone, client_type ), quote_items ( * )`)
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
  const bizName = settings?.business_name || 'ProFlow';
  const bizTaxId = settings?.tax_id || '';
  const bizEmail = settings?.email || '';
  const bizPhone = settings?.phone || '';
  const isProPlan = settings?.plan === 'pro';
  const bizLogo = isProPlan ? (settings?.logo_url || '') : '';

  const getCurrencySymbol = (curr) => {
    if (!curr) return '₪';
    if (curr.includes('EUR')) return '€';
    if (curr.includes('GBP')) return '£';
    if (curr.includes('USD')) return '$';
    return '₪';
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
            <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
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
              {bizLogo ? (
                <img src={bizLogo} alt="Business Logo" style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain', marginBottom: '8px', display: 'block' }} crossOrigin="anonymous" />
              ) : (
                <img src={DEFAULT_LOGO} alt="ProFlow" style={{ height: '40px', marginBottom: '8px', display: 'block' }} crossOrigin="anonymous" />
              )}
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
            <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '15px' }}>{quote.clients?.email || ''}</p>
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
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{isHebrew ? `(הסכום כולל מע"מ בסך ${quoteSym}${formatNum(quoteTaxAmount)})` : `(Includes VAT: ${quoteSym}${formatNum(quoteTaxAmount)})`}</div>
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
            <div style={{ textAlign: isHebrew ? 'right' : 'left' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>{isHebrew ? 'תנאים והגבלות' : 'Terms & Conditions'}</p>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{isHebrew ? 'שוטף + 30. תודה על העסקאות.' : 'Net 30 days. Thank you for your business.'}</p>
            </div>

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
  const isIsraelZone = Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Jerusalem';
  const browserLang = navigator.language || '';
  const isHebrew = browserLang.startsWith('he') || isIsraelZone;

  const defaultCurrency = isHebrew ? 'ILS (₪)' : 'USD ($)';

  const [session, setSession] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: 'System connected to Supabase.', type: 'success' });

  const [settingId, setSettingId] = useState(null);
  const [bizName, setBizName] = useState('ProFlow');
  const [bizTaxId, setBizTaxId] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizLogoUrl, setBizLogoUrl] = useState('');
  const [bizPlan, setBizPlan] = useState('free');
  const [bizRole, setBizRole] = useState('user');
  const [trialEndsAt, setTrialEndsAt] = useState(null);
  const [allAccounts, setAllAccounts] = useState([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  
  const [sortField, setSortField] = useState('email');
  const [sortDirection, setSortDirection] = useState('asc');

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] = useState(null);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientType, setClientType] = useState('');
  
  const [currency, setCurrency] = useState(defaultCurrency);
  const [quoteStatus, setQuoteStatus] = useState('Draft');
  const [validUntil, setValidUntil] = useState('');
  const [discount, setDiscount] = useState(0);
  const [terms, setTerms] = useState('Net 30 days. Thank you for your business.');
  
  const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: 0 }]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  const t = {
    appName: bizName || 'ProFlow',
    appSub: isHebrew ? 'מערכת ניהול עסק והצעות מחיר גלובלית' : 'Global SaaS Business & Quoting Platform',
    totalQuotes: isHebrew ? 'סך הכל הצעות' : 'TOTAL QUOTES',
    approvedPaid: isHebrew ? 'אושר / שולם' : 'APPROVED / PAID',
    winRate: isHebrew ? 'אחוז הצלחה' : 'WIN RATE',
    totalRevenue: isHebrew ? 'סך הכנסות' : 'TOTAL REVENUE',
    analyticsTitle: isHebrew ? '📊 סיכום ומדדים עסקיים' : '📊 Business Analytics & Summary',
    pendingQuotes: isHebrew ? 'הצעות ממתינות לטיפול (טיוטה/נשלח)' : 'Pending Quotes',
    topClient: isHebrew ? 'לקוח מוביל' : 'Top Client',
    clientName: isHebrew ? 'שם הלקוח' : 'Client Name',
    clientEmail: isHebrew ? 'אימייל הלקוח' : 'Client Email',
    clientPhone: isHebrew ? 'טלפון הלקוח' : 'Client Phone',
    currency: isHebrew ? 'מטבע' : 'Currency',
    status: isHebrew ? 'סטטוס' : 'Status',
    validUntil: isHebrew ? 'בתוקף עד' : 'Valid Until',
    discount: isHebrew ? 'הנחה (%)' : 'Discount (%)',
    terms: isHebrew ? 'תנאים / הערות' : 'Terms / Notes',
    quoteItems: isHebrew ? 'פריטי ההצעה' : 'Quote Items',
    addItem: isHebrew ? '+ הוסף פריט ידנית' : '+ Add Custom Item',
    quickAdd: isHebrew ? 'בחר שירות מהקטלוג...' : 'Choose from catalog...',
    description: isHebrew ? 'תיאור' : 'Description',
    qty: isHebrew ? 'כמות' : 'Qty',
    price: isHebrew ? 'מחיר' : 'Price',
    total: isHebrew ? 'סה"כ' : 'Total',
    subtotal: isHebrew ? 'סכום ביניים:' : 'Subtotal:',
    vat: isHebrew ? 'מע"מ (18%):' : 'VAT (18%):',
    totalAmount: isHebrew ? 'סה"כ לתשלום:' : 'Total Amount:',
    generateSave: isHebrew ? 'הפק ושמור בענן' : 'Generate & Save to Cloud',
    updateQuote: isHebrew ? 'עדכן הצעה בענן' : 'Update Quote in Cloud',
    cancelEdit: isHebrew ? 'ביטול עריכה' : 'Cancel Edit',
    recentHistory: isHebrew ? 'היסטוריית הצעות מחיר' : 'Recent Quotes History',
    servicesCatalog: isHebrew ? 'קטלוג שירותים ומוצרים' : 'Services & Products Catalog',
    businessSettings: isHebrew ? 'הגדרות עסק וחבילה' : 'Business Settings & Plan',
    saveSettings: isHebrew ? 'שמור הגדרות עסק' : 'Save Business Settings',
    businessNameLabel: isHebrew ? 'שם העסק' : 'Business Name',
    taxIdLabel: isHebrew ? 'ח.פ / עוסק מורשה / פטור' : 'Tax ID / Lic No',
    logoUrlLabel: isHebrew ? 'כתובת תמונת לוגו (URL)' : 'Logo Image URL',
    planLabel: isHebrew ? 'סוג חבילה (Plan)' : 'Subscription Plan',
    addService: isHebrew ? 'הוסף לקטלוג' : 'Add to Catalog',
    serviceName: isHebrew ? 'שם השירות / המוצר' : 'Service Name',
    defaultPrice: isHebrew ? 'מחיר קבוע' : 'Default Price',
    searchQuote: isHebrew ? 'חיפוש שם לקוח או מס׳ הצעה...' : 'Search client or quote #...',
    filterStatus: isHebrew ? 'כל הסטטוסים' : 'All Statuses',
    actions: isHebrew ? 'פעולות' : 'Actions',
    edit: isHebrew ? 'ערוך' : 'Edit',
    duplicate: isHebrew ? 'שכפל' : 'Duplicate',
    pdfPrint: 'PDF',
    sendEmail: isHebrew ? 'שלח למייל' : 'Send via Email',
    sendWhatsApp: isHebrew ? 'שלח בוואטסאפ' : 'Send via WhatsApp',
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
    await fetchSettings();
  }

  async function fetchQuotes() {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from('quotes')
      .select(`*, clients ( company_name, email, phone, client_type ), quote_items ( * )`)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching quotes:', error.message);
    else setQuotes(data || []);
  }

  async function fetchClients() {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from('clients')
      .select('id, company_name, email, phone, client_type, created_at')
      .eq('user_id', session.user.id);
    if (error) console.error('Error fetching clients:', error.message);
    else setClients(data || []);
  }

  async function fetchServices() {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    if (error) console.error('Error fetching services:', error.message);
    else setServices(data || []);
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
      setTrialEndsAt(data.trial_ends_at || null);
      
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
        setTrialEndsAt(null);
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

  async function handleClaimFreeTrial(e) {
    e.preventDefault();
    if (!settingId) {
      setStatusMsg({ text: isHebrew ? 'אנא שמור את הגדרות העסק תחילה.' : 'Please save business settings first.', type: 'error' });
      return;
    }

    const targetPlan = selectedPlanToUpgrade || 'pro';
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);
    const trialEndDateStr = trialEndDate.toISOString();

    const { error } = await supabase
      .from('business_settings')
      .update({ plan: targetPlan, trial_ends_at: trialEndDateStr })
      .eq('id', settingId);

    if (error) {
      setStatusMsg({ text: 'Error upgrading plan: ' + error.message, type: 'error' });
    } else {
      setBizPlan(targetPlan);
      setTrialEndsAt(trialEndDateStr);
      setShowUpgradeModal(false);
      setSelectedPlanToUpgrade(null);
      setStatusMsg({ 
        text: isHebrew 
          ? `🎉 שודרגת בהצלחה לחבילת ${targetPlan.toUpperCase()} לחודש ניסיון בחינם!` 
          : `🎉 Successfully upgraded to ${targetPlan.toUpperCase()} for a 1-month free trial!`, 
        type: 'success' 
      });
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

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email: emailInput, password: passwordInput });
      if (error) {
        setStatusMsg({ text: error.message, type: 'error' });
      } else {
        setStatusMsg({ text: isHebrew ? 'ההרשמה הצליחה! המערכת יוצרת כעת פרופיל משתמש...' : 'Sign up successful! Initializing user profile...', type: 'success' });
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passwordInput });
      if (error) setStatusMsg({ text: error.message, type: 'error' });
      else setStatusMsg({ text: isHebrew ? 'התחברת בהצלחה' : 'Logged in successfully', type: 'success' });
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

  async function handleStatusChange(quoteId, newStatus) {
    const { error } = await supabase.from('quotes').update({ status: newStatus.toLowerCase() }).eq('id', quoteId);
    if (error) {
      setStatusMsg({ text: 'Error updating status: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: isHebrew ? 'סטטוס ההצעה עודכן בהצלחה!' : 'Quote status updated successfully!', type: 'success' });
      fetchQuotes();
    }
  }

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
  const approvedPaidCount = quotes.filter(q => q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid').length;
  const pendingQuotesCount = quotes.filter(q => q.status?.toLowerCase() === 'draft' || q.status?.toLowerCase() === 'sent').length;
  const winRate = totalQuotesCount > 0 ? Math.round((approvedPaidCount / totalQuotesCount) * 100) : 0;
  const totalRevenue = quotes.filter(q => q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid').reduce((sum, q) => sum + Number(q.total || 0), 0);

  const getCurrencySymbol = (curr) => {
    if (!curr) return '₪';
    if (curr.includes('EUR')) return '€';
    if (curr.includes('GBP')) return '£';
    if (curr.includes('USD')) return '$';
    return '₪';
  };
  const sym = getCurrencySymbol(currency);

  const handleEditClick = (quote) => {
    setEditingQuoteId(quote.id);
    setClientName(quote.clients?.company_name || '');
    setClientEmail(quote.clients?.email || '');
    setClientPhone(quote.clients?.phone || '');
    setClientType(quote.client_type || quote.clients?.client_type || '');
    
    if (quote.currency === 'EUR') { setCurrency('EUR (€)'); } 
    else if (quote.currency === 'GBP') { setCurrency('GBP (£)'); } 
    else if (quote.currency === 'USD') { setCurrency('USD ($)'); } 
    else { setCurrency(isHebrew ? 'ILS (₪)' : 'USD ($)'); }

    setQuoteStatus(quote.status ? quote.status.charAt(0).toUpperCase() + quote.status.slice(1) : 'Draft');
    setValidUntil(quote.valid_until || '');
    setDiscount(quote.discount || 0); 
    
    if (quote.quote_items && quote.quote_items.length > 0) {
      setItems(quote.quote_items.map(item => ({ description: item.description, quantity: item.quantity, unit_price: item.unit_price })));
    } else {
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMsg({ text: `Editing Quote #${quote.id.slice(0, 6)}...`, type: 'success' });
  };

  const handleDuplicateQuote = (quote) => {
    setEditingQuoteId(null); 
    setClientName(quote.clients?.company_name || '');
    setClientEmail(quote.clients?.email || '');
    setClientPhone(quote.clients?.phone || '');
    setClientType(quote.client_type || quote.clients?.client_type || '');
    
    if (quote.currency === 'EUR') { setCurrency('EUR (€)'); } 
    else if (quote.currency === 'GBP') { setCurrency('GBP (£)'); } 
    else if (quote.currency === 'USD') { setCurrency('USD ($)'); } 
    else { setCurrency(isHebrew ? 'ILS (₪)' : 'USD ($)'); }

    setQuoteStatus('Draft');
    setValidUntil(quote.valid_until || '');
    setDiscount(quote.discount || 0);
    
    if (quote.quote_items && quote.quote_items.length > 0) {
      setItems(quote.quote_items.map(item => ({ description: item.description, quantity: item.quantity, unit_price: item.unit_price })));
    } else {
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMsg({ text: isHebrew ? 'ההצעה נטענה לשכפול בהצלחה.' : 'Quote loaded for duplication.', type: 'success' });
  };

  const handleEmailQuote = (quote) => {
    if (!quote.clients?.email) {
      alert(isHebrew ? 'ללקוח זה אין כתובת אימייל מעודכנת.' : 'This client does not have an email address.');
      return;
    }

    const quoteSym = getCurrencySymbol(quote.currency);
    const qIsPrivate = quote.client_type === 'private';
    const quoteSub = quote.subtotal || quote.quote_items?.reduce((sum, item) => sum + Number(item.total_price || 0), 0) || 0;
    const quoteDiscountAmount = (quoteSub * (quote.discount || 0)) / 100;
    const qBaseAmount = quoteSub - quoteDiscountAmount;
    const quoteTaxRate = (quote.tax_rate !== undefined && quote.tax_rate !== null) ? Number(quote.tax_rate) : (isHebrew ? 0.18 : 0.00);
    const hasVat = quoteTaxRate > 0;
    
    let qTotalAmount = 0;
    if (hasVat && qIsPrivate) {
      qTotalAmount = qBaseAmount;
    } else {
      qTotalAmount = qBaseAmount + (qBaseAmount * quoteTaxRate);
    }
    
    const quoteTotal = quote.total > qBaseAmount ? quote.total : qTotalAmount;
    const quoteLink = `${window.location.origin}/quote/${quote.id}`;

    const subject = isHebrew ? `הצעת מחיר #${quote.id.slice(0, 6).toUpperCase()} מ-${bizName}` : `Quote #${quote.id.slice(0, 6).toUpperCase()} from ${bizName}`;
    const body = isHebrew
      ? `שלום ${quote.clients?.company_name || ''},\n\nמצורפת הצעת המחיר שלך.\nסך הכל לתשלום: ${quoteSym}${formatNum(quoteTotal)}\n\nלצפייה בהצעה המלאה והורדה כ-PDF לחץ כאן:\n${quoteLink}\n\nבברכה,\nצוות ${bizName}`
      : `Hello ${quote.clients?.company_name || ''},\n\nPlease find your quote details below.\nTotal Amount: ${quoteSym}${formatNum(quoteTotal)}\n\nView and download your full quote here:\n${quoteLink}\n\nBest regards,\n${bizName} Team`;

    window.location.href = `mailto:${quote.clients.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsAppQuote = (quote) => {
    if (!quote.clients?.phone) {
      setStatusMsg({ text: isHebrew ? 'ללקוח זה אין מספר טלפון מעודכן.' : 'This client does not have a phone number.', type: 'error' });
      return;
    }

    const quoteSym = getCurrencySymbol(quote.currency);
    const qIsPrivate = quote.client_type === 'private';
    const quoteSub = quote.subtotal || quote.quote_items?.reduce((sum, item) => sum + Number(item.total_price || 0), 0) || 0;
    const quoteDiscountAmount = (quoteSub * (quote.discount || 0)) / 100;
    const qBaseAmount = quoteSub - quoteDiscountAmount;
    const quoteTaxRate = (quote.tax_rate !== undefined && quote.tax_rate !== null) ? Number(quote.tax_rate) : (isHebrew ? 0.18 : 0.00);
    const hasVat = quoteTaxRate > 0;
    
    let qTotalAmount = 0;
    if (hasVat && qIsPrivate) {
      qTotalAmount = qBaseAmount;
    } else {
      qTotalAmount = qBaseAmount + (qBaseAmount * quoteTaxRate);
    }
    
    const quoteTotal = quote.total > qBaseAmount ? quote.total : qTotalAmount;
    const quoteLink = `${window.location.origin}/quote/${quote.id}`;

    const msg = isHebrew
      ? `שלום ${quote.clients?.company_name || ''},\nמצורפת הצעת מחיר #${quote.id.slice(0, 6).toUpperCase()}.\n*סך הכל לתשלום:* ${quoteSym}${formatNum(quoteTotal)}\n\nלצפייה בהצעה המלאה והורדה כ-PDF לחץ על הקישור:\n${quoteLink}\n\nנשמח לעמוד לשירותך!`
      : `Hello ${quote.clients?.company_name || ''},\nHere is your quote #${quote.id.slice(0, 6).toUpperCase()}.\n*Total Amount:* ${quoteSym}${formatNum(quoteTotal)}\n\nView and download your full quote here:\n${quoteLink}\n\nThank you for your business!`;

    const phoneNum = quote.clients.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCancelEdit = () => {
    setEditingQuoteId(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientType('');
    setValidUntil('');
    setDiscount(0);
    setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    setStatusMsg({ text: 'Edit cancelled.', type: 'success' });
  };

  async function handleSaveQuote(e) {
    e.preventDefault();
    if (!session?.user?.id) return;

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
      const existingClient = clients.find(c => c.company_name?.toLowerCase() === clientName.toLowerCase());
      
      if (existingClient) {
        clientId = existingClient.id;
        if (clientPhone !== existingClient.phone || clientType !== existingClient.client_type) {
          await supabase.from('clients').update({ phone: clientPhone, client_type: clientType }).eq('id', clientId);
        }
      } else {
        const { data: newClientData, error: clientError } = await supabase.from('clients').insert([{ company_name: clientName, email: clientEmail, phone: clientPhone, client_type: clientType, user_id: session.user.id }]).select();
        if (clientError) throw clientError;
        clientId = newClientData[0].id;
      }

      let dbCurrency = 'USD';
      if (currency.includes('ILS')) dbCurrency = 'ILS';
      else if (currency.includes('EUR')) dbCurrency = 'EUR';
      else if (currency.includes('GBP')) dbCurrency = 'GBP';

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

      setStatusMsg({ text: editingQuoteId ? `Quote #${editingQuoteId.slice(0, 6)} successfully updated!` : `Quote successfully created and saved to cloud! Total: ${sym}${formatNum(totalAmount)}`, type: 'success' });
      setEditingQuoteId(null);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setClientType('');
      setValidUntil('');
      setDiscount(0);
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
      loadData();
    } catch (err) {
      setStatusMsg({ text: 'Error saving quote: ' + err.message, type: 'error' });
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
      <div style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' }} dir={isHebrew ? 'rtl' : 'ltr'}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: isHebrew ? 'right' : 'left' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <img src={DEFAULT_LOGO} alt="ProFlow" style={{ height: '60px', marginBottom: '10px', display: 'block', margin: '0 auto' }} />
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>
              {isSignUp 
                ? (isHebrew ? 'יצירת חשבון חדש במערכת' : 'Create a new account') 
                : (isHebrew ? 'התחברות למערכת הניהול' : 'Sign in to your dashboard')}
            </p>
          </div>
          {statusMsg.text && (
            <div style={{ padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: statusMsg.type === 'success' ? '#166534' : '#991b1b' }}>
              {statusMsg.text}
            </div>
          )}
          <form onSubmit={handleAuth}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'אימייל' : 'Email'}</label>
              <input type="email" name="loginEmail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required placeholder="user@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'סיסמה' : 'Password'}</label>
              <input type="password" name="loginPassword" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
              {isSignUp ? (isHebrew ? 'הירשם' : 'Sign Up') : (isHebrew ? 'התחבר' : 'Sign In')}
            </button>
          </form>
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => { 
                const nextIsSignUp = !isSignUp;
                setIsSignUp(nextIsSignUp); 
                setStatusMsg({ 
                  text: nextIsSignUp 
                    ? (isHebrew ? 'אנא הקלד אימייל וסיסמה כדי ליצור חשבון חדש.' : 'Please enter an email and password to create a new account.')
                    : (isHebrew ? 'אנא הקלד את פרטי ההתחברות שלך.' : 'Please enter your login details.'), 
                  type: 'success' 
                }); 
              }}
              style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
            >
              {isSignUp 
                ? (isHebrew ? 'כבר יש לך חשבון? התחבר כאן' : 'Already have an account? Sign in here') 
                : (isHebrew ? 'אין לך חשבון עדיין? הירשם כאן' : "Don't have an account yet? Sign up here")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} isHebrew={isHebrew} />

      <div style={{ flex: '1 0 auto', padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '25px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
              <img src={DEFAULT_LOGO} alt="ProFlow" style={{ height: '40px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
              {bizRole === 'super_admin' && <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>SUPER ADMIN</span>}
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{session.user.email}</span>
              <button onClick={handleSignOut} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Sign Out</button>
            </div>
          </div>

          {trialEndsAt && !isTrialExpired && bizRole !== 'super_admin' && (
            <div style={{ background: '#eff6ff', border: '1px solid #3b82f6', color: '#1d4ed8', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '500', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
              <span>{isHebrew ? '🚀 תקופת ניסיון פעילה' : '🚀 Active Trial Period'}</span>
              <span>{isHebrew ? `נותרו עוד ${trialDaysLeft} ימים` : `${trialDaysLeft} days remaining`}</span>
            </div>
          )}

          {isTrialExpired && bizRole !== 'super_admin' && (
            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>
              {isHebrew ? '⚠️ תקופת הניסיון שלך הסתיימה. כדי להמשיך להפיק הצעות מחיר, אנא שדרג את החבילה.' : '⚠️ Your trial period has expired. Please upgrade to continue generating quotes.'}
            </div>
          )}

          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #4f46e5' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #4f46e5' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.totalQuotes}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{totalQuotesCount}</div>
              {bizPlan !== 'pro' && (
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '5px', fontWeight: 'bold' }}>
                  {isHebrew ? `נוצרו החודש: ${monthlyQuotesCount} מתוך ${planLimit}` : `This month: ${monthlyQuotesCount} / ${planLimit}`}
                </div>
              )}
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #eab308' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #eab308' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.approvedPaid}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{approvedPaidCount}</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #a855f7' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #a855f7' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.winRate}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a855f7' }}>{winRate}%</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #22c55e' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #22c55e' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.totalRevenue}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22c55e' }}>{sym}{formatNum(totalRevenue)}</div>
            </div>
          </div>

          {/* --- אזור אנליטיקה וסיכומים מתקדמים --- */}
          <div style={{ background: 'white', padding: '20px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', color: '#1e293b', marginTop: 0, marginBottom: '15px' }}>{t.analyticsTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{t.pendingQuotes}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#d97706', marginTop: '5px' }}>{pendingQuotesCount}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{t.topClient}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginTop: '5px' }}>
                  {clients.length > 0 ? clients[0].company_name : (isHebrew ? 'אין לקוחות' : 'No clients')}
                </div>
              </div>
            </div>
          </div>

          {statusMsg.text && (
            <div style={{ padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500', background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: statusMsg.type === 'success' ? '#166534' : '#991b1b' }}>
              {statusMsg.text}
            </div>
          )}

          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#1e293b', margin: 0, marginBottom: '20px' }}>{t.businessSettings}</h2>
            
            {bizPlan !== 'pro' && (
              <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ color: '#92400e', fontSize: '0.9rem', fontWeight: '600' }}>
                  {isHebrew ? '⭐ רוצה להוסיף את הלוגו שלך להצעות המחיר ולשדרג את מיתוג העסק? שדרג עכשיו לחבילת Pro!' : '⭐ Want to add your logo and upgrade your business branding? Upgrade to Pro!'}
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowUpgradeModal(true)} 
                  style={{ background: '#d97706', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  {isHebrew ? 'שדרג חבילה' : 'Upgrade Plan'}
                </button>
              </div>
            )}

            {/* --- מודאל / חלונית בחירת חבילות ושדרוג --- */}
            {showUpgradeModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: isHebrew ? 'right' : 'left' }}>
                  <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.4rem', marginBottom: '10px' }}>
                    {isHebrew ? '🚀 בחירת מסלול ושדרוג עסק' : '🚀 Choose Plan & Upgrade'}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                    {isHebrew ? 'בחר את החבילה המתאימה לעסק שלך:' : 'Select the best plan for your business:'}
                  </p>

                  {!selectedPlanToUpgrade ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                      <div onClick={() => setSelectedPlanToUpgrade('basic')} style={{ border: '2px solid #cbd5e1', padding: '20px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', background: '#f8fafc' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Basic</h4>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4f46e5', margin: '0 0 10px 0' }}>{isHebrew ? '₪99 /mo' : '$29 /mo'}</p>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{isHebrew ? 'עד 20 הצעות בחודש' : 'Up to 20 quotes'}</span>
                      </div>
                      <div onClick={() => setSelectedPlanToUpgrade('pro')} style={{ border: '2px solid #4f46e5', padding: '20px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', background: '#eef2ff' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#4f46e5' }}>Pro ⭐</h4>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4f46e5', margin: '0 0 10px 0' }}>{isHebrew ? '₪199 /mo' : '$49 /mo'}</p>
                        <span style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 'bold' }}>{isHebrew ? 'לוגו אישי + ללא הגבלה' : 'Logo + Unlimited'}</span>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleClaimFreeTrial}>
                      <div style={{ background: '#f1f5f9', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#334155' }}>
                          {isHebrew ? `מסלול נבחר: ${selectedPlanToUpgrade.toUpperCase()}` : `Selected: ${selectedPlanToUpgrade.toUpperCase()}`}
                        </span>
                        <button type="button" onClick={() => setSelectedPlanToUpgrade(null)} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '0.85rem' }}>
                          {isHebrew ? 'שנה מסלול' : 'Change plan'}
                        </button>
                      </div>

                      <div style={{ padding: '20px', background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#166534', fontSize: '1.2rem' }}>
                          {isHebrew ? '🎁 מבצע השקה מיוחד!' : '🎁 Launch Special!'}
                        </h4>
                        <p style={{ margin: 0, color: '#15803d', fontSize: '0.95rem' }}>
                          {isHebrew 
                            ? `קבל את מסלול ה-${selectedPlanToUpgrade.toUpperCase()} בחינם לחודש שלם! ללא צורך בהזנת פרטי אשראי.` 
                            : `Get the ${selectedPlanToUpgrade.toUpperCase()} plan for FREE for a whole month! No credit card required.`}
                        </p>
                      </div>

                      <button type="submit" style={{ width: '100%', background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginBottom: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        {isHebrew ? '🚀 ממש חודש חינם עכשיו' : '🚀 Claim Free Month Now'}
                      </button>
                    </form>
                  )}

                  <button type="button" onClick={() => { setShowUpgradeModal(false); setSelectedPlanToUpgrade(null); }} style={{ width: '100%', background: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    {isHebrew ? 'סגור' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.businessNameLabel}</label>
                  <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.taxIdLabel}</label>
                  <input type="text" value={bizTaxId} onChange={(e) => setBizTaxId(e.target.value)} placeholder="123456789" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'אימייל העסק' : 'Business Email'}</label>
                  <input type="email" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} placeholder="business@email.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'טלפון העסק' : 'Business Phone'}</label>
                  <input type="text" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} placeholder="+972..." style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.logoUrlLabel}</label>
                  <input 
                    type="text" 
                    value={bizLogoUrl} 
                    onChange={(e) => setBizLogoUrl(e.target.value)} 
                    disabled={bizPlan !== 'pro'} 
                    placeholder={bizPlan === 'pro' ? "https://.../logo.png" : (isHebrew ? "זמין בחבילת Pro בלבד" : "Available on Pro Plan only")} 
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: bizPlan !== 'pro' ? '#f1f5f9' : 'white' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.planLabel}</label>
                  <select 
                    value={bizPlan} 
                    onChange={(e) => setBizPlan(e.target.value)} 
                    disabled={true} 
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f1f5f9', boxSizing: 'border-box', color: '#64748b' }}
                  >
                    <option value="free">Free ({isHebrew ? 'חינמי' : 'Free'})</option>
                    <option value="basic">Basic ({isHebrew ? 'בסיסי' : 'Basic'})</option>
                    <option value="pro">Pro ({isHebrew ? 'מתקדם' : 'Pro'})</option>
                  </select>
                </div>
              </div>
              <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
                {t.saveSettings}
              </button>
            </form>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', border: editingQuoteId ? '2px solid #4f46e5' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ color: '#1e293b', marginTop: 0, fontSize: '1.4rem', marginBottom: '4px' }}>
                  {editingQuoteId ? `${isHebrew ? 'עריכת הצעה #' : 'Editing Quote #'}${editingQuoteId.slice(0, 6)}` : t.appName}
                </h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
                  {editingQuoteId ? (isHebrew ? 'עדכן את פרטי ההצעה ושמור שינויים' : 'Modify the quote details below and save changes') : t.appSub}
                </p>
              </div>
              {editingQuoteId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  style={{ background: '#f1f5f9', color: '#4f46e5', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                >
                  {t.cancelEdit}
                </button>
              )}
            </div>

            <form onSubmit={handleSaveQuote}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.clientName}</label>
                  <input type="text" name="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Acme Corp" required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isHebrew ? 'סוג לקוח (חובה)' : 'Client Type'}</label>
                  <select name="clientType" value={clientType} onChange={(e) => setClientType(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', boxSizing: 'border-box' }}>
                    <option value="" disabled>{isHebrew ? 'בחר סוג לקוח...' : 'Select Client Type...'}</option>
                    <option value="business">{isHebrew ? 'עסקי (חברה/עוסק)' : 'Business'}</option>
                    <option value="private">{isHebrew ? 'פרטי (B2C)' : 'Private'}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.clientEmail}</label>
                  <input type="email" name="clientEmail" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="contact@acme.com" required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.clientPhone}</label>
                  <input type="text" name="clientPhone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+1 (555) 0192" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.currency}</label>
                  <select name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', boxSizing: 'border-box' }}>
                    {isHebrew && <option>ILS (₪)</option>}
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.status}</label>
                  <select name="quoteStatus" value={quoteStatus} onChange={(e) => setQuoteStatus(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', boxSizing: 'border-box' }}>
                    <option value="Draft">{isHebrew ? 'טיוטה' : 'Draft'}</option>
                    <option value="Sent">{isHebrew ? 'נשלח' : 'Sent'}</option>
                    <option value="Approved">{isHebrew ? 'אושר' : 'Approved'}</option>
                    <option value="Paid">{isHebrew ? 'שולם' : 'Paid'}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.validUntil}</label>
                  <input type="date" name="validUntil" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.discount}</label>
                  <input type="number" name="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} min="0" max="100" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.terms}</label>
                  <input type="text" name="terms" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: 0 }}>{t.quoteItems}</h3>
                <div style={{ display: 'flex', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                  <select onChange={handleAddFromCatalog} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white' }}>
                    <option value="">{t.quickAdd}</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - {sym}{formatNum(s.price)}</option>
                    ))}
                  </select>
                  <button type="button" onClick={addItem} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>{t.addItem}</button>
                </div>
              </div>

              {items.map((item, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr)) 40px', gap: '10px', marginBottom: '10px', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                  <input type="text" placeholder={isHebrew ? 'תיאור פריט' : 'Item description'} value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }} />
                  <input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box' }} />
                  <input type="number" placeholder="Price" step="0.01" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box' }} />
                  <div style={{ fontWeight: '600', color: '#334155', textAlign: isHebrew ? 'left' : 'right' }}>{sym}{formatNum(Number(item.quantity) * Number(item.unit_price))}</div>
                  {items.length > 1 ? (
                    <button type="button" onClick={() => removeItem(index)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '10px 0', borderRadius: '6px', cursor: 'pointer', width: '100%', textAlign: 'center' }}>✕</button>
                  ) : (
                    <div></div>
                  )}
                </div>
              ))}

              <div style={{ borderTop: '2px solid #f1f5f9', marginTop: '20px', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                  <span>{isHebrew && clientType === 'private' ? (isHebrew ? 'סכום ביניים (כולל מע"מ):' : 'Subtotal (Inc. VAT):') : t.subtotal}</span>
                  <span>{sym}{formatNum(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ef4444', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                    <span>{isHebrew ? `הנחה (${discount}%):` : `Discount (${discount}%):`}</span>
                    <span>-{sym}{formatNum(discountAmount)}</span>
                  </div>
                )}
                {isHebrew && clientType === 'business' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                    <span>{t.vat}</span>
                    <span>{sym}{formatNum(taxAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', marginTop: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                  <span>{t.totalAmount}</span>
                  <span style={{ color: '#4f46e5' }}>{sym}{formatNum(totalAmount)} {currency.includes('EUR') ? 'EUR' : currency.includes('GBP') ? 'GBP' : currency.includes('USD') ? 'USD' : 'ILS'}</span>
                </div>
                {isHebrew && clientType === 'private' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                    <span></span>
                    <span>{isHebrew ? `(הסכום כולל מע"מ בסך ${sym}${formatNum(taxAmount)})` : `(Includes VAT: ${sym}${formatNum(taxAmount)})`}</span>
                  </div>
                )}
              </div>

              <button type="submit" style={{ width: '100%', background: editingQuoteId ? '#10b981' : '#2563eb', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} disabled={isTrialExpired && bizRole !== 'super_admin'}>
                {editingQuoteId ? t.updateQuote : t.generateSave}
              </button>
            </form>
          </div>

          {/* --- ניהול לקוחות (Clients Management) --- */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#1e293b', margin: 0, marginBottom: '20px' }}>{t.clientsManagement}</h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '500px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px' }}>{t.clientName}</th>
                    <th style={{ padding: '12px' }}>{t.clientEmail}</th>
                    <th style={{ padding: '12px' }}>{t.clientPhone}</th>
                    <th style={{ padding: '12px' }}>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                        {isHebrew ? 'אין לקוחות רשומים במערכת עדיין.' : 'No clients found.'}
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                        <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{client.company_name || 'N/A'}</td>
                        <td style={{ padding: '12px', color: '#64748b', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>{client.email || '-'}</td>
                        <td style={{ padding: '12px', color: '#64748b', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>{client.phone || '-'}</td>
                        <td style={{ padding: '12px' }}>
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

          {/* --- היסטוריית הצעות מחיר --- */}
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
              <h2 style={{ fontSize: '1.2rem', color: '#1e293b', margin: 0 }}>{t.recentHistory}</h2>
              
              <div style={{ display: 'flex', gap: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder={t.searchQuote} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '250px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }}
                />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', boxSizing: 'border-box' }}
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
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px' }}>{isHebrew ? 'מספר הצעה' : 'Quote #'}</th>
                    <th style={{ padding: '12px' }}>{isHebrew ? 'לקוח' : 'Client'}</th>
                    <th style={{ padding: '12px' }}>{t.status}</th>
                    <th style={{ padding: '12px' }}>{t.total}</th>
                    <th style={{ padding: '12px' }}>{t.validUntil}</th>
                    <th style={{ padding: '12px' }}>{t.actions}</th>
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
                      const quoteSym = getCurrencySymbol(quote.currency);
                      const currentStatus = quote.status ? quote.status.toLowerCase() : 'draft';
                      return (
                        <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#4f46e5' }}>#{quote.id.slice(0, 6)}</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{quote.clients?.company_name || 'N/A'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>{quote.clients?.email}</div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                              style={{
                                padding: '6px 10px',
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
                          <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>
                            {quoteSym}{formatNum(quote.total)}
                          </td>
                          <td style={{ padding: '12px', color: '#64748b' }}>{quote.valid_until || '-'}</td>
                          <td style={{ padding: '8px', display: 'flex', gap: '6px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', justifyContent: isHebrew ? 'flex-start' : 'flex-end' }}>
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
                              title={t.sendEmail}
                              onClick={() => handleEmailQuote(quote)}
                              style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}
                            >
                              @
                            </button>
                            <button 
                              title={t.sendWhatsApp}
                              onClick={() => handleWhatsAppQuote(quote)}
                              style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.88-.653-1.473-1.46-1.646-1.757-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
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

          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#1e293b', margin: 0, marginBottom: '20px' }}>{t.servicesCatalog}</h2>
            
            <form onSubmit={handleAddService} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder={t.serviceName} 
                value={newServiceName} 
                onChange={(e) => setNewServiceName(e.target.value)} 
                required 
                style={{ flex: '2 1 200px', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }} 
              />
              <input 
                type="number" 
                step="0.01" 
                placeholder={t.defaultPrice} 
                value={newServicePrice} 
                onChange={(e) => setNewServicePrice(e.target.value)} 
                required 
                style={{ flex: '1 1 120px', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
              />
              <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                {t.addService}
              </button>
            </form>

            <div style={{ overflowX: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '400px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px' }}>{t.description}</th>
                    <th style={{ padding: '12px' }}>{t.defaultPrice}</th>
                    <th style={{ padding: '12px' }}>{t.actions}</th>
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
                        <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>{svc.name}</td>
                        <td style={{ padding: '12px', color: '#4f46e5', fontWeight: '600' }}>{formatNum(svc.price)}</td>
                        <td style={{ padding: '12px' }}>
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
          
          {bizRole === 'super_admin' && (
            <div style={{ background: '#fef3c7', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '30px', border: '2px solid #f59e0b' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#92400e', margin: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                👑 Super Admin Panel
              </h2>
              <p style={{ color: '#b45309', marginBottom: '20px' }}>
                {isHebrew ? 'כאן תוכל לראות את כל המשתמשים הרשומים במערכת ולנהל את החבילות שלהם.' : 'View all registered users and manage their subscription plans.'}
              </p>

              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder={isHebrew ? "חיפוש משתמש (אימייל או שם עסק)..." : "Search user (email or business)..."} 
                  value={adminSearchTerm}
                  onChange={(e) => setAdminSearchTerm(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #d97706', borderRadius: '6px', width: '300px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }}
                />
              </div>
              
              <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #fde68a', color: '#92400e', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px' }}>ID</th>
                      <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('email')}>
                        Email {sortField === 'email' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('business_name')}>
                        Business Name {sortField === 'business_name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('country')}>
                        Region / Country {sortField === 'country' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('plan')}>
                        Current Plan {sortField === 'plan' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('role')}>
                        Role {sortField === 'role' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('trial_ends_at')}>
                        Trial Ends {sortField === 'trial_ends_at' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('last_sign_in')}>
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
                        <tr key={acc.id} style={{ borderBottom: '1px solid #fef3c7' }}>
                          <td style={{ padding: '12px', color: '#92400e', fontSize: '0.85rem' }}>{acc.user_id?.slice(0,8)}...</td>
                          <td style={{ padding: '12px', fontWeight: 'bold' }}>{acc.email || 'N/A'}</td>
                          <td style={{ padding: '12px' }}>{acc.business_name}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              background: acc.country === 'Israel (Local)' ? '#dbeafe' : '#dcfce7',
                              color: acc.country === 'Israel (Local)' ? '#1e40af' : '#166534',
                              padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                            }}>
                              {acc.country || 'Israel (Local)'}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select 
                              value={acc.plan} 
                              onChange={(e) => handleAdminPlanChange(acc.id, e.target.value)}
                              style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d97706', background: '#fffbeb' }}
                            >
                              <option value="free">Free</option>
                              <option value="basic">Basic</option>
                              <option value="pro">Pro</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px', color: acc.role === 'super_admin' ? '#ef4444' : '#64748b', fontWeight: 'bold' }}>
                            {acc.role}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.85rem', color: '#475569', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>
                            {acc.trial_ends_at ? (
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: isHebrew ? 'flex-start' : 'flex-end' }}>
                                <span>{new Date(acc.trial_ends_at).toLocaleDateString('en-GB')}</span>
                                <button 
                                  onClick={() => handleMakeLifetime(acc.id)} 
                                  title={isHebrew ? "הפוך למנוי לכל החיים (בטל תאריך תפוגה)" : "Make Lifetime (Remove expiration)"}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}
                                >
                                  ♾️
                                </button>
                              </div>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.85rem', color: '#475569', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>
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