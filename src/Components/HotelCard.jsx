import React from 'react';
import { MapPin, Star, ShieldCheck, Heart } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  return (
    <div className="group bg-white rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border border-slate-100 flex flex-col h-full transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute top-6 right-6">
          <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute top-6 left-6">
          <div className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" /> Premium Choice
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
           <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i+hotel.id}`} alt="user" />
                    </div>
                 ))}
              </div>
              <p className="text-white text-[10px] font-bold">120+ Booked this week</p>
           </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {hotel.location}
            </div>
          </div>
          <div className="bg-emerald-50 p-2 rounded-2xl flex items-center gap-1 text-emerald-600 font-black text-sm">
            <Star className="w-4 h-4 fill-emerald-600" /> {hotel.rating}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting From</p>
            <p className="text-3xl font-black text-slate-900">₹{hotel.price.toLocaleString('en-IN')}<span className="text-sm font-bold text-slate-400">/night</span></p>
          </div>
          <button className="bg-slate-900 text-white rounded-2xl px-6 py-4 font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-600/20 transition-all active:scale-95">
            Book Stay
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
