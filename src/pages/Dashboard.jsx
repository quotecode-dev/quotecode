import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ProFlowLogo from '../components/ProFlowLogo';
import AccessibilityModal from '../components/AccessibilityModal';
import AIChatWidget from '../AIChatWidget';

const formatNum = (val) => Math.round(Number(val || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const DEFAULT_TERMS_HEB = `תנאים כלליים:
1. תוקף ההצעה: ההצעה בתוקף ל-30 ימים מיום הצעת המחיר.
2. מחירים: המחירים כוללים מע"מ, אלא אם צוין אחרת.
3. תשלום: התשלום יתבצע במזומן או באמצעות העברה בנקאית, בתנאים שיוסכמו מראש.
4. אספקה: אספקת המוצרים תתבצע תוך 30 ימי עבודה ממועד אישור ההזמנה והתשלום, אלא אם כן צוין אחרת.`;

const DEFAULT_TERMS_ENG = `General Terms:
1. Validity: This quote is valid for 30 days from issuance.
2. Payment: Payment shall be made in cash or via bank transfer as agreed in advance.
3. Delivery: Product delivery within 30 business days from order confirmation and payment.`;

function PricingModal({ isOpen, onClose, isHebrew, isLocalIsraeliBusiness }) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  if (!isOpen) return null;

  const basicMonthly = isLocalIsraeliBusiness ? '₪49' : '$39';
  const basicYearly = isLocalIsraeliBusiness ? '₪39' : '$29';
  const proMonthly = isLocalIsraeliBusiness ? '₪99' : '$89';
  const proYearly = isLocalIsraeliBusiness ? '₪79' : '$69';

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '720px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: isHebrew ? 'right' : 'left', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', [isHebrew ? 'left' : 'right']: '15px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}>✕</button>

        <h2 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.5rem', textAlign: 'center', marginBottom: '5px' }}>
          {isHebrew ? '🚀 שדרג את העסק שלך עם ProFlow' : '🚀 Upgrade Your Business with ProFlow'}
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>
          {isHebrew ? 'בחר את המסלול המתאים ביותר לצרכים שלך והתחל לעבוד ללא הגבלות' : 'Choose the best plan for your needs and work without limits'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
          <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '30px', display: 'flex', gap: '4px', border: '1px solid #cbd5e1' }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                background: billingCycle === 'monthly' ? '#4f46e5' : 'transparent',
                color: billingCycle === 'monthly' ? 'white' : '#475569',
                border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {isHebrew ? 'חיוב חודשי' : 'Monthly Billing'}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                background: billingCycle === 'yearly' ? '#4f46e5' : 'transparent',
                color: billingCycle === 'yearly' ? 'white' : '#475569',
                border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              {isHebrew ? 'חיוב שנתי (חודשיים מתנה! 20% הנחה)' : 'Yearly Billing (2 Months Free!)'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px' }}>
          
          <div style={{ border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.2rem' }}>{isHebrew ? 'מנוי בסיסי (Basic)' : 'Basic Plan'}</h3>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#4f46e5', marginBottom: '5px' }}>
              {billingCycle === 'monthly' ? basicMonthly : basicYearly} 
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>{isHebrew ? '/ חודש' : '/ month'}</span>
            </div>
            {billingCycle === 'yearly' && (
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', marginBottom: '15px' }}>
                {isHebrew ? 'חיוב שנתי (חסוך 20% בשנה)' : 'Billed annually (Save 20%)'}
              </div>
            )}
            {billingCycle === 'monthly' && <div style={{ height: '20px', marginBottom: '15px' }}></div>}
            
            <ul style={{ margin: '0 0 20px 0', padding: isHebrew ? '0 20px 0 0' : '0 0 0 20px', color: '#475569', fontSize: '0.85rem', lineHeight: '1.6', flex: 1 }}>
              <li>{isHebrew ? 'עד 20 הצעות מחיר בחודש' : 'Up to 20 quotes/month'}</li>
              <li>{isHebrew ? 'עריכה ושכפול הצעות מחיר' : 'Edit & duplicate quotes'}</li>
              <li>{isHebrew ? 'קטלוג מוצרים אישי' : 'Personal product catalog'}</li>
              <li>{isHebrew ? 'הפקת קובצי PDF רשמיים' : 'Official PDF exports'}</li>
              <li style={{ color: '#ef4444' }}>{isHebrew ? '✗ ללא שליחה ישירה בווצאפ' : '✗ No WhatsApp sending'}</li>
            </ul>
            <button onClick={() => { alert(isHebrew ? `לשדרוג מיידי למסלול Basic (${billingCycle === 'yearly' ? 'שנתי' : 'חודשי'}), פנה לתמיכה.` : 'Please contact support to upgrade.'); onClose(); }} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
              {isHebrew ? 'בחר מסלול Basic' : 'Select Basic'}
            </button>
          </div>

          <div style={{ border: '2px solid #4f46e5', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', background: 'white', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.1)' }}>
            <div style={{ background: '#4f46e5', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', alignSelf: 'flex-start', marginBottom: '8px' }}>POPULAR</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.2rem' }}>{isHebrew ? 'מנוי PRO (מומלץ)' : 'PRO Plan (Recommended)'}</h3>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#4f46e5', marginBottom: '5px' }}>
              {billingCycle === 'monthly' ? proMonthly : proYearly} 
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>{isHebrew ? '/ חודש' : '/ month'}</span>
            </div>
            {billingCycle === 'yearly' && (
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', marginBottom: '15px' }}>
                {isHebrew ? 'חיוב שנתי (חסוך 20% בשנה)' : 'Billed annually (Save 20%)'}
              </div>
            )}
            {billingCycle === 'monthly' && <div style={{ height: '20px', marginBottom: '15px' }}></div>}

            <ul style={{ margin: '0 0 20px 0', padding: isHebrew ? '0 20px 0 0' : '0 0 0 20px', color: '#475569', fontSize: '0.85rem', lineHeight: '1.6', flex: 1 }}>
              <li>{isHebrew ? 'הצעות מחיר ללא הגבלה (∞)' : 'Unlimited quotes (∞)'}</li>
              <li>{isHebrew ? 'שליחת הצעות מחיר ישירות בוואטסאפ' : 'Send quotes directly via WhatsApp'}</li>
              <li>{isHebrew ? 'הוספת לוגו עסקי מותאם אישית' : 'Custom business logo upload'}</li>
              <li>{isHebrew ? 'מחיקה וניהול מתקדם של הצעות' : 'Advanced quote management & deletion'}</li>
              <li>{isHebrew ? 'מעקב צפיות חכם (הצעות חמות)' : 'Smart view tracking (Hot quotes)'}</li>
            </ul>
            <button onClick={() => { alert(isHebrew ? `לשדרוג מיידי למסלול PRO (${billingCycle === 'yearly' ? 'שנתי' : 'חודשי'}), פנה לתמיכה.` : 'Please contact support to upgrade.'); onClose(); }} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
              {isHebrew ? 'בחר מסלול PRO' : 'Select PRO'}
            </button>
          </div>

        </div>

        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
          {isHebrew ? 'יש לך שאלות? צור איתנו קשר דרך עוזר ה-AI או במייל.' : 'Have questions? Contact us via AI assistant or email.'}
        </div>

      </div>
    </div>
  );
}

function EmailConfirmModal({ isOpen, onClose, onConfirm, clientEmail, isHebrew }) {
  if (!isOpen) return null;

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', textAlign: 'center', animation: 'popupBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
        
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '1.4rem' }}>
          ✉️
        </div>

        <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.25rem', marginBottom: '10px', fontWeight: '700' }}>
          {isHebrew ? 'שליחת הצעת מחיר במייל' : 'Send Quote via Email'}
        </h3>
        
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>
          {isHebrew ? 'האם לשלוח את הצעת המחיר לכתובת:' : 'Do you want to send the quote to:'}
          <br />
          <strong style={{ color: '#1e293b', direction: 'ltr', display: 'inline-block', marginTop: '5px' }}>{clientEmail}</strong>
        </p>

        <div style={{ display: 'flex', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
          <button onClick={onClose} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}>
            {isHebrew ? 'ביטול' : 'Cancel'}
          </button>
          <button onClick={onConfirm} style={{ flex: 1, background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)' }}>
            {isHebrew ? 'כן, שלח מייל' : 'Yes, Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LifetimeConfirmModal({ isOpen, onClose, onConfirm, userEmail, isHebrew }) {
  if (!isOpen) return null;

  return (
    <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }} dir={isHebrew ? 'rtl' : 'ltr'}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center', animation: 'popupBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
        
        <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', fontSize: '1.6rem' }}>
          ♾️
        </div>

        <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.3rem', marginBottom: '10px', fontWeight: '800' }}>
          {isHebrew ? 'הענקת מנוי לכל החיים (Lifetime)' : 'Grant Lifetime Subscription'}
        </h3>
        
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>
          {isHebrew ? 'האם אתה בטוח שברצונך להעניק למשתמש זה גישת לכל החיים ולבטל לחלוטין את תקופת הניסיון?' : 'Are you sure you want to grant lifetime access to this user?'}
          <br />
          <strong style={{ color: '#4f46e5', direction: 'ltr', display: 'inline-block', marginTop: '6px' }}>{userEmail}</strong>
        </p>

        <div style={{ display: 'flex', gap: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
          <button onClick={onClose} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}>
            {isHebrew ? 'ביטול' : 'Cancel'}
          </button>
          <button onClick={onConfirm} style={{ flex: 1, background: '#7c3aed', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}>
            {isHebrew ? 'אישור והענקת Lifetime' : 'Confirm Lifetime'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Forgot password modal states for login screen
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // Recovery mode state for handling password reset from email link
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [recoveryUpdateMsg, setRecoveryUpdateMsg] = useState('');
  const [recoveryUpdateLoading, setRecoveryUpdateLoading] = useState(false);

  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: 'System connected to Supabase.', type: 'success' });

  const [activeTab, setActiveTab] = useState('main');
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);
  const [financeReportType, setFinanceReportType] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [settingId, setSettingId] = useState(null);
  const [bizName, setBizName] = useState('ProFlow');
  const [bizTaxId, setBizTaxId] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizAddress, setBizAddress] = useState('');
  const [bizLogoUrl, setBizLogoUrl] = useState('');
  const [bizPlan, setBizPlan] = useState('free');
  const [bizRole, setBizRole] = useState('user');
  const [bizCountry, setBizCountry] = useState('Local');
  const [defaultTerms, setDefaultTerms] = useState(DEFAULT_TERMS_HEB);
  const [trialEndsAt, setTrialEndsAt] = useState(null);
  const [allAccounts, setAllAccounts] = useState([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [activeTooltip, setActiveTooltip] = useState({ quoteId: null, action: null });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    
    if (hash.includes('type=recovery') || search.includes('type=recovery')) {
      setIsPasswordRecoveryMode(true);
    }

    // בדיקת פרמטר הרשמה
    const params = new URLSearchParams(search);
    if (params.get('signup') === 'true') {
      setIsSignUp(true);
    }

    const initAuth = async () => {
      setIsInitializing(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user?.id) {
        await loadData(session.user.id, session.user.email);
      }
      setIsInitializing(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsInitializing(true);
        setSession(session);
        if (session?.user?.id) {
          await loadData(session.user.id, session.user.email);
        }
        setIsInitializing(false);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setQuotes([]);
        setClients([]);
        setServices([]);
        setExpenses([]);
        setSettingId(null);
        setBizCountry('Local');
        setIsInitializing(false);
      } else if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleToggleDropdown = (e, quoteId) => {
    e.stopPropagation();
    if (openDropdownId === quoteId) {
      setOpenDropdownId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < 250;

      const menuWidth = 210;
      let calculatedLeft = isHebrew ? rect.right - menuWidth : rect.left;
      if (calculatedLeft + menuWidth > window.innerWidth - 10) {
        calculatedLeft = window.innerWidth - menuWidth - 10;
      }
      if (calculatedLeft < 10) {
        calculatedLeft = 10;
      }

      setDropdownPos({
        top: openUpward ? rect.top - 245 : rect.bottom + 6,
        left: calculatedLeft
      });
      setOpenDropdownId(quoteId);
    }
  };
  
  const [sortField, setSortField] = useState('email');
  const [sortDirection, setSortDirection] = useState('asc');

  const [clientSortField, setClientSortField] = useState('company_name');
  const [clientSortDirection, setClientSortDirection] = useState('asc');

  const [quoteSortField, setQuoteSortField] = useState('created_at');
  const [quoteSortDirection, setQuoteSortDirection] = useState('desc');

  const handleQuoteSort = (field) => {
    if (quoteSortField === field) {
      setQuoteSortDirection(quoteSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setQuoteSortField(field);
      setQuoteSortDirection('asc');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClientSort = (field) => {
    if (clientSortField === field) {
      setClientSortDirection(clientSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setClientSortField(field);
      setClientSortDirection('asc');
    }
  };

  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pendingLifetimeUser, setPendingLifetimeUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientType, setClientType] = useState('');
  const [clientTaxId, setClientTaxId] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  
  const [currency, setCurrency] = useState('ILS');
  const [quoteStatus, setQuoteStatus] = useState('Draft');
  const [validUntil, setValidUntil] = useState('');
  const [discount, setDiscount] = useState('');
  const [terms, setTerms] = useState(DEFAULT_TERMS_HEB); 
  const [notes, setNotes] = useState('');
  
  const [items, setItems] = useState([{ description: '', quantity: '', unit_price: '' }]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Hosting / Cloud');
  const [isRecurring, setIsRecurring] = useState(false);

  const [pendingEmailQuote, setPendingEmailQuote] = useState(null);

  const isInternationalAccount = bizCountry === 'International';
  
  const isHebrew = session 
    ? !isInternationalAccount 
    : (localStorage.getItem('proflow_lang') === 'he' || (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('he')));

  let trialDaysLeft = null;
  let isTrialExpired = false;
  if (trialEndsAt) {
    const end = new Date(trialEndsAt);
    const now = new Date();
    const diffTime = end - now;
    trialDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isTrialExpired = trialDaysLeft <= 0;
  }

  const effectivePlan = isTrialExpired ? 'free' : bizPlan.toLowerCase();

  const isSuperAdmin = bizRole === 'super_admin';
  const isPro = isSuperAdmin || effectivePlan === 'pro';
  const isBasicOrAbove = isPro || effectivePlan === 'basic';
  const isLocalIsraeliBusiness = !isInternationalAccount;

  const t = {
    appName: bizName || 'ProFlow',
    appSub: isHebrew ? 'מערכת ניהול עסק והצעות מחיר גלובלית' : 'Global SaaS Business & Quoting Platform',
    totalQuotes: isHebrew ? 'סך הכל הצעות' : 'TOTAL QUOTES',
    approvedPaid: isHebrew ? 'אושר / שולם' : 'APPROVED / PAID',
    totalRevenue: isHebrew ? 'סך הכנסות' : 'TOTAL REVENUE',
    totalExpenses: isHebrew ? 'סך הוצאות' : 'TOTAL EXPENSES',
    netProfit: isHebrew ? 'רווח נקי' : 'NET PROFIT',
    clientName: isHebrew ? 'שם הלקוח' : 'Client Name',
    clientEmail: isHebrew ? 'אימייל הלקוח' : 'Client Email',
    clientPhone: isHebrew ? 'טלפון הלקוח' : 'Client Phone',
    currency: isHebrew ? 'מטבע' : 'Currency',
    status: isHebrew ? 'סטטוס' : 'Status',
    validUntil: isHebrew ? 'בתוקף עד' : 'Valid Until',
    discount: isHebrew ? 'הנחה (%)' : 'Discount (%)',
    quoteItems: isHebrew ? 'פריטי ההצעה' : 'Quote Items',
    addItem: isHebrew ? '+ הוסף פריט ידנית' : '+ Add Custom Item',
    quickAdd: isHebrew ? 'בחר שירות מהקטלוג...' : 'Choose from catalog...',
    description: isHebrew ? 'תיאור' : 'Description',
    total: isHebrew ? 'סה"כ' : 'Total',
    subtotal: isHebrew ? 'סכום ביניים:' : 'Subtotal:',
    vat: isHebrew ? 'מע"מ (18%):' : 'VAT (18%):',
    totalAmount: isHebrew ? 'סה"כ לתשלום:' : 'Total Amount:',
    generateSave: isHebrew ? 'הפק ושמור בענן' : 'Generate & Save to Cloud',
    updateQuote: isHebrew ? 'עדכן הצעה בענן' : 'Update Quote in Cloud',
    cancelEdit: isHebrew ? 'ביטול עריכה' : 'Cancel Edit',
    recentHistory: isHebrew ? 'היסטוריית הצעות מחיר' : 'Recent Quotes History',
    servicesCatalog: isHebrew ? 'קטלוג שירותים ומוצרים' : 'Services & Products Catalog',
    expensesManagement: isHebrew ? 'ניהול הוצאות עסק' : 'Business Expenses Management',
    addExpenseBtn: isHebrew ? 'הוסף הוצאה' : 'Add Expense',
    businessSettings: isHebrew ? 'הגדרות עסק וחבילה' : 'Business Settings',
    saveSettings: isHebrew ? 'שמור הגדרות עסק' : 'Save Business Settings',
    businessNameLabel: isHebrew ? 'שם העסק' : 'Business Name',
    taxIdLabel: isHebrew ? 'ח.פ / עוסק מורשה / פטור' : 'Tax ID / Lic No',
    logoUrlLabel: isHebrew ? 'כתובת תמונת לוגו (URL)' : 'Logo Image URL',
    addService: isHebrew ? 'הוסף לקטלוג' : 'Add to Catalog',
    serviceName: isHebrew ? 'שם השירות / המוצר' : 'Service Name',
    defaultPrice: isHebrew ? 'מחיר קבוע' : 'Fixed Price',
    searchQuote: isHebrew ? 'חיפוש שם לקוח או מס׳ הצעה...' : 'Search client or quote #...',
    filterStatus: isHebrew ? 'כל הסטטוסים' : 'All Statuses',
    actions: isHebrew ? 'פעולות' : 'Actions',
    edit: isHebrew ? 'ערוך מסמך' : 'Edit Document',
    duplicate: isHebrew ? 'שכפל מסמך' : 'Duplicate Document',
    delete: isHebrew ? 'מחק' : 'Delete',
    clientsManagement: isHebrew ? 'ניהול לקוחות' : 'Clients Management'
  };

  async function loadData(userId, userEmail) {
    await fetchQuotes(userId);
    await fetchClients(userId);
    await fetchServices(userId);
    await fetchExpenses(userId);
    await fetchSettings(userId, userEmail);
  }

  async function fetchQuotes(userId) {
    const { data, error } = await supabase
      .from('quotes')
      .select(`*, clients ( company_name, email, phone, client_type, tax_id, address, terms, notes ), quote_items ( * )`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching quotes:', error.message);
    else setQuotes(data || []);
  }

  async function fetchClients(userId) {
    const { data, error } = await supabase
      .from('clients')
      .select('id, company_name, email, phone, client_type, created_at, user_id, tax_id, address, terms, notes')
      .eq('user_id', userId);
    if (error) {
      console.error('Error fetching clients:', error.message);
    } else {
      setClients(data || []);
    }
  }

  async function fetchServices(userId) {
    const { data, error } = await supabase.from('services').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    if (error) console.error('Error fetching services:', error.message);
    else setServices(data || []);
  }

  async function fetchExpenses(userId) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('expense_date', { ascending: false });
    if (error) console.error('Error fetching expenses:', error.message);
    else setExpenses(data || []);
  }

  async function fetchSettings(userId, userEmail) {
    const nowIso = new Date().toISOString();

    let { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!data && userEmail) {
      const { data: emailData } = await supabase
        .from('business_settings')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle();

      if (emailData) {
        const oldUserId = emailData.user_id;

        const { data: updatedData } = await supabase
          .from('business_settings')
          .update({ user_id: userId, last_sign_in: nowIso })
          .eq('id', emailData.id)
          .select()
          .maybeSingle();

        if (updatedData) {
          data = updatedData;

          if (oldUserId && oldUserId !== userId) {
            await supabase.from('services').update({ user_id: userId }).eq('user_id', oldUserId);
            await supabase.from('clients').update({ user_id: userId }).eq('user_id', oldUserId);
            await supabase.from('quotes').update({ user_id: userId }).eq('user_id', oldUserId);
            await supabase.from('expenses').update({ user_id: userId }).eq('user_id', oldUserId);
          }
        }
      } else if (data) {
        if (!data.email && userEmail) {
          await supabase.from('business_settings').update({ email: userEmail }).eq('id', data.id);
        }
      }
    }

    if (data) {
      setSettingId(data.id);
      setBizName(data.business_name || 'ProFlow');
      setBizTaxId(data.tax_id || '');
      setBizEmail(data.email || userEmail || '');
      setBizPhone(data.phone || '');
      setBizAddress(data.address || '');
      setBizLogoUrl(data.logo_url || '');
      setBizPlan(data.plan || 'pro');
      setBizRole(data.role || 'user');
      setBizCountry(data.country || 'Local');
      const defTerms = data.default_terms || (data.country === 'International' ? DEFAULT_TERMS_ENG : DEFAULT_TERMS_HEB);
      setDefaultTerms(defTerms);
      setTrialEndsAt(data.trial_ends_at !== undefined ? data.trial_ends_at : null);
      
      if (data.country === 'International') {
        setCurrency('USD');
        setTerms(defTerms);
      } else {
        setCurrency('ILS');
        setTerms(defTerms);
      }

      await supabase
        .from('business_settings')
        .update({ last_sign_in: nowIso })
        .eq('user_id', userId);

      if (data.role === 'super_admin') {
        fetchAllAccounts();
      }
    } else {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);

      const defaultPayload = {
        user_id: userId,
        email: userEmail,
        business_name: 'New Business',
        country: 'Local',
        plan: 'pro',
        role: 'user',
        default_terms: DEFAULT_TERMS_HEB,
        trial_ends_at: trialEndDate.toISOString(),
        last_sign_in: nowIso
      };

      const { data: newData, error: insertError } = await supabase
        .from('business_settings')
        .insert([defaultPayload])
        .select()
        .maybeSingle();

      if (insertError) console.error("Auto-init error:", insertError);

      if (newData) {
        setSettingId(newData.id);
        setBizName(newData.business_name);
        setBizEmail(newData.email);
        setBizPhone(newData.phone || '');
        setBizAddress(newData.address || '');
        setBizPlan(newData.plan);
        setBizRole(newData.role);
        setBizCountry(newData.country || 'Local');
        setDefaultTerms(newData.default_terms || DEFAULT_TERMS_HEB);
        setTrialEndsAt(newData.trial_ends_at);
        setCurrency('ILS');
        setTerms(DEFAULT_TERMS_HEB);
      } else {
        setSettingId(null);
        setBizPlan('pro');
        setBizRole('user');
        setBizCountry('Local');
        setDefaultTerms(DEFAULT_TERMS_HEB);
        setTrialEndsAt(trialEndDate.toISOString());
        setCurrency('ILS');
        setTerms(DEFAULT_TERMS_HEB);
      }
    }
  }

  async function fetchAllAccounts() {
    const { data, error } = await supabase.from('business_settings').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setAllAccounts(data);
    }
  }

  async function handleAdminPlanChange(accountId, newPlan) {
    if (!newPlan) return;
    const updatePayload = { plan: newPlan };
    
    if (newPlan !== 'free') {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);
      updatePayload.trial_ends_at = trialEndDate.toISOString();
    } else {
      updatePayload.trial_ends_at = null;
    }

    const { data, error } = await supabase
      .from('business_settings')
      .update(updatePayload)
      .eq('id', accountId)
      .select();
    
    if (error) {
      setStatusMsg({ text: 'Error updating user plan: ' + error.message, type: 'error' });
    } else if (!data || data.length === 0) {
      setStatusMsg({ text: 'Error: RLS policy blocked update on business_settings.', type: 'error' });
    } else {
      setStatusMsg({ text: 'User plan updated successfully!', type: 'success' });
      fetchAllAccounts();
    }
  }

  async function handleToggleLifetime(accountId, currentTrialEnds) {
    const newTrialEnds = currentTrialEnds === null ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null;
    const { error } = await supabase.from('business_settings').update({ trial_ends_at: newTrialEnds }).eq('id', accountId);
    if (error) {
      setStatusMsg({ text: 'Error updating user access: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: isHebrew ? 'סטטוס הגישה עודכן בהצלחה!' : 'Access status updated successfully!', type: 'success' });
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
      address: bizAddress,
      logo_url: bizLogoUrl,
      default_terms: defaultTerms,
      country: bizCountry,
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

  async function handleAddExpense(e) {
    e.preventDefault();
    if (!session?.user?.id) return;

    const { error } = await supabase.from('expenses').insert([{
      user_id: session.user.id,
      description: expenseDesc,
      amount: Number(expenseAmount),
      category: expenseCategory,
      is_recurring: isRecurring,
      expense_date: new Date().toISOString().split('T')[0]
    }]);

    if (error) {
      setStatusMsg({ text: 'Error adding expense: ' + error.message, type: 'error' });
    } else {
      setExpenseDesc('');
      setExpenseAmount('');
      setIsRecurring(false);
      fetchExpenses();
      setStatusMsg({ text: isHebrew ? 'ההוצאה נוספה בהצלחה!' : 'Expense added successfully!', type: 'success' });
    }
  }

  async function handleDeleteExpense(expenseId) {
    if (!window.confirm(isHebrew ? 'למחוק הוצאה זו?' : 'Delete this expense?')) return;
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
    if (error) setStatusMsg({ text: 'Error deleting expense: ' + error.message, type: 'error' });
    else fetchExpenses();
  }

  const exportToCSV = (dataArray, filename) => {
    if (!dataArray || dataArray.length === 0) {
      alert(isHebrew ? 'אין נתונים לייצוא.' : 'No data to export.');
      return;
    }
    const keys = Object.keys(dataArray[0]);
    const csvContent = [
      keys.join(','),
      ...dataArray.map(row => keys.map(key => JSON.stringify(row[key] ?? '')).join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportQuotes = () => {
    const exportData = filteredQuotes.map(q => ({
      ID: q.id,
      Client: q.clients?.company_name || '',
      Email: q.clients?.email || '',
      Status: q.status,
      Total: q.total,
      ValidUntil: q.valid_until || '',
      CreatedAt: q.created_at
    }));
    exportToCSV(exportData, 'quotes_report.csv');
  };

  const handleExportExpenses = () => {
    const exportData = filteredExpensesForReport.map(e => ({
      ID: e.id,
      Description: e.description,
      Category: e.category,
      Amount: e.amount,
      Date: e.expense_date,
      Recurring: e.is_recurring ? 'Yes' : 'No'
    }));
    exportToCSV(exportData, 'expenses_report.csv');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (isSignUp) {
      const { data: existingBiz, error: checkErr } = await supabase
        .from('business_settings')
        .select('email')
        .eq('email', emailInput)
        .maybeSingle();

      if (existingBiz) {
        setAuthError(isHebrew ? 'כתובת האימייל כבר קיימת במערכת! אנא התחבר או השתמש בשחזור סיסמה.' : 'Email already registered! Please sign in or use password reset.');
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email: emailInput, password: passwordInput });
      if (error) {
        setAuthError(isHebrew ? 'כתובת האימייל כבר קיימת במערכת! אנא התחבר או השתמש בשחזור סיסמה.' : 'Email already registered! Please sign in or use password reset.');
      } else {
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          setAuthError(isHebrew ? 'כתובת האימייל כבר קיימת במערכת! אנא התחבר.' : 'Email already exists! Please sign in.');
        } else {
          setAuthSuccess(isHebrew ? 'ההרשמה הצליחה! המערכת יוצרת כעת פרופיל משתמש עם 14 יום ניסיון מלא ב-PRO...' : 'Sign up successful! Initializing user profile with free trial...');
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: emailInput, password: passwordInput });
      if (error) {
        setAuthError(isHebrew ? 'שגיאה בהתחברות: בדוק את האימייל והסיסמה או השתמש בשחזור סיסמה.' : 'Login error: check your credentials or reset password.');
      } else {
        setStatusMsg({ text: isHebrew ? 'התחברת בהצלחה' : 'Logged in successfully', type: 'success' });
      }
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMsg('');
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin,
    });
    setResetLoading(false);
    if (error) {
      setResetMsg('שגיאה: ' + error.message);
    } else {
      setResetMsg('קישור לשחזור סיסמה נשלח בהצלחה למייל שלך!');
      setTimeout(() => {
        setForgotOpen(false);
        setResetMsg('');
        setResetEmail('');
      }, 3000);
    }
  };

  const handleUpdatePasswordFromRecovery = async (e) => {
    e.preventDefault();
    setRecoveryUpdateLoading(true);
    setRecoveryUpdateMsg('');
    const { error } = await supabase.auth.updateUser({ password: newPasswordInput });
    setRecoveryUpdateLoading(false);
    if (error) {
      setRecoveryUpdateMsg('שגיאה בעדכון הסיסמה: ' + error.message);
    } else {
      setRecoveryUpdateMsg('הסיסמה עודכנה בהצלחה! מעביר אותך למערכת...');
      setTimeout(() => {
        setIsPasswordRecoveryMode(false);
        window.location.href = window.location.origin;
      }, 2000);
    }
  };

  const handleSignOut = async () => await supabase.auth.signOut();

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: '', quantity: '', unit_price: '' }]);

  const handleAddFromCatalog = (e) => {
    const sId = e.target.value;
    if (!sId) return;
    const svc = services.find(s => s.id.toString() === sId);
    if (svc) {
      if (items.length === 1 && items[0].description === '' && items[0].unit_price === '') {
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
    if (!session?.user?.id) return;
    const { error } = await supabase.from('services').insert([{ name: newServiceName, price: Number(newServicePrice), user_id: session.user.id }]);
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

  async function handleDeleteClient(clientId) {
    if (!window.confirm(isHebrew ? 'למחוק לקוח זה? שים לב שהדבר עלול להשפיע על הצעות מחיר קשורות.' : 'Delete this client?')) return;
    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) setStatusMsg({ text: 'Error deleting client: ' + error.message, type: 'error' });
    else {
      setStatusMsg({ text: isHebrew ? 'הלקוח נמחק בהצלחה.' : 'Client deleted successfully.', type: 'success' });
      fetchClients();
    }
  }

  async function handleDeleteQuote(quoteId) {
    if (!window.confirm(isHebrew ? 'למחוק הצעת מחיר זו לצמיתות?' : 'Delete this quote permanently?')) return;
    await supabase.from('quote_items').delete().eq('quote_id', quoteId);
    const { error } = await supabase.from('quotes').delete().eq('id', quoteId);
    if (error) {
      setStatusMsg({ text: 'Error deleting quote: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: isHebrew ? 'ההצעה נמחקה בהצלחה!' : 'Quote deleted successfully!', type: 'success' });
      fetchQuotes();
    }
  }

  async function handleStatusChange(quoteId, newStatus) {
    const { error } = await supabase.from('quotes').update({ status: newStatus.toLowerCase() }).eq('id', quoteId);
    if (error) {
      setStatusMsg({ text: 'Error updating status: ' + error.message, type: 'error' });
    } else {
      setStatusMsg({ text: isHebrew ? 'סטטוס ההצעה עודכן בהצלחה!' : 'Quote status updated successfully!', type: 'success' });
      fetchQuotes();
    }
  }

  const sendWhatsApp = (proposal) => {
    const clientNameVal = proposal.clients?.company_name || 'לקוח';
    let clientPhoneVal = proposal.clients?.phone ? proposal.clients.phone.replace(/\D/g, '') : '';
    
    if (isLocalIsraeliBusiness) {
      if (clientPhoneVal.startsWith('0')) {
        clientPhoneVal = '972' + clientPhoneVal.slice(1);
      } else if (clientPhoneVal.length === 9 && !clientPhoneVal.startsWith('972')) {
        clientPhoneVal = '972' + clientPhoneVal;
      }
    } else {
      if (clientPhoneVal.startsWith('0')) {
        clientPhoneVal = '1' + clientPhoneVal.slice(1);
      } else if (clientPhoneVal.length === 10 && !clientPhoneVal.startsWith('1')) {
        clientPhoneVal = '1' + clientPhoneVal;
      }
    }

    const isBiz = (proposal.client_type || proposal.clients?.client_type) === 'business';
    const quoteSub = proposal.subtotal || 0;
    const quoteDiscount = proposal.discount || 0;
    const discountedBase = quoteSub - ((quoteSub * quoteDiscount) / 100);

    const priceStr = isBiz 
      ? `₪${formatNum(discountedBase > 0 ? discountedBase : proposal.total)} + מע"מ` 
      : `₪${formatNum(proposal.total)}`;

    const text = isHebrew 
      ? `הי ${clientNameVal}, הנה הצעת המחיר שלך מספר #${proposal.id.slice(0, 6)} על סך ${priceStr}. בתוקף עד ${proposal.valid_until || 'N/A'}.\n\nלצפייה בהצעה:\n${window.location.origin}/public-quote/${proposal.id}`
      : `Hi ${clientNameVal}, here is your quote #${proposal.id.slice(0, 6)} totaling ${isHebrew ? priceStr : `${sym}${formatNum(proposal.total)} + VAT`}. Valid until ${proposal.valid_until || 'N/A'}.\n\nView quote:\n${window.location.origin}/public-quote/${proposal.id}`;
    
    const url = clientPhoneVal 
      ? `https://wa.me/${clientPhoneVal}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
      
    window.open(url, '_blank');
  };

  const executeEmailSend = async (quote) => {
    setStatusMsg({ text: isHebrew ? 'שולח אימייל ללקוח דרך info@quotecodepro.com...' : 'Sending email via cloud...', type: 'success' });

    try {
      const quoteSym = getCurrencySymbol(quote.currency);
      const quoteLink = `${window.location.origin}/public-quote/${quote.id}`;
      
      const clientEmailVal = quote.clients?.email || quote.client_email || '';
      const clientNameVal = quote.clients?.company_name || quote.client_name || 'לקוח';

      const payload = {
        to: clientEmailVal,
        clientName: clientNameVal,
        quoteId: quote.id,
        total: formatNum(quote.total),
        currencySymbol: quoteSym,
        quoteLink: quoteLink,
        businessName: bizName,
        logoUrl: bizLogoUrl,
        businessLogo: bizLogoUrl,
        logo: bizLogoUrl,
        isHebrew: isHebrew
      };

      const { data, error } = await supabase.functions.invoke('send-quote-email', {
        body: payload
      });

      if (error) throw error;
      setStatusMsg({ text: isHebrew ? '📧 האימייל נשלח בהצלחה ללקוח דרך info@quotecodepro.com!' : '📧 Email sent successfully!', type: 'success' });
    } catch (err) {
      console.error("Email send error:", err);
      setStatusMsg({ text: isHebrew ? '⚠️ שגיאה בשליחת המייל מהשרת: ' + err.message : 'Error sending email: ' + err.message, type: 'error' });
    }
  };

  const handleProtectedAction = (quoteId, actionType, callback) => {
    if (actionType === 'edit' || actionType === 'duplicate') {
      if (!isBasicOrAbove) {
        setActiveTooltip({ quoteId, action: actionType });
        setTimeout(() => setActiveTooltip({ quoteId: null, action: null }), 2500);
        return;
      }
    }
    if (actionType === 'whatsapp' || actionType === 'delete') {
      if (!isPro) {
        setActiveTooltip({ quoteId, action: actionType });
        setTimeout(() => setActiveTooltip({ quoteId: null, action: null }), 2500);
        return;
      }
    }
    callback();
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.unit_price || 0)), 0);
  const discountAmount = (subtotal * Number(discount || 0)) / 100;
  const baseAmount = subtotal - discountAmount;
  
  let taxRate = isLocalIsraeliBusiness ? 0.18 : 0.00;
  
  let taxAmount = 0;
  let totalAmount = 0;

  if (isLocalIsraeliBusiness && isHebrew && clientType === 'private') {
    totalAmount = baseAmount;
    taxAmount = totalAmount - (totalAmount / (1 + taxRate));
  } else {
    taxAmount = baseAmount * taxRate;
    totalAmount = baseAmount + taxAmount;
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyQuotesCount = quotes.filter(q => {
    const qDate = new Date(q.created_at);
    return qDate.getMonth() === currentMonth && qDate.getFullYear() === currentYear;
  }).length;

  const planLimit = effectivePlan.toLowerCase() === 'free' ? 5 : effectivePlan.toLowerCase() === 'basic' ? 20 : '∞';

  const totalQuotesCount = quotes.length;
  const totalRevenue = quotes.filter(q => q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid').reduce((sum, q) => sum + Number(q.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const now = new Date();
  const reportYear = now.getFullYear();
  const reportMonth = now.getMonth();

  const filteredQuotesForReport = quotes.filter(q => {
    if (!(q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid')) return false;
    const qDate = new Date(q.created_at);

    if (financeReportType === 'custom') {
      if (!startDate && !endDate) return true;
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return qDate >= start && qDate <= end;
    }

    if (qDate.getFullYear() !== reportYear) return false;

    if (financeReportType === 'monthly') {
      return qDate.getMonth() === reportMonth;
    } else if (financeReportType === 'quarterly') {
      const currentQuarter = Math.floor(reportMonth / 3);
      const qQuarter = Math.floor(qDate.getMonth() / 3);
      return qQuarter === currentQuarter;
    } else if (financeReportType === 'half-yearly') {
      const currentHalf = reportMonth < 6 ? 0 : 1;
      const qHalf = qDate.getMonth() < 6 ? 0 : 1;
      return qHalf === currentHalf;
    } else {
      return true;
    }
  });

  const filteredExpensesForReport = expenses.filter(exp => {
    const expDate = new Date(exp.expense_date);
    if (exp.is_recurring) return true;

    if (financeReportType === 'custom') {
      if (!startDate && !endDate) return true;
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return expDate >= start && expDate <= end;
    }

    if (expDate.getFullYear() !== reportYear) return false;

    if (financeReportType === 'monthly') {
      return expDate.getMonth() === reportMonth;
    } else if (financeReportType === 'quarterly') {
      const currentQuarter = Math.floor(reportMonth / 3);
      const expQuarter = Math.floor(expDate.getMonth() / 3);
      return expQuarter === currentQuarter;
    } else if (financeReportType === 'half-yearly') {
      const currentHalf = reportMonth < 6 ? 0 : 1;
      const expHalf = expDate.getMonth() < 6 ? 0 : 1;
      return expHalf === currentHalf;
    } else {
      return true;
    }
  });

  const adminTotalQuotesCount = filteredQuotesForReport.length;
  const adminTotalRevenue = filteredQuotesForReport.reduce((sum, q) => sum + Number(q.total || 0), 0);
  const adminTotalExpenses = filteredExpensesForReport.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const adminNetProfit = adminTotalRevenue - adminTotalExpenses;

  const monthNames = isHebrew ? ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = monthNames.map((name, index) => {
    let income = 0;
    let expense = 0;
    
    quotes.forEach(q => {
      if (q.status?.toLowerCase() === 'approved' || q.status?.toLowerCase() === 'paid') {
        const d = new Date(q.created_at);
        if (d.getFullYear() === reportYear && d.getMonth() === index) {
          income += Number(q.total || 0);
        }
      }
    });

    expenses.forEach(exp => {
      const d = new Date(exp.expense_date);
      if (exp.is_recurring) {
        if (d.getFullYear() < reportYear || (d.getFullYear() === reportYear && d.getMonth() <= index)) {
          expense += Number(exp.amount || 0);
        }
      } else if (d.getFullYear() === reportYear && d.getMonth() === index) {
        expense += Number(exp.amount || 0);
      }
    });

    return { name, [isHebrew ? 'הכנסות' : 'Income']: income, [isHebrew ? 'הוצאות' : 'Expenses']: expense };
  });

  const getCurrencySymbol = (curr) => {
    if (isLocalIsraeliBusiness) return '₪';
    if (!curr) return '$';
    if (curr === 'EUR') return '€';
    if (curr === 'GBP') return '£';
    if (curr === 'ILS') return '₪';
    return '$';
  };
  const sym = getCurrencySymbol(currency);

  const showQuoteForm = isCreatingQuote || editingQuoteId !== null;

  const handleEditClick = (quote) => {
    if (quote.status?.toLowerCase() === 'approved' || quote.status?.toLowerCase() === 'paid' || quote.signature) {
      alert(isHebrew 
        ? '⚠️ אזהרה משפטית: לא ניתן לערוך הצעת מחיר שכבר אושרה ונחתמה על ידי הלקוח! לפי החוק והתקנים העסקיים, מסמך חתום הינו חוזה מחייב נעול. כדי לבצע שינויים יש לשכפל את ההצעה או ליצור הצעה חדשה.' 
        : 'Cannot edit an approved/signed quote.'
      );
      return;
    }

    setEditingQuoteId(quote.id);
    setIsCreatingQuote(false);
    setClientName(quote.clients?.company_name || '');
    setClientEmail(quote.clients?.email || '');
    setClientPhone(quote.clients?.phone || '');
    setClientType(quote.client_type || quote.clients?.client_type || '');
    setClientTaxId(quote.clients?.tax_id || '');
    setClientAddress(quote.clients?.address || '');
    
    setCurrency(isLocalIsraeliBusiness ? 'ILS' : (quote.currency || 'USD'));

    setQuoteStatus(quote.status ? quote.status.charAt(0).toUpperCase() + quote.status.slice(1) : 'Draft');
    setValidUntil(quote.valid_until || '');
    setDiscount(quote.discount || ''); 

    let editTerms = defaultTerms;
    let editNotes = quote.notes || '';

    setTerms(editTerms);
    setNotes(editNotes);
    
    if (quote.quote_items && quote.quote_items.length > 0) {
      setItems(quote.quote_items.map(item => ({ description: item.description, quantity: item.quantity, unit_price: item.unit_price })));
    } else {
      setItems([{ description: '', quantity: '', unit_price: '' }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMsg({ text: isHebrew ? `טוען לעריכה הצעה #${quote.id.slice(0, 6)}...` : `Editing Quote #${quote.id.slice(0, 6)}...`, type: 'success' });
  };

  const handleCreateNewQuoteClick = () => {
    setIsCreatingQuote(true);
    setEditingQuoteId(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientType('');
    setClientTaxId('');
    setClientAddress('');
    setValidUntil('');
    setDiscount('');
    setTerms(defaultTerms);
    setNotes('');
    setCurrency(isLocalIsraeliBusiness ? 'ILS' : 'USD');
    setItems([{ description: '', quantity: '', unit_price: '' }]);
  };

  const handleDuplicateQuote = (quote) => {
    setEditingQuoteId(null); 
    setIsCreatingQuote(true);
    setClientName(quote.clients?.company_name || '');
    setClientEmail(quote.clients?.email || '');
    setClientPhone(quote.clients?.phone || '');
    setClientType(quote.client_type || quote.clients?.client_type || '');
    setClientTaxId(quote.clients?.tax_id || '');
    setClientAddress(quote.clients?.address || '');
    
    setCurrency(isLocalIsraeliBusiness ? 'ILS' : (quote.currency || 'USD'));

    setQuoteStatus('Draft');
    setValidUntil(quote.valid_until || '');
    setDiscount(quote.discount || '');

    let dupTerms = defaultTerms;
    let dupNotes = quote.notes || '';

    setTerms(dupTerms);
    setNotes(dupNotes);
    
    if (quote.quote_items && quote.quote_items.length > 0) {
      setItems(quote.quote_items.map(item => ({ description: item.description, quantity: item.quantity, unit_price: item.unit_price })));
    } else {
      setItems([{ description: '', quantity: '', unit_price: '' }]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatusMsg({ text: isHebrew ? 'ההצעה נטענה לשכפול בהצלחה.' : 'Quote loaded for duplication.', type: 'success' });
  };

  const handleCancelEdit = () => {
    setEditingQuoteId(null);
    setIsCreatingQuote(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientType('');
    setClientTaxId('');
    setClientAddress('');
    setValidUntil('');
    setDiscount('');
    setTerms(defaultTerms);
    setNotes('');
    setCurrency(isLocalIsraeliBusiness ? 'ILS' : 'USD');
    setItems([{ description: '', quantity: '', unit_price: '' }]);
    setStatusMsg({ text: isHebrew ? 'הפעולה בוטלה. הנה רשימת ההצעות.' : 'Action cancelled. Here are your quotes.', type: 'success' });
  };

  async function handleSaveQuote(e) {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      if (editingQuoteId) {
        const originalQuote = quotes.find(q => q.id === editingQuoteId);
        if (originalQuote && (originalQuote.status?.toLowerCase() === 'approved' || originalQuote.status?.toLowerCase() === 'paid' || originalQuote.signature)) {
          setStatusMsg({ text: isHebrew ? '⚠️ שגיאה משפטית: לא ניתן לעדכן הצעה שכבר אושרה ונחתמה!' : 'Cannot update approved/signed quote.', type: 'error' });
          return;
        }
      }

      if (!editingQuoteId && !isSuperAdmin) {
        const limit = effectivePlan.toLowerCase() === 'free' ? 5 : effectivePlan.toLowerCase() === 'basic' ? 20 : Infinity;
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
      const existingClient = clients.find(c => c.company_name?.toLowerCase() === clientName.toLowerCase() && c.user_id === session.user.id);
      
      const clientPayload = {
        company_name: clientName,
        email: clientEmail,
        phone: clientPhone,
        client_type: clientType,
        tax_id: clientTaxId,
        address: clientAddress,
        notes: notes,
        user_id: session.user.id
      };

      if (existingClient) {
        clientId = existingClient.id;
        await supabase.from('clients').update(clientPayload).eq('id', clientId);
      } else {
        const { data: newClientData, error: clientError } = await supabase.from('clients').insert([clientPayload]).select();
        if (clientError) throw clientError;
        clientId = newClientData[0].id;
      }

      let dbCurrency = isLocalIsraeliBusiness ? 'ILS' : currency;

      const quotePayload = {
        client_id: clientId,
        client_type: clientType,
        currency: dbCurrency,
        subtotal: subtotal,
        tax_rate: taxRate,
        total: totalAmount,
        status: quoteStatus.toLowerCase(),
        valid_until: validUntil || null,
        discount: Number(discount || 0),
        terms: defaultTerms,
        notes: notes,
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
        quantity: Number(item.quantity || 1),
        unit_price: Number(item.unit_price || 0),
        total_price: Number(item.quantity || 1) * Number(item.unit_price || 0)
      }));

      const { error: itemsError } = await supabase.from('quote_items').insert(quoteItemsToInsert);
      if (itemsError) throw itemsError;

      setStatusMsg({ 
        text: editingQuoteId 
          ? (isHebrew ? `הצעה #${editingQuoteId.slice(0, 6)} עודכנה בהצלחה!` : `Quote #${editingQuoteId.slice(0, 6)} successfully updated!`) 
          : (isHebrew ? `ההצעה הופקה ונשמרה בענן בהצלחה! סה"כ: ${sym}${formatNum(totalAmount)}` : `Quote successfully created and saved to cloud! Total: ${sym}${formatNum(totalAmount)}`), 
        type: 'success' 
      });
      
      setEditingQuoteId(null);
      setIsCreatingQuote(false);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setClientType('');
      setClientTaxId('');
      setClientAddress('');
      setValidUntil('');
      setDiscount('');
      setTerms(defaultTerms);
      setNotes('');
      setCurrency(isLocalIsraeliBusiness ? 'ILS' : 'USD');
      setItems([{ description: '', quantity: '', unit_price: '' }]);
      loadData(session.user.id, session.user.email);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: isHebrew ? `שגיאה בשמירת ההצעה: ${err.message}` : `Error saving quote: ${err.message}`, type: 'error' });
    }
  }

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = (quote.clients?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || (quote.status || 'draft').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aVal, bVal;
    if (quoteSortField === 'id') {
      aVal = a.id;
      bVal = b.id;
    } else if (quoteSortField === 'client') {
      aVal = a.clients?.company_name || '';
      bVal = b.clients?.company_name || '';
    } else if (quoteSortField === 'total') {
      aVal = Number(a.total || 0);
      bVal = Number(b.total || 0);
    } else if (quoteSortField === 'status') {
      aVal = a.status || '';
      bVal = b.status || '';
    } else if (quoteSortField === 'views') {
      aVal = Number(a.view_count || 0);
      bVal = Number(b.view_count || 0);
    } else {
      aVal = a.created_at || '';
      bVal = b.created_at || '';
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return quoteSortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return quoteSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredClients = clients.filter(client => {
    const term = clientSearchTerm.toLowerCase();
    return (client.company_name && client.company_name.toLowerCase().includes(term)) ||
           (client.email && client.email.toLowerCase().includes(term)) ||
           (client.tax_id && client.tax_id.toLowerCase().includes(term));
  }).sort((a, b) => {
    let aVal = a[clientSortField];
    let bVal = b[clientSortField];

    if (aVal === null || aVal === undefined) aVal = '';
    if (bVal === null || bVal === undefined) bVal = '';

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return clientSortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return clientSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredAdminAccounts = allAccounts.filter(acc => {
    const term = adminSearchTerm.toLowerCase();
    return (acc.email && acc.email.toLowerCase().includes(term)) || 
           (acc.business_name && acc.business_name.toLowerCase().includes(term));
  }).sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === null || aVal === undefined) aVal = '';
    if (bVal === null || bVal === undefined) bVal = '';

    if (sortField === 'last_sign_in' || sortField === 'trial_ends_at') {
      const timeA = aVal ? new Date(aVal).getTime() : 0;
      const timeB = bVal ? new Date(bVal).getTime() : 0;
      return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    }

    if (sortField === 'trial_ends_at_status') {
      const statusA = (a.trial_ends_at === null || a.trial_ends_at === undefined) ? '1' : '0';
      const statusB = (b.trial_ends_at === null || b.trial_ends_at === undefined) ? '1' : '0';
      return sortDirection === 'asc' ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
    }

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const isExpiringSoon = trialDaysLeft !== null && trialDaysLeft <= 5 && trialDaysLeft > 0 && !isSuperAdmin;

  if (isInitializing) {
    return (
      <div style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#090d16', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <ProFlowLogo size={48} rtl={!isHebrew} />
          <div style={{ marginTop: '20px', fontSize: '1rem', color: '#94a3b8', fontWeight: 'bold' }}>Loading ProFlow...</div>
        </div>
      </div>
    );
  }

  if (isPasswordRecoveryMode) {
    return (
      <div style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} dir="rtl">
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: '#0f172a', marginBottom: '15px', fontWeight: '800' }}>איפוס סיסמה חדשה</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>הזן את הסיסמה החדשה שלך לחשבון</p>
          
          {recoveryUpdateMsg && (
            <div style={{ padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', background: recoveryUpdateMsg.includes('שגיאה') ? '#fee2e2' : '#dcfce7', color: recoveryUpdateMsg.includes('שגיאה') ? '#991b1b' : '#166534', fontWeight: 'bold' }}>
              {recoveryUpdateMsg}
            </div>
          )}

          <form onSubmit={handleUpdatePasswordFromRecovery}>
            <input 
              type="password" 
              value={newPasswordInput} 
              onChange={(e) => setNewPasswordInput(e.target.value)} 
              placeholder="סיסמה חדשה" 
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '15px', fontSize: '1rem', direction: 'rtl', textAlign: 'right' }} 
            />
            <button type="submit" disabled={recoveryUpdateLoading} style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
              {recoveryUpdateLoading ? 'מעדכן...' : 'עדכן סיסמה ושמור'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!session) {
    const isLoginHebrew = isHebrew;
    const loginDir = isLoginHebrew ? 'rtl' : 'ltr';

    return (
      <div dir={loginDir} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: isLoginHebrew ? 'right' : 'left' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                flexShrink: 0
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px', fontFamily: 'Inter, Segoe UI, sans-serif' }}>
                <span style={{ color: '#0f172a' }}>Pro</span>
                <span style={{ color: '#4f46e5', marginLeft: '2px' }}>Flow</span>
              </span>

            </div>
            
            {isSignUp ? (
              <div dir={isLoginHebrew ? 'rtl' : 'ltr'} style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)', border: '1px solid #c7d2fe', padding: '12px 16px', borderRadius: '10px', marginTop: '16px', marginBottom: '4px', color: '#4f46e5', fontSize: '0.88rem', fontWeight: '700', textAlign: isLoginHebrew ? 'right' : 'left', width: '100%', boxSizing: 'border-box', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.1)', lineHeight: '1.4' }}>
                {isLoginHebrew 
                  ? 'לרישום לאתר ולקבלת 14 יום ניסיון ב-PRO מתנה, נא הקלד אימייל וסיסמה.' 
                  : 'To register and claim your 14-day free PRO trial, please enter your email and password.'}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '12px' }}>
                {isLoginHebrew ? 'התחברות למערכת הניהול' : 'Sign in to your dashboard'}
              </p>
            )}
          </div>

          {authSuccess && <div style={{ padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', background: '#dcfce7', color: '#166534' }}>{authSuccess}</div>}
          {authError && <div style={{ padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', background: '#fee2e2', color: '#991b1b' }}>{authError}</div>}

          <form onSubmit={handleAuth} autoComplete="off" data-lpignore="true">
            <input type="text" name="fake_user_login" tabIndex="-1" aria-hidden="true" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }} />
            <input type="password" name="fake_pass_login" tabIndex="-1" aria-hidden="true" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }} />

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isLoginHebrew ? 'אימייל' : 'Email'}</label>
              <input type="email" name="user_email_field" autoComplete="off" data-lpignore="true" data-bwignore="true" data-1p-ignore data-dashlane-ignore="true" data-form-type="other" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required placeholder="user@example.com" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#eff6ff' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>{isLoginHebrew ? 'סיסמה' : 'Password'}</label>
              <input type="password" name="user_password_field" autoComplete="off" data-lpignore="true" data-bwignore="true" data-1p-ignore data-dashlane-ignore="true" data-form-type="other" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', background: '#eff6ff' }} />
            </div>
            <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
              {isLoginHebrew ? (isSignUp ? 'הירשם' : 'התחבר') : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: '600', padding: 0 }}
            >
              {isLoginHebrew 
                ? (isSignUp ? 'יש לך כבר חשבון? התחבר' : 'אין חשבון? הירשם וקבל 14 יום PRO מתנה!') 
                : (isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up!")}
            </button>
            {!isSignUp && (
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                {isLoginHebrew ? 'שכחת סיסמה?' : 'Forgot password?'}
              </button>
            )}
          </div>
        </div>

        {forgotOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }} dir={isLoginHebrew ? 'rtl' : 'ltr'}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => setForgotOpen(false)} style={{ position: 'absolute', top: '15px', [isLoginHebrew ? 'left' : 'right']: '15px', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}>✕</button>
              <h3 style={{ marginTop: 0, color: '#1e293b', fontSize: '1.3rem', marginBottom: '10px', fontWeight: '800' }}>איפוס סיסמה חדשה</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>הזן את כתובת האימייל שלך לחשבון</p>
              
              {resetMsg && (
                <div style={{ padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', background: resetMsg.includes('שגיאה') ? '#fee2e2' : '#dcfce7', color: resetMsg.includes('שגיאה') ? '#991b1b' : '#166534', fontWeight: 'bold' }}>
                  {resetMsg}
                </div>
              )}

              <form onSubmit={handleResetSubmit}>
                <input 
                  type="email" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                  placeholder="user@example.com" 
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', marginBottom: '15px', direction: 'ltr', textAlign: 'left' }} 
                />
                <button type="submit" disabled={resetLoading} style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}>
                  {resetLoading ? 'שולח...' : 'עדכן סיסמה ושמור'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const tableDir = isHebrew ? 'rtl' : 'ltr';

  return (
    <div dir={isHebrew ? 'rtl' : 'ltr'} style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '70px' }}>
      
      <style>{`
        @keyframes popupBounce {
          0% { transform: scale(0.6) translateY(8px); opacity: 0; }
          70% { transform: scale(1.05) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .feature-lock-tooltip {
          animation: popupBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .mobile-bottom-nav {
          display: none !important;
        }
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>

      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} isHebrew={isHebrew} />
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} isHebrew={isHebrew} isLocalIsraeliBusiness={isLocalIsraeliBusiness} />
      
      <LifetimeConfirmModal 
        isOpen={pendingLifetimeUser !== null}
        onClose={() => setPendingLifetimeUser(null)}
        onConfirm={async () => {
          if (!pendingLifetimeUser) return;
          const u = pendingLifetimeUser;
          setPendingLifetimeUser(null);
          await handleToggleLifetime(u.id, u.trial_ends_at);
        }}
        userEmail={pendingLifetimeUser?.email || ''}
        isHebrew={isHebrew}
      />

      <EmailConfirmModal 
        isOpen={pendingEmailQuote !== null} 
        onClose={() => setPendingEmailQuote(null)} 
        onConfirm={() => {
          const q = pendingEmailQuote;
          setPendingEmailQuote(null);
          executeEmailSend(q);
        }}
        clientEmail={pendingEmailQuote?.clients?.email || ''}
        isHebrew={isHebrew}
      />

      <div style={{ flex: '1 0 auto', padding: '10px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {(bizLogoUrl && bizLogoUrl.trim() !== '' && bizPlan === 'pro') ? (
                <img src={bizLogoUrl} alt="" style={{ height: '32px', maxWidth: '140px', objectFit: 'contain' }} />
              ) : (
                <ProFlowLogo size={28} />
              )}
            </div>

            <div style={{ flex: '0 1 auto', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AIChatWidget isHebrew={isHebrew} />
              {!isPro && !isSuperAdmin && (
                <button
                  onClick={() => setShowPricingModal(true)}
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ⭐ {isHebrew ? 'שדרג חבילה' : 'Upgrade Plan'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {isSuperAdmin && <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 6px', borderRadius: '6px' }}>SUPER ADMIN</span>}
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{session.user.email}</span>
              <button onClick={handleSignOut} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}>Sign Out</button>
            </div>
          </div>

          {statusMsg.text && statusMsg.text !== 'System connected to Supabase.' && (
            <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '15px', background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: statusMsg.type === 'success' ? '#166534' : '#991b1b', fontWeight: 'bold', textAlign: 'center', fontSize: '0.85rem' }}>
              {statusMsg.text}
            </div>
          )}

          {isExpiringSoon && (
            <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '12px 20px', borderRadius: '10px', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <span>⚠️</span>
              <span>{isHebrew ? `תקופת הניסיון שלך עומדת לפוג בעוד ${trialDaysLeft} ימים!` : `Your trial period expires in ${trialDaysLeft} days!`}</span>
            </div>
          )}

          {trialEndsAt && !isTrialExpired && !isSuperAdmin && !isExpiringSoon && (
            <div style={{ background: '#eff6ff', border: '1px solid #3b82f6', color: '#1d4ed8', padding: '10px 16px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '500', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px', fontSize: '0.85rem' }}>
              <span>{isHebrew ? '🚀 תקופת ניסיון פעילה (כולל כל פיצ\'רי ה-PRO)' : '🚀 Active Trial Period (Full PRO Access)'}</span>
              <span>{isHebrew ? `תקופת הניסיון שלך עומדת לפוג בעוד ${trialDaysLeft} ימים` : `Your trial period expires in ${trialDaysLeft} days`}</span>
            </div>
          )}

          {isTrialExpired && !isSuperAdmin && (
            <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', padding: '10px 16px', borderRadius: '8px', marginBottom: '15px', fontWeight: '500', fontSize: '0.85rem' }}>
              {isHebrew ? '⚠️ תקופת הניסיון שלך הסתיימה ועברת למסלול FREE. כדי לחזור ליהנות מכל פיצ\'רי ה-PRO, אנא שדרג את החבילה.' : '⚠️ Your trial has expired and you have been moved to the FREE tier. Please upgrade.'}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setActiveTab('main'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
              style={{
                flex: '1 1 auto', minWidth: '110px', padding: '8px 12px', borderRadius: '8px', 
                border: activeTab === 'main' ? '2px solid #4f46e5' : '1px solid #cbd5e1', 
                fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', 
                background: activeTab === 'main' ? '#4f46e5' : 'white', 
                color: activeTab === 'main' ? 'white' : '#475569', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              {isHebrew ? 'הצעות מחיר' : 'Quotes'}
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
              style={{
                flex: '1 1 auto', minWidth: '110px', padding: '8px 12px', borderRadius: '8px', 
                border: activeTab === 'settings' ? '2px solid #4f46e5' : '1px solid #cbd5e1', 
                fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', 
                background: activeTab === 'settings' ? '#4f46e5' : 'white', 
                color: activeTab === 'settings' ? 'white' : '#475569', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              {isHebrew ? 'הגדרות עסק' : 'Business Settings'}
            </button>
            <button
              onClick={() => { setActiveTab('clients'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
              style={{
                flex: '1 1 auto', minWidth: '110px', padding: '8px 12px', borderRadius: '8px', 
                border: activeTab === 'clients' ? '2px solid #4f46e5' : '1px solid #cbd5e1', 
                fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', 
                background: activeTab === 'clients' ? '#4f46e5' : 'white', 
                color: activeTab === 'clients' ? 'white' : '#475569', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              {isHebrew ? 'לקוחות' : 'Clients'}
            </button>
            {isSuperAdmin && (
              <>
                <button
                  onClick={() => { setActiveTab('finances'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
                  style={{
                    flex: '1 1 auto', minWidth: '110px', padding: '8px 12px', borderRadius: '8px', 
                    border: activeTab === 'finances' ? '2px solid #4f46e5' : '1px solid #cbd5e1', 
                    fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', 
                    background: activeTab === 'finances' ? '#4f46e5' : 'white', 
                    color: activeTab === 'finances' ? 'white' : '#475569', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  {isHebrew ? 'הוצאות/הכנסות' : 'Finances'}
                </button>
                <button
                  onClick={() => { setActiveTab('admin_clients'); setIsCreatingQuote(false); setEditingQuoteId(null); }}
                  style={{
                    flex: '1 1 auto', minWidth: '110px', padding: '8px 12px', borderRadius: '8px', 
                    border: activeTab === 'admin_clients' ? '2px solid #4f46e5' : '1px solid #cbd5e1', 
                    fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', 
                    background: activeTab === 'admin_clients' ? '#4f46e5' : 'white', 
                    color: activeTab === 'admin_clients' ? 'white' : '#475569', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  {isHebrew ? 'משתמשים' : 'Users Admin'}
                </button>
              </>
            )}
          </div>

          {activeTab === 'main' && !showQuoteForm && (
            <>
              {!isSuperAdmin && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #f1f5f9', borderTop: '4px solid #4f46e5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.totalQuotes}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b' }}>{totalQuotesCount}</div>
                    {!isPro && (
                      <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 'bold' }}>
                        {isHebrew ? `נוצרו החודש: ${monthlyQuotesCount} / ${planLimit}` : `This month: ${monthlyQuotesCount} / ${planLimit}`}
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #f1f5f9', borderTop: '4px solid #10b981', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.totalRevenue}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10b981' }}>{sym}{formatNum(totalRevenue)}</div>
                  </div>
                </div>
              )}

              {quotes.some(q => (q.view_count || 0) >= 3 && q.status !== 'approved' && q.status !== 'paid') && (
                <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#991b1b', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <span>🔥</span>
                    <span>
                      {isHebrew ? 'הצעה חמה! לקוח צפה בהצעה מספר פעמים ועדיין לא חתם. כדאי ליצור קשר!' : 'Hot Quote! A client viewed a quote multiple times without signing.'}
                    </span>
                  </div>
                </div>
              )}

              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '800', margin: 0 }}>{t.recentHistory}</h2>
                    <button 
                      onClick={handleCreateNewQuoteClick}
                      style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' }}
                    >
                      ➕ {isHebrew ? 'צור הצעת מחיר חדשה' : 'Create New Quote'}
                    </button>
                    <button 
                      onClick={handleExportQuotes}
                      style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
                    >
                      📥 {isHebrew ? 'ייצא לאקסל (CSV)' : 'Export CSV'}
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', width: '100%', maxWidth: '400px' }}>
                    <input 
                      type="text" 
                      placeholder={t.searchQuote} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ flex: '1 1 150px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.85rem', background: '#f8fafc' }}
                    />
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ flex: '1 1 100px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', boxSizing: 'border-box', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}
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
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '800px' }} dir={tableDir}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '10px 8px', textAlign: isHebrew ? 'right' : 'left', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleQuoteSort('id')}>
                          {isHebrew ? 'מספר הזמנה' : '# Order'} {quoteSortField === 'id' ? (quoteSortDirection === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ padding: '10px 8px', textAlign: isHebrew ? 'right' : 'left', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleQuoteSort('client')}>
                          {isHebrew ? 'שם לקוח' : 'Client Name'} {quoteSortField === 'client' ? (quoteSortDirection === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ padding: '10px 8px', textAlign: isHebrew ? 'right' : 'left', minWidth: '220px' }}>
                          {isHebrew ? 'תיאור' : 'Description'}
                        </th>
                        <th style={{ padding: '10px 8px', textAlign: isHebrew ? 'right' : 'left', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleQuoteSort('total')}>
                          {isHebrew ? 'הסכום' : 'Amount'} {quoteSortField === 'total' ? (quoteSortDirection === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ padding: '10px 8px', textAlign: isHebrew ? 'right' : 'left', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleQuoteSort('date')}>
                          {isHebrew ? 'תאריך' : 'Date'} {quoteSortField === 'date' ? (quoteSortDirection === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ padding: '10px 8px', textAlign: 'center', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleQuoteSort('status')}>
                          {isHebrew ? 'סטטוס' : 'Status'} {quoteSortField === 'status' ? (quoteSortDirection === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ padding: '10px 8px', textAlign: 'center', cursor: 'pointer', userSelect: 'none', width: '70px' }} onClick={() => handleQuoteSort('views')} title={isHebrew ? 'מיון לפי צפיות' : 'Sort by views'}>
                          {isHebrew ? 'צפיות' : 'Views'} {quoteSortField === 'views' ? (quoteSortDirection === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ padding: '10px 8px', textAlign: isHebrew ? 'left' : 'right' }}>
                          {isHebrew ? 'פעולות' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuotes.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                            {quotes.length === 0 
                              ? (isHebrew ? 'לא נמצאו הצעות מחיר במסד הנתונים.' : 'No quotes found in the database.') 
                              : (isHebrew ? 'לא נמצאו תוצאות לחיפוש הנוכחי.' : 'No results found for this search.')}
                          </td>
                        </tr>
                      ) : (
                        filteredQuotes.map((quote) => {
                          const quoteSym = getCurrencySymbol(quote.currency);
                          const currentStatus = quote.status ? quote.status.toLowerCase() : 'draft';
                          const isLocked = currentStatus === 'approved' || currentStatus === 'paid' || quote.signature;
                          const isDropdownOpen = openDropdownId === quote.id;

                          const firstItemDesc = quote.quote_items && quote.quote_items.length > 0 ? quote.quote_items[0].description : '';
                          const rawSubtotal = quote.subtotal || 0;
                          const rawDiscount = quote.discount || 0;
                          const discBase = rawSubtotal - ((rawSubtotal * rawDiscount) / 100);
                          const isBizClient = (quote.client_type || quote.clients?.client_type) === 'business';
                          const beforeVatAmount = isBizClient && isHebrew ? discBase : (quote.total / 1.18);

                          const getStatusBadge = (st) => {
                            switch(st) {
                              case 'approved': return { bg: '#dcfce7', color: '#166534', text: isHebrew ? 'אושר' : 'Approved' };
                              case 'paid': return { bg: '#dbeafe', color: '#1e40af', text: isHebrew ? 'שולם' : 'Paid' };
                              case 'sent': return { bg: '#fef9c3', color: '#854d0e', text: isHebrew ? 'נשלח' : 'Sent' };
                              default: return { bg: '#f1f5f9', color: '#475569', text: isHebrew ? 'טיוטה' : 'Draft' };
                            }
                          };
                          const badge = getStatusBadge(currentStatus);

                          return (
                            <tr key={quote.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                              
                              <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: isHebrew ? 'right' : 'left', fontWeight: '700', color: '#4f46e5', direction: 'ltr' }}>
                                #{quote.id.slice(0, 6)}
                              </td>

                              <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: isHebrew ? 'right' : 'left', fontWeight: '800', color: '#0f172a' }}>
                                {quote.clients?.company_name || 'N/A'}
                              </td>

                              <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: isHebrew ? 'right' : 'left', color: '#334155', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                {firstItemDesc || '-'}
                              </td>

                              <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: isHebrew ? 'right' : 'left' }}>
                                <div style={{ fontWeight: '900', color: '#0f172a', fontSize: '0.9rem' }}>
                                  {quoteSym}{formatNum(quote.total)}
                                </div>
                                {isLocalIsraeliBusiness && isHebrew && (
                                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>
                                    {isHebrew ? `לפני מע"מ: ${sym}${formatNum(beforeVatAmount)}` : `Before VAT: ${sym}${formatNum(beforeVatAmount)}`}
                                  </div>
                                )}
                              </td>

                              <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: isHebrew ? 'right' : 'left', color: '#64748b', fontSize: '0.8rem', direction: 'ltr' }}>
                                {formatDate(quote.created_at)}
                              </td>

                              <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center' }}>
                                <span style={{ background: badge.bg, color: badge.color, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block' }}>
                                  {badge.text}
                                </span>
                              </td>

                              <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <span>{quote.view_count || 0}</span>
                                  <span>👁️</span>
                                </span>
                              </td>

                              <td style={{ padding: '10px 8px', verticalAlign: 'middle', textAlign: isHebrew ? 'left' : 'right', position: 'relative' }}>
                                <div ref={dropdownRef} style={{ display: 'inline-block', position: 'relative' }}>
                                  <button
                                    onClick={(e) => handleToggleDropdown(e, quote.id)}
                                    style={{
                                      background: '#4f46e5',
                                      color: 'white',
                                      border: 'none',
                                      padding: '5px 12px',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontWeight: 'bold',
                                      fontSize: '0.75rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
                                    }}
                                  >
                                    {isHebrew ? 'פעולות ▼' : 'Actions ▼'}
                                  </button>

                                  {isDropdownOpen && (
                                    <>
                                      <div 
                                        style={{
                                          position: 'fixed',
                                          top: 0,
                                          left: 0,
                                          width: '100vw',
                                          height: '100vh',
                                          zIndex: 999998,
                                          background: 'transparent'
                                        }}
                                        onClick={() => setOpenDropdownId(null)}
                                        onTouchStart={() => setOpenDropdownId(null)}
                                      />
                                      <div 
                                        onClick={(e) => e.stopPropagation()}
                                        onTouchStart={(e) => e.stopPropagation()}
                                        style={{
                                          position: 'fixed',
                                          top: `${dropdownPos.top}px`,
                                          left: `${dropdownPos.left}px`,
                                          background: 'white',
                                          border: '1px solid #cbd5e1',
                                          borderRadius: '8px',
                                          boxShadow: '0 10px 35px rgba(0,0,0,0.25)',
                                          zIndex: 999999,
                                          minWidth: '200px',
                                          padding: '6px 0',
                                          textAlign: isHebrew ? 'right' : 'left'
                                        }}>
                                        <button
                                          onClick={() => { setOpenDropdownId(null); window.open(`/public-quote/${quote.id}`, '_blank'); }}
                                          style={{ width: '100%', background: 'none', border: 'none', padding: '9px 14px', textAlign: isHebrew ? 'right' : 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#3730a3', display: 'block', fontWeight: '500' }}
                                          onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                                          onMouseLeave={(e) => e.target.style.background = 'none'}
                                        >
                                          👁️ {isHebrew ? 'צפה במסמך' : 'View Quote'}
                                        </button>

                                        <div style={{ position: 'relative' }}>
                                          <button
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              handleProtectedAction(quote.id, 'edit', () => handleEditClick(quote));
                                            }}
                                            disabled={isLocked}
                                            style={{ width: '100%', background: 'none', border: 'none', padding: '9px 14px', textAlign: isHebrew ? 'right' : 'left', cursor: isLocked ? 'not-allowed' : 'pointer', fontSize: '0.85rem', color: isLocked ? '#94a3b8' : '#b45309', display: 'block', fontWeight: '500' }}
                                            onMouseEnter={(e) => { if(!isLocked) e.target.style.background = '#f1f5f9'; }}
                                            onMouseLeave={(e) => e.target.style.background = 'none'}
                                          >
                                            {isLocked ? (isHebrew ? '🔒 עריכה נעולה' : '🔒 Locked') : `✏️ ${t.edit}`}
                                          </button>
                                          {activeTooltip.quoteId === quote.id && activeTooltip.action === 'edit' && (
                                            <div className="feature-lock-tooltip" style={{
                                              position: 'absolute', top: 0, [isHebrew ? 'right' : 'left']: '105%',
                                              background: '#1e293b', color: '#fff', padding: '6px 12px', borderRadius: '6px',
                                              fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 999999, boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                                            }}>
                                              {isHebrew ? '🚀 אופציה זו זמינה ממנויי Basic ומעלה' : '🚀 Available on Basic plan+'}
                                            </div>
                                          )}
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                          <button
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              handleProtectedAction(quote.id, 'duplicate', () => handleDuplicateQuote(quote));
                                            }}
                                            style={{ width: '100%', background: 'none', border: 'none', padding: '9px 14px', textAlign: isHebrew ? 'right' : 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#115e59', display: 'block', fontWeight: '500' }}
                                            onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                                            onMouseLeave={(e) => e.target.style.background = 'none'}
                                          >
                                            📋 {t.duplicate}
                                          </button>
                                          {activeTooltip.quoteId === quote.id && activeTooltip.action === 'duplicate' && (
                                            <div className="feature-lock-tooltip" style={{
                                              position: 'absolute', top: 0, [isHebrew ? 'right' : 'left']: '105%',
                                              background: '#1e293b', color: '#fff', padding: '6px 12px', borderRadius: '6px',
                                              fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 999999, boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                                            }}>
                                              {isHebrew ? '🚀 אופציה זו זמינה ממנויי Basic ומעלה' : '🚀 Available on Basic plan+'}
                                            </div>
                                          )}
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                          <button
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              handleProtectedAction(quote.id, 'whatsapp', () => sendWhatsApp(quote));
                                            }}
                                            style={{ width: '100%', background: 'none', border: 'none', padding: '9px 14px', textAlign: isHebrew ? 'right' : 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}
                                            onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                                            onMouseLeave={(e) => e.target.style.background = 'none'}
                                          >
                                            <svg style={{ width: '15px', height: '15px', fill: '#065f46', flexShrink: 0 }} viewBox="0 0 24 24">
                                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                            </svg>
                                            <span>{isHebrew ? 'שלח בוואטסאפ' : 'Send WhatsApp'}</span>
                                          </button>
                                          {activeTooltip.quoteId === quote.id && activeTooltip.action === 'whatsapp' && (
                                            <div className="feature-lock-tooltip" style={{
                                              position: 'absolute', top: 0, [isHebrew ? 'right' : 'left']: '105%',
                                              background: '#1e293b', color: '#fff', padding: '6px 12px', borderRadius: '6px',
                                              fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 999999, boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                                            }}>
                                              {isHebrew ? '⭐ אופציה זו בלעדית למנויי PRO' : '⭐ Exclusive to PRO subscribers'}
                                            </div>
                                          )}
                                        </div>

                                        <button
                                          onClick={() => { setOpenDropdownId(null); setPendingEmailQuote(quote); }}
                                          style={{ width: '100%', background: 'none', border: 'none', padding: '9px 14px', textAlign: isHebrew ? 'right' : 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#1e40af', display: 'block', fontWeight: '500' }}
                                          onMouseEnter={(e) => e.target.style.background = '#f1f5f9'}
                                          onMouseLeave={(e) => e.target.style.background = 'none'}
                                        >
                                          ✉️ {isHebrew ? 'שלח במייל' : 'Send Email'}
                                        </button>

                                        <div style={{ position: 'relative' }}>
                                          <button
                                            onClick={() => {
                                              setOpenDropdownId(null);
                                              handleProtectedAction(quote.id, 'delete', () => handleDeleteQuote(quote.id));
                                            }}
                                            style={{ width: '100%', background: 'none', border: 'none', padding: '9px 14px', textAlign: isHebrew ? 'right' : 'left', cursor: 'pointer', fontSize: '0.85rem', color: '#991b1b', display: 'block', fontWeight: '500' }}
                                            onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                                            onMouseLeave={(e) => e.target.style.background = 'none'}
                                          >
                                            🗑️ {t.delete}
                                          </button>
                                          {activeTooltip.quoteId === quote.id && activeTooltip.action === 'delete' && (
                                            <div className="feature-lock-tooltip" style={{
                                              position: 'absolute', top: 0, [isHebrew ? 'right' : 'left']: '105%',
                                              background: '#1e293b', color: '#fff', padding: '6px 12px', borderRadius: '6px',
                                              fontSize: '0.75rem', whiteSpace: 'nowrap', zIndex: 999999, boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                                            }}>
                                              {isHebrew ? '⭐ אופציה זו בלעדית למנויי PRO' : '⭐ Exclusive to PRO subscribers'}
                                            </div>
                                          )}
                                        </div>

                                      </div>
                                    </>
                                  )}
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '800', margin: 0, marginBottom: '15px' }}>{t.servicesCatalog}</h2>
                
                <form onSubmit={handleAddService} style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder={t.serviceName} 
                    value={newServiceName} 
                    onChange={(e) => setNewServiceName(e.target.value)} 
                    required 
                    style={{ flex: '2 1 150px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.85rem', background: '#f8fafc' }} 
                  />
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder={t.defaultPrice} 
                    value={newServicePrice} 
                    onChange={(e) => setNewServicePrice(e.target.value)} 
                    required 
                    style={{ flex: '1 1 90px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', fontSize: '0.85rem', background: '#f8fafc' }} 
                  />
                  <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 2px 6px rgba(79, 70, 229, 0.2)' }}>
                    {t.addService}
                  </button>
                </form>

                <div style={{ overflowX: 'auto' }}>
                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '350px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '8px 6px' }}>{t.description}</th>
                        <th style={{ padding: '8px 6px' }}>{t.defaultPrice}</th>
                        <th style={{ padding: '8px 6px' }}>{t.actions}</th>
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
                          <tr key={svc.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                            <td style={{ padding: '10px 6px', fontWeight: '400', color: '#1e293b' }}>{svc.name}</td>
                            <td style={{ padding: '10px 6px', color: '#4f46e5', fontWeight: '400' }}>{formatNum(svc.price)}</td>
                            <td style={{ padding: '10px 6px' }}>
                               <button 
                            title={t.delete}
                            onClick={() => handleDeleteService(svc.id)}
                            style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '400', fontSize: '0.7rem' }}
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
            </>
          )}

          {activeTab === 'main' && showQuoteForm && (
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', marginBottom: '30px', border: editingQuoteId ? '2px solid #4f46e5' : '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h2 style={{ color: '#1e293b', marginTop: 0, fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>
                      {editingQuoteId ? `${isHebrew ? 'עריכת הצעה #' : 'Editing Quote #'}${editingQuoteId.slice(0, 6)}` : (isHebrew ? 'יצירת הצעת מחיר חדשה' : 'Create New Quote')}
                    </h2>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>
                      {isHebrew ? 'הזן את פרטי ההצעה ושמור את השינויים' : 'Enter the quote details and save changes'}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    {isHebrew ? 'ביטול וחזרה לרשימה' : 'Cancel & Return'}
                  </button>
                </div>

                <form onSubmit={handleSaveQuote}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.clientName}</label>
                      <input 
                        type="text" 
                        name="clientName" 
                        list="existing-clients-list"
                        value={clientName} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setClientName(val);
                          const found = clients.find(c => c.company_name?.toLowerCase() === val.toLowerCase());
                          if (found) {
                            if (found.client_type) {
                               setClientType(found.client_type);
                            }
                            if (found.email) setClientEmail(found.email);
                            if (found.phone) setClientPhone(found.phone);
                            if (found.tax_id) setClientTaxId(found.tax_id);
                            if (found.address) setClientAddress(found.address);
                            if (found.notes) setNotes(found.notes);
                          }
                        }} 
                        placeholder="e.g. Acme Corp" 
                        required 
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', background: '#f8fafc', fontSize: '0.9rem' }} 
                      />
                      <datalist id="existing-clients-list">
                        {clients.map(c => (
                          <option key={c.id} value={c.company_name} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{isHebrew ? 'סוג לקוח (חובה)' : 'Client Type'}</label>
                      <select 
                        name="clientType" 
                        value={clientType} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setClientType(val);
                          e.target.setCustomValidity('');
                        }} 
                        onInvalid={(e) => e.target.setCustomValidity(isHebrew ? 'בחר סוג לקוח' : 'Select client type')}
                        onInput={(e) => e.target.setCustomValidity('')}
                        required 
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', boxSizing: 'border-box', fontSize: '0.9rem', fontWeight: '400' }}
                      >
                        <option value="" disabled>{isHebrew ? 'בחר סוג לקוח...' : 'Select Client Type...'}</option>
                        <option value="business">{isHebrew ? 'עסקי (חברה/עוסק)' : 'Business'}</option>
                        <option value="private">{isHebrew ? 'פרטי (B2C)' : 'Private'}</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.clientEmail}</label>
                      <input type="email" name="clientEmail" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="contact@acme.com" required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#f8fafc', fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.clientPhone}</label>
                      <input type="text" name="clientPhone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+1 (555) 0192" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#f8fafc', fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{isHebrew ? 'ח.פ / עוסק / ת.ז' : 'Tax ID / ID'}</label>
                      <input type="text" name="clientTaxId" value={clientTaxId} onChange={(e) => setClientTaxId(e.target.value)} placeholder={isHebrew ? "לדוגמה: 512345678" : "e.g. 512345678"} required={clientType === 'business'} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left', background: '#f8fafc', fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{isHebrew ? 'כתובת' : 'Address'}</label>
                      <input type="text" name="clientAddress" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder={isHebrew ? "רחוב, עיר, מיקוד" : "123 Main St, City"} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', background: '#f8fafc', fontSize: '0.9rem' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.currency}</label>
                      <select name="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', boxSizing: 'border-box', fontSize: '0.9rem', fontWeight: '400' }}>
                        {isLocalIsraeliBusiness ? (
                          <option value="ILS">ILS (₪)</option>
                        ) : (
                          <>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.status}</label>
                      <select name="quoteStatus" value={quoteStatus} onChange={(e) => setQuoteStatus(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', boxSizing: 'border-box', fontSize: '0.9rem', fontWeight: '400' }}>
                        <option value="Draft">{isHebrew ? 'טיוטה' : 'Draft'}</option>
                        <option value="Sent">{isHebrew ? 'נשלח' : 'Sent'}</option>
                        <option value="Approved">{isHebrew ? 'אושר' : 'Approved'}</option>
                        <option value="Paid">{isHebrew ? 'שולם' : 'Paid'}</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.validUntil}</label>
                      <input type="date" name="validUntil" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.discount}</label>
                      <input type="text" name="discount" value={discount} onFocus={(e) => { if (e.target.value === '0') setDiscount(''); }} onChange={(e) => setDiscount(e.target.value)} placeholder="0" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.9rem' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{isHebrew ? 'תקנון ותנאים' : 'Terms & Conditions'}</label>
                    <textarea 
                      value={terms} 
                      onChange={(e) => setTerms(e.target.value)} 
                      rows="4"
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.85rem', fontFamily: 'inherit', lineHeight: '1.4' }} 
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{isHebrew ? 'הערות נוספות להצעה זו' : 'Additional Notes for this Quote'}</label>
                    <textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      rows="3"
                      placeholder={isHebrew ? "הערות מיוחדות ללקוח זה..." : "Special notes for this client..."}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.85rem', fontFamily: 'inherit', lineHeight: '1.4' }} 
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '800', margin: 0 }}>{t.quoteItems}</h3>
                    <div style={{ display: 'flex', gap: '8px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                      <select onChange={handleAddFromCatalog} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.8rem', fontWeight: '400' }}>
                        <option value="">{t.quickAdd}</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - {sym}{formatNum(s.price)}</option>
                        ))}
                      </select>
                      <button type="button" onClick={addItem} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '400', fontSize: '0.8rem' }}>{t.addItem}</button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: items.length > 1 ? '2fr 1fr 1fr 1fr 40px' : '2fr 1fr 1fr 1fr', gap: '8px', marginBottom: '4px', padding: '0 8px', fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>
                    <div>{isHebrew ? 'תיאור פריט' : 'Description'}</div>
                    <div>{isHebrew ? 'כמות' : 'Qty'}</div>
                    <div>{isHebrew ? 'מחיר יחידה' : 'Unit Price'}</div>
                    <div>{isHebrew ? 'סה"כ' : 'Total'}</div>
                    {items.length > 1 && <div></div>}
                  </div>

                  {items.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: items.length > 1 ? '2fr 1fr 1fr 1fr 40px' : '2fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px', alignItems: 'stretch', background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <input type="text" placeholder={isHebrew ? 'תיאור פריט' : 'Item description'} value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', background: 'white', fontSize: '0.85rem', color: '#334155' }} />
                      <input type="text" placeholder="1" value={item.quantity} onFocus={(e) => { if (e.target.value === '0') handleItemChange(index, 'quantity', ''); }} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box', background: 'white', fontSize: '0.85rem', color: '#334155' }} />
                      <input type="text" placeholder="0.00" value={item.unit_price} onFocus={(e) => { if (e.target.value === '0') handleItemChange(index, 'unit_price', ''); }} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} required style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', boxSizing: 'border-box', background: 'white', fontSize: '0.85rem', color: '#334155' }} />
                      
                      <div style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', fontWeight: '400', color: '#334155', textAlign: isHebrew ? 'left' : 'right', fontSize: '0.85rem', boxSizing: 'border-box', width: '100%', display: 'flex', alignItems: 'center', justifyContent: isHebrew ? 'flex-start' : 'flex-end', height: '100%' }}>
                        {sym}{formatNum(Number(item.quantity || 0) * Number(item.unit_price || 0))}
                      </div>

                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 0', borderRadius: '6px', cursor: 'pointer', width: '100%', textAlign: 'center', height: '100%', fontWeight: 'bold' }}>✕</button>
                      )}
                    </div>
                  ))}

                  <div style={{ borderTop: '2px solid #f1f5f9', marginTop: '15px', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#64748b', flexDirection: isHebrew ? 'row-reverse' : 'row', fontSize: '0.85rem' }}>
                      <span>{isLocalIsraeliBusiness && isHebrew && clientType === 'private' ? (isHebrew ? 'סכום ביניים (כולל מע"מ):' : 'Subtotal (Inc. VAT):') : t.subtotal}</span>
                      <span>{sym}{formatNum(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#ef4444', flexDirection: isHebrew ? 'row-reverse' : 'row', fontSize: '0.85rem', fontWeight: '400' }}>
                        <span>{isHebrew ? `הנחה (${discount}%):` : `Discount (${discount}%):`}</span>
                        <span>-{sym}{formatNum(discountAmount)}</span>
                      </div>
                    )}
                    {isLocalIsraeliBusiness && isHebrew && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#64748b', flexDirection: isHebrew ? 'row-reverse' : 'row', fontSize: '0.85rem' }}>
                        <span>{t.vat}</span>
                        <span>{sym}{formatNum(taxAmount)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', marginTop: '8px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                      <span>{t.totalAmount}</span>
                      <span style={{ color: '#4f46e5' }}>{sym}{formatNum(totalAmount)} {isLocalIsraeliBusiness ? '' : (currency === 'EUR' ? 'EUR' : currency === 'GBP' ? 'GBP' : currency === 'USD' ? 'USD' : '')}</span>
                    </div>
                    {isLocalIsraeliBusiness && isHebrew && clientType === 'private' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px', flexDirection: isHebrew ? 'row-reverse' : 'row' }}>
                        <span></span>
                        <span>{isHebrew ? `(הסכום כולל מע"מ בסך ${sym}{formatNum(taxAmount)})` : `(Includes VAT: ${sym}{formatNum(taxAmount)})`}</span>
                      </div>
                    )}
                  </div>

                  <button type="submit" style={{ width: '100%', background: editingQuoteId ? '#10b981' : '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '900', fontSize: '1.0rem', cursor: 'pointer', marginTop: '20px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' }} disabled={isTrialExpired && !isSuperAdmin}>
                    {editingQuoteId ? t.updateQuote : t.generateSave}
                  </button>
                </form>
              </div>
          )}

          {activeTab === 'clients' && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  👥 {isHebrew ? 'ניהול ספר לקוחות (CRM)' : 'Clients Management'}
                </h2>
              </div>
              <p style={{ color: '#64748b', marginBottom: '15px', fontSize: '0.85rem' }}>
                {isHebrew ? `סה"כ ${filteredClients.length} לקוחות רשומים במערכת` : `${filteredClients.length} total clients registered in the system`}
              </p>

              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder={isHebrew ? "חיפוש לקוח לפי שם, אימייל או ח.פ..." : "Search client..."} 
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', width: '250px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.85rem', background: '#f8fafc' }}
                />
              </div>

              <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '450px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '8px 6px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleClientSort('company_name')}>
                        {isHebrew ? 'שם חברה / לקוח' : 'Company / Name'} {clientSortField === 'company_name' ? (clientSortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '8px 6px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleClientSort('tax_id')}>
                        {isHebrew ? 'ח.פ / ת.ז' : 'Tax ID'} {clientSortField === 'tax_id' ? (clientSortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '8px 6px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleClientSort('email')}>
                        {isHebrew ? 'אימייל' : 'Email'} {clientSortField === 'email' ? (clientSortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '8px 6px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleClientSort('phone')}>
                        {isHebrew ? 'טלפון' : 'Phone'} {clientSortField === 'phone' ? (clientSortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '8px 6px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleClientSort('address')}>
                        {isHebrew ? 'כתובת' : 'Address'} {clientSortField === 'address' ? (clientSortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '8px 6px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleClientSort('client_type')}>
                        {isHebrew ? 'סוג לקוח' : 'Type'} {clientSortField === 'client_type' ? (clientSortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '8px 6px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleClientSort('notes')}>
                        {isHebrew ? 'הערות / הנחיות' : 'Notes'} {clientSortField === 'notes' ? (clientSortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '8px 6px' }}>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          {isHebrew ? 'לא נמצאו לקוחות התואמים את החיפוש.' : 'No clients found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client) => (
                        <tr key={client.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                          <td style={{ padding: '10px 6px', fontWeight: '400', color: '#1e293b' }}>{client.company_name}</td>
                          <td style={{ padding: '10px 6px', color: '#475569' }}><span dir="ltr">{client.tax_id || '-'}</span></td>
                          <td style={{ padding: '10px 6px', color: '#475569', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>{client.email || '-'}</td>
                          <td style={{ padding: '10px 6px', color: '#475569', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>{client.phone || '-'}</td>
                          <td style={{ padding: '10px 6px', color: '#475569' }}>{client.address || '-'}</td>
                          <td style={{ padding: '10px 6px' }}>
                            <span style={{
                              background: client.client_type === 'business' ? '#dbeafe' : '#f1f5f9',
                              color: client.client_type === 'business' ? '#1e40af' : '#475569',
                              padding: '4px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '400'
                            }}>
                              {client.client_type === 'business' ? (isHebrew ? 'עסקי' : 'Business') : (isHebrew ? 'פרטי' : 'Private')}
                            </span>
                          </td>
                          <td style={{ padding: '10px 6px', color: '#4f46e5', fontWeight: '400' }}>
                            {client.notes ? (
                              <span style={{ background: '#e0e7ff', padding: '3px 6px', borderRadius: '6px', fontSize: '0.75rem' }}>
                                {client.notes}
                              </span>
                            ) : '-'}
                          </td>
                          <td style={{ padding: '10px 6px' }}>
                            <button 
                              onClick={() => handleDeleteClient(client.id)}
                              style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: '400', fontSize: '0.7rem' }}
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
          )}

          {activeTab === 'settings' && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '800', marginTop: 0, marginBottom: '20px' }}>
                {t.businessSettings}
              </h2>
              <form onSubmit={handleSaveSettings}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.businessNameLabel}</label>
                    <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', background: '#f8fafc', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.taxIdLabel}</label>
                    <input type="text" value={bizTaxId} onChange={(e) => setBizTaxId(e.target.value)} placeholder="516000000" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#f8fafc', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{isHebrew ? 'אימייל עסק' : 'Business Email'}</label>
                    <input type="email" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} placeholder="business@example.com" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#f8fafc', fontSize: '0.9rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{isHebrew ? 'טלפון עסק' : 'Business Phone'}</label>
                    <input type="text" value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} placeholder="050-0000000" style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: '#f8fafc', fontSize: '0.9rem' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{isHebrew ? 'כתובת העסק' : 'Business Address'}</label>
                    <input type="text" value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} placeholder={isHebrew ? 'לדוגמה: הסתת 4, רמת גן' : 'e.g. Main St 10, City'} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', background: '#f8fafc', fontSize: '0.9rem' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{t.logoUrlLabel} {bizPlan !== 'pro' && <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>{isHebrew ? '(דורש חבילת Pro)' : '(Requires Pro plan)'}</span>}</label>
                  <input type="url" value={bizLogoUrl} onChange={(e) => setBizLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" disabled={bizPlan !== 'pro'} style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', direction: 'ltr', textAlign: 'left', background: bizPlan !== 'pro' ? '#f1f5f9' : '#f8fafc', fontSize: '0.9rem' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>{isHebrew ? 'תקנון ותנאים (ברירת מחדל להצעות חדשות)' : 'Default Terms & Conditions for New Quotes'}</label>
                  <textarea 
                    value={defaultTerms} 
                    onChange={(e) => setDefaultTerms(e.target.value)} 
                    rows="6"
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.9rem', fontFamily: 'inherit', lineHeight: '1.5' }} 
                  />
                </div>

                <button type="submit" style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  {t.saveSettings}
                </button>
              </form>
            </div>
          )}

          {isSuperAdmin && activeTab === 'finances' && (
             <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: '15px' }}>
                   <h2 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '800', margin: 0 }}>📊 {isHebrew ? 'הוצאות והכנסות ודוחות עסק' : 'Finances & Reports'}</h2>
                   
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                     <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>{isHebrew ? 'סוג דוח:' : 'Report Type:'}</span>
                     <select 
                       value={financeReportType} 
                       onChange={(e) => setFinanceReportType(e.target.value)}
                       style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.85rem', fontWeight: 'bold', color: '#4f46e5' }}
                     >
                       <option value="monthly">{isHebrew ? 'חודשי (מתחיל מאפס כל חודש)' : 'Monthly'}</option>
                       <option value="quarterly">{isHebrew ? 'רבעוני (3 חודשים)' : 'Quarterly'}</option>
                       <option value="half-yearly">{isHebrew ? 'חצי שנתי (6 חודשים)' : 'Half-Yearly'}</option>
                       <option value="yearly">{isHebrew ? 'שנתי (12 חודשים)' : 'Yearly'}</option>
                       <option value="custom">{isHebrew ? 'בחירת טווח תאריכים אישי' : 'Custom Date Range'}</option>
                     </select>
                   </div>
                </div>

                {financeReportType === 'custom' && (
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', border: '1px solid #e2e8f0' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>{isHebrew ? 'מתאריך:' : 'Start Date:'}</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>{isHebrew ? 'עד תאריך:' : 'End Date:'}</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', fontSize: '0.85rem' }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', borderRight: isHebrew ? '4px solid #4f46e5' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #4f46e5' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t.totalQuotes}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>{adminTotalQuotesCount}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', borderRight: isHebrew ? '4px solid #22c55e' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #22c55e' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t.totalRevenue}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#22c55e' }}>{sym}{formatNum(adminTotalRevenue)}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', borderRight: isHebrew ? '4px solid #ef4444' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #ef4444' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t.totalExpenses}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ef4444' }}>{sym}{formatNum(adminTotalExpenses)}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', borderRight: isHebrew ? '4px solid #3b82f6' : 'none', borderLeft: isHebrew ? 'none' : '4px solid #3b82f6' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t.netProfit}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: adminNetProfit >= 0 ? '#3b82f6' : '#ef4444' }}>{sym}{formatNum(adminNetProfit)}</div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px', height: '300px' }} dir="ltr">
                   <h2 style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '800', margin: 0, marginBottom: '15px', textAlign: isHebrew ? 'right' : 'left' }}>{isHebrew ? 'סקירה שנתית - הכנסות מול הוצאות' : 'Yearly Overview - Income vs Expenses'}</h2>
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="name" />
                       <YAxis />
                       <Tooltip formatter={(value) => `${sym}${formatNum(value)}`} />
                       <Legend wrapperStyle={{ paddingTop: '10px' }} />
                       <Bar dataKey={isHebrew ? 'הכנסות' : 'Income'} fill="#22c55e" radius={[4, 4, 0, 0]} />
                       <Bar dataKey={isHebrew ? 'הוצאות' : 'Expenses'} fill="#ef4444" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                </div>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                      <h2 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '800', margin: 0 }}>{t.expensesManagement}</h2>
                      <button 
                        onClick={handleExportExpenses}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                      >
                        📥 {isHebrew ? 'ייצא הוצאות לאקסל (CSV)' : 'Export Expenses CSV'}
                      </button>
                    </div>

                    <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexDirection: isHebrew ? 'row-reverse' : 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder={isHebrew ? 'תיאור ההוצאה (לדוגמה: אירוח שרת)' : 'Expense description'} 
                        value={expenseDesc} 
                        onChange={(e) => setExpenseDesc(e.target.value)} 
                        required 
                        style={{ flex: '2 1 150px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.85rem', background: 'white' }} 
                      />
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder={isHebrew ? 'סכום' : 'Amount'} 
                        value={expenseAmount} 
                        onChange={(e) => setExpenseAmount(e.target.value)} 
                        required 
                        style={{ flex: '1 1 80px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', fontSize: '0.85rem', background: 'white' }} 
                      />
                      <select 
                        value={expenseCategory} 
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        style={{ flex: '1 1 120px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', boxSizing: 'border-box', fontSize: '0.85rem', fontWeight: '400' }}
                      >
                        <option value="Hosting / Cloud">{isHebrew ? 'ענן ושרתים' : 'Hosting / Cloud'}</option>
                        <option value="Marketing">{isHebrew ? 'שיווק ופרסום' : 'Marketing'}</option>
                        <option value="Tools / Software">{isHebrew ? 'כלים ותוכנות' : 'Tools / Software'}</option>
                        <option value="Other">{isHebrew ? 'אחר' : 'Other'}</option>
                      </select>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
                        <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />
                        {isHebrew ? 'הוצאה חודשית קבועה' : 'Recurring monthly'}
                      </label>

                      <button type="submit" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                        {t.addExpenseBtn}
                      </button>
                    </form>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '400px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '8px 6px' }}>{t.description}</th>
                            <th style={{ padding: '8px 6px' }}>{isHebrew ? 'קטגוריה' : 'Category'}</th>
                            <th style={{ padding: '8px 6px' }}>{isHebrew ? 'סוג' : 'Type'}</th>
                            <th style={{ padding: '8px 6px' }}>{isHebrew ? 'תאריך' : 'Date'}</th>
                            <th style={{ padding: '8px 6px' }}>{t.total}</th>
                            <th style={{ padding: '8px 6px' }}>{t.actions}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredExpensesForReport.length === 0 ? (
                            <tr>
                              <td colSpan="6" style={{ textAlign: 'center', padding: '25px', color: '#94a3b8' }}>
                                {isHebrew ? 'אין הוצאות בתקופה הנבחרת.' : 'No expenses in this period.'}
                              </td>
                            </tr>
                          ) : (
                            filteredExpensesForReport.map((exp) => (
                              <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                                <td style={{ padding: '10px 6px', fontWeight: '400', color: '#1e293b' }}>{exp.description}</td>
                                <td style={{ padding: '10px 6px', color: '#64748b' }}>{exp.category}</td>
                                <td style={{ padding: '10px 6px', color: '#64748b' }}>
                                  {exp.is_recurring ? (isHebrew ? '🔄 קבועה' : 'Recurring') : (isHebrew ? 'חד פעמית' : 'One-time')}
                                </td>
                                <td style={{ padding: '10px 6px', color: '#64748b' }}>{exp.expense_date}</td>
                                <td style={{ padding: '10px 6px', color: '#ef4444', fontWeight: '400' }}>{sym}{formatNum(exp.amount)}</td>
                                <td style={{ padding: '10px 6px' }}>
                                  <button 
                                    onClick={() => handleDeleteExpense(exp.id)}
                                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: '400', fontSize: '0.7rem' }}
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
             </div>
          )}

          {isSuperAdmin && activeTab === 'admin_clients' && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  👑 Super Admin - Users
                </h2>
              </div>
              <p style={{ color: '#64748b', marginBottom: '15px', fontSize: '0.85rem' }}>
                {isHebrew ? 'כאן תוכל לראות את כל המשתמשים הרשומים במערכת ולנהל את החבילות שלהם.' : 'View all registered users and manage their subscription plans.'}
              </p>

              <div style={{ marginBottom: '15px' }}>
                <input 
                  type="text" 
                  placeholder={isHebrew ? "חיפוש משתמש (אימייל או שם עסק)..." : "Search user (email or business)..."} 
                  value={adminSearchTerm}
                  onChange={(e) => setAdminSearchTerm(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', width: '250px', boxSizing: 'border-box', textAlign: isHebrew ? 'right' : 'left', fontSize: '0.85rem', background: '#f8fafc' }}
                />
              </div>
              
              <div style={{ overflowX: 'auto', background: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isHebrew ? 'right' : 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('email')}>
                        Email {sortField === 'email' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('business_name')}>
                        Business Name {sortField === 'business_name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('plan')}>
                        Plan {sortField === 'plan' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('role')}>
                        Role {sortField === 'role' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('trial_ends_at_status')}>
                        Trial / Lifetime Status {sortField === 'trial_ends_at_status' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th style={{ padding: '10px 8px', cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort('last_sign_in')}>
                        Last Sign In {sortField === 'last_sign_in' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdminAccounts.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          {isHebrew ? 'לא נמצאו משתמשים התואמים את החיפוש.' : 'No users found matching your search.'}
                        </td>
                      </tr>
                    ) : (
                      filteredAdminAccounts.map(acc => {
                        const isLifetime = acc.trial_ends_at === null || acc.trial_ends_at === undefined;
                        return (
                          <tr key={acc.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                            <td style={{ padding: '12px 8px', fontWeight: '500', color: '#1e293b' }}>{acc.email || 'N/A'}</td>
                            <td style={{ padding: '12px 8px', color: '#334155' }}>{acc.business_name || 'New Business'}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <select 
                                value={acc.plan ? acc.plan.toLowerCase() : 'free'} 
                                onChange={(e) => handleAdminPlanChange(acc.id, e.target.value)}
                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', fontWeight: 'bold', color: '#4f46e5' }}
                              >
                                <option value="free">FREE</option>
                                <option value="basic">BASIC</option>
                                <option value="pro">PRO</option>
                              </select>
                            </td>
                            <td style={{ padding: '12px 8px', color: acc.role === 'super_admin' ? '#ef4444' : '#64748b', fontWeight: '600' }}>
                              {acc.role || 'user'}
                            </td>
                            <td style={{ padding: '12px 8px', verticalAlign: 'middle' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' }}>
                                <button 
                                  onClick={() => {
                                    if (!isLifetime) {
                                      setPendingLifetimeUser(acc);
                                    } else {
                                      handleToggleLifetime(acc.id, acc.trial_ends_at);
                                    }
                                  }}
                                  style={{ 
                                    background: isLifetime ? '#ede9fe' : '#f1f5f9', 
                                    color: isLifetime ? '#7c3aed' : '#64748b', 
                                    border: '1px solid',
                                    borderColor: isLifetime ? '#c4b5fd' : '#cbd5e1',
                                    padding: '5px 10px', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer', 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                  }}
                                  title={isLifetime ? 'לחץ לביטול מנוי לכל החיים' : 'לחץ להענקת מנוי לכל החיים'}
                                >
                                  <span>♾️</span>
                                  <span>{isLifetime ? (isHebrew ? 'יש מנוי לכל החיים' : 'Lifetime Active') : (isHebrew ? 'אין מנוי לכל החיים' : 'Trial Active')}</span>
                                </button>
                                <span style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                                  {isLifetime ? (isHebrew ? '(ללא הגבלת זמן)' : '(No expiry)') : (isHebrew ? `עד: ${new Date(acc.trial_ends_at).toLocaleDateString('en-GB')}` : `Ends: ${new Date(acc.trial_ends_at).toLocaleDateString('en-GB')}`)}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 8px', fontSize: '0.8rem', color: '#475569', direction: 'ltr', textAlign: isHebrew ? 'right' : 'left' }}>
                              {acc.last_sign_in ? new Date(acc.last_sign_in).toLocaleString('en-GB') : 'N/A'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="no-print mobile-bottom-nav" style={{ display: 'flex', position: 'fixed', bottom: 0, left: 0, width: '100%', background: '#1e293b', color: 'white', justifyContent: 'space-around', padding: '12px 0', zIndex: 9998, boxShadow: '0 -4px 15px rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => { setActiveTab('main'); setIsCreatingQuote(false); setEditingQuoteId(null); }} style={{ background: 'none', border: 'none', color: activeTab === 'main' && !showQuoteForm ? '#38bdf8' : '#94a3b8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
          <span style={{ fontSize: '1.3rem', marginBottom: '2px' }}>📄</span>
          {isHebrew ? 'הצעות' : 'Quotes'}
        </button>
        <button onClick={() => { setActiveTab('clients'); setIsCreatingQuote(false); setEditingQuoteId(null); }} style={{ background: 'none', border: 'none', color: activeTab === 'clients' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
          <span style={{ fontSize: '1.3rem', marginBottom: '2px' }}>👥</span>
          {isHebrew ? 'לקוחות' : 'Clients'}
        </button>
        <button onClick={() => { setActiveTab('settings'); setIsCreatingQuote(false); setEditingQuoteId(null); }} style={{ background: 'none', border: 'none', color: activeTab === 'settings' ? '#38bdf8' : '#94a3b8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
          <span style={{ fontSize: '1.3rem', marginBottom: '2px' }}>⚙️</span>
          {isHebrew ? 'הגדרות' : 'Settings'}
        </button>
        <button onClick={() => { handleCreateNewQuoteClick(); }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
          <span style={{ fontSize: '1.3rem', marginBottom: '2px' }}>➕</span>
          {isHebrew ? 'חדש' : 'New'}
        </button>
      </div>

      <footer className="no-print" style={{ textAlign: 'center', padding: '20px', marginTop: '40px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
        <div style={{ marginBottom: '10px' }}>
          Powered by <strong>ProFlow</strong> - {isHebrew ? 'מערכת ניהול עסק והצעות מחיר' : 'Business Management & Quoting System'}
        </div>
        <button onClick={() => setShowAccessibility(true)} style={{ background: 'none', border: 'none', color: '#4f46e5', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}>
          ♿ {isHebrew ? 'הצהרת נגישות' : 'Accessibility Statement'}
        </button>
      </footer>
    </div>
  );
}