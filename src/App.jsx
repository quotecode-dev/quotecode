import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { supabase } from './supabase';
import './App.css';

// ==========================================
// 1. PUBLIC QUOTE VIEW COMPONENT (FOR CLIENTS)
// ==========================================
function PublicQuote() {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: quoteData } = await supabase
        .from('quotes')
        .select(`*, clients ( company_name, email, phone ), quote_items ( * )`)
        .eq('id', id)
        .single();
      
      let settingsData = null;
      if (quoteData && quoteData.user_id) {
        const { data } = await supabase
          .from('business_settings')
          .select('*')
          .eq('user_id', quoteData.user_id)
          .single();
        settingsData = data;
      } else if (quoteData) {
        const { data } = await supabase
          .from('business_settings')
          .select('*')
          .limit(1)
          .single();
        settingsData = data;
      }

      setQuote(quoteData);
      setSettings(settingsData || { business_name: 'ProFlow', plan: 'free' });
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>טוען את הצעת המחיר... / Loading...</div>;
  if (!quote) return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>הצעת המחיר לא נמצאה. / Quote not found.</div>;

  const isLocal = quote.currency === 'ILS';
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
  const formatNum = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const quoteSub = quote.subtotal || quote.quote_items?.reduce((sum, item) => sum + Number(item.total_price || 0), 0) || 0;
  const quoteDiscount = quote.discount || 0;
  const quoteDiscountAmount = (quoteSub * quoteDiscount) / 100;
  const quoteTaxable = quoteSub - quoteDiscountAmount;
  const quoteTaxRate = (quote.tax_rate !== undefined && quote.tax_rate !== null) ? Number(quote.tax_rate) : (isLocal ? 0.18 : 0.00);
  const quoteTaxAmount = quoteTaxable * quoteTaxRate;
  const quoteTotal = quote.total > quoteTaxable ? quote.total : (quoteTaxable + quoteTaxAmount);

  return (
    <div dir={isLocal ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '20px 10px', color: '#333' }}>
      <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 20px auto', textAlign: isLocal ? 'left' : 'right' }}>
        <button onClick={() => window.print()} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          {isLocal ? '🖨️ הדפס / הורד כ-PDF' : '🖨️ Print / Download PDF'}
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '25px 15px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px', flexDirection: isLocal ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            {bizLogo ? (
              <img src={bizLogo} alt="Business Logo" style={{ maxHeight: '60px', maxWidth: '180px', objectFit: 'contain', marginBottom: '8px', display: 'block' }} />
            ) : (
              <h1 style={{ margin: 0, color: '#4f46e5', fontSize: '28px', fontWeight: '900' }}>&lt;/&gt; {bizName}</h1>
            )}
            <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              {bizTaxId && `${isLocal ? 'עוסק/ח.פ:' : 'Tax ID:'} ${bizTaxId} | `} {bizEmail} {bizPhone ? `| ${bizPhone}` : ''}
            </p>
          </div>
          <div style={{ textAlign: isLocal ? 'left' : 'right' }}>
            <h2 style={{ margin: 0, color: '#111827', fontSize: '22px', textTransform: 'uppercase' }}>{isLocal ? 'הצעת מחיר' : 'QUOTE'}</h2>
            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>#{quote.id.slice(0, 8).toUpperCase()}</p>
            <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '14px' }}>{isLocal ? 'תאריך:' : 'Date:'} {new Date(quote.created_at).toLocaleDateString('en-US')}</p>
            <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '14px' }}>{isLocal ? 'בתוקף עד:' : 'Valid Until:'} {quote.valid_until || 'N/A'}</p>
          </div>
        </div>

        <div style={{ marginBottom: '40px', textAlign: isLocal ? 'right' : 'left' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>{isLocal ? 'הוכן עבור:' : 'Prepared For:'}</p>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>{quote.clients?.company_name || 'N/A'}</p>
          <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '15px' }}>{quote.clients?.email || ''}</p>
          {quote.clients?.phone && <p style={{ margin: '2px 0 0', color: '#4b5563', fontSize: '15px', direction: 'ltr', textAlign: isLocal ? 'right' : 'left' }}>{quote.clients.phone}</p>}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', textAlign: isLocal ? 'right' : 'left', minWidth: '450px' }}>
            <thead>
              <tr>
                <th style={{ background: '#f9fafb', padding: '14px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #111827' }}>{isLocal ? 'תיאור' : 'Description'}</th>
                <th style={{ background: '#f9fafb', padding: '14px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #111827', textAlign: 'center' }}>{isLocal ? 'כמות' : 'Qty'}</th>
                <th style={{ background: '#f9fafb', padding: '14px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #111827', textAlign: isLocal ? 'left' : 'right' }}>{isLocal ? 'מחיר יחידה' : 'Unit Price'}</th>
                <th style={{ background: '#f9fafb', padding: '14px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', borderBottom: '2px solid #111827', textAlign: isLocal ? 'left' : 'right' }}>{isLocal ? 'סה"כ' : 'Total'}</th>
              </tr>
            </thead>
            <tbody>
              {quote.quote_items && quote.quote_items.length > 0 ? (
                quote.quote_items.map(item => (
                  <tr key={item.id}>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', color: '#1f2937' }}>{item.description}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', textAlign: 'center', color: '#4b5563' }}>{item.quantity}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', textAlign: isLocal ? 'left' : 'right', color: '#4b5563' }}>{quoteSym}{formatNum(item.unit_price)}</td>
                    <td style={{ padding: '14px', borderBottom: '1px solid #e5e7eb', textAlign: isLocal ? 'left' : 'right', fontWeight: 'bold', color: '#111827' }}>{quoteSym}{formatNum(item.total_price)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ padding: '14px', borderBottom: '1px solid #e5e7eb' }}>{isLocal ? 'שירותים מקצועיים' : 'Professional Services'}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: isLocal ? 'left' : 'right', color: '#4b5563', fontSize: '15px' }}>
          <div>{isLocal ? 'סכום ביניים:' : 'Subtotal:'} {quoteSym}{formatNum(quoteSub)}</div>
          {quoteDiscount > 0 && <div style={{ color: '#ef4444', fontWeight: '600', marginTop: '6px' }}>{isLocal ? `הנחה (${quoteDiscount}%):` : `Discount (${quoteDiscount}%):`} -{quoteSym}{formatNum(quoteDiscountAmount)}</div>}
          {quoteTaxRate > 0 && <div style={{ marginTop: '6px' }}>{isLocal ? 'מע"מ (18%):' : 'VAT (18%):'} {quoteSym}{formatNum(quoteTaxAmount)}</div>}
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#4f46e5', marginTop: '12px' }}>{isLocal ? 'סה"כ לתשלום:' : 'Total Amount:'} {quoteSym}{formatNum(quoteTotal)}</div>
        </div>

        <div style={{ marginTop: '50px', borderTop: '1px solid #e5e7eb', paddingTop: '20px', textAlign: isLocal ? 'right' : 'left' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '5px' }}>{isLocal ? 'תנאים והגבלות' : 'Terms & Conditions'}</p>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{isLocal ? 'שוטף + 30. תודה על העסקאות.' : 'Net 30 days. Thank you for your business.'}</p>
        </div>
      </div>
      
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

// ==========================================
// 2. MAIN DASHBOARD COMPONENT (ADMIN)
// ==========================================
function Dashboard() {
  const [session, setSession] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: 'System connected to Supabase.', type: 'success' });

  // Business Settings state
  const [settingId, setSettingId] = useState(null);
  const [bizName, setBizName] = useState('ProFlow');
  const [bizTaxId, setBizTaxId] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizLogoUrl, setBizLogoUrl] = useState('');
  const [bizPlan, setBizPlan] = useState('free');
  const [bizRole, setBizRole] = useState('user');
  const [allAccounts, setAllAccounts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  const [clientRegion, setClientRegion] = useState('local');
  const [currency, setCurrency] = useState('ILS (₪)');
  const [quoteStatus, setQuoteStatus] = useState('Draft');
  const [validUntil, setValidUntil] = useState('');
  const [discount, setDiscount] = useState(0);
  const [terms, setTerms] = useState('Net 30 days. Thank you for your business.');
  
  const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: 0 }]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  const isHebrew = clientRegion === 'local';

  const t = {
    appName: isHebrew ? bizName : (bizName || 'ProFlow'),
    appSub: isHebrew ? 'מערכת ניהול עסק והצעות מחיר גלובלית' : 'Global SaaS Business & Quoting Platform',
    totalQuotes: isHebrew ? 'סך הכל הצעות' : 'TOTAL QUOTES',
    approvedPaid: isHebrew ? 'אושר / שולם' : 'APPROVED / PAID',
    winRate: isHebrew ? 'אחוז הצלחה' : 'WIN RATE',
    totalRevenue: isHebrew ? 'סך הכנסות' : 'TOTAL REVENUE',
    clientName: isHebrew ? 'שם הלקוח' : 'Client Name',
    clientEmail: isHebrew ? 'אימייל הלקוח' : 'Client Email',
    clientPhone: isHebrew ? 'טלפון הלקוח' : 'Client Phone',
    clientRegion: isHebrew ? 'אזור הלקוח' : 'Client Region',
    localIsrael: isHebrew ? 'מקומי (ישראל)' : 'Local (Israel)',
    international: isHebrew ? 'בינלאומי (חו"ל)' : 'International (Foreign)',
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
    delete: isHebrew ? 'מחק' : 'Delete'
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

  const handleRegionChange = (newRegion) => {
    setClientRegion(newRegion);
    if (newRegion === 'international' && currency.includes('ILS')) {
      setCurrency('USD ($)');
    } else if (newRegion === 'local' && !currency.includes('ILS')) {
      setCurrency('ILS (₪)');
    }
  };

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
      .select(`*, clients ( company_name, email, phone ), quote_items ( * )`)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching quotes:', error.message);
    else setQuotes(data || []);
  }

  async function fetchClients() {
    const { data, error } = await supabase.from('clients').select('id, company_name, email, phone');
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
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
    
    if (data) {
      setSettingId(data.id);
      setBizName(data.business_name || 'ProFlow');
      setBizTaxId(data.tax_id || '');
      setBizEmail(data.email || '');
      setBizPhone(data.phone || '');
      setBizLogoUrl(data.logo_url || '');
      setBizPlan(data.plan || 'free');
      setBizRole(data.role || 'user');
      
      if (data.role === 'super_admin') {
        fetchAllAccounts();
      }
    } else {
      setSettingId(null);
      setBizPlan('free');
      setBizRole('user');
    }
  }

  async function fetchAllAccounts() {
    const { data, error } = await supabase.from('business_settings').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setAllAccounts(data);
    }
  }

  async function handleAdminPlanChange(accountId, newPlan) {
    const { error } = await supabase.from('business_settings').update({ plan: newPlan }).eq('id', accountId);
    if (error) {
      setStatusMsg({ text: 'Error updating user plan: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: 'User plan updated successfully!', type: 'success' });
      fetchAllAccounts();
    }
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    if (!session?.user?.id) return;

    const payload = {
      business_name: bizName,
      tax_id: bizTaxId,
      email: bizEmail,
      phone: bizPhone,
      logo_url: bizLogoUrl,
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passwordInput });
    if (error) setStatusMsg({ text: error.message, type: 'error' });
    else setStatusMsg({ text: 'Logged in successfully', type: 'success' });
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

  const formatNum = (val) => Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
  const discountAmount = (subtotal * Number(discount)) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxRate = clientRegion === 'local' ? 0.18 : 0.00;
  const taxAmount = taxableAmount * taxRate;
  const totalAmount = taxableAmount + taxAmount;

  // Monthly Limits Calculation
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyQuotesCount = quotes.filter(q => {
    const qDate = new Date(q.created_at);
    return qDate.getMonth() === currentMonth && qDate.getFullYear() === currentYear;
  }).length;

  const planLimit = bizPlan === 'free' ? 5 : bizPlan === 'basic' ? 20 : '∞';

  const totalQuotesCount = quotes.length;
  const approvedPaidCount = quotes.filter(q => q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid').length;
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
    
    if (quote.currency === 'EUR') { setCurrency('EUR (€)'); setClientRegion('international'); } 
    else if (quote.currency === 'GBP') { setCurrency('GBP (£)'); setClientRegion('international'); } 
    else if (quote.currency === 'USD') { setCurrency('USD ($)'); setClientRegion('international'); } 
    else { setCurrency('ILS (₪)'); setClientRegion('local'); }

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
    
    if (quote.currency === 'EUR') { setCurrency('EUR (€)'); setClientRegion('international'); } 
    else if (quote.currency === 'GBP') { setCurrency('GBP (£)'); setClientRegion('international'); } 
    else if (quote.currency === 'USD') { setCurrency('USD ($)'); setClientRegion('international'); } 
    else { setCurrency('ILS (₪)'); setClientRegion('local'); }

    setQuoteStatus('Draft');
    setValidUntil(quote.valid_until || '');
    setDiscount(quote.discount || 0);
    
    if (quote.quote_items && quote.quote_items.length > 0) {
      setItems(quote.quote_items.map(item => ({ description: item.description, quantity: item.quantity, unit_price: item.unit_price })));
    } else {
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMsg({ text: isHebrew ? 'ההצעה נטענה לשכפול בהצלחה. לחץ על הלחצן למטה כדי ליצור הצעה חדשה.' : 'Quote loaded for duplication. Save to create a new quote.', type: 'success' });
  };

  const handleEmailQuote = (quote) => {
    if (!quote.clients?.email) {
      setStatusMsg({ text: isHebrew ? 'ללקוח זה אין כתובת אימייל מעודכנת.' : 'This client does not have an email address.', type: 'error' });
      return;
    }

    const quoteSym = getCurrencySymbol(quote.currency);
    const qIsLocal = quote.currency === 'ILS';
    const quoteSub = quote.subtotal || quote.quote_items?.reduce((sum, item) => sum + Number(item.total_price || 0), 0) || 0;
    const quoteDiscountAmount = (quoteSub * (quote.discount || 0)) / 100;
    const quoteTaxable = quoteSub - quoteDiscountAmount;
    const quoteTaxRate = (quote.tax_rate !== undefined && quote.tax_rate !== null) ? Number(quote.tax_rate) : (qIsLocal ? 0.18 : 0.00);
    const quoteTotal = quote.total > quoteTaxable ? quote.total : (quoteTaxable + (quoteTaxable * quoteTaxRate));
    
    const quoteLink = `${window.location.origin}/quote/${quote.id}`;

    const subject = qIsLocal ? `הצעת מחיר #${quote.id.slice(0, 6).toUpperCase()} מ-${bizName}` : `Quote #${quote.id.slice(0, 6).toUpperCase()} from ${bizName}`;
    const body = qIsLocal
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
    const qIsLocal = quote.currency === 'ILS';
    const quoteSub = quote.subtotal || quote.quote_items?.reduce((sum, item) => sum + Number(item.total_price || 0), 0) || 0;
    const quoteDiscountAmount = (quoteSub * (quote.discount || 0)) / 100;
    const quoteTaxable = quoteSub - quoteDiscountAmount;
    const quoteTaxRate = (quote.tax_rate !== undefined && quote.tax_rate !== null) ? Number(quote.tax_rate) : (qIsLocal ? 0.18 : 0.00);
    const quoteTotal = quote.total > quoteTaxable ? quote.total : (quoteTaxable + (quoteTaxable * quoteTaxRate));

    const quoteLink = `${window.location.origin}/quote/${quote.id}`;

    const msg = qIsLocal
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
    setValidUntil('');
    setDiscount(0);
    setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    setStatusMsg({ text: 'Edit cancelled.', type: 'success' });
  };

  async function handleSaveQuote(e) {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      if (!editingQuoteId) {
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
        if (clientPhone !== existingClient.phone) await supabase.from('clients').update({ phone: clientPhone }).eq('id', clientId);
      } else {
        const { data: newClientData, error: clientError } = await supabase.from('clients').insert([{ company_name: clientName, email: clientEmail, phone: clientPhone }]).select();
        if (clientError) throw clientError;
        clientId = newClientData[0].id;
      }

      let dbCurrency = 'ILS';
      if (currency.includes('EUR')) dbCurrency = 'EUR';
      else if (currency.includes('GBP')) dbCurrency = 'GBP';
      else if (currency.includes('USD')) dbCurrency = 'USD';

      const quotePayload = {
        client_id: clientId,
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
      setValidUntil('');
      setDiscount(0);
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
      loadData();
    } catch (err) {
      setStatusMsg({ text: 'Error saving quote: ' + err.message, type: 'error' });
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = (quote.clients?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (quote.status || 'draft').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (!session) {
    return (
      <div style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{ background: '#4f46e5', color: 'white', width: '40px', height: '40px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '10px' }}>&lt;/&gt;</div>
            <h2 style={{ color: '#1e293b', margin: 0, fontSize: '1.5rem' }}>{bizName}</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Sign in to your SaaS dashboard</p>
          </div>
          {statusMsg.text && (
            <div style={{ padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: statusMsg.type === 'success' ? '#166534' : '#991b1b' }}>
              {statusMsg.text}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Email</label>
              <input type="email" name="loginEmail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required placeholder="user@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Password</label>
              <input type="password" name="loginPassword" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '20px', color: '#333', textAlign: isHebrew ? 'right' : 'left' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '25px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
            <div style={{ background: '#4f46e5', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>&lt;/&gt;</div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>{t.appName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
            {bizRole === 'super_admin' && <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>SUPER ADMIN</span>}
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{session.user.email}</span>
            <button onClick={handleSignOut} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Sign Out</button>
          </div>
        </div>

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

        {statusMsg.text && (
          <div style={{ padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500', background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: statusMsg.type === 'success' ? '#166534' : '#991b1b' }}>
            {statusMsg.text}
          </div>
        )}

        {/* Business Settings & Plan Widget */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#1e293b', margin: 0, marginBottom: '20px' }}>{t.businessSettings}</h2>
          
          {bizPlan !== 'pro' && (
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ color: '#92400e', fontSize: '0.9rem', fontWeight: '600' }}>
                {isHebrew ? '⭐ רוצה להוסיף את הלוגו שלך להצעות המחיר ולשדרג את מיתוג העסק? שדרג עכשיו לחבילת Pro!' : '⭐ Want to add your logo and upgrade your business branding? Upgrade to Pro!'}
              </span>
              <button 
                type="button" 
                onClick={() => alert(isHebrew ? 'כאן המערכת תעביר את הלקוח לעמוד תשלום (Stripe/PayPal) לאישור השדרוג.' : 'Here the system will redirect the client to a payment gateway (Stripe/PayPal) to process the upgrade.')} 
                style={{ background: '#d97706', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                {isHebrew ? 'שדרג ל-Pro' : 'Upgrade to Pro'}
              </button>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.clientRegion}</label>
                <select name="clientRegion" value={clientRegion} onChange={(e) => handleRegionChange(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', boxSizing: 'border-box' }}>
                  <option value="local">{t.localIsrael}</option>
                  <option value="international">{t.international}</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.currency}</label>
                <select name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', boxSizing: 'border-box' }}>
                  {clientRegion === 'local' && <option>ILS (₪)</option>}
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
                <span>{t.subtotal}</span>
                <span>{sym}{formatNum(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ef4444', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                  <span>{isHebrew ? `הנחה (${discount}%):` : `Discount (${discount}%):`}</span>
                  <span>-{sym}{formatNum(discountAmount)}</span>
                </div>
              )}
              {clientRegion === 'local' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                  <span>{t.vat}</span>
                  <span>{sym}{formatNum(taxAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', marginTop: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                <span>{t.totalAmount}</span>
                <span style={{ color: '#4f46e5' }}>{sym}{formatNum(totalAmount)} {currency.includes('EUR') ? 'EUR' : currency.includes('GBP') ? 'GBP' : currency.includes('USD') ? 'USD' : 'ILS'}</span>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', background: editingQuoteId ? '#10b981' : '#2563eb', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {editingQuoteId ? t.updateQuote : t.generateSave}
            </button>
          </form>
        </div>

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
                        : (isHebrew ? 'לא נמצאו תוצאות לחיפוש ולסינון הנוכחיים.' : 'No results found for this search and filter.')}
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map((quote) => {
                    const quoteSym = getCurrencySymbol(quote.currency);
                    const qIsHebrew = quote.currency === 'ILS';
                    const statusText = quote.status ? quote.status.charAt(0).toUpperCase() + quote.status.slice(1) : 'Draft';
                    let translatedStatus = statusText;
                    if (qIsHebrew) {
                      if (statusText.toLowerCase() === 'draft') translatedStatus = 'טיוטה';
                      else if (statusText.toLowerCase() === 'sent') translatedStatus = 'נשלח';
                      else if (statusText.toLowerCase() === 'approved') translatedStatus = 'אושר';
                      else if (statusText.toLowerCase() === 'paid') translatedStatus = 'שולם';
                    }
                    return (
                      <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                        <td style={{ padding: '12px', fontWeight: '600', color: '#4f46e5' }}>#{quote.id.slice(0, 6)}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: '600', color: '#1e293b' }}>{quote.clients?.company_name || 'N/A'}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>{quote.clients?.email}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: quote.status?.toLowerCase() === 'approved' ? '#dcfce7' : quote.status?.toLowerCase() === 'paid' ? '#dbeafe' : '#f1f5f9',
                            color: quote.status?.toLowerCase() === 'approved' ? '#166534' : quote.status?.toLowerCase() === 'paid' ? '#1e40af' : '#475569'
                          }}>
                            {translatedStatus}
                          </span>
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
        
        {/* SUPER ADMIN PANEL */}
        {bizRole === 'super_admin' && (
          <div style={{ background: '#fef3c7', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '30px', border: '2px solid #f59e0b' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#92400e', margin: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              👑 Super Admin Panel
            </h2>
            <p style={{ color: '#b45309', marginBottom: '20px' }}>
              {isHebrew ? 'כאן תוכל לראות את כל המשתמשים הרשומים במערכת ולנהל את החבילות שלהם.' : 'View all registered users and manage their subscription plans.'}
            </p>
            
            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '500px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #fde68a', color: '#92400e', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Business Name</th>
                    <th style={{ padding: '12px' }}>Current Plan</th>
                    <th style={{ padding: '12px' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {allAccounts.map(acc => (
                    <tr key={acc.id} style={{ borderBottom: '1px solid #fef3c7' }}>
                      <td style={{ padding: '12px', color: '#92400e', fontSize: '0.85rem' }}>{acc.user_id?.slice(0,8)}...</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{acc.email || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{acc.business_name}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// 3. ROOT APP (ROUTER SETUP)
// ==========================================
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