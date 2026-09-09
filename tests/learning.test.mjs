import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {topics,subjects,classrooms,models,filterTopics,scoreAnswers,scheduleReview,dueCards} from '../src/learningData.js';
import {addTeachingModel} from '../src/modelBuilders.js';

test('every proposed subject has original study material in each year, with valid answer keys',()=>{
  assert.equal(subjects.length,14);assert.equal(topics.length,42);
  const ids=new Set();
  for(const classroom of classrooms)for(const subject of subjects){
    const matching=filterTopics({classroom,subject});
    assert.ok(matching.length>0,`${subject} / ${classroom}`);
    assert.ok(matching.every(t=>t.grade===Number(classroom[0])));
  }
  for(const t of topics)for(const q of t.questions){
    assert.ok(!ids.has(q.id));ids.add(q.id);
    assert.ok(q.correct>=0&&q.correct<q.options.length);
    assert.equal(new Set(q.options).size,q.options.length);
    assert.ok(q.explanation.length>20);
    assert.ok(t.cards.some(c=>c.id===q.id&&c.back===q.options[q.correct]));
  }
  assert.equal(ids.size,84);
});

test('class, subject and topic filters intersect; class-specific resources do not leak',()=>{
  const original=topics[0],classOnly={...original,id:'class-only',audiences:['1º A']};
  assert.deepEqual(filterTopics({classroom:'1º B'},[classOnly]),[]);
  assert.deepEqual(filterTopics({classroom:'2º A'},[classOnly]),[]);
  assert.equal(filterTopics({classroom:'1º A',subject:original.subject,topic:'class-only'},[classOnly]).length,1);
  assert.equal(filterTopics({classroom:'1º A',subject:'Física'},[classOnly]).length,0);
});

test('scoring includes unanswered questions and never creates school points',()=>{
  const questions=topics.slice(0,2).flatMap(t=>t.questions);
  const result=scoreAnswers(questions,{[questions[0].id]:questions[0].correct,[questions[1].id]:(questions[1].correct+1)%3});
  assert.deepEqual(result,{correct:1,total:4,percent:25});
  assert.deepEqual(scoreAnswers([],{}),{correct:0,total:0,percent:0});
});

test('review intervals and per-student queues',()=>{
  const now=1800000000000,cards=topics[0].cards;
  const reviewsA={[cards[0].id]:scheduleReview('known',now),[cards[1].id]:scheduleReview('partial',now)};
  assert.equal(dueCards(cards,reviewsA,now).length,0);
  assert.equal(dueCards(cards,{},now).length,2);
  assert.equal(dueCards(cards,reviewsA,now+86400000).length,1);
  assert.equal(dueCards(cards,reviewsA,now+3*86400000).length,2);
  assert.equal(scheduleReview('again',now).nextReview,now);
});

test('teaching models have finite geometry, useful labels and distinct content',()=>{
  assert.equal(new Set(models.map(m=>m.id)).size,8);
  for(const kind of ['solids','wave','dna','globe']){
    const group=new THREE.Group();const animate=addTeachingModel(kind,group);
    assert.ok(group.children.length>=2,kind);
    for(const obj of group.children){assert.ok(obj.userData.label,kind);assert.ok([...obj.geometry.attributes.position.array].every(Number.isFinite),kind);}
    if(kind==='solids'){
      const [cylinder,cone]=group.children;
      assert.equal(cylinder.geometry.parameters.height,cone.geometry.parameters.height);
      assert.equal(cylinder.geometry.parameters.radiusBottom,cone.geometry.parameters.radius);
    }
    if(kind==='wave'){
      animate(0);const before=group.children[1].position.clone();animate(450);
      assert.equal(group.children[1].position.x,before.x);assert.notEqual(group.children[1].position.y,before.y);
    }
    group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
  }
});
