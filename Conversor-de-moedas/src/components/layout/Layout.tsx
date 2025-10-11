import React from 'react';
import { useUiStore } from '../../store/uiStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useUiStore();
  
  const themeIcon = theme === 'dark' ? '☀️' : '🌙';
  const themeText = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';

  // Classes Tailwind para o fundo, texto e sombra (mantemos o modo claro/escuro aqui!)
  const containerClasses = `
    shadow-2xl rounded-xl w-full max-w-4xl mx-auto my-10 relative
    bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300
  `;
  
  const buttonClasses = `
    absolute top-4 right-4 p-2 rounded-full text-lg z-10 
    bg-gray-200 text-gray-800 hover:bg-gray-300
    dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
  `;
  
  // Usaremos o style para o padding do container principal (10px em cima/baixo, 30px nas laterais)
  const containerStyle: React.CSSProperties = {
      paddingTop: '30px',
      paddingBottom: '30px',
      paddingLeft: '30px',
      paddingRight: '30px',
  };

  return (
    <div className="flex justify-center items-start pt-10 pb-20">
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

        {/* O grid principal para os cards. Usamos style para definir o gap. */}
        <main 
            className="grid grid-cols-1 lg:grid-cols-3"
            style={{ gap: '32px', marginTop: '40px' }} // 32px de gap entre os elementos e 40px de margin-top
        >
          {children}
        </main>
      </div>
    </div>
  );
};