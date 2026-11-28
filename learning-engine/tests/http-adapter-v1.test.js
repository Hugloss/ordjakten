'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const {ProtectedDelivery:Delivery,HttpAdapter}=require('../index');
async function withServer(run){
 let at=1000000;
 const bank={
  async plan({bankId,requestedCount}){
   return Array.from({length:requestedCount},(_,i)=>({
    bankId,id:'question-'+(i+1),revision:1
   }));
  },
  async present(){return {
   prompt:'Choose one of the two options',
   responseSpec:{kind:'single-choice',options:[
    {id:'original-left',label:'Left'},
    {id:'original-right',label:'Right'}
   ]},
   answerKey:'original-right',secretRubric:'NEVER_LEAK'
  }},
  async grade({answer}){return {status:answer==='original-right'?
    'correct':'incorrect',privateNotes:'hidden'}}
 };
 const delivery=Delivery.createProtectedDelivery({
  authenticate:async context=>{
   if(context.token==='alice-synthetic-test-token')
    return {tenantId:'school',subjectId:'alice'};
   if(context.token==='bob-synthetic-test-token')
    return {tenantId:'school',subjectId:'bob'};
   throw new Error('hidden authentication details');
  },
  bank,store:Delivery.createInMemoryStore(),allowInMemoryForTests:true,
  now:()=>at
 });
 const server=http.createServer(HttpAdapter.createHttpHandler(delivery));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const root='http://127.0.0.1:'+server.address().port;
 async function call(route,{method='GET',token='alice-synthetic-test-token',
    body,headers={}}={}){
  return fetch(root+route,{
   method,
   headers:{...(token?{Authorization:'Bearer '+token}:{}),
     ...(body===undefined?{}:{'Content-Type':'application/json'}),
     ...headers},
   ...(body===undefined?{}:{body:typeof body==='string'?body:JSON.stringify(body)})
  });
 }
 try{return await run({call,advance:n=>{at+=n}})}
 finally{
  server.closeAllConnections();
  await new Promise(resolve=>server.close(resolve));
 }
}
test('HTTP 100-question selection returns no bulk data, and endpoint releases one opaque item',async()=>{
 await withServer(async({call})=>{
  const started=await call('/v1/learning/sessions',{
   method:'POST',body:{bankId:'physics',requestedCount:100,mode:'test'}});
  assert.equal(started.status,200);
  assert.match(started.headers.get('cache-control'),/no-store/);
  assert.equal(started.headers.get('vary'),'Authorization');
  const state=await started.json();
  assert.equal(state.progress.requested,100);
  assert.equal('questions' in state,false);
  const q=await call('/v1/learning/sessions/'+state.sessionId+'/next',{
   method:'POST'});
  assert.equal(q.status,200);
  const data=await q.json();
  assert.equal(data.progress.issued,1);
  assert.equal(data.question.responseSpec.options.length,2);
  assert.equal('ref' in data.question,false);
  const raw=JSON.stringify(data);
  for(const secret of ['original-right','original-left','question-1',
    'NEVER_LEAK','answerKey','secretRubric','privateNotes'])
   assert.equal(raw.includes(secret),false,secret);
  const list=await call('/v1/learning/sessions');
  assert.equal(list.status,405);
 });
});
test('HTTP cooldown maps to 429 with Retry-After, and client-supplied clocks fail',async()=>{
 await withServer(async({call,advance})=>{
  const s=await (await call('/v1/learning/sessions',{method:'POST',
   body:{bankId:'physics',requestedCount:2}})).json();
  const base='/v1/learning/sessions/'+s.sessionId;
  const q=(await (await call(base+'/next',{method:'POST'})).json()).question;
  const good=q.responseSpec.options.find(x=>x.label==='Right');
  const answer=await call(base+'/answers',{method:'POST',
   body:{instanceId:q.instanceId,response:good.id}});
  assert.equal(answer.status,200);
  const next=await call(base+'/next',{method:'POST'});
  assert.equal(next.status,429);
  assert.equal(next.headers.get('retry-after'),'30');
  assert.equal((await next.json()).error,'cooldown');
  const bad=await call(base+'/next',{method:'POST',body:{now:999999999}});
  assert.equal(bad.status,400);
  advance(30000);
  const second=await call(base+'/next',{method:'POST'});
  assert.equal(second.status,200);
  assert.equal((await second.json()).progress.issued,2);
 });
});
test('HTTP access checks identity each time, denies cross-user sessions and foreign origins',async()=>{
 await withServer(async({call})=>{
  const s=(await (await call('/v1/learning/sessions',{method:'POST',
   body:{bankId:'physics',requestedCount:1}})).json());
  const base='/v1/learning/sessions/'+s.sessionId;
  assert.equal((await call(base+'/next',{method:'POST',token:null})).status,401);
  assert.equal((await call(base+'/next',{
   method:'POST',token:'bad-long-bearer-token'})).status,401);
  assert.equal((await call(base+'/next',{
   method:'POST',token:'bob-synthetic-test-token'})).status,404);
  assert.equal((await call(base+'/next',{
   method:'POST',headers:{Origin:'https://attacker.example'}})).status,403);
  assert.equal((await call(base+'/next',{method:'POST'})).status,200);
 });
});
test('HTTP test mode withholds per-question results until completion',async()=>{
 await withServer(async({call})=>{
  const s=(await (await call('/v1/learning/sessions',{method:'POST',
   body:{bankId:'physics',requestedCount:1,mode:'test'}})).json());
  const base='/v1/learning/sessions/'+s.sessionId;
  const question=(await (await call(base+'/next',{method:'POST'})).json()).question;
  const option=question.responseSpec.options.find(x=>x.label==='Right');
  const result=await (await call(base+'/answers',{method:'POST',
   body:{instanceId:question.instanceId,response:option.id}})).json();
  assert.equal('feedback' in result,false);
  const summary=await call(base);
  assert.equal(summary.status,200);
  assert.equal((await summary.json()).results.correct,1);
 });
});
test('HTTP rejects oversized or malformed JSON without disclosing input or stack',async()=>{
 await withServer(async({call})=>{
  const big=await call('/v1/learning/sessions',{method:'POST',
   body:{bankId:'physics',requestedCount:1,padding:'x'.repeat(20000)}});
  assert.equal(big.status,413);
  const invalid=await call('/v1/learning/sessions',{method:'POST',
   body:'{"bad":"sensitive bank secret"'});
  assert.equal(invalid.status,400);
  assert.equal(JSON.stringify(await invalid.json()).includes('sensitive'),false);
 });
});
test('HTTP adapter rejects invalid production origin configuration',()=>{
 assert.throws(()=>HttpAdapter.createHttpHandler({
  createSession(){},nextQuestion(){},submitAnswer(){},summary(){}
 },{allowedOrigin:'https://alice.example/path'}),/origin/);
 assert.throws(()=>HttpAdapter.createHttpHandler({
  createSession(){},nextQuestion(){},submitAnswer(){},summary(){}
 },{allowedOrigin:'http://alice.example'}),/origin/);
});
