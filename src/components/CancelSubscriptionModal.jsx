import React, { useState } from 'react';

export default function CancelSubscriptionModal({ isOpen, onClose, isHebrew, onConfirmCancel }) {
  const [step, setStep] = useState(1); // 1: Survey, 2: Confirmation & Grace notice
  const [selectedReason, setSelectedReason] = useState('');
  const [otherText, setOtherText] = useState('');

  if (!isOpen) return null;

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    setStep(2);
  };

  const handleFinalCancel = () => {
    onConfirmCancel(selectedReason || otherText);
    onClose();
    setStep(1);
    setSelectedReason('');
    setOtherText('');
  };

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '14px', width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: isHebrew ? 'right' : 'left', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '14px', [isHebrew ? 'left' : 'right']: '14px', background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}>✕</button>

        {step === 1 ? (
          <>
            <h2 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.2rem', marginBottom: '8px' }}>
              {isHebrew ? 'אנחנו מצטערים לשמוע שאתה עוזב 😢' : 'We are sorry to see you go 😢'}
            </h2>
            <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '0.85rem' }}>
              {isHebrew ? 'נשמח שתשתף אותנו למה החלטת לבטל את המנוי כדי שנוכל להשתפר:' : 'Please share why you are cancelling so we can improve:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {[
                { id: 'price', he: 'עוזב בגלל המחיר', en: 'Leaving due to pricing' },
                { id: 'inefficient', he: 'התוכנה לא יעילה או לא מספיקה לי', en: 'Software is inefficient or not enough' },
                { id: 'features', he: 'חסרים לי פיצ\'רים ספציפיים', en: 'Missing specific features' },
                { id: 'alternative', he: 'מצאתי פתרון חלופי', en: 'Found an alternative solution' },
                { id: 'other', he: 'סיבה אחרת', en: 'Other reason' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleReasonSelect(item.he)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    textAlign: isHebrew ? 'right' : 'left',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  {isHebrew ? item.he : item.en}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              style={{ width: '100%', background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isHebrew ? 'דלג והמשך בביטול' : 'Skip and proceed to cancellation'}
            </button>
          </>
        ) : (
          <>
            <h2 style={{ marginTop: 0, color: '#ef4444', fontSize: '1.2rem', marginBottom: '8px' }}>
              {isHebrew ? 'אישור ביטול מנוי' : 'Confirm Subscription Cancellation'}
            </h2>
            
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ margin: 0, color: '#991b1b', fontSize: '0.85rem', lineHeight: '1.4' }}>
                {isHebrew 
                  ? 'שים לב: הנתונים שלך (הצעות המחיר והלקוחות) יישמרו במערכת במצב חסום/מוקפא, כך שאם תבחר לחזור בעתיד – הכל ימתין לך בדיוק באותו מקום.'
                  : 'Note: Your data (quotes and clients) will be saved in a locked/frozen state so everything will be here if you decide to return.'}
              </p>
            </div>

            <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '20px' }}>
              {isHebrew ? 'האם אתה בטוח שברצונך להמשיך בביטול?' : 'Are you sure you want to proceed with cancellation?'}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setStep(1)}
                style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {isHebrew ? 'חזרה' : 'Back'}
              </button>
              <button
                onClick={handleFinalCancel}
                style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {isHebrew ? 'אישור וביטול מנוי' : 'Confirm Cancellation'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}