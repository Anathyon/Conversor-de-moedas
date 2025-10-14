import { type ApiRateData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export async function fetchAllRatesFromAPI(): Promise<Record<string, ApiRateData>> {
  
  // CORREÇÃO: Endpoint para buscar todas as taxas (AwesomeAPI usa "/all" para o JSON completo)
  const endpoint = "/all"; 
  
  // O URL final deve ser: "https://economia.awesomeapi.com.br/json" + "/all"
  const url = `${API_BASE_URL}${endpoint}`; 
  
  if (!API_BASE_URL) {
      console.error("Erro de Configuração:", "A variável VITE_API_BASE_URL não está configurada.");
      throw new Error("A URL da API de Câmbio não está configurada. Verifique o arquivo .env.local.");
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // Token mantido para segurança, embora a AwesomeAPI seja pública e não o utilize
        'Authorization': `Bearer ${API_KEY}`, 
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Resposta de erro sem corpo JSON.' }));
      console.error("Erro na API de Câmbio:", response.status, errorData);
      throw new Error(`Falha na API: ${response.status} - ${errorData.message || response.statusText}`);
    }
    
    // O retorno é o objeto de pares de moedas (ex: { "USDBRL": {...} })
    return await response.json();
    
  } catch (error) {
    console.error("Erro ao tentar conectar à API de Câmbio:", error);
    throw new Error(`Não foi possível buscar as taxas de câmbio: ${error instanceof Error ? error.message : "Erro de rede/conexão."}`);
  }
}