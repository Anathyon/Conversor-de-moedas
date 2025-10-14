import { create } from 'zustand';
import { type ConversionHistoryItem, type ApiRateData } from '../types'; // Adicionado ApiRateData para consistência
import { fetchAllRatesFromAPI } from '../api/currencyApi';

// ------------------------------------
// 1. ESTADO
// ------------------------------------
interface CurrencyState {
  // Corrigido: A chave é o código da moeda (ex: "BRL"), o valor é a taxa (número) baseada em USD.
  rates: Record<string, number>; 
  
  availableCurrencies: string[]; 
  favorites: string[];
  history: ConversionHistoryItem[];
  
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// ------------------------------------
// 2. AÇÕES
// ------------------------------------
interface CurrencyActions {
  fetchRates: () => Promise<void>;
  toggleFavorite: (code: string) => void; // Unificado add/remove em toggle
  addHistoryItem: (item: Omit<ConversionHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  
  setFromCurrency: (code: string) => void;
  setToCurrency: (code: string) => void;
  setAmount: (amount: number) => void;
  
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

// ------------------------------------
// 3. CRIAÇÃO DO STORE
// ------------------------------------
type CurrencyStore = CurrencyState & CurrencyActions;

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  // ESTADO INICIAL
  rates: {},
  availableCurrencies: ['USD', 'BRL', 'EUR', 'JPY', 'CAD'], 
  favorites: ['USD', 'BRL', 'EUR'],
  history: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  
  fromCurrency: 'USD',
  toCurrency: 'BRL',
  amount: 1,

  // AÇÕES LOCAIS
  setFromCurrency: (code) => set({ fromCurrency: code }),
  setToCurrency: (code) => set({ toCurrency: code }),
  setAmount: (amount) => set({ amount }),

  toggleFavorite: (code) => set((state) => {
      const isFavorite = state.favorites.includes(code);
      if (isFavorite) {
          return { favorites: state.favorites.filter(fav => fav !== code) };
      } else {
          return { favorites: [...state.favorites, code] };
      }
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

  // ------------------------------------
  // AÇÃO ASSÍNCRONA (API) - CORRIGIDA
  // ------------------------------------
  fetchRates: async () => {
    if (get().isLoading) return; 

    set({ isLoading: true, error: null });
    
    try {
      const apiData: Record<string, ApiRateData> = await fetchAllRatesFromAPI();
      
      // >>> AJUSTE CHAVE: Inicializa com USD: 1 para a taxa base
      const newRates: Record<string, number> = { USD: 1 }; 
      const newCodes = new Set<string>(['USD']); // Inclui USD nas moedas disponíveis

      // Processamento dos dados: 
      // Transforma o par (ex: "USDBRL") na moeda cotada (ex: "BRL": 5.20)
      for (const key in apiData) {
        const rateData = apiData[key];
        
        const rateValue = parseFloat(rateData.bid);
        
        if (!isNaN(rateValue) && rateValue > 0) {
          // Armazena a taxa usando o código de destino (BRL, EUR, etc.)
          newRates[rateData.codein] = rateValue;
          
          // Adiciona ambas as moedas (USD e BRL, por exemplo)
          newCodes.add(rateData.code); 
          newCodes.add(rateData.codein);
        }
      }
      
      const availableCurrencies = Array.from(newCodes).sort();
      
      set({ 
        rates: newRates, // Usa o formato { "BRL": 5.20, "USD": 1, ... }
        availableCurrencies,
        isLoading: false,
        lastUpdated: Date.now(),
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao buscar taxas.";
      set({ error: errorMessage, isLoading: false, lastUpdated: Date.now() });
    }
  },
}));