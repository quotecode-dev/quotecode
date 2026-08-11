import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle, ArrowRight, ShieldCheck, Zap, BarChart3, 
  FileText, Users, Clock, Globe, Lock, ChevronDown, Star, Menu, X, 
  HelpCircle, MessageSquare, LogIn, Database, RefreshCw, Send, Check
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('he'); // 'he' | 'en'
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: lang === 'he' ? 'שלום! אני עוזר ה-AI של ProFlow. איך אעזור לך היום בניהול העסק?' : 'Hello! I am ProFlow AI assistant. How can I help you manage your business today?' }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newMsgs = [...chatMessages, { sender: 'user', text: chatMessage }];
    setChatMessages(newMsgs);
    setChatMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: lang === 'he' ? 'קיבלתי את פנייתך. מערכת ProFlow מותאמת במיוחד לשוק הישראלי (כולל ניהול מע"מ 18%, מטבע שקלי, חתימות דיגיטליות וניהול לקוחות). האם תרצה עזרה בהפקת הצעת מחיר?' : 'Received! ProFlow is specifically tailored for business management with full digital workflow.'
      }]);
    }, 1000);
  };

  const t = {
    he: {
      badge: "מבצע! 14 יום חינם לגמרי - עם גישה מלאה לכל הפיצ'רים של ה-PRO!",
      navLogin: "כניסה למערכת / התחברות",
      navAi: "שירות לקוחות ותמיכה AI",
      heroTopBadge: "מבצע השקה: 14 יום ניסיון חינם לכל פיצ'רי ה-PRO!",
      heroTitle1: "ניהול עסק, הפקת הצעות מחיר וגבייה",
      heroTitle2: "בקלות, במהירות ובחכמה",
      heroSubtitle: "פלטפורמת SaaS מתקדמת המותאמת במיוחד לשוק הישראלי (כולל ניהול מע\"מ 18% כחוק, מטבע שקלי, חתימות דיגיטליות וניהול לקוחות).",
      ctaMain: "התחל 14 יום ניסיון חינם ב-PRO עכשיו",
      ctaSub: "14 יום חינם לגמרי לכל פיצ'רי ה-PRO!",
      socialProof: "מעל 500 עסקים כבר מפיקים הצעות מחיר בקלות",
      featuresTitle: "הכלים המתקדמים ביותר לצמיחה עסקית",
      featuresSubtitle: "הטכנולוגיה המובילה בישראל לניהול הצעות מחיר, מעקב לקוחות וגבייה חכמה.",
      feat1Title: "הפקת הצעות מחיר חכמות",
      feat1Desc: "יצירת הצעות מחיר מעוצבות ומקצועיות בתוך שניות, כולל חישוב אוטומטי של מע\"מ 18% ושקלים.",
      feat2Title: "ניהול לקוחות CRM מתקדם",
      feat2Desc: "מעקב מלא אחר סטטוס הלקוח, היסטוריית תשלומים, מסמכים והתראות חכמות במקום אחד.",
      feat3Title: "אבטחת מידע וענן מתקדם",
      feat3Desc: "גיבוי מלא לענן, אבטחת מידע ברמה הגבוהה ביותר וגישה מכל מקום ובכל זמן.",
      footerText: "ProFlow - מערכת SaaS מתקדמת לניהול עסק והפקת הצעות מחיר חכמות.",
      rights: "כל הזכויות שמורות © 2026 ProFlow"
    },
    en: {
      badge: "Promo! 14 days completely free - full access to all PRO features!",
      navLogin: "System Login / Sign In",
      navAi: "AI Customer Service & Support",
      heroTopBadge: "Launch Promo: 14-day free trial for all PRO features!",
      heroTitle1: "Business Management, Quotes & Invoicing",
      heroTitle2: "Easily, Quickly & Smartly",
      heroSubtitle: "Advanced SaaS platform tailored for modern businesses (including 18% VAT handling, multi-currency, digital signatures & client CRM).",
      ctaMain: "Start 14-Day Free PRO Trial Now",
      ctaSub: "14 days completely free for all PRO features!",
      socialProof: "Over 500 businesses create quotes with ease",
      featuresTitle: "Advanced Tools for Business Growth",
      featuresSubtitle: "Leading technology for quotes, client tracking, and smart billing.",
      feat1Title: "Smart Quote Generation",
      feat1Desc: "Create stunning, professional quotes in seconds with automated 18% VAT calculations.",
      feat2Title: "Advanced CRM Management",
      feat2Desc: "Full tracking of client status, payment history, documents, and smart alerts.",
      feat3Title: "Cloud Security & Infrastructure",
      feat3Desc: "Full cloud backup, top-tier data security, and access from anywhere at any time.",
      footerText: "ProFlow - Advanced SaaS platform for business management and smart quotes.",
      rights: "All rights reserved © 2026 ProFlow"
    }
  };

  const currentT = t[lang];

  return (
    <div className={`min-h-screen bg-[#0A0F1D] text-white selection:bg-blue-600 selection:text-white font-sans ${lang === 'he' ? 'rtl' : 'ltr'}`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-medium py-2 px-4 text-center shadow-md relative z-50 flex items-center justify-center gap-4">
        <span>{currentT.badge}</span>
        <button 
          onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
          className="bg-white/20 hover:bg-white/35 transition px-2 py-0.5 rounded text-xs font-bold uppercase"
        >
          {lang === 'he' ? 'English' : 'עברית'}
        </button>
      </div>

      {/* Header - Fixed Container Alignment */}
      <header className="w-full bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo (Right side in Hebrew) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/60 px-4 py-2 rounded-xl shadow-inner">
              <span className="text-xl font-black tracking-wider text-white">Pro<span className="text-indigo-400">Flow</span></span>
              <div className="bg-indigo-600 text-white p-1 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Center AI Chat Button */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-full font-medium shadow-lg shadow-indigo-600/20 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{currentT.navAi}</span>
            </button>
          </div>

          {/* Login Button (Left side in Hebrew) */}
          <div className="flex items-center gap-3">
            <a 
              href="#login" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <LogIn className="w-4 h-4" />
              <span>{currentT.navLogin}</span>
            </a>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0F1D] to-[#0A0F1D] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-400 text-sm font-semibold mb-8 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{currentT.heroTopBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-tight mb-6">
            {currentT.heroTitle1} <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentT.heroTitle2}
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
            {currentT.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <a 
              href="#register" 
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>{currentT.ctaMain}</span>
            </a>
          </div>

          <p className="text-emerald-400 font-semibold text-sm mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{currentT.ctaSub}</span>
          </p>

          <div className="flex items-center gap-2 text-amber-400 font-medium text-sm mb-12">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-slate-300 ms-1">{currentT.socialProof}</span>
          </div>

          {/* Hero Image / Mockup */}
          <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/50 p-2">
            <div className="rounded-xl overflow-hidden aspect-video bg-slate-950 flex items-center justify-center relative">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80" 
                alt="Business Management" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-transparent to-transparent opacity-60" />
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{currentT.featuresTitle}</h2>
            <p className="text-slate-400 text-lg">{currentT.featuresSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition">
              <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{currentT.feat1Title}</h3>
              <p className="text-slate-400 leading-relaxed">{currentT.feat1Desc}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition">
              <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{currentT.feat2Title}</h3>
              <p className="text-slate-400 leading-relaxed">{currentT.feat2Desc}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition">
              <div className="w-12 h-12 bg-emerald-600/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{currentT.feat3Title}</h3>
              <p className="text-slate-400 leading-relaxed">{currentT.feat3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-slate-400">{currentT.footerText}</p>
          <p>{currentT.rights}</p>
        </div>
      </footer>

      {/* Floating AI Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-6 end-6 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>ProFlow AI Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 h-72 overflow-y-auto flex flex-col gap-3 bg-slate-950/50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`p-3 rounded-xl max-w-[85%] text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white ms-auto' : 'bg-slate-800 text-slate-200 me-auto'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={chatMessage} 
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={lang === 'he' ? 'שאל משהו את ה-AI...' : 'Ask AI anything...'}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}