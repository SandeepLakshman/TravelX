import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Globe, Sparkles, ShieldCheck, MessageSquare } from 'lucide-react';
import TourCard from '../Components/TourCard';
import HotelCard from '../Components/HotelCard';
import { allTours, allHotels } from '../data/travelData';

const Home = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');

  const handleSearch = (e) => {
    e.preventDefault();
    if (from && to && date && passengers) {
      navigate(`/flights?from=${from.toUpperCase()}&to=${to.toUpperCase()}&date=${date}&passengers=${passengers}`);
    } else {
      alert("Please fill in all search fields.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)]">
      
      {/* Hero Section */}
      <div className="relative h-[80vh] md:h-[650px] w-full mt-[-64px]">
        {/* Background Image Setup */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Beautiful landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f3d2e]/60 bg-gradient-to-b from-transparent to-[#0f3d2e] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-bg)] via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white text-center tracking-tight mb-4 drop-shadow-2xl">
            Where to <span className="text-emerald-400">next?</span>
          </h1>
          <p className="text-lg md:text-xl text-teal-50 max-w-2xl text-center mb-10 drop-shadow-md font-medium">
            Discover exclusive deals on hotels, flights, and curated holiday packages worldwide.
          </p>

          {/* Search Widget - Compact Glassmorphic */}
          <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 transform translate-y-8 border border-white/20">
            
            <div className="flex-[1.5] w-full bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 transition-colors cursor-text group relative">
              <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 block">From / To</label>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="flex items-center w-full">
                  <MapPin className="h-4 w-4 text-emerald-500 mr-2" />
                  <input type="text" placeholder="From (DEL)" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-transparent border-none outline-none text-white font-semibold w-full text-sm placeholder-slate-500" />
                  <div className="hidden md:block w-px h-5 bg-white/20 mx-3"></div>
                  <MapPin className="h-4 w-4 text-emerald-500 mr-2" />
                  <input type="text" placeholder="To (BOM)" value={to} onChange={(e) => setTo(e.target.value)} className="bg-transparent border-none outline-none text-white font-semibold w-full text-sm placeholder-slate-500" />
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-white/10"></div>

            {/* Date Input */}
            <div className="flex-1 w-full bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 transition-colors cursor-pointer group">
              <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 block">Travel Date</label>
              <div className="flex items-center w-full">
                <Calendar className="h-5 w-5 text-emerald-500 mr-2" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent border-none outline-none text-white font-semibold w-full text-lg placeholder-slate-500 cursor-pointer" />
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-white/10"></div>

            {/* Travelers Input */}
            <div className="flex-1 w-full bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 transition-colors cursor-pointer group">
              <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 block">Travelers</label>
              <div className="flex items-center w-full">
                <Users className="h-5 w-5 text-emerald-500 mr-2" />
                <input type="number" min="1" placeholder="Pax" value={passengers} onChange={(e) => setPassengers(e.target.value)} className="bg-transparent border-none outline-none text-white font-semibold w-full text-lg placeholder-slate-500" />
              </div>
            </div>

            {/* Search Button */}
            <button onClick={handleSearch} className="w-full md:w-32 h-[72px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-20">
        
        {/* Value Props / Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24">
          {[
            { icon: <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Globe className="w-8 h-8 text-emerald-400" /></div>, title: "Worldwide Coverage", desc: "Over 1.2M Hotels" },
            { icon: <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><Sparkles className="w-8 h-8 text-emerald-400" /></div>, title: "Premium Experience", desc: "Top-rated tours" },
            { icon: <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><ShieldCheck className="w-8 h-8 text-emerald-400" /></div>, title: "Secure Booking", desc: "100% Safe" },
            { icon: <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"><MessageSquare className="w-8 h-8 text-emerald-400" /></div>, title: "24/7 Support", desc: "Always here for you" }
          ].map((item, i) => (
            <div key={i} className="bg-[var(--color-brand-card)] rounded-3xl p-8 flex flex-col items-center text-center border border-teal-900/50 hover:border-emerald-500/30 transition-all duration-300 shadow-xl group hover:-translate-y-2">
              <div className="mb-6 transform group-hover:scale-110 transition-transform">{item.icon}</div>
              <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
              <p className="text-teal-200/60 text-sm font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Popular Destinations */}
        <div>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Popular <span className="text-emerald-400">Destinations</span></h2>
              <p className="text-teal-100/70 text-lg">Handpicked experiences from around the globe</p>
            </div>
            <Link to="/tours" className="hidden md:flex items-center text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
              View All Tours <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTours && allTours.slice(0, 3).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>

        {/* Featured Elite Stays */}
        <div className="mt-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-4">
                 Luxury Collection
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Elite <span className="text-emerald-400">Accommodations</span></h2>
              <p className="text-teal-100/60 text-lg font-medium mt-2">The world's most prestigious stays, curated just for you.</p>
            </div>
            <Link to="/hotels" className="hidden md:flex items-center text-emerald-400 hover:text-emerald-300 font-black text-sm uppercase tracking-widest transition-colors mb-2">
              Explore All Stays <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {allHotels && allHotels.slice(0, 3).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>

      </div>

      {/* Footer minimal */}
      <footer className="bg-[#0a2e22] border-t border-teal-900/50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg">
          <div className="flex items-center justify-center gap-2 mb-6 text-2xl font-black text-white">
            Travel<span className="text-emerald-500">X</span>
          </div>
          <p className="text-teal-200/50 font-medium">© 2026 TravelX Inc. All rights reserved. Your premium travel partner.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;