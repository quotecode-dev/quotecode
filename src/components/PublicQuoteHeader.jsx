import React, { useState } from 'react';

export default function PublicQuoteHeader({ isHebrew, bizLogo, bizName, bizTaxId, bizPhone, bizEmail, bizAddress, quote }) {
  const [imgError, setImgError] = useState(false);
  
  // תנאי ברור: יש לוגו רק אם הכתובת קיימת, לא ריקה, ולא הייתה שגיאת טעינה
  const shouldShowLogo = bizLogo && typeof bizLogo === 'string' && bizLogo.trim().length > 0 && !imgError;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '25px', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
      {isHebrew ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'right', flex: 1, minWidth: '220px' }}>
            <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'right' }}>
              {bizTaxId && <div>ח.פ / עוסק: <span dir="ltr" style={{ display: 'inline-block' }}>{bizTaxId}</span></div>}
              {bizPhone && <div>טלפון: <span dir="ltr" style={{ display: 'inline-block' }}>{bizPhone}</span></div>}
              {bizEmail && <div dir="ltr" style={{ textAlign: 'right' }}><span>{bizEmail}</span></div>}
              {bizAddress && <div>כתובת: {bizAddress}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minHeight: '65px' }}>
            {shouldShowLogo ? (
              <img 
                src={bizLogo} 
                alt={bizName} 
                onError={() => setImgError(true)}
                style={{ maxHeight: '65px', maxWidth: '170px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #f1f5f9', padding: '4px', background: 'white' }} 
              />
            ) : (
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>{bizName}</div>
            )}
          </div>

          <div style={{ textAlign: 'center', background: '#f8fafc', padding: '15px 22px', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '190px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', width: '100%' }}>
            <div style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>הצעת מחיר</div>
            <div style={{ color: '#4f46e5', fontSize: '0.95rem', fontWeight: '700', fontFamily: 'monospace', direction: 'ltr', display: 'inline-block' }}>#{quote.id?.slice(0, 8)}</div>
            <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '6px', fontWeight: '500' }}>תאריך: {new Date(quote.created_at || Date.now()).toLocaleDateString('he-IL')}</div>
            {quote.valid_until && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '2px', fontWeight: '700' }}>בתוקף עד: {new Date(quote.valid_until).toLocaleDateString('he-IL')}</div>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', minHeight: '65px' }}>
            {shouldShowLogo ? (
              <img 
                src={bizLogo} 
                alt={bizName} 
                onError={() => setImgError(true)}
                style={{ maxHeight: '65px', maxWidth: '170px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #f1f5f9', padding: '4px', background: 'white' }} 
              />
            ) : (
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a' }}>{bizName}</div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', flex: 1, minWidth: '220px' }}>
            <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4', textAlign: 'left' }}>
              {bizTaxId && <div>Tax ID: {bizTaxId}</div>}
              {bizPhone && <div>Phone: {bizPhone}</div>}
              {bizEmail && <div>{bizEmail}</div>}
              {bizAddress && <div>Address: {bizAddress}</div>}
            </div>
          </div>

          <div style={{ textAlign: 'center', background: '#f8fafc', padding: '15px 22px', borderRadius: '12px', border: '1px solid #e2e8f0', minWidth: '190px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', width: '100%' }}>
            <div style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>Price Quote</div>
            <div style={{ color: '#4f46e5', fontSize: '0.95rem', fontWeight: '700', fontFamily: 'monospace', direction: 'ltr', display: 'inline-block' }}>#{quote.id?.slice(0, 8)}</div>
            <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '6px', fontWeight: '500' }}>Date: {new Date(quote.created_at || Date.now()).toLocaleDateString('en-GB')}</div>
            {quote.valid_until && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '2px', fontWeight: '700' }}>Valid until: {new Date(quote.valid_until).toLocaleDateString('en-GB')}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}