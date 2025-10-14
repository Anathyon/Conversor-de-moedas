import React, { useState } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';

// Card component definition
const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    const cardClasses = `
        rounded-lg shadow-md 
        bg-gray-50 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20
    `;
    const cardStyle: React.CSSProperties = { 
        padding: '1.25rem',
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

// --- Subcomponente: Lista de Favoritos (Card de Cima) ---
const FavoritesList: React.FC = () => {
    const favorites = useCurrencyStore(state => state.favorites);
    
    return (
        <>
            <p className="text-gray-600 dark:text-gray-400" style={{ marginBottom: '1rem' }}>
                Adicione moedas à lista de favoritas para acessá-las rapidamente.
            </p>
            <div className="flex flex-wrap gap-2">
                {favorites.length > 0 ? (
                    favorites.map(code => (
                        <span 
                            key={code} 
                            className="px-3 py-1 text-sm rounded-full bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
                        >
                            {code}
                        </span>
                    ))
                ) : (
                    <p className="text-sm italic text-gray-500 dark:text-gray-400">Nenhuma moeda favorita adicionada.</p>
                )}
            </div>
        </>
    );
}

// --- Subcomponente: Gerenciar Favoritos (Card de Baixo) ---
const ManageFavorites: React.FC = () => {
    const availableCurrencies = useCurrencyStore(state => state.availableCurrencies);
    const favorites = useCurrencyStore(state => state.favorites);
    const toggleFavorite = useCurrencyStore(state => state.toggleFavorite);
    const [selectedCode, setSelectedCode] = useState(availableCurrencies[0] || 'USD');

    const handleToggle = () => {
        if (selectedCode) {
            toggleFavorite(selectedCode);
        }
    };
    
    const isFavorite = favorites.includes(selectedCode);
    const buttonText = isFavorite ? 'Remover' : 'Adicionar';
    const buttonClass = isFavorite 
        ? "bg-red-500 hover:bg-red-600" 
        : "bg-green-500 hover:bg-green-600";
        
    const selectStyle: React.CSSProperties = { padding: '0.5rem', marginRight: '0.5rem' };

    return (
        <div>
            <p className="text-gray-600 dark:text-gray-400" style={{ marginBottom: '1rem' }}>
                Adicione ou remova moedas da sua lista para facilitar o acesso.
            </p>
            <div className="flex items-center">
                <select
                    value={selectedCode}
                    onChange={(e) => setSelectedCode(e.target.value)}
                    className="border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500"
                    style={selectStyle}
                >
                    {availableCurrencies.map((code) => (
                        <option key={code} value={code}>{code}</option>
                    ))}
                </select>
                <button
                    onClick={handleToggle}
                    className={`text-white rounded-lg transition-colors ${buttonClass}`}
                    style={{ padding: '0.625rem 1rem' }}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

// --- Wrapper Principal dos Favoritos ---
export const FavoritesWrapper: React.FC = () => {
    return (
        // ESSENCIAL: Ocupa 1 coluna (1/3) do grid principal E usa flexbox vertical para empilhar seus filhos.
        <div className="lg:col-span-1 w-full flex flex-col" style={{ gap: '2rem' }}> 
            
            <Card title="Moedas favoritas">
                <FavoritesList />
            </Card>

            <Card title="Gerenciar favoritas">
                <ManageFavorites />
            </Card>
            
        </div>
    );
};