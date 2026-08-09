import React, { useState, useRef, useEffect } from 'react';

export default function AIChatWidget({ isHebrew }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('proflow_ai_chat');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { role: 'assistant', content: isHebrew ? 'שלום! אני עוזר ה-AI של ProFlow. איך אעזור לך בממשק המערכת היום?' : 'Hello! I am ProFlow AI assistant. How can I help you with the interface today?' }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    try {
      sessionStorage.setItem('proflow_ai_chat', JSON.stringify(messages));
    } catch (e) {}
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = userMsg.toLowerCase();

      if (isHebrew) {
        if (lower.includes('קטלוג') || lower.includes('מוצר') || lower.includes('שירות') || lower.includes('פריט') || lower.includes('להוסיף')) {
          reply = 'כדי להוסיף מוצר או שירות לקטלוג: גלול למטה בטאב "הצעות מחיר" הראשי אל טבלת "קטלוג שירותים ומוצרים". הזן בשדה הייעודי את שם השירות/המוצר ואת המחיר הקבוע שלו, ולחץ על כפתור "הוסף לקטלוג". לאחר מכן תוכל לבחור אותו בלחיצה מהירה מתוך רשימת הקטלוג בעת יצירת הצעת מחיר!';
        } else if (lower.includes('פעולות') || lower.includes('תפריט') || lower.includes('כפתור') || lower.includes('צפה') || lower.includes('עריכה')) {
          reply = 'בכל שורה של הצעת מחיר בטבלה ישנו כפתור "פעולות ▼" מצד שמאל. בלחיצה עליו נפתח תפריט המאפשר לך: לצפות במסמך (👁️), לערוך אותו (✏️), לשכפל (📋), לשלוח בוואטסאפ או במייל, או למחוק את ההצעה.';
        } else if (lower.includes('סיכום') || lower.includes('הזמנות') || lower.includes('רשימה') || lower.includes('היסטוריה') || lower.includes('טבלה')) {
          reply = 'את סיכום כל ההצעות וההזמנות ניתן לראות בטאב "הצעות מחיר" הראשי. הטבלה מציגה את מספר ההזמנה, שם הלקוח, תיאור הפריט הראשון, הסכום הכולל, תאריך היצירה, סטטוס העסק (טיוטה, נשלח, אושר, שולם) ומספר צפיות אמיתיות של לקוחות (👁️).';
        } else if (lower.includes('מייל') || lower.includes('אימייל') || lower.includes('לשלוח')) {
          reply = 'כדי לשלוח הצעת מחיר במייל: פתח את תפריט "פעולות ▼" בשורת ההצעה המבוקשת ובחר באפשרות "שלח במייל". המערכת תשלח את ההצעה אוטומטית לכתובת המייל של הלקוח דרך השרת.';
        } else if (lower.includes('הצעה') || lower.includes('חדשה') || lower.includes('ליצור') || lower.includes('הפקת')) {
          reply = 'כדי ליצור הצעת מחיר חדשה לחץ על כפתור "➕ צור הצעת מחיר חדשה" בראש הדשבורד. מלא את פרטי הלקוח, בחר את סוג הלקוח (עסקי או פרטי), הוסף פריטים (ידנית או מהקטלוג) ולחיצה על "הפק ושמור בענן" תשמור את ההצעה.';
        } else if (lower.includes('לקוח') || lower.includes('crm') || lower.includes('ח.פ')) {
          reply = 'בטאב "לקוחות" תוכל לנהל את ספר הלקוחות המלא שלך. שם מופיעים שם החברה, ח.פ / ת.ז, אימייל, טלפון, כתובת, והערות או הנחיות מיוחדות לכל לקוח.';
        } else if (lower.includes('וואטסאפ') || lower.includes('whatsapp') || lower.includes('וואט סאפ'))  {
          reply = 'שליחת הצעת מחיר ישירות בוואטסאפ מתבצעת דרך תפריט "פעולות ▼" בשורת ההצעה (פיצ\'ר בלעדי למנויי PRO) המייצר הודעה מוכנה עם לינק ישיר ללקוח.';
        } else if (lower.includes('מע"מ') || lower.includes('vat') || lower.includes('מס')) {
          reply = 'המערכת מחשבת מע"מ אוטומטית בהתאם להגדרות העסק: 18% ללקוחות בארץ (עם אפשרות לחישוב כולל/לפני מע"מ לפי סוג הלקוח) ו-0% ללקוחות מחו"ל.';
        } else if (lower.includes('מיון') || lower.includes('סדר') || lower.includes('למיין') || lower.includes('עמודות')) {
          reply = 'ניתן למיין את טבלת ההצעות בקלות בלחיצה על כותרות העמודות בטבלה (מספר הזמנה, שם לקוח, סכום, תאריך, סטטוס או צפיות).';
        } else if (lower.includes('הוצאות') || lower.includes('דוחות') || lower.includes('רווח') || lower.includes('הכנסות'))  {
          reply = 'בטאב "הוצאות/הכנסות" (למנהלי מערכת) תוכל לנהל את הוצאות העסק השוטפות, לצפות בגרפים שנתיים של הכנסות מול הוצאות, ולייצא דוחות מרוכזים לאקסל (CSV).';
        } else if (lower.includes('אזור') || lower.includes('lcl') || lower.includes('intl') || lower.includes('משתמשים') || lower.includes('אדמין')) {
          reply = 'פאנל ה-Super Admin מאפשר לראות את כל משתמשי המערכת, לנהל את החבילות שלהם (Free, Basic, Pro), להעניק מנוי לכל החיים (Lifetime), ולשנות את אזור הפעילות (LCL לישראל בירוק, או Intl לחו"ל באדום עם התראת אישור).';
        } else {
          reply = 'מערכת ProFlow מספקת ניהול עסק חכם, הצעות מחיר, קטלוג מוצרים ושירותים, חתימות דיגיטליות, ניהול אזורי פעילות LCL/Intl ודוחות פיננסיים. שאל אותי למשל על: הוספת מוצר לקטלוג, יצירת הצעת מחיר, ניהול לקוחות או שליחה בוואטסאפ!';
        }
      } else {
        if (lower.includes('catalog') || lower.includes('product') || lower.includes('service') || lower.includes('item') || lower.includes('add')) {
          reply = 'To add a product or service to the catalog: scroll down on the main "Quotes" tab to the "Services & Products Catalog" section. Enter the service name and fixed price, then click "Add to Catalog". You can then quickly select it when building quotes!';
        } else if (lower.includes('action') || lower.includes('menu') || lower.includes('button') || lower.includes('view')) {
          reply = 'In the quotes table, click the "Actions ▼" button on any row to open a menu where you can view, edit, duplicate, WhatsApp/email, or delete the quote.';
        } else if (lower.includes('quote') || lower.includes('create')) {
          reply = 'To create a new quote, click "Create New Quote" at the top of your dashboard, fill in client details, add items, and click generate.';
        } else if (lower.includes('email') || lower.includes('send')) {
          reply = 'To send a quote via email, click the "Actions ▼" menu on the quote row and select "Send Email".';
        } else if (lower.includes('client') || lower.includes('crm')) {
          reply = 'In the "Clients" tab you can manage your complete client database, tax IDs, contact details, and custom notes.';
        } else if (lower.includes('whatsapp')) {
          reply = 'You can send quotes directly via WhatsApp using the actions menu in your quotes list (PRO feature).';
        } else if (lower.includes('sort') || lower.includes('column')) {
          reply = 'You can sort the quotes table by clicking on any column header (Order #, Client Name, Amount, Date, Status, or Views).';
        } else if (lower.includes('lcl') || lower.includes('intl') || lower.includes('region') || lower.includes('admin')) {
          reply = 'In the Super Admin panel, you can manage user subscription plans, grant Lifetime access, and control business regions (LCL in green for Israel or Intl in red for international).';
        } else {
          reply = 'ProFlow provides smart business management, quotes, product catalog, digital signatures, region management (LCL/Intl), and financial reports. Feel free to ask about adding catalog items, creating quotes, or managing clients!';
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="no-print" style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        ✨ {isHebrew ? 'שירות לקוחות ותמיכה AI' : 'AI Support & Chat'}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          [isHebrew ? 'right' : 'left']: '20px',
          width: '360px',
          height: '480px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 99999,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          textAlign: isHebrew ? 'right' : 'left'
        }} dir={isHebrew ? 'rtl' : 'ltr'}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: 'white',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>✨</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{isHebrew ? 'שירות לקוחות ProFlow' : 'ProFlow Support'}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>{isHebrew ? '🟢 זמין 24/7 לעזרה בממשק' : '🟢 Available 24/7'}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? (isHebrew ? 'flex-start' : 'flex-end') : (isHebrew ? 'flex-end' : 'flex-start'),
                background: msg.role === 'user' ? '#4f46e5' : 'white',
                color: msg.role === 'user' ? 'white' : '#1e293b',
                padding: '10px 14px',
                borderRadius: '12px',
                maxWidth: '85%',
                fontSize: '0.85rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                lineHeight: '1.4'
              }}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: isHebrew ? 'flex-end' : 'flex-start', background: 'white', padding: '8px 12px', borderRadius: '12px', fontSize: '0.8rem', color: '#64748b', border: '1px solid #e2e8f0' }}>
                {isHebrew ? 'מקליד תשובה...' : 'Typing...'}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ padding: '10px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isHebrew ? 'שאל משהו על ממשק המערכת...' : 'Ask about the interface...'}
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
            />
            <button
              type="submit"
              style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}