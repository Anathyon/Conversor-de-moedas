import React, { useEffect, useRef, useState } from 'react';
import { useCurrencyStore } from '../../store/currencyStore'; 
import { calculateConversion } from '../../utils/conversion';
import { format } from 'date-fns';

const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  return (
    <div 
      className="rounded-lg shadow-[0_0.25rem_0.375rem_-0.0625rem_rgba(0,0,0,0.1)] bg-gray-50 dark:bg-gray-700 transition-colors duration-300"
      style={{
        padding: '1.25rem',
        marginBottom: '1rem'
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

const HistoryCard: React.FC = () => {
  const history = useCurrencyStore(state => state.history);
  const clearHistory = useCurrencyStore(state => state.clearHistory);
  
  return (
    <div style={{ marginTop: '2rem' }}>
      <Card title="Histórico de conversões">
        {history.length > 0 ? (
          <>
            <button 
              onClick={clearHistory}
              className="text-sm text-red-500 bg-transparent border-none cursor-pointer hover:text-red-700 transition-colors"
              style={{
                marginBottom: '0.625rem',
                padding: 0
              }}
            >
              Limpar Histórico
            </button>
            <ul 
              className="list-none"
              style={{ padding: 0, margin: 0 }}
            >
              {history.map(item => (
                <li 
                  key={item.id} 
                  className="border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300"
                  style={{
                    paddingTop: '0.25rem',
                    paddingBottom: '0.25rem'
                  }}
                >
                  <strong>{item.amount.toFixed(2)}</strong> {item.fromCode} → <strong>{item.result.toFixed(2)}</strong> {item.toCode} 
                  <span 
                    className="text-xs text-gray-500 dark:text-gray-400"
                    style={{ marginLeft: '0.5rem' }}
                  >
                    (Taxa: {item.rate.toFixed(4)})
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p 
            className="text-gray-500 dark:text-gray-400"
            style={{ padding: '0.25rem' }}
          >
            Suas conversões aparecerão aqui com detalhes de taxa e horário.
          </p>
        )}
      </Card>
    </div>
  );
};

export const Converter: React.FC = () => {
  
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

  const inputClass = "border rounded-lg w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 box-border";
  const labelClass = "block text-sm font-medium text-gray-500 dark:text-gray-400";
  const buttonBaseClass = "rounded-lg border-none cursor-pointer text-sm font-medium transition-colors flex items-center justify-center w-full";

  return (
    <div className="w-full"> 
      <Card title="Conversão de Moedas">
        
        {result !== null && (
          <div 
            className="text-center"
            style={{ marginBottom: '1rem' }}
          >
            <p 
              className="text-xl text-gray-700 dark:text-gray-300"
              style={{ margin: 0 }}
            >
              <strong>{amount.toFixed(2)}</strong> {fromCurrency} =
            </p>
            <p 
              className="text-5xl font-extrabold text-emerald-600"
              style={{
                marginTop: '0.25rem',
                margin: 0 // overriding m-0 and mt-1 conflict
              }}
            >
              {result.toFixed(2)} {toCurrency}
            </p>
            {conversionRate !== null && (
              <p 
                className="text-sm text-gray-500 dark:text-gray-400"
                style={{
                  marginTop: '0.5rem',
                  margin: 0
                }}
              >
                Taxa utilizada: 1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
              </p>
            )}
          </div>
        )}
        
        <div>
          <div 
            className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
            style={{
              gap: 'clamp(0.75rem, 2vw, 0.9375rem)',
              paddingTop: 'clamp(1rem, 3vw, 1.25rem)',
              paddingBottom: 'clamp(1rem, 3vw, 1.25rem)'
            }}
          >
            <div>
              <label 
                className={labelClass}
                style={{ marginBottom: '0.25rem' }}
              >
                Montante
              </label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className={inputClass}
                style={{ padding: '0.5rem' }}
              />
            </div>
            
            <div>
              <label 
                className={labelClass}
                style={{ marginBottom: '0.25rem' }}
              >
                De
              </label>
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className={inputClass}
                style={{ padding: '0.5rem' }}
              >
                {availableCurrencies.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label 
                className={labelClass}
                style={{ marginBottom: '0.25rem' }}
              >
                Para
              </label>
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className={inputClass}
                style={{ padding: '0.5rem' }}
              >
                {availableCurrencies.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
          </div>

          <div 
            className="flex flex-col items-stretch"
            style={{
              gap: 'clamp(0.5rem, 2vw, 0.625rem)',
              marginTop: 'clamp(0.5rem, 2vw, 0.625rem)',
              marginBottom: 'clamp(0.5rem, 2vw, 0.625rem)'
            }}
          >
            <button 
              onClick={handleConvert} 
              disabled={isLoading || Object.keys(rates).length === 0}
              className={`${buttonBaseClass} ${isLoading || Object.keys(rates).length === 0 
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              style={{
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                paddingLeft: '1.25rem',
                paddingRight: '1.25rem'
              }}
            >
              {isLoading ? 'Calculando...' : '⟳ Converter'}
            </button>
            
            <button 
              onClick={fetchRates}
              disabled={isLoading}
              className={`${buttonBaseClass} ${isLoading 
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
              style={{
                paddingTop: '0.625rem',
                paddingBottom: '0.625rem',
                paddingLeft: '1.25rem',
                paddingRight: '1.25rem'
              }}
            >
              {isLoading ? 'Atualizando...' : 'Atualizar taxas'}
            </button>
            
            <span 
              className="text-sm text-gray-500 dark:text-gray-400"
              style={{ marginLeft: '1rem' }}
            >
              Última atualização: {lastUpdated ? format(lastUpdated, 'HH:mm:ss') : '--'}
            </span>
          </div>

          {((error || (Object.keys(rates).length === 0 && !isLoading))) && (
            <div 
              className={`rounded border ${error ? 'border-red-200 bg-red-100 text-red-800' : 'border-yellow-200 bg-yellow-50 text-yellow-800'}`}
              style={{
                padding: '0.75rem',
                marginTop: '0.9375rem',
                marginBottom: '0.9375rem'
              }}
            >
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