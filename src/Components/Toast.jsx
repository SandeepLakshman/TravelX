import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const Toast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const showToast = (e) => {
      const { message, type } = e.detail;
      setToast({ message, type });
      
      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToast(null);
      }, 4000);
    };

    window.addEventListener('app-toast', showToast);
    return () => window.removeEventListener('app-toast', showToast);
  }, []);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-8 duration-500">
      <div className={`
        flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-2xl border
        ${isError 
          ? 'bg-red-500/10 border-red-500/20 text-red-100' 
          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100'
        }
      `}>
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-400" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        )}
        
        <p className="text-sm font-bold tracking-tight">{toast.message}</p>
        
        <button 
          onClick={() => setToast(null)}
          className="ml-2 p-1 hover:bg-white/5 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 opacity-50 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

// Helper function to trigger toasts from anywhere
export const showAppToast = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type } }));
};

export default Toast;
