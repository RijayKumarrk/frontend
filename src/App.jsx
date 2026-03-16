import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// IMPORTING ALL PAGES
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import StartupDashboard from './pages/StartupDashboard';
import InvestorDashboard from './pages/InvestorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StartupDetails from './pages/StartupDetails';
import NotFound from './pages/NotFound';

// 🟢 IMPORTING YOUR LOCAL IMAGE FROM THE ASSETS FOLDER!
import suipsBg from './assets/suips-bg.jpg';

export default function App() {
  
  return (
    <div className="min-h-screen bg-[#070b19] relative overflow-hidden font-sans selection:bg-[#06B6D4]/30 pb-20">
      
      {/* 1. CSS NOISE TEXTURE */}
      <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>
      
      {/* 2. THE FULL-SCREEN ANIMATED BACKGROUND LOGO */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src={suipsBg} 
          alt="SUIPS Background" 
          /* 
            w-[110vw] h-[110vh] makes it slightly larger than the screen 
            so the floating animation doesn't reveal the edges!
            object-cover ensures it fits perfectly without stretching weirdly.
          */
          className="absolute top-[-5%] left-[-5%] w-[110vw] h-[110vh] object-cover opacity-[0.05] grayscale mix-blend-lighten animate-float"
        />
      </div>

      {/* 3. NEON GLOWING BLOBS */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#7C3AED] mix-blend-screen blur-[120px] opacity-20 animate-pulse pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#06B6D4] mix-blend-screen blur-[150px] opacity-15 animate-pulse delay-700 pointer-events-none z-0"></div>

      {/* 4. REACT ROUTER (The Content) */}
      <div className="relative z-10">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyEmail />} />
            
            {/* Dashboard Routes */}
            <Route path="/startup" element={<StartupDashboard />} />
            <Route path="/investor" element={<InvestorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/startup-details/:id" element={<StartupDetails />} />
            
            {/* 404 Route (Catches wrong URLs) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
      
    </div>
  );
}