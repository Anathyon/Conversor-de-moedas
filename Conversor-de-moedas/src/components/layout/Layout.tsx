import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { Sun, Moon } from 'lucide-react';
import { PWAInstallButton } from '../PWAInstallButton';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useUiStore();
  
  const themeText = theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro';

  const containerStyle: React.CSSProperties = {
    boxShadow: '0 1.5625rem 3.125rem -0.75rem rgba(0, 0, 0, 0.25)',
    borderRadius: '0.75rem',
    width: '90%',
    maxWidth: '80rem',
    position: 'relative',
    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
    color: theme === 'dark' ? '#f3f4f6' : '#111827',
    minHeight: '31.25rem',
    padding: 'clamp(1rem, 4vw, 1.875rem)',
    transition: 'background-color 0.3s, color 0.3s',
    margin: '0 auto'
  };
  
  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.5rem',
    borderRadius: '50%',
    fontSize: '1.125rem',
    zIndex: 10,
    backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
    color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1)'
  };
  
  const wrapperStyle: React.CSSProperties = {
    paddingTop: 'clamp(1rem, 3vw, 2.5rem)',
    paddingBottom: 'clamp(2rem, 5vw, 5rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100dvh',
    paddingLeft: 'clamp(0.5rem, 2vw, 1rem)',
    paddingRight: 'clamp(0.5rem, 2vw, 1rem)'
  };
  
  const headerStyle: React.CSSProperties = {
    marginBottom: '2rem',
    textAlign: 'center',
    paddingTop: '2rem'
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
    fontWeight: 'bold',
    color: '#059669',
    margin: 0
  };
  
  const subtitleStyle: React.CSSProperties = {
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    marginTop: '0.5rem',
    margin: 0,
    fontSize: '1.125rem',
    lineHeight: '1.6'
  };
  
  const mainStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(1rem, 3vw, 2rem)',
    marginTop: 'clamp(1rem, 3vw, 2.5rem)',
    width: '100%'
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        
        <button
          onClick={toggleTheme}
          style={buttonStyle}
          aria-label={themeText}
          title={themeText}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#6b7280' : '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
          }}
        >
          {theme === 'dark' ? (
              <Sun style={{ width: '1.25rem', height: '1.25rem', color: '#fbbf24' }} />
          ) : (
              <Moon style={{ width: '1.25rem', height: '1.25rem', color: '#1f2937' }} />
          )}
        </button>

        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 10
        }}>
          <PWAInstallButton />
        </div>

        <header style={headerStyle}>
          <h1 style={titleStyle}>
            Conversor Inteligente de Moedas
          </h1>
          <p style={subtitleStyle}>
            Transforme suas finanças com precisão instantânea. Acompanhe cotações em tempo real, 
            gerencie suas moedas preferidas e visualize tendências históricas com nossa plataforma 
            inteligente de conversão monetária.
          </p>
        </header>

        <main style={mainStyle}>
          {children}
        </main>
      </div>
    </div>
  );
};