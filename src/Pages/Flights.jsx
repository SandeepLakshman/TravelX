import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Clock, ShieldCheck, Sparkles, Filter, ChevronLeft, ChevronRight, Zap, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { flightApi } from '../api';
import { allFlights } from '../data/travelData';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);
  const [selectedAirline, setSelectedAirline] = useState('All');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('All');
  const [sortBy, setSortBy] = useState('cheapest');
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get('from') || 'DEL';
  const to = queryParams.get('to') || 'BOM';
  const urlDate = queryParams.get('date') || '2026-03-31';
  const passengers = queryParams.get('passengers') || '1'; 
  
  const [currentDate, setCurrentDate] = useState(urlDate);

  const setDateInQuery = (newDateStr) => {
    setCurrentDate(newDateStr);
    navigate(`?from=${from}&to=${to}&date=${newDateStr}&passengers=${passengers}`, { replace: true });
  };

  useEffect(() => {
    const fetchFlights = async () => {
      let flightsData = [];
      try {
        setLoading(true);
        const result = await flightApi.search(from, to, currentDate, passengers);
        
        let rawData = Array.isArray(result.data) ? result.data : (result.data?.data || result.data?.flights || []);
        
        flightsData = rawData.map((f, i) => {
          if (f.airline && typeof f.airline === 'object') {
            const depTime = f.departure?.scheduled ? new Date(f.departure.scheduled).toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute:'2-digit'}) : "08:00";
            const arrTime = f.arrival?.scheduled ? new Date(f.arrival.scheduled).toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute:'2-digit'}) : "10:30";
            return {
              id: f.flight?.number || 'UK12' + i,
              airline: f.airline?.name || 'Airlines',
              price: (Math.floor(Math.random() * 50) + 30) * 100, 
              departure: depTime,
              arrival: arrTime,
              duration: 150,
              tag: null
            };
          }
          return f;
        });
      } catch (err) {
        console.error("Backend unreachable or error. Using local fallback.");
      } finally {
        const searchFrom = (from || '').toUpperCase();
        const searchTo = (to || '').toUpperCase();
        
        // If API returned 0 or very few results, supplement with mock data for a better UX
        if (flightsData.length < 3) {
          const mockData = allFlights.filter(f => 
            (f.from === searchFrom || !searchFrom) && (f.to === searchTo || !searchTo)
          );
          
          // Merge avoiding duplicates (by ID)
          const existingIds = new Set(flightsData.map(f => f.id));
          const supplementary = mockData.filter(f => !existingIds.has(f.id));
          flightsData = [...flightsData, ...supplementary];

          if (flightsData.length === 0) {
            console.log("No specific route found, showing default DEL-BOM demo flights.");
            flightsData = allFlights.filter(f => f.from === 'DEL' && f.to === 'BOM');
          }
        }
        
        if (flightsData.length > 0) {
          // Add tag logic
          let cheapest = flightsData[0];
          let fastest = flightsData[0];
          let best = flightsData[0];
          let lowestScore = Infinity;

          flightsData.forEach(flight => {
            if (flight.price < cheapest.price) cheapest = flight;
            if (flight.duration < fastest.duration) fastest = flight;
            const score = (flight.price * 0.7) + (flight.duration * 0.3);
            if (score < lowestScore) {
              lowestScore = score;
              best = flight;
            }
          });

          flightsData = flightsData.map(flight => {
            let tag = null;
            if (flight === best) tag = "AI RECOMMENDED";
            else if (flight === cheapest) tag = "CHEAPEST";
            else if (flight === fastest) tag = "FASTEST";
            return { ...flight, tag };
          });

          setAiInsight({
            message: `This search is based on the ${currentDate} schedule. Recommended flights offer the best value.`
          });
        }
        setFlights(flightsData);
        setLoading(false);
      }
    };
    fetchFlights();
  }, [from, to, currentDate, passengers]);

  const airlines = ['All', ...new Set(flights.map(f => f.airline))];

  const sortedAndFilteredFlights = React.useMemo(() => {
    let result = flights.filter(f => selectedAirline === 'All' || f.airline === selectedAirline);
    
    // Time filtering
    if (selectedTimeSlot !== 'All') {
      result = result.filter(f => {
        const hour = parseInt(f.departure.split(':')[0]);
        if (selectedTimeSlot === 'Early Morning') return hour < 6;
        if (selectedTimeSlot === 'Morning') return hour >= 6 && hour < 12;
        if (selectedTimeSlot === 'Afternoon') return hour >= 12 && hour < 18;
        if (selectedTimeSlot === 'Night') return hour >= 18;
        return true;
      });
    }

    if (sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'fastest') {
      result.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'prefer') {
      // AI Recommended: balance price and duration, prioritize 'AI RECOMMENDED' tag
      result.sort((a, b) => {
        if (a.tag === 'AI RECOMMENDED') return -1;
        if (b.tag === 'AI RECOMMENDED') return 1;
        return (a.price / a.duration) - (b.price / b.duration);
      });
    }
    return result;
  }, [flights, selectedAirline, sortBy, selectedTimeSlot]);

  return (
    <div className="bg-[var(--color-brand-bg)] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sticky Header Info */}
        <div className="bg-teal-900/40 backdrop-blur-md rounded-2xl border border-teal-800 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] font-black text-teal-500 uppercase">Trip Type</p>
              <p className="text-white font-bold text-sm">One Way</p>
            </div>
            <div className="w-px h-8 bg-teal-800"></div>
            <div>
              <p className="text-[10px] font-black text-teal-500 uppercase">From</p>
              <p className="text-white font-bold text-sm">{from}</p>
            </div>
            <div className="p-1 bg-teal-800 rounded-full">
              <ArrowRight className="h-3 w-3 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-teal-500 uppercase">To</p>
              <p className="text-white font-bold text-sm">{to}</p>
            </div>
            <div className="w-px h-8 bg-teal-800"></div>
            <div>
              <p className="text-[10px] font-black text-teal-500 uppercase">Depart</p>
              <p className="text-white font-bold text-sm">{currentDate}</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-emerald-600/20">
            Modify Search
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR FILTERS */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-[var(--color-brand-card)] border border-teal-900/50 rounded-2xl p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button onClick={() => { setSelectedAirline('All'); setSelectedTimeSlot('All'); }} className="text-xs font-bold text-emerald-400 uppercase hover:underline">Clear All</button>
              </div>

              {/* Airlines */}
              <div className="mb-8">
                <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-4">Airlines</p>
                <div className="space-y-3">
                  {airlines.map(airline => (
                    <label key={airline} className="flex items-center gap-2 text-sm text-teal-100/80 cursor-pointer hover:text-white group">
                      <input 
                        type="radio" 
                        name="airline" 
                        checked={selectedAirline === airline} 
                        onChange={() => setSelectedAirline(airline)}
                        className="accent-emerald-500 h-4 w-4" 
                      />
                      {airline}
                    </label>
                  ))}
                </div>
              </div>

              {/* Times */}
              <div>
                <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-4">Departure Time</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { slot: 'Early Morning', icon: '🌅' },
                    { slot: 'Morning', icon: '☀️' },
                    { slot: 'Afternoon', icon: '🌤️' },
                    { slot: 'Night', icon: '🌙' }
                  ].map(t => (
                    <div 
                      key={t.slot} 
                      onClick={() => setSelectedTimeSlot(selectedTimeSlot === t.slot ? 'All' : t.slot)}
                      className={`border rounded-xl p-2 text-center cursor-pointer transition-colors group relative z-10 ${selectedTimeSlot === t.slot ? 'border-emerald-500 bg-emerald-500/10' : 'border-teal-800 hover:border-emerald-500'}`}
                    >
                      <span className="text-lg block mb-1">{t.icon}</span>
                      <span className={`text-[9px] font-bold ${selectedTimeSlot === t.slot ? 'text-white' : 'text-teal-200 group-hover:text-white'}`}>{t.slot}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN RESULTS AREA */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Sorting Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-teal-900/30 p-1 rounded-2xl border border-teal-800">
               <button onClick={() => setSortBy('cheapest')} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${sortBy === 'cheapest' ? 'bg-emerald-600 text-white shadow-lg' : 'text-teal-400 hover:bg-teal-800'}`}>
                 <DollarSign className="h-4 w-4" /> CHEAPEST
               </button>
               <button onClick={() => setSortBy('fastest')} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${sortBy === 'fastest' ? 'bg-emerald-600 text-white shadow-lg' : 'text-teal-400 hover:bg-teal-800'}`}>
                 <Zap className="h-4 w-4" /> FASTEST
               </button>
               <button onClick={() => setSortBy('prefer')} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${sortBy === 'prefer' ? 'bg-emerald-600 text-white shadow-lg' : 'text-teal-400 hover:bg-teal-800'}`}>
                 <TrendingUp className="h-4 w-4" /> AI RECOMMENDED
               </button>
            </div>

            {/* Flight Results */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-4"></div>
                <p className="text-teal-100 animate-pulse font-medium">Analyzing real-time flight data...</p>
              </div>
            ) : sortedAndFilteredFlights.length === 0 ? (
              <div className="text-center py-20 bg-[var(--color-brand-card)] rounded-3xl border border-teal-900/50">
                 <Plane className="h-16 w-16 text-emerald-500/50 mx-auto mb-4" />
                 <h2 className="text-2xl font-bold mb-2 text-white">No Flights Found</h2>
                 <p className="text-teal-400 text-sm">Try clearing filters or changing cities.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedAndFilteredFlights.map((flight, index) => (
                  <div key={index} className={`bg-[var(--color-brand-card)] border ${flight.tag === 'AI RECOMMENDED' ? 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-teal-800'} hover:border-emerald-500/50 rounded-2xl p-6 transition-all shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 group overflow-hidden relative`}>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      {/* Airline Info */}
                      <div className="w-full md:w-1/4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
                          <Plane className="text-emerald-600 h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg leading-tight">{flight.airline}</h3>
                          <p className="text-teal-500 text-[10px] font-black uppercase tracking-widest">{flight.id || 'UK123'}</p>
                        </div>
                      </div>

                      {/* Timings */}
                      <div className="w-full md:w-2/4 flex items-center justify-between px-4">
                        <div className="text-left">
                          <p className="text-2xl font-black text-white">{flight.departure}</p>
                          <p className="text-teal-200/50 text-xs font-bold">{from}</p>
                        </div>
                        
                        <div className="flex-grow flex flex-col items-center px-4">
                          <p className="text-teal-200/40 text-[10px] font-black mb-1">{Math.floor(flight.duration / 60)}h {flight.duration % 60}m</p>
                          <div className="w-full h-0.5 bg-teal-800 relative flex justify-center items-center rounded-full">
                             <div className="absolute w-2 h-2 bg-teal-700 rounded-full -left-1"></div>
                             <Plane className="h-3 w-3 text-emerald-500 absolute bg-[var(--color-brand-card)] px-0.5" />
                             <div className="absolute w-2 h-2 bg-teal-700 rounded-full -right-1"></div>
                          </div>
                          <p className="text-teal-600 text-[9px] font-bold mt-1 uppercase tracking-tighter">Non Stop</p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-white">{flight.arrival}</p>
                          <p className="text-teal-200/50 text-xs font-bold">{to}</p>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="w-full md:w-1/4 flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-teal-800/50 pt-4 md:pt-0">
                        <div className="text-right">
                           {flight.tag && (
                            <div className="flex items-center gap-1 justify-end mb-1">
                              <Sparkles className="h-3 w-3 text-emerald-400" />
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tighter">{flight.tag}</span>
                            </div>
                           )}
                           <p className="text-3xl font-black text-white">₹{flight.price.toLocaleString('en-IN')}</p>
                           <p className="text-[10px] text-teal-500 font-bold uppercase tracking-tighter">Per Adult</p>
                        </div>
                        <button onClick={() => navigate(`/book-flight/${flight.id || 'FLIGHT'}`, { state: { flight, from, to, date: currentDate, passengers } })} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-8 rounded-full transition-all shadow-lg hover:shadow-emerald-500/30 mt-0 md:mt-3 uppercase text-xs tracking-widest">
                          View Prices
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flights;