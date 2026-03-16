import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        email: e.target.email.value,
        password: e.target.password.value
      });
      
      // Auto-Redirect based on Java Database Role!
      const userRole = response.data.role; 
      if (userRole === 'ADMIN') navigate('/admin');
      else if (userRole === 'INVESTOR') navigate('/investor');
      else navigate('/startup');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Did you verify your email?');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        {error && <p className="text-red-400 bg-red-500/10 p-3 rounded mb-4 text-sm text-center font-bold">{error}</p>}
        <form className="space-y-5" onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email Address" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#06B6D4]" />
          <input name="password" type="password" placeholder="Password" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#06B6D4]" />
          <button type="submit" className="w-full bg-linear-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform">
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          New here? <Link to="/register" className="text-[#06B6D4] font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
}