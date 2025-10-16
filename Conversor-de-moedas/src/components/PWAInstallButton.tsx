import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();

  if (isInstalled) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#059669',
        color: 'white',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500'
      }}>
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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#047857';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#059669';
      }}
    >
      <Download size={16} />
      <span>Instalar App</span>
    </button>
  );
};
