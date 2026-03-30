import React from 'react';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TourCard = ({ tour }) => {
  return (
    <div className="group bg-[var(--color-brand-card)] rounded-[32px] overflow-hidden border border-teal-900/50 hover:border-emerald-500/50 transition-all duration-500 shadow-xl hover:shadow-emerald-500/10 flex flex-col h-full relative">
      
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={tour.image} 
          alt={tour.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-bg)] via-transparent to-transparent opacity-60" />
        
        {/* Favorite/Tag */}
        <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
          Best Seller
        </div>

        {/* Rating Overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-bold">{tour.rating || '4.9'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">{tour.location}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-1">
          {tour.title}
        </h3>

        <div className="flex items-center gap-4 text-teal-200/60 text-sm mb-6 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-500" />
            {tour.duration}
          </div>
          <div className="w-1 h-1 bg-teal-800 rounded-full" />
          <span>Starting at</span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-teal-900/30">
          <div>
            <div className="text-[10px] text-teal-500 font-black uppercase tracking-tighter leading-none mb-1">Price per person</div>
            <div className="text-2xl font-black text-white">
              ₹{tour.price.toLocaleString('en-IN')}
            </div>
          </div>
          
          <Link 
            to={`/book/${tour.id}`}
            className="bg-emerald-600/10 hover:bg-emerald-500 text-emerald-400 hover:text-white p-3 rounded-2xl border border-emerald-500/20 transition-all duration-300 group/btn"
          >
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;