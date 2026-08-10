import React, { useState } from 'react';

export default function PricingModal({ isOpen, onClose, isHebrew, isLocalIsraeliBusiness }) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  if (!isOpen) return null;

  const basicMonthly = isLocalIsraeliBusiness ? '₪49' : '$39';
  const basicYearly = isLocalIsraeliBusiness ? '₪39' : '$29';
  const proMonthly = isLocalIsraeliBusiness ? '₪99' : '$89';
  const proYearly = isLocalIsraeliBusiness ? '₪79' : '$69';

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '14px', width: '100%', maxWidth: '720px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: isHebrew ? 'right' : 'left', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '14px', [isHebrew ? 'left' : 'right']: '14px', background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}>✕</button>

        <h2 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.3rem', textAlign: 'center', marginBottom: '4px' }}>
          {isHebrew ? '🚀 שדרג את העסק שלך עם ProFlow' : '🚀 Upgrade Your Business with ProFlow'}
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '16px', fontSize: '0.85rem' }}>
          {isHebrew ? 'בחר את המסלול המתאים ביותר לצרכים שלך והתחל לעבוד ללא הגבלות' : 'Choose the best plan for your needs and work without limits'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ background: '#f1f5f9', padding: '3px', borderRadius: '24px', display: 'flex', gap: '4px', border: '1px solid #cbd5e1' }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                background: billingCycle === 'monthly' ? '#4f46e5' : 'transparent',
                color: billingCycle === 'monthly' ? 'white' : '#475569',
                border: 'none', padding: '6px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {isHebrew ? 'חיוב חודשי' : 'Monthly Billing'}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                background: billingCycle === 'yearly' ? '#4f46e5' : 'transparent',
                color: billingCycle === 'yearly' ? 'white' : '#475569',
                border: 'none', padding: '6px 16px', borderRadius: '20px', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              {isHebrew ? 'חיוב שנתי (חודשיים מתנה! 20% הנחה)' : 'Yearly Billing (2 Months Free!)'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1.1rem' }}>{isHebrew ? 'מנוי בסיסי (Basic)' : 'Basic Plan'}</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#4f46e5', marginBottom: '4px' }}>
              {billingCycle === 'monthly' ? basicMonthly : basicYearly} 
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>{isHebrew ? '/ חודש' : '/ month'}</span>
            </div>
            {billingCycle === 'yearly' && (
              <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', marginBottom: '10px' }}>
                {isHebrew ? 'חיוב שנתי (חסוך 20% בשנה)' : 'Billed annually (Save 20%)'}
              </div>
            )}
            {billingCycle === 'monthly' && <div style={{ height: '16px', marginBottom: '10px' }}></div>}
            
            <ul style={{ margin: '0 0 16px 0', padding: isHebrew ? '0 16px 0 0' : '0 0 0 16px', color: '#475569', fontSize: '0.8rem', lineHeight: '1.5', flex: 1 }}>
              <li>{isHebrew ? 'עד 20 הצעות מחיר בחודש' : 'Up to 20 quotes/month'}</li>
              <li>{isHebrew ? 'עריכה ושכפול הצעות מחיר' : 'Edit & duplicate quotes'}</li>
              <li>{isHebrew ? 'קטלוג מוצרים אישי' : 'Personal product catalog'}</li>
              <li>{isHebrew ? 'הפקת קובצי PDF רשמיים' : 'Official PDF exports'}</li>
              <li style={{ color: '#ef4444' }}>{isHebrew ? '✗ ללא שליחה ישירה בווצאפ' : '✗ No WhatsApp sending'}</li>
            </ul>
            <button onClick={() => { alert(isHebrew ? `לשדרוג מיידי למסלול Basic (${billingCycle === 'yearly' ? 'שנתי' : 'חודשי'}), פנה לתמיכה.` : 'Please contact support to upgrade.'); onClose(); }} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>
              {isHebrew ? 'בחר מסלול Basic' : 'Select Basic'}
            </button>
          </div>

          <div style={{ border: '2px solid #4f46e5', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', background: 'white', boxShadow: '0 8px 12px -2px rgba(79, 70, 229, 0.1)' }}>
            <div style={{ background: '#4f46e5', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start', marginBottom: '6px' }}>POPULAR</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1.1rem' }}>{isHebrew ? 'מנוי PRO (מומלץ)' : 'PRO Plan (Recommended)'}</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#4f46e5', marginBottom: '4px' }}>
              {billingCycle === 'monthly' ? proMonthly : proYearly} 
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>{isHebrew ? '/ חודש' : '/ month'}</span>
            </div>
            {billingCycle === 'yearly' && (
              <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', marginBottom: '10px' }}>
                {isHebrew ? 'חיוב שנתי (חסוך 20% בשנה)' : 'Billed annually (Save 20%)'}
              </div>
            )}
            {billingCycle === 'monthly' && <div style={{ height: '16px', marginBottom: '10px' }}></div>}

            <ul style={{ margin: '0 0 16px 0', padding: isHebrew ? '0 16px 0 0' : '0 0 0 16px', color: '#475569', fontSize: '0.8rem', lineHeight: '1.5', flex: 1 }}>
              <li>{isHebrew ? 'הצעות מחיר ללא הגבלה (∞)' : 'Unlimited quotes (∞)'}</li>
              <li>{isHebrew ? 'שליחת הצעות מחיר ישירות בוואטסאפ' : 'Send quotes directly via WhatsApp'}</li>
              <li>{isHebrew ? 'הוספת לוגו עסקי מותאם אישית' : 'Custom business logo upload'}</li>
              <li>{isHebrew ? 'מחיקה וניהול מתקדם של הצעות' : 'Advanced quote management & deletion'}</li>
              <li>{isHebrew ? 'מעקב צפיות חכם (הצעות חמות)' : 'Smart view tracking (Hot quotes)'}</li>
            </ul>
            <button onClick={() => { alert(isHebrew ? `לשדרוג מיידי למסלול PRO (${billingCycle === 'yearly' ? 'שנתי' : 'חודשי'}), פנה לתמיכה.` : 'Please contact support to upgrade.'); onClose(); }} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)' }}>
              {isHebrew ? 'בחר מסלול PRO' : 'Select PRO'}
            </button>
          </div>

        </div>

        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem' }}>
          {isHebrew ? 'יש לך שאלות? צור איתנו קשר דרך עוזר ה-AI או במייל.' : 'Have questions? Contact us via AI assistant or email.'}
        </div>

      </div>
    </div>
  );
}