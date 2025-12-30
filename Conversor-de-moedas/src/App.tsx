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
      // Body background is now handled by CSS or the main container being full height
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply background color via class on the wrapper instead of inline implementation on body
  // which is cleaner for React. However, to ensure full coverage, we might want to keep the body style 
  // or set it in index.css. 
  // Let's use the wrapper to control the background of the app area.
  
  return (
    <div className={`min-h-[100dvh] transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}> 
      <Layout>
        <Converter />
        <FavoritesWrapper /> 
        <ChartCard />
      </Layout>
    </div>
  );
};

export default App;