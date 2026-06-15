# Techno Metrics Solutions — Site institucional

Site comercial de página única (landing) para a Techno Metrics Solutions.
HTML/CSS/JS puro, sem dependências e sem build. Basta abrir o `index.html`.

## Estrutura
```
index.html      Marcação do site (Hero, Serviços, Sobre, Processo, Contato)
styles.css      Estilos (tema escuro tech, ciano/azul) + responsivo
script.js       Menu mobile, animações de reveal, validação do formulário
assets/
  logo.svg      Logo
  favicon.svg   Ícone da aba
```

## Como visualizar
- Abra `index.html` no navegador (duplo clique), **ou**
- Sirva localmente: `npx serve .` ou `python -m http.server`

## ⚠️ A preencher com dados reais (placeholders)
Procure pelos comentários `TODO` no código. Itens marcados:

1. **Contato** (`index.html`, seção `#contato`):
   - E-mail: `contato@technometrics.com.br`
   - WhatsApp: `(00) 00000-0000` e link `https://wa.me/5500000000000`
   - Instagram já preenchido: `@techno_metrics_solutions`
2. **Formulário** (`script.js`): hoje abre o cliente de e-mail (mailto).
   Para receber mensagens direto, integre com **Formspree** ou **EmailJS**
   (basta trocar o trecho marcado com `TODO`).
3. **Textos / Serviços**: ajustados para "Desenvolvimento de Software/TI".
   Revise os textos conforme o posicionamento real do negócio (com base no
   conteúdo do Instagram, que não pôde ser extraído automaticamente).

## Publicação sugerida
- **Netlify** ou **Vercel**: arraste a pasta (deploy em segundos).
- **GitHub Pages**: suba os arquivos e ative o Pages.
- Hospedagem comum: envie os arquivos via FTP.
