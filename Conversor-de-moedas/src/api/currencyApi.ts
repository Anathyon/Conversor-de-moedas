import { type ApiRateData } from '../types';

// Variáveis de ambiente (assumindo que VITE_COINGECKO_BASE_URL foi removida)
const EXCHANGE_RATE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EXCHANGE_RATE_API_KEY = import.meta.env.VITE_API_KEY;

/* -------------------------------------------------------------------------- */
/* 1. EXCHANGE RATE API (TAXAS INSTANTÂNEAS)   */
/* -------------------------------------------------------------------------- */

/**
 * Interface para a resposta da ExchangeRate-API (Taxas Instantâneas)
 * @example
 * { "result": "success", "conversion_rates": { "USD": 1, "BRL": 5.2, ... } }
 */
interface ExchangeRatesResponse {
    result: string;
    'conversion_rates': Record<string, number>;
    'error-type'?: string; // Para capturar erros da API
}

/**
 * Busca todas as taxas de câmbio disponíveis com base na moeda USD usando a ExchangeRate-API.
 * @returns Um objeto onde a chave é o código da moeda e o valor é a taxa (baseada em USD).
 */
export async function fetchAllRatesFromAPI(): Promise<Record<string, number>> {
    
    // Endpoint para taxas instantâneas baseadas em USD
    const url = `${EXCHANGE_RATE_API_BASE_URL}/${EXCHANGE_RATE_API_KEY}/latest/USD`; 
    
    if (!EXCHANGE_RATE_API_BASE_URL || !EXCHANGE_RATE_API_KEY) {
        throw new Error("A chave e/ou URL da API de Câmbio Instantâneo não estão configuradas corretamente.");
    }

    try {
        const response = await fetch(url);
        const data: ExchangeRatesResponse = await response.json(); 
        
        if (!response.ok || data.result !== 'success') {
            const errorType = data['error-type'] || response.statusText;
            console.error("Erro API Instantânea:", response.status, data);
            throw new Error(`Falha na API Instantânea (${response.status}): ${errorType}. Verifique a chave da API.`);
        }
        
        // Retorna apenas as taxas de conversão (ex: { "USD": 1, "BRL": 5.2, ... })
        return data.conversion_rates;

    } catch (error) {
        console.error("Erro ao buscar todas as taxas instantâneas:", error);
        throw error; 
    }
}


/* -------------------------------------------------------------------------- */
/* 2. EXCHANGE RATE API (TAXAS HISTÓRICAS) - Versão Robusta */
/* -------------------------------------------------------------------------- */

/**
 * Interface para a resposta da ExchangeRate-API (Histórico)
 * @example
 * { "result": "success", "conversion_rate": 5.20 }
 */
interface ExchangeRateHistoryResponse {
    result: string;
    'conversion_rate'?: number; // A taxa de conversão direta
    'error-type'?: string;
}

/**
 * Busca taxas históricas dos últimos 7 dias. Se uma data falhar, ela é ignorada para não quebrar o gráfico.
 * @param fromCode Moeda de origem (ex: 'USD')
 * @param toCode Moeda de destino (ex: 'BRL')
 * @returns Um array de objetos ApiRateData com os dados disponíveis.
 */
export async function fetchHistoricalRates(fromCode: string, toCode: string): Promise<ApiRateData[]> {
    
    if (!EXCHANGE_RATE_API_BASE_URL || !EXCHANGE_RATE_API_KEY) {
        throw new Error("A chave e/ou URL da API de Histórico não estão configuradas corretamente.");
    }

    const historicalData: ApiRateData[] = [];
    const daysToFetch = 7;
    const today = new Date();
    
    const fetchPromises: Promise<void>[] = [];

    // Loop para buscar dados dos últimos 7 dias (excluindo hoje)
    for (let i = 1; i <= daysToFetch; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i); // Volta i dias
        
        const year = date.getFullYear();
        // Os meses (0-11) e dias (1-31) devem ter 2 dígitos
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        const dateString = `${year}/${month}/${day}`;
        // Endpoint: /history/code_base/year/month/day
        const url = `${EXCHANGE_RATE_API_BASE_URL}/${EXCHANGE_RATE_API_KEY}/history/${fromCode}/${year}/${month}/${day}`;

        // Cria uma Promise para cada dia de busca
        const promise = fetch(url)
            .then(async (response) => {
                const data: ExchangeRateHistoryResponse = await response.json();

                // 1. Falha na resposta (404, 500, etc.)
                if (!response.ok || data.result !== 'success') {
                    const errorType = data['error-type'] || response.statusText;
                    // Lança um erro interno, que será pego pelo .catch abaixo (ignorando o dia)
                    throw new Error(`Falha para ${dateString}: ${errorType}`);
                }
                
                // 2. Sucesso: Se a taxa de conversão estiver presente
                if (data.conversion_rate !== undefined) {
                    const timestamp = date.getTime().toString(); // Timestamp em milissegundos

                    // Adiciona o novo campo 'rate' que foi adicionado em ApiRateData
                    historicalData.push({
                        code: fromCode,
                        codein: toCode,
                        timestamp: timestamp,
                        name: `${fromCode}/${toCode}`,
                        high: data.conversion_rate.toString(), 
                        low: data.conversion_rate.toString(), 
                        bid: data.conversion_rate.toString(), 
                        create_date: dateString,
                        rate: data.conversion_rate.toString(),
                    });
                }
            })
            .catch((error) => {
                // Loga o erro, mas permite que o loop continue para os outros dias.
                console.warn(`[API Histórica - Aviso] Não foi possível obter dados para ${fromCode}/${toCode} para um dia:`, error.message);
            });
        
        fetchPromises.push(promise);
    }

    // Espera que todas as 7 requisições terminem (com sucesso ou com falha)
    await Promise.all(fetchPromises); 

    // Se nenhum dado for encontrado, lançamos o erro final.
    if (historicalData.length === 0) {
        throw new Error(`Falha na API Histórica: Nenhum dado histórico encontrado para ${fromCode}/${toCode} nas 7 datas verificadas.`);
    }

    // Retorna os dados que foram coletados com sucesso, ordenados por data
    return historicalData.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
}
