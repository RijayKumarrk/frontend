import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Glasscard from '../components/GlassCard';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen px-6 relative z-10">
      <Glasscard className="p-16 text-center max-w-2xl w-full">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#7C3AED] to-[#06B6D4] mb-6 drop-shadow-2xl">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-10 text-lg">
          The page, startup, or investor you are looking for has vanished into the digital void.
        </p>
        <div className="flex justify-center">
          <Button onClick={() => navigate('/login')} className="px-10">
            Return to Safety
          </Button>
        </div>
      </Glasscard>
    </div>
  );
}
