import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const[status, setStatus] = useState({ type: '', message: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Creating account...' });
    try {
      await api.post('/auth/register', {
        email: e.target.email.value,
        password: e.target.password.value,
        role: e.target.role.value
      });
      setStatus({ type: 'success', message: 'Success! Please check your email for the verification link.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data || 'Registration failed.' });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Join SUIPS</h2>
        
        {status.message && (
          <div className={`p-3 rounded-lg mb-4 text-center font-bold text-sm ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {status.message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister}>
          <input name="email" type="email" placeholder="Email Address" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#06B6D4]" />
          <input name="password" type="password" placeholder="Password" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#06B6D4]" />
          <select name="role" required className="w-full bg-[#070b19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#06B6D4]">
            <option value="" disabled selected>Select Role</option>
            <option value="STARTUP">Startup Founder</option>
            <option value="INVESTOR">Investor</option>
          </select>
          <button type="submit" className="w-full bg-linear-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform">
            Register
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-[#06B6D4] font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}