// src/utils/regionConfig.js

export const isHebrewEnv = (country, session) => {
  if (session) {
    return country !== 'International';
  }
  return localStorage.getItem('proflow_lang') === 'he' || 
         (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('he'));
};

export const getCurrencySym = (country, currency) => {
  if (country !== 'International') return '₪';
  if (currency === 'EUR') return '€';
  if (currency === 'GBP') return '£';
  if (currency === 'ILS') return '₪';
  return '$';
};

export const getRegionTaxRate = (country) => {
  return country !== 'International' ? 0.18 : 0.00;
};