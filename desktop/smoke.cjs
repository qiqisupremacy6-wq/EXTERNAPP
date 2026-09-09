// Executado somente no perfil isolado de validação, nunca no perfil do usuário.
module.exports = async function desktopSmoke() {
  const pause = () => new Promise(resolve => setTimeout(resolve, 120));
  async function until(read, description) {
    for (let i = 0; i < 60; i++) { const value = read(); if (value) return value; await pause(); }
    throw new Error('Não carregou: ' + description);
  }
  async function click(text) {
    const button = await until(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === text && !b.disabled), text);
    button.click(); await pause();
  }
  await until(() => document.body.innerText.includes('O que vamos descobrir hoje?'), 'Início');
  const home = true;
  await click('Laboratório 3D');
  await until(() => document.querySelectorAll('.model-card').length === 8, 'oito modelos');
  document.querySelector('.model-card .primary').click();
  await until(() => document.querySelector('.classroom-presentation'), 'apresentação');
  await until(() => document.querySelector('.classroom-presentation canvas'), 'modelo 3D');
  const presentation = document.body.innerText.includes('ROTEIRO DO PROFESSOR');
  document.querySelector('[aria-label="Fechar apresentação"]').click(); await pause();
  await click('Estudos');
  await until(() => document.querySelector('.flashcard'), 'flashcards');
  document.querySelector('.flashcard').click(); await pause();
  const flashcards = document.querySelector('.flashcard').classList.contains('is-flipped');
  document.querySelector('.card-rating button:last-child').click(); await pause();
  await click('Questões'); await click('Começar prática');
  await until(() => document.querySelector('.quiz-answers input'), 'questões');
  document.querySelector('.quiz-answers input').click(); await pause();
  await click('Conferir resposta');
  const explanation = !!document.querySelector('.quiz-explanation');
  await click('Encerrar treino');
  await until(() => document.querySelector('.quiz-result'), 'resultado');
  const data = JSON.parse(localStorage.getItem('externapp-demo-v2'));
  const studySaved = data.studySessions?.length === 1 && Object.keys(data.studyReviews?.a1 || {}).length === 1;
  const schoolPointsPreserved = data.requests.length === 3 && data.requests[0].points === .5;
  await click('Início');
  const images = await until(() => [...document.images].every(i => i.complete && i.naturalWidth > 0), 'imagens locais');
  return {home,presentation,flashcards,explanation,studySaved,schoolPointsPreserved,images};
};
