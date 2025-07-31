# GPU Specs Database - TechCore

Esta é a database de especificações de GPUs do TechCore, similar ao TechPowerUp, com informações detalhadas sobre placas de vídeo.

## Estrutura

```
gpu-specs/
├── index.html              # Página principal da database
├── radeon-rx-5700-xt.html # Página da RX 5700 XT
├── geforce-gtx-1050-ti.html # Página da GTX 1050 Ti
├── img/                    # Imagens das GPUs
│   ├── rx5700xt.jpg
│   └── gtx1050ti.jpg
└── README.md              # Este arquivo
```

## Funcionalidades

### Página Principal (index.html)
- **Busca**: Campo de busca para encontrar GPUs por nome ou fabricante
- **Filtros**: Botões para filtrar por fabricante (NVIDIA, AMD, Intel)
- **Cards das GPUs**: Exibem informações básicas e performance relativa
- **Performance Bars**: Barras animadas mostrando performance relativa

### Páginas Individuais das GPUs
- **Especificações Detalhadas**: Informações completas organizadas por categoria
- **Performance Relativa**: Tabela comparativa com outras GPUs
- **Breadcrumb Navigation**: Navegação hierárquica
- **Design Responsivo**: Adaptado para diferentes tamanhos de tela

## Performance Relativa

O sistema de performance relativa funciona da seguinte forma:

- **Na página da RX 5700 XT**: Ela tem 100%, GTX 1050 Ti tem 34%
- **Na página da GTX 1050 Ti**: Ela tem 100%, RX 5700 XT tem 292%

Isso permite comparações precisas entre diferentes GPUs, onde cada GPU é usada como referência (100%) em sua própria página.

## Estilo

O design segue o tema cyberpunk do TechCore:
- Cores: Verde neon (#00ff41) sobre fundo escuro
- Efeitos: Animações, brilhos e transições suaves
- Layout: Grid responsivo e cards interativos

## Como Adicionar Novas GPUs

1. **Criar página individual**: `gpu-specs/nome-da-gpu.html`
2. **Adicionar card na página principal**: Atualizar `index.html`
3. **Adicionar imagem**: Colocar em `img/nome-da-gpu.jpg`
4. **Atualizar performance**: Adicionar nas tabelas de performance relativa

## Tecnologias Utilizadas

- HTML5
- CSS3 (Grid, Flexbox, Animações)
- JavaScript (Vanilla)
- Design responsivo
- Intersection Observer API para animações

## Navegação

- **Home** → **GPUs** → **GPU Specs Database** → **GPU Específica**
- Breadcrumbs em todas as páginas para navegação fácil
- Botões de voltar para navegação intuitiva 
