// src/utils/regionConfig.js

export const isHebrewEnv = (country, session) => {
  // אם אין משתמש מחובר (מסך כניסה / התחברות / אורח), נציג תמיד באנגלית בינלאומית נקייה ויציבה
  if (!session || !session.user) {
    return false;
  }

  const email = session?.user?.email;
  
  if (email) {
    const userCached = localStorage.getItem('proflow_country_' + email);
    if (userCached) {
      return userCached !== 'International';
    }
  }

  const cachedCountry = typeof window !== 'undefined' ? localStorage.getItem('proflow_cached_country') : null;
  if (cachedCountry) {
    return cachedCountry !== 'International';
  }

  if (country === 'International') return false;
  if (country === 'Local') return true;

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