# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Decisões do usuário
O Externato usa Poliedro. Projeto de Vida não integra a grade informada pelo usuário; não incluir essa disciplina. Quizzes geram somente XP, e pontos escolares são resgatados por eventos/simulados liberados pela coordenação. Windows executável é o formato pedido para apresentação. A lista de disciplinas da amostra não deve ser apresentada como grade oficial validada.

O usuário também pediu formato Android/APK. Manter as adaptações de toque e sincronizar o conteúdo compilado com o projeto Android ao atualizar a prévia; não afirmar que um APK foi compilado quando houver apenas fontes.

Organizar os modelos 3D por matéria e conteúdo, com modo de apresentação para professores. Selecionar 3D pela utilidade pedagógica (estruturas, relações espaciais e movimentos); não inventar modelos necessários para todo assunto. Flashcards, questões e simulados de treino devem ser filtráveis por matéria e turma. O material é original e demonstrativo, não é o banco oficial do Poliedro. Resultados de estudo e revisão são individuais e separados dos pontos escolares. Manter o visual atual azul/amarelo e a entrega local nesta prévia.

## Revisão visual de 09/09/2026
Mascote: EVI, arara azul exploradora (arquivo public/assets/evi.png). Início minimalista navy, amarelo e ciano; sem barra de busca. Preservar todas as sete opções de navegação. No Painel, alterar somente o entorno do laboratório branco; manter componentes, dimensões, controles e questões. Única exceção textual interna: nome da mascote. Abas das quatro matérias acima do laboratório. Demais páginas preservadas, salvo troca de mascote.
