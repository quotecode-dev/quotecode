import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProFlowLogo from '../components/ProFlowLogo';

export default function LandingGlobal() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <div dir="ltr" style={{ fontFamily: 'Inter, Segoe UI, Tahoma, sans-serif', background: '#090d16', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-6px);
          border-color: #6366f1;
          box-shadow: 0 20px 30px -10px rgba(99, 102, 241, 0.2);
        }
        .hero-glow {
          background: radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0) 60%);
        }
        .video-container {
          box-shadow: 0 25px 60px -15px rgba(99, 102, 241, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Header */}
      <header style={{ background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <ProFlowLogo size={38} />
        </div>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
            Sign In / Dashboard
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-glow" style={{ flex: 1, padding: '80px 20px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '24px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            ✨ Global Business & Quoting SaaS Platform
          </div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.15', marginBottom: '24px', letterSpacing: '-1px' }}>
            Manage your business and send smart quotes <br />
            <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>faster and smarter</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 35px auto', lineHeight: '1.6' }}>
            The ultimate SaaS platform for modern businesses. Create professional quotes, get digital client approvals, and manage your workflow globally.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)' }}>
              Get Started Free 🚀
            </button>
          </div>

          <div style={{ marginBottom: '60px', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ color: '#fbbf24', fontSize: '1.2rem' }}>⭐⭐⭐⭐⭐</span> Over 500 businesses trust ProFlow globally
          </div>

          {/* Embedded YouTube Video Showcase */}
          <div className="video-container" style={{ borderRadius: '16px', overflow: 'hidden', background: '#1e293b', maxWidth: '850px', margin: '0 auto 80px auto', aspectRatio: '16/9' }}>
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/uQuhb52P22k" 
              title="QuoteCode React SaaS Launch 2026" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              style={{ display: 'block' }}>
            </iframe>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', textAlign: 'left', marginBottom: '80px' }}>
            <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px', background: 'rgba(251, 191, 36, 0.1)', display: 'inline-block', padding: '10px', borderRadius: '12px' }}>⚡</div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>Instant Quotes</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>Generate beautiful, professional quotes with automatic calculations, discounts, and item catalogs.</p>
            </div>
            
            <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px', background: 'rgba(99, 102, 241, 0.1)', display: 'inline-block', padding: '10px', borderRadius: '12px' }}>✍️</div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>Digital Signatures</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>Allow your clients to review, sign, and approve quotes online instantly from any device.</p>
            </div>

            <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px', background: 'rgba(16, 185, 129, 0.1)', display: 'inline-block', padding: '10px', borderRadius: '12px' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>Expense & Revenue Tracking</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6' }}>Monitor your business cash flow, track recurring expenses, and view comprehensive financial reports.</p>
            </div>
          </div>

          {/* Pricing Section */}
          <div style={{ marginBottom: '80px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px' }}>Pricing Plans</h2>
            <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '1.1rem' }}>Choose the perfect plan for your business (Global pricing with 0% VAT).</p>
            
            <div style={{ display: 'inline-flex', background: '#111827', padding: '4px', borderRadius: '12px', marginBottom: '40px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button 
                onClick={() => setBillingCycle('monthly')}
                style={{ background: billingCycle === 'monthly' ? '#6366f1' : 'transparent', color: billingCycle === 'monthly' ? '#ffffff' : '#94a3b8', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                style={{ background: billingCycle === 'annual' ? '#6366f1' : 'transparent', color: billingCycle === 'annual' ? '#ffffff' : '#94a3b8', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
                Annual <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', marginLeft: '6px' }}>Save 20%!</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', textAlign: 'left' }}>
              
              {/* Free */}
              <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>Free Tier</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>For starters and small projects.</p>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#ffffff', marginBottom: '20px' }}>$0 <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#94a3b8' }}>/ mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '2.2' }}>
                  <li>✓ Up to 5 quotes / month</li>
                  <li>✓ Basic client management</li>
                  <li>✓ Email support</li>
                </ul>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Get Started Free
                </button>
              </div>

              {/* Pro */}
              <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '2px solid #6366f1', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-14px', left: '20px', background: '#6366f1', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  Most Popular ⭐
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>Pro Plan</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>For growing businesses & agencies.</p>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#818cf8', marginBottom: '20px' }}>
                  {billingCycle === 'monthly' ? '$39' : '$29'} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#94a3b8' }}>/ mo</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-15px', marginBottom: '15px' }}>
                  {billingCycle === 'monthly' ? '* 0% international tax' : '* Billed annually, 0% international tax'}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '2.2' }}>
                  <li>✓ Unlimited quotes</li>
                  <li>✓ Advanced digital signatures</li>
                  <li>✓ Full expense & revenue tracking</li>
                  <li>✓ Priority support</li>
                </ul>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#6366f1', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                  Choose Pro
                </button>
              </div>

              {/* Enterprise */}
              <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>Enterprise</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Advanced features for large teams.</p>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#ffffff', marginBottom: '20px' }}>
                  {billingCycle === 'monthly' ? '$89' : '$69'} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#94a3b8' }}>/ mo</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-15px', marginBottom: '15px' }}>
                  {billingCycle === 'monthly' ? '* 0% international tax' : '* Billed annually, 0% international tax'}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '2.2' }}>
                  <li>✓ Everything in Pro</li>
                  <li>✓ Multiple team members</li>
                  <li>✓ Advanced financial reports</li>
                  <li>✓ Dedicated account manager</li>
                </ul>
                <button onClick={() => navigate('/dashboard')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Contact Us
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#05070a', color: '#64748b', padding: '40px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} ProFlow Global. All rights reserved.</p>
      </footer>

    </div>
  );
}