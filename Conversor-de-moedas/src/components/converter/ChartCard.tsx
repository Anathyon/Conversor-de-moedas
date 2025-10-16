import React, { useEffect } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';
import { useUiStore } from '../../store/uiStore';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'; 

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  const { theme } = useUiStore();
  
  const cardStyle: React.CSSProperties = {
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
    padding: '20px',
    minHeight: '380px',
    marginTop: '32px'
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#059669',
    marginBottom: '16px',
    margin: 0
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{title}</h2>
      {children}
    </div>
  );
};

export const ChartCard: React.FC = () => {
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
  }, [fromCurrency, toCurrency]); // Sem fetchHistoricalData para evitar loop
  
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

  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  };
  
  const loadingTextStyle: React.CSSProperties = {
    color: theme === 'dark' ? '#9ca3af' : '#6b7280'
  };
  
  const errorStyle: React.CSSProperties = {
    backgroundColor: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
    border: `1px solid ${theme === 'dark' ? '#991b1b' : '#fecaca'}`,
    color: theme === 'dark' ? '#fca5a5' : '#991b1b',
    padding: '16px',
    borderRadius: '0.375rem',
    position: 'relative'
  };
  
  const errorTitleStyle: React.CSSProperties = {
    fontWeight: 'bold',
    marginBottom: '4px',
    margin: 0
  };
  
  const errorTextStyle: React.CSSProperties = {
    fontSize: '14px',
    margin: 0
  };
  
  const errorSubtextStyle: React.CSSProperties = {
    fontSize: '12px',
    marginTop: '8px',
    opacity: 0.8,
    margin: 0
  };
  
  const chartContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '300px'
  };
  
  const emptyStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  };
  
  const emptyTextStyle: React.CSSProperties = {
    color: theme === 'dark' ? '#9ca3af' : '#6b7280'
  };

  return (
    <Card title={title}>
      
      {/* Estado de carregamento */}
      {isHistoryLoading && (
        <div style={loadingStyle}>
          <p style={loadingTextStyle}>Carregando dados históricos...</p>
        </div>
      )}
      
      {/* Estado de erro */}
      {!isHistoryLoading && isHistoricalError && (
        <div style={errorStyle}>
          <p style={errorTitleStyle}>
            Não foi possível carregar o histórico de {fromCurrency} / {toCurrency}.
          </p>
          <p style={errorTextStyle}>
            <span style={{ fontWeight: '600' }}>Motivo:</span> {error}
          </p>
          <p style={errorSubtextStyle}>
            Tente outro par de moedas. Pares com BTC ou moedas menos comuns podem não ter histórico disponível.
          </p>
        </div>
      )}
      
      {/* Estado de sucesso e gráfico */}
      {!isHistoryLoading && !isHistoricalError && chartData.length > 0 && (
        <div style={chartContainerStyle}>
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
                  border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '0.375rem'
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
        <div style={emptyStyle}>
          <p style={emptyTextStyle}>
            Selecione um par de moedas para visualizar o histórico de 7 pontos de dados.
          </p>
        </div>
      )}
    </Card>
  );
};