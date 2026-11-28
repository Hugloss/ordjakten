'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {PublicQuestion:Public}=require('../index');
const source=()=>({
 instanceId:'session:1',ref:{bankId:'radiology',id:'scan-1',revision:2},
 prompt:'Vilken struktur visas?',stimulus:'En schematisk bild',
 responseSpec:{kind:'single-choice',options:[
  {id:'option-a',label:'Struktur A',correct:false,privateWeight:0.75},
  {id:'option-b',label:'Struktur B',correct:true,privateWeight:0.95}
 ]},
 assessmentSpec:{correctOptionId:'option-b',policyId:'private-rubric'},
 answer:'option-b',secretRubric:{threshold:6},
 skillIds:['private-skill-graph'],provenance:{privateSource:'secret bank'}
});
test('public projection strips every internal answer, rubric and policy field',()=>{
 const packet=Public.toPublicQuestion(source(),{sessionId:'session-1'});
 assert.equal(packet.schemaVersion,'learning-public-question.v1');
 assert.equal(packet.responseSpec.options.length,2);
 assert.deepEqual(Object.keys(packet.responseSpec.options[0]),['id','label']);
 const encoded=JSON.stringify(packet);
 for(const secret of ['correctOptionId','private-rubric','privateWeight',
   'private-skill-graph','privateSource','secretRubric','"correct":true'])
  assert.equal(encoded.includes(secret),false,secret);
});
test('a static medical picture can be provided without enabling interaction',()=>{
 const packet=Public.toPublicQuestion(source(),{sessionId:'session-1',
  media:[{id:'img-1',type:'image',url:'https://cdn.example.org/scan.webp',
    alt:'Schematisk anatomisk illustration',metadata:'private'}]});
 assert.deepEqual(packet.media,[{
  id:'img-1',type:'image',url:'https://cdn.example.org/scan.webp',
  alt:'Schematisk anatomisk illustration'
 }]);
 assert.equal(packet.media[0].type,'image');
});
test('public packet rejects raw answer keys and secret policy fields',()=>{
 const p=Public.toPublicQuestion(source(),{sessionId:'session-1'});
 assert.throws(()=>Public.validatePublicQuestion({...p,correctAnswer:'option-b'}),
  /envelope/);
 assert.throws(()=>Public.validatePublicQuestion({...p,
  responseSpec:{...p.responseSpec,correctOptionId:'option-b'}}),/interaction/);
 assert.throws(()=>Public.validatePublicQuestion({...p,
  responseSpec:{...p.responseSpec,options:[
   ...p.responseSpec.options,{id:'option-a',label:'Duplicate'}
  ]}}),/Duplicate/);
});
test('unsupported media and unsafe resource paths are rejected',()=>{
 for(const url of ['javascript:alert(1)','http://insecure.test/x.png',
   '//attacker.test/x.png','../outside.png','./assets/../secret.png']){
  assert.throws(()=>Public.toPublicQuestion(source(),{sessionId:'session-1',
   media:[{id:'img-1',type:'image',url,alt:'Bild'}]}),/Unsafe/);
 }
 assert.throws(()=>Public.toPublicQuestion(source(),{sessionId:'session-1',
  media:[{id:'img-1',type:'video',url:'./assets/test.webm',alt:'Video'}]}),
  /Invalid static image/);
});
test('numeric questions have no answer options in a public packet',()=>{
 const q=source();q.responseSpec={kind:'numeric'};
 const packet=Public.toPublicQuestion(q,{sessionId:'s'});
 assert.deepEqual(packet.responseSpec,{kind:'numeric'});
});
