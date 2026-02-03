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
 * Busca taxas históricas dos últimos 7 dias usando a Frankfurter API. 
 * Se uma data falhar, ela é ignorada para não quebrar o gráfico.
 *
 * NOTA: A Frankfurter API não suporta criptomoedas (como BTC). Para estes pares, 
 * o erro "Nenhum dado histórico encontrado" será retornado.
 * * @param fromCode Moeda de origem (ex: 'USD')
 * @param toCode Moeda de destino (ex: 'BRL')
 * @returns Um array de objetos ApiRateData com os dados disponíveis.
 */
/**
 * Busca taxas históricas dos últimos 7 dias usando a Frankfurter API. 
 * Utiliza o endpoint de série temporal para reduzir requisições.
 *
 * NOTA: A Frankfurter API não suporta criptomoedas (como BTC). Para estes pares, 
 * o erro "Nenhum dado histórico encontrado" será retornado.
 * @param fromCode Moeda de origem (ex: 'USD')
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

    const today = new Date();
    const endDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const startDateDate = new Date();
    startDateDate.setDate(today.getDate() - 7);
    const startDate = startDateDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // Endpoint Frankfurter Time Series: /start_date..end_date?from=...&to=...
    const url = `${FRANKFURTER_API_BASE_URL}/${startDate}..${endDate}?from=${fromCode}&to=${toCode}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            // Se a API retornar erro (ex: moeda não encontrada)
            throw new Error(data.message || `Erro na API Frankfurter: ${response.status}`);
        }

        if (!data.rates) {
            throw new Error("Nenhum dado histórico encontrado.");
        }

        // data.rates é objeto: { "2023-01-01": { "BRL": 5.20 }, ... }
        const historicalData: ApiRateData[] = Object.entries(data.rates).map(([dateStr, rates]: [string, any]) => {
            const conversionRate = rates[toCode];

            if (conversionRate === undefined) return null;

            // Converter data YYYY-MM-DD para timestamp e formato de exibição
            const dateObj = new Date(dateStr);
            // Ajuste simples de fuso horário para garantir que a data fique correta visualmente, 
            // já que a API retorna data UTC/Local sem hora.
            // Para timestamp único, usamos getTime()

            return {
                code: fromCode,
                codein: toCode,
                timestamp: dateObj.getTime().toString(),
                name: `${fromCode}/${toCode}`,
                high: conversionRate.toString(),
                low: conversionRate.toString(),
                bid: conversionRate.toString(),
                create_date: dateStr.replace(/-/g, '/'), // YYYY/MM/DD
                rate: conversionRate.toString(),
            };
        }).filter((item): item is ApiRateData => item !== null)
            .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

        if (historicalData.length === 0) {
            throw new Error(`Falha na API Histórica: Nenhum dado histórico encontrado para ${fromCode}/${toCode}.`);
        }

        return historicalData;

    } catch (error) {
        console.error("Erro ao buscar histórico (série temporal):", error);
        throw error;
    }
}