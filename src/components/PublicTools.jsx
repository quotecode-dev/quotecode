import React, { useState } from 'react';

function PublicTools() {
  const [activeTab, setActiveTab] = useState('currency');

  // Currency state
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('ILS');

  const rates = {
    ILS: 1,
    USD: 3.65,
    EUR: 3.95,
    GBP: 4.65
  };

  const convertCurrency = () => {
    const val = parseFloat(amount) || 0;
    const inILS = val * rates[fromCurrency];
    const result = inILS / rates[toCurrency];
    return result.toFixed(2);
  };

  // Units state
  const [unitValue, setUnitValue] = useState('1');
  const [unitType, setUnitType] = useState('m_to_ft');

  const convertUnits = () => {
    const val = parseFloat(unitValue) || 0;
    switch (unitType) {
      case 'm_to_ft': return (val * 3.28084).toFixed(2) + ' פיט (רגליים)';
      case 'ft_to_m': return (val / 3.28084).toFixed(2) + ' מטר';
      case 'km_to_mi': return (val * 0.621371).toFixed(2) + ' מייל';
      case 'mi_to_km': return (val / 0.621371).toFixed(2) + ' קילומטר';
      case 'cm_to_in': return (val * 0.393701).toFixed(2) + ' אינץ\'';
      default: return val;
    }
  };

  // Gold/Metals state
  const [grams, setGrams] = useState('10');
  const pricePerGramILS = 276; 
  const pricePerGramUSD = 75.6;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'system-ui, sans-serif' }} dir="rtl">
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '10px', fontWeight: 'bold' }}>מרכז הכלים והמחשבונים העסקיים</h1>
        <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          כלים חכמים, מהירים ומדויקים לעסקים, יבואנים ופרילנסרים – המרות מטבעות, מידות ומתכות בזמן אמת.
        </p>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '800px', margin: '-30px auto 40px', padding: '0 20px' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('currency')}
              style={{
                flex: 1, padding: '16px', border: 'none', background: activeTab === 'currency' ? 'white' : 'transparent',
                color: activeTab === 'currency' ? '#4f46e5' : '#64748b', fontWeight: 'bold', cursor: 'pointer',
                borderBottom: activeTab === 'currency' ? '3px solid #4f46e5' : 'none', fontSize: '0.95rem'
              }}
            >
              💱 המרת מטבעות
            </button>
            <button
              onClick={() => setActiveTab('units')}
              style={{
                flex: 1, padding: '16px', border: 'none', background: activeTab === 'units' ? 'white' : 'transparent',
                color: activeTab === 'units' ? '#4f46e5' : '#64748b', fontWeight: 'bold', cursor: 'pointer',
                borderBottom: activeTab === 'units' ? '3px solid #4f46e5' : 'none', fontSize: '0.95rem'
              }}
            >
              📏 המרות מידות ומרחקים
            </button>
            <button
              onClick={() => setActiveTab('metals')}
              style={{
                flex: 1, padding: '16px', border: 'none', background: activeTab === 'metals' ? 'white' : 'transparent',
                color: activeTab === 'metals' ? '#4f46e5' : '#64748b', fontWeight: 'bold', cursor: 'pointer',
                borderBottom: activeTab === 'metals' ? '3px solid #4f46e5' : 'none', fontSize: '0.95rem'
              }}
            >
              🥇 שערי זהב ומתכות
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '30px' }}>
            {activeTab === 'currency' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1e293b' }}>המיר מטבעות זרים ושקלים</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>סכום להמרה:</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>ממטבע:</label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: 'white' }}
                    >
                      <option value="ILS">שקל חדש (ILS)</option>
                      <option value="USD">דולר ארה"ב (USD)</option>
                      <option value="EUR">אירו (EUR)</option>
                      <option value="GBP">ליש"ט (GBP)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>למטבע יעד:</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: 'white' }}
                  >
                    <option value="ILS">שקל חדש (ILS)</option>
                    <option value="USD">דולר ארה"ב (USD)</option>
                    <option value="EUR">אירו (EUR)</option>
                    <option value="GBP">ליש"ט (GBP)</option>
                  </select>
                </div>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>תוצאת ההמרה המשוערת:</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5' }}>
                    {convertCurrency()} {toCurrency}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'units' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1e293b' }}>המרת יחידות מידה ומרחקים</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>ערך להמרה:</label>
                    <input
                      type="number"
                      value={unitValue}
                      onChange={(e) => setUnitValue(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>סוג המרה:</label>
                    <select
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: 'white' }}
                    >
                      <option value="m_to_ft">מטר ➔ פיט (רגל)</option>
                      <option value="ft_to_m">פיט (רגל) ➔ מטר</option>
                      <option value="km_to_mi">קילומטר ➔ מייל</option>
                      <option value="mi_to_km">מייל ➔ קילומטר</option>
                      <option value="cm_to_in">סנטימטר ➔ אינץ'</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>תוצאה:</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4f46e5' }}>
                    {convertUnits()}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metals' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1e293b' }}>מחשבון שווי זהב לפי משקל</h2>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>משקל בגרמים:</label>
                  <input
                    type="number"
                    value={grams}
                    onChange={(e) => setGrams(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>שווי משוער בשקלים (ILS):</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                      {(parseFloat(grams || 0) * pricePerGramILS).toLocaleString()} ₪
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>שווי משוער בדולרים (USD):</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                      ${(parseFloat(grams || 0) * pricePerGramUSD).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <section style={{ marginTop: '40px', background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#1e293b' }}>כלים מתקדמים לניהול עסק וקשרי מסחר בינלאומיים</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#475569', marginBottom: '15px' }}>
            עסקים, עצמאיים ויבואנים נדרשים יום-יום לבצע חישובים מהירים של שערי מטבע, המרות מידות בעבודה מול ספקים בחו"ל ומעקב אחרי מדדים פיננסיים. מרכז הכלים של ProFlow נועד לרכז עבורכם את כל הפעולות הללו במקום אחד, בצורה מדויקת ומהירה.
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#475569' }}>
            מתכננים להפיק הצעות מחיר מקצועיות ללקוחות בארץ ובחו"ל במטבעות שונים? גלו את מערכת ניהול העסק המתקדמת של ProFlow.
          </p>
        </section>

        {/* CTA Banner */}
        <div style={{ marginTop: '30px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', fontWeight: 'bold' }}>רוצה לנהל את העסק שלך ברמה הבאה?</h3>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '20px' }}>הפק הצעות מחיר חכמות, נהל לקוחות ופתח את העסק לעולם עם ProFlow.</p>
          <a
            href="/"
            style={{ background: 'white', color: '#4f46e5', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          >
            התחל עכשיו בחינם
          </a>
        </div>
      </main>
    </div>
  );
}

export default PublicTools;