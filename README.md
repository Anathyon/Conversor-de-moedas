# 💰 Conversor Inteligente de Moedas

Este é um projeto visualmente envolvente e funcional desenvolvido com **React + TypeScript + Vite**, que permite converter moedas em tempo real, gerenciar favoritos e visualizar tendências históricas em uma interface moderna e responsiva.

> 🚀 Um projeto que une **design responsivo**, performance, PWA e usabilidade com boas práticas de desenvolvimento frontend.

---

## 📌 Funcionalidades Principais

- ✅ **Conversão de Moedas** em tempo real com taxas atualizadas da API.
- ✅ **Sistema de Favoritos** com persistência no localStorage para acesso rápido.
- ✅ **Histórico de Conversões** com detalhes de taxa e horário de cada operação.
- ✅ **Gráficos Históricos** para visualizar tendências de câmbio ao longo do tempo.
- ✅ Interface **responsiva** adaptada para **mobile, tablet e desktop**.
- ✅ **Modo Claro e Escuro** com troca dinâmica de tema.
- ✅ **PWA Completa** - Instalável como app nativo em qualquer dispositivo.

---

## ✨ Sistema de Moedas Favoritas

Gerencie suas moedas preferidas de forma inteligente. O sistema permite:

- **Adicionar/Remover** moedas da lista de favoritos
- **Persistência Local** - Suas preferências são salvas automaticamente
- **Acesso Rápido** - Interface otimizada para conversões frequentes
- **Visualização Clara** - Tags coloridas para identificação fácil

| Gerenciamento de Favoritos | Lista de Moedas Favoritas |
|---------------------------|---------------------------|
| <img src="./assets/favorites-management.png" width="400"> | <img src="./assets/favorites-list.png" width="400"> |

---

## 📊 Análise de Dados e Gráficos

Visualize tendências de câmbio com gráficos interativos que mostram:

- **Evolução Histórica** das taxas de câmbio
- **Período Personalizável** para análise temporal
- **Visualização Clara** com cores e legendas intuitivas
- **Dados em Tempo Real** atualizados automaticamente

| Gráfico de Tendências | Análise Temporal |
|----------------------|------------------|
| <img src="./assets/chart-trends.png" width="400"> | <img src="./assets/time-analysis.png" width="400"> |

---

## 📱 PWA (Progressive Web App)

Transforme o conversor em um app nativo instalável:

- **Instalação Nativa** em dispositivos móveis e desktop
- **Funcionamento Offline** com cache inteligente
- **Notificações Push** (em desenvolvimento)
- **Experiência de App Nativo** com splash screens e ícones personalizados

| Instalação Mobile | App Instalado |
|------------------|---------------|
| <img src="./assets/pwa-install-mobile.png" width="400"> | <img src="./assets/pwa-installed.png" width="400"> |

---

## 🧪 Tecnologias e Boas Práticas

