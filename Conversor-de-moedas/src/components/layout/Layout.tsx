import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useUiStore();
  
  const themeText = theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro';

  const containerStyle: React.CSSProperties = {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    borderRadius: '0.75rem',
    width: '100%',
    maxWidth: '1024px',
    position: 'relative',
    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
    color: theme === 'dark' ? '#f3f4f6' : '#111827',
    minHeight: '500px',
    padding: '30px',
    transition: 'background-color 0.3s, color 0.3s'
  };
  
  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '8px',
    borderRadius: '50%',
    fontSize: '18px',
    zIndex: 10,
    backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
    color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };
  
  const wrapperStyle: React.CSSProperties = {
    paddingTop: '40px',
    paddingBottom: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  };
  
  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
    textAlign: 'center',
    paddingTop: '32px'
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.875rem, 4vw, 2.25rem)',
    fontWeight: 'bold',
    color: '#059669',
    margin: 0
  };
  
  const subtitleStyle: React.CSSProperties = {
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    marginTop: '8px',
    margin: 0
  };
  
  const mainStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '32px',
    marginTop: '40px'
  };

  // Media query para telas grandes
  const isLargeScreen = window.innerWidth >= 1024;
  if (isLargeScreen) {
    mainStyle.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
  }

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        
        {/* Botão de Alternância de Tema */}
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
              <Sun style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
          ) : (
              <Moon style={{ width: '20px', height: '20px', color: '#1f2937' }} />
          )}
        </button>

        {/* Cabeçalho */}
        <header style={headerStyle}>
          <h1 style={titleStyle}>
            Conversor Inteligente de Moedas
          </h1>
          <p style={subtitleStyle}>
            Monitore taxas atualizadas, gerencie suas moedas favoritas e acompanhe o histórico 
            de conversões com uma experiência elegante construída em React e Zustand.
          </p>
        </header>

        {/* Grid principal */}
        <main style={mainStyle}>
          {children}
        </main>
      </div>
    </div>
  );
};