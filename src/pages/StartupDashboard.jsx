import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import Glasscard from '../components/Glasscard';
import Input from '../components/Input';
import Button from '../components/Button';
import Rolebadge from '../components/Rolebadge';

export default function StartupDashboard() {
  const[formData, setFormData] = useState({ companyName: '', founderName: '', businessDomain: '', location: '', fundingRequired: '', equityOffered: '', pitchSummary: '', website: '', about: '', contactEmail: '', contactNumber: '' });
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  
  const [investors, setInvestors] = useState([]);
  const[requests, setRequests] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const[reqFeedback, setReqFeedback] = useState({}); 

  useEffect(() => {
    if (activeTab === 'Overview' || activeTab === 'Edit Profile' || activeTab === 'Browse Investors') {
      api.get('/startup/profile').then(res => { if(res.data) setFormData(res.data); }).catch(err => console.error("No profile:", err));
      api.get('/startup/investors').then(res => setInvestors(res.data)).catch(err => console.error("No investors:", err));
    } else if (activeTab === 'Requests') {
      api.get('/network/request/pending').then(res => setRequests(res.data)).catch(err => console.error(err));
    }
  }, [activeTab]);

  // FIX: This function is now properly attached to the Form onSubmit below!
  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('Saving...');
    try {
      await api.post('/startup/profile', formData);
      setStatus('✅ Profile published!');
      setTimeout(() => setStatus(''), 3000);
      setActiveTab('Overview');
    } catch (err) { 
      console.error(err);
      setStatus('❌ Failed to save.'); 
    }
  };

  const sendRequest = async (userId) => {
    setReqFeedback({ ...reqFeedback,[userId]: 'sending' });
    try {
      await api.post(`/network/request/send/${userId}`);
      setReqFeedback({ ...reqFeedback, [userId]: 'success' });
    } catch (err) {
      console.error(err);
      setReqFeedback({ ...reqFeedback, [userId]: 'error' });
    }
  };

  const respondToRequest = async (reqId, accept) => {
    try {
      await api.post(`/network/request/respond/${reqId}?accept=${accept}`);
      setRequests(requests.filter(r => r.id !== reqId)); 
      alert(accept ? "✅ Connection Accepted!" : "❌ Request Rejected");
    } catch (err) {
      console.error(err);
      alert("Failed to process request.");
    }
  };

  const filteredInvestors = investors.filter(i => 
    i.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || i.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const aiRecommendedInvestors = investors.filter(i => 
    i.preferredDomains?.toLowerCase().includes(formData.businessDomain?.toLowerCase()) || 
    formData.businessDomain?.toLowerCase().includes(i.preferredDomains?.toLowerCase())
  ).slice(0, 2); 

  const sidebarItems =['Overview', 'Edit Profile', 'Browse Investors', 'Requests', 'Messages'];
  const userProfile = { name: formData.companyName || "Startup", role: "Verified", img: `https://ui-avatars.com/api/?name=${formData.companyName || 'S'}&background=7C3AED&color=fff` };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userProfile={userProfile} activeTab={activeTab} setActiveTab={setActiveTab}>
      
      {/* FIX: Status is used right here! */}
      {status && <div className="mb-4 text-cyan-400 font-bold bg-cyan-500/10 p-3 rounded-xl animate-pulse">{status}</div>}

      {/* ================= OVERVIEW ================= */}
      {activeTab === 'Overview' && (
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Glasscard className="p-6 border-t-4 border-[#06B6D4]"><p className="text-gray-400 text-sm font-bold uppercase mb-2">Funding Goal</p><p className="text-4xl font-black text-white">${formData.fundingRequired || "0"}</p></Glasscard>
            <Glasscard className="p-6 border-t-4 border-[#7C3AED]"><p className="text-gray-400 text-sm font-bold uppercase mb-2">Equity Offered</p><p className="text-4xl font-black text-white">{formData.equityOffered || "0"}%</p></Glasscard>
            <Glasscard className="p-6 border-t-4 border-[#22C55E]"><p className="text-gray-400 text-sm font-bold uppercase mb-2">Profile Status</p><p className="text-3xl font-black text-white">{formData.companyName ? "🟢 Active" : "🔴 Incomplete"}</p></Glasscard>
          </div>

          {formData.companyName && (
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 mb-6 flex items-center gap-2">🤖 AI Smart Matches</h3>
              {aiRecommendedInvestors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiRecommendedInvestors.map(inv => (
                    <Glasscard key={inv.id} className="p-6 border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.15)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-fuchsia-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-lg">98% Match</div>
                      <h4 className="text-xl font-bold text-white mb-1">{inv.fullName}</h4>
                      <p className="text-[#06B6D4] text-sm font-bold mb-4">{inv.companyName || "Independent"}</p>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">Loves investing in: {inv.preferredDomains}</p>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('Browse Investors')}>View Investor</Button>
                    </Glasscard>
                  ))}
                </div>
              ) : (
                <Glasscard className="p-6 text-center text-gray-400">Our AI is scanning for the perfect {formData.businessDomain || "industry"} investors. Check back soon!</Glasscard>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= EDIT PROFILE ================= */}
      {activeTab === 'Edit Profile' && (
        <Glasscard className="p-8 animate-fade-in-up">
          <h3 className="text-2xl font-bold text-white mb-6">Edit Company Pitch</h3>
          
          {/* FIX: handleSave is used exactly here! */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input name="companyName" value={formData.companyName} onChange={e=>setFormData({...formData, companyName:e.target.value})} required placeholder="Company Name" />
              <Input name="founderName" value={formData.founderName} onChange={e=>setFormData({...formData, founderName:e.target.value})} required placeholder="Founder Name" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input name="businessDomain" value={formData.businessDomain} onChange={e=>setFormData({...formData, businessDomain:e.target.value})} required placeholder="Domain (e.g. AI)" />
              <Input name="location" value={formData.location} onChange={e=>setFormData({...formData, location:e.target.value})} required placeholder="Location" />
              <Input name="website" value={formData.website} onChange={e=>setFormData({...formData, website:e.target.value})} placeholder="Website URL" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-xl border border-white/10">
              <div><label className="text-xs text-gray-400 uppercase font-bold">Public Contact Email</label><Input name="contactEmail" type="email" value={formData.contactEmail} onChange={e=>setFormData({...formData, contactEmail:e.target.value})} placeholder="founder@company.com" /></div>
              <div><label className="text-xs text-gray-400 uppercase font-bold">Phone Number</label><Input name="contactNumber" type="tel" value={formData.contactNumber} onChange={e=>setFormData({...formData, contactNumber:e.target.value})} placeholder="+1 (555) 000-0000" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#06B6D4]/5 p-6 rounded-xl border border-[#06B6D4]/20">
              <div><label className="text-xs text-[#06B6D4] uppercase font-bold">Funding Needed ($)</label><Input name="fundingRequired" type="number" value={formData.fundingRequired} onChange={e=>setFormData({...formData, fundingRequired:e.target.value})} required placeholder="500000" /></div>
              <div><label className="text-xs text-[#06B6D4] uppercase font-bold">Equity Offered (%)</label><Input name="equityOffered" type="number" step="0.1" value={formData.equityOffered} onChange={e=>setFormData({...formData, equityOffered:e.target.value})} required placeholder="10" /></div>
            </div>
            <textarea name="pitchSummary" value={formData.pitchSummary} onChange={e=>setFormData({...formData, pitchSummary:e.target.value})} required rows="2" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#06B6D4] outline-none" placeholder="Short Elevator Pitch..." />
            <textarea name="about" value={formData.about} onChange={e=>setFormData({...formData, about:e.target.value})} required rows="5" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#06B6D4] outline-none" placeholder="Full Company Description..." />
            <Button type="submit" className="w-full">Save & Publish</Button>
          </form>
        </Glasscard>
      )}

      {/* ================= BROWSE INVESTORS ================= */}
      {activeTab === 'Browse Investors' && (
        <div className="animate-fade-in-up">
           <div className="flex justify-between items-end mb-6">
            <h2 className="text-3xl font-bold text-white">Find Investors</h2>
            <input type="text" placeholder="Search by name or firm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[rgba(255,255,255,0.08)] border border-white/20 text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-[#06B6D4]"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInvestors.map(inv => {
              const uid = inv.user?.id || inv.userId || inv.id;
              return (
                <Glasscard key={inv.id} className="p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{inv.fullName}</h3>
                    <Rolebadge role="Investor" />
                  </div>
                  <p className="text-[#06B6D4] font-bold text-sm mb-4">{inv.companyName || "Independent Investor"}</p>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">"{inv.about}"</p>
                  <Button onClick={() => sendRequest(uid)} disabled={reqFeedback[uid] === 'sending' || reqFeedback[uid] === 'success'} className="w-full mt-auto">
                    {reqFeedback[uid] === 'success' ? '✅ Request Sent' : reqFeedback[uid] === 'error' ? '❌ Error' : 'Send Pitch Request'}
                  </Button>
                </Glasscard>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= REQUESTS ================= */}
      {activeTab === 'Requests' && (
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6">Pending Connections</h2>
          {requests.length === 0 ? (
            <Glasscard className="p-10 text-center"><div className="text-5xl mb-4">📭</div><h3 className="text-xl font-bold text-white">No pending requests.</h3></Glasscard>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <Glasscard key={req.id} className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-white font-bold text-lg">{req.sender.email} wants to view your full pitch!</p>
                    <p className="text-[#06B6D4] text-sm">Role: {req.sender.role}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => respondToRequest(req.id, true)} className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-bold hover:bg-green-500/40 transition">Accept</button>
                    <button onClick={() => respondToRequest(req.id, false)} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-bold hover:bg-red-500/40 transition">Decline</button>
                  </div>
                </Glasscard>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}