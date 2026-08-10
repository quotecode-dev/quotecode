import React, { useState, useRef, useEffect } from 'react';

export default function AIChatWidget({ isHebrew }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const defaultWelcome = isHebrew 
      ? 'שלום! אני עוזר ה-AI של ProFlow. איך אעזור לך בממשק המערכת היום?' 
      : 'Hello! I am ProFlow AI assistant. How can I help you with the interface today?';

    try {
      const saved = sessionStorage.getItem('proflow_ai_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          if (parsed[0].role === 'assistant') {
            parsed[0].content = defaultWelcome;
          }
          return parsed;
        }
      }
    } catch (e) {}
    return [
      { role: 'assistant', content: defaultWelcome }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages(prev => {
      if (prev.length > 0 && prev[0].role === 'assistant') {
        const updated = [...prev];
        updated[0] = {
          role: 'assistant',
          content: isHebrew 
            ? 'שלום! אני עוזר ה-AI של ProFlow. איך אעזור לך בממשק המערכת היום?' 
            : 'Hello! I am ProFlow AI assistant. How can I help you with the interface today?'
        };
        return updated;
      }
      return prev;
    });
  }, [isHebrew]);

  useEffect(() => {
    try {
      sessionStorage.setItem('proflow_ai_chat', JSON.stringify(messages));
    } catch (e) {}
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const processUserQuery = (queryText) => {
    const lower = queryText.toLowerCase().trim();
    let reply = '';
    let options = null;

    if (isHebrew) {
      // 1. בדיקה ראשונה ומדויקת למילים בודדות דו-משמעיות להצגת תפריט בחירה
      if (lower === 'מייל' || lower === 'אימייל') {
        reply = 'האם אתה מתכוון ליצירת קשר עם שירות הלקוחות, או לשליחת הצעת מחיר במייל ללקוח?';
        options = [
          { label: '📞 יצירת קשר עם שירות הלקוחות', action: 'contact_support' },
          { label: '📄 שליחת הצעת מחיר במייל', action: 'send_quote_email' }
        ];
      } else if (lower === 'עריכה' || lower === 'לערוך' || lower === 'שינוי') {
        reply = 'למה אתה מתכוון כשאתה אומר עריכה? בחר את האפשרות המתאימה:';
        options = [
          { label: '✏️ עריכת הצעת מחיר קיימת', action: 'edit_quote' },
          { label: '👥 עריכת פרטי לקוח (CRM)', action: 'edit_client' },
          { label: '📦 עריכת שירות/מוצר בקטלוג', action: 'edit_catalog' },
          { label: '⚙️ עריכת הגדרות עסק', action: 'edit_settings' }
        ];
      } else if (lower === 'מחיקה' || lower === 'למחוק') {
        reply = 'מה ברצונך למחוק? בחר את האפשרות הרצויה:';
        options = [
          { label: '🗑️ מחיקת הצעת מחיר', action: 'delete_quote' },
          { label: '👥 מחיקת לקוח מספר הלקוחות', action: 'delete_client' },
          { label: '📦 מחיקת שירות מהקטלוג', action: 'delete_catalog' },
          { label: '📊 מחיקת הוצאה מהדוחות', action: 'delete_expense' }
        ];
      } else if (lower === 'לקוח' || lower === 'לקוחות') {
        reply = 'האם אתה מתכוון לניהול ספר הלקוחות או ליצירת הצעה ללקוח חדש?';
        options = [
          { label: '👥 ניהול וצפייה בספר הלקוחות (CRM)', action: 'manage_clients' },
          { label: '➕ יצירת הצעת מחיר חדשה ללקוח', action: 'new_quote' }
        ];
      } 
      // 2. שאר התנאים הספציפיים
      else if (lower.includes('שולח') && lower.includes('הצעה') && lower.includes('מייל')) {
        reply = 'כדי לשלוח הצעת מחיר במייל ללקוח: פתח את תפריט "פעולות ▼" בשורת ההצעה המבוקשת ובחר באפשרות "שלח במייל". המערכת תשלח את ההצעה אוטומטית לכתובת המייל של הלקוח דרך השרת שלנו (info@quotecodepro.com).';
      } else if (lower.includes('קשר') || lower.includes('פנייה') || lower.includes('לפנות') || lower.includes('אימייל של שירות') || lower.includes('מייל של שירות') || lower.includes('מה האימייל') || lower.includes('כתובת מייל') || lower.includes('שירות לקוחות') || lower.includes('תמיכה') || lower.includes('support')) {
        reply = 'ניתן ליצור איתנו קשר ישירות דרך כתובת האימייל של שירות הלקוחות: info@quotecodepro.com, או להמשיך לקבל מענה מיידי וזמין 24/7 כאן בעוזר ה-AI. לידיעתך, הפעילות שלנו מתנהלת באופן דיגיטלי בענן ללא קבלת קהל פיזית במשרדים.';
      } else if (lower.includes('קטלוג') || lower.includes('מוצר') || lower.includes('שירות') || lower.includes('פריט') || lower.includes('להוסיף')) {
        reply = 'כדי להוסיף מוצר או שירות לקטלוג: גלול למטה בטאב "הצעות מחיר" הראשי אל טבלת "קטלוג שירותים ומוצרים". הזן בשדה הייעודי את שם השירות/המוצר ואת המחיר הקבוע שלו, ולחץ על כפתור "הוסף לקטלוג". לאחר מכן תוכל לבחור אותו בלחיצה מהירה מתוך רשימת הקטלוג בעת יצירת הצעת מחיר!';
      } else if (lower.includes('פעולות') || lower.includes('תפריט') || lower.includes('כפתור') || lower.includes('צפה')) {
        reply = 'בכל שורה של הצעת מחיר בטבלה ישנו כפתור "פעולות ▼" מצד שמאל. בלחיצה עליו נפתח תפריט המאפשר לך: לצפות במסמך (👁️), לערוך אותו (✏️), לשכפל (📋), לשלוח בוואטסאפ או במייל, או למחוק את ההצעה.';
      } else if (lower.includes('סיכום') || lower.includes('הזמנות') || lower.includes('רשימה') || lower.includes('היסטוריה') || lower.includes('טבלה')) {
        reply = 'את סיכום כל ההצעות וההזמנות ניתן לראות בטאב "הצעות מחיר" הראשי. הטבלה מציגה את מספר ההזמנה, שם הלקוח, תיאור הפריט הראשון, הסכום הכולל, תאריך היצירה, סטטוס העסק (טיוטה, נשלח, אושר, שולם) ומספר צפיות אמיתיות של לקוחות (👁️).';
      } else if (lower.includes('הצעה') || lower.includes('חדשה') || lower.includes('ליצור') || lower.includes('הפקת')) {
        reply = 'כדי ליצור הצעת מחיר חדשה לחץ על כפתור "➕ צור הצעת מחיר חדשה" בראש הדשבורד. מלא את פרטי הלקוח, בחר את סוג הלקוח (עסקי או פרטי), הוסף פריטים (ידנית או מהקטלוג) ולחיצה על "הפק ושמור בענן" תשמור את ההצעה.';
      } else if (lower.includes('וואטסאפ') || lower.includes('whatsapp') || lower.includes('וואט סאפ'))  {
        reply = 'שליחת הצעת מחיר ישירות בוואטסאפ מתבצעת דרך תפריט "פעולות ▼" בשורת ההצעה (פיצ\'ר בלעדי למנויי PRO) המייצר הודעה מוכנה עם לינק ישיר ללקוח.';
      } else if (lower.includes('מע"מ') || lower.includes('vat') || lower.includes('מס')) {
        reply = 'המערכת מחשבת מע"מ אוטומטית בהתאם להגדרות העסק: 18% ללקוחות בארץ (עם אפשרות לחישוב כולל/לפני מע"מ לפי סוג הלקוח) ו-0% ללקוחות מחו"ל.';
      } else if (lower.includes('פיזי') || lower.includes('משרד') || lower.includes('להגיע') || lower.includes('כתובת') || lower.includes('פגישה') || lower.includes('פרונטלית') || lower.includes('סניף')) {
        reply = 'מערכת ProFlow הינה פלטפורמת SaaS עננית ודיגיטלית מלאה הפועלת אונליין, ולכן אינה מקבלת קהל באופן פיזי במשרדים. כל הפעולות, ניהול העסק, הפקת ההצעות והתמיכה מתבצעות באופן דיגיטלי נוח ומהיר ישירות דרך המערכת או באמצעות יצירת קשר עמנו באימייל (info@quotecodepro.com) ובעוזר ה-AI כאן 24/7!';
      } else if (lower.includes('מיון') || lower.includes('סדר') || lower.includes('למיין') || lower.includes('עמודות')) {
        reply = 'ניתן למיין את טבלת ההצעות בקלות בלחיצה על כותרות העמודות בטבלה (מספר הזמנה, שם לקוח, סכום, תאריך, סטטוס או צפיות).';
      } else if (lower.includes('הוצאות') || lower.includes('דוחות') || lower.includes('רווח') || lower.includes('הכנסות'))  {
        reply = 'בטאב "הוצאות/הכנסות" (למנהלי מערכת) תוכל לנהל את הוצאות העסק השוטפות, לצפות בגרפים שנתיים של הכנסות מול הוצאות, ולייצא דוחות מרוכזים לאקסל (CSV).';
      } else if (lower.includes('אזור') || lower.includes('lcl') || lower.includes('intl') || lower.includes('משתמשים') || lower.includes('אדמין')) {
        reply = 'פאנל ה-Super Admin מאפשר לראות את כל משתמשי המערכת, לנהל את החבילות שלהם (Free, Basic, Pro), להעניק מנוי לכל החיים (Lifetime), ולשנות את אזור הפעילות (LCL לישראל בירוק, או Intl לחו"ל באדום עם התראת אישור).';
      } else {
        reply = 'מערכת ProFlow מספקת ניהול עסק חכם, הצעות מחיר, קטלוג מוצרים ושירותים, חתימות דיגיטליות, ניהול אזורי פעילות LCL/Intl ודוחות פיננסיים. שאל אותי למשל על: הוספת מוצר לקטלוג, יצירת הצעת מחיר, ניהול לקוחות או יצירת קשר!';
      }
    } else {
      if (lower === 'email' || lower === 'mail') {
        reply = 'Are you referring to contacting customer support via email, or sending a quote via email to a client?';
        options = [
          { label: '📞 Contact Support', action: 'contact_support' },
          { label: '📄 Send Quote via Email', action: 'send_quote_email' }
        ];
      } else if (lower === 'edit' || lower === 'change') {
        reply = 'What would you like to edit? Please select an option:';
        options = [
          { label: '✏️ Edit an existing quote', action: 'edit_quote' },
          { label: '👥 Edit client details (CRM)', action: 'edit_client' },
          { label: '📦 Edit catalog service/product', action: 'edit_catalog' },
          { label: '⚙️ Edit business settings', action: 'edit_settings' }
        ];
      } else if (lower === 'delete' || lower === 'remove') {
        reply = 'What would you like to delete? Please select an option:';
        options = [
          { label: '🗑️ Delete a quote', action: 'delete_quote' },
          { label: '👥 Delete a client', action: 'delete_client' },
          { label: '📦 Delete a catalog item', action: 'delete_catalog' },
          { label: '📊 Delete an expense', action: 'delete_expense' }
        ];
      } else if (lower === 'client' || lower === 'clients') {
        reply = 'Are you referring to managing your client database or creating a new quote for a client?';
        options = [
          { label: '👥 Manage Clients Database (CRM)', action: 'manage_clients' },
          { label: '➕ Create New Quote for Client', action: 'new_quote' }
        ];
      } else if (lower.includes('send') && lower.includes('quote') && lower.includes('email')) {
        reply = 'To send a quote via email to your client, click the "Actions ▼" menu on the quote row and select "Send Email" (sent via info@quotecodepro.com).';
      } else if (lower.includes('support') || lower.includes('email') || lower.includes('contact') || lower.includes('reach out')) {
        reply = 'You can contact our support team directly via email at info@quotecodepro.com, or continue getting immediate 24/7 assistance right here through the AI assistant. Please note that ProFlow operates as a fully digital cloud platform without public walk-in offices.';
      } else if (lower.includes('catalog') || lower.includes('product') || lower.includes('service') || lower.includes('item') || lower.includes('add')) {
        reply = 'To add a product or service to the catalog: scroll down on the main "Quotes" tab to the "Services & Products Catalog" section. Enter the service name and fixed price, then click "Add to Catalog". You can then quickly select it when building quotes!';
      } else if (lower.includes('action') || lower.includes('menu') || lower.includes('button') || lower.includes('view')) {
        reply = 'In the quotes table, click the "Actions ▼" button on any row to open a menu where you can view, edit, duplicate, WhatsApp/email, or delete the quote.';
      } else if (lower.includes('quote') || lower.includes('create')) {
        reply = 'To create a new quote, click "Create New Quote" at the top of your dashboard, fill in client details, add items, and click generate.';
      } else if (lower.includes('whatsapp')) {
        reply = 'You can send quotes directly via WhatsApp using the actions menu in your quotes list (PRO feature).';
      } else if (lower.includes('physical') || lower.includes('office') || lower.includes('address') || lower.includes('visit') || lower.includes('meeting') || lower.includes('location') || lower.includes('in-person')) {
        reply = 'ProFlow is a fully cloud-based digital SaaS platform operating online, and therefore does not have a physical walk-in office or public reception. All business operations, quote generation, and support are managed seamlessly and securely online via the platform or through our digital support channels 24/7!';
      } else if (lower.includes('sort') || lower.includes('column')) {
        reply = 'You can sort the quotes table by clicking on any column header (Order #, Client Name, Amount, Date, Status, or Views).';
      } else if (lower.includes('lcl') || lower.includes('intl') || lower.includes('region') || lower.includes('admin')) {
        reply = 'In the Super Admin panel, you can manage user subscription plans, grant Lifetime access, and control business regions (LCL in green for Israel or Intl in red for international).';
      } else {
        reply = 'ProFlow provides smart business management, quotes, product catalog, digital signatures, region management (LCL/Intl), and financial reports. Feel free to ask about adding catalog items, creating quotes, managing clients, or contacting support!';
      }
    }

    return { reply, options };
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    setTimeout(() => {
      const { reply, options } = processUserQuery(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, options }]);
      setLoading(false);
    }, 400);
  };

  const handleOptionSelect = (action) => {
    let simulatedQuery = '';
    if (action === 'contact_support') {
      simulatedQuery = isHebrew ? 'יצירת קשר עם שירות הלקוחות' : 'Contact Support';
    } else if (action === 'send_quote_email') {
      simulatedQuery = isHebrew ? 'שליחת הצעת מחיר במייל' : 'Send Quote via Email';
    } else if (action === 'edit_quote') {
      simulatedQuery = isHebrew ? 'עריכת הצעת מחיר' : 'Edit an existing quote';
    } else if (action === 'edit_client') {
      simulatedQuery = isHebrew ? 'עריכת פרטי לקוח' : 'Edit client details';
    } else if (action === 'edit_catalog') {
      simulatedQuery = isHebrew ? 'עריכת שירות בקטלוג' : 'Edit catalog service';
    } else if (action === 'edit_settings') {
      simulatedQuery = isHebrew ? 'עריכת הגדרות עסק' : 'Edit business settings';
    } else if (action === 'delete_quote') {
      simulatedQuery = isHebrew ? 'מחיקת הצעת מחיר' : 'Delete a quote';
    } else if (action === 'delete_client') {
      simulatedQuery = isHebrew ? 'מחיקת לקוח' : 'Delete a client';
    } else if (action === 'delete_catalog') {
      simulatedQuery = isHebrew ? 'מחיקת שירות מהקטלוג' : 'Delete a catalog item';
    } else if (action === 'delete_expense') {
      simulatedQuery = isHebrew ? 'מחיקת הוצאה' : 'Delete an expense';
    } else if (action === 'manage_clients') {
      simulatedQuery = isHebrew ? 'ניהול ספר לקוחות' : 'Manage Clients Database';
    } else if (action === 'new_quote') {
      simulatedQuery = isHebrew ? 'יצירת הצעת מחיר חדשה' : 'Create New Quote';
    }

    setMessages(prev => [...prev, { role: 'user', content: simulatedQuery }]);
    setLoading(true);

    setTimeout(() => {
      const { reply } = processUserQuery(simulatedQuery);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, options: null }]);
      setLoading(false);
    }, 300);
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
                lineHeight: '1.4',
                textAlign: isHebrew ? 'right' : 'left'
              }}>
                {idx === 0 ? (isHebrew ? 'שלום! אני עוזר ה-AI של ProFlow. איך אעזור לך בממשק המערכת היום?' : 'Hello! I am ProFlow AI assistant. How can I help you with the interface today?') : msg.content}
                
                {msg.options && msg.options.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                    {msg.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(opt.action)}
                        style={{
                          background: '#f1f5f9',
                          color: '#4f46e5',
                          border: '1px solid #cbd5e1',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          textAlign: isHebrew ? 'right' : 'left',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = '#e0e7ff'; }}
                        onMouseLeave={(e) => { e.target.style.background = '#f1f5f9'; }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
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
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', textAlign: isHebrew ? 'right' : 'left' }}
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