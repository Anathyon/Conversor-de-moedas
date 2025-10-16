# 🚀 Guia de Deploy - Conversor Inteligente de Moedas

Este guia contém todas as instruções necessárias para fazer deploy do projeto na Vercel.

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Projeto no GitHub/GitLab/Bitbucket
- Node.js 18+ instalado localmente

## 🔧 Configuração Local

### 1. Instalar Dependências
```bash
npm install
```

### 2. Testar Build Local
```bash
npm run build
npm run preview
```

### 3. Verificar Arquivos de Configuração
Certifique-se de que os seguintes arquivos estão presentes:
- ✅ `vercel.json` - Configuração do Vercel
- ✅ `manifest.json` - Manifest da PWA
- ✅ `sw.js` - Service Worker
- ✅ `postcss.config.cjs` - Configuração do PostCSS

## 🌐 Deploy na Vercel

### Opção 1: Deploy Automático (Recomendado)

1. **Conectar Repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Conecte seu repositório GitHub/GitLab

2. **Configuração Automática**
   - A Vercel detectará automaticamente o framework Vite
   - As configurações do `vercel.json` serão aplicadas automaticamente

3. **Deploy**
   - Clique em "Deploy"
   - Aguarde o processo de build (2-3 minutos)
   - Seu app estará disponível na URL fornecida

### Opção 2: Deploy Manual

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login na Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## ⚙️ Configurações do Vercel

### Variáveis de Ambiente (Opcional)
Se necessário, configure no painel da Vercel:
```
VITE_API_URL=https://api.exchangerate-api.com/v4/latest
VITE_APP_NAME=Conversor Inteligente de Moedas
```

### Domínio Personalizado
1. Acesse o painel do projeto na Vercel
2. Vá em "Settings" > "Domains"
3. Adicione seu domínio personalizado
4. Configure os registros DNS conforme instruído

## 🔍 Verificações Pós-Deploy

### ✅ Checklist de Funcionalidades
- [ ] **PWA**: Botão de instalação aparece
- [ ] **Responsividade**: Teste em mobile/tablet/desktop
- [ ] **Tema**: Alternância dark/light funciona
- [ ] **Conversão**: Taxas são carregadas corretamente
- [ ] **Favoritos**: Persistência no localStorage
- [ ] **Gráficos**: Visualização histórica funciona
- [ ] **Offline**: Service Worker ativo

### 🧪 Testes de Performance
- [ ] **Lighthouse**: Score > 90 em todas as categorias
- [ ] **Core Web Vitals**: Dentro dos limites recomendados
- [ ] **Mobile**: Performance otimizada em dispositivos móveis

## 🐛 Solução de Problemas

### Erro de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problemas de PostCSS
```bash
# Verificar configuração
cat postcss.config.cjs
# Deve mostrar: '@tailwindcss/postcss' e 'autoprefixer'
```

### Service Worker não funciona
1. Verifique se `sw.js` está na pasta `public/`
2. Confirme que o registro está no `index.html`
3. Teste no DevTools > Application > Service Workers

## 📊 Monitoramento

### Analytics da Vercel
- Acesse o painel do projeto
- Monitore métricas de performance
- Configure alertas para downtime

### Logs de Erro
- Use o painel da Vercel para ver logs
- Configure integração com Sentry (opcional)

## 🔄 Atualizações

### Deploy Automático
- Push para `main` = Deploy automático
- Push para outras branches = Preview deployments

### Deploy Manual
```bash
# Após fazer mudanças
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Deploy automático será iniciado
```

## 📱 Teste da PWA

### No Mobile
1. Abra o app no navegador
2. Toque no botão "Instalar App"
3. Confirme a instalação
4. Teste funcionamento offline

### No Desktop
1. Abra o app no Chrome/Edge
2. Clique no ícone de instalação na barra de endereços
3. Confirme a instalação
4. Teste como app nativo

## 🎯 Otimizações Finais

### Cache Headers
Os headers estão configurados no `vercel.json`:
- Service Worker: Sem cache
- Assets: Cache longo (1 ano)
- Manifest: Cache longo (1 ano)

### Bundle Optimization
- Chunks separados por funcionalidade
- Lazy loading implementado
- Tree shaking ativo

---

## 📞 Suporte

Se encontrar problemas durante o deploy:

1. **Verifique os logs** no painel da Vercel
2. **Teste localmente** com `npm run build`
3. **Consulte a documentação** da Vercel
4. **Abra uma issue** no repositório

---

**🚀 Seu Conversor Inteligente de Moedas está pronto para o mundo!**
