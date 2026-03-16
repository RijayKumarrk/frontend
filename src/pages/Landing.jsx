import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Button from '../components/Button';
import Glasscard from '../components/Glasscard';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="pt-40 pb-20 px-6 relative z-10 max-w-7xl mx-auto text-center">
        
        {/* HERO SECTION */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white animate-fade-in-up">
          Startup & Investor <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#06B6D4] to-[#7C3AED]">Interaction Platform</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          The premium ecosystem connecting visionary founders with global capital. Backed by next-generation matching algorithms.
        </p>
        
        {/* CALL TO ACTION BUTTONS */}
        <div className="flex justify-center gap-6 mb-24">
          <Button onClick={() => navigate('/register')} className="px-10 py-4 text-lg">Create Free Account</Button>
          <Button variant="outline" onClick={() => navigate('/login')} className="px-10 py-4 text-lg">Login to Dashboard</Button>
        </div>

        {/* 3 ROLE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Glasscard className="p-8 text-left hover:-translate-y-2 transition-transform duration-300">
            <div className="text-5xl mb-6">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-3">For Startups</h3>
            <p className="text-gray-400 leading-relaxed">Create a stunning pitch profile, manage your funding requests, and connect directly with verified investors globally.</p>
          </Glasscard>
          
          <Glasscard className="p-8 text-left hover:-translate-y-2 transition-transform duration-300 border-[#06B6D4]/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/10 rounded-full blur-2xl"></div>
            <div className="text-5xl mb-6 relative z-10">💼</div>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">For Investors</h3>
            <p className="text-gray-400 leading-relaxed relative z-10">Browse curated startups, filter by domain and budget, and build your next-gen investment portfolio seamlessly.</p>
          </Glasscard>
          
          <Glasscard className="p-8 text-left hover:-translate-y-2 transition-transform duration-300">
            <div className="text-5xl mb-6">🛡️</div>
            <h3 className="text-2xl font-bold text-white mb-3">Secure Network</h3>
            <p className="text-gray-400 leading-relaxed">Our system administrators monitor platform health, verify users, and maintain a high-quality ecosystem free of spam.</p>
          </Glasscard>
        </div>
      </div>
    </>
  );
}
