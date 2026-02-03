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
    <div className="fixed top-4 right-4 z-50 animate-slide-in" style={{ margin: '16px' }}>
      <div className="bg-green-600 text-white rounded-2xl shadow-2xl relative border border-green-500" style={{ padding: '24px', maxWidth: '384px' }}>
        {/* Botão X no canto superior direito */}
        <button
          onClick={hideNotification}
          className="absolute text-white hover:text-green-200 transition-colors rounded-full hover:bg-white hover:bg-opacity-10"
          style={{ top: '16px', right: '16px', padding: '4px' }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header com ícone e título */}
        <div className="flex items-center" style={{ gap: '12px', marginBottom: '16px', paddingRight: '32px' }}>
          <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
          <h3 className="text-lg font-bold text-white leading-tight">
            Instalar Conversor de Moedas
          </h3>
        </div>
        
        {/* Descrição */}
        <p className="text-white text-opacity-95 text-sm leading-relaxed" style={{ marginBottom: '24px' }}>
          Instale nosso conversor para usar offline e ter acesso rápido!
        </p>
        
        {/* Botões */}
        <div className="flex" style={{ gap: '12px' }}>
          <button
            onClick={hideNotification}
            className="flex-1 bg-transparent border-2 border-white border-opacity-50 hover:border-opacity-70 hover:bg-white hover:bg-opacity-10 text-white font-medium rounded-xl transition-all duration-200 text-sm"
            style={{ padding: '12px 16px' }}
          >
            Agora não
          </button>
          <button
            onClick={installPWA}
            className="flex-1 bg-white text-green-700 hover:bg-green-50 font-bold rounded-xl transition-all duration-200 text-sm shadow-lg"
            style={{ padding: '12px 16px' }}
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
};