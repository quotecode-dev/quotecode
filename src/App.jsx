import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ixabnzhjeqevtbhdfswv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4YWJuemhqZXFldnRiaGRmc3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxOTUzNzAsImV4cCI6MjEwMDc3MTM3MH0.I44X7ZFNfQvxqxm_yEk8tK0uXQ9tZQWx0u0rxRbV7HE'
);

function Logo({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="8" fill="#2563EB"/>
      <path d="M11 13L7 18L11 23" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M25 13L29 18L25 23" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 11L16 25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('Draft');
  const [validUntil, setValidUntil] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [terms, setTerms] = useState('Net 30 days. Thank you for your business.');
  const [items, setItems] = useState([{ description: '', qty: 1, price: 0 }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Company Profile Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('qc_company_name') || 'QuoteCode Pro');
  const [companyAddress, setCompanyAddress] = useState(() => localStorage.getItem('qc_company_address') || 'Global SaaS Division');
  const [companyEmail, setCompanyEmail] = useState(() => localStorage.getItem('qc_company_email') || 'billing@quotecodepro.com');
  const [companyWebsite, setCompanyWebsite] = useState(() => localStorage.getItem('qc_company_website') || 'https://quotecodepro.com');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadHistory(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadHistory(session.user.id);
      } else {
        setDocuments([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadHistory(userId) {
    const { data } = await supabase
      .from('quotecode_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setDocuments(data);
  }

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
      if (error) alert(error.message);
      else alert('Check your email for confirmation or you are signed up!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) alert(error.message);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }

  function saveCompanySettings(e) {
    e.preventDefault();
    localStorage.setItem('qc_company_name', companyName);
    localStorage.setItem('qc_company_address', companyAddress);
    localStorage.setItem('qc_company_email', companyEmail);
    localStorage.setItem('qc_company_website', companyWebsite);
    setShowSettings(false);
    showToast('Company profile updated successfully!');
  }

  function addItem() {
    setItems([...items, { description: '', qty: 1, price: 0 }]);
  }

  function updateItem(index, field, value) {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  const savedClients = documents.reduce((acc, doc) => {
    if (doc.client_name && !acc.some(c => c.name.toLowerCase() === doc.client_name.toLowerCase())) {
      acc.push({ name: doc.client_name, email: doc.client_email, phone: doc.client_phone });
    }
    return acc;
  }, []);

  function handleClientNameChange(val) {
    setClientName(val);
    const found = savedClients.find(c => c.name.toLowerCase() === val.toLowerCase());
    if (found) {
      if (found.email) setClientEmail(found.email);
      if (found.phone) setClientPhone(found.phone);
    }
  }

  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = currencySymbols[currency] || '$';

  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
  const discountAmount = (subtotal * (Number(discountPercent) || 0)) / 100;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  async function handleSave() {
    if (!clientName) return alert('Please enter a client name');
    if (!session) return alert('You must be logged in');
    setLoading(true);

    const generatedQuoteNumber = editingId 
      ? documents.find(d => d.id === editingId)?.quote_number 
      : `QC-${Math.floor(1000 + Math.random() * 9000)}`;

    const docData = {
      user_id: session.user.id,
      quote_number: generatedQuoteNumber,
      client_name: clientName,
      client_email: clientEmail || 'client@example.com',
      client_phone: clientPhone || '',
      doc_type: status,
      currency: currency,
      discount_percent: Number(discountPercent) || 0,
      total_amount: `${symbol}${Number(totalAmount).toFixed(2)} ${currency}`,
      items: items,
      terms: terms,
      valid_until: validUntil || ''
    };

    if (editingId) {
      const { error } = await supabase.from('quotecode_documents').update(docData).eq('id', editingId);
      if (error) { alert(error.message); setLoading(false); return; }
      setEditingId(null);
      showToast('Document updated successfully!');
    } else {
      const { error } = await supabase.from('quotecode_documents').insert([docData]);
      if (error) { alert(error.message); setLoading(false); return; }
      showToast('Document created & saved to cloud!');
    }

    resetForm();
    setLoading(false);
    loadHistory(session.user.id);
  }

  function resetForm() {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setStatus('Draft');
    setValidUntil('');
    setDiscountPercent(0);
    setTerms('Net 30 days. Thank you for your business.');
    setItems([{ description: '', qty: 1, price: 0 }]);
    setEditingId(null);
  }

  function editQuote(doc, e) {
    e.stopPropagation();
    setEditingId(doc.id);
    setClientName(doc.client_name || '');
    setClientEmail(doc.client_email || '');
    setClientPhone(doc.client_phone || '');
    setStatus(doc.doc_type || 'Draft');
    setCurrency(doc.currency || 'USD');
    setDiscountPercent(doc.discount_percent || 0);
    setValidUntil(doc.valid_until || '');
    setTerms(doc.terms || '');
    setItems(doc.items && doc.items.length > 0 ? doc.items : [{ description: '', qty: 1, price: 0 }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cloneQuote(doc, e) {
    e.stopPropagation();
    setEditingId(null);
    setClientName(doc.client_name ? `${doc.client_name} (Copy)` : '');
    setClientEmail(doc.client_email || '');
    setClientPhone(doc.client_phone || '');
    setStatus('Draft');
    setCurrency(doc.currency || 'USD');
    setDiscountPercent(doc.discount_percent || 0);
    setTerms(doc.terms || '');
    setItems(doc.items && doc.items.length > 0 ? doc.items : [{ description: '', qty: 1, price: 0 }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function sendEmailToClient(doc, e) {
    e.stopPropagation();
    await supabase.from('quotecode_documents').update({ doc_type: 'Sent' }).eq('id', doc.id);
    showToast(`Quote ${doc.quote_number} sent successfully to ${doc.client_email}!`);
    loadHistory(session.user.id);
    if (previewDoc && previewDoc.id === doc.id) {
      setPreviewDoc({ ...previewDoc, doc_type: 'Sent' });
    }
  }

  async function processPayment(doc, e) {
    e.stopPropagation();
    setLoading(true);
    await supabase.from('quotecode_documents').update({ doc_type: 'Paid' }).eq('id', doc.id);
    showToast(`Payment processed successfully for ${doc.quote_number}!`);
    setLoading(false);
    loadHistory(session.user.id);
    if (previewDoc && previewDoc.id === doc.id) {
      setPreviewDoc({ ...previewDoc, doc_type: 'Paid' });
    }
  }

  async function deleteQuote(id, e) {
    e.stopPropagation();
    await supabase.from('quotecode_documents').delete().eq('id', id);
    showToast('Document deleted.');
    loadHistory(session.user.id);
  }

  function exportToCSV() {
    const headers = "ID,QuoteNumber,ClientName,Email,Status,Currency,Total,Date\n";
    const rows = documents.map(d => `${d.id},${d.quote_number},"${d.client_name}","${d.client_email}",${d.doc_type},${d.currency},"${d.total_amount}",${d.created_at}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'quotecode_history.csv');
    a.click();
  }

  const totalQuotesCount = documents.length;
  const approvedCount = documents.filter(d => d.doc_type === 'Approved' || d.doc_type === 'Paid').length;
  const conversionRate = totalQuotesCount > 0 ? ((approvedCount / totalQuotesCount) * 100).toFixed(0) : 0;
  const totalRevenueNum = documents
    .filter(d => d.doc_type === 'Approved' || d.doc_type === 'Paid')
    .reduce((acc, d) => {
      const num = parseFloat(d.total_amount?.replace(/[^0-9.-]+/g, '')) || 0;
      return acc + num;
    }, 0);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) || doc.quote_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || doc.doc_type === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 border-t-4 border-blue-600">
          <div className="flex items-center gap-3 mb-2">
            <Logo className="w-9 h-9" />
            <h1 className="text-2xl font-black text-gray-950">{companyName}</h1>
          </div>
          <p className="text-sm text-gray-500 mb-6">Sign in to access your secure workspace</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full border border-gray-300 p-3 rounded-md text-sm"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full border border-gray-300 p-3 rounded-md text-sm"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const previewSubtotal = previewDoc?.items?.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0) || 0;
  const previewDiscountPercent = Number(previewDoc?.discount_percent) || 0;
  const previewDiscountAmount = (previewSubtotal * previewDiscountPercent) / 100;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 font-medium text-sm border border-gray-700 print:hidden">
          {toastMessage}
        </div>
      )}

      {/* Company Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-lg">✕</button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">⚙️ Company Profile Settings</h2>
            <form onSubmit={saveCompanySettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" className="w-full border border-gray-300 p-2.5 rounded-md text-sm" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address / Division</label>
                <input type="text" className="w-full border border-gray-300 p-2.5 rounded-md text-sm" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Email</label>
                <input type="email" className="w-full border border-gray-300 p-2.5 rounded-md text-sm" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="text" className="w-full border border-gray-300 p-2.5 rounded-md text-sm" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition text-sm">Save Settings</button>
            </form>
          </div>
        </div>
      )}

      {/* Header bar with Logout & Settings */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow print:hidden">
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7" />
          <span className="text-sm font-bold text-gray-800">{companyName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSettings(true)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg border text-sm transition">⚙️ Settings</button>
          <span className="text-sm font-medium text-gray-700"><strong>{session.user.email}</strong></span>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 font-bold px-4 py-2 rounded-lg border border-red-200 text-sm hover:bg-red-100 transition">
            Sign Out
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto print:shadow-none print:p-0 print:max-h-none print:w-full print:overflow-visible">
            <button onClick={() => setPreviewDoc(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-lg print:hidden">✕</button>
            
            {/* Company Header on PDF/Preview */}
            <div className="flex justify-between items-start mb-6 border-b pb-4">
              <div className="flex items-center gap-3">
                <Logo className="w-10 h-10 print:w-8 print:h-8" />
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{companyName}</h2>
                  <p className="text-xs text-gray-500">{companyAddress} • {companyEmail} • {companyWebsite}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-blue-600 mb-1">{previewDoc.quote_number || 'QC-PRO'}</span>
                <span className={`text-xs px-3 py-1 rounded font-bold uppercase ${
                  previewDoc.doc_type === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                  previewDoc.doc_type === 'Approved' ? 'bg-green-100 text-green-800' :
                  previewDoc.doc_type === 'Sent' ? 'bg-yellow-100 text-yellow-800' : 
                  previewDoc.doc_type === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'
                }`}>{previewDoc.doc_type || 'Draft'}</span>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-gray-500 font-medium">Client:</span>
                <strong className="text-gray-900 text-base">{previewDoc.client_name}</strong>
                <span className="block text-gray-600 text-xs">{previewDoc.client_email}</span>
                {previewDoc.client_phone && <span className="block text-gray-600 text-xs">{previewDoc.client_phone}</span>}
              </div>
              <div className="text-right">
                <span className="block text-gray-500 font-medium">Date Issued:</span>
                <span className="text-gray-800">{new Date(previewDoc.created_at).toLocaleDateString()}</span>
                {previewDoc.valid_until && (
                  <span className="block text-xs text-red-500 mt-1">Valid Until: {previewDoc.valid_until}</span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs text-gray-500 uppercase">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {previewDoc.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 text-gray-800">{item.description || 'Item'}</td>
                      <td className="py-3 text-center text-gray-600">{item.qty}</td>
                      <td className="py-3 text-right text-gray-600">{previewDoc.total_amount?.[0] || '$'}{Number(item.price).toFixed(2)}</td>
                      <td className="py-3 text-right font-medium text-gray-900">{previewDoc.total_amount?.[0] || '$'}{((Number(item.qty) || 0) * (Number(item.price) || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border print:border-gray-300 space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal:</span>
                <span>{previewDoc.total_amount?.[0] || '$'}{previewSubtotal.toFixed(2)}</span>
              </div>
              {previewDiscountPercent > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount ({previewDiscountPercent}%):</span>
                  <span>-{previewDoc.total_amount?.[0] || '$'}{previewDiscountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold text-gray-700">Total Amount:</span>
                <span className="text-2xl font-black text-blue-600">{previewDoc.total_amount}</span>
              </div>
            </div>

            <div className="mb-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <strong>Terms & Conditions:</strong> {previewDoc.terms || 'Standard Terms apply.'}
            </div>

            <div className="flex gap-3 flex-wrap print:hidden">
              {previewDoc.doc_type !== 'Paid' && (
                <button onClick={(e) => processPayment(previewDoc, e)} className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-700 transition text-sm shadow">💳 Pay Now (Secure)</button>
              )}
              <button onClick={(e) => sendEmailToClient(previewDoc, e)} className="bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition text-sm">Send Email</button>
              <button onClick={() => window.print()} className="bg-gray-800 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gray-900 transition text-sm">Print / PDF</button>
              <button onClick={() => setPreviewDoc(null)} className="px-6 bg-gray-200 text-gray-800 font-bold py-2.5 rounded-lg hover:bg-gray-300 transition text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-4xl mx-auto print:hidden">
        
        {/* Dashboard Analytics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
            <span className="text-xs text-gray-500 uppercase font-bold">Total Quotes</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalQuotesCount}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border-l-4 border-yellow-500">
            <span className="text-xs text-gray-500 uppercase font-bold">Approved / Paid</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{approvedCount}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border-l-4 border-purple-500">
            <span className="text-xs text-gray-500 uppercase font-bold">Win Rate</span>
            <h3 className="text-2xl font-black text-purple-600 mt-1">{conversionRate}%</h3>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500">
            <span className="text-xs text-gray-500 uppercase font-bold">Total Revenue</span>
            <h3 className="text-2xl font-black text-green-600 mt-1">${totalRevenueNum.toFixed(2)}</h3>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-t-4 border-blue-600">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{companyName}</h1>
                <p className="text-sm text-gray-500">Global SaaS Quoting & Invoicing Platform</p>
              </div>
            </div>
            {editingId && (
              <button onClick={resetForm} className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded font-bold hover:bg-gray-300">
                Cancel Edit
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input 
                type="text" 
                list="saved-clients-list"
                placeholder="e.g. Acme Corp" 
                className="w-full border border-gray-300 p-3 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" 
                value={clientName} 
                onChange={(e) => handleClientNameChange(e.target.value)} 
              />
              <datalist id="saved-clients-list">
                {savedClients.map((c, idx) => (
                  <option key={idx} value={c.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
              <input type="email" placeholder="contact@acme.com" className="w-full border border-gray-300 p-3 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Phone</label>
              <input type="text" placeholder="+1 (555) 0192" className="w-full border border-gray-300 p-3 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select className="w-full border border-gray-300 p-3 rounded-md text-sm bg-white" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-300 p-3 rounded-md text-sm bg-white" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
              <input type="date" className="w-full border border-gray-300 p-3 rounded-md text-sm" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input type="number" min="0" max="100" className="w-full border border-gray-300 p-3 rounded-md text-sm" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms / Notes</label>
            <input type="text" className="w-full border border-gray-300 p-3 rounded-md text-sm" value={terms} onChange={(e) => setTerms(e.target.value)} />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-700">Quote Items</label>
              <button onClick={addItem} className="bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded hover:bg-gray-300 transition">+ Add Item</button>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-12 gap-3 mb-2 text-xs font-bold text-gray-500 uppercase px-1">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Price ({symbol})</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item, index) => {
              const rowTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
              return (
                <div key={index} className="grid grid-cols-12 gap-3 mb-3 items-center">
                  <div className="col-span-6">
                    <input type="text" placeholder="Item description" className="w-full border border-gray-300 p-2.5 rounded-md text-sm" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" placeholder="Qty" className="w-full border border-gray-300 p-2.5 rounded-md text-sm text-center" value={item.qty} onChange={(e) => updateItem(index, 'qty', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" placeholder="Price" className="w-full border border-gray-300 p-2.5 rounded-md text-sm text-right" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="text-sm font-semibold text-gray-600">{symbol}{rowTotal.toFixed(2)}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 font-bold px-1.5 py-1 text-sm">✕</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal:</span>
              <span>{symbol}{subtotal.toFixed(2)}</span>
            </div>
            {Number(discountPercent) > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Discount ({discountPercent}%):</span>
                <span>-{symbol}{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-900 font-bold">Total Amount:</span>
              <span className="text-2xl font-extrabold text-blue-600">{symbol}{Number(totalAmount).toFixed(2)} {currency}</span>
            </div>
          </div>
          
          <button onClick={handleSave} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 shadow-md transition disabled:opacity-50">
            {loading ? 'Processing...' : editingId ? 'Update Document' : 'Generate & Save to Cloud'}
          </button>
        </div>

        {/* History Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b pb-3 gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-gray-800">☁️ Cloud History</h3>
              <button onClick={exportToCSV} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded border">Export CSV</button>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select className="border border-gray-300 p-2 rounded-md text-sm bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input type="text" placeholder="Search client or #QC..." className="border border-gray-300 p-2 rounded-md text-sm w-full md:w-48" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} onClick={() => setPreviewDoc(doc)} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-md transition hover:bg-blue-50 cursor-pointer">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{doc.quote_number || 'QC-1000'}</span>
                    <strong className="text-gray-900 text-lg">{doc.client_name}</strong>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                      doc.doc_type === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      doc.doc_type === 'Approved' ? 'bg-green-100 text-green-800' :
                      doc.doc_type === 'Sent' ? 'bg-yellow-100 text-yellow-800' : 
                      doc.doc_type === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'
                    }`}>{doc.doc_type || 'Draft'}</span>
                  </div>
                  <span className="text-xs text-gray-500 block mt-0.5">{doc.client_email || 'No email'} • {doc.items?.length || 0} items</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-600 text-lg mr-2">{doc.total_amount}</span>
                  <button onClick={(e) => sendEmailToClient(doc, e)} className="text-green-700 hover:text-green-900 font-bold text-xs bg-green-50 px-2.5 py-1.5 rounded border border-green-200">Email</button>
                  <button onClick={(e) => cloneQuote(doc, e)} className="text-gray-700 hover:text-gray-900 font-bold text-xs bg-gray-200 px-2.5 py-1.5 rounded">Clone</button>
                  <button onClick={(e) => editQuote(doc, e)} className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-2.5 py-1.5 rounded border border-blue-100">Edit</button>
                  <button onClick={(e) => deleteQuote(doc.id, e)} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-2.5 py-1.5 rounded border border-red-100">Delete</button>
                </div>
              </div>
            ))}
            {filteredDocuments.length === 0 && <p className="text-sm text-gray-500 py-2">No documents found.</p>}
          </div>
        </div>

      </div>
    </div>
  )
}

export default App