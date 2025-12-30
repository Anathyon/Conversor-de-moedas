import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';

/**
 * Button to install the PWA.
 * Shows specific UI based on installation status.
 */
export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();

  if (isInstalled) {
    return (
      <div 
        className="flex items-center bg-emerald-600 text-white rounded-lg text-sm font-medium"
        style={{
          gap: '0.5rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        <Smartphone size={16} />
        <span>App Instalado</span>
      </div>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <button
      onClick={installPWA}
      className="flex items-center bg-emerald-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-colors hover:bg-emerald-700"
      aria-label="Instalar Aplicativo"
      style={{
        gap: '0.5rem',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        paddingLeft: '1rem',
        paddingRight: '1rem'
      }}
    >
      <Download size={16} />
      <span>Instalar App</span>
    </button>
  );
};
