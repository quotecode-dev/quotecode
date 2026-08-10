// src/utils/regionConfig.js

export const isHebrewEnv = (country, session) => {
  // בדיקה מיידית מול ה-LocalStorage למניעת הבזק שפה בריפרש עוד לפני טעינת השרת
  const cachedCountry = typeof window !== 'undefined' ? localStorage.getItem('proflow_cached_country') : null;
  if (cachedCountry === 'International') return false;
  if (cachedCountry === 'Local') return true;

  if (country === 'International') return false;

  if (session) {
    return country !== 'International';
  }
  return localStorage.getItem('proflow_lang') === 'he' || 
         (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('he'));
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