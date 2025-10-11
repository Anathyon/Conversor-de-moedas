import React from 'react';

// Um componente simples de Card para envolver o conteúdo
const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    // Usamos Tailwind para a aparência do card e o modo escuro
    const cardClasses = `
        rounded-lg shadow-md
        bg-gray-50 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20
    `;
    
    // Usamos style para padding e margin
    const cardStyle: React.CSSProperties = { 
        padding: '1.5rem', // 24px -> 1.5rem
        marginBottom: title === "Histórico de conversões" ? '0' : '2rem' // 32px -> 2rem
    };
    
    // Usamos style para margin
    const titleStyle: React.CSSProperties = { marginBottom: '1rem' }; // 16px -> 1rem

    return (
        <div className={cardClasses} style={cardStyle}>
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400" style={titleStyle}>
                {title}
            </h2>
            {children}
        </div>
    );
}


export const Converter: React.FC = () => {
  // Usamos style para definir o padding e gap no container do formulário
  const formContainerStyle: React.CSSProperties = { 
      padding: '1.25rem 0', // 20px -> 1.25rem
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr 1fr', 
      gap: '0.9375rem' // 15px -> 0.9375rem
  };
  
  // Usamos style para a margin inferior do aviso
  const alertStyle: React.CSSProperties = { 
      padding: '0.75rem', // 12px -> 0.75rem
      backgroundColor: '#fffbe6',
      color: '#856404', 
      borderRadius: '0.3125rem', // 5px -> 0.3125rem
      marginTop: '0.9375rem', // 15px -> 0.9375rem
      marginBottom: '0.9375rem', // 15px -> 0.9375rem
      border: '1px solid #ffeeba',
  };
    
    // Estilo para os inputs e selects
    const inputStyle: React.CSSProperties = { padding: '0.5rem' }; // 8px -> 0.5rem

    // Estilo para os botões e info de atualização
    const controlsStyle: React.CSSProperties = { 
        gap: '0.625rem', // 10px -> 0.625rem
        marginTop: '0.625rem', // 10px -> 0.625rem
        marginBottom: '0.625rem' // 10px -> 0.625rem
    };
    
    const buttonPadding: React.CSSProperties = { padding: '0.625rem 1.25rem' }; // 10px 20px -> 0.625rem 1.25rem

  return (
    // Ocupa 2 colunas de 3 no layout (w-full para ocupar a área)
    <div className="lg:col-span-2 w-full"> 
      <Card title="Conversão de Moedas">
        
        {/* Estrutura do formulário de conversão */}
        <div className="flex flex-col">
            <div style={formContainerStyle}>
                {/* Montante Input */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Montante</label>
                    <input 
                        type="number" 
                        defaultValue="1" 
                        className="w-full p-2 border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500" 
                        style={inputStyle}
                    />
                </div>
                
                {/* De (Moeda Origem) Select */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">De</label>
                    <select className="w-full p-2 border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500" style={inputStyle}>
                        <option>USD</option>
                    </select>
                </div>
                
                {/* Para (Moeda Destino) Select */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Para</label>
                    <select className="w-full p-2 border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500" style={inputStyle}>
                        <option>BRL</option>
                    </select>
                </div>
            </div>

            {/* Botões e Última Atualização */}
            <div className="flex items-center" style={controlsStyle}>
                <button className="flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" style={buttonPadding}>
                    ⟳ Converter
                </button>
                <button className="flex items-center justify-center bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500" style={buttonPadding}>
                    Atualizar taxas
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">Última atualização: --</span>
            </div>

            {/* Aviso (Amarelo) */}
            <div style={alertStyle}>
                A taxa para a moeda selecionada ainda não está disponível. Atualize as taxas ou escolha outra moeda.
            </div>
        </div>
      </Card>
      
      {/* O componente de histórico é renderizado logo abaixo na coluna 1 e 2 (span-2) */}
      <Card title="Histórico de conversões">
          <p className="text-gray-500 dark:text-gray-400" style={{ padding: '0.3125rem' }}>
              Suas conversões aparecerão aqui com detalhes de taxa e horário.
          </p>
      </Card>
    </div>
  );
};