import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ProFlowLogo from '../components/ProFlowLogo';

const formatNum = (val) => Math.round(Number(val || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PublicQuote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approved, setApproved] = useState(false);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuoteAndIncrementView();
    }
  }, [id]);

  const fetchQuoteAndIncrementView = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select(`*, clients (*), quote_items (*)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      setQuote(data);

      // Automatic view count increment
      const newViewCount = (data.view_count || 0) + 1;
      await supabase
        .from('quotes')
        .update({ view_count: newViewCount })
        .eq('id', id);

      if (data?.status === 'approved' || data?.signature) {
        setApproved(true);
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError('הצעת המחיר אינה נמצאת או שפג תוקפה / Quote not found or expired.');
    } finally {
      setLoading(false);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleApprove = async () => {
    if (!hasSigned) {
      alert(isHebrew ? 'נא לחתום על גבי המסמך לפני האישור' : 'Please sign the quote before approval');
      return;
    }

    try {
      const canvas = canvasRef.current;
      const signatureDataUrl = canvas ? canvas.toDataURL() : null;

      const { error } = await supabase
        .from('quotes')
        .update({ 
          status: 'approved',
          signature: signatureDataUrl 
        })
        .eq('id', id);

      if (error) throw error;
      setApproved(true);
    } catch (err) {
      console.error('Error approving quote:', err);
      alert('שגיאה באישור ההצעה / Error approving quote');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Segoe UI, Tahoma' }}>
        <h2>טוען הצעת מחיר... / Loading quote...</h2>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Segoe UI, Tahoma', textAlign: 'center', padding: '20px' }}>
        <h2>{error || 'הצעת המחיר לא נמצאה'}</h2>
      </div>
    );
  }

  const isHebrew = quote.currency === 'ILS' || quote.isHebrew !== false;
  const currencySymbol = quote.currency === 'USD' ? '$' : quote.currency === 'EUR' ? '€' : '₪';
  const vatRate = quote.currency === 'ILS' ? 0.18 : 0;

  let parsedItems = [];
  try {
    if (typeof quote.items === 'string') {
      parsedItems = JSON.parse(quote.items);
    } else if (Array.isArray(quote.items)) {
      parsedItems = quote.items;
    }
  } catch (e) {
    parsedItems = [];
  }

  const dbTotal = Number(quote.total || 0);
  const calculatedSubtotalFromItems = parsedItems.reduce((acc, item) => acc + (Number(item.price || item.unit_price || 0) * Number(item.quantity || 1)), 0);
  
  const subtotal = quote.subtotal ? Number(quote.subtotal) : (calculatedSubtotalFromItems > 0 ? calculatedSubtotalFromItems : (dbTotal > 0 ? dbTotal / (1 + vatRate) : 0));
  const vatAmount = quote.vat !== undefined && quote.vat !== null ? Number(quote.vat) : subtotal * vatRate;
  const total = dbTotal > 0 ? dbTotal : (subtotal + vatAmount);

  const bizName = quote.businessSettings?.business_name || 'ProFlow Business';
  const bizLogo = quote.businessSettings?.logo_url;
  const clientName = quote.clients?.company_name || 'לקוח יקר';

  return (
    <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '20px', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', width: '100%', maxWidth: '800px', boxSizing: 'border-box' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            {bizLogo ? (
              <img src={bizLogo} alt={bizName} style={{ maxHeight: '50px', objectFit: 'contain' }} />
            ) : (
              <h1 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>{bizName}</h1>
            )}
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '5px' }}>
              {quote.businessSettings?.tax_id && <span>ח.פ / עוסק: {quote.businessSettings.tax_id} | </span>}
              {quote.businessSettings?.email && <span>{quote.businessSettings.email}</span>}
            </div>
          </div>
          <div style={{ textAlign: isHebrew ? 'left' : 'right' }}>
            <h1 style={{ fontSize: '1.5rem', color: '#0f172a', margin: '0 0 5px 0' }}>{isHebrew ? 'הצעת מחיר' : 'Price Quote'}</h1>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>#{quote.id?.slice(0, 8)}</span>
          </div>
        </div>

        {/* Client & Business Info */}
        <div style={{ background: '#f8fafc', padding: '15px 20px', borderRadius: '10px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>{isHebrew ? 'לכבוד הלקוח:' : 'Client:'}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>{quote.clients?.company_name || quote.client_name || (isHebrew ? 'לקוח נכבד' : 'Valued Client')}</div>
          {quote.clients?.email && <div style={{ color: '#475569', fontSize: '0.9rem', direction: 'ltr', textAlign: 'right' }}>{quote.clients.email}</div>}
          {quote.clients?.phone && <div style={{ color: '#475569', fontSize: '0.9rem', direction: 'ltr', textAlign: 'right' }}>{quote.clients.phone}</div>}
          {quote.clients?.address && <div style={{ color: '#475569', fontSize: '0.9rem' }}>{quote.clients.address}</div>}
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '10px' }}>{isHebrew ? 'תאריך ההצעה:' : 'Date:'} {new Date(quote.created_at || Date.now()).toLocaleDateString()}</div>
        </div>

        {/* Items Table */}
        <div style={{ overflowX: 'auto', marginBottom: '25px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.85rem' }}>
                <th style={{ padding: '10px', borderRadius: isHebrew ? '0 8px 8px 0' : '8px 0 0 8px' }}>{isHebrew ? 'תיאור פריט' : 'Description'}</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>{isHebrew ? 'כמות' : 'Qty'}</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>{isHebrew ? 'מחיר יחידה' : 'Unit Price'}</th>
                <th style={{ padding: '10px', textAlign: 'left', borderRadius: isHebrew ? '8px 0 0 8px' : '0 8px 8px 0' }}>{isHebrew ? 'סה"כ' : 'Total'}</th>
              </tr>
            </thead>
            <tbody>
              {quote.quote_items && quote.quote_items.length > 0 ? (
                quote.quote_items.map((item, index) => {
                  const itemPrice = Number(item.price || item.unit_price || 0);
                  const itemQty = Number(item.quantity || 1);
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                      <td style={{ padding: '12px 10px', color: '#1e293b' }}>{item.description || item.name || (isHebrew ? 'פריט' : 'Item')}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'center', color: '#475569' }}>{itemQty}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'left', color: '#475569' }}>{currencySymbol}{formatNum(itemPrice)}</td>
                      <td style={{ padding: '12px 10px', textAlign: 'left', fontWeight: 'bold', color: '#1e293b' }}>{currencySymbol}{formatNum(item.total_price || (itemQty * itemPrice))}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                    {isHebrew ? `הצעת מחיר כללית בסך ${formatNum(total)} ${currencySymbol}` : `General Quote total ${formatNum(total)} ${currencySymbol}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
          <div style={{ width: '300px', background: '#f8fafc', padding: '15px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', fontSize: '0.9rem' }}>
              <span>{isHebrew ? 'סיכום ביניים:' : 'Subtotal:'}</span>
              <span>{currencySymbol}{formatNum(subtotal)}</span>
            </div>
            {quote.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ef4444', fontSize: '0.9rem' }}>
                <span>{isHebrew ? `הנחה (${quote.discount}%):` : `Discount (${quote.discount}%):`}</span>
                <span>-{currencySymbol}{formatNum((subtotal * quote.discount) / 100)}</span>
              </div>
            )}
            {vatRate > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                <span>{isHebrew ? 'מע"מ (18%):' : 'VAT (18%):'}</span>
                <span>{currencySymbol}{formatNum(vatAmount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '900', color: '#1e293b', borderTop: '2px solid #cbd5e1', paddingTop: '10px', marginTop: '5px' }}>
              <span>{isHebrew ? 'סה"כ לתשלום:' : 'Total:'}</span>
              <span style={{ color: '#4f46e5' }}>{currencySymbol}{formatNum(total)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Notes Display */}
        {quote.terms && (
          <div style={{ marginBottom: '25px', background: '#f8fafc', padding: '15px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>{isHebrew ? 'תקנון ותנאים:' : 'Terms & Conditions:'}</div>
            <div style={{ fontSize: '0.85rem', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{quote.terms}</div>
          </div>
        )}

        {quote.notes && (
          <div style={{ marginBottom: '25px', background: '#f8fafc', padding: '15px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>{isHebrew ? 'הערות נוספות:' : 'Additional Notes:'}</div>
            <div style={{ fontSize: '0.85rem', color: '#475569', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{quote.notes}</div>
          </div>
        )}

        {/* Signature & Approval Section */}
        <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '25px', textAlign: 'center' }}>
          {approved ? (
            <div style={{ background: '#dcfce7', color: '#166534', padding: '20px', borderRadius: '12px', fontWeight: 'bold' }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{isHebrew ? '✓ הצעת מחיר זו אושרה ונחתמה בהצלחה!' : '✓ This quote has been successfully approved and signed!'}</div>
              <div style={{ fontSize: '0.9rem', color: '#15803d' }}>{quote.signature && (quote.signature.startsWith('data:image') ? (isHebrew ? 'חתימה דיגיטלית התקבלה בהצלחה' : 'Digital signature received') : `${isHebrew ? 'שם החותם' : 'Signed by'}: ${quote.signature}`)} {quote.signed_at && ` בתאריך ${new Date(quote.signed_at).toLocaleString('en-GB')}`}</div>
            </div>
          ) : (
            <div style={{ border: '1px solid #cbd5e1', padding: '20px', borderRadius: '12px', background: '#f8fafc', textAlign: 'center', boxSizing: 'border-box' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{isHebrew ? 'חתימת לקוח לאישור ההצעה:' : 'Client Signature:'}</h4>
              
              <div style={{ display: 'inline-block', border: '1px dashed #94a3b8', background: 'white', borderRadius: '8px', cursor: 'crosshair', marginBottom: '10px', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                <canvas
                  ref={canvasRef}
                  width={350}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ display: 'block', touchAction: 'none', maxWidth: '100%', height: 'auto' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <button
                  type="button"
                  onClick={clearSignature}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {isHebrew ? 'נקה חתימה' : 'Clear Signature'}
                </button>
              </div>
              <div>
                <button
                  onClick={handleApprove}
                  style={{ background: hasSigned ? '#10b981' : '#94a3b8', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: hasSigned ? 'pointer' : 'not-allowed', boxShadow: hasSigned ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none', maxWidth: '100%', boxSizing: 'border-box' }}
                >
                  {isHebrew ? 'אשר וחתום על הצעת המחיר ✓' : 'Approve & Sign Quote ✓'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with dynamic ProFlow link */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '25px', color: '#64748b', fontSize: '0.9rem' }}>
          {isHebrew ? (
            <span>
              מסמך זה נערך ע"י{' '}
              <span
                onClick={() => navigate('/he')}
                style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
              >
                ProFlow
              </span>
              {' '}– התוכנה שעושה לעסקים את החיים קלים.
            </span>
          ) : (
            <span>
              This document was generated by{' '}
              <span
                onClick={() => navigate('/')}
                style={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
              >
                ProFlow
              </span>
              {' '}– the software that makes business life easy.
            </span>
          )}
        </div>

      </div>
    </div>
  );
}