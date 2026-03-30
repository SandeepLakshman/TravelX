import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plane, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { bookingApi } from '../api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr || JSON.parse(userStr).role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getAllAdmin();
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await bookingApi.updateStatus(id, status);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  // Stats calculation
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const activeBookings = bookings.length;
  const growthRate = "+12.5%";

  return (
    <div className="bg-[#0a2e22] min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-widest uppercase flex items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-emerald-400" />
              Admin <span className="text-emerald-400">Command</span>
            </h1>
            <p className="text-emerald-100/50 font-bold text-xs mt-2 uppercase tracking-tighter">System Overview & Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchBookings} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              Refresh Data
            </button>
            <div className="bg-emerald-500 text-[#0a2e22] px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest">
              Live Connection
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
            { label: "Total Revenue", val: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: "emerald", trend: growthRate },
            { label: "Active Bookings", val: activeBookings, icon: <Plane />, color: "blue", trend: "+3 New" },
            { label: "Total Users", val: "1,240", icon: <Users />, color: "purple", trend: "+45 this week" },
            { label: "Ops Efficiency", val: "99.8%", icon: <TrendingUp />, color: "orange", trend: "0.2% Gain" }
           ].map((stat, i) => (
             <div key={i} className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:bg-white/[0.08] transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">{stat.icon}</div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 leading-none">{stat.label}</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-3xl font-black text-white tracking-tighter">{stat.val}</h3>
                   <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">{stat.trend}</span>
                </div>
             </div>
           ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
           
           {/* Tab Navigation */}
           <div className="flex items-center gap-8 px-10 py-6 border-b border-white/10 bg-white/5">
              {['Overview', 'Bookings', 'Inventory', 'Users'].map(tab => (
                 <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1' : 'text-emerald-100/30 hover:text-white'}`}
                 >
                   {tab}
                 </button>
              ))}
           </div>

           {/* BOOKINGS TABLE */}
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-black/20 text-emerald-500/50 text-[10px] font-bold uppercase tracking-widest">
                       <th className="px-10 py-5">Trip Identity</th>
                       <th className="px-6 py-5">Customer Profile</th>
                       <th className="px-6 py-5">Travel Schedule</th>
                       <th className="px-6 py-5">Transaction Summary</th>
                       <th className="px-6 py-5">Status Orchestration</th>
                       <th className="px-10 py-5 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="py-20 text-center text-teal-500 font-bold animate-pulse">Syncing encrypted data from secure servers...</td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-20 text-center text-teal-800 font-bold uppercase tracking-widest bg-white/5">No active records found in database</td>
                      </tr>
                    ) : bookings.map((booking) => (
                       <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                   {booking.type === 'FLIGHT' ? <Plane className="w-5 h-5 text-white" /> : <MapPin className="w-5 h-5 text-white" />}
                                </div>
                                <div>
                                   <p className="text-white font-black text-sm uppercase tracking-tight">{booking.title}</p>
                                   <p className="text-emerald-500/50 text-[10px] font-black uppercase">Ref: #{booking.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-8">
                             <p className="text-white font-bold">{booking.email?.split('@')[0]}</p>
                             <p className="text-teal-200/40 text-xs">{booking.email}</p>
                          </td>
                          <td className="px-6 py-8">
                             <div className="flex items-center gap-2 text-white font-bold">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                {booking.date}
                             </div>
                             <p className="text-teal-200/40 text-xs font-bold mt-1 uppercase">{booking.persons} Passengers</p>
                          </td>
                          <td className="px-6 py-8">
                             <p className="text-xl font-black text-white tracking-tighter">₹{booking.price?.toLocaleString()}</p>
                             <p className="text-emerald-500 text-[10px] font-black uppercase">Paid via Gateway</p>
                          </td>
                          <td className="px-6 py-8">
                             <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                Confirmed
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center justify-end gap-2">
                                <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all">
                                   <CheckCircle className="w-4 h-4" />
                                </button>
                                <button className="p-3 bg-white/5 hover:bg-red-500/20 text-red-400 rounded-xl border border-white/10 transition-all">
                                   <XCircle className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
