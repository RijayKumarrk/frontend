import React from 'react';

export default function Button({ children, onClick, type = "button", className = "", variant = "primary" }) {
  const baseStyle = "font-bold py-3 px-6 rounded-xl transition-all duration-300 flex justify-center items-center ";
  const primaryStyle = "bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] hover:scale-[1.02]";
  const outlineStyle = "bg-[rgba(255,255,255,0.05)] border border-white/20 text-white hover:bg-white/10";

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variant === 'outline' ? outlineStyle : primaryStyle} ${className}`}>
      {children}
    </button>
  );
}