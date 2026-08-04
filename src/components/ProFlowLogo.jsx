import React from 'react';

export default function ProFlowLogo({ size = 36 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#4f46e5" />
        <path d="M10 16L15 21L22 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontSize: `${size * 0.65}px`, fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px' }}>
        Pro<span style={{ color: '#4f46e5' }}>Flow</span>
      </span>
    </div>
  );
}