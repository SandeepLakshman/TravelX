import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, Phone, Mail, ShieldCheck, Star, User, Plane } from 'lucide-react';
import { tourApi, flightApi, bookingApi } from '../api';
import { showAppToast } from '../Components/Toast';

const BookingPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [travelers, setTravelers] = useState(1);

  useEffect(() => {
    const fetchTourAndFlights = async () => {
      setLoading(true);
      try {
        const tourRes = await tourApi.getAll();
        const tourData = tourRes.data;
        const selectedTour = tourData.find(t => t.id === parseInt(tourId));
        setTour(selectedTour);

        if (selectedTour) {
          const destCode = selectedTour.location.includes('Indonesia') ? 'DPS' : 
                           selectedTour.location.includes('Switzerland') ? 'ZRH' : 
                           selectedTour.location.includes('Japan') ? 'HND' : 'BOM';
          
          const flightRes = await flightApi.search('DEL', destCode, '', 1);
          const flightData = flightRes.data;
          setAvailableFlights(Array.isArray(flightData) ? flightData : (flightData.data || []));
          setSelectedFlight(Array.isArray(flightData) ? flightData[0] : (flightData.data?.[0] || null));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTourAndFlights();
  }, [tourId]);

  const handleBooking = async () => {
    if (!selectedFlight) {
        showAppToast("Please select a flight first.", 'error');
        return;
    }
    
    setIsSubmitting(true);
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    const booking = {
      name: storedUser?.name || "Guest",
      email: storedUser?.email || "guest@example.com",
      date: new Date().toISOString().split('T')[0],
      persons: travelers,
      flightNumber: selectedFlight.flight?.number || "UK123",
      airline: selectedFlight.airline?.name || selectedFlight.airline || "Charter",
      departureIata: selectedFlight.departure?.iata || "DEL",
      arrivalIata: selectedFlight.arrival?.iata || "BOM",
      tourTitle: tour.title,
      totalPrice: tour.price * travelers + ((selectedFlight.price || 0) * travelers),
      passengersData: "[]"
    };

    try {
      await bookingApi.create(booking);
      showAppToast("Reservation Confirmed Successfully!", 'success');
      navigate('/my-trips');
    } catch (err) {
      console.error("Booking failed:", err);
      showAppToast(err.response?.data || "Error processing your reservation.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] flex items-center justify-center pt-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="bg-[var(--color-brand-bg)] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left: Tour Details */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-[var(--color-brand-card!)] bg-teal-900/10 border border-teal-800/50 rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="h-96 relative">
                        <img src={tour?.image} alt={tour?.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f3d2e] via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-10 left-10">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-sm mb-2">
                                <MapPin className="w-4 h-4" /> {tour?.location}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{tour?.title}</h1>
                        </div>
                    </div>
                </div>

                {/* Flight Selection Component */}
                <div className="bg-[var(--color-brand-card)] border border-teal-800/50 rounded-[40px] p-10 shadow-2xl">
                   <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                      <Plane className="w-8 h-8 text-emerald-500" /> RECOMMENDED FLIGHTS
                   </h2>
                   <div className="space-y-4">
                      {availableFlights.length > 0 ? availableFlights.slice(0,3).map((f, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelectedFlight(f)}
                          className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between group ${selectedFlight === f ? 'border-emerald-500 bg-emerald-500/10' : 'border-teal-800 hover:border-emerald-500/30'}`}
                        >
                           <div className="flex items-center gap-6">
                              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center p-2">
                                 <Plane className="text-emerald-600 h-6 w-6" />
                              </div>
                              <div>
                                 <p className="text-white font-bold text-lg">{f.airline?.name || f.airline || 'Charter'}</p>
                                 <p className="text-teal-400 text-xs font-black uppercase tracking-widest leading-none mt-1">{f.flight?.number || 'UK12' + i}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-black text-white">₹{f.price?.toLocaleString('en-IN') || '4,500'}</p>
                              <p className="text-[10px] text-teal-500 font-bold uppercase tracking-tighter">Per Adult</p>
                           </div>
                        </div>
                      )) : (
                        <div className="text-teal-400 font-bold p-8 bg-teal-900/20 rounded-3xl border border-teal-800/40 text-center">
                           Scanning live airspace for deals...
                        </div>
                      )}
                   </div>
                </div>
            </div>

            {/* Right: Booking Summary / Checkout Box */}
            <div className="lg:col-span-1">
                <div className="bg-emerald-600 rounded-[40px] p-10 shadow-2xl shadow-emerald-600/20 sticky top-28 border border-white/10">
                   <h3 className="text-2xl font-black text-white mb-8 pb-4 border-b border-white/20 uppercase tracking-tighter">Booking Summary</h3>
                   
                   <div className="space-y-6 mb-10 text-white">
                      <div className="flex justify-between items-center group/item">
                         <span className="text-emerald-100 font-bold flex items-center gap-2 text-sm uppercase tracking-widest"><Users className="w-4 h-4" /> Travelers</span>
                         <div className="flex items-center gap-4 bg-white/10 px-3 py-1.5 rounded-2xl border border-white/10">
                            <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="hover:text-emerald-300 font-black text-lg">-</button>
                            <span className="font-black text-lg w-6 text-center">{travelers}</span>
                            <button onClick={() => setTravelers(travelers + 1)} className="hover:text-emerald-300 font-black text-lg">+</button>
                         </div>
                      </div>
                      <div className="w-full h-px bg-white/10"></div>
                      <div className="flex justify-between items-center group/item">
                         <span className="text-emerald-100 font-bold uppercase tracking-widest text-[10px]">Base Fare ({tour.title})</span>
                         <span className="font-black text-lg">₹{(tour.price * travelers).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center group/item">
                         <span className="text-emerald-100 font-bold uppercase tracking-widest text-[10px]">Flight Add-on</span>
                         <span className="font-black text-lg">₹{((selectedFlight?.price || 0) * travelers).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-white/20 border-dashed">
                         <span className="text-xl font-black uppercase">GRAND TOTAL</span>
                         <span className="text-3xl font-black">₹{((tour.price + (selectedFlight?.price || 0)) * travelers).toLocaleString('en-IN')}</span>
                      </div>
                   </div>

                   <button 
                     onClick={handleBooking}
                     disabled={isSubmitting}
                     className="w-full bg-slate-950 hover:bg-black text-white font-black py-5 rounded-[26px] text-lg transition-all shadow-xl active:scale-95 disabled:bg-slate-900 flex items-center justify-center gap-3"
                   >
                     {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     ) : (
                        <>PROCEED TO RESERVE <ShieldCheck className="w-6 h-6 text-emerald-400" /></>
                     )}
                   </button>
                   <p className="text-emerald-900/60 text-[10px] text-center mt-6 font-black uppercase tracking-tighter">Immediate confirmation • Best price guaranteed</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;