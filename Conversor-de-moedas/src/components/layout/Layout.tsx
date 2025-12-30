import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { Sun, Moon } from 'lucide-react';
import { PWAInstallButton } from '../PWAInstallButton';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout.
 * Handles theme toggling and responsive container structure.
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useUiStore();
  
  const themeText = theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro';

  return (
    <div 
      className="flex justify-center items-start min-h-[100dvh]"
      style={{
        paddingTop: 'clamp(1rem, 3vw, 2.5rem)',
        paddingBottom: 'clamp(2rem, 5vw, 5rem)',
        paddingLeft: 'clamp(0.5rem, 2vw, 1rem)',
        paddingRight: 'clamp(0.5rem, 2vw, 1rem)'
      }}
    >
      <div 
        className="w-[90%] max-w-[80rem] relative bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[31.25rem] transition-colors duration-300 mx-auto rounded-xl shadow-[0_1.5625rem_3.125rem_-0.75rem_rgba(0,0,0,0.25)]"
        style={{
          padding: 'clamp(1rem, 4vw, 1.875rem)'
        }}
      >
        
        <button
          onClick={toggleTheme}
          aria-label={themeText}
          title={themeText}
          className="absolute rounded-full text-lg z-10 border-none cursor-pointer transition-colors shadow-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          style={{
            top: '1rem',
            right: '1rem',
            padding: '0.5rem'
          }}
        >
          {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
          ) : (
              <Moon className="w-5 h-5 text-gray-800" />
          )}
        </button>

        <div 
          className="absolute z-10"
          style={{
            top: '1rem',
            left: '1rem'
          }}
        >
          <PWAInstallButton />
        </div>

        <header 
          className="text-center"
          style={{
            marginBottom: '2rem',
            paddingTop: '2rem'
          }}
        >
          <h1 
            className="text-[clamp(1.875rem,4vw,2.25rem)] font-bold text-emerald-600"
            style={{ margin: 0 }}
          >
            Conversor Inteligente de Moedas
          </h1>
          <p 
            className="text-lg leading-relaxed text-gray-500 dark:text-gray-400"
            style={{
              marginTop: '0.5rem',
              margin: 0
            }}
          >
            Transforme suas finanças com precisão instantânea. Acompanhe cotações em tempo real, 
            gerencie suas moedas preferidas e visualize tendências históricas com nossa plataforma 
            inteligente de conversão monetária.
          </p>
        </header>

        <main 
          className="flex flex-col w-full"
          style={{
            gap: 'clamp(1rem, 3vw, 2rem)',
            marginTop: 'clamp(1rem, 3vw, 2.5rem)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};