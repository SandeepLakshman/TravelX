import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Plane, User, Phone, Mail, ShieldCheck, Users, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import { bookingApi } from '../api';

const FlightBooking = () => {
  const { state } = useLocation();
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Safely pull form fields from logged-in user to pre-fill
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();

  const [formData, setFormData] = useState({
    name: storedUser.name || '',
    email: storedUser.email || '',
    phone: '',
    passport: ''
  });

  // Flight data passed from the Flights page via navigation state
  const flight = state?.flight || { id: flightId, airline: 'Airlines', price: 5000, departure: '08:00', arrival: '10:00', duration: 120 };
  const from = state?.from || 'DEL';
  const to = state?.to || 'BOM';
  const date = state?.date || new Date().toISOString().split('T')[0];
  const travelers = parseInt(state?.passengers || 1);
  const totalPrice = flight.price * travelers;

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) { setErrorMsg('Please enter your full name.'); return; }
    if (!formData.email.trim()) { setErrorMsg('Please enter your email address.'); return; }
    if (!formData.phone.trim()) { setErrorMsg('Please enter your phone number.'); return; }

    setIsSubmitting(true);

    // This payload exactly matches the Spring Boot BookingRequest.java DTO
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      date: date,
      persons: travelers,
      flightNumber: flight.id || flightId || 'N/A',
      airline: flight.airline || 'N/A',
      departureIata: from,
      arrivalIata: to,
      tourTitle: `Flight: ${from} → ${to}`,
      totalPrice: totalPrice,
      passengersData: JSON.stringify({ phone: formData.phone, passport: formData.passport })
    };

    console.log('Submitting booking payload:', payload);

    try {
      await bookingApi.create(payload);
      setIsSuccess(true);
      setTimeout(() => navigate('/my-trips'), 2000);
    } catch (err) {
      console.error('Booking error:', err);
      const msg = err?.response?.data || err?.message || 'Booking failed. Please try again.';
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success Screen ────────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="bg-[var(--color-brand-bg)] min-h-screen flex items-center justify-center">
        <div className="text-center animate-in zoom-in-95 duration-500 p-12">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-emerald-500/10 rounded-full border border-emerald-500/30 mb-8">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Booking Confirmed! 🎉</h1>
          <p className="text-teal-200/70 text-lg font-medium mb-2">
            Your flight <span className="text-emerald-400 font-black">{from} → {to}</span> has been booked.
          </p>
          <p className="text-teal-500 text-sm font-semibold">Redirecting to My Trips...</p>
        </div>
      </div>
    );
  }

  // ── Main Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[var(--color-brand-bg)] min-h-screen pt-24 pb-20 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-teal-400 hover:text-white transition-colors mb-8 font-bold">
          <ArrowLeft className="w-5 h-5" /> Back to Flights
        </button>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── LEFT: Passenger Form ───────────────────────────────────────────── */}
          <div className="flex-1">
            <div className="bg-teal-900/20 backdrop-blur-3xl rounded-[40px] border border-teal-800/50 p-10 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                <User className="h-8 w-8 text-emerald-500" /> PASSENGER DETAILS
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Lakshman Kumar"
                      value={formData.name}
                      onChange={handleChange('name')}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-semibold placeholder-white/20"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange('email')}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-semibold placeholder-white/20"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-semibold placeholder-white/20"
                    />
                  </div>

                  {/* Passport */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-1">
                      Passport Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="L8765432"
                      value={formData.passport}
                      onChange={handleChange('passport')}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-4 outline-none focus:border-emerald-500 transition-all font-semibold placeholder-white/20"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 font-semibold text-sm">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Terms */}
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
                  <p className="text-[11px] text-teal-100/60 font-medium leading-relaxed">
                    By clicking "Authorize & Confirm", you agree to the airline's conditions of carriage and our terms of service. Your data is protected by premium encryption protocols.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-teal-900 disabled:cursor-not-allowed text-white font-black py-5 rounded-[26px] text-lg transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <>AUTHORIZE & CONFIRM <ShieldCheck className="w-6 h-6 text-emerald-300" /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── RIGHT: Flight Summary Card ─────────────────────────────────────── */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl sticky top-28">
              <h3 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4 tracking-tighter uppercase">Itinerary</h3>

              {/* Times */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center">
                  <p className="text-3xl font-black text-slate-950">{flight.departure}</p>
                  <p className="text-slate-400 font-bold text-xs mt-1">{from}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="w-full h-px bg-slate-200 relative flex justify-center items-center">
                    <Plane className="h-4 w-4 text-emerald-600 bg-white px-0.5 absolute" />
                  </div>
                  <p className="text-[9px] font-black text-slate-300 mt-2">NON STOP</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-slate-950">{flight.arrival}</p>
                  <p className="text-slate-400 font-bold text-xs mt-1">{to}</p>
                </div>
              </div>

              {/* Airline + Details */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Plane className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-black text-sm">{flight.airline}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{flight.id || flightId}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-slate-600 font-bold text-xs">
                  <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {travelers} Pax</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {date}</div>
                </div>
              </div>

              {/* Price */}
              <div className="pt-6 border-t-2 border-slate-100 border-dashed">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Price</span>
                  <span className="text-slate-900 font-black text-3xl">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-emerald-600 font-black text-right mt-2 tracking-tight">TAXES & FEES INCLUDED</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
