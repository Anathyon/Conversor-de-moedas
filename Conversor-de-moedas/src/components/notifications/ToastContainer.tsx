
import React from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed z-50 flex flex-col items-end pointer-events-none"
      style={{
        bottom: '1.5rem',
        right: '1.5rem',
        gap: '0.75rem'
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center shadow-lg rounded-lg pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100 ${
            toast.type === 'success' ? 'bg-emerald-600' : 
            toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
          } text-white`}
          style={{
            padding: '1rem',
            minWidth: '200px',
            maxWidth: '350px'
          }}
        >
          <div style={{ marginRight: '0.75rem' }}>
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          <p className="flex-1 text-sm font-medium" style={{ margin: 0 }}>
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="bg-transparent border-none text-white cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            style={{ marginLeft: '0.75rem', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
