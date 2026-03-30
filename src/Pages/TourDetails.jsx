import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Calendar, Shield, CreditCard, ChevronLeft, Star, Heart, Share2 } from 'lucide-react';
import api from '../api';

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await api.get(`/tours/${id}`);
        setTour(res.data);
      } catch (err) {
        console.error("Error fetching tour:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
    window.scrollTo(0, 0);
  }, [id]);

  const handleBooking = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    setBookingLoading(true);
    try {
      const res = await api.post('/bookings', {
        name: user.name,
        email: user.email,
        tourTitle: tour.title,
        date: new Date().toISOString(),
        persons: 1,
        totalPrice: Number(tour.price)
      });
      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-bg)]">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-bg)] text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Tour Not Found</h2>
        <button onClick={() => navigate('/tours')} className="text-emerald-400 hover:underline">Back to Tours</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] pt-24 pb-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-100/60 hover:text-emerald-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Explorer</span>
          </button>
          <div className="flex gap-4">
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transform transition active:scale-95">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transform transition active:scale-95">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Hero Image */}
            <div className="relative group overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={tour.imageUrl || "https://images.unsplash.com/photo-1544735049-717bd2df25f3?w=1200"} 
                alt={tour.title}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-bg)] via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-emerald-500/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</span>
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-white">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    4.9 (1.2k Reviews)
                  </span>
                </div>
                <h1 className="text-5xl font-black mb-2 tracking-tight">{tour.title}</h1>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>{tour.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Clock, label: "Duration", val: `${tour.duration} Days` },
                { icon: Users, label: "Max People", val: "15 Persons" },
                { icon: MapPin, label: "Destinations", val: "4 Major Stops" },
                { icon: Calendar, label: "Next Trip", val: "Available" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-lg hover:border-emerald-500/30 transition-colors">
                  <stat.icon className="w-6 h-6 text-emerald-400 mb-3" />
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                  <p className="text-white font-bold mt-1">{stat.val}</p>
                </div>
              ))}
            </div>

            {/* Description section */}
            <div className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">Experience Details</h2>
              <p className="text-lg text-emerald-100/70 leading-relaxed font-medium">
                {tour.description || "Embark on an unforgettable journey through the most spectacular landscapes. This curated experience offers a perfect blend of luxury and adventure. Every detail has been meticulously planned to ensure your trip is as seamless as it is breathtaking."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Private Guided Tours', 'Premium Transportation', '5-Star Accommodations', 'Selected Meal Plans'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="font-semibold text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
              
              {/* Main Booking Card */}
              <div className="bg-white/10 border border-white/20 p-8 rounded-[40px] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-baseline justify-between mb-8">
                  <div>
                    <p className="text-white/50 text-xs font-black uppercase tracking-[0.2em] mb-1">Starting from</p>
                    <p className="text-5xl font-black text-white">
                      ₹{Number(tour.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    <p className="text-xs font-bold text-emerald-400">-15% Offer</p>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                   <div className="p-4 bg-black/20 rounded-2xl border border-white/10">
                      <p className="text-emerald-400 text-[10px] font-black uppercase mb-1">Trip Date</p>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span>Check available dates</span>
                        <Calendar className="w-4 h-4" />
                      </div>
                   </div>
                   <div className="p-4 bg-black/20 rounded-2xl border border-white/10">
                      <p className="text-emerald-400 text-[10px] font-black uppercase mb-1">Guests</p>
                      <div className="flex justify-between items-center text-sm font-bold font-black">
                        <span>1 Adult</span>
                        <Users className="w-4 h-4" />
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleBooking}
                  disabled={bookingLoading || success}
                  className={`w-full py-5 rounded-3xl font-black text-lg shadow-xl transform transition-all active:scale-95 flex items-center justify-center gap-3 ${
                    success 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25'
                  }`}
                >
                  {bookingLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : success ? (
                    '✅ Reservation Confirmed'
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Reserve Experience
                    </>
                  )}
                </button>

                {success && (
                   <p className="mt-4 text-center text-xs font-bold text-emerald-400/80 animate-pulse uppercase tracking-wider">
                     Booking sent to your dashboard
                   </p>
                )}

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-4 text-xs font-bold text-white/40 mb-4 uppercase tracking-[0.1em]">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Free cancellation until 48h before</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-[0.1em]">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>

              {/* Promo Card */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[40px] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="relative z-10">
                  <h4 className="text-xl font-black mb-2 tracking-tight leading-tight">Need Group Discounts?</h4>
                  <p className="text-emerald-100/80 text-sm font-medium mb-4">Contact our travel luxury consultants for exclusive group pricing.</p>
                  <button className="text-xs font-black uppercase py-2.5 px-6 bg-white text-emerald-800 rounded-full">Chat with Sales</button>
                </div>
                <Users className="absolute bottom-[-20px] right-[-20px] w-40 h-40 text-black/10 transition-transform group-hover:scale-110" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;