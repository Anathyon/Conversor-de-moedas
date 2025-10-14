import { type ApiRateData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Função existente: Busca todas as taxas de câmbio (uso: Converter)
export async function fetchAllRatesFromAPI(): Promise<Record<string, ApiRateData>> {
    
    // Endpoint para buscar todas as taxas (AwesomeAPI usa "/all" para o JSON completo)
    const endpoint = "/all"; 
    const url = `${API_BASE_URL}${endpoint}`; 
    
    if (!API_BASE_URL) {
        console.error("Erro de Configuração:", "A variável VITE_API_BASE_URL não está configurada.");
        throw new Error("A URL da API de Câmbio não está configurada. Verifique o arquivo .env.local.");
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`, 
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Resposta de erro sem corpo JSON.' }));
            console.error("Erro na API de Câmbio:", response.status, errorData);
            throw new Error(`Falha na API: ${response.status} - ${errorData.message || response.statusText}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error("Erro ao tentar conectar à API de Câmbio:", error);
        throw new Error(`Não foi possível buscar as taxas de câmbio: ${error instanceof Error ? error.message : "Erro de rede/conexão."}`);
    }
}

export async function fetchHistoricalRates(fromCode: string, toCode: string): Promise<ApiRateData[]> {
    
    // Endpoint para buscar as taxas dos últimos 30 dias para o par específico.
    const endpoint = `/daily/${fromCode}-${toCode}/30`; 
    const url = `${API_BASE_URL}${endpoint}`; 
    
    if (!API_BASE_URL) {
        throw new Error("A URL da API de Câmbio não está configurada.");
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            // Tenta ler o corpo como JSON para capturar a mensagem de erro da Awesome API
            const errorText = await response.text(); 
            let errorMessage = response.statusText;
            
            try {
                const errorJson = JSON.parse(errorText);
                // Se a API retornar um objeto com 'message' (como no caso 404), usamos ele.
                if (errorJson && errorJson.message) {
                    errorMessage = errorJson.message;
                }
            } catch (e) {
                console.error(e)
                
            }
            
            console.error("Erro Histórico API:", response.status, errorText);
            
            // Lança um erro mais limpo, usando a mensagem da API se disponível.
            throw new Error(`Falha na API Histórica (${response.status}): ${errorMessage}`);
        }
        
        const historicalArray = await response.json(); 
        
        if (!Array.isArray(historicalArray)) {
             // Este caso pode ocorrer se a API retornar sucesso, mas o corpo não for um array.
             throw new Error("Formato de dados históricos inválido da API. Esperado um array.");
        }
        
        return historicalArray as ApiRateData[]; 

    } catch (error) {
        console.error("Erro ao buscar dados históricos:", error);
        // O Store já está preparado para receber este erro e exibir uma mensagem amigável.
        throw error; // Propaga o erro capturado ou criado acima.
    }
}