import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = ['/startup', '/investor', '/admin'].includes(location.pathname);

  const handleLogout = async () => {
  try {
    await api.post('/auth/logout');
    navigate('/login');
  } catch (err) {
    console.error("Logout failed:", err);
    navigate('/login');
  }
};

  return (
    <nav className="fixed w-full z-50 top-6 px-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
        
        <Link to="/" className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-[#06B6D4] to-[#7C3AED]">
          SUIPS<span className="text-white">.AI</span>
        </Link>
        
        <div className="flex items-center space-x-6 text-sm font-bold text-gray-300">
          <Link to="/" className="hover:text-white transition">Home</Link>
          
          {isDashboard ? (
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">Logout</button>
          ) : (
            <button onClick={() => navigate('/login')} className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full text-white transition">
              Login
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}