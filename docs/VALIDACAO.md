# Validação da versão EVI 0.4.0

- 9 testes existentes aprovados: conteúdo, filtros, pontuação, revisão, modelos e servidor.
- Início revisado visualmente: sete destinos na navegação, três atalhos, EVI e nenhum campo de busca novo.
- Desafio do HTML testado: resposta 150 cm³ produziu feedback correto; nenhum erro registrado no console nessa verificação.
- Componente Laboratory comparado ao original: somente o nome EXO foi atualizado para EVI. Nenhuma regra nova de CSS seleciona elementos internos do painel branco.
- Altura original de 693,594 px preservada na largura desktop de referência. A largura continua seguindo as mesmas colunas responsivas originais.
- Executável 0.4.0 extraído e comparado: 13 arquivos de interface iguais aos compilados. A execução gráfica Windows não foi validada neste ambiente.
- HTML inclui imagens/fontes em data URLs, sem dependências de arquivos externos para o app. A abertura direta via file:// foi bloqueada pela política do navegador automatizado; validado via servidor local.
