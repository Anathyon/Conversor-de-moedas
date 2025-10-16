import React, { useEffect, useRef, useState } from 'react';
import { useCurrencyStore } from '../../store/currencyStore'; 
import { useUiStore } from '../../store/uiStore';
import { calculateConversion } from '../../utils/conversion';
import { format } from 'date-fns';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  const { theme } = useUiStore();
  
  const cardStyle: React.CSSProperties = {
    borderRadius: '0.5rem',
    boxShadow: '0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1)',
    backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
    padding: '1.25rem',
    marginBottom: '1rem'
  };
  
  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#059669',
    marginBottom: '1rem',
    margin: 0
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{title}</h2>
      {children}
    </div>
  );
};

const HistoryCard: React.FC = () => {
  const history = useCurrencyStore(state => state.history);
  const clearHistory = useCurrencyStore(state => state.clearHistory);
  const { theme } = useUiStore();
  
  const containerStyle: React.CSSProperties = {
    marginTop: '2rem'
  };
  
  const buttonStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '0.625rem',
    padding: 0
  };
  
  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };
  
  const itemStyle: React.CSSProperties = {
    borderBottom: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
    fontSize: '0.875rem',
    color: theme === 'dark' ? '#d1d5db' : '#374151',
    padding: '0.3125rem 0'
  };
  
  const emptyStyle: React.CSSProperties = {
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    padding: '0.3125rem'
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

export const Converter: React.FC = () => {
  const { theme } = useUiStore();
  
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
  
  const [result, setResult] = useState<number | null>(null);
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const hasFetched = useRef(false); 

  useEffect(() => {
    if (Object.keys(rates).length === 0 && !hasFetched.current) {
      hasFetched.current = true; 
      fetchRates();
    }
  }, [fetchRates, rates]);

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
  
  const containerStyle: React.CSSProperties = {
    width: '100%'
  };
  
  const resultStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '1rem'
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
    marginTop: '0.25rem',
    margin: 0
  };
  
  const rateTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    marginTop: '0.5rem',
    margin: 0
  };
  
  const formStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'clamp(0.75rem, 2vw, 0.9375rem)',
    padding: 'clamp(1rem, 3vw, 1.25rem) 0'
  };
  
  const inputStyle: React.CSSProperties = {
    padding: '0.5rem',
    border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '0.5rem',
    backgroundColor: theme === 'dark' ? '#4b5563' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#111827',
    width: '100%',
    boxSizing: 'border-box'
  };
  
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    marginBottom: '0.25rem'
  };
  
  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 'clamp(0.5rem, 2vw, 0.625rem)',
    marginTop: 'clamp(0.5rem, 2vw, 0.625rem)',
    marginBottom: 'clamp(0.5rem, 2vw, 0.625rem)'
  };
  
  const buttonStyle: React.CSSProperties = {
    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(1rem, 3vw, 1.25rem)',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
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
    padding: '0.75rem',
    borderRadius: '0.3125rem',
    marginTop: '0.9375rem',
    marginBottom: '0.9375rem',
    border: `1px solid ${error ? '#fecaca' : '#ffeeba'}`,
    backgroundColor: error ? '#fee2e2' : '#fffbe6',
    color: error ? '#991b1b' : '#856404'
  };
  
  const lastUpdateStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    marginLeft: '1rem'
  };

  return (
    <div style={containerStyle}> 
      <Card title="Conversão de Moedas">
        
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