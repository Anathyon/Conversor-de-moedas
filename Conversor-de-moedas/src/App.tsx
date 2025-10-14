import { useUiStore } from './store/uiStore';
import { Layout } from './components/layout/Layout';
import { Converter } from './components/converter/Converter'; 
// Assumindo que você renomeou o 'FavoritesWrapper' que eu te passei para 'Favorites'
import { Favorites } from './components/favorites/Favorites'; 

function App() {
  // Busca o tema (Dark/Light) do Zustand para aplicar a classe no corpo da página
  const theme = useUiStore(state => state.theme);

  return (
    // Aplica o tema e o fundo geral da página (min-h-screen, dark mode colors)
    <div 
        className={`
          min-h-screen transition-colors duration-300
          ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}
        `}
        // Para garantir que o Tailwind saiba qual tema está ativo, adicione 'data-mode' ou a classe 'dark'
        // Se o seu setup Tailwind usa `class` para Dark Mode, a classe 'dark' deve ser aplicada ao elemento HTML ou BODY.
        // Se estiver usando o 'class' strategy, você pode injetar a classe 'dark' aqui, se o `theme` for 'dark'.
        data-theme={theme}
    >
      <Layout>
          {/*             CORREÇÃO: Removemos o <div> extra com o grid.
            Os componentes Converter e Favorites são agora filhos diretos de <Layout>.
            O <Layout> já tem o grid de 3 colunas no seu <main>.
            As classes lg:col-span-2 (no Converter) e lg:col-span-1 (no Favorites) 
            agora funcionam corretamente dentro do grid do Layout.
          */}
          
          {/* Ocupa 2/3 da largura em telas grandes */}
          <Converter />
          
          {/* Ocupa 1/3 da largura em telas grandes */}
          <Favorites />
      </Layout>
    </div>
  );
}

export default App;