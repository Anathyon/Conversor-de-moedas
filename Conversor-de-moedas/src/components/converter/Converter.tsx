import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCurrencyStore } from '../../store/currencyStore'; 
import { calculateConversion } from '../../utils/conversion';
import { format } from 'date-fns'; 
import { ChartCard } from './ChartCard'; 

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

// ----------------------------------------------------
// Componente Histórico simples
// ----------------------------------------------------
const HistoryCard: React.FC = () => {
    const history = useCurrencyStore(state => state.history);
    const clearHistory = useCurrencyStore(state => state.clearHistory);
    
    return (
        <div style={{ marginTop: '2rem' }}> {/* Espaçamento entre o Conversor e o Histórico */}
            <Card title="Histórico de conversões">
                {history.length > 0 ? (
                    <>
                        <button 
                            onClick={clearHistory}
                            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                            style={{ marginBottom: '0.625rem' }} // 10px
                        >
                            Limpar Histórico
                        </button>
                        <ul className="space-y-2">
                            {history.map(item => (
                                <li 
                                    key={item.id}
                                    className="border-b border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300"
                                    style={{ padding: '0.3125rem 0' }} // 5px
                                >
                                    <strong>{item.amount.toFixed(2)}</strong> {item.fromCode} → <strong>{item.result.toFixed(2)}</strong> {item.toCode} 
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                        (Taxa: {item.rate.toFixed(4)})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400" style={{ padding: '0.3125rem' }}>
                        Suas conversões aparecerão aqui com detalhes de taxa e horário.
                    </p>
                )}
            </Card>
        </div>
    );
}

// ----------------------------------------------------
// Componente principal Converter
// ----------------------------------------------------
export const Converter: React.FC = () => {
    // --- CONEXÃO COM O STORE (Seleção Otimizada) ---
    const fetchRatesFromStore = useCurrencyStore(state => state.fetchRates);
    const fetchRates = useCallback(() => { fetchRatesFromStore(); }, [fetchRatesFromStore]);
    
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
    
    // --- ESTADO LOCAL E CORREÇÃO DE LOOP ---
    const [result, setResult] = useState<number | null>(null);
    const [conversionRate, setConversionRate] = useState<number | null>(null);
    const hasFetched = useRef(false); 

    useEffect(() => {
        // Chama fetchRates apenas uma vez na montagem se as taxas estiverem vazias
        if (Object.keys(rates).length === 0 && !hasFetched.current) {
            hasFetched.current = true; 
            fetchRates();
        }
    }, [rates, fetchRates]); 

    // --- LÓGICA DE CONVERSÃO ---
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
    
    // --- ESTILOS ---
    const formContainerStyle: React.CSSProperties = { 
        padding: '1.25rem 0', 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '0.9375rem' // 15px
    };
    const inputStyle: React.CSSProperties = { padding: '0.5rem' };
    const controlsStyle: React.CSSProperties = { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.625rem', // 10px
        marginTop: '0.625rem', // 10px
        marginBottom: '0.625rem' // 10px
    };
    const buttonPadding: React.CSSProperties = { padding: '0.625rem 1.25rem' }; // 10px 20px
    const alertStyle: React.CSSProperties = { 
        padding: '0.75rem',
        // ... (cores do alerta mantidas) ...
        borderRadius: '0.3125rem',
        marginTop: '0.9375rem', 
        marginBottom: '0.9375rem',
        border: `1px solid ${error ? '#fecaca' : '#ffeeba'}`,
    };

    // --- RENDERIZAÇÃO ---
    return (
        // ESSENCIAL: Ocupa 2 colunas de 3 no layout
        <div className="lg:col-span-2 w-full"> 
            <Card title="Conversão de Moedas">
                
                {/* Resultado da Conversão */}
                {result !== null && (
                    <div className="text-center" style={{ marginBottom: '1rem' }}>
                        <p className="text-xl text-gray-700 dark:text-gray-300">
                            <strong>{amount.toFixed(2)}</strong> {fromCurrency} =
                        </p>
                        <p className="text-5xl font-extrabold text-green-600 dark:text-green-300" style={{ marginTop: '0.25rem' }}>
                            {result.toFixed(2)} {toCurrency}
                        </p>
                        {conversionRate !== null && (
                            <p className="text-sm text-gray-500 dark:text-gray-400" style={{ marginTop: '0.5rem' }}>
                                Taxa utilizada: 1 {fromCurrency} = {conversionRate.toFixed(4)} {toCurrency}
                            </p>
                        )}
                    </div>
                )}
                
                {/* Formulário de conversão */}
                <div className="flex flex-col">
                    <div style={formContainerStyle}>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" style={{ marginBottom: '0.25rem' }}>Montante</label>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                className="w-full border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500" 
                                style={inputStyle}
                            />
                        </div>
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" style={{ marginBottom: '0.25rem' }}>De</label>
                            <select 
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="w-full border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500" 
                                style={inputStyle}>
                                {availableCurrencies.map((code) => (
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" style={{ marginBottom: '0.25rem' }}>Para</label>
                            <select 
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="w-full border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500" 
                                style={inputStyle}>
                                {availableCurrencies.map((code) => (
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Botões e Mensagens */}
                    <div className="flex items-center" style={controlsStyle}>
                        <button onClick={handleConvert} disabled={isLoading || Object.keys(rates).length === 0}
                            className="flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300 dark:disabled:bg-green-700" 
                            style={buttonPadding}>
                            {isLoading ? 'Calculando...' : '⟳ Converter'}
                        </button>
                        
                        <button 
                            onClick={fetchRates}
                            disabled={isLoading}
                            className="flex items-center justify-center bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 disabled:bg-gray-200 dark:disabled:bg-gray-700" 
                            style={buttonPadding}>
                            {isLoading ? 'Atualizando...' : 'Atualizar taxas'}
                        </button>
                        <span className="text-sm text-gray-500 dark:text-gray-400" style={{ marginLeft: '1rem' }}>
                            Última atualização: {lastUpdated ? format(lastUpdated, 'HH:mm:ss') : '--'}
                        </span>
                    </div>

                    {/* Mensagem de Erro/Aviso */}
                    {((error || (Object.keys(rates).length === 0 && !isLoading))) && (
                        <div style={{...alertStyle, backgroundColor: error ? '#fee2e2' : '#fffbe6', color: error ? '#991b1b' : '#856404' }}>
                            {error 
                                ? `Erro ao carregar: ${error}`
                                : 'Aviso: As taxas ainda não foram carregadas. Clique em "Atualizar taxas".'
                            }
                        </div>
                    )}
                </div>
            </Card>
            
            <HistoryCard />
            
            {/* NOVO: Componente do Gráfico Histórico */}
            <ChartCard />
            
        </div>
    );
};