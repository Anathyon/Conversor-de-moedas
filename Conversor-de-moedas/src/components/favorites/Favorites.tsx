import React, { useState } from 'react';
import { useCurrencyStore } from '../../store/currencyStore'; 

// ----------------------------------------------------
// Componente auxiliar de Card reutilizado
// ----------------------------------------------------
interface CardProps {
    title: string;
    children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children, title }) => {
    // Classes Tailwind para aparência do card (fundo, sombra, cantos)
    const cardClasses = `
        rounded-lg shadow-md
        bg-gray-50 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20
    `;
    
    // Estilos rígidos (padding, margin-bottom) via objeto style
    const cardStyle: React.CSSProperties = { 
        padding: '1.25rem', // 20px
        // Define margem inferior para separar os dois cards do Favorites
        marginBottom: title.includes("favoritas") ? '2rem' : '0' 
    };
    
    const titleStyle: React.CSSProperties = { marginBottom: '0.9375rem' }; // 15px

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
// Componente principal Favorites
// ----------------------------------------------------
export const Favorites: React.FC = () => {
    // Conexão com o Store
    const availableCurrencies = useCurrencyStore(state => state.availableCurrencies);
    const favoriteCurrencies = useCurrencyStore(state => state.favorites);
    const addFavorite = useCurrencyStore(state => state.addFavorite);
    const removeFavorite = useCurrencyStore(state => state.removeFavorite);

    // Estado Local para gerenciar a moeda selecionada no <select>
    const [selectedCurrency, setSelectedCurrency] = useState('');

    // Lógica para determinar a ação
    const isFavorite = favoriteCurrencies.includes(selectedCurrency);

    const handleManageFavorite = () => {
        if (!selectedCurrency) return;
        
        if (isFavorite) {
            removeFavorite(selectedCurrency);
        } else {
            addFavorite(selectedCurrency);
        }
        setSelectedCurrency(''); 
    };

    // --- ESTILOS ---
    
    // Estilo para o container principal (usamos 'flex flex-col' do Tailwind e 'gap' via style)
    const containerStyle: React.CSSProperties = {
        gap: '2rem', // 32px
    };
    // Estilo para a lista de moedas favoritas (tags)
    const listStyle: React.CSSProperties = { 
        gap: '0.5rem', // 8px
        marginTop: '1rem', // 16px
    };
    // Estilo para as tags de moeda
    const tagStyle: React.CSSProperties = {
        padding: '0.25rem 0.75rem', // 4px 12px
        borderRadius: '9999px', // full
    };
    // Estilo para o container de gerenciamento
    const manageContainerStyle: React.CSSProperties = { 
        gap: '0.625rem', // 10px
        marginTop: '1rem', // 16px
    };
    // Estilo para o input/select
    const inputStyle: React.CSSProperties = { 
        padding: '0.5rem', // 8px
        width: '66.6667%' // 2/3
    };
    // Estilo para o padding do botão
    const buttonPadding: React.CSSProperties = { padding: '0.5rem 0.9375rem' }; // 8px 15px

    return (
        // Ocupa 1 coluna de 3 no layout (definido no App.tsx)
        <div className="lg:col-span-1 w-full flex flex-col" style={containerStyle}>
            
            {/* CARD: Moedas favoritas (Visualização) */}
            <Card title="Moedas favoritas">
                <p className="text-gray-500 dark:text-gray-400">
                    Adicione moedas à lista de favoritas para acessá-las rapidamente.
                </p>
                
                {/* Lista visual das moedas favoritas */}
                <div className="flex flex-wrap" style={listStyle}>
                    {favoriteCurrencies.length > 0 ? (
                        favoriteCurrencies.map(code => (
                            <span 
                                key={code}
                                // Cores e fonte via Tailwind
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

            {/* CARD: Gerenciar favoritas (Adicionar/Remover) */}
            <Card title="Gerenciar favoritas">
                <p className="text-gray-500 dark:text-gray-400">
                    Selecione uma moeda para adicionar ou remover da sua lista.
                </p>
                
                {/* Interface de gerenciamento */}
                <div className="flex items-center" style={manageContainerStyle}>
                     <select 
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500"
                        style={inputStyle}
                     >
                        <option value="">Selecione a Moeda</option>
                        {/* Popula com todas as moedas disponíveis */}
                        {availableCurrencies.map(code => (
                            <option key={code} value={code}>
                                {code}
                            </option>
                        ))}
                     </select>
                     <button 
                        onClick={handleManageFavorite}
                        disabled={!selectedCurrency}
                        // Cores do botão via Tailwind
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