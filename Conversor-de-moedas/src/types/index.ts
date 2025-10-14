// Interface base para os dados de taxa retornados pela API (histórico e instantâneo)
// Adaptada para ser compatível com dados da ExchangeRate-API (histórico)
export interface ApiRateData {
    // Campos da API Original (mantidos por compatibilidade ou para uso futuro)
    code: string;
    codein: string;
    name: string;
    high: string;
    low: string;
    bid: string;
    create_date: string;
    
    // Novo campo para o histórico (timestamp da data de cotação)
    timestamp: string; 

    // NOVO CAMPO CORRIGIDO para o gráfico usar a taxa de conversão direta
    rate: string; 
}

// Interface para um item de histórico de conversão
export interface ConversionHistoryItem {
    id: string;
    fromCode: string;
    toCode: string;
    amount: number;
    result: number;
    // O campo 'rate' armazena a taxa de conversão usada (ex: 5.20)
    rate: number; 
    timestamp: number;
}
