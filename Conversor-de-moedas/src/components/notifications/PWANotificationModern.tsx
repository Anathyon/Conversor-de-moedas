import React, { useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { Download, X } from 'lucide-react';

export const PWANotificationModern: React.FC = () => {
  const { showPWANotification, hideNotification, installPWA } = useNotificationStore();

  useEffect(() => {
    if (showPWANotification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [showPWANotification, hideNotification]);

  if (!showPWANotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl shadow-2xl p-4 max-w-sm border-l-4 border-teal-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 bg-teal-500 rounded-lg p-2">
              <Download className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Instalar Aplicativo
            </h3>
          </div>
          <button
            onClick={hideNotification}
            className="text-white text-opacity-70 hover:text-opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-white text-opacity-90 text-xs mb-3 pl-11">
          Acesse offline e ganhe performance!
        </p>
        
        <div className="flex space-x-2 pl-11">
          <button
            onClick={installPWA}
            className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 text-xs flex-1"
          >
            Instalar Agora
          </button>
          <button
            onClick={hideNotification}
            className="bg-transparent border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 text-xs"
          >
            Agora nao
          </button>
        </div>
      </div>
    </div>
  );
};