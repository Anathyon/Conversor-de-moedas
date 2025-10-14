import React from 'react';
import { useUiStore } from '../../store/uiStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useUiStore();
  
  const themeIcon = theme === 'dark' ? '☀️' : '🌙';
  const themeText = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';

  // Classes Tailwind
  const containerClasses = `
    shadow-2xl rounded-xl w-full max-w-4xl relative
    bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300
  `;
  
  const buttonClasses = `
    absolute top-4 right-4 p-2 rounded-full text-lg z-10 
    bg-gray-200 text-gray-800 hover:bg-gray-300
    dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
  `;
  
  // Estilos convertidos para REM (30px = 1.875rem)
  const containerStyle: React.CSSProperties = {
      paddingTop: '1.875rem', // 30px
      paddingBottom: '1.875rem', // 30px
      paddingLeft: '1.875rem', // 30px
      paddingRight: '1.875rem', // 30px
  };
  
  // Estilos para o Main (grid) convertidos para REM (32px = 2rem, 40px = 2.5rem)
  const mainStyle: React.CSSProperties = {
      gap: '2rem', // 32px
      marginTop: '2.5rem', // 40px
  };
  
  // Estilos do wrapper externo convertidos para REM
  const wrapperStyle: React.CSSProperties = {
      paddingTop: '2.5rem', // 40px
      paddingBottom: '5rem', // 80px
  };

  return (
    <div className="flex justify-center items-start" style={wrapperStyle}>
      <div className={containerClasses} style={containerStyle}>
        
        <button
          onClick={toggleTheme}
          className={buttonClasses}
          aria-label={themeText}
          title={themeText}
        >
          {themeIcon}
        </button>

        <header className="mb-8 text-center pt-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-green-700 dark:text-green-400">
            Conversor Inteligente de Moedas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitore taxas atualizadas, gerencie suas moedas favoritas e acompanhe o histórico 
            de conversões com uma experiência elegante construída em React e Zustand.
          </p>
        </header>

        {/* O grid principal: 3 colunas em telas grandes (LG) */}
        <main 
            className="grid grid-cols-1 lg:grid-cols-3"
            style={mainStyle}
        >
          {children}
        </main>
      </div>
    </div>
  );
};