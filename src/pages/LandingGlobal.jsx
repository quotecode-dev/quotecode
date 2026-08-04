import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ProFlowLogo from '../components/ProFlowLogo';
import AccessibilityModal from '../components/AccessibilityModal';

export default function LandingGlobal() {
  const navigate = useNavigate();
  const [showAccessibility, setShowAccessibility] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      } else {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === 'Asia/Jerusalem' && !window.location.search.includes('force=en')) {
          navigate('/he');
        }
      }
    });
  }, [navigate]);

  return (
    <div dir="ltr" style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', color: '#1e293b' }}>
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} isHebrew={false} />
      
      {/* Header */}
      <header style={{ padding: '20px 40px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <ProFlowLogo size={40} />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/he" style={{ fontSize: '0.95rem', color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>עברית (IL)</a>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}>
            Sign In / Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            🚀 Global SaaS Business & Quoting Platform
          </span>
          <h1 style={{ fontSize: '3.5rem', color: '#0f172a', margin: '20px 0', fontWeight: '900', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
            Streamline Your Quoting Process & Grow Faster
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            Create professional quotes in seconds, capture secure digital signatures, manage clients (CRM), track expenses, and convert proposals into paid invoices effortlessly.
          </p>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)' }}>
            Start Free Trial
          </button>
        </section>

        {/* Features Section */}
        <section style={{ background: 'white', padding: '70px 20px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' }}>Powerful Features for Modern Businesses</h2>
              <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Everything you need to manage sales, documents, and client relationships in one place.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px' }}>
              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>✍️</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>Digital Signatures</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>Allow clients to review and sign quotes online securely. Approved quotes lock instantly.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📄</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>Professional PDFs</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>Generate polished PDF documents with multi-page support, custom items, and branding.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>👥</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>CRM & Tracking</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>Manage customer databases, view counts, status updates, and business payment terms.</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>💬</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>WhatsApp Sharing</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>Send quotes directly to clients via WhatsApp or email with automated text generation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0' }}>Simple, Transparent Pricing</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '50px' }}>Choose the plan that fits your business scale.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', textAlign: 'left' }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '35px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 10px 0' }}>Free Plan</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '20px' }}>$0 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/ month</span></div>
              <ul style={{ margin: '0 0 30px 0', padding: '0 0 0 20px', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.8', flex: 1 }}>
                <li>Up to 5 quotes per month</li>
                <li>Basic client CRM</li>
                <li>PDF exports</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Get Started</button>
            </div>

            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '35px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 10px 0' }}>Basic Plan</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#4f46e5', marginBottom: '20px' }}>$49 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/ month</span></div>
              <ul style={{ margin: '0 0 30px 0', padding: '0 0 0 20px', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.8', flex: 1 }}>
                <li>Up to 20 quotes per month</li>
                <li>Edit & duplicate quotes</li>
                <li>Product catalog</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Choose Basic</button>
            </div>

            <div style={{ background: 'white', border: '2px solid #4f46e5', borderRadius: '16px', padding: '35px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 15px 30px -10px rgba(79, 70, 229, 0.2)' }}>
              <span style={{ position: 'absolute', top: '-12px', right: '30px', background: '#4f46e5', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>POPULAR</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 10px 0' }}>PRO Plan</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#4f46e5', marginBottom: '20px' }}>$99 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'normal' }}>/ month</span></div>
              <ul style={{ margin: '0 0 30px 0', padding: '0 0 0 20px', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.8', flex: 1 }}>
                <li>Unlimited quotes (∞)</li>
                <li>WhatsApp sharing & email tools</li>
                <li>Custom business logo</li>
                <li>Advanced analytics & hot quotes</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Choose PRO</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: '#94a3b8', padding: '40px 20px', textAlign: 'center', fontSize: '0.9rem' }}>
        <p style={{ margin: '0 0 10px 0' }}>&copy; {new Date().getFullYear()} ProFlow SaaS. All rights reserved.</p>
        <button onClick={() => setShowAccessibility(true)} style={{ background: 'none', border: 'none', color: '#38bdf8', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>
          Accessibility Statement
        </button>
      </footer>
    </div>
  );
}