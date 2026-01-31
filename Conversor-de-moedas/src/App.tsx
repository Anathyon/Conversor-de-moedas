import React, { useEffect } from 'react';
import { Layout } from './components/layout/Layout'; 
import { useUiStore } from './store/uiStore';
import { Converter } from './components/converter/Converter';
import { ChartCard } from './components/converter/ChartCard'; 
import { FavoritesWrapper } from './components/favorites/FavoritesWrapper';
import { PWANotification } from './components/notifications/PWANotification';
import { usePWAInstall } from './hooks/usePWAInstall';

const App: React.FC = () => {
  const { theme, initializeTheme } = useUiStore();
  
  // Hook para gerenciar PWA install
  usePWAInstall();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <div className={`min-h-[100dvh] transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}> 
      <Layout>
        <Converter />
        <FavoritesWrapper /> 
        <ChartCard />
      </Layout>
      <PWANotification />
    </div>
  );
};

export default App;