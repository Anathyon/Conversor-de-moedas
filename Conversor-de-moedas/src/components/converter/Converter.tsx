import React, { useEffect, useRef, useState } from 'react';
import { useCurrencyStore } from '../../store/currencyStore'; 
import { useUiStore } from '../../store/uiStore';
import { calculateConversion } from '../../utils/conversion';
import { format } from 'date-fns';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  const { theme } = useUiStore();
  
  const cardStyle: React.CSSProperties = {
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
    padding: '20px',
    marginBottom: '16px'
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

// Componente Histórico
const HistoryCard: React.FC = () => {
  const history = useCurrencyStore(state => state.history);
  const clearHistory = useCurrencyStore(state => state.clearHistory);
  const { theme } = useUiStore();
  
  const containerStyle: React.CSSProperties = {
    marginTop: '32px'
  };
  
  const buttonStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '10px',
    padding: 0
  };
  
  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };
  
  const itemStyle: React.CSSProperties = {
    borderBottom: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
    fontSize: '14px',
    color: theme === 'dark' ? '#d1d5db' : '#374151',
    padding: '5px 0'
  };
  
  const emptyStyle: React.CSSProperties = {
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    padding: '5px'
  };
  
  return (
    <div style={containerStyle}>
      <Card title="Histórico de conversões">
        {history.length > 0 ? (
          <>
            <button 
              onClick={clearHistory}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ef4444';
              }}
            >
              Limpar Histórico
            </button>
            <ul style={listStyle}>
              {history.map(item => (
                <li key={item.id} style={itemStyle}>
                  <strong>{item.amount.toFixed(2)}</strong> {item.fromCode} → <strong>{item.result.toFixed(2)}</strong> {item.toCode} 
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                    (Taxa: {item.rate.toFixed(4)})
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p style={emptyStyle}>
            Suas conversões aparecerão aqui com detalhes de taxa e horário.
          </p>
        )}
      </Card>
    </div>
  );
};

