# ExternApp · HopeLeaf

Prévia comercial para o Ensino Médio do Colégio Externato. A EVI é a arara azul exploradora da plataforma.

## Formatos

- **HTML independente:** baixe [html/ExternApp.html](html/ExternApp.html) e abra no navegador. Imagens, fontes, estilos e código estão incorporados no arquivo; não precisa instalar dependências.
- **Windows:** executável portátil disponibilizado nas Releases deste repositório.
- **Código do aplicativo:** React, Vite e Three.js na raiz; configuração Electron em desktop/.
- **Apresentação comercial:** [PowerPoint HopeLeaf](docs/HopeLeaf-ExternApp.pptx). A apresentação anterior usa a grafia Evy.

## Recursos da prévia

Início com EVI, Painel, Jornada, Estudos, Laboratório 3D, Agenda e Resultados. Modelos por matéria e conteúdo, flashcards, questões, simulados e exportação Excel/CSV. Pontos escolares dependem de eventos e simulados liberados e aprovados pela coordenação. Quizzes concedem apenas XP.

A escola utiliza Poliedro; esta amostra contém material demonstrativo original, sem integração oficial ou acesso ao banco de questões Poliedro. Dados fictícios ficam no dispositivo. Não é um boletim oficial nem um sistema com contas autenticadas e dados compartilhados.

## Desenvolvimento

Requer Node.js 22 ou superior e pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm test:learning
pnpm test:sites
```

## Revisão visual

Início minimalista navy, amarelo e ciano. Painel branco de laboratório preservado; identidade aplicada ao entorno. A única mudança textual interna é o nome da mascote. Todas as opções de navegação permanecem.

## Marcas e conteúdo

HopeLeaf e Externato conservam suas respectivas identidades. Não é concedida licença de uso das marcas, ilustrações ou materiais comerciais apenas por este repositório estar acessível.

### Gerar Windows novamente

Depois do build: `node scripts/prepare-desktop.mjs` e `pnpm dlx electron-builder@26.15.3 --win portable --x64 --config desktop/electron-builder.yml`. O resultado fica em release/.
