import { create } from 'zustand';
import { type ConversionHistoryItem, type ApiRateData } from '../types'; 
import { fetchAllRatesFromAPI, fetchHistoricalRates } from '../api/currencyApi';

// ------------------------------------
// 1. ESTADO
// ------------------------------------
interface CurrencyState {
  // A chave e o codigo da moeda (ex: "BRL"), o valor e a taxa (numero) baseada em USD.
  rates: Record<string, number>;
  availableCurrencies: string[];
  favorites: string[];
  history: ConversionHistoryItem[];
  
  isLoading: boolean; // para taxas instantaneas
  error: string | null; // Usado para erros de conversao instantanea E historica
  lastUpdated: number | null;
  
  // ESTADO GRAFICO
  historicalData: ApiRateData[];
  isHistoryLoading: boolean;
}

// ------------------------------------
// 2. AÇÕES
// ------------------------------------
interface CurrencyActions {
  // API
  fetchRates: () => Promise<void>;
  fetchHistoricalData: (fromCode: string, toCode: string) => Promise<void>; 
  
  // Favorites
  toggleFavorite: (code: string) => void;
  
  // History
  addHistoryItem: (item: Omit<ConversionHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  
  // Conversao (Input do Formulario)
  setFromCurrency: (code: string) => void;
  setToCurrency: (code: string) => void;
  setAmount: (amount: number) => void;
  
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

// ------------------------------------
// 3. CRIACAO DO STORE
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
  
  // ESTADO INICIAL GRAFICO
  historicalData: [],
  isHistoryLoading: false,
  
  fromCurrency: 'USD',
  toCurrency: 'BRL',
  amount: 1,

  // ACOES LOCAIS (Mantidas)
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
  // ACAO ASSINCRONA (API TAXAS INSTANTANEAS)
  // ------------------------------------
  fetchRates: async () => {
    if (get().isLoading) return; 

    set({ isLoading: true, error: null }); // Limpa erros anteriores de qualquer tipo
    
    try {
      // fetchAllRatesFromAPI ja esta atualizada para ExchangeRate-API
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
      // Este erro afeta a conversao instantanea
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao buscar taxas instantaneas.";
      set({ error: errorMessage, isLoading: false, lastUpdated: Date.now() });
    }
  },

  // ------------------------------------
  // ACAO ASSINCRONA (API TAXAS HISTORICAS)
  // ------------------------------------
  fetchHistoricalData: async (fromCode, toCode) => {
      // Limpa o erro e o loading do historico ANTES de tentar buscar
      set({ isHistoryLoading: true, error: null, historicalData: [] }); 
      try {
          // fetchHistoricalRates agora busca 7 pontos de dados simulados
          const data = await fetchHistoricalRates(fromCode, toCode);
          
          set({ 
              historicalData: data, 
              isHistoryLoading: false,
              error: null // Garante que o erro seja limpo se o historico for bem-sucedido
          });
          
      } catch (err) {
          // Armazena a mensagem de erro especifica para a UI do grafico
          const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao buscar historico.";
          set({ 
              error: `Falha na API Historica: ${errorMessage}`, 
              isHistoryLoading: false, 
              historicalData: [] 
          });
      }
  },
}));