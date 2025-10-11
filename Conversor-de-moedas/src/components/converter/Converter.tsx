import React from 'react';

// Um componente simples de Card para envolver o conteúdo
const Card: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
    // Usamos Tailwind para a aparência do card e o modo escuro
    const cardClasses = `
        rounded-lg shadow-md p-6 
        bg-gray-50 dark:bg-gray-700 dark:shadow-lg dark:shadow-black/20
    `;
    
    // Adicionamos margin-bottom com style inline
    const titleStyle: React.CSSProperties = { marginBottom: '16px' };

    return (
        <div className={cardClasses} style={{ marginBottom: title === "Histórico de conversões" ? '0' : '32px' }}>
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400" style={titleStyle}>
                {title}
            </h2>
            {children}
        </div>
    );
}


export const Converter: React.FC = () => {
  // Configurações e estados de conversão (Montante, De, Para) virão do Zustand

  // Usamos style para definir o padding e gap no container do formulário
  const formContainerStyle: React.CSSProperties = { 
      padding: '20px 0', 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr 1fr', 
      gap: '15px' 
  };
  
  // Usamos style para a margin inferior do aviso
  const alertStyle: React.CSSProperties = { 
      padding: '12px', 
      backgroundColor: '#fffbe6', // Amarelo claro
      color: '#856404', // Texto amarelo escuro
      borderRadius: '5px',
      marginTop: '15px',
      marginBottom: '15px',
      border: '1px solid #ffeeba',
  };

  return (
    // Ocupa 2 colunas de 3 no layout (w-full para ocupar a área)
    <div className="lg:col-span-2 w-full"> 
      <Card title="Montante"> {/* O título Montante será substituído pela estrutura da imagem */}
        
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
                        style={{ padding: '8px' }}
                    />
                </div>
                
                {/* De (Moeda Origem) Select */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">De</label>
                    <select className="w-full p-2 border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500" style={{ padding: '8px' }}>
                        <option>USD</option>
                    </select>
                </div>
                
                {/* Para (Moeda Destino) Select */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Para</label>
                    <select className="w-full p-2 border rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:border-gray-500" style={{ padding: '8px' }}>
                        <option>BRL</option>
                    </select>
                </div>
            </div>

            {/* Botões e Última Atualização */}
            <div className="flex items-center" style={{ gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
                <button className="flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" style={{ padding: '10px 20px' }}>
                    ⟳ Converter
                </button>
                <button className="flex items-center justify-center bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500" style={{ padding: '10px 20px' }}>
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
      {/* Será substituído pelo componente History.tsx mais tarde */}
      <Card title="Histórico de conversões">
          <p className="text-gray-500 dark:text-gray-400" style={{ padding: '5px' }}>
              Suas conversões aparecerão aqui com detalhes de taxa e horário.
          </p>
      </Card>
    </div>
  );
};

// **Nota:** No seu App.tsx, você deve substituir a chamada de children pela estrutura de grid correta:
/*
<main className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '32px', marginTop: '40px' }}>
    <Converter />  // Ocupa span-2
    <Favorites />  // Ocupa span-1
</main>
*/