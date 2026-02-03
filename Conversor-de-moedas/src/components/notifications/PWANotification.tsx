import React, { useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { CheckCircle, X } from 'lucide-react';

export const PWANotification: React.FC = () => {
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
      <div className="bg-green-600 text-white rounded-2xl shadow-2xl p-6 max-w-sm relative">
        {/* Botão X no canto superior direito */}
        <button
          onClick={hideNotification}
          className="absolute top-3 right-3 text-white text-opacity-70 hover:text-opacity-100 transition-opacity"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header com ícone e título */}
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
          <h3 className="text-lg font-bold text-white pr-6">
            Instalar Conversor de Moedas
          </h3>
        </div>
        
        {/* Descrição */}
        <p className="text-white text-opacity-95 text-sm mb-6 leading-relaxed">
          Instale nosso conversor para usar offline e ter acesso rápido!
        </p>
        
        {/* Botões */}
        <div className="flex space-x-3">
          <button
            onClick={hideNotification}
            className="flex-1 bg-transparent border-2 border-white border-opacity-40 hover:border-opacity-60 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 text-sm"
          >
            Agora não
          </button>
          <button
            onClick={installPWA}
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 text-sm border border-white border-opacity-30"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
};