import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Glasscard from '../components/Glasscard';
import Button from '../components/Button';
import Rolebadge from '../components/Rolebadge';

export default function StartupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [error, setError] = useState(false);
  
  // NEW: State to track request sending
  const[reqStatus, setReqStatus] = useState('');

  useEffect(() => {
    api.get(`/investor/startups/${id}`)
      .then(res => setStartup(res.data))
      .catch(err => {
        console.error("Failed to load details:", err);
        setError(true);
      });
  },[id]);

  // NEW: Function to send the request
  const handleSendRequest = async () => {
    setReqStatus('sending');
    try {
      // We send the request to the Startup's User ID
      const receiverId = startup.user?.id || startup.userId || id; 
      await api.post(`/network/request/send/${receiverId}`);
      setReqStatus('success');
    } catch (err) {
      console.error("Request Error:", err);
      setReqStatus('error');
    }
  };

  if (error) return <div className="pt-40 text-center text-red-400 font-bold">Failed to load Startup Details.</div>;
  if (!startup) return <div className="pt-40 text-center text-[#06B6D4] font-bold animate-pulse">Loading Pitch Deck...</div>;

  return (
    <>
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="text-[#06B6D4] hover:text-white font-bold mb-6 flex items-center gap-2 transition">
          ← Back to Dashboard
        </button>

        <Glasscard className="p-10 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start border-b border-white/10 pb-8 mb-8">
            <img src={`https://ui-avatars.com/api/?name=${startup.companyName}&background=7C3AED&color=fff&size=200`} alt="logo" className="w-32 h-32 rounded-3xl shadow-[0_0_30px_rgba(124,58,237,0.4)] border-2 border-[#7C3AED]/50"/>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{startup.companyName}</h1>
                <Rolebadge role={startup.businessDomain || 'Tech'} />
              </div>
              <p className="text-[#06B6D4] font-bold text-lg mb-4">Founded by {startup.founderName}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-bold mb-4">
                <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">📍 {startup.location || 'Global'}</span>
                <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">🌐 {startup.website || 'No Website'}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 px-4 py-2 rounded-xl text-[#7C3AED] font-bold text-sm">
                  ✉️ {startup.contactEmail || "Request Connection to view"}
                </div>
                <div className="bg-[#06B6D4]/10 border border-[#06B6D4]/30 px-4 py-2 rounded-xl text-[#06B6D4] font-bold text-sm">
                  📞 {startup.contactNumber || "Request Connection to view"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-black/20 p-6 rounded-2xl border border-[#06B6D4]/30">
              <p className="text-xs text-[#06B6D4] uppercase font-bold tracking-widest mb-1">Funding Required</p>
              <p className="text-3xl font-black text-white">${startup.fundingRequired}</p>
            </div>
            <div className="bg-black/20 p-6 rounded-2xl border border-[#7C3AED]/30">
              <p className="text-xs text-[#7C3AED] uppercase font-bold tracking-widest mb-1">Equity Offered</p>
              <p className="text-3xl font-black text-white">{startup.equityOffered}%</p>
            </div>
            <div className="bg-black/20 p-6 rounded-2xl border border-[#22C55E]/30">
              <p className="text-xs text-[#22C55E] uppercase font-bold tracking-widest mb-1">AI Match Score</p>
              <p className="text-3xl font-black text-white">92%</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">Company Pitch & About</h3>
          <p className="text-gray-300 leading-relaxed mb-10 bg-white/5 p-6 rounded-2xl border border-white/5">
            {startup.about || "This startup has not provided a detailed description yet."}
          </p>

          <div className="flex justify-end gap-4 items-center">
            {reqStatus === 'error' && <span className="text-red-400 font-bold">Request failed or already sent!</span>}
            {reqStatus === 'success' && <span className="text-green-400 font-bold">✅ Request Sent Successfully!</span>}
            
            <Button onClick={handleSendRequest} disabled={reqStatus === 'sending' || reqStatus === 'success'}>
              {reqStatus === 'sending' ? 'Sending...' : reqStatus === 'success' ? 'Request Sent' : 'Send Contact Request'}
            </Button>
          </div>
        </Glasscard>
      </div>
    </>
  );
}