import { useUiStore } from './store/uiStore';
import { Layout } from './components/layout/Layout';
import { Converter } from './components/converter/Converter'; 
import { Favorites } from './components/favorites/favorites'; 

function App() {
  const theme = useUiStore(state => state.theme);

  return (
  <div 
     className={`${theme} min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
  >
   <Layout>
    <Converter />

     <Favorites />

  </Layout>
</div>
);
}

export default App;