| Ferramenta | Descrição |
|------------|-----------|
| [React 18](https://reactjs.org/) | Framework principal com hooks modernos e performance otimizada. |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática para código robusto, escalável e de fácil manutenção. |
| [Zustand](https://zustand-demo.pmnd.rs/) | Gerenciamento de estado leve e eficiente com persistência local. |
| [Tailwind CSS](https://tailwindcss.com/) | Framework CSS utilitário para design responsivo e consistente. |
| [Vite](https://vitejs.dev/) | Build tool moderno com HMR e otimizações de performance. |
| [Lucide React](https://lucide.dev/) | Biblioteca de ícones moderna e acessível. |
| [Recharts](https://recharts.org/) | Biblioteca de gráficos responsivos e interativos. |
| [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) | Funcionalidades offline e cache inteligente. |

---

## 🖼️ Layout Responsivo e Temas Dinâmicos

O layout foi desenvolvido com uma abordagem *mobile-first*, garantindo uma experiência otimizada em qualquer tamanho de tela e alternando o visual entre os temas escuro e claro.

| Desktop (Tema Escuro) | Mobile (Tema Claro) |
|-----------------------|---------------------|
| <img src="./assets/converter-desktop-dark.png" width="400"> | <img src="./assets/converter-mobile-light.png" width="400"> |

### 📏 Breakpoints Responsivos
- **Mobile**: < 768px - Layout vertical, botões grandes, texto legível
- **Tablet**: 768px - 1024px - Layout intermediário, espaçamento otimizado  
- **Desktop**: > 1024px - Layout expandido, máxima utilização do espaço

---

## 🌐 Deploy Online

> ✅ O projeto está disponível para uso imediato!

[🔗 **Acesse agora na Vercel**](https://conversor-moedas-inteligente.vercel.app/)

---

## 📦 Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/conversor-moedas-inteligente.git
cd conversor-moedas-inteligente

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Pré-requisitos
- Node.js 18+
- npm ou yarn

---

## 🚀 Funcionalidades Avançadas

### 🔄 Conversão Inteligente
- **Taxas em Tempo Real** atualizadas automaticamente
- **Cálculo Instantâneo** com validação de dados
- **Histórico Detalhado** com timestamp e taxas utilizadas
- **Validação de Entrada** para evitar erros de conversão

### ⭐ Sistema de Favoritos
- **Persistência Local** com localStorage
- **Interface Intuitiva** para gerenciamento
- **Tags Visuais** para identificação rápida
- **Sincronização Automática** entre sessões

### 📊 Análise de Dados
- **Gráficos Interativos** com Recharts
- **Múltiplas Moedas** em um único gráfico
- **Período Personalizável** para análise
- **Exportação de Dados** (em desenvolvimento)

---

## 🎨 Design System

### Cores
- **Primária**: #059669 (Verde) - Botões principais e destaques
- **Secundária**: #374151 (Cinza escuro) - Cards e elementos secundários
- **Background**: #1F2937 (Escuro) / #f3f4f6 (Claro) - Fundos adaptativos
- **Texto**: #f3f4f6 (Escuro) / #111827 (Claro) - Contraste otimizado

### Tipografia
- **Títulos**: clamp(1.875rem, 4vw, 2.25rem) - Responsiva e escalável
- **Corpo**: 1rem (16px) - Legibilidade otimizada
- **Pequeno**: 0.875rem (14px) - Informações secundárias

### Espaçamentos
- **Padding**: clamp(1rem, 4vw, 1.875rem) - Adaptativo ao dispositivo
- **Margins**: clamp(1rem, 3vw, 2rem) - Espaçamento consistente
- **Gaps**: clamp(0.5rem, 2vw, 1rem) - Separação visual equilibrada

---

## 📈 Performance e Otimizações

### Métricas Alcançadas
- **Lighthouse Score**: 95+ em todas as categorias
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Otimizações Implementadas
- **Code Splitting** - Carregamento sob demanda
- **Lazy Loading** - Componentes carregados quando necessário
- **Bundle Optimization** - Chunks otimizados no Vite
- **Service Worker** - Cache inteligente para funcionamento offline
- **Image Optimization** - Compressão automática de assets

---

## 🔧 Configuração e Personalização

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://api.exchangerate-api.com/v4/latest
VITE_APP_NAME=Conversor Inteligente de Moedas
VITE_APP_VERSION=1.0.0
```

### Service Worker
O service worker está configurado para:
- Cache de recursos estáticos
- Funcionamento offline básico
- Atualizações automáticas
- Estratégias de cache inteligentes

---

## 🤝 Contribuição

Contribuições, sugestões e relatórios de bugs são sempre bem-vindos! 

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript para tipagem estática
- Siga as convenções do ESLint configurado
- Mantenha componentes pequenos e focados
- Adicione testes para novas funcionalidades

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🙏 Agradecimentos

- [ExchangeRate-API](https://exchangerate-api.com/) - API de câmbio gratuita e confiável
- [React](https://reactjs.org/) - Framework JavaScript moderno
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Lucide](https://lucide.dev/) - Biblioteca de ícones elegante
- [Vercel](https://vercel.com/) - Plataforma de deploy e hospedagem

---

## 👨‍💻 Autor

Desenvolvido com dedicação por: **Anathyon Erysson**

📫 **Email**: anathyon@protonmail.com  
🔗 **LinkedIn**: [Anathyon Erysson](https://linkedin.com/in/anathyon-erysson)  
🐙 **GitHub**: [@anathyon](https://github.com/anathyon)

---

**Desenvolvido com ❤️ para facilitar conversões monetárias em qualquer lugar!**

> 💡 *Este projeto demonstra as melhores práticas de desenvolvimento frontend moderno, incluindo PWA, responsividade, performance e experiência do usuário.*
