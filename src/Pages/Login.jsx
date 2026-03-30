import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Mail, Lock, Sparkles, Eye, EyeOff, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { authApi } from '../api';
import { showAppToast } from '../Components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const data = res.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data)); // Handle both nested and flat responses
      
      // Dispatch event to notify Navbar
      window.dispatchEvent(new Event('auth-change'));
      
      showAppToast('Authentication successful. Welcome back!');
      navigate('/');
    } catch (err) {
      let errorMessage = 'Invalid credentials. Please try again.';
      if (err.name === 'AbortError') {
        errorMessage = 'Server is taking too long to respond. It might be waking up from sleep. Please try again in 30 seconds.';
      } else if (!err.response) {
        errorMessage = 'Cannot reach the server. Please check your internet or if the backend is running.';
      } else {
        errorMessage = err.response.data || errorMessage;
      }
      showAppToast(errorMessage, 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-bg)] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-700/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal-800/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg bg-[var(--color-brand-card)] backdrop-blur-2xl rounded-[40px] border border-white/5 p-8 md:p-12 shadow-2xl relative z-10 transition-all duration-500 hover:border-emerald-500/20 group">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-emerald-500 p-4 rounded-3xl mb-6 shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-500">
            <Plane className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white text-center tracking-tighter">
            Welcome <span className="text-emerald-400">Back</span>
          </h1>
          <p className="text-teal-100/50 mt-3 font-medium text-center max-w-xs">Enter your details to access your premium travel dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative group/field">
              <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-teal-500 group-focus-within/field:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all font-semibold"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group/field">
              <label className="text-[10px] font-black text-teal-500 uppercase tracking-widest ml-1 mb-2 block">Secret Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-teal-500 group-focus-within/field:text-emerald-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all font-semibold"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-teal-500 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
             <label className="flex items-center gap-2 cursor-pointer group/check">
                <input type="checkbox" className="w-5 h-5 rounded-lg accent-emerald-500 bg-white/5 border-white/10" />
                <span className="text-teal-200/60 text-sm font-bold group-hover/check:text-white transition-colors">Keep me signed in</span>
             </label>
             <a href="#" className="text-emerald-400 text-sm font-black hover:text-emerald-300 transition-colors">Forgot PWD?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-2 group/btn active:scale-95 disabled:bg-teal-900 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                AUTHENTICATE ACCESS
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-teal-100/40 font-bold mb-4">NEW TO THE PLATFORM?</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-black text-sm uppercase tracking-widest transition-all p-2 rounded-xl hover:bg-emerald-500/10"
          >
            Create Premium Account <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;