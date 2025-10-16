import React, { useEffect } from 'react';
import { Layout } from './components/layout/Layout'; 
import { useUiStore } from './store/uiStore';
import { Converter } from './components/converter/Converter';
import { ChartCard } from './components/converter/ChartCard'; 
import { FavoritesWrapper } from './components/favorites/FavoritesWrapper'; 

const App: React.FC = () => {
  const { theme, initializeTheme } = useUiStore();

  // Inicializa o tema apenas uma vez na montagem
  useEffect(() => {
    initializeTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sem dependências para evitar loops

  // Aplica o tema ao DOM
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
    <div style={{ minHeight: '100vh' }}> 
      <Layout>
        {/* COLUNA 1: Conversor de Moedas */}
        <Converter />
        
        {/* COLUNA 2 e 3 (Direita): Favoritos e Gerenciador */}
        <FavoritesWrapper /> 
        
        {/* LINHA 2 (Abaixo, abrangendo 3 colunas): Gráfico */}
        <div style={{ gridColumn: 'span 3' }}> 
          <ChartCard />
        </div>
      </Layout>
    </div>
  );
};

export default App;