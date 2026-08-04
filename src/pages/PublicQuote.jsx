import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ProFlowLogo from '../components/ProFlowLogo';
import AccessibilityModal from '../components/AccessibilityModal';

const formatNum = (val) => Math.round(Number(val || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const DEFAULT_TERMS_HEB = `תנאים כלליים:
1. תוקף ההצעה: ההצעה בתוקף ל-30 ימים מיום הצעת המחיר.
2. מחירים: המחירים כוללים מע"מ, אלא אם צוין אחרת.
3. תשלום: התשלום יתבצע במזומן או באמצעות העברה בנקאית, בתנאים שיוסכמו מראש.
4. אספקה: אספקת המוצרים תתבצע תוך 30 ימי עבודה ממועד אישור ההזמנה והתשלום, אלא אם כן צוין אחרת.`;

const DEFAULT_TERMS_ENG = `General Terms:
1. Validity: This quote is valid for 30 days from issuance.
2. Payment: Payment shall be made in cash or via bank transfer as agreed in advance.
3. Delivery: Product delivery within 30 business days from order confirmation and payment.`;

const DEFAULT_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyODUgMTAwIiB3aWR0aD0iMjg1IiBoZWlnaHQ9IjEwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50aWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0ZjQ2ZTUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMGI5ODEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMTUgNTAgTDQ1IDIwIEw2MCAzNSBMNDAgNTUgTDYwIDc1IEw0NSA5MCBaIiBmaWxsPSJ1cmwoI2cpIi8+PHBhdGggZD0iTS00MCA1MCBMNzggMjAgTDg1IDM1IEw2NSA1NSBMODUgNzUgTDcwIDkwIFoiIGZpbGw9IiMxZTI5M2IiIG9wYWNpdHk9IjAuOSIvPjx0ZXh0IHg9IjEwNSIgeT0iNjYiIGZvbnQtZmFtaWx5PSJTZWdvZSBVSSwgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ0IiBmb250LXdlaWdodD05OTAiIGZpbGw9IiMxZTI5M2IiPlBybzx0c3BhbiBmaWxsPSIjNGY0NmU1Ij5GbG93PC90c3Bhbj48L3RleHQ+PC9zdmc+";

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

export default function PublicQuote() {
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
        .select(`*, clients ( company_name, email, phone, client_type, tax_id, address, terms, notes ), quote_items ( * )`)
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
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
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

  const isBusinessClient = quote.client_type === 'business';
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
  
  const quoteTaxRate = (isLocalIsraeliBusiness && quote.tax_rate !== undefined && quote.tax_rate !== null) ? Number(quote.tax_rate) : 0.00;
  const hasVat = isLocalIsraeliBusiness && quoteTaxRate > 0;
  
  let quoteTaxAmount = 0;
  let quoteTotal = 0;

  if (hasVat && isPrivate) {
      quoteTotal = baseAmount;
      quoteTaxAmount = quoteTotal - (quoteTotal / (1 + quoteTaxRate));
  } else {
      quoteTaxAmount = baseAmount * quoteTaxRate;
      quoteTotal = baseAmount + quoteTaxAmount;
  }

  const fallbackTerms = isHebrew ? DEFAULT_TERMS_HEB : DEFAULT_TERMS_ENG;
  
  let displayTerms = quote.terms;
  let displayNotes = quote.notes;

  if (quote.notes === null && quote.terms) {
      displayNotes = quote.terms;
      displayTerms = isBusinessClient ? (settings?.default_terms || fallbackTerms) : '';
  } else {
      displayTerms = quote.terms !== null && quote.terms !== undefined ? quote.terms : (isBusinessClient ? (settings?.default_terms || fallbackTerms) : '');
      displayNotes = quote.notes || '';
  }

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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px', flexDirection: 'row', flexWrap: 'wrap', gap: '15px' }}>
            
            <div style={{ textAlign: 'right' }}>
              <img src={bizLogo} alt="Business Logo" style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain', marginBottom: '8px', display: 'block', marginLeft: 'auto', marginRight: '0' }} crossOrigin="anonymous" />
              <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                {bizPhone && <span dir="ltr">{bizPhone}</span>}
                {bizEmail && <span> | <span dir="ltr">{bizEmail}</span></span>}
                {bizTaxId && <span> | {isHebrew ? 'עוסק/ח.פ:' : 'Tax ID:'} <span dir="ltr">{bizTaxId}</span></span>}
              </p>
            </div>

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
                  <span>{isHebrew ? 'סה"כ:' : 'Subtotal:'}</span>
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

          <div style={{ marginTop: '50px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
            
            <div style={{ order: isHebrew ? 1 : 2, display: 'flex', flexDirection: 'column', alignItems: isHebrew ? 'flex-start' : 'flex-end', minWidth: '200px' }}>
              {!approvedSuccess && !quote.signature && (
                <div data-html2canvas-ignore="true" className="no-print" style={{ marginBottom: '15px' }}>
                  <button 
                    onClick={handleClientApproveClick}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%' }}
                  >
                    {isHebrew ? '✔️ אשר הצעת מחיר זו' : '✔️ Approve Quote'}
                  </button>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
                    {isHebrew ? 'חתימה דיגיטלית מהירה' : 'Quick Digital Signature'}
                  </div>
                </div>
              )}
              {quote.signature && (
                <div style={{ textAlign: isHebrew ? 'right' : 'left', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>{isHebrew ? 'חתימת לקוח מאושרת:' : 'Approved Client Signature:'}</p>
                  <img src={quote.signature} alt="Client Signature" style={{ maxHeight: '80px', display: 'block', objectFit: 'contain' }} crossOrigin="anonymous" />
                </div>
              )}
            </div>

            <div style={{ order: isHebrew ? 2 : 1, flex: 1, minWidth: '250px', maxWidth: '600px', textAlign: isHebrew ? 'right' : 'left' }}>
              {displayTerms && isBusinessClient && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '6px' }}>{isHebrew ? 'תקנון ותנאים (עסקי)' : 'Terms & Conditions'}</p>
                  <div style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    {displayTerms}
                  </div>
                </div>
              )}

              {displayNotes && (
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '6px' }}>{isHebrew ? 'הערות נוספות להצעה זו' : 'Quote Notes'}</p>
                  <div style={{ color: '#475569', fontSize: '0.85rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    {displayNotes}
                  </div>
                </div>
              )}
            </div>

          </div>

          <div style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '15px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
            {isHebrew ? (
              <>מסמך זה נערך ע"י <strong>ProFlow</strong> - התוכנה שעושה לעסקים את החיים קלים.</>
            ) : (
              <>This document was generated by <strong>ProFlow</strong> - Business management made easy.</>
            )}
          </div>

        </div>
      </div>

      <footer className="no-print" style={{ textAlign: 'center', padding: '20px', marginTop: '40px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
        <div style={{ marginBottom: '10px' }}>
          Powered by <strong>ProFlow</strong> - {isHebrew ? 'מערכת ניהול עסק והצעות מחיר' : 'Business Management & Quoting System'}
        </div>
        <button onClick={() => setShowAccessibility(true)} style={{ background: 'none', border: 'none', color: '#4f46e5', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
          ♿ {isHebrew ? 'הצהרת נגישות' : 'Accessibility Statement'}
        </button>
      </footer>
      
    </div>
  );
}