import React, { useEffect } from 'react';
import { Layout } from './components/layout/Layout'; 
import { useUiStore } from './store/uiStore';
import { Converter } from './components/converter/Converter';
import { ChartCard } from './components/converter/ChartCard'; 
import { FavoritesWrapper } from './components/favorites/FavoritesWrapper'; 

const App: React.FC = () => {
  const { theme, initializeTheme } = useUiStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#1F2937'; 
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f3f4f6'; 
    }
  }, [theme]);

  return (
    <div style={{ minHeight: '100dvh' }}> 
      <Layout>
        <Converter />
        <FavoritesWrapper /> 
        <ChartCard />
      </Layout>
    </div>
  );
};

export default App;