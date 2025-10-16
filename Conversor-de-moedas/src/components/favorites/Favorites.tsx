import React, { useState } from 'react';
import { useCurrencyStore } from '../../store/currencyStore'; 

interface CardProps {
    title: string;
    children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children, title }) => {
    const cardClasses = `
        rounded-lg shadow-md
        bg-gray-50 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20
    `;
    
    const cardStyle: React.CSSProperties = { 
        padding: '1.25rem',
        marginBottom: title.includes("favoritas") ? '2rem' : '0' 
    };
    
    const titleStyle: React.CSSProperties = { marginBottom: '0.9375rem' };

    return (
        <div className={cardClasses} style={cardStyle}>
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400" style={titleStyle}>
                {title}
            </h2>
            {children}
        </div>
    );
}


export const Favorites: React.FC = () => {
    const availableCurrencies = useCurrencyStore(state => state.availableCurrencies);
    const favoriteCurrencies = useCurrencyStore(state => state.favorites);
    const toggleFavorite = useCurrencyStore(state => state.toggleFavorite);

    const [selectedCurrency, setSelectedCurrency] = useState('');

    const isFavorite = favoriteCurrencies.includes(selectedCurrency);

    const handleManageFavorite = () => {
        if (!selectedCurrency) return;
        
        toggleFavorite(selectedCurrency);
        setSelectedCurrency(''); 
    };

    const containerStyle: React.CSSProperties = {
        gap: '2rem',
    };
    const listStyle: React.CSSProperties = { 
        gap: '0.5rem',
        marginTop: '1rem',
    };
    const tagStyle: React.CSSProperties = {
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
    };
    const manageContainerStyle: React.CSSProperties = { 
        gap: 'clamp(0.5rem, 2vw, 0.625rem)',
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column'
    };
    const inputStyle: React.CSSProperties = { 
        padding: 'clamp(0.5rem, 2vw, 0.5rem)',
        width: '100%'
    };
    const buttonPadding: React.CSSProperties = { 
        padding: 'clamp(0.5rem, 2vw, 0.5rem) clamp(0.75rem, 3vw, 0.9375rem)',
        width: '100%'
    };

    return (
        <div className="w-full flex flex-col" style={containerStyle}>
            
            <Card title="Moedas favoritas">
                <p className="text-gray-500 dark:text-gray-400">
                    Adicione moedas à lista de favoritas para acessá-las rapidamente.
                </p>
                
                <div className="flex flex-wrap" style={listStyle}>
                    {favoriteCurrencies.length > 0 ? (
                        favoriteCurrencies.map(code => (
                            <span 
                                key={code}
                                className="text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                style={tagStyle}
                            >
                                {code}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-400 italic">Nenhuma favorita adicionada.</p>
                    )}
                </div>
            </Card>

            <Card title="Gerenciar favoritas">
                <p className="text-gray-500 dark:text-gray-400">
                    Selecione uma moeda para adicionar ou remover da sua lista.
                </p>
                
                <div style={manageContainerStyle}>
                     <select 
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500"
                        style={inputStyle}
                     >
                        <option value="">Selecione a Moeda</option>
                        {availableCurrencies.map(code => (
                            <option key={code} value={code}>
                                {code}
                            </option>
                        ))}
                     </select>
                     <button 
                        onClick={handleManageFavorite}
                        disabled={!selectedCurrency}
                        className={`flex-1 text-white rounded-lg transition-colors ${isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} disabled:bg-gray-400 dark:disabled:bg-gray-700`}
                        style={buttonPadding}
                     >
                        {isFavorite ? 'Remover' : 'Adicionar'}
                     </button>
                </div>
            </Card>

        </div>
    );
};