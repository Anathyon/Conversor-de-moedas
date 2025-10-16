import { type ApiRateData } from '../types';

// Variáveis de ambiente
const EXCHANGE_RATE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EXCHANGE_RATE_API_KEY = import.meta.env.VITE_API_KEY;
const FRANKFURTER_API_BASE_URL = "https://api.frankfurter.app"; 


/* -------------------------------------------------------------------------- */
/* 1. EXCHANGE RATE API (TAXAS INSTANTÂNEAS)   */
/* -------------------------------------------------------------------------- */

/**
 * Interface para a resposta da ExchangeRate-API (Taxas Instantâneas)
 */
interface ExchangeRatesResponse {
    result: string;
    'conversion_rates': Record<string, number>;
    'error-type'?: string; 
}

/**
 * Busca todas as taxas de câmbio disponíveis com base na moeda USD usando a ExchangeRate-API.
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
        
        return data.conversion_rates;

    } catch (error) {
        console.error("Erro ao buscar todas as taxas instantâneas:", error);
        throw error; 
    }
}


/* -------------------------------------------------------------------------- */
/* 2. FRANKFURTER API (TAXAS HISTÓRICAS) - Versão Robusta */
/* -------------------------------------------------------------------------- */

/**
 * Interface para a resposta da Frankfurter API (Histórico Diário)
 * @example
 * { "amount": 1, "base": "USD", "date": "2023-01-01", "rates": { "BRL": 5.20 } }
 */
interface FrankfurterHistoryResponse {
    amount: number;
    base: string;
    date: string;
    rates: Record<string, number>; // Ex: { "BRL": 5.20 }
}

/**
 * Busca taxas históricas dos últimos 7 dias usando a Frankfurter API. 
 * Se uma data falhar, ela é ignorada para não quebrar o gráfico.
 *
 * NOTA: A Frankfurter API não suporta criptomoedas (como BTC). Para estes pares, 
 * o erro "Nenhum dado histórico encontrado" será retornado.
 * * @param fromCode Moeda de origem (ex: 'USD')
 * @param toCode Moeda de destino (ex: 'BRL')
 * @returns Um array de objetos ApiRateData com os dados disponíveis.
 */
export async function fetchHistoricalRates(fromCode: string, toCode: string): Promise<ApiRateData[]> {
    
    // A Frankfurter API usa EUR como base padrão se 'from' for omitido e não suporta criptomoedas.
    if (fromCode === 'BTC' || toCode === 'BTC') {
        throw new Error("Falha na API Histórica (404): moedas digitais (BTC) não são suportadas pela Frankfurter API.");
    }

    if (!FRANKFURTER_API_BASE_URL) {
        throw new Error("A URL da API de Histórico (Frankfurter) não está configurada.");
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
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        const dateStringFrankfurter = `${year}-${month}-${day}`; // Formato YYYY-MM-DD
        const dateStringApiRateData = `${year}/${month}/${day}`; // Formato YYYY/MM/DD

        // Endpoint Frankfurter: /{data}?from={moeda_base}&to={moeda_destino}
        const url = `${FRANKFURTER_API_BASE_URL}/${dateStringFrankfurter}?from=${fromCode}&to=${toCode}`;

        // Cria uma Promise para cada dia de busca
        const promise = fetch(url)
            .then(async (response) => {
                const data: FrankfurterHistoryResponse = await response.json();

                // 1. Falha na resposta (404, 500, etc.)
                // A Frankfurter retorna 200 OK mesmo quando não há dados, mas rates[toCode] estará vazio
                if (!response.ok || !data.rates || data.rates[toCode] === undefined) {
                    // Lança um erro interno para o .catch
                    throw new Error(`Falha para ${dateStringFrankfurter}. Resposta: ${response.statusText}`);
                }
                
                // 2. Sucesso: A taxa de conversão direta
                const conversionRate = data.rates[toCode];

                if (conversionRate !== undefined && conversionRate !== 0) {
                    const timestamp = date.getTime().toString(); 

                    historicalData.push({
                        code: fromCode,
                        codein: toCode,
                        timestamp: timestamp,
                        name: `${fromCode}/${toCode}`,
                        high: conversionRate.toString(), 
                        low: conversionRate.toString(), 
                        bid: conversionRate.toString(), // Taxa de conversão direta
                        create_date: dateStringApiRateData,
                        rate: conversionRate.toString(),
                    });
                } else {
                     throw new Error(`Taxa de ${fromCode}/${toCode} não disponível no dia ${dateStringFrankfurter}.`);
                }
            })
            .catch((error) => {
                // Loga o erro, mas permite que o loop continue para os outros dias.
                // Isso evita que um dia de erro quebre todo o gráfico.
                console.warn(`[API Histórica - Aviso] Não foi possível obter dados para ${fromCode}/${toCode} para um dia:`, error.message);
            });
        
        fetchPromises.push(promise);
    }

    // Espera que todas as 7 requisições terminem (com sucesso ou com falha)
    await Promise.all(fetchPromises); 

    // Se nenhum dado for encontrado após todas as tentativas
    if (historicalData.length === 0) {
        throw new Error(`Falha na API Histórica: Nenhum dado histórico encontrado para ${fromCode}/${toCode} nas 7 datas verificadas.`);
    }

    // Retorna os dados que foram coletados com sucesso, ordenados por data
    return historicalData.sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));
}