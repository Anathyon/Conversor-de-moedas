import React, { useEffect } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';
// IMPORTAÇÕES NECESSÁRIAS DO RECHARTS
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'; 


// Componente auxiliar de Card - (Copie a definição do seu Converter.tsx se necessário, ou importe)
const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    const cardClasses = `
        rounded-lg shadow-md 
        bg-gray-50 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20
    `;
    const cardStyle: React.CSSProperties = { 
        padding: '1.25rem', // 20px
    };
    const titleStyle: React.CSSProperties = { marginBottom: '1rem' }; // 16px

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
    
    // Efeito para buscar dados históricos
    useEffect(() => {
        // Busca os dados sempre que as moedas de conversão mudarem
        if (fromCurrency && toCurrency) {
            fetchHistoricalData(fromCurrency, toCurrency);
        }
    }, [fromCurrency, toCurrency, fetchHistoricalData]);
    
    // Preparação dos dados para o gráfico
    const chartData = historicalData
        .map((item, index) => ({
            // Como ApiRateData não tem timestamp, usamos índice para simular datas
            date: new Date(Date.now() - (historicalData.length - index) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), 
            rate: parseFloat(item.bid),
        }))
        .reverse(); // Inverte para ter a data mais antiga na esquerda

    const title = `Cotação Histórica: ${fromCurrency} / ${toCurrency} (30 Dias)`;

    return (
        <div style={{ marginTop: '2rem' }}>
            <Card title={title}>
                {isHistoryLoading && (
                    <p className="text-gray-500 dark:text-gray-400">Carregando dados históricos...</p>
                )}
                
                {!isHistoryLoading && chartData.length > 0 && (
                    // --- ÁREA DE RENDERIZAÇÃO DO GRÁFICO REAL (RECHARTS) ---
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                                {/* Exibe a data no eixo X. Usamos filter para evitar sobreposição de muitos labels. */}
                                <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    interval="preserveStartEnd"
                                    // Adiciona um filtro para mostrar apenas 5-7 labels
                                    tickCount={7} 
                                />
                                {/* Exibe a taxa no eixo Y. Formata para 4 casas decimais. */}
                                <YAxis 
                                    domain={['auto', 'auto']} 
                                    tickFormatter={value => value.toFixed(4)} 
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                />
                                {/* Tooltip ao passar o mouse */}
                                <Tooltip 
                                    formatter={(value: number) => [value.toFixed(4), 'Taxa']} 
                                    labelFormatter={(label) => `Data: ${label}`} 
                                    contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="rate" 
                                    stroke="#10b981" // Cor verde do seu app
                                    dot={false} // Remove os pontos de dados
                                    strokeWidth={2} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    // --------------------------------------------------------
                )}
                
                {!isHistoryLoading && chartData.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">
                        Dados históricos não encontrados para este par ou houve um erro na API.
                    </p>
                )}
            </Card>
        </div>
    );
};