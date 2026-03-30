import React, { useState, useEffect } from 'react';
import TourCard from '../Components/TourCard';
import { Compass, Filter } from 'lucide-react';
import { tourApi } from '../api';
import { allTours } from '../data/travelData';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const result = await tourApi.getAll();
        setTours(result.data?.length > 0 ? result.data : allTours);
      } catch (err) {
        console.error("Failed to fetch tours, using fallback", err);
        setTours(allTours);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div className="bg-[var(--color-brand-bg)] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Holiday <span className="text-emerald-400">Packages</span>
            </h1>
            <p className="text-teal-100/70 text-lg max-w-2xl font-medium">
              Explore our handpicked collection of premium tours and experiences around the globe.
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-teal-900/40 border border-teal-800 px-6 py-3 rounded-xl text-white font-bold hover:bg-teal-800 transition-all shadow-lg">
            <Filter className="w-5 h-5 text-emerald-400" /> Filter Options
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-6"></div>
             <div className="space-y-4">
               <p className="text-teal-100 animate-pulse font-medium text-lg">Curating best experiences...</p>
               <p className="text-teal-500/80 text-sm max-w-sm mx-auto">
                 Connecting to premium travel servers. 
                 If this takes more than 15s, we'll show our signature collections.
               </p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;