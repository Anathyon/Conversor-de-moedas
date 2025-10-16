import { create } from 'zustand';

// Define o tipo do estado do tema
type Theme = 'light' | 'dark';

// Interface do Store
interface UiState {
  theme: Theme;
  toggleTheme: () => void;
  initializeTheme: () => void; // Funcao para carregar tema do localStorage
}

// Cria o store de UI (Tema)
export const useUiStore = create<UiState>((set) => ({
  // Define 'dark' como tema inicial padrao (conforme sua preferencia)
  theme: 'dark', 

  // Alterna entre 'light' e 'dark' e salva no localStorage
  toggleTheme: () => {
    set(state => {
      const newTheme: Theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    });
  },

  // Inicializa o tema lendo do localStorage ou aplicando o padrao 'dark'
  initializeTheme: () => {
    // Tenta carregar do localStorage, caso contrario, usa 'dark'
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || 'dark'; 
    
    // Aplica a classe dark imediatamente ao <html> (DOM)
    if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
        // Define o fundo do body para o modo escuro
        document.body.style.backgroundColor = '#1F2937'; // gray-800
    } else {
        document.documentElement.classList.remove('dark');
        // Define o fundo do body para o modo claro
        document.body.style.backgroundColor = '#f3f4f6'; // gray-100
    }
    
    set({ theme: initialTheme });
  }
}));