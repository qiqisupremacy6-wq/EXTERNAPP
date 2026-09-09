# ExternApp — prévia comercial

Aplicativo demonstrativo para apresentar a proposta ao Colégio Externato. Funciona no navegador do Windows. Não requer instalação de dependências: abra **Abrir ExternApp.cmd**. Mantenha a janela minimizada do ExternApp aberta enquanto usa o aplicativo; feche-a para encerrar o servidor local.

## Roteiro de apresentação (5 minutos)

1. Mostre a visão geral: identidade azul e amarela, mascote EXO, progresso por disciplina e próximo evento.
2. No laboratório, gire e amplie o prisma. Responda **150 cm³** e confira a explicação. Os quizzes concedem somente XP e conquistas. Explore as ferramentas de rotação, estrutura, vistas e identificação por clique.
3. Explore Química, Física e Biologia. Na Física, altere o ângulo para observar o alcance. A jornada reúne as quatro missões, conquistas e um temporizador de estudo.
4. Mude o perfil no canto superior direito para **Coordenação**. Antes, no Início, entre em Resgatar pontos e escolha Festa Junina ou Simulado de agosto. Envie um relato. No perfil da coordenação, localize a solicitação, confira o relato e aprove ou devolva com uma justificativa. Os pontos escolares são separados do XP do jogo.
5. Exporte os resultados em **Excel** ou **CSV**. Publique um evento para todos ou para uma turma específica. Volte ao perfil de aluno para conferir a agenda e os resultados.

## Escopo desta prévia

- Seis alunos fictícios representam os três anos e as turmas A/B; a estrutura demonstra a organização por série e turma.
- Quatro questões com modelos 3D interativos, respostas explicadas, XP sem duplicação por missão, níveis e conquistas.
- Provas, simulados, palestras, gincanas, passeios e eventos publicados no perfil de coordenação.
- Solicitações, aprovação, devolução, limites demonstrativos por disciplina e bimestre, histórico e exportação.
- Os dados ficam apenas neste navegador/computador. O seletor de perfis simula permissões; não é autenticação. Anexos registram somente o nome do arquivo.
- A demonstração não altera boletins reais. As regras de pontos precisam ser definidas pela escola antes de uma versão operacional.
- Não inclui servidor compartilhado, contas reais, notificações externas ou integração com sistemas escolares. O banco de questões é uma amostra, não um currículo completo.

## Reiniciar a apresentação

Abra **Sobre a demonstração** no rodapé e use a opção de reiniciar os dados fictícios. Essa ação apaga somente os dados locais desta prévia.

## Usar no Android sem instalar APK

Abra a prévia no Chrome do Android e escolha **Adicionar à tela inicial** no menu do navegador. O ExternApp passa a abrir em formato de aplicativo, com navegação inferior própria para toque e cache básico dos assets. É uma PWA de demonstração; não exige créditos, loja ou instalação de um pacote nativo.

Um APK publicado na Play Store exigirá uma etapa posterior de empacotamento Android, assinatura e definição de pacote pela escola.

## Créditos

Identidade institucional de referência: https://colegioexternato.com.br/ . Logotipo obtido do site oficial; mascote e ilhas criados para esta proposta, sem alegação de aprovação institucional. Interface em Inter, ícones Phosphor, modelos interativos Three.js, planilhas SheetJS. O atalho usa o runtime Node.js disponível neste computador. Esta pasta está preparada para demonstração local.


## Atualização: professores e Central de estudos

No perfil **Professor**, abra o Laboratório 3D, filtre matéria e conteúdo e use **Apresentar em 3D**. Há oito modelos com roteiro, identificação de estruturas e tela cheia. O mapa dentro do catálogo distingue o uso de 3D das matérias que se beneficiam de outras ferramentas.

Na aba **Estudos**, escolha turma, matéria e conteúdo. Experimente flashcards, revisão programada, questões comentadas, simulado cronometrado e caderno de erros. O histórico é individual. Para exportar, use **Exportar estudos** em Resultados ou na Coordenação.

O acervo é uma amostra de 14 matérias propostas, 42 conteúdos, 84 questões e 84 flashcards. A sequência oficial do colégio ainda precisa ser conferida. Veja [MAPA-PEDAGOGICO.md](MAPA-PEDAGOGICO.md) para os critérios e o inventário. Os instaladores Windows e APK não são recompilados automaticamente pelo build da prévia.

## Windows atualizado — 0.3.0

O executável em `../ExternApp-Windows/ExternApp-Previa-Windows.exe` foi recompilado com a Central de estudos e o acervo de professores. O conteúdo extraído do portátil foi conferido com os arquivos da prévia. A abertura permanece sem validação visual por falha do processo gráfico no ambiente automatizado. O projeto Android mantém as fontes sincronizadas, sem novo APK nesta etapa.
