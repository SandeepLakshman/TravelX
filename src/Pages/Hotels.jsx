import React, { useState } from 'react';
import HotelCard from '../Components/HotelCard';
import { allHotels } from '../data/travelData';
import { Building, Filter, Search, MapPin } from 'lucide-react';

const Hotels = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredHotels = allHotels.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-20 overflow-hidden relative">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1455587734955-081b22074882?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-4">
              <Building className="w-3.5 h-3.5" /> Luxury Accommodations
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">
              Premium <br/><span className="text-emerald-400">Emerald Stay</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl font-medium">
              Curating the world's most prestigious hotels and resorts for the discerning traveler.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search city or hotel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 bg-white border border-slate-200 rounded-3xl py-5 pl-12 pr-6 outline-none focus:border-emerald-500 transition-all shadow-lg text-slate-900 font-bold"
                />
             </div>
             <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 px-10 rounded-3xl transition-all shadow-xl shadow-emerald-600/20">
                <Filter className="w-5 h-5" /> Filter Stays
             </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center gap-4 mb-8">
           <div className="flex -space-x-3">
              {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-50 overflow-hidden shadow-md">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
                 </div>
              ))}
           </div>
           <p className="text-slate-500 font-bold text-sm tracking-tight">Join <span className="text-slate-900">4,000+ members</span> booking premium stays this month.</p>
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}

          {filteredHotels.length === 0 && (
            <div className="col-span-full py-20 text-center animate-fade-in">
               <MapPin className="w-20 h-20 text-slate-200 mx-auto mb-6" />
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">No stays found in that orbit</h3>
               <p className="text-slate-500 font-medium">Try searching for Singapore, Mumbai, or Dubai.</p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-32 pt-20 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="space-y-4">
              <h4 className="text-xl font-bold text-slate-900">Best Price Guarantee</h4>
              <p className="text-slate-500 font-medium text-sm">Find a lower price elsewhere and we'll beat it by 10% for our premium members.</p>
           </div>
           <div className="space-y-4">
              <h4 className="text-xl font-bold text-slate-900">Smart Concierge</h4>
              <p className="text-slate-500 font-medium text-sm">AI-powered 24/7 concierge service at every hotel in our Emerald collection.</p>
           </div>
           <div className="space-y-4">
              <h4 className="text-xl font-bold text-slate-900">Elite Rewards</h4>
              <p className="text-slate-500 font-medium text-sm">Earn double Emerald Points on every luxury hotel booking made this quarter.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Hotels;
