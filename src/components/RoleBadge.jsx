import React from 'react';

export default function Rolebadge({ role }) {
  if (!role) return null;
  
  let styles = "";
  const normalizedRole = role.toUpperCase();
  
  if (normalizedRole === 'STARTUP' || normalizedRole.includes('TECH')) {
    styles = "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]";
  } else if (normalizedRole === 'INVESTOR') {
    styles = "bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30 shadow-[0_0_10px_rgba(124,58,237,0.2)]";
  } else if (normalizedRole === 'ADMIN') {
    styles = "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]";
  } else {
    styles = "bg-gray-500/10 text-gray-300 border-gray-500/30";
  }

  return (
    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${styles}`}>
      {role}
    </span>
  );
}