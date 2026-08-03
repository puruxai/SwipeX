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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-2xl bg-[#1A1A17] border border-neutral-800 flex items-start gap-3 shadow-xl transition-all duration-300 transform translate-y-0"
            style={{ animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0 text-[#7ED321] mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-sky-400 mt-0.5" />}
            
            <div className="flex-1 text-xs font-semibold text-white leading-relaxed pt-0.5">{toast.message}</div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
