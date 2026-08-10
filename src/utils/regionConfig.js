// src/utils/regionConfig.js

export const isHebrewEnv = (country, session) => {
  const email = session?.user?.email;
  
  // בדיקה מיידית מול המטמון האישי של המשתמש לפי אימייל
  if (email) {
    const userCached = localStorage.getItem('proflow_country_' + email);
    if (userCached) {
      if (country && country !== 'Local' && country !== userCached) {
        localStorage.setItem('proflow_country_' + email, country);
        localStorage.setItem('proflow_cached_country', country);
      }
      return userCached !== 'International';
    }
  }

  // בדיקה מול המטמון הגלובלי
  const cachedCountry = typeof window !== 'undefined' ? localStorage.getItem('proflow_cached_country') : null;
  if (cachedCountry) {
    if (email && country && country !== 'Local') {
      localStorage.setItem('proflow_country_' + email, country);
      localStorage.setItem('proflow_cached_country', country);
    }
    return cachedCountry !== 'International';
  }

  if (country === 'International') return false;
  if (country === 'Local') return true;

  if (email && country) {
    localStorage.setItem('proflow_country_' + email, country);
    localStorage.setItem('proflow_cached_country', country);
  }

  // ברירת מחדל אנגלית מושלמת למסך כניסה ולאורחים (ללא כפיית עברית לפי שפת הדפדפן)
  return localStorage.getItem('proflow_lang') === 'he';
};

export const getCurrencySym = (country, currency) => {
  const cachedCountry = typeof window !== 'undefined' ? localStorage.getItem('proflow_cached_country') : null;
  const effectiveCountry = country || cachedCountry;

  if (effectiveCountry === 'International') {
    if (currency === 'EUR') return '€';
    if (currency === 'GBP') return '£';
    if (currency === 'ILS') return '₪';
    return '$';
  }
  return '₪';
};

export const getRegionTaxRate = (country) => {
  const cachedCountry = typeof window !== 'undefined' ? localStorage.getItem('proflow_cached_country') : null;
  const effectiveCountry = country || cachedCountry;
  
  return effectiveCountry !== 'International' ? 0.18 : 0.00;
};