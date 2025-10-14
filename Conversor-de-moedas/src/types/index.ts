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

// ----------------------------------------------------
// NOVO: O formato de retorno da sua API no endpoint de taxas
// (Baseado no formato comum de APIs de cotação como a AwesomeAPI)
// ----------------------------------------------------
export interface ApiRateData {
    // Exemplo: No par USDBRL, 'code' seria USD e 'codein' seria BRL
    code: string; 
    codein: string; 
    
    // O valor da cotação (bid) vem como string e é convertido no store
    bid: string; 
    
    name: string; // Nome completo do par (ex: "Dólar Americano/Real Brasileiro")
    high: string; // Máxima
    low: string; // Mínima
    // Adicione outros campos se necessário, mas estes são suficientes para a conversão:
}