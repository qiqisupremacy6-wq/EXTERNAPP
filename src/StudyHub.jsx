import React, {useState,useEffect,useRef,useCallback} from 'react';
import {BookOpen,ArrowRight,ArrowLeft,CheckCircle,Clock,ArrowCounterClockwise,Lightning} from '@phosphor-icons/react';
import {classrooms,subjects,filterTopics,scoreAnswers,scheduleReview,dueCards} from './learningData';

export function StudyHub({student,data,setData,role}) {
  const [classroom,setClassroom]=useState(`${student.grade} ${student.group}`);
  const [subject,setSubject]=useState('Todas'),[topic,setTopic]=useState('Todos'),[mode,setMode]=useState('cards'),[busy,setBusy]=useState(false),[round,setRound]=useState(0);
  const scope={classroom,subject,topic},available=filterTopics({classroom,subject}),filtered=filterTopics(scope);
  const cards=filtered.flatMap(t=>t.cards),questions=filtered.flatMap(t=>t.questions),reviews=data.studyReviews?.[student.id]||{};
  const history=(data.studySessions||[]).filter(s=>s.studentId===student.id&&s.classroom===classroom&&(subject==='Todas'||s.subjects.includes(subject)));
  const latest=new Map();history.forEach(s=>s.answers.forEach(a=>{if(!latest.has(a.id))latest.set(a.id,a.correct);}));
  const errors=questions.filter(q=>latest.get(q.id)===false);
  const due=dueCards(cards,reviews),reviewed=cards.filter(c=>reviews[c.id]).length;
  function saveReview(card,confidence){setData(d=>({...d,studyReviews:{...d.studyReviews,[student.id]:{...d.studyReviews?.[student.id],[card.id]:scheduleReview(confidence)}}}));}
  function saveSession(result){setBusy(false);setData(d=>({...d,studySessions:[{...result,studentId:student.id,classroom,subjects:[...new Set(result.answers.map(a=>a.subject))]},...(d.studySessions||[])].slice(0,300)}));}
  const tabs=[['cards','Flashcards'],['questions','Questões'],['exam','Simulado'],['review',`Revisão (${due.length})`],['errors',`Meus erros (${errors.length})`]];
  return <section className="learning-hub">
    <div className="page-heading"><div><span className="eyebrow blue">CENTRAL DE ESTUDOS</span><h1>Entenda. Pratique. Revise.</h1><p>Seu material por turma, matéria e conteúdo.</p></div><span className="study-context"><BookOpen size={24}/>{student.name}<small>{role==='Aluno'?'Meu estudo':'Aluno de demonstração'} · histórico individual</small></span></div>
    <fieldset className="learning-filters" disabled={busy}><legend className="sr-only">Filtros do material de estudo</legend>
      <label>Turma<select value={classroom} onChange={e=>{setClassroom(e.target.value);setTopic('Todos');}}>{classrooms.map(c=><option key={c}>{c}</option>)}</select></label>
      <label>Matéria<select value={subject} onChange={e=>{setSubject(e.target.value);setTopic('Todos');}}><option>Todas</option>{subjects.map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Conteúdo<select value={topic} onChange={e=>setTopic(e.target.value)}><option value="Todos">Todos os conteúdos</option>{available.map(t=><option key={t.id} value={t.id}>{t.title}{subject==='Todas'?` · ${t.subject}`:''}</option>)}</select></label>
      <span className="filter-count"><strong>{filtered.length}</strong> conteúdos<span>{questions.length} questões · {cards.length} cards</span></span>
    </fieldset>
    <div className="learning-stats"><span><strong>{reviewed}/{cards.length}</strong> cards revisados</span><span><strong>{due.length}</strong> para revisar agora</span><span><strong>{history.length}</strong> treinos concluídos</span><span><strong>{errors.length}</strong> questões para retomar</span></div>
    <div className="learning-tabs" role="tablist" aria-label="Ferramentas de estudo">{tabs.map(([id,label])=><button key={id} role="tab" id={`study-tab-${id}`} aria-selected={mode===id} aria-controls="study-workspace" disabled={busy} onClick={()=>{setMode(id);setRound(r=>r+1);}}>{label}</button>)}</div>
    <div id="study-workspace" role="tabpanel" aria-labelledby={`study-tab-${mode}`} key={`${student.id}:${classroom}:${subject}:${topic}:${mode}:${round}`}>
      {(mode==='cards'||mode==='review')&&<Flashcards cards={mode==='review'?due:cards} save={saveReview} onRestart={()=>setRound(r=>r+1)}/>}
      {(mode==='questions'||mode==='exam'||mode==='errors')&&<Quiz questions={mode==='errors'?errors:questions} mode={mode} onBusy={setBusy} onComplete={saveSession} onRestart={()=>setRound(r=>r+1)}/>}
    </div>
    <section className="panel study-history"><div className="section-heading"><h2>Últimos treinos</h2><span className="muted">{classroom} · {subject}</span></div>{history.length?<ul>{history.slice(0,5).map(s=><li key={s.id}><span><strong>{s.mode==='exam'?'Simulado':'Prática de questões'}</strong><small>{s.subjects.join(' · ')} · {new Date(s.date).toLocaleString('pt-BR')}</small></span><b>{s.correct}/{s.total}<small>{s.percent}% de acertos</small></b></li>)}</ul>:<p>Ao concluir um treino, seus resultados aparecerão aqui.</p>}</section>
    <p className="learning-note">Questões originais de demonstração. A distribuição por série e turma será ajustada à sequência do Externato. Este espaço não concede pontos escolares.</p>
  </section>;
}

function Flashcards({cards,save,onRestart}) {
  const [deck]=useState(()=>[...cards]),[index,setIndex]=useState(0),[flipped,setFlipped]=useState(false);
  const card=deck[index];
  if(!card)return <div className="panel learning-empty"><CheckCircle size={42}/><h2>{deck.length?'Rodada concluída.':'Tudo em dia por aqui.'}</h2><p>{deck.length?'Os cards marcados como “Rever” ficam disponíveis agora; “Quase lá” volta em 1 dia e “Já sei” em 3 dias.':'Não há cards pendentes para estes filtros. Você pode explorar outra matéria ou abrir todos os flashcards.'}</p><button className="secondary" onClick={onRestart}>Atualizar rodada <ArrowCounterClockwise/></button></div>;
  function rate(confidence){save(card,confidence);setFlipped(false);setIndex(i=>i+1);}
  return <section className="panel flashcard-panel"><div className="study-toolbar"><span className="eyebrow blue">{card.subject}</span><span>Card {index+1} de {deck.length}</span></div><progress value={index} max={deck.length}/>
    <button className={'flashcard '+(flipped?'is-flipped':'')} aria-label={flipped?'Resposta do flashcard. Voltar à pergunta.':'Flashcard. Revelar resposta.'} onClick={()=>setFlipped(v=>!v)}><span>{flipped?'RESPOSTA':'TENTE LEMBRAR ANTES DE VIRAR'}</span><h2>{flipped?card.back:card.front}</h2>{flipped?<p>{card.explanation}</p>:<small>Toque ou pressione Enter para revelar <ArrowRight/></small>}</button>
    <div className="card-rating"><p>{flipped?'Como foi lembrar?':'Revele a resposta para avaliar sua lembrança.'}</p><div><button disabled={!flipped} onClick={()=>rate('again')}>Rever<small>Revisar agora</small></button><button disabled={!flipped} onClick={()=>rate('partial')}>Quase lá<small>Voltar em 1 dia</small></button><button disabled={!flipped} onClick={()=>rate('known')}>Já sei<small>Voltar em 3 dias</small></button></div></div>
  </section>;
}

function Quiz({questions,mode,onBusy,onComplete,onRestart}) {
  const [session,setSession]=useState(null),[index,setIndex]=useState(0),[answers,setAnswers]=useState({}),[checked,setChecked]=useState(false),[finished,setFinished]=useState(false),[now,setNow]=useState(Date.now());
  const recorded=useRef(false),exam=mode==='exam';
  const active=session?.questions||[],question=active[index],answered=Object.keys(answers).length;
  const finish=useCallback(()=>{
    if(!session||recorded.current)return;
    recorded.current=true;setFinished(true);
    onComplete({id:session.id,date:new Date().toISOString(),mode,...scoreAnswers(active,answers),answers:active.map(q=>({id:q.id,subject:q.subject,chosen:answers[q.id]??null,correct:answers[q.id]===q.correct}))});
  },[session,active,answers,mode,onComplete]);
  useEffect(()=>{if(!session||finished||!exam)return;const interval=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(interval);},[session,finished,exam]);
  useEffect(()=>{if(session&&exam&&!finished&&now>=session.deadline)finish();},[now,session,exam,finished,finish]);
  function start(){
    const shuffled=[...questions];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
    const list=exam?shuffled.slice(0,10):questions;
    setSession({id:crypto.randomUUID(),questions:list,deadline:Date.now()+list.length*90000});setNow(Date.now());onBusy(true);
  }
  if(!questions.length)return <div className="panel learning-empty"><CheckCircle size={40}/><h2>{mode==='errors'?'Nenhum erro para retomar.':'Nenhuma questão nesta seleção.'}</h2><p>{mode==='errors'?'Conclua uma prática ou simulado. As questões a revisar aparecerão aqui.':'Escolha outra turma ou matéria.'}</p></div>;
  if(!session)return <div className="panel quiz-start"><div className="quiz-start-icon">{exam?<Clock size={42}/>:<Lightning size={42}/>}</div><div><span className="eyebrow blue">{exam?'SIMULADO DE TREINO':mode==='errors'?'CADERNO DE ERROS':'PRÁTICA COMENTADA'}</span><h2>{exam?'Um ensaio para a próxima prova.':'Cada resposta é uma chance de entender.'}</h2><p>{exam?`${Math.min(10,questions.length)} questões dos filtros selecionados · ${Math.min(10,questions.length)*1.5} minutos. Correção ao concluir. Não há pontuação escolar.`:`${questions.length} questões com explicação após cada resposta. Seu resultado fica salvo ao concluir o treino.`}</p><button className="primary" onClick={start}>{exam?'Iniciar simulado':'Começar prática'} <ArrowRight/></button></div></div>;
  if(finished){const result=scoreAnswers(active,answers);return <section className="panel quiz-result"><span className="eyebrow blue">TREINO CONCLUÍDO</span><h2>Seu resultado: {result.correct} de {result.total}</h2><p>{result.percent}% de acertos · {active.length-answered} sem resposta. Salvo no seu histórico de estudo.</p><button className="secondary" onClick={onRestart}>Novo treino <ArrowCounterClockwise/></button><div className="answer-review">{active.map((q,i)=><article key={q.id} className={answers[q.id]===q.correct?'right':'wrong'}><span>{answers[q.id]===q.correct?'Correto':'Revisar'} · {q.subject}</span><h3>{i+1}. {q.prompt}</h3><p>Sua resposta: {q.options[answers[q.id]]??'Não respondida'}</p><strong>Resposta: {q.options[q.correct]}</strong><p>{q.explanation}</p></article>)}</div></section>;}
  const remaining=Math.max(0,Math.ceil((session.deadline-now)/1000));
  return <section className="panel quiz-active"><div className="study-toolbar"><span>{question.subject} · {index+1}/{active.length}</span>{exam&&<span className="quiz-time"><Clock/>{String(Math.floor(remaining/60)).padStart(2,'0')}:{String(remaining%60).padStart(2,'0')}</span>}</div><progress max={active.length} value={answered}/><h2>{question.prompt}</h2><fieldset className="quiz-answers" disabled={checked}><legend className="sr-only">Escolha uma alternativa</legend>{question.options.map((option,i)=><label key={option} className={answers[question.id]===i?'selected':''}><input type="radio" name={question.id} checked={answers[question.id]===i} onChange={()=>setAnswers(a=>({...a,[question.id]:i}))}/><b>{String.fromCharCode(65+i)}</b><span>{option}</span></label>)}</fieldset>
    {checked&&<div className="quiz-explanation" role="status"><strong>{answers[question.id]===question.correct?'Resposta correta.':'Vamos revisar.'}</strong><p>{question.explanation}</p><span>Alternativa correta: {question.options[question.correct]}</span></div>}
    <div className="study-navigation">{exam?<><button className="secondary" disabled={index===0} onClick={()=>setIndex(i=>i-1)}><ArrowLeft/> Anterior</button><button className="secondary" disabled={index===active.length-1} onClick={()=>setIndex(i=>i+1)}>Próxima <ArrowRight/></button><button className="primary" onClick={finish}>Concluir{answered<active.length?` (${active.length-answered} sem resposta)`:''}</button></>:<><button className="secondary" onClick={finish}>Encerrar treino</button>{!checked?<button className="primary" disabled={answers[question.id]===undefined} onClick={()=>setChecked(true)}>Conferir resposta</button>:<button className="primary" onClick={()=>{if(index===active.length-1)finish();else{setIndex(i=>i+1);setChecked(false);}}}>{index===active.length-1?'Ver resultado':'Próxima questão'} <ArrowRight/></button>}</>}</div>
    <small className="learning-note">Os filtros ficam disponíveis novamente ao concluir ou encerrar este treino.</small>
  </section>;
}