// Componente principal Converter
export const Converter: React.FC = () => {
  const { theme } = useUiStore();
  
  // Conexão com o store
  const fetchRates = useCurrencyStore(state => state.fetchRates);
  const setFromCurrency = useCurrencyStore(state => state.setFromCurrency);
  const setToCurrency = useCurrencyStore(state => state.setToCurrency);
  const setAmount = useCurrencyStore(state => state.setAmount);
  const addHistoryItem = useCurrencyStore(state => state.addHistoryItem);
  
  const availableCurrencies = useCurrencyStore(state => state.availableCurrencies);
  const rates = useCurrencyStore(state => state.rates);
  const isLoading = useCurrencyStore(state => state.isLoading);
  const error = useCurrencyStore(state => state.error);
  const lastUpdated = useCurrencyStore(state => state.lastUpdated);
  const fromCurrency = useCurrencyStore(state => state.fromCurrency);
  const toCurrency = useCurrencyStore(state => state.toCurrency);
  const amount = useCurrencyStore(state => state.amount);
  
  // Estado local
  const [result, setResult] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const hasFetched = useRef(false); 

  // Busca taxas apenas uma vez na montagem
  useEffect(() => {
    if (Object.keys(rates).length === 0 && !hasFetched.current) {
      hasFetched.current = true; 
      fetchRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sem dependências para evitar loops

  // Lógica de conversão
  const handleConvert = () => {
    if (!amount || amount <= 0 || !fromCurrency || !toCurrency || Object.keys(rates).length === 0) return;
    
    const conversion = calculateConversion(amount, fromCurrency, toCurrency, rates);
    
    if (conversion.success) {
      setResult(conversion.result);
      setConversionRate(conversion.rate);
      
      addHistoryItem({
        amount,
        fromCode: fromCurrency,
        toCode: toCurrency,
        result: conversion.result,
        rate: conversion.rate,
      });
    } else {
      setResult(null);
      setConversionRate(null);
    }
  };
  
  // Estilos
  const containerStyle: React.CSSProperties = {
    gridColumn: 'span 2',
    width: '100%'
  };
  
  const resultStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '16px'
  };
  
  const resultTextStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    color: theme === 'dark' ? '#d1d5db' : '#374151',
    margin: 0
  };
  
  const resultValueStyle: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#059669',
    marginTop: '4px',
    margin: 0
  };
  
  const rateTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    marginTop: '8px',
    margin: 0
  };
  
  const formStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '15px',
    padding: '20px 0'
  };
  
  const inputStyle: React.CSSProperties = {
    padding: '8px',
    border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '0.5rem',
    backgroundColor: theme === 'dark' ? '#4b5563' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#111827',
    width: '100%',
    boxSizing: 'border-box'
  };
  
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    marginBottom: '4px'
  };
  
  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px',
    marginBottom: '10px'
  };
  
  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#059669',
    color: '#ffffff'
  };
  
  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    color: theme === 'dark' ? '#e5e7eb' : '#1f2937'
  };
  
  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#d1d5db',
    color: '#9ca3af',
    cursor: 'not-allowed'
  };
  
  const alertStyle: React.CSSProperties = {
    padding: '12px',
    borderRadius: '5px',
    marginTop: '15px',
    marginBottom: '15px',
    border: `1px solid ${error ? '#fecaca' : '#ffeeba'}`,
    backgroundColor: error ? '#fee2e2' : '#fffbe6',
    color: error ? '#991b1b' : '#856404'
  };
  
  const lastUpdateStyle: React.CSSProperties = {
    fontSize: '14px',
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    marginLeft: '16px'
  };

  return (
    <div style={containerStyle}> 
      <Card title="Conversão de Moedas">
        
        {/* Resultado da Conversão */}
        {result !== null && (
          <div style={resultStyle}>
            <p style={resultTextStyle}>
              <strong>{amount.toFixed(2)}</strong> {fromCurrency} =
            </p>
            <p style={resultValueStyle}>
              {result.toFixed(2)} {toCurrency}
            </p>
            {conversionRate !== null && (
              <p style={rateTextStyle}>
                Taxa utilizada: 1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
              </p>
            )}
          </div>
        )}
        
        {/* Formulário de conversão */}
        <div>
          <div style={formStyle}>
            <div>
              <label style={labelStyle}>Montante</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                style={inputStyle}
              />
            </div>
            
            <div>
              <label style={labelStyle}>De</label>
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                style={inputStyle}
              >
                {availableCurrencies.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={labelStyle}>Para</label>
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                style={inputStyle}
              >
                {availableCurrencies.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botões e Mensagens */}
          <div style={controlsStyle}>
            <button 
              onClick={handleConvert} 
              disabled={isLoading || Object.keys(rates).length === 0}
              style={isLoading || Object.keys(rates).length === 0 ? disabledButtonStyle : primaryButtonStyle}
              onMouseEnter={(e) => {
                if (!isLoading && Object.keys(rates).length > 0) {
                  e.currentTarget.style.backgroundColor = '#047857';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && Object.keys(rates).length > 0) {
                  e.currentTarget.style.backgroundColor = '#059669';
                }
              }}
            >
              {isLoading ? 'Calculando...' : '⟳ Converter'}
            </button>
            
            <button 
              onClick={fetchRates}
              disabled={isLoading}
              style={isLoading ? disabledButtonStyle : secondaryButtonStyle}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? '#6b7280' : '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#d1d5db';
                }
              }}
            >
              {isLoading ? 'Atualizando...' : 'Atualizar taxas'}
            </button>
            
            <span style={lastUpdateStyle}>
              Última atualização: {lastUpdated ? format(lastUpdated, 'HH:mm:ss') : '--'}
            </span>
          </div>

          {/* Mensagem de Erro/Aviso */}
          {((error || (Object.keys(rates).length === 0 && !isLoading))) && (
            <div style={alertStyle}>
              {error 
                ? `Erro ao carregar: ${error}`
                : 'Aviso: As taxas ainda não foram carregadas. Clique em "Atualizar taxas".'
              }
            </div>
          )}
        </div>
      </Card>
      
      <HistoryCard />
    </div>
  );
};