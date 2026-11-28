/* Public v1 question envelope: explicit projection, never serialize a bank question. */
'use strict';
const SCHEMA_VERSION='learning-public-question.v1';
const TOKEN=/^[a-z][a-z0-9-]{1,95}$/;
const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const goodId=x=>typeof x==='string'&&TOKEN.test(x);
const check=(ok,msg)=>{if(!ok)throw new Error(msg);};
const validText=x=>typeof x==='string'&&x.trim().length>0&&x.length<=4000;
const only=(o,keys)=>plain(o)&&Object.keys(o).every(k=>keys.includes(k));
function validateRef(ref){
 check(only(ref,['bankId','id','revision'])&&goodId(ref.bankId)&&
   goodId(ref.id)&&Number.isSafeInteger(ref.revision)&&ref.revision>=1,
   'Invalid public question reference');
 return ref;
}
function validateImage(row){
 check(only(row,['id','type','url','alt'])&&goodId(row.id)&&
   row.type==='image'&&validText(row.alt)&&row.alt.length<=500&&
   typeof row.url==='string'&&row.url.length>0&&row.url.length<=1024,
   'Invalid static image asset');
 if(row.url.startsWith('https://')){
  let url;
  try{url=new URL(row.url)}catch(_){throw new Error('Invalid image URL')}
  check(url.protocol==='https:'&&!url.username&&!url.password&&!url.hash,
    'Unsafe static image URL');
 }else{
  check(/^(?:\.\/|\/(?!\/))[A-Za-z0-9_.\/-]+$/.test(row.url)&&
    !row.url.split('/').includes('..')&&!row.url.includes('//'),
    'Unsafe local static image path');
 }
 return row;
}
function validateResponse(response){
 check(only(response,['kind','options'])&&
   ['single-choice','numeric','ordering'].includes(response.kind),
   'Unsupported public answer interaction');
 if(response.kind==='numeric'){
  check(response.options===undefined,'Numeric response cannot contain options');
  return response;
 }
 check(Array.isArray(response.options)&&
   response.options.length>=2&&response.options.length<=12,
   'Invalid public answer options');
 const ids=new Set();
 for(const row of response.options){
  check(only(row,['id','label'])&&goodId(row.id)&&validText(row.label)&&
    !ids.has(row.id),'Duplicate or unsafe public option');
  ids.add(row.id);
 }
 return response;
}
function validatePublicQuestion(question){
 check(only(question,['schemaVersion','sessionId','instanceId','ref',
  'prompt','stimulus','responseSpec','media'])&&
  question.schemaVersion===SCHEMA_VERSION&&
  typeof question.sessionId==='string'&&question.sessionId.length>0&&
  question.sessionId.length<=128&&typeof question.instanceId==='string'&&
  question.instanceId.length>0&&question.instanceId.length<=160&&
  validText(question.prompt),'Invalid public question envelope');
 validateRef(question.ref);
 validateResponse(question.responseSpec);
 if(question.stimulus!==undefined)
  check(validText(question.stimulus),'Invalid public stimulus');
 if(question.media!==undefined){
  check(Array.isArray(question.media)&&question.media.length<=6,
    'Too many public images');
  const ids=new Set();
  for(const item of question.media){
   validateImage(item);
   check(!ids.has(item.id),'Duplicate image asset');
   ids.add(item.id);
  }
 }
 return question;
}
// By design: strip every unknown/internal field (answer keys, rubrics, skill
// graph, provenance and selection weights). No private source is serialized.
function toPublicQuestion(presentation,{sessionId,media=[]}={}){
 check(plain(presentation)&&plain(presentation.responseSpec),
  'Invalid question presentation');
 const responseSpec=presentation.responseSpec;
 const publicResponse={
  kind:responseSpec.kind,
  ...(['single-choice','ordering'].includes(responseSpec.kind)?
   {options:Array.isArray(responseSpec.options)?
    responseSpec.options.map(x=>({id:x.id,label:x.label})):null}:{})
 };
 const question={
  schemaVersion:SCHEMA_VERSION,sessionId,
  instanceId:presentation.instanceId,
  ref:presentation.ref?{bankId:presentation.ref.bankId,id:presentation.ref.id,
   revision:presentation.ref.revision}:null,
  prompt:presentation.prompt,
  ...(presentation.stimulus==null?{}:{stimulus:presentation.stimulus}),
  responseSpec:publicResponse,
  media:media.map(item=>({id:item.id,type:item.type,url:item.url,alt:item.alt}))
 };
 return validatePublicQuestion(question);
}
module.exports={SCHEMA_VERSION,validatePublicQuestion,toPublicQuestion};
