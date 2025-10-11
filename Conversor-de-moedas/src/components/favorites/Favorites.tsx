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
        rounded-lg shadow-md p-6 
        bg-gray-50 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20
    `;
    
    // Usamos style para o padding interno do card
    const cardStyle: React.CSSProperties = { padding: '20px' };

    return (
        <div className={cardClasses} style={cardStyle}>
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400" style={{ marginBottom: '15px' }}>
                {title}
            </h2>
            {children}
        </div>
    );
}


export const Favorites: React.FC = () => {
    // Puxa a lista de favoritas do Zustand (apenas para exibição visual por enquanto)
    const favoriteCurrencies = useCurrencyStore(state => state.favorites);

    // Estilo para o container principal das duas caixas
    const containerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        gap: '32px', // O gap entre os cards internos
    };

    // Estilo para a lista de moedas favoritas (simulando tags)
    const listStyle: React.CSSProperties = { 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '8px' 
    };
    
    // Estilo para a descrição
    const descriptionStyle: React.CSSProperties = { 
        fontSize: '0.9rem', 
        color: 'var(--text-color-secondary)' // Usando uma variável CSS que seria definida no tema
    };

    return (
        // Ocupa 1 coluna de 3 no layout (w-full para ocupar a área)
        <div className="lg:col-span-1 w-full" style={containerStyle}>
            
            {/* ------------------------------------- */}
            {/* CARD: Moedas favoritas (Top-Right)    */}
            {/* ------------------------------------- */}
            <div className="flex flex-col h-full">
                <Card title="Moedas favoritas">
                    <p className="text-gray-500 dark:text-gray-400" style={descriptionStyle}>
                        Adicione moedas à lista de favoritas para acessá-las rapidamente.
                    </p>
                    
                    {/* Lista visual das moedas favoritas */}
                    <div style={listStyle} className="mt-4">
                        {favoriteCurrencies.length > 0 ? (
                            favoriteCurrencies.map(code => (
                                <span 
                                    key={code}
                                    className="px-3 py-1 text-sm rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
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

            {/* ------------------------------------- */}
            {/* CARD: Gerenciar favoritas (Bottom-Right)*/}
            {/* ------------------------------------- */}
            <div className="flex flex-col h-full">
                <Card title="Gerenciar favoritas">
                    <p className="text-gray-500 dark:text-gray-400" style={descriptionStyle}>
                        Adicione ou remova moedas da sua lista para facilitar o acesso.
                    </p>
                    
                    {/* Placeholder para a interface de gerenciamento futura (inputs, botões) */}
                    <div className="mt-4 flex items-center" style={{ gap: '10px' }}>
                         <select 
                            className="p-2 border rounded-lg w-2/3 focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500"
                            style={{ padding: '8px' }}
                         >
                            <option>Selecione a Moeda</option>
                            {/* Opções virão de availableCurrencies no store */}
                         </select>
                         <button 
                            className="flex-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            style={{ padding: '8px 15px' }}
                         >
                            Gerenciar
                         </button>
                    </div>
                </Card>
            </div>

        </div>
    );
};