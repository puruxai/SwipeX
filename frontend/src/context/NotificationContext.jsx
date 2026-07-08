import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl glass-panel border flex items-start gap-3 shadow-neon-indigo transform transition-all duration-300 animate-bounce-in ${
              toast.type === 'success'
                ? 'border-emerald-500/40 text-emerald-300'
                : toast.type === 'error'
                ? 'border-pink-500/40 text-pink-300'
                : 'border-indigo-500/40 text-indigo-300'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-pink-400 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-cyan-400 mt-0.5" />}
            <div className="flex-1 text-sm font-medium text-slate-100">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
