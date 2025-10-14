import React, { useEffect } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';
// Instale e importe sua biblioteca de gráficos aqui (ex: Recharts)
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; 


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
    const chartData = historicalData.map((item, index) => ({
        // Como ApiRateData não tem timestamp, usamos índice para simular datas
        date: new Date(Date.now() - (historicalData.length - index) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), 
        rate: parseFloat(item.bid),
    })).reverse(); 

    const title = `Cotação Histórica: ${fromCurrency} / ${toCurrency} (30 Dias)`;

    return (
        <div style={{ marginTop: '2rem' }}>
            <Card title={title}>
                {isHistoryLoading && (
                    <p className="text-gray-500 dark:text-gray-400">Carregando dados históricos...</p>
                )}
                
                {!isHistoryLoading && chartData.length > 0 && (
                    // --- ÁREA DE RENDERIZAÇÃO DO GRÁFICO ---
                    <div style={{ width: '100%', height: 300 }}>
                        {/* !!! IMPORTANTE !!!
                            SUBSTITUA ESTE PELA RENDERIZAÇÃO DO SEU COMPONENTE DE GRÁFICO (Recharts, Chart.js, etc.) 
                        */}
                        <p className="flex items-center justify-center h-full text-lg font-medium text-green-600 dark:text-green-400 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg">
                           GRÁFICO DE LINHA: {fromCurrency} vs {toCurrency}
                        </p>
                    </div>
                )}
                
                {!isHistoryLoading && chartData.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400">
                        Dados históricos não encontrados para este par ou período.
                    </p>
                )}
            </Card>
        </div>
    );
};