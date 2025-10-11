// src/stores/currencyStore.ts
import { create } from 'zustand';
import { type ConversionHistoryItem } from '../types/index';

// Interface para a resposta da API
interface ApiCurrencyData {
  code: string;
  codein: string;
  bid: string;
}
// --- 1. Definição do Estado ---
interface CurrencyState {
  // Objeto onde a chave é o par (ex: "USDBRL") e o valor é a taxa (number)
  rates: Record<string, number>; 
  availableCurrencies: string[]; // Ex: ["USD", "BRL", "EUR"] para os dropdowns
  favorites: string[]; // Códigos de moedas favoritas
  history: ConversionHistoryItem[];
  lastUpdate: number | null; // Timestamp da última atualização
  isLoading: boolean;
  error: string | null;
}

// --- 2. Definição das Ações ---
interface CurrencyActions {
  fetchRates: () => Promise<void>; // Função que buscará os dados da AwesomeAPI
  addFavorite: (code: string) => void;
  removeFavorite: (code: string) => void;
  addConversionToHistory: (item: ConversionHistoryItem) => void;
}

// --- 3. Combinação e Criação do Store ---
type CurrencyStore = CurrencyState & CurrencyActions;

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  // Estado Inicial
  rates: {},
  availableCurrencies: [],
  favorites: ['USD', 'EUR', 'BTC'], // Exemplo inicial
  history: [],
  lastUpdate: null,
  isLoading: false,
  error: null,

  // --- Ações ---

  fetchRates: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1. Busca dos dados
      const response = await fetch('https://economia.awesomeapi.com.br/json/all');
      if (!response.ok) throw new Error('Falha ao buscar as taxas de câmbio.');
      
      const data: Record<string, ApiCurrencyData> = await response.json();
      
      const newRates: Record<string, number> = {};
      const newCurrencies: Set<string> = new Set();
   
      for (const key in data) {
        if (data[key] && data[key].code && data[key].codein) {
             const rateKey = `${data[key].code}${data[key].codein}`; // Ex: "USDBRL"
             // O campo 'bid' é retornado como string, precisa ser Number.
             newRates[rateKey] = Number(data[key].bid); 
             newCurrencies.add(data[key].code);
        }
      }
      
      // 3. Atualiza o estado
      set({ 
        rates: newRates, 
        availableCurrencies: Array.from(newCurrencies).sort(), 
        lastUpdate: Date.now(),
        isLoading: false,
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      set({ error: errorMessage, isLoading: false });
    }
  },

  addFavorite: (code) => {
    if (!get().favorites.includes(code)) {
      set((state) => ({
        favorites: [...state.favorites, code],
      }));
    }
  },

  removeFavorite: (code) => set((state) => ({
    favorites: state.favorites.filter(fav => fav !== code),
  })),

  addConversionToHistory: (item) => set((state) => ({
    // Adiciona o novo item no topo da lista
    history: [item, ...state.history],
  })),
}));