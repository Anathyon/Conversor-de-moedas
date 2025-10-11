// src/stores/uiStore.ts
import { create } from 'zustand';

// 1. Definição do Estado
interface UiState {
  theme: 'light' | 'dark';
}

// 2. Definição das Ações
interface UiActions {
  /** Alterna o tema entre 'light' e 'dark'. */
  toggleTheme: () => void;
}

// 3. Combinação e Criação do Store
type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>((set) => ({
  // Estado inicial
  theme: 'light', // Por padrão, o tema começa no modo claro

  // Ação
  toggleTheme: () => set((state) => ({
    // Alterna o valor do tema
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
}));