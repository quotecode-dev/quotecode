import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ProFlowLogo from '../components/ProFlowLogo';

export default function PublicQuote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, [id]);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setQuote(data);
      if (data?.status === 'approved') {
        setApproved(true);
      }
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError('הצעת המחיר אינה נמצאת או שפג תוקפה / Quote not found or expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'approved' })
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

  const isHebrew = quote.currency === 'ILS' || quote.isHebrew;
  const currencySymbol = quote.currency === 'USD' ? '$' : quote.currency === 'EUR' ? '€' : '₪';
  const vatRate = quote.currency === 'ILS' ? 0.18 : 0; // 18% for local, 0% for global

  const subtotal = quote.items ? quote.items.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.quantity || 1)), 0) : 0;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  return (
    <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', color: '#1e293b' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => navigate(isHebrew ? '/he' : '/')}>
            <ProFlowLogo size={45} />
          </div>
          <div style={{ textAlign: isHebrew ? 'left' : 'right' }}>
            <h1 style={{ fontSize: '1.5rem', color: '#0f172a', margin: '0 0 5px 0' }}>{isHebrew ? 'הצעת מחיר' : 'Price Quote'}</h1>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>#{quote.id?.slice(0, 8)}</span>
          </div>
        </div>

        {/* Client & Business Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>{isHebrew ? 'לכבוד הלקוח:' : 'Client:'}</h4>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{quote.client_name || (isHebrew ? 'לקוח נכבד' : 'Valued Client')}</p>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>{quote.client_email}</p>
          </div>
          <div style={{ textAlign: isHebrew ? 'left' : 'right' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#475569' }}>{isHebrew ? 'תאריך ההצעה:' : 'Date:'}</h4>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{new Date(quote.created_at || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: isHebrew ? 'right' : 'left' }}>
              <th style={{ padding: '12px', borderRadius: isHebrew ? '0 8px 8px 0' : '8px 0 0 8px' }}>{isHebrew ? 'תיאור פריט' : 'Description'}</th>
              <th style={{ padding: '12px' }}>{isHebrew ? 'כמות' : 'Qty'}</th>
              <th style={{ padding: '12px' }}>{isHebrew ? 'מחיר יחידה' : 'Unit Price'}</th>
              <th style={{ padding: '12px', borderRadius: isHebrew ? '8px 0 0 8px' : '0 8px 8px 0' }}>{isHebrew ? 'סה"כ' : 'Total'}</th>
            </tr>
          </thead>
          <tbody>
            {quote.items && quote.items.length > 0 ? (
              quote.items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>{item.description}</td>
                  <td style={{ padding: '12px' }}>{item.quantity}</td>
                  <td style={{ padding: '12px' }}>{Number(item.price).toLocaleString()} {currencySymbol}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{(Number(item.price) * Number(item.quantity)).toLocaleString()} {currencySymbol}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  {isHebrew ? 'אין פריטים להצגה' : 'No items to display'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isHebrew ? 'flex-end' : 'flex-start', gap: '8px', marginBottom: '40px', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', fontSize: '1rem', color: '#475569' }}>
            <span>{isHebrew ? 'סיכום ביניים:' : 'Subtotal:'}</span>
            <span style={{ fontWeight: 'bold' }}>{subtotal.toLocaleString()} {currencySymbol}</span>
          </div>
          {vatRate > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', fontSize: '1rem', color: '#475569' }}>
              <span>{isHebrew ? 'מע"מ (18%):' : 'VAT (18%):'}</span>
              <span style={{ fontWeight: 'bold' }}>{vatAmount.toLocaleString()} {currencySymbol}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', borderTop: '2px solid #cbd5e1', paddingTop: '8px', marginTop: '4px' }}>
            <span>{isHebrew ? 'סה"כ לתשלום:' : 'Total:'}</span>
            <span style={{ color: '#4f46e5' }}>{total.toLocaleString()} {currencySymbol}</span>
          </div>
        </div>

        {/* Approval Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          {approved ? (
            <div style={{ background: '#d1fae5', color: '#065f46', padding: '16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem' }}>
              {isHebrew ? '✓ הצעת מחיר זו אושרה בהצלחה!' : '✓ This quote has been successfully approved!'}
            </div>
          ) : (
            <button
              onClick={handleApprove}
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
            >
              {isHebrew ? 'אשר הצעת מחיר זו ✓' : 'Approve Quote ✓'}
            </button>
          )}
        </div>

        {/* Footer with dynamic ProFlow link */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px', color: '#64748b', fontSize: '0.9rem' }}>
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