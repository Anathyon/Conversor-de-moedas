import React, { useState } from 'react';
import { useCurrencyStore } from '../../store/currencyStore';
import { useUiStore } from '../../store/uiStore';
import { Heart, Search, X } from 'lucide-react'; 

// Componente auxiliar de Card
interface CardProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const Card: React.FC<CardProps> = ({ children, title, subtitle }) => {
    const { theme } = useUiStore();
    
    const cardStyle: React.CSSProperties = {
        borderRadius: '0.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
        padding: '20px',
        width: '100%',
        transition: 'background-color 0.3s'
    };
    
    const titleStyle: React.CSSProperties = {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#059669',
        marginBottom: '4px',
        margin: 0
    };
    
    const subtitleStyle: React.CSSProperties = {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        fontSize: '14px',
        marginBottom: '16px',
        margin: 0
    };
    
    return (
        <div style={cardStyle}>
            <h2 style={titleStyle}>{title}</h2>
            <p style={subtitleStyle}>{subtitle}</p>
            {children}
        </div>
    );
};

// Componente para a lista de moedas favoritas
const FavoritesList: React.FC = () => {
    const { theme } = useUiStore();
    
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

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '16px'
    };
    
    const buttonStyle: React.CSSProperties = {
        padding: '8px 16px',
        borderRadius: '9999px',
        fontWeight: '500',
        transition: 'all 0.2s',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontSize: '14px',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        transform: 'scale(1)'
    };
    
    const getButtonStyle = (code: string): React.CSSProperties => {
        if (code === fromCurrency) {
            return {
                ...buttonStyle,
                backgroundColor: '#4f46e5',
                border: '2px solid #a5b4fc'
            };
        } else if (code === toCurrency) {
            return {
                ...buttonStyle,
                backgroundColor: '#059669',
                border: '2px solid #6ee7b7'
            };
        } else {
            return {
                ...buttonStyle,
                backgroundColor: theme === 'dark' ? '#4b5563' : '#6b7280'
            };
        }
    };
    
    const emptyStyle: React.CSSProperties = {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        fontSize: '14px'
    };

    return (
        <div style={containerStyle}>
            {favorites.length > 0 ? (
                favorites.map(code => (
                    <button
                        key={code}
                        onClick={() => handleClick(code)}
                        style={getButtonStyle(code)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        {code}
                    </button>
                ))
            ) : (
                <p style={emptyStyle}>Nenhuma moeda favorita adicionada. Adicione abaixo!</p>
            )}
        </div>
    );
};

// Componente para gerenciamento de favoritos
const FavoriteManager: React.FC = () => {
    const { theme } = useUiStore();
    
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

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    };
    
    const searchContainerStyle: React.CSSProperties = {
        position: 'relative'
    };
    
    const searchIconStyle: React.CSSProperties = {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '20px',
        height: '20px',
        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
    };
    
    const searchInputStyle: React.CSSProperties = {
        width: '100%',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '8px',
        paddingBottom: '8px',
        borderRadius: '0.375rem',
        border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
        backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
    };
    
    const clearIconStyle: React.CSSProperties = {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '20px',
        height: '20px',
        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        cursor: 'pointer'
    };
    
    const listContainerStyle: React.CSSProperties = {
        maxHeight: '208px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        paddingRight: '8px'
    };
    
    const itemStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '0.375rem',
        backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
        transition: 'background-color 0.2s'
    };
    
    const itemTextStyle: React.CSSProperties = {
        color: theme === 'dark' ? '#ffffff' : '#111827',
        fontWeight: '500'
    };
    
    const heartButtonStyle: React.CSSProperties = {
        padding: '8px',
        borderRadius: '50%',
        transition: 'all 0.15s',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };
    
    const getHeartButtonStyle = (isFavorite: boolean): React.CSSProperties => {
        return {
            ...heartButtonStyle,
            backgroundColor: isFavorite ? '#ef4444' : '#059669',
            color: '#ffffff'
        };
    };
    
    const emptyMessageStyle: React.CSSProperties = {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        textAlign: 'center',
        padding: '16px'
    };

    return (
        <div style={containerStyle}>
            <div style={searchContainerStyle}>
                <Search style={searchIconStyle} />
                <input
                    type="text"
                    placeholder="Buscar moeda (ex: EUR, JPY)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={searchInputStyle}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#059669';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = theme === 'dark' ? '#4b5563' : '#d1d5db';
                    }}
                />
                {searchTerm && (
                    <X 
                        style={clearIconStyle}
                        onClick={() => setSearchTerm('')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = theme === 'dark' ? '#ffffff' : '#111827';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = theme === 'dark' ? '#9ca3af' : '#6b7280';
                        }}
                    />
                )}
            </div>

            <div style={listContainerStyle}>
                {sortedCurrencies.map(code => {
                    const isFavorite = favorites.includes(code);
                    return (
                        <div 
                            key={code} 
                            style={itemStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
                            }}
                        >
                            <span style={itemTextStyle}>{code}</span>
                            <button
                                onClick={() => toggleFavorite(code)}
                                style={getHeartButtonStyle(isFavorite)}
                                title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = isFavorite ? '#dc2626' : '#047857';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = isFavorite ? '#ef4444' : '#059669';
                                }}
                            >
                                <Heart style={{ 
                                    width: '20px', 
                                    height: '20px',
                                    fill: isFavorite ? '#ffffff' : 'transparent'
                                }} />
                            </button>
                        </div>
                    );
                })}
                {sortedCurrencies.length === 0 && searchTerm && (
                    <p style={emptyMessageStyle}>Nenhuma moeda encontrada.</p>
                )}
            </div>
        </div>
    );
};

// Componente Wrapper principal
export const FavoritesWrapper: React.FC = () => {
    const containerStyle: React.CSSProperties = {
        gridColumn: 'span 2',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    };

    return (
        <div style={containerStyle}> 
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