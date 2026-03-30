import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Menu, X, User, LogOut, LayoutDashboard, ShieldCheck, ChevronDown, UserCircle, Briefcase } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Scroll listener
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // 2. Reactive Auth State Listener
    const updateAuth = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('auth-change', updateAuth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-change', updateAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-[60] transition-all duration-500 ${isScrolled ? 'bg-[#0f4d3a]/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">
              Travel<span className="text-emerald-400">X</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-[14px] font-black uppercase tracking-widest text-white/90">
            <Link to="/flights" className="hover:text-emerald-400 transition-colors">Flights</Link>
            <Link to="/hotels" className="hover:text-emerald-400 transition-colors">Hotels</Link>
            <Link
              to="/tours"
              className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-emerald-500/30 transition-all text-emerald-400"
            >
              Holiday Packages
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="relative">
                {/* Premium Profile Badge */}
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 pr-2 pl-3 py-1.5 rounded-full transition-all group active:scale-95"
                >
                  <span className="text-[11px] font-black text-teal-100/70 tracking-widest uppercase">
                    Hi, {user.name?.split(' ')[0]}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-xs text-emerald-400">
                      {user.name?.[0].toUpperCase()}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-emerald-500/50 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute right-0 mt-4 w-60 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-3 shadow-2xl z-20 animate-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 mb-2 border-b border-white/5">
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Standard Account</p>
                         <p className="text-sm font-bold text-white truncate">{user.email}</p>
                      </div>
                      
                      <Link to="/my-trips" className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-white/5 transition-colors text-white text-[13px] font-semibold group/item">
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                        Explore My Trips
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link to="/admin" className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-emerald-500/10 transition-colors text-emerald-400 text-[13px] font-semibold">
                          <ShieldCheck className="w-4 h-4" />
                          Security Console
                        </Link>
                      )}

                      <div className="mt-2 pt-2 border-t border-white/5">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-red-500/10 transition-colors text-red-400 text-[13px] font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          Finalize Session
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-[14px] font-black text-white hover:text-emerald-400 transition-colors px-4">
                  LOG IN
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 shadow-xl shadow-emerald-600/20 text-white px-8 py-3 rounded-2xl font-black text-[13px] tracking-widest hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95"
                >
                  INITIALIZE ACCOUNT
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-t border-white/10 p-4 space-y-4 animate-in slide-in-from-top duration-300">
           <Link to="/flights" className="block text-white font-black py-2 tracking-widest">FLIGHTS</Link>
           <Link to="/hotels" className="block text-white font-black py-2 tracking-widest">HOTELS</Link>
           <Link to="/tours" className="block text-emerald-400 font-black py-2 tracking-widest">HOLIDAY PACKAGES</Link>
           <Link to="/my-trips" className="block text-white font-black py-2 tracking-widest">MY TRIPS</Link>
           <div className="pt-4 border-t border-white/10">
             {user ? (
               <button onClick={handleLogout} className="w-full text-left font-black py-2 text-red-500 tracking-widest underline decoration-2">FINALIZE SESSION</button>
             ) : (
               <div className="space-y-4">
                 <Link to="/login" className="block text-white font-black py-2 tracking-widest">LOG IN</Link>
                 <Link to="/register" className="block bg-emerald-600 text-white text-center rounded-2xl py-4 font-black tracking-[0.2em] text-sm">INITIALIZE ACCOUNT</Link>
               </div>
             )}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;