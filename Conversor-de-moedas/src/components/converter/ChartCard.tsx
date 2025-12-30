import React, { useEffect, memo } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';
import { useUiStore } from '../../store/uiStore';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'; 

/**
 * Wrapper for Card UI consistency
 */
const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  return (
    <div 
      className="rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] bg-gray-50 dark:bg-gray-700 min-h-[380px] transition-colors duration-300"
      style={{
        padding: '1.25rem',
        marginTop: '2rem'
      }}
    >
      <h2 
        className="text-xl font-semibold text-emerald-600"
        style={{
          margin: 0,
          marginBottom: '1rem'
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
};

/**
 * ChartCard Component.
 * Displays historical currency data using Recharts.
 * Memoized to prevent unnecessary re-renders when parent state changes but props/store data remain same.
 */
export const ChartCard: React.FC = memo(() => {
  const { theme } = useUiStore();
  
  const fromCurrency = useCurrencyStore(state => state.fromCurrency);
  const toCurrency = useCurrencyStore(state => state.toCurrency);
  const historicalData = useCurrencyStore(state => state.historicalData);
  const isHistoryLoading = useCurrencyStore(state => state.isHistoryLoading);
  const fetchHistoricalData = useCurrencyStore(state => state.fetchHistoricalData);
  const error = useCurrencyStore(state => state.error);
  
  // Busca dados históricos quando o par de moedas muda
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchHistoricalData(fromCurrency, toCurrency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency, toCurrency]); 
  
  // Prepara os dados para o gráfico
  const chartData = historicalData
    .map((item, index) => {
      const rate = parseFloat(item.bid);
      if (isNaN(rate)) return null;

      return {
        timestamp: Date.now() - (historicalData.length - index) * 24 * 60 * 60 * 1000,
        rate: rate,
      };
    })
    .filter((item): item is { timestamp: number; rate: number } => item !== null)
    .sort((a, b) => a.timestamp - b.timestamp);

  const title = `Cotação Histórica: ${fromCurrency} / ${toCurrency} (7 Pontos)`;

  // Verifica se o erro é específico do histórico
  const isHistoricalError = error && error.includes("Falha na API Histórica");
  
  // Formata timestamp para data legível
  const dateFormatter = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  return (
    <Card title={title}>
      
      {/* Estado de carregamento */}
      {isHistoryLoading && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500 dark:text-gray-400">Carregando dados históricos...</p>
        </div>
      )}
      
      {/* Estado de erro */}
      {!isHistoryLoading && isHistoricalError && (
        <div 
          className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-md relative"
          style={{ padding: '1rem' }}
        >
          <p 
            className="font-bold"
            style={{ 
              marginBottom: '0.25rem',
              margin: 0
            }}
          >
            Não foi possível carregar o histórico de {fromCurrency} / {toCurrency}.
          </p>
          <p 
            className="text-sm"
            style={{ margin: 0 }}
          >
            <span className="font-semibold">Motivo:</span> {error}
          </p>
          <p 
            className="text-xs opacity-80"
            style={{
              marginTop: '0.5rem',
              margin: 0
            }}
          >
            Tente outro par de moedas. Pares com BTC ou moedas menos comuns podem não ter histórico disponível.
          </p>
        </div>
      )}
      
      {/* Estado de sucesso e gráfico */}
      {!isHistoryLoading && !isHistoricalError && chartData.length > 0 && (
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis 
                dataKey="timestamp"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                interval="preserveStartEnd"
                tickCount={7} 
                tickFormatter={dateFormatter}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickFormatter={value => value.toFixed(4)} 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(4), 'Taxa']} 
                labelFormatter={(label) => `Data: ${dateFormatter(Number(label))}`} 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                  borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  borderRadius: '0.375rem',
                  color: theme === 'dark' ? '#ffffff' : '#111827'
                }}
                labelStyle={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#059669" 
                dot={false} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Estado de dados vazios */}
      {!isHistoryLoading && !isHistoricalError && chartData.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500 dark:text-gray-400">
            Selecione um par de moedas para visualizar o histórico de 7 pontos de dados.
          </p>
        </div>
      )}
    </Card>
  );
});