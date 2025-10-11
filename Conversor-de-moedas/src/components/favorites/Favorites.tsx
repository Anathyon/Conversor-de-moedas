import React from 'react';
import { useCurrencyStore } from '../../store/currencyStore'; 

// Componente auxiliar de Card reutilizado
interface CardProps {
    title: string;
    children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children, title }) => {
    // Classes Tailwind para a aparência do card e o modo escuro
    const cardClasses = `
        rounded-lg shadow-md 
        bg-gray-50 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20
    `;
    
    // Usamos style para o padding interno
    const cardStyle: React.CSSProperties = { 
        padding: '1.25rem' // 20px -> 1.25rem
    };
    
    // Usamos style para margin
    const titleStyle: React.CSSProperties = { marginBottom: '0.9375rem' }; // 15px -> 0.9375rem

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
    const favoriteCurrencies = useCurrencyStore(state => state.favorites);

    // Estilo para o container principal das duas caixas
    const containerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        gap: '2rem', // 32px -> 2rem
    };

    // Estilo para a lista de moedas favoritas (simulando tags)
    const listStyle: React.CSSProperties = { 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.5rem', // 8px -> 0.5rem
        marginTop: '1rem', // NOVO: Substitui mt-4
    };
    
    // Estilo para as tags de moeda
    const tagStyle: React.CSSProperties = {
        padding: '0.25rem 0.75rem', // 4px 12px -> 0.25rem 0.75rem (Substitui px-3 py-1)
        borderRadius: '9999px', // rounded-full (Tailwind)
    };
    
    // Estilo para o container de gerenciamento
    const manageContainerStyle: React.CSSProperties = { 
        gap: '0.625rem', // 10px -> 0.625rem
        marginTop: '1rem', // NOVO: Substitui mt-4
    };

    // Estilo para o input/select
    const inputStyle: React.CSSProperties = { 
        padding: '0.5rem', // 8px -> 0.5rem
        width: '66.6667%' // NOVO: Substitui w-2/3
    };

    // Estilo para o padding do botão
    const buttonPadding: React.CSSProperties = { padding: '0.5rem 0.9375rem' }; // 8px 15px -> 0.5rem 0.9375rem

    return (
        // Classes de layout de grid (lg:col-span-1, w-full) são essenciais e mantidas.
        <div className="lg:col-span-1 w-full" style={containerStyle}>
            
            {/* CARD: Moedas favoritas (Top-Right) */}
            <div className="flex flex-col h-full">
                <Card title="Moedas favoritas">
                    <p className="text-gray-500 dark:text-gray-400">
                        Adicione moedas à lista de favoritas para acessá-las rapidamente.
                    </p>
                    
                    {/* Lista visual das moedas favoritas */}
                    <div style={listStyle} className="flex"> {/* Mantém 'flex' para layout */}
                        {favoriteCurrencies.length > 0 ? (
                            favoriteCurrencies.map(code => (
                                <span 
                                    key={code}
                                    // APENAS CLASSES DE COR/APARÊNCIA TAILWIND
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
            </div>

            {/* CARD: Gerenciar favoritas (Bottom-Right)*/}
            <div className="flex flex-col h-full">
                <Card title="Gerenciar favoritas">
                    <p className="text-gray-500 dark:text-gray-400">
                        Adicione ou remova moedas da sua lista para facilitar o acesso.
                    </p>
                    
                    {/* Placeholder para a interface de gerenciamento futura */}
                    <div className="flex items-center" style={manageContainerStyle}>
                         <select 
                            className="border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500"
                            style={inputStyle}
                         >
                            <option>Selecione a Moeda</option>
                            {/* Opções virão de availableCurrencies no store */}
                         </select>
                         <button 
                            className="flex-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            style={buttonPadding}
                         >
                            Gerenciar
                         </button>
                    </div>
                </Card>
            </div>

        </div>
    );
};