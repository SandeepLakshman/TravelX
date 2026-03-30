import React, { useEffect, useState } from "react";
import { Plane, Calendar, Users, Ticket, Mail, Clock, CheckCircle, ChevronRight, User, Trash2 } from 'lucide-react';
import { bookingApi } from '../api';

const MyTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const result = await bookingApi.getAll();
        setBookings(result.data || []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingApi.deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[var(--color-brand-bg)] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            My <span className="text-emerald-400">Trips</span>
          </h1>
          <p className="text-teal-100/70 text-lg max-w-2xl font-medium">
            Manage your booked flights and holiday packages in one place.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-4"></div>
             <p className="text-teal-100 font-medium">Loading your journeys...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-32 bg-[var(--color-brand-card)] rounded-[40px] border border-teal-900/50 shadow-2xl">
            <div className="inline-block p-6 bg-emerald-500/10 rounded-full mb-6">
               <Plane className="h-16 w-16 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">No trips found</h2>
            <p className="text-teal-400 text-lg mb-8 max-w-md mx-auto">Looks like you haven't booked any adventures yet. Time to start exploring!</p>
            <button onClick={() => window.location.href = '/'} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-emerald-500/30">
              Find Next Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-[var(--color-brand-card!)] bg-teal-900/10 border border-teal-800/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-emerald-500/30 transition-all shadow-xl hover:shadow-emerald-500/5">
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border ${booking.type === 'FLIGHT' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                      {booking.type === 'FLIGHT' ? <Plane className="w-8 h-8" /> : <Ticket className="w-8 h-8" />}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{booking.tourTitle || "Untitled Trip"}</h3>
                      <div className="flex items-center gap-4 text-teal-200/60 text-sm font-bold mt-1">
                         <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-500" /> {booking.date}</span>
                         <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-emerald-500" /> {booking.persons} Pax</span>
                      </div>
                   </div>
                </div>

                <div className="hidden lg:flex items-center gap-8 py-2 px-8 border-x border-teal-800/40">
                   <div className="text-center">
                      <p className="text-[10px] font-black text-teal-500 uppercase mb-1">Booking ID</p>
                      <p className="text-white font-bold text-sm tracking-widest uppercase">#{booking.id}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[10px] font-black text-teal-500 uppercase mb-1">Status</p>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                         Confirmed
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto md:gap-8 border-t md:border-t-0 border-teal-800/50 pt-6 md:pt-0">
                   <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-teal-500 uppercase mb-1 tracking-widest leading-none">Total Payment</p>
                      <p className="text-3xl font-black text-white">₹{booking.totalPrice?.toLocaleString('en-IN')}</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <button onClick={() => handleCancelBooking(booking.id)} className="p-4 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl border border-red-500/30 transition-all group/btn shadow-lg shadow-red-500/5">
                        <Trash2 className="w-5 h-5 group-hover/btn:scale-110" />
                      </button>
                      <button className="bg-emerald-600/10 hover:bg-emerald-500 text-emerald-400 hover:text-white px-6 py-3.5 rounded-2xl border border-emerald-500/20 transition-all font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/5">
                        Manage Booking
                      </button>
                   </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;