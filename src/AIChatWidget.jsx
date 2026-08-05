import React, { useState, useRef, useEffect } from 'react';

export default function AIChatWidget({ isHebrew }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: isHebrew ? 'שלום! אני עוזר ה-AI של ProFlow. איך אעזור לך היום?' : 'Hello! I am ProFlow AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
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
        if (lower.includes('הצעה') || lower.includes('חדשה') || lower.includes('יוצר') || lower.includes('הזמנה')) {
          reply = 'כדי ליצור הצעת מחיר חדשה, לחץ על כפתור "➕ צור הצעת מחיר חדשה" בדשבורד הראשי, מלא את פרטי הלקוח, הוסף פריטים ושמור בענן.';
        } else if (lower.includes('לקוח') || lower.includes('crm')) {
          reply = 'בטאב "לקוחות" תוכל לראות את כל ספר הלקוחות שלך, לנהל כתובות, ח.פ ותנאי תשלום לכל לקוח.';
        } else if (lower.includes('וואטסאפ') || lower.includes('whatsapp'))  {
          reply = 'ניתן לשלוח הצעות מחיר ישירות בוואטסאפ ללקוח דרך כפתור הוואטסאפ בשורת ההצעה (זמין למנויי PRO).';
        } else if (lower.includes('מייל') || lower.includes('אימייל')) {
          reply = 'ניתן לשלוח הצעת מחיר במייל בלחיצה על כפתור השטרודל (@) בשורת ההצעה. האימייל יישלח אוטומטית דרך כתובת העסק שלך ב-Namecheap.';
        } else if (lower.includes('מע"מ') || lower.includes('vat')) {
          reply = 'המערכת מחשבת מע"מ אוטומטית לפי 18% ללקוחות בארץ ו-0% ללקוחות מחו"ל בהתאם להגדרות העסק.';
        } else {
          reply = `שאלתך התקבלה בהצלחה! מערכת ProFlow מסייעת לך בניהול עסק חכם, הפקת הצעות מחיר, מעקב צפיות, ניהול הוצאות ודוחות כספיים. האם תרצה עזרה בנושא מסוים?`;
        }
      } else {
        if (lower.includes('quote') || lower.includes('create')) {
          reply = 'To create a new quote, click on "Create New Quote" on your dashboard, fill in client details, add items, and save.';
        } else if (lower.includes('client') || lower.includes('crm')) {
          reply = 'In the "Clients" tab you can manage your client database, tax IDs, and contact info.';
        } else if (lower.includes('whatsapp')) {
          reply = 'You can send quotes directly via WhatsApp using the WhatsApp icon button in your quotes list (PRO feature).';
        } else {
          reply = `I am here to help you manage your business, quotes, clients, and finances with ProFlow. How can I assist further?`;
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
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>{isHebrew ? '🟢 זמין 24/7 לעזרה' : '🟢 Available 24/7'}</div>
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
              placeholder={isHebrew ? 'כתוב הודעה לשירות הלקוחות...' : 'Type a message...'}
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