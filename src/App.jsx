import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [currency, setCurrency] = useState('USD ($)');
  const [quoteStatus, setQuoteStatus] = useState('Draft');
  const [validUntil, setValidUntil] = useState('');
  const [discount, setDiscount] = useState(0);
  const [terms, setTerms] = useState('Net 30 days. Thank you for your business.');
  
  // Items state
  const [items, setItems] = useState([
    { description: '', quantity: 1, unit_price: 0 }
  ]);

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

  async function loadData() {
    await fetchQuotes();
    await fetchClients();
  }

  async function fetchQuotes() {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        clients ( company_name, email, phone )
      `)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching quotes:', error.message);
    else setQuotes(data || []);
  }

  async function fetchClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
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

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
  const discountAmount = (subtotal * Number(discount)) / 100;
  const totalAmount = subtotal - discountAmount;

  // Stats calculation
  const totalQuotesCount = quotes.length;
  const approvedPaidCount = quotes.filter(q => q.status === 'Approved' || q.status === 'Paid').length;
  const winRate = totalQuotesCount > 0 ? Math.round((approvedPaidCount / totalQuotesCount) * 100) : 0;
  const totalRevenue = quotes
    .filter(q => q.status === 'Approved' || q.status === 'Paid')
    .reduce((sum, q) => sum + Number(q.total || 0), 0);

  async function handleGenerateQuote(e) {
    e.preventDefault();
    try {
      let clientId;
      const existingClient = clients.find(c => c.company_name.toLowerCase() === clientName.toLowerCase());
      
      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClientData, error: clientError } = await supabase
          .from('clients')
          .insert([{ company_name: clientName, email: clientEmail, phone: clientPhone }])
          .select();
        if (clientError) throw clientError;
        clientId = newClientData[0].id;
      }

      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert([{
          client_id: clientId,
          currency: currency.includes('USD') ? 'USD' : 'ILS',
          subtotal: subtotal,
          tax_rate: 0.00,
          total: totalAmount,
          status: quoteStatus,
          valid_until: validUntil || null
        }])
        .select();

      if (quoteError) throw quoteError;
      const quoteId = quoteData[0].id;

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

      setStatusMsg({ text: `Quote successfully created and saved to cloud! Total: $${totalAmount.toFixed(2)}`, type: 'success' });
      
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setValidUntil('');
      setDiscount(0);
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
      
      loadData();
    } catch (err) {
      setStatusMsg({ text: 'Error creating quote: ' + err.message, type: 'error' });
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
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Quote #${quote.id.slice(0, 6)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
            th { background: #f8fafc; }
            .total { margin-top: 30px; text-align: right; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">&lt;/&gt; QuoteCode Pro</div>
              <p>Global SaaS Quoting & Invoicing Platform</p>
            </div>
            <div>
              <h3>Quote #${quote.id.slice(0, 6)}</h3>
              <p>Date: ${new Date(quote.created_at).toLocaleDateString()}</p>
              <p>Valid Until: ${quote.valid_until || '-'}</p>
            </div>
          </div>
          <div>
            <strong>Client:</strong>
            <p>${quote.clients?.company_name || 'N/A'}<br/>${quote.clients?.email || ''}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Professional Services / SaaS License</td>
                <td>${quote.status}</td>
                <td>$${Number(quote.total || 0).toFixed(2)} ${quote.currency}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">
            Total Amount: $${Number(quote.total || 0).toFixed(2)} ${quote.currency}
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
              <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required placeholder="shlomisiny@gmail.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Password</label>
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
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
    <div style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: '20px', color: '#333' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Top Navbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#4f46e5', color: 'white', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>&lt;/&gt;</div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>QuoteCode Pro</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{session.user.email}</span>
            <button onClick={handleSignOut} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Sign Out</button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '4px solid #4f46e5' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>TOTAL QUOTES</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{totalQuotesCount}</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '4px solid #eab308' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>APPROVED / PAID</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{approvedPaidCount}</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '4px solid #a855f7' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>WIN RATE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a855f7' }}>{winRate}%</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '4px solid #22c55e' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>TOTAL REVENUE</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22c55e' }}>${totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg.text && (
          <div style={{ padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500', background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: statusMsg.type === 'success' ? '#166534' : '#991b1b' }}>
            {statusMsg.text}
          </div>
        )}

        {/* Main Form Box */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h2 style={{ color: '#1e293b', marginTop: 0, fontSize: '1.4rem' }}>QuoteCode Pro</h2>
          <p style={{ color: '#64748b', marginTop: '-5px', marginBottom: '25px', fontSize: '0.9rem' }}>Global SaaS Quoting & Invoicing Platform</p>

          <form onSubmit={handleGenerateQuote}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Client Name</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Acme Corp" required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Client Email</label>
                <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="contact@acme.com" required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Client Phone</label>
                <input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+1 (555) 0192" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', boxSizing: 'border-box' }}>
                  <option>USD ($)</option>
                  <option>ILS (₪)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Status</label>
                <select value={quoteStatus} onChange={(e) => setQuoteStatus(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', boxSizing: 'border-box' }}>
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Approved">Approved</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Valid Until</label>
                <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Discount (%)</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} min="0" max="100" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Terms / Notes</label>
              <input type="text" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: 0 }}>Quote Items</h3>
              <button type="button" onClick={addItem} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>+ Add Item</button>
            </div>

            {items.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr auto', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input type="text" placeholder="Item description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <input type="number" placeholder="Qty" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <input type="number" placeholder="Price ($)" step="0.01" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} required style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
                <div style={{ fontWeight: '600', color: '#334155', textAlign: 'right' }}>${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}</div>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>✕</button>
                )}
              </div>
            ))}

            <div style={{ borderTop: '2px solid #f1f5f9', marginTop: '20px', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b' }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ef4444' }}>
                  <span>Discount ({discount}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', marginTop: '10px' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#4f46e5' }}>${totalAmount.toFixed(2)} {currency.includes('USD') ? 'USD' : 'ILS'}</span>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '25px', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
              Generate & Save to Cloud
            </button>
          </form>
        </div>

        {/* Recent Quotes History Table */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#1e293b', marginTop: 0, marginBottom: '20px' }}>Recent Quotes History</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px' }}>Quote #</th>
                  <th style={{ padding: '12px' }}>Client</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Total</th>
                  <th style={{ padding: '12px' }}>Valid Until</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      No quotes found in the database.
                    </td>
                  </tr>
                ) : (
                  quotes.map((quote) => (
                    <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#4f46e5' }}>#{quote.id.slice(0, 6)}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{quote.clients?.company_name || 'N/A'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{quote.clients?.email}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: quote.status === 'Approved' ? '#dcfce7' : quote.status === 'Paid' ? '#dbeafe' : '#f1f5f9',
                          color: quote.status === 'Approved' ? '#166534' : quote.status === 'Paid' ? '#1e40af' : '#475569'
                        }}>
                          {quote.status || 'Draft'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b' }}>
                        ${Number(quote.total || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{quote.valid_until || '-'}</td>
                      <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handlePrintQuote(quote)}
                          style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                        >
                          PDF
                        </button>
                        <button 
                          onClick={() => handleDeleteQuote(quote.id)}
                          style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
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