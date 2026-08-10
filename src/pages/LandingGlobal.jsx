import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProFlowLogo from '../components/ProFlowLogo';

export default function LandingGlobal({ onForgotPassword }) {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'Do the displayed prices include taxes?',
      a: 'Yes! All pricing tiers are structured for international standards with clear tax breakdowns where applicable.'
    },
    {
      q: 'What is included in the 14-day free trial?',
      a: 'The trial gives you full and unrestricted access to all PRO features (unlimited quotes, digital client approvals, and more) for 14 days with no obligations.'
    },
    {
      q: 'What happens after the 14-day trial if I do not subscribe?',
      a: 'Your account will automatically move to the FREE tier with its standard limitations, so you can continue using the platform peacefully.'
    },
    {
      q: 'Is the platform optimized for mobile and desktop?',
      a: 'Yes, ProFlow is built as a fully responsive modern SaaS platform, allowing you to generate quotes and manage your business from any computer, tablet, or smartphone.'
    },
    {
      q: 'Is my business data secure on the cloud?',
      a: 'Absolutely. We utilize state-of-the-art enterprise-grade cloud databases with strict security, encryption, and automated backups to ensure your data is always safe.'
    },
    {
      q: 'Can I export my financial reports and quotes?',
      a: 'Yes, you can easily export all your business quotes and expense reports into CSV format compatible with Excel and accounting software.'
    }
  ];

  return (
    <div dir="ltr" style={{ fontFamily: 'Inter, Segoe UI, Tahoma, sans-serif', background: '#090d16', minHeight: '100vh', color: '#f8fafc', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-4px);
          border-color: #6366f1;
          box-shadow: 0 16px 30px -10px rgba(99, 102, 241, 0.2);
        }
        .hero-glow {
          background: radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0) 60%);
        }
        .preview-box {
          box-shadow: 0 25px 60px -15px rgba(99, 102, 241, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .pain-box {
          box-shadow: 0 20px 40px -15px rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .faq-item {
          background: #111827;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          margin-bottom: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .faq-item:hover {
          border-color: rgba(99, 102, 241, 0.4);
        }
        .pricing-toggle-container {
          display: inline-flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 4px;
          background: #111827;
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        @media (max-width: 480px) {
          .nav-btn {
            padding: 7px 14px !important;
            font-size: 0.85rem !important;
          }
          .hero-title {
            font-size: 2.2rem !important;
          }
          .pricing-toggle-container {
            display: flex;
            width: 100%;
          }
          .pricing-toggle-container button {
            flex: 1;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>

      {/* Top Banner Launch Promotion */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5, #10b981)', color: 'white', padding: '8px 16px', textAlign: 'center', fontSize: '0.85rem', fontWeight: '600' }}>
        🎉 Launch Promotion! 14-day free trial - with full access to all PRO features!
      </div>

      {/* Header */}
      <header style={{ background: 'rgba(9, 13, 22, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '10px' }}>
          <div style={{ cursor: 'pointer', background: 'rgba(255, 255, 255, 0.04)', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', flexShrink: 0 }} onClick={() => navigate('/global')}>
            <ProFlowLogo size={32} rtl={false} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onForgotPassword && (
              <button onClick={onForgotPassword} style={{ background: 'transparent', color: '#818cf8', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                Forgot Password?
              </button>
            )}
            <button className="nav-btn" onClick={() => navigate('/dashboard?lang=en')} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)', whiteSpace: 'nowrap', transition: 'background 0.2s' }}>
              Sign In / Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-glow" style={{ flex: 1, padding: '60px 20px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1050px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(99, 102, 241, 0.12))', color: '#34d399', padding: '8px 20px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '700', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)' }}>
            🔥 Launch Promotion: 14-day free trial for all PRO features!
          </div>
          
          <h1 className="hero-title" style={{ fontSize: '3.2rem', fontWeight: '800', color: '#ffffff', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-0.5px' }}>
            Business Management, Quotes & Invoicing <br />
            <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Easily, Fast & Smart</span>
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 28px auto', lineHeight: '1.5' }}>
            An advanced global SaaS platform tailored for modern businesses (featuring automated tax handling, digital signatures, and streamlined client management).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <button onClick={() => navigate('/dashboard?signup=true&lang=en')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)', transition: 'transform 0.2s' }}>
              Start 14-Day Free PRO Trial Now 🚀
            </button>
            <span style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: '700' }}>
              14 days completely free for all PRO features!
            </span>
          </div>

          <div style={{ marginBottom: '50px', color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ color: '#fbbf24' }}>⭐⭐⭐⭐⭐</span> Over 500 businesses already generate quotes with ease
          </div>

          {/* AI Video Demo Showcase (English) */}
          <div style={{ margin: '0 auto 40px auto', maxWidth: '400px' }}>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              style={{ width: '100%', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.35)', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'block' }}
            >
              <source src="/proflow-demoEN.mp4" type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>

          {/* Pain-Point Section with AI Image */}
          <div className="pain-box" style={{ background: '#111827', borderRadius: '14px', overflow: 'hidden', maxWidth: '800px', margin: '0 auto 40px auto', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '5px 14px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '700' }}>
                🛑 Sound Familiar?
              </span>
              <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#ffffff', marginTop: '12px', marginBottom: '8px' }}>
                Tired of struggling with price quotes and endless paperwork?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                Forget hours spent on clunky Word documents, manual tax calculations, and exhausting follow-ups for client approvals.
              </p>
            </div>
            
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img 
                src="/frustrated-user.png" 
                alt="Frustrated business owner dealing with paperwork" 
                style={{ width: '100%', display: 'block', maxHeight: '400px', objectFit: 'cover' }} 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'; }} 
              />
            </div>
            <div style={{ color: '#34d399', fontWeight: '700', fontSize: '1rem' }}>
              ✨ There is a much easier, smarter, and professional way to run your business with ProFlow!
            </div>
          </div>

          {/* Dashboard Preview Box */}
          <div className="preview-box" style={{ borderRadius: '14px', overflow: 'hidden', background: '#111827', maxWidth: '800px', margin: '0 auto 60px auto', padding: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#1f2937', padding: '16px', borderRadius: '8px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Quotes This Month</div>
                <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>24</div>
              </div>
              <div style={{ background: '#1f2937', padding: '16px', borderRadius: '8px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Monthly Revenue</div>
                <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>$ 12,400</div>
              </div>
              <div style={{ background: '#1f2937', padding: '16px', borderRadius: '8px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Active Clients</div>
                <div style={{ color: '#818cf8', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '4px' }}>142</div>
              </div>
            </div>
            <div style={{ background: '#1f2937', padding: '20px', borderRadius: '8px', textAlign: 'center', color: '#94a3b8', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
              Live Preview of ProFlow Quotation & Billing System
            </div>
          </div>

          {/* Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', textAlign: 'left', marginBottom: '60px' }}>
            <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px', background: 'rgba(251, 191, 36, 0.1)', display: 'inline-block', padding: '8px', borderRadius: '10px' }}>⚡</div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>Quotes in Minutes</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>Create professional, beautiful price quotes including automated tax calculations, discounts, and items from your catalog.</p>
            </div>
            
            <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'inline-block', padding: '8px', borderRadius: '10px' }}>✍️</div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>Digital Signatures & Approvals</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>Send a direct link to your client to review, digitally sign, and approve orders from any smartphone or computer.</p>
            </div>

            <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'inline-block', padding: '8px', borderRadius: '10px' }}>📊</div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>Income & Expense Tracking</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>Track business profits, manage operating expenses, and view accurate financial reports in real time.</p>
            </div>
          </div>

          {/* Pricing Section - Global */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>Plans & Pricing</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '1rem' }}>Choose the best plan for your business.</p>
            
            <div className="pricing-toggle-container">
              <button 
                onClick={() => setBillingCycle('monthly')}
                style={{ background: billingCycle === 'monthly' ? '#6366f1' : 'transparent', color: billingCycle === 'monthly' ? '#ffffff' : '#94a3b8', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Monthly Billing
              </button>
              <button 
                onClick={() => setBillingCycle('annual')}
                style={{ background: billingCycle === 'annual' ? '#6366f1' : 'transparent', color: billingCycle === 'annual' ? '#ffffff' : '#94a3b8', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span>Annual Billing</span>
                <span style={{ background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>Save 20%!</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', textAlign: 'left' }}>
              
              {/* Free */}
              <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>Free Plan</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>Ideal for getting started.</p>
                <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px' }}>$0 <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#94a3b8' }}>/ month</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '2' }}>
                  <li>✓ Up to 5 quotes per month</li>
                  <li>✓ Basic client management</li>
                  <li>✓ Email support</li>
                </ul>
                <button onClick={() => navigate('/dashboard?signup=true&lang=en')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>
                  Start for Free
                </button>
              </div>

              {/* Basic Plan */}
              <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>Basic Plan</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>For small businesses needing robust tools.</p>
                <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px' }}>
                  {billingCycle === 'monthly' ? '$15' : '$12'} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#94a3b8' }}>/ month</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '2' }}>
                  <li>✓ Up to 20 quotes per month</li>
                  <li>✓ Digital signatures & client management</li>
                </ul>
                <button onClick={() => navigate('/dashboard?signup=true&lang=en')} style={{ marginTop: 'auto', background: '#1f2937', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>
                  Select Basic Plan
                </button>
              </div>

              {/* Pro / Business Plan (Highlighted) */}
              <div className="hover-card" style={{ background: '#111827', padding: '28px', borderRadius: '14px', border: '2px solid #6366f1', boxShadow: '0 12px 25px rgba(99, 102, 241, 0.15)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', right: '16px', background: '#6366f1', color: 'white', padding: '3px 10px', borderRadius: '16px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  Most Popular ⭐
                </div>
                <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px', fontWeight: '700' }}>Pro Business Plan</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>For growing agencies and businesses with no limits.</p>
                <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#818cf8', marginBottom: '16px' }}>
                  {billingCycle === 'monthly' ? '$29' : '$23'} <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: '#94a3b8' }}>/ month</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '2' }}>
                  <li>✓ Unlimited quotes</li>
                  <li>✓ Full income & expense tracking</li>
                </ul>
                <button onClick={() => navigate('/dashboard?signup=true&lang=en')} style={{ marginTop: 'auto', background: '#6366f1', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 3px 10px rgba(99,102,241,0.3)' }}>
                  Select PRO Plan
                </button>
              </div>

            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginBottom: '60px', textAlign: 'left', maxWidth: '750px', margin: '0 auto 60px auto' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#ffffff', marginBottom: '8px', textAlign: 'center' }}>Frequently Asked Questions</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.95rem', textAlign: 'center' }}>Everything you need to know about the platform.</p>
            
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item" style={{ padding: '16px', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600', fontSize: '1rem', color: '#ffffff' }}>
                  <span>{faq.q}</span>
                  <span style={{ color: '#818cf8', fontSize: '1.1rem' }}>{openFaq === idx ? '−' : '+'}</span>
                </div>
                {openFaq === idx && (
                  <div style={{ marginTop: '10px', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#05070a', color: '#64748b', padding: '30px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} ProFlow Global. All rights reserved.</p>
      </footer>

    </div>
  );
}