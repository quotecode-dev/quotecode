import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProFlowLogo from '../components/ProFlowLogo';

export default function LandingGlobal() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Do prices include international tax?',
      a: 'No! Global clients enjoy 0% international tax as configured for cross-border SaaS operations.'
    },
    {
      q: 'What is included in the 14-day trial?',
      a: 'The trial gives you full, unrestricted access to all PRO features (unlimited quotes, direct WhatsApp sending, and more) for 14 days with no commitment.'
    },
    {
      q: 'What happens after the 14-day trial ends?',
      a: 'If you do not purchase a subscription, your account automatically reverts to the FREE tier with its standard limits.'
    },
    {
      q: 'Is the platform mobile-friendly?',
      a: 'Yes, ProFlow is built as a fully responsive SaaS platform, allowing you to generate quotes and manage your business from any smartphone, tablet, or desktop.'
    }
  ];

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
        .pain-box {
          box-shadow: 0 20px 40px -15px rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .faq-item {
          background: #111827;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .faq-item:hover {
          border-color: rgba(99, 102, 241, 0.4);
        }
      `}</style>

      {/* Top Banner Launch Special */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5, #10b981)', color: 'white', padding: '10px 20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>
        🎉 Special Offer: 14-day free trial with full access to all PRO features!
      </div>

      {/* Header */}
      <header style={{ background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
            <ProFlowLogo size={32} rtl={false} />
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button onClick={() => navigate('/dashboard?lang=en')} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
              Sign In / Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-glow" style={{ flex: 1, padding: '80px 20px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))', color: '#34d399', padding: '10px 24px', borderRadius: '30px', fontSize: '1rem', fontWeight: '800', marginBottom: '24px', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)' }}>
            🔥 Launch Special: 14-Day Free Trial with Full PRO Access!
          </div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ffffff', lineHeight: '1.15', marginBottom: '24px', letterSpacing: '-1px' }}>
            Manage your business and send smart quotes <br />
            <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>faster and smarter</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
            The ultimate SaaS platform for modern businesses. Create professional quotes, get digital client approvals, and manage your workflow globally.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <button onClick={() => navigate('/dashboard?lang=en')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)' }}>
              Start 14-Day Free PRO Trial 🚀
            </button>
            <span style={{ color: '#34d399', fontSize: '1rem', fontWeight: '800' }}>
              14-day free trial with full PRO access!
            </span>
          </div>

          <div style={{ marginBottom: '60px', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ color: '#fbbf24', fontSize: '1.2rem' }}>⭐⭐⭐⭐⭐</span> Over 500 businesses trust ProFlow globally
          </div>

          {/* Pain-Point Section with AI Image */}
          <div className="pain-box" style={{ background: '#111827', borderRadius: '16px', overflow: 'hidden', maxWidth: '850px', margin: '0 auto 60px auto', padding: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                🛑 Sound Familiar?
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#ffffff', marginTop: '15px', marginBottom: '10px' }}>
                Tired of struggling with quotes and endless paperwork?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
                Forget wasting hours on clunky Word documents, manual tax calculations, and chasing clients for approvals.
              </p>
            </div>
            
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img 
                src="/frustrated-user.png" 
                alt="Frustrated business owner struggling with paperwork" 
                style={{ width: '100%', display: 'block', maxHeight: '450px', objectFit: 'cover' }} 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'; }} 
              />
            </div>
            <div style={{ textAlign: 'center', color: '#34d399', fontWeight: 'bold', fontSize: '1.1rem' }}>
              ✨ There is a much easier, smarter, and faster way to run your business with ProFlow!
            </div>
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
            <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '1.1rem' }}>Choose the perfect plan for your business. <strong style={{ color: '#10b981' }}>14-day free trial with full PRO access!</strong></p>
            
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
                <button onClick={() => navigate('/dashboard?lang=en')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Get Started Free
                </button>
              </div>

              {/* Basic Plan */}
              <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>Basic Plan</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>For small businesses and growing needs.</p>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#ffffff', marginBottom: '20px' }}>
                  {billingCycle === 'monthly' ? '$39' : '$29'} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#94a3b8' }}>/ mo</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-15px', marginBottom: '15px' }}>
                  {billingCycle === 'monthly' ? '* 0% international tax' : '* Billed annually, 0% international tax'}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '2.2' }}>
                  <li>✓ <strong>14-Day Free Trial!</strong></li>
                  <li>✓ Up to 20 quotes / month</li>
                  <li>✓ Digital signatures & clients</li>
                  <li style={{ color: '#ef4444' }}>✗ No WhatsApp direct sending</li>
                </ul>
                <button onClick={() => navigate('/dashboard?lang=en')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Start Free Trial
                </button>
              </div>

              {/* Pro Plan (Highlighted) */}
              <div className="hover-card" style={{ background: '#111827', padding: '35px', borderRadius: '16px', border: '2px solid #6366f1', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-14px', left: '20px', background: '#6366f1', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  Most Popular ⭐
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '10px', fontWeight: '700' }}>Pro Plan</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>For growing businesses & agencies.</p>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: '#818cf8', marginBottom: '20px' }}>
                  {billingCycle === 'monthly' ? '$89' : '$69'} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#94a3b8' }}>/ mo</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-15px', marginBottom: '15px' }}>
                  {billingCycle === 'monthly' ? '* 0% international tax' : '* Billed annually, 0% international tax'}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '2.2' }}>
                  <li>✓ <strong>14-Day Free Trial (All PRO Features)!</strong></li>
                  <li>✓ Unlimited quotes</li>
                  <li>✓ Direct WhatsApp sending</li>
                  <li>✓ Full expense & revenue tracking</li>
                </ul>
                <button onClick={() => navigate('/dashboard?lang=en')} style={{ marginTop: 'auto', background: '#6366f1', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                  Start Pro Free Trial
                </button>
              </div>

            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginBottom: '80px', textAlign: 'left', maxWidth: '800px', margin: '0 auto 80px auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>Frequently Asked Questions</h2>
            <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '1.05rem', textAlign: 'center' }}>Everything you need to know about the platform.</p>
            
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '1.05rem', color: '#ffffff' }}>
                  <span>{faq.q}</span>
                  <span style={{ color: '#818cf8', fontSize: '1.2rem' }}>{openFaq === idx ? '−' : '+'}</span>
                </div>
                {openFaq === idx && (
                  <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
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