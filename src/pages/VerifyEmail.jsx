import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Glasscard from '../components/GlassCard';
import Button from '../components/Button';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const[status, setStatus] = useState(token ? 'Verifying your email...' : '❌ No verification token provided.');
  const[isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      api.get(`/auth/verify?token=${token}`)
        .then(() => {
          setStatus('✅ Email verified successfully! Redirecting to login...');
          setIsSuccess(true);
          // Redirect to login page after 3 seconds
          setTimeout(() => navigate('/login'), 3000);
        })
        .catch(() => {
          setStatus('❌ Invalid or expired token. Please register again.');
          setIsSuccess(false);
        });
    }
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen px-6 relative z-10">
      <Glasscard className="p-10 text-center max-w-md w-full shadow-2xl">
        <div className="mb-6 text-6xl">
          {isSuccess ? '🎉' : status.includes('❌') ? '⚠️' : '⏳'}
        </div>
        <h2 className="text-xl font-bold text-white mb-8 leading-relaxed">
          {status}
        </h2>
        
        <Button onClick={() => navigate('/login')} className="w-full">
          {isSuccess ? "Go to Login Now" : "Return to Login"}
        </Button>
      </Glasscard>
    </div>
  );
}
