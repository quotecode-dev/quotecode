import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProFlowLogo from '../components/ProFlowLogo';

export default function LandingGlobal() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'

  return (
    <div dir="ltr" style={{ fontFamily: 'Segoe UI, Tahoma, sans-serif', background: '#f8fafc', minHeight: '100vh', color: '#1e293b', display: 'flex', flexDirection: 'column' }}>
      
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
      <main style={{ flex: 1, padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
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

        {/* Pricing Section - Global */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>Pricing Plans</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>Choose the perfect plan for your business (Global pricing with 0% VAT).</p>
          
          {/* Billing Cycle Toggle */}
          <div style={{ display: 'inline-flex', background: '#e2e8f0', padding: '4px', borderRadius: '12px', marginBottom: '40px' }}>
            <button 
              onClick={() => setBillingCycle('monthly')}
              style={{ background: billingCycle === 'monthly' ? 'white' : 'transparent', color: billingCycle === 'monthly' ? '#4f46e5' : '#64748b', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: billingCycle === 'monthly' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('annual')}
              style={{ background: billingCycle === 'annual' ? '#4f46e5' : 'transparent', color: billingCycle === 'annual' ? 'white' : '#64748b', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: billingCycle === 'annual' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}>
              Annual <span style={{ background: billingCycle === 'annual' ? '#10b981' : '#e0e7ff', color: billingCycle === 'annual' ? 'white' : '#4f46e5', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', marginLeft: '6px' }}>Save 20%!</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', textAlign: 'left' }}>
            
            {/* Free Tier */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '10px' }}>Free Tier</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>For starters and small projects.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '20px' }}>$0 <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#64748b' }}>/ mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#475569', fontSize: '0.95rem', lineHeight: '2' }}>
                <li>✓ Up to 5 quotes / month</li>
                <li>✓ Basic client management</li>
                <li>✓ Email support</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Get Started Free
              </button>
            </div>

            {/* Pro Tier (Highlighted) */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '2px solid #4f46e5', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.1)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '20px', background: '#4f46e5', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                Most Popular ⭐
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '10px' }}>Pro Plan</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>For growing businesses & agencies.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#4f46e5', marginBottom: '20px' }}>
                {billingCycle === 'monthly' ? '$39' : '$29'} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#64748b' }}>/ mo</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '-15px', marginBottom: '15px' }}>
                {billingCycle === 'monthly' ? '* 0% international tax' : '* Billed annually, 0% international tax'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#475569', fontSize: '0.95rem', lineHeight: '2' }}>
                <li>✓ Unlimited quotes</li>
                <li>✓ Advanced digital signatures</li>
                <li>✓ Full expense & revenue tracking</li>
                <li>✓ Priority support</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79,70,229,0.2)' }}>
                Choose Pro
              </button>
            </div>

            {/* Enterprise Tier */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '10px' }}>Enterprise</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Advanced features for large teams.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '20px' }}>
                {billingCycle === 'monthly' ? '$89' : '$69'} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#64748b' }}>/ mo</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '-15px', marginBottom: '15px' }}>
                {billingCycle === 'monthly' ? '* 0% international tax' : '* Billed annually, 0% international tax'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#475569', fontSize: '0.95rem', lineHeight: '2' }}>
                <li>✓ Everything in Pro</li>
                <li>✓ Multiple team members</li>
                <li>✓ Advanced financial reports</li>
                <li>✓ Dedicated account manager</li>
              </ul>
              <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Contact Us
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: '#94a3b8', padding: '30px 20px', textAlign: 'center', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} ProFlow Global. All rights reserved.</p>
      </footer>

    </div>
  );
}