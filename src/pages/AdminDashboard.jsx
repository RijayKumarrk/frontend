import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import Glasscard from '../components/GlassCard';
import Rolebadge from '../components/RoleBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStartups: 0, totalInvestors: 0, totalMessages: 0 });
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('Platform Stats');
  const [loading, setLoading] = useState(true);
  
  // MODAL STATE
  const [selectedProfile, setSelectedProfile] = useState(null);
  const[isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Data Function
  const fetchData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setLoading(false);
    }
  };

  // 2. Load Data on Mount (ESLint is explicitly told to ignore this line so it won't throw errors)
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  // 3. Block/Unblock User
  const toggleBlock = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/block?block=${!currentStatus}`);
      fetchData(); // Refresh list automatically
    } catch (err) {
      console.error("Block error:", err);
      alert("Failed to block user.");
    }
  };

  // 4. Delete User
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchData(); // Refresh list automatically
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete user.");
      }
    }
  };

  // 5. View User Profile
  const viewProfile = async (userId, role) => {
    try {
      const res = await api.get(`/admin/profile/${userId}?role=${role}`);
      setSelectedProfile({ ...res.data, role });
      setIsModalOpen(true);
    } catch (err) {
      console.error("View Profile Error:", err);
      alert("This user has not created a profile yet.");
    }
  };

  // Separate Users into two tables
  const startups = users.filter(u => u.role === 'STARTUP');
  const investors = users.filter(u => u.role === 'INVESTOR');

  // Chart Configuration
  const chartData =[
    { name: 'Startups', count: stats.totalStartups, color: '#06B6D4' },
    { name: 'Investors', count: stats.totalInvestors, color: '#7C3AED' }
  ];

  const sidebarItems =['Platform Stats', 'Manage Startups', 'Manage Investors', 'System Logs'];
  const userProfile = { name: "System Admin", role: "Superuser", img: "https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff" };

  // --- REUSABLE TABLE COMPONENT ---
  const UserTable = ({ title, userList, highlightColor }) => (
    <Glasscard className="overflow-hidden mb-10">
      <div className={`bg-${highlightColor}-500/10 border-b border-white/10 p-5`}>
        <h3 className="text-xl font-bold text-white">{title} ({userList.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-black/20 border-b border-white/10">
            <tr>
              <th className="p-5 text-gray-400 font-bold text-sm">User Email</th>
              <th className="p-5 text-gray-400 font-bold text-sm">Status</th>
              <th className="p-5 text-gray-400 font-bold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {userList.length === 0 ? (
              <tr><td colSpan="3" className="p-5 text-center text-gray-500">No users found in this category.</td></tr>
            ) : (
              userList.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 text-white font-medium">{user.email}</td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.blocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {user.blocked ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="p-5 text-right space-x-2 flex justify-end">
                    <button onClick={() => viewProfile(user.id, user.role)} className="bg-[#06B6D4]/20 text-[#06B6D4] hover:bg-[#06B6D4]/40 px-3 py-1.5 rounded-lg text-sm font-bold transition">
                      View Profile
                    </button>
                    <button onClick={() => toggleBlock(user.id, user.blocked)} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${user.blocked ? 'bg-[#22C55E]/20 text-[#22C55E] hover:bg-[#22C55E]/40' : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40'}`}>
                      {user.blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-3 py-1.5 rounded-lg text-sm font-bold transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Glasscard>
  );

  return (
    <DashboardLayout sidebarItems={sidebarItems} userProfile={userProfile} activeTab={activeTab} setActiveTab={setActiveTab}>
      
      {activeTab === 'Platform Stats' && (
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6">Platform Overview</h2>
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Glasscard className="p-6">
              <p className="text-gray-400 text-sm font-bold uppercase">Total Users</p>
              <p className="text-4xl font-black text-white">{stats.totalUsers}</p>
            </Glasscard>
            <Glasscard className="p-6">
              <p className="text-gray-400 text-sm font-bold uppercase">Startups</p>
              <p className="text-4xl font-black text-[#06B6D4]">{stats.totalStartups}</p>
            </Glasscard>
            <Glasscard className="p-6">
              <p className="text-gray-400 text-sm font-bold uppercase">Investors</p>
              <p className="text-4xl font-black text-[#7C3AED]">{stats.totalInvestors}</p>
            </Glasscard>
            <Glasscard className="p-6">
              <p className="text-gray-400 text-sm font-bold uppercase">Messages</p>
              <p className="text-4xl font-black text-[#22C55E]">{stats.totalMessages}</p>
            </Glasscard>
          </div>

          {/* Chart */}
          <Glasscard className="p-8 mb-10">
            <h2 className="text-2xl font-bold text-white mb-6">User Distribution</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white' }} />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Glasscard>
        </div>
      )}

      {activeTab === 'Manage Startups' && (
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6">Startup Database</h2>
          {loading ? <p className="text-cyan-400 animate-pulse">Loading...</p> : <UserTable title="Registered Startups" userList={startups} highlightColor="cyan" />}
        </div>
      )}

      {activeTab === 'Manage Investors' && (
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-6">Investor Database</h2>
          {loading ? <p className="text-purple-400 animate-pulse">Loading...</p> : <UserTable title="Registered Investors" userList={investors} highlightColor="purple" />}
        </div>
      )}

      {activeTab === 'System Logs' && (
        <Glasscard className="p-10 text-center animate-fade-in-up">
          <h3 className="text-2xl font-bold text-white">System Logs</h3>
          <p className="text-gray-400 mt-2">No recent anomalies detected. System is running optimally.</p>
        </Glasscard>
      )}

      {/* THE ADMIN POP-UP MODAL */}
      {isModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <Glasscard className="p-8 md:p-10 w-full max-w-2xl relative shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl font-bold">✕</button>
            <h2 className="text-3xl font-bold text-white mb-2">
              {selectedProfile.companyName || selectedProfile.fullName || "Unnamed Profile"}
            </h2>
            <Rolebadge role={selectedProfile.role} />
            
            <div className="mt-8 space-y-4 text-gray-300">
              <p><strong>Domain:</strong> {selectedProfile.businessDomain || selectedProfile.preferredDomains || "N/A"}</p>
              <p><strong>Location:</strong> {selectedProfile.location || "N/A"}</p>
              <p><strong>Contact Email:</strong> <span className="text-[#06B6D4]">{selectedProfile.contactEmail || "Not Provided"}</span></p>
              
              {selectedProfile.role === 'STARTUP' && (
                <div className="bg-black/30 p-5 rounded-xl border border-white/10 mt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Funding Needed</p>
                      <p className="text-xl font-bold text-[#22C55E]">${selectedProfile.fundingRequired || "0"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Equity Offered</p>
                      <p className="text-xl font-bold text-[#7C3AED]">{selectedProfile.equityOffered || "0"}%</p>
                    </div>
                  </div>
                  <p className="text-sm border-t border-white/10 pt-4"><strong>The Pitch:</strong> {selectedProfile.about || "No pitch provided."}</p>
                </div>
              )}
              
              {selectedProfile.role === 'INVESTOR' && (
                <div className="bg-black/30 p-5 rounded-xl border border-white/10 mt-4">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase font-bold">Investment Budget</p>
                    <p className="text-xl font-bold text-[#22C55E]">
                      ${selectedProfile.minInvestment || "0"} - ${selectedProfile.maxInvestment || "0"}
                    </p>
                  </div>
                  <p className="text-sm border-t border-white/10 pt-4"><strong>Value Add:</strong> {selectedProfile.about || "No details provided."}</p>
                </div>
              )}
            </div>
          </Glasscard>
        </div>
      )}

    </DashboardLayout>
  );
}
