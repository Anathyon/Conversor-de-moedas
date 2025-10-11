// src/types/index.ts

// O formato de cada item no histórico de conversões
export interface ConversionHistoryItem {
  id: string; // Um ID único (ex: UUID ou timestamp)
  amount: number;
  fromCode: string; // Moeda de origem (ex: "BRL")
  toCode: string; // Moeda de destino (ex: "USD")
  result: number;
  rate: number; // A taxa utilizada (ex: 5.20)
  timestamp: number;
}

// O formato de retorno da sua API no endpoint de taxas (Ajuste conforme a sua API)
export interface ApiRateData {
    code: string; // Ex: "USD"
    codein: string; // Ex: "BRL"
    bid: string; // O valor da cotação como string (será convertido para number no store)
    name: string;
    // ... adicione outros campos que sua API retornar se for usá-los
}