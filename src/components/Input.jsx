import React from 'react';

export default function Input({ ...props }) {
  return (
    <input 
      {...props} 
      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all"
    />
  );
}