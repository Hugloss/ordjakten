/* Strict Node HTTP adapter for server-only protected learning sessions.
 * No authentication implementation, private bank, cache or server listener
 * is bundled. A production host must supply all security-critical ports.
 */
'use strict';
const TOKEN_RE=/^Bearer ([A-Za-z0-9._~-]{12,2048})$/;
const SESSION_PATH=/^\/v1\/learning\/sessions\/([A-Za-z0-9_-]{43})(?:\/(next|answers))?$/;
const HEADERS=Object.freeze({
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'private, no-store, max-age=0',
  'Pragma':'no-cache',
  'Vary':'Authorization',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'Cross-Origin-Resource-Policy':'same-origin',
  'X-Frame-Options':'DENY',
  'Content-Security-Policy':"default-src 'none'"
});
const CODE_STATUS=Object.freeze({
  unauthorized:401,
  session_not_found:404,
  cooldown:429,hourly_quota:429,daily_quota:429,session_quota:429,
  active_session_exists:409,question_not_active:409,
  invalid_answer_limit:429,invalid_session_state:409,
  invalid_session_request:422,
  invalid_answer:422,answer_too_large:413,
  service_unavailable:503,clock_unavailable:503,clock_regressed:503,
  private_bank_unavailable:503,private_grading_unavailable:503,
  unsafe_public_projection:503,storage_unavailable:503
});
function response(res,status,body,retryAfterMs=0){
  const extra=retryAfterMs>0?{'Retry-After':String(Math.ceil(retryAfterMs/1000))}:{};
  const content=JSON.stringify(body);
  res.writeHead(status,{...HEADERS,...extra,'Content-Length':Buffer.byteLength(content)});
  res.end(content);
}
function bodyError(code){
  const error=new Error('invalid_request');
  error.code=code;
  return error;
}
function allowedFields(object,names){
  return object!==null&&typeof object==='object'&&!Array.isArray(object)&&
    Object.keys(object).every(name=>names.includes(name));
}
async function jsonBody(req,maxBytes,{allowEmpty=false}={}){
  const parts=[];
  let size=0;
  for await(const chunk of req){
    size+=chunk.length;
    if(size>maxBytes)throw bodyError('payload_too_large');
    parts.push(chunk);
  }
  if(size===0&&allowEmpty)return {};
  const contentType=req.headers['content-type']||'';
  if(!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(contentType))
    throw bodyError('invalid_content_type');
  let parsed;
  try{
    const utf8=new TextDecoder('utf-8',{fatal:true})
      .decode(Buffer.concat(parts));
    parsed=JSON.parse(utf8);
  }catch(_){throw bodyError('invalid_json')}
  if(!allowedFields(parsed,[])){
    // Objects are accepted here, then each operation enforces exact keys.
    if(parsed===null||typeof parsed!=='object'||Array.isArray(parsed))
      throw bodyError('invalid_json');
  }
  return parsed;
}
function createHttpHandler(delivery,{allowedOrigin=null,maxBodyBytes=4096}={}){
  if(!delivery||['createSession','nextQuestion','submitAnswer','summary']
    .some(name=>typeof delivery[name]!=='function'))
    throw new Error('A protected delivery service is required');
  if(allowedOrigin!==null&&
    (typeof allowedOrigin!=='string'||!/^https:\/\/[^/]+$/.test(allowedOrigin)))
    throw new Error('Invalid allowed HTTPS origin');
  if(!Number.isSafeInteger(maxBodyBytes)||maxBodyBytes<512||maxBodyBytes>8192)
    throw new Error('Invalid HTTP request body limit');
  return async function protectedLearningHttp(req,res){
    try{
      const origin=req.headers.origin;
      if(origin&&(allowedOrigin===null||origin!==allowedOrigin)){
        response(res,403,{error:'origin_not_allowed'});
        return;
      }
      if(typeof req.url!=='string'||req.url.includes('?')||req.url.includes('#')){
        response(res,400,{error:'invalid_route'});
        return;
      }
      const match=SESSION_PATH.exec(req.url);
      const base=req.url==='/v1/learning/sessions';
      if(!base&&!match){
        response(res,404,{error:'not_found'});
        return;
      }
      if(!(base&&req.method==='POST'||match&&
        (req.method==='GET'&&!match[2]||
         req.method==='POST'&&['next','answers'].includes(match[2])))){
        response(res,405,{error:'method_not_allowed'});
        return;
      }
      const token=TOKEN_RE.exec(req.headers.authorization||'');
      if(!token){response(res,401,{error:'unauthorized'});return;}
      // Authentication is performed by the delivery service's injected,
      // trusted auth callback for EACH request. Never trust caller user IDs.
      const context={token:token[1]};
      let result;
      if(base){
        const data=await jsonBody(req,maxBodyBytes);
        if(!allowedFields(data,['bankId','requestedCount','mode']))
          throw bodyError('invalid_json');
        result=await delivery.createSession({context,...data});
      }else if(req.method==='POST'&&match[2]==='next'){
        const data=await jsonBody(req,maxBodyBytes,{allowEmpty:true});
        if(!allowedFields(data,[])||Object.keys(data).length!==0)
          throw bodyError('invalid_json');
        result=await delivery.nextQuestion({context,sessionId:match[1]});
      }else if(req.method==='POST'&&match[2]==='answers'){
        const data=await jsonBody(req,maxBodyBytes);
        if(!allowedFields(data,['instanceId','response']))
          throw bodyError('invalid_json');
        result=await delivery.submitAnswer({
          context,sessionId:match[1],instanceId:data.instanceId,
          response:data.response
        });
      }else{
        result=await delivery.summary({context,sessionId:match[1]});
      }
      response(res,200,result);
    }catch(err){
      const codes=['payload_too_large','invalid_content_type','invalid_json'];
      const code=typeof err?.code==='string'&&(codes.includes(err.code)||
        Object.hasOwn(CODE_STATUS,err.code))?err.code:'service_unavailable';
      const status=code==='payload_too_large'?413:
        code==='invalid_content_type'?415:code==='invalid_json'?400:
        CODE_STATUS[code]||503;
      // No error stack, private grading reason, author name or raw answer.
      response(res,status,{error:code,...(
        Number.isFinite(err?.retryAfterMs)&&err.retryAfterMs>0?
          {retryAfterMs:Math.ceil(err.retryAfterMs)}:{})},
        err?.retryAfterMs||0);
    }
  };
}
module.exports={createHttpHandler};
