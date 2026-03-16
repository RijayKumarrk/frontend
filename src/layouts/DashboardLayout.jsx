import React from 'react';
import Navbar from '../components/NavBar';
import Glasscard from '../components/GlassCard';

// NOTICE: We added 'activeTab' and 'setActiveTab' so the buttons actually work!
export default function DashboardLayout({ children, sidebarItems, userProfile, activeTab, setActiveTab }) {
  
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8 pb-20">
      <Navbar />
      
      {/* Sidebar Navigation */}
      <Glasscard className="w-full md:w-72 md:h-[calc(100vh-10rem)] p-6 flex flex-col gap-2 md:sticky top-32">
        
        {/* User Profile Box */}
        <div className="flex items-center gap-4 mb-8 px-2 pb-6 border-b border-white/10">
          <div className="w-14 h-14 rounded-full border-2 border-[#06B6D4] p-0.5 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <img src={userProfile.img} className="rounded-full w-full h-full object-cover" alt="profile"/>
          </div>
          <div>
            <p className="text-white font-black text-lg truncate max-w-35">{userProfile.name}</p>
            <p className="text-xs text-[#22C55E] font-bold uppercase tracking-widest">{userProfile.role}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest px-4 mb-2">Main Menu</p>
        
        {/* Render Sidebar Navigation Buttons */}
        {sidebarItems.map((item, index) => (
          <button 
            key={index} 
            onClick={() => setActiveTab(item)} // This changes the screen!
            className={`text-left px-5 py-3.5 rounded-xl transition-all font-bold flex items-center gap-3
              ${activeTab === item 
                ? 'bg-linear-to-r from-[#06B6D4]/20 to-transparent text-[#06B6D4] border-l-4 border-[#06B6D4]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
          >
            {item}
          </button>
        ))}
      </Glasscard>
      
      {/* Main Content Area (Changes based on what is clicked) */}
      <div className="flex-1 space-y-6">
        {children}
      </div>
    </div>
  );
}
