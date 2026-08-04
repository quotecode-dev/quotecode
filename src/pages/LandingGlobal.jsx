import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProFlowLogo from '../components/ProFlowLogo';
import AccessibilityModal from '../components/AccessibilityModal';

export default function LandingGlobal() {
  const navigate = useNavigate();
  const [showAccessibility, setShowAccessibility] = useState(false);

  return (
    <div dir="ltr" style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
      
      <AccessibilityModal isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} isHebrew={false} />

      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <ProFlowLogo size={36} />
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => navigate('/he')} style={{ background: 'none', border: '1px solid #cbd5e1', color: '#475569', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
            עברית (ישראל) 🇮🇱
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}>
            Sign In / Dashboard
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#e0e7ff', color: '#4f46e5', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '20px' }}>
          ✨ Global Business & Quoting SaaS Platform
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#0f172a', lineHeight: '1.2', marginBottom: '20px' }}>
          Manage your business and send smart quotes <br />
          <span style={{ color: '#4f46e5' }}>faster and smarter</span>
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          The ultimate SaaS platform for modern businesses. Create professional quotes, get digital client approvals, and manage your workflow globally.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '60px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
            Get Started Free 🚀
          </button>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', textAlign: 'left', marginBottom: '60px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⚡</div>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '10px' }}>Instant Quotes</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>Generate beautiful, professional quotes with automatic calculations, discounts, and item catalogs.</p>
          </div>
          
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>✍️</div>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '10px' }}>Digital Signatures</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>Allow your clients to review, sign, and approve quotes online instantly from any device.</p>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📊</div>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '10px' }}>Expense & Revenue Tracking</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>Monitor your business cash flow, track recurring expenses, and view comprehensive financial reports.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: '#94a3b8', padding: '30px 20px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: '0 0 10px 0' }}>&copy; {new Date().getFullYear()} ProFlow Global. All rights reserved.</p>
        <button onClick={() => setShowAccessibility(true)} style={{ background: 'none', border: 'none', color: '#38bdf8', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>
          ♿ Accessibility Statement
        </button>
      </footer>

    </div>
  );
}