import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: 'System connected to Supabase.', type: 'success' });

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Edit mode state
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  // Client Region & Currency state
  const [clientRegion, setClientRegion] = useState('local');
  const [currency, setCurrency] = useState('ILS (₪)');
  
  const [quoteStatus, setQuoteStatus] = useState('Draft');
  const [validUntil, setValidUntil] = useState('');
  const [discount, setDiscount] = useState(0);
  const [terms, setTerms] = useState('Net 30 days. Thank you for your business.');
  
  // Items state
  const [items, setItems] = useState([
    { description: '', quantity: 1, unit_price: 0 }
  ]);

  // Dynamic localization labels based on clientRegion
  const isHebrew = clientRegion === 'local';

  const t = {
    appName: isHebrew ? 'קווטקוד פרו' : 'QuoteCode Pro',
    appSub: isHebrew ? 'מערכת ניהול הצעות מחיר וחשבוניות גלובלית' : 'Global SaaS Quoting & Invoicing Platform',
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
    addItem: isHebrew ? '+ הוסף פריט' : '+ Add Item',
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
    searchQuote: isHebrew ? 'חיפוש שם לקוח או מס׳ הצעה...' : 'Search client or quote #...',
    filterStatus: isHebrew ? 'כל הסטטוסים' : 'All Statuses',
    actions: isHebrew ? 'פעולות' : 'Actions',
    edit: isHebrew ? 'ערוך' : 'Edit',
    duplicate: isHebrew ? 'שכפל' : 'Duplicate',
    pdfPrint: isHebrew ? 'הדפס / PDF' : 'PDF / Print',
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
  }

  async function fetchQuotes() {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        clients ( company_name, email ),
        quote_items ( * )
      `)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching quotes:', error.message);
    else setQuotes(data || []);
  }

  async function fetchClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('id, company_name, email');
    if (error) console.error('Error fetching clients:', error.message);
    else setClients(data || []);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });
    if (error) {
      setStatusMsg({ text: error.message, type: 'error' });
    } else {
      setStatusMsg({ text: 'Logged in successfully', type: 'success' });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const formatNum = (val) => {
    return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
  const discountAmount = (subtotal * Number(discount)) / 100;
  const taxableAmount = subtotal - discountAmount;
  
  const taxRate = clientRegion === 'local' ? 0.18 : 0.00;
  const taxAmount = taxableAmount * taxRate;
  const totalAmount = taxableAmount + taxAmount;

  const totalQuotesCount = quotes.length;
  const approvedPaidCount = quotes.filter(q => q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid').length;
  const winRate = totalQuotesCount > 0 ? Math.round((approvedPaidCount / totalQuotesCount) * 100) : 0;
  const totalRevenue = quotes
    .filter(q => q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid')
    .reduce((sum, q) => sum + Number(q.total || 0), 0);

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
    setClientPhone('');
    
    if (quote.currency === 'EUR') {
      setCurrency('EUR (€)');
      setClientRegion('international');
    } else if (quote.currency === 'GBP') {
      setCurrency('GBP (£)');
      setClientRegion('international');
    } else if (quote.currency === 'USD') {
      setCurrency('USD ($)');
      setClientRegion('international');
    } else {
      setCurrency('ILS (₪)');
      setClientRegion('local');
    }

    setQuoteStatus(quote.status ? quote.status.charAt(0).toUpperCase() + quote.status.slice(1) : 'Draft');
    setValidUntil(quote.valid_until || '');
    setDiscount(quote.discount || 0);
    
    if (quote.quote_items && quote.quote_items.length > 0) {
      setItems(quote.quote_items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price
      })));
    } else {
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMsg({ text: `Editing Quote #${quote.id.slice(0, 6)}...`, type: 'success' });
  };

  const handleDuplicateQuote = (quote) => {
    setEditingQuoteId(null); // Clear ID to ensure it creates a NEW quote
    setClientName(quote.clients?.company_name || '');
    setClientEmail(quote.clients?.email || '');
    setClientPhone('');
    
    if (quote.currency === 'EUR') {
      setCurrency('EUR (€)');
      setClientRegion('international');
    } else if (quote.currency === 'GBP') {
      setCurrency('GBP (£)');
      setClientRegion('international');
    } else if (quote.currency === 'USD') {
      setCurrency('USD ($)');
      setClientRegion('international');
    } else {
      setCurrency('ILS (₪)');
      setClientRegion('local');
    }

    setQuoteStatus('Draft'); // Duplicated quotes start as draft
    setValidUntil(quote.valid_until || '');
    setDiscount(quote.discount || 0);
    
    if (quote.quote_items && quote.quote_items.length > 0) {
      setItems(quote.quote_items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price
      })));
    } else {
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMsg({ 
      text: isHebrew 
        ? 'ההצעה נטענה לשכפול בהצלחה. לחץ על הלחצן למטה כדי ליצור הצעה חדשה.' 
        : 'Quote loaded for duplication. Save to create a new quote.', 
      type: 'success' 
    });
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
    try {
      let clientId;
      const existingClient = clients.find(c => c.company_name?.toLowerCase() === clientName.toLowerCase());
      
      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClientData, error: clientError } = await supabase
          .from('clients')
          .insert([{ 
            company_name: clientName, 
            email: clientEmail
          }])
          .select();
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
        valid_until: validUntil || null
      };

      let quoteId;

      if (editingQuoteId) {
        const { error: updateError } = await supabase
          .from('quotes')
          .update(quotePayload)
          .eq('id', editingQuoteId);

        if (updateError) throw updateError;
        quoteId = editingQuoteId;

        await supabase.from('quote_items').delete().eq('quote_id', quoteId);
      } else {
        const { data: quoteData, error: quoteError } = await supabase
          .from('quotes')
          .insert([quotePayload])
          .select();

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

      const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(quoteItemsToInsert);

      if (itemsError) throw itemsError;

      setStatusMsg({ 
        text: editingQuoteId ? `Quote #${editingQuoteId.slice(0, 6)} successfully updated!` : `Quote successfully created and saved to cloud! Total: ${sym}${formatNum(totalAmount)}`, 
        type: 'success' 
      });
      
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

  async function handleDeleteQuote(id) {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    if (error) {
      setStatusMsg({ text: 'Error deleting quote: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: 'Quote deleted successfully', type: 'success' });
      loadData();
    }
  }

  const handlePrintQuote = (quote) => {
    const quoteSym = getCurrencySymbol(quote.currency);
    const isLocal = quote.currency === 'ILS';
    const quoteTaxRate = (quote.tax_rate !== undefined && quote.tax_rate !== null) ? Number(quote.tax_rate) : (isLocal ? 0.18 : 0.00);
    const quoteSub = quote.subtotal || quote.quote_items?.reduce((sum, item) => sum + Number(item.total_price || 0), 0) || 0;
    const quoteTaxAmount = quoteSub * quoteTaxRate;
    const quoteTotal = quote.total > quoteSub ? quote.total : (quoteSub + quoteTaxAmount);

    const lblQuote = isLocal ? 'הצעת מחיר' : 'QUOTE';
    const lblPreparedFor = isLocal ? 'הוכן עבור:' : 'Prepared For:';
    const lblDate = isLocal ? 'תאריך:' : 'Date:';
    const lblValidUntil = isLocal ? 'בתוקף עד:' : 'Valid Until:';
    const lblDesc = isLocal ? 'תיאור' : 'Description';
    const lblQty = isLocal ? 'כמות' : 'Qty';
    const lblUnitPrice = isLocal ? 'מחיר יחידה' : 'Unit Price';
    const lblTotal = isLocal ? 'סה"כ' : 'Total';
    const lblSubtotal = isLocal ? 'סכום ביניים:' : 'Subtotal:';
    const lblVat = isLocal ? 'מע"מ (18%):' : 'VAT (18%):';
    const lblGrandTotal = isLocal ? 'סה"כ לתשלום:' : 'Total Amount:';
    const lblTerms = isLocal ? 'תנאים והגבלות' : 'Terms & Conditions';
    const lblTermsText = isLocal ? 'שוטף + 30. תודה על העסקאות.' : 'Net 30 days. Thank you for your business.';

    const itemsRows = quote.quote_items && quote.quote_items.length > 0 
      ? quote.quote_items.map(item => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: ${isLocal ? 'right' : 'left'};">${item.description}</td>
            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
            <td style="padding: 12px; text-align: ${isLocal ? 'left' : 'right'}; border-bottom: 1px solid #e5e7eb;">${quoteSym}${formatNum(item.unit_price)}</td>
            <td style="padding: 12px; text-align: ${isLocal ? 'left' : 'right'}; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${quoteSym}${formatNum(item.total_price)}</td>
          </tr>
        `).join('')
      : `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;" colspan="4">${isLocal ? 'שירותים מקצועיים' : 'Professional Services'}</td>
          </tr>
        `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html dir="${isLocal ? 'rtl' : 'ltr'}">
        <head>
          <title>${lblQuote} #${quote.id.slice(0, 8).toUpperCase()}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; background: #fff; text-align: ${isLocal ? 'right' : 'left'}; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; flex-direction: ${isLocal ? 'row-reverse' : 'row'}; }
            .title { font-size: 26px; font-weight: 800; color: #4f46e5; }
            .client-info { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f9fafb; padding: 12px; text-align: ${isLocal ? 'right' : 'left'}; font-size: 12px; color: #6b7280; text-transform: uppercase; border-bottom: 2px solid #111827; }
            th:nth-child(2) { text-align: center; }
            th:nth-child(3), th:nth-child(4) { text-align: ${isLocal ? 'left' : 'right'}; }
            .total-section { text-align: ${isLocal ? 'left' : 'right'}; margin-top: 20px; font-size: 15px; color: #4b5563; }
            .grand-total { font-size: 20px; font-weight: bold; color: #4f46e5; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">&lt;/&gt; QuoteCode Pro</div>
              <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Global SaaS Quoting & Invoicing Platform</p>
            </div>
            <div style="text-align: ${isLocal ? 'left' : 'right'};">
              <h2 style="margin: 0; color: #111827;">${lblQuote}</h2>
              <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">#${quote.id.slice(0, 8).toUpperCase()}</p>
              <p style="margin: 2px 0 0; color: #6b7280; font-size: 14px;">${lblDate} ${new Date(quote.created_at).toLocaleDateString('en-US')}</p>
              <p style="margin: 2px 0 0; color: #6b7280; font-size: 14px;">${lblValidUntil} ${quote.valid_until || 'N/A'}</p>
            </div>
          </div>

          <div class="client-info">
            <p style="font-size: 12px; font-weight: bold; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px;">${lblPreparedFor}</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111827;">${quote.clients?.company_name || 'N/A'}</p>
            <p style="margin: 2px 0 0; color: #4b5563; font-size: 14px;">${quote.clients?.email || ''}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>${lblDesc}</th>
                <th style="text-align: center;">${lblQty}</th>
                <th style="text-align: ${isLocal ? 'left' : 'right'};">${lblUnitPrice}</th>
                <th style="text-align: ${isLocal ? 'left' : 'right'};">${lblTotal}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="total-section">
            <div>${lblSubtotal} ${quoteSym}${formatNum(quoteSub)}</div>
            ${quoteTaxRate > 0 ? `<div>${lblVat} ${quoteSym}${formatNum(quoteTaxAmount)}</div>` : ''}
            <div class="grand-total">${lblGrandTotal} ${quoteSym}${formatNum(quoteTotal)}</div>
          </div>

          <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="font-size: 12px; font-weight: bold; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px;">${lblTerms}</p>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">${lblTermsText}</p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter quotes logic
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
            <h2 style={{ color: '#1e293b', margin: 0, fontSize: '1.5rem' }}>QuoteCode Pro</h2>
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
              <input type="email" name="loginEmail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required placeholder="shlomisiny@gmail.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '25px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
            <div style={{ background: '#4f46e5', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>&lt;/&gt;</div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>{t.appName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{session.user.email}</span>
            <button onClick={handleSignOut} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Sign Out</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderRight: isHebrew ? '4px solid #4f46e5' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #4f46e5' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>{t.totalQuotes}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{totalQuotesCount}</div>
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

        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', border: editingQuoteId ? '2px solid #4f46e5' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
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
                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
              >
                {t.cancelEdit}
              </button>
            )}
          </div>

          <form onSubmit={handleSaveQuote}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.discount}</label>
                <input type="number" name="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} min="0" max="100" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{t.terms}</label>
                <input type="text" name="terms" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
              <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: 0 }}>{t.quoteItems}</h3>
              <button type="button" onClick={addItem} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>{t.addItem}</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 1fr 1fr 40px', gap: '10px', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', padding: '0 2px' }}>
              <div>{t.description}</div>
              <div>{t.qty}</div>
              <div>{t.price}</div>
              <div style={{ textAlign: isHebrew ? 'left' : 'right' }}>{t.total}</div>
              <div></div>
            </div>

            {items.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 1fr 1fr 40px', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
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

        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#1e293b', margin: 0 }}>{t.recentHistory}</h2>
            
            {/* Search and Filter Controls */}
            <div style={{ display: 'flex', gap: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
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
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left' }}>
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
                        <td style={{ padding: '12px', display: 'flex', gap: '8px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                          <button 
                            onClick={() => handleEditClick(quote)}
                            style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                          >
                            {t.edit}
                          </button>
                          <button 
                            onClick={() => handleDuplicateQuote(quote)}
                            style={{ background: '#ccfbf1', color: '#115e59', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                          >
                            {t.duplicate}
                          </button>
                          <button 
                            onClick={() => handlePrintQuote(quote)}
                            style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                          >
                            {t.pdfPrint}
                          </button>
                          <button 
                            onClick={() => handleDeleteQuote(quote.id)}
                            style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
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

      </div>
    </div>
  );
}

export default App;