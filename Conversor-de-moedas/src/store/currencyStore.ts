import { create } from 'zustand';
import { type ConversionHistoryItem, type ApiRateData } from '../types'; 
import { fetchAllRatesFromAPI, fetchHistoricalRates } from '../api/currencyApi';

interface CurrencyState {
  rates: Record<string, number>;
  availableCurrencies: string[];
  favorites: string[];
  history: ConversionHistoryItem[];
  
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  
  historicalData: ApiRateData[];
  isHistoryLoading: boolean;
}

interface CurrencyActions {
  fetchRates: () => Promise<void>;
  fetchHistoricalData: (fromCode: string, toCode: string) => Promise<void>; 
  
  toggleFavorite: (code: string) => void;
  
  addHistoryItem: (item: Omit<ConversionHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  
  setFromCurrency: (code: string) => void;
  setToCurrency: (code: string) => void;
  setAmount: (amount: number) => void;
  
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

type CurrencyStore = CurrencyState & CurrencyActions;

// Função para carregar favoritos do localStorage
const loadFavoritesFromStorage = (): string[] => {
  try {
    const stored = localStorage.getItem('currency-favorites');
    return stored ? JSON.parse(stored) : ['USD', 'BRL', 'EUR'];
  } catch {
    return ['USD', 'BRL', 'EUR'];
  }
};

// Função para salvar favoritos no localStorage
const saveFavoritesToStorage = (favorites: string[]): void => {
  try {
    localStorage.setItem('currency-favorites', JSON.stringify(favorites));
  } catch (error) {
    console.warn('Erro ao salvar favoritos no localStorage:', error);
  }
};

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  rates: {},
  availableCurrencies: ['USD', 'BRL', 'EUR', 'JPY', 'CAD'],
  favorites: loadFavoritesFromStorage(), 
  history: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  
  historicalData: [],
  isHistoryLoading: false,
  
  fromCurrency: 'USD',
  toCurrency: 'BRL',
  amount: 1,

  setFromCurrency: (code) => set({ fromCurrency: code }),
  setToCurrency: (code) => set({ toCurrency: code }),
  setAmount: (amount) => set({ amount }),

  toggleFavorite: (code) => set((state) => {
      const isFavorite = state.favorites.includes(code);
      const newFavorites = isFavorite 
        ? state.favorites.filter(fav => fav !== code)
        : [...state.favorites, code];
      
      saveFavoritesToStorage(newFavorites);
      
      return { favorites: newFavorites };
  }),

  addHistoryItem: (item) => set((state) => {
    const newItem: ConversionHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    return { history: [newItem, ...state.history].slice(0, 10) };
  }),
  
  clearHistory: () => set({ history: [] }),

  fetchRates: async () => {
    if (get().isLoading) return; 

    set({ isLoading: true, error: null });
    
    try {
      const newRates: Record<string, number> = await fetchAllRatesFromAPI();
      
      const newCodes = new Set<string>(['USD']);
      for (const code in newRates) {
        newCodes.add(code);
      }
      
      const availableCurrencies = Array.from(newCodes).sort();
      
      set({ 
        rates: newRates, 
        availableCurrencies,
        isLoading: false,
        lastUpdated: Date.now(),
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao buscar taxas instantaneas.";
      set({ error: errorMessage, isLoading: false, lastUpdated: Date.now() });
    }
  },

  fetchHistoricalData: async (fromCode, toCode) => {
      set({ isHistoryLoading: true, error: null, historicalData: [] }); 
      try {
          const data = await fetchHistoricalRates(fromCode, toCode);
          
          set({ 
              historicalData: data, 
              isHistoryLoading: false,
              error: null
          });
          
      } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao buscar historico.";
          set({ 
              error: `Falha na API Historica: ${errorMessage}`, 
              isHistoryLoading: false, 
              historicalData: [] 
          });
      }
  },
}));