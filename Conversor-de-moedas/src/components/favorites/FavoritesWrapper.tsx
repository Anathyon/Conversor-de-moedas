import React, { useState } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';
import { Heart, Search, X } from 'lucide-react'; 

// Componente auxiliar de Card
interface CardProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const Card: React.FC<CardProps> = ({ children, title, subtitle }) => {
    return (
        <div 
          className="rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800 w-full transition-colors duration-300"
          style={{ padding: '1.25rem' }}
        >
            <h2 
              className="text-xl font-semibold text-emerald-600"
              style={{
                margin: 0,
                marginBottom: '0.25rem'
              }}
            >
              {title}
            </h2>
            <p 
              className="text-sm text-gray-500 dark:text-gray-400"
              style={{
                margin: 0,
                marginBottom: '1rem'
              }}
            >
              {subtitle}
            </p>
            {children}
        </div>
    );
};

// Componente para a lista de moedas favoritas
const FavoritesList: React.FC = () => {
    const favorites = useCurrencyStore(state => state.favorites);
    const setFromCurrency = useCurrencyStore(state => state.setFromCurrency);
    const setToCurrency = useCurrencyStore(state => state.setToCurrency);
    const fromCurrency = useCurrencyStore(state => state.fromCurrency);
    const toCurrency = useCurrencyStore(state => state.toCurrency);

    // Lógica simplificada para clique
    const handleClick = (code: string) => {
        if (code === toCurrency) {
            setFromCurrency(code);
        } else if (code === fromCurrency) {
            setToCurrency(code);
        } else {
            setToCurrency(code);
        }
    };

    const getButtonClass = (code: string) => {
        const baseClass = "rounded-full font-medium transition-all shadow-sm text-sm text-white border-none cursor-pointer transform hover:scale-105 hover:shadow-md";
        if (code === fromCurrency) {
            return `${baseClass} bg-indigo-600 ring-2 ring-indigo-300`;
        } else if (code === toCurrency) {
            return `${baseClass} bg-emerald-600 ring-2 ring-emerald-300`;
        } else {
            return `${baseClass} bg-gray-500 dark:bg-gray-600`;
        }
    };

    return (
        <div 
          className="flex flex-wrap"
          style={{
            gap: '0.5rem',
            marginTop: '1rem'
          }}
        >
            {favorites.length > 0 ? (
                favorites.map(code => (
                    <button
                        key={code}
                        onClick={() => handleClick(code)}
                        className={getButtonClass(code)}
                        style={{
                          paddingTop: '0.5rem',
                          paddingBottom: '0.5rem',
                          paddingLeft: '1rem',
                          paddingRight: '1rem'
                        }}
                    >
                        {code}
                    </button>
                ))
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma moeda favorita adicionada. Adicione abaixo!</p>
            )}
        </div>
    );
};

// Componente para gerenciamento de favoritos
const FavoriteManager: React.FC = () => {
    const availableCurrencies = useCurrencyStore(state => state.availableCurrencies);
    const favorites = useCurrencyStore(state => state.favorites);
    const toggleFavorite = useCurrencyStore(state => state.toggleFavorite);

    const [searchTerm, setSearchTerm] = useState('');

    // Lógica de ordenação: favoritos no topo
    const sortedCurrencies = availableCurrencies
        .filter(code => code.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const aIsFav = favorites.includes(a);
            const bIsFav = favorites.includes(b);
            if (aIsFav && !bIsFav) return -1;
            if (!aIsFav && bIsFav) return 1;
            return a.localeCompare(b);
        })
        .slice(0, 20); // Limita a 20 para performance

    return (
        <div 
          className="flex flex-col"
          style={{ gap: '1rem' }}
        >
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar moeda (ex: EUR, JPY)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:border-emerald-600 transition-colors"
                    style={{
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      paddingLeft: '2.5rem',
                      paddingRight: '2.5rem'
                    }}
                />
                {searchTerm && (
                    <X 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                        onClick={() => setSearchTerm('')}
                    />
                )}
            </div>

            <div 
              className="max-h-52 overflow-y-auto flex flex-col"
              style={{
                gap: '0.5rem',
                paddingRight: '0.5rem'
              }}
            >
                {sortedCurrencies.map(code => {
                    const isFavorite = favorites.includes(code);
                    return (
                        <div 
                            key={code} 
                            className="flex justify-between items-center rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            style={{ padding: '0.75rem' }}
                        >
                            <span className="text-gray-900 dark:text-white font-medium">{code}</span>
                            <button
                                onClick={() => toggleFavorite(code)}
                                className={`rounded-full transition-all border-none cursor-pointer flex items-center justify-center ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                                title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                style={{ padding: '0.5rem' }}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : 'fill-transparent'}`} />
                            </button>
                        </div>
                    );
                })}
                {sortedCurrencies.length === 0 && searchTerm && (
                    <p 
                      className="text-center text-gray-500 dark:text-gray-400"
                      style={{ padding: '1rem' }}
                    >
                      Nenhuma moeda encontrada.
                    </p>
                )}
            </div>
        </div>
    );
};

// Componente Wrapper principal
export const FavoritesWrapper: React.FC = () => {
    return (
        <div 
          className="col-span-2 flex flex-col"
          style={{ gap: '1.5rem' }}
        > 
            <Card 
                title="Moedas favoritas (Quick Pick)" 
                subtitle="Clique na moeda para preencher automaticamente o formulário de conversão. Moedas selecionadas são destacadas."
            >
                <FavoritesList />
            </Card>
            
            <Card 
                title="Gerenciar Favoritos (Adicionar/Remover)" 
                subtitle="Use a busca para encontrar e gerenciar suas moedas favoritas. Favoritas aparecem no topo."
            >
                <FavoriteManager />
            </Card>
        </div>
    );
};