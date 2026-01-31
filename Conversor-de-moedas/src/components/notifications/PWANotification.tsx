import React, { useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { Download, X } from 'lucide-react';

export const PWANotification: React.FC = () => {
  const { showPWANotification, hideNotification, installPWA } = useNotificationStore();

  useEffect(() => {
    if (showPWANotification) {
      // Auto-hide após 3 segundos
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPWANotification, hideNotification]);

  if (!showPWANotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Download className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Instalar App
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Instale nosso app para acesso rapido e offline!
              </p>
            </div>
          </div>
          <button
            onClick={hideNotification}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-3 flex space-x-2">
          <button
            onClick={installPWA}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors"
          >
            Instalar
          </button>
          <button
            onClick={hideNotification}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium py-2 px-3 rounded-md transition-colors"
          >
            Agora nao
          </button>
        </div>
      </div>
    </div>
  );
};