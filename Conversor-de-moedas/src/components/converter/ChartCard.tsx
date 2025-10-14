import React, { useEffect } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';
// IMPORTACOES NECESSARIAS DO RECHARTS
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'; 


// Componente auxiliar de Card
const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    const cardClasses = `
        rounded-lg shadow-md 
        bg-gray-50 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20
    `;
    const cardStyle: React.CSSProperties = { 
        padding: '1.25rem', 
        minHeight: '380px', // Garante que o card nao encolha demais
        marginTop: '2rem'
    };
    const titleStyle: React.CSSProperties = { marginBottom: '1rem' }; 

    return (
        <div className={cardClasses} style={cardStyle}>
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400" style={titleStyle}>
                {title}
            </h2>
            {children}
        </div>
    );
}

export const ChartCard: React.FC = () => {
    const fromCurrency = useCurrencyStore(state => state.fromCurrency);
    const toCurrency = useCurrencyStore(state => state.toCurrency);
    const historicalData = useCurrencyStore(state => state.historicalData);
    const isHistoryLoading = useCurrencyStore(state => state.isHistoryLoading);
    const fetchHistoricalData = useCurrencyStore(state => state.fetchHistoricalData);
    const error = useCurrencyStore(state => state.error);
    
    // Efeito para buscar dados historicos sempre que o par de moedas muda
    useEffect(() => {
        if (fromCurrency && toCurrency) {
            // Chama a acao do store que busca 7 pontos de dados simulados
            fetchHistoricalData(fromCurrency, toCurrency);
        }
    }, [fromCurrency, toCurrency, fetchHistoricalData]);
    
    // Preparacao dos dados para o grafico
    const chartData = historicalData
        .map((item, index) => {
            // Garante que 'bid' e um numero valido antes de mapear
            const rate = parseFloat(item.bid);
            if (isNaN(rate)) return null;

            return {
                // Usa timestamp simulado baseado no indice
                timestamp: Date.now() - (historicalData.length - index) * 24 * 60 * 60 * 1000,
                // Usa o 'bid' (taxa de conversao) como o valor Y
                rate: rate,
            };
        })
        .filter((item): item is { timestamp: number; rate: number } => item !== null) // Remove entradas nulas
        .sort((a, b) => a.timestamp - b.timestamp); // Garante ordenacao por data (timestamp)

    const title = `Cotacao Historica: ${fromCurrency} / ${toCurrency} (7 Pontos)`;

    // Verifica se o erro e especifico do historico
    const isHistoricalError = error && error.includes("Falha na API Historica");
    
    // Funcao para formatar o timestamp (milissegundos) para uma string de data legivel
    const dateFormatter = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('pt-BR');
    };

    return (
        <Card title={title}>
            
            {/* 1. ESTADO DE CARREGAMENTO */}
            {isHistoryLoading && (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">Carregando dados historicos...</p>
                </div>
            )}
            
            {/* 2. ESTADO DE ERRO */}
            {!isHistoryLoading && isHistoricalError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-300">
                    <p className="font-bold mb-1">Nao foi possivel carregar o historico de {fromCurrency} / {toCurrency}.</p>
                    <p className="text-sm">
                        <span className="font-semibold">Motivo:</span> {error}
                    </p>
                    <p className="text-xs mt-2 opacity-80">
                        Tente outro par de moedas. Pares com BTC ou moedas menos comuns podem nao ter historico disponivel.
                    </p>
                </div>
            )}
            
            {/* 3. ESTADO DE SUCESSO E GRAFICO */}
            {!isHistoryLoading && !isHistoricalError && chartData.length > 0 && (
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                            {/* dataKey deve ser o campo timestamp (ms) */}
                            <XAxis 
                                dataKey="timestamp" // Usa o valor numerico (timestamp)
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                interval="preserveStartEnd"
                                tickCount={7} 
                                tickFormatter={dateFormatter} // Formata o timestamp para data
                            />
                            <YAxis 
                                domain={['auto', 'auto']} 
                                tickFormatter={value => value.toFixed(4)} 
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                            />
                            <Tooltip 
                                formatter={(value: number) => [value.toFixed(4), 'Taxa']} 
                                // Formata o label (timestamp) para a data
                                labelFormatter={(label) => `Data: ${dateFormatter(Number(label))}`} 
                                contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="rate" 
                                stroke="#10b981" 
                                dot={false} 
                                strokeWidth={2} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
            
            {/* 4. ESTADO DE DADOS VAZIOS (se nao houver erro, mas a lista estiver vazia) */}
            {!isHistoryLoading && !isHistoricalError && chartData.length === 0 && (
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500 dark:text-gray-400">
                        Selecione um par de moedas para visualizar o historico de 7 pontos de dados.
                    </p>
                </div>
            )}
        </Card>
    );
};