import React, { useState } from 'react';

function PublicTools() {
  const [activeTab, setActiveTab] = useState('currency');

  // Currency state with Swap support
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

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Units state with Swap support and full unit list
  const [unitValue, setUnitValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const unitFactors = {
    m: 1,
    ft: 0.3048,
    km: 1000,
    mi: 1609.344,
    cm: 0.01,
    in: 0.0254
  };

  const unitLabels = {
    m: 'מטר',
    ft: 'פיט (רגל)',
    km: 'קילומטר',
    mi: 'מייל',
    cm: 'סנטימטר',
    in: 'אינץ\''
  };

  const convertUnits = () => {
    const val = parseFloat(unitValue) || 0;
    const inMeters = val * unitFactors[fromUnit];
    const result = inMeters / unitFactors[toUnit];
    return result.toFixed(2);
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  // Metals state (Gold & Silver purity tiers)
  const [metalType, setMetalType] = useState('gold'); // 'gold' or 'silver'
  const [purity, setPurity] = useState('24k'); 
  const [metalGrams, setMetalGrams] = useState('10');

  const baseGoldPricePerGramILS = 276; 
  const baseSilverPricePerGramILS = 3.2; 
  const usdRate = rates['USD'];

  const calculateMetalValue = () => {
    const g = parseFloat(metalGrams) || 0;
    let factor = 1;

    if (metalType === 'gold') {
      if (purity === '24k') factor = 1.0;
      else if (purity === '22k') factor = 22 / 24;
      else if (purity === '21k') factor = 21 / 24;
      else if (purity === '18k') factor = 18 / 24;
      else if (purity === '14k') factor = 14 / 24;

      const totalILS = g * baseGoldPricePerGramILS * factor;
      const totalUSD = totalILS / usdRate;
      return { ils: totalILS.toLocaleString('he-IL', { maximumFractionDigits: 2 }), usd: totalUSD.toLocaleString('en-US', { maximumFractionDigits: 2 }) };
    } else {
      if (purity === '999') factor = 1.0;
      else if (purity === '925') factor = 0.925;
      else if (purity === '800') factor = 0.800;

      const totalILS = g * baseSilverPricePerGramILS * factor;
      const totalUSD = totalILS / usdRate;
      return { ils: totalILS.toLocaleString('he-IL', { maximumFractionDigits: 2 }), usd: totalUSD.toLocaleString('en-US', { maximumFractionDigits: 2 }) };
    }
  };

  const metalResult = calculateMetalValue();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'system-ui, sans-serif' }} dir="rtl">
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '10px', fontWeight: 'bold' }}>מרכז הכלים והמחשבונים העסקיים</h1>
        <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          כלים חכמים, מהירים ומדויקים לעסקים, יבואנים ופרילנסרים – המרות מטבעות, מידות ומתכות יקרות בזמן אמת.
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
              🥇 שערי זהב וכסף
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '30px' }}>
            {activeTab === 'currency' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1e293b' }}>המיר מטבעות זרים ושקלים</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '15px', alignItems: 'flex-end', marginBottom: '20px' }}>
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

                  {/* Swap Button */}
                  <button
                    onClick={handleSwapCurrencies}
                    title="החלף מטבעות (SWAP)"
                    style={{
                      background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', width: '46px', height: '46px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'all 0.2s'
                    }}
                  >
                    ⇄
                  </button>

                  <div>
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
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>סכום להמרה ({fromCurrency}):</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                  />
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
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '15px', alignItems: 'flex-end', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>מידת מקור:</label>
                    <select
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: 'white' }}
                    >
                      {Object.entries(unitLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Swap Button for Units */}
                  <button
                    onClick={handleSwapUnits}
                    title="החלף יחידות (SWAP)"
                    style={{
                      background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', width: '46px', height: '46px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', transition: 'all 0.2s'
                    }}
                  >
                    ⇄
                  </button>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>מידת יעד:</label>
                    <select
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: 'white' }}
                    >
                      {Object.entries(unitLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>ערך להמרה ({unitLabels[fromUnit]}):</label>
                  <input
                    type="number"
                    value={unitValue}
                    onChange={(e) => setUnitValue(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '5px' }}>תוצאה:</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4f46e5' }}>
                    {convertUnits()} {unitLabels[toUnit]}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metals' && (
              <div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1e293b' }}>מחשבון שווי זהב וכסף לפי משקל ודרגת טוהר</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>סוג מתכת:</label>
                    <select
                      value={metalType}
                      onChange={(e) => {
                        setMetalType(e.target.value);
                        setPurity(e.target.value === 'gold' ? '24k' : '999');
                      }}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: 'white' }}
                    >
                      <option value="gold">🥇 זהב</option>
                      <option value="silver">🥈 כסף</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>דרגת טוהר / קראט:</label>
                    <select
                      value={purity}
                      onChange={(e) => setPurity(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: 'white' }}
                    >
                      {metalType === 'gold' ? (
                        <>
                          <option value="24k">זהב 24 קראט (99.9%)</option>
                          <option value="22k">זהב 22 קראט (91.6%)</option>
                          <option value="21k">זהב 21 קראט (87.5%)</option>
                          <option value="18k">זהב 18 קראט (75.0%)</option>
                          <option value="14k">זהב 14 קראט (58.5%)</option>
                        </>
                      ) : (
                        <>
                          <option value="999">כסף טהור 999 (99.9%)</option>
                          <option value="925">כסף סטרלינג 925 (92.5%)</option>
                          <option value="800">כסף 800 (80.0%)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>משקל בגרמים:</label>
                  <input
                    type="number"
                    value={metalGrams}
                    onChange={(e) => setMetalGrams(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>שווי משוער בשקלים (ILS):</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                      {metalResult.ils} ₪
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '5px' }}>שווי משוער בדולרים (USD):</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                      ${metalResult.usd}
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