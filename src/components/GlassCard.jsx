import React from 'react';

export default function Glasscard({ children, className = "" }) {
  return (
    <div className={`bg-[rgba(255,255,255,0.05)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl ${className}`}>
      {children}
    </div>
  );
}