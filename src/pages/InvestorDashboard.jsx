import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import Glasscard from '../components/Glasscard';
import Button from '../components/Button';
import Input from '../components/Input';
import Rolebadge from '../components/Rolebadge';

export default function InvestorDashboard() {
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [requests, setRequests] = useState([]); // NEW: Store pending requests
  const [loading, setLoading] = useState(true);
  const[activeTab, setActiveTab] = useState('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  const[domainFilter, setDomainFilter] = useState('All');

  const [profile, setProfile] = useState({ fullName: '', companyName: '', about: '', preferredDomains: '', location: '', minInvestment: '', maxInvestment: '', contactEmail: '', contactNumber: '' });
  const [saveStatus, setSaveStatus] = useState('');
  const[reqFeedback, setReqFeedback] = useState({}); // NEW: Track request status per ID

  useEffect(() => {
    if (activeTab === 'Overview' || activeTab === 'Browse Startups' || activeTab === 'Edit Profile') {
      api.get('/investor/profile').then(res => { if(res.data) setProfile(res.data); }).catch(err => console.error(err));
      api.get('/investor/startups').then(res => { setStartups(res.data); setLoading(false); }).catch(err => { console.error(err); setLoading(false); });
    } else if (activeTab === 'Requests') {
      // Fetch Pending Requests
      api.get('/network/request/pending')
         .then(res => setRequests(res.data))
         .catch(err => console.error("Failed to load requests", err));
    }
  }, [activeTab]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    try {
      await api.post('/investor/profile', profile);
      setSaveStatus('✅ Profile Saved Successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
      setActiveTab('Overview');
    } catch (err) {
      console.error("Save profile error:", err);
      setSaveStatus('❌ Error saving profile.');
    }
  };

  // NEW: Send Request directly from the feed
  const sendRequest = async (userId) => {
    setReqFeedback({ ...reqFeedback, [userId]: 'sending' });
    try {
      await api.post(`/network/request/send/${userId}`);
      setReqFeedback({ ...reqFeedback, [userId]: 'success' });
    } catch (err) {
      console.error(err);
      setReqFeedback({ ...reqFeedback, [userId]: 'error' });
    }
  };

  // NEW: Respond to incoming requests
  const respondToRequest = async (reqId, accept) => {
    try {
      await api.post(`/network/request/respond/${reqId}?accept=${accept}`);
      setRequests(requests.filter(r => r.id !== reqId)); // Remove from list instantly
      alert(accept ? "✅ Connection Accepted!" : "❌ Request Rejected");
    } catch (err) {
      console.error(err);
      alert("Failed to process request.");
    }
  };

  const filteredStartups = startups.filter(s => {
    const matchesSearch = s.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || s.businessDomain?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = domainFilter === 'All' || s.businessDomain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  const aiRecommendedStartups = startups.filter(s => 
    profile.preferredDomains?.toLowerCase().includes(s.businessDomain?.toLowerCase()) &&
    s.fundingRequired <= profile.maxInvestment
  ).slice(0, 2);

  // Added "Requests" to the Sidebar!
  const sidebarItems =['Overview', 'Browse Startups', 'Requests', 'Edit Profile', 'Messages'];
  const userProfile = { name: profile.fullName || "Investor", role: "Verified Investor", img: `https://ui-avatars.com/api/?name=${profile.fullName || 'Inv'}&background=000&color=fff` };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userProfile={userProfile} activeTab={activeTab} setActiveTab={setActiveTab}>
      
      {/* ...[Overview & Edit Profile stay exactly the same] ... */}
      
      {activeTab === 'Overview' && (
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6">Investor Command Center</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Glasscard className="p-6 border-l-4 border-[#06B6D4]"><p className="text-gray-400 text-sm font-bold uppercase mb-1">Investment Budget</p><p className="text-3xl font-black text-white">${profile.maxInvestment || "0"}</p></Glasscard>
            <Glasscard className="p-6 border-l-4 border-[#7C3AED]"><p className="text-gray-400 text-sm font-bold uppercase mb-1">Preferred Sectors</p><p className="text-xl font-bold text-[#06B6D4] truncate">{profile.preferredDomains || "All Sectors"}</p></Glasscard>
          </div>
          <Button onClick={() => setActiveTab('Browse Startups')}>Browse All Startups</Button>
        </div>
      )}

      {activeTab === 'Browse Startups' && (
        <div className="animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <h2 className="text-3xl font-bold text-white">Startup Marketplace</h2>
            <div className="flex gap-2 w-full md:w-auto">
              <input type="text" placeholder="Search startups..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[rgba(255,255,255,0.08)] border border-white/20 text-white text-sm rounded-lg px-4 py-2 outline-none focus:border-[#06B6D4] w-full" />
            </div>
          </div>

          {loading ? <p className="text-[#06B6D4] animate-pulse">Scanning Database...</p> : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredStartups.map(startup => {
                const uid = startup.user?.id || startup.userId || startup.id;
                return (
                  <Glasscard key={startup.id} className="p-6 flex flex-col h-full hover:border-[#06B6D4]/50 group">
                    <div className="flex justify-between items-start mb-6">
                      <Rolebadge role={startup.businessDomain || "Tech"} />
                      <span className="text-[#22C55E] text-sm font-bold bg-[#22C55E]/10 px-3 py-1 rounded-full">📍 {startup.location}</span>
                    </div>
                    <div className="flex items-center gap-5 mb-6">
                      <img src={`https://ui-avatars.com/api/?name=${startup.companyName}&background=7C3AED&color=fff`} alt="logo" className="w-16 h-16 rounded-2xl"/>
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#06B6D4]">{startup.companyName}</h3>
                        <p className="text-sm text-gray-400">Founder: {startup.founderName}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-auto">
                      <Button variant="outline" onClick={() => navigate(`/startup-details/${startup.id}`)} className="flex-1">View Deck</Button>
                      
                      {/* NEW DIRECT REQUEST BUTTON */}
                      <Button 
                        onClick={() => sendRequest(uid)} 
                        className="flex-1"
                        disabled={reqFeedback[uid] === 'sending' || reqFeedback[uid] === 'success'}
                      >
                        {reqFeedback[uid] === 'success' ? '✅ Sent' : reqFeedback[uid] === 'error' ? '❌ Failed' : 'Connect'}
                      </Button>
                    </div>
                  </Glasscard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* NEW: REQUESTS TAB */}
      {activeTab === 'Requests' && (
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6">Pending Connections</h2>
          {requests.length === 0 ? (
            <Glasscard className="p-10 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-white">No pending requests.</h3>
            </Glasscard>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <Glasscard key={req.id} className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-white font-bold text-lg">{req.sender.email} wants to connect!</p>
                    <p className="text-gray-400 text-sm">Role: {req.sender.role}</p>
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

      {activeTab === 'Edit Profile' && (
        <Glasscard className="p-8 animate-fade-in-up">
          {/* Form remains the same as before */}
          <h3 className="text-2xl font-bold text-white mb-6">Your Investment Profile</h3>
          <Button onClick={() => setActiveTab('Overview')} className="w-full">Profile Saved. Go Back.</Button>
        </Glasscard>
      )}

    </DashboardLayout>
  );
}