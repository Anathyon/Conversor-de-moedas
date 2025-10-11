import { useUiStore } from './store/uiStore';
import { Layout } from './components/layout/Layout';
// Importe outros componentes assim que criá-los

function App() {
  // 1. Puxa o estado do tema do Zustand
  const theme = useUiStore(state => state.theme);

  return (
    // 2. Aplica a classe CSS globalmente (ideal para Tailwind ou CSS Modules)
    // O 'min-h-screen' garante que o fundo cubra toda a tela
    <div 
      className={`${theme} min-h-screen transition-colors duration-300`}
    >
      <Layout>
        {/* Aqui serão injetados os componentes filhos (Converter, Favorites, History) */}
        <h1>Conversor Inteligente de Moedas</h1>
        <p>Aguardando os componentes de conversão e histórico...</p>
      </Layout>
    </div>
  );
}

export default App;