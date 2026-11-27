'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const source=fs.readFileSync(path.join(__dirname,'../public/sw.js'),'utf8');
const scope='https://hugloss.github.io/ordjakten/';
const absolute=file=>new URL(file,scope).href;
const deferred=()=>{
  let resolve,reject;
  const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});
  return {promise,resolve,reject};
};

// Run the shipped handlers with API doubles; this does not simulate a browser lifecycle.
function worker(){
  const handlers={},stores=new Map();
  const calls={open:[],match:[],addAll:[],put:[],fetch:[],delete:[],skipWaiting:0,claim:0};
  const state={
    network:async()=>new Response('network'),
    addAll:async()=>{},
    deleteCache:async()=>{},
    claim:async()=>{},
    skipWaiting:async()=>{},
    cacheError:null
  };
  const cacheFor=name=>{
    if(!stores.has(name))stores.set(name,new Map());
    return stores.get(name);
  };
  const context=vm.createContext({
    URL,Request,Response,
    self:{
      location:{origin:new URL(scope).origin},
      registration:{scope},
      addEventListener:(type,handler)=>{handlers[type]=handler;},
      skipWaiting:()=>{calls.skipWaiting++;return state.skipWaiting();},
      clients:{claim:()=>{calls.claim++;return state.claim();}}
    },
    caches:{
      open:async name=>{
        calls.open.push(name);
        if(state.cacheError==='open')throw new Error('cache unavailable');
        const entries=cacheFor(name);
        return {
          match:async request=>{
            const url=typeof request==='string'?request:request.url;
            calls.match.push({name,url});
            if(state.cacheError==='match')throw new Error('cache unavailable');
            return entries.get(url)?.clone();
          },
          addAll:async requests=>{
            calls.addAll.push(Array.from(requests));
            await state.addAll(requests);
          },
          put:async(request,response)=>{
            calls.put.push(request);
            entries.set(typeof request==='string'?request:request.url,response);
          }
        };
      },
      match:()=>assert.fail('Only the current release cache may supply a response'),
      keys:async()=>[...stores.keys()],
      delete:async name=>{
        calls.delete.push(name);
        await state.deleteCache(name);
        return stores.delete(name);
      }
    },
    fetch:async request=>{
      calls.fetch.push(request);
      return state.network(request);
    }
  });
  vm.runInContext(source,context,{filename:'public/sw.js'});
  const name=vm.runInContext('CACHE_NAME',context);
  return {
    calls,state,stores,name,
    files:Array.from(vm.runInContext('FILES',context)),
    seed:(file,body,cacheName=name)=>cacheFor(cacheName).set(absolute(file),new Response(body)),
    fetch:(file,options={})=>{
      const request={url:absolute(file),method:'GET',mode:'cors',...options};
      const event={request,handled:false};
      handlers.fetch({request,respondWith:promise=>{
        assert.equal(event.handled,false);
        event.handled=true;
        event.response=Promise.resolve(promise);
      }});
      return event;
    },
    lifecycle:type=>{
      const waits=[];
      handlers[type]({waitUntil:promise=>waits.push(promise)});
      assert.ok(waits.length,'Lifecycle work must extend the event');
      return Promise.all(waits);
    }
  };
}

test('install requests the complete release without stale HTTP cache and waits before promotion',async()=>{
  const h=worker(),started=deferred(),downloaded=deferred(),promoting=deferred(),promoted=deferred();
  h.state.addAll=async requests=>{started.resolve(Array.from(requests));await downloaded.promise;};
  h.state.skipWaiting=async()=>{promoting.resolve();await promoted.promise;};
  let finished=false;
  const installing=h.lifecycle('install').then(()=>{finished=true;});
  const requests=await started.promise;
  assert.deepEqual(requests.map(request=>request.url),h.files.map(absolute));
  assert.ok(requests.every(request=>request instanceof Request&&request.cache==='reload'));
  assert.equal(h.calls.skipWaiting,0);
  assert.equal(finished,false);
  downloaded.resolve();
  await promoting.promise;
  assert.equal(finished,false,'waitUntil must also include skipWaiting');
  promoted.resolve();
  await installing;
  assert.equal(h.calls.skipWaiting,1);
});

test('failed precache installation does not promote or remove a working previous release',async()=>{
  const h=worker(),old='ordjakten-static-v66-published-feedback';
  h.seed('./index.html','previous release',old);
  h.state.addAll=async()=>{throw new TypeError('asset download failed');};
  await assert.rejects(h.lifecycle('install'),/asset download failed/);
  assert.equal(h.calls.skipWaiting,0);
  assert.deepEqual(h.calls.delete,[]);
  assert.equal(await h.stores.get(old).get(absolute('./index.html')).text(),'previous release');
});

test('activation removes only older game caches and waits for cleanup and client claim',async()=>{
  const h=worker(),deleting=deferred(),deleted=deferred(),claiming=deferred(),claimed=deferred();
  const old='ordjakten-static-v66-published-feedback',unrelated='another-game-v1';
  for(const name of [h.name,old,unrelated])h.seed('./index.html',name,name);
  h.state.deleteCache=async()=>{deleting.resolve();await deleted.promise;};
  h.state.claim=async()=>{claiming.resolve();await claimed.promise;};
  let finished=false;
  const activating=h.lifecycle('activate').then(()=>{finished=true;});
  await deleting.promise;
  assert.deepEqual(h.calls.delete,[old]);
  assert.equal(h.calls.claim,0);
  deleted.resolve();
  await claiming.promise;
  assert.equal(finished,false,'waitUntil must also include clients.claim');
  claimed.resolve();
  await activating;
  assert.deepEqual([...h.stores.keys()],[h.name,unrelated]);
});

test('cached pages and assets stay in one release despite origin errors or newer network files',async()=>{
  const h=worker();
  h.seed('./index.html','installed HTML');
  h.seed('./js/app.js','installed script');
  for(const network of [
    async()=>new Response('server unavailable',{status:503}),
    async()=>{throw new TypeError('offline');},
    async()=>new Response('newer release')
  ]){
    h.state.network=network;
    assert.equal(await (await h.fetch('./',{mode:'navigate'}).response).text(),'installed HTML');
    assert.equal(await (await h.fetch('./js/app.js').response).text(),'installed script');
  }
  assert.deepEqual(h.calls.fetch,[]);
  assert.deepEqual(h.calls.put,[]);
  assert.ok(h.calls.match.every(call=>call.name===h.name));
});

test('only homepage navigations normalize query parameters to the cached index',async()=>{
  const h=worker();
  h.seed('./','separate root entry');
  h.seed('./index.html','installed homepage');
  for(const file of ['./','./?from=shared','./index.html','./index.html?from=shared&view=home']){
    assert.equal(await (await h.fetch(file,{mode:'navigate'}).response).text(),'installed homepage');
  }
  assert.deepEqual(h.calls.match.map(call=>call.url),Array(4).fill(absolute('./index.html')));
  assert.deepEqual(h.calls.fetch,[]);
});

test('unrelated URLs, queries, origins and methods remain unhandled for ordinary browser networking',()=>{
  const h=worker();
  for(const [file,options] of [
    ['./js/app.js?version=next',{}],
    ['./data/ordbank.json?lang=sv',{}],
    ['./missing.js',{}],
    ['./other.html',{mode:'navigate'}],
    ['./folder/index.html?from=shared',{mode:'navigate'}],
    ['./?from=shared',{}],
    ['./index.html?from=shared',{}],
    ['/?from=shared',{mode:'navigate'}],
    ['/ordjakten-other/index.html',{mode:'navigate'}],
    ['/ordjakten',{mode:'navigate'}],
    ['https://other.example/ordjakten/index.html',{mode:'navigate'}],
    ['./index.html',{method:'POST',mode:'navigate'}],
    ['./js/app.js',{method:'HEAD'}]
  ])assert.equal(h.fetch(file,options).handled,false,file);
  assert.deepEqual(h.calls.open,[]);
  assert.deepEqual(h.calls.fetch,[]);
});

test('a missing asset uses the original network request without old-cache or HTML fallback or cache mutation',async()=>{
  const h=worker(),old='ordjakten-static-v66-published-feedback';
  h.seed('./index.html','current HTML');
  h.seed('./js/engine.js','old script',old);
  for(const status of [200,503]){
    h.state.network=async()=>new Response('network '+status,{status});
    const event=h.fetch('./js/engine.js');
    const response=await event.response;
    assert.equal(response.status,status);
    assert.equal(await response.text(),'network '+status);
    assert.equal(h.calls.fetch.at(-1),event.request);
    assert.equal(h.stores.get(h.name).has(absolute('./js/engine.js')),false);
  }
  h.state.network=async()=>{throw new TypeError('offline');};
  await assert.rejects(h.fetch('./js/engine.js').response,/offline/);
  assert.ok(h.calls.match.every(call=>call.name===h.name&&call.url===absolute('./js/engine.js')));
  assert.deepEqual(h.calls.put,[]);
});

test('a missing homepage fetches its original query without adding it to the release cache',async()=>{
  const h=worker();
  h.seed('./','root cache entry');
  const event=h.fetch('./?from=shared',{mode:'navigate'});
  assert.equal(await (await event.response).text(),'network');
  assert.equal(h.calls.fetch[0],event.request);
  assert.equal(h.calls.match[0].url,absolute('./index.html'));
  assert.deepEqual([...h.stores.get(h.name).keys()],[scope]);
  assert.deepEqual(h.calls.put,[]);
});

test('cache open or lookup failure still allows online play without changing the precache',async()=>{
  for(const stage of ['open','match']){
    const h=worker();
    h.seed('./index.html','installed homepage');
    h.state.cacheError=stage;
    const event=h.fetch('./?from=shared',{mode:'navigate'});
    assert.equal(await (await event.response).text(),'network');
    assert.equal(h.calls.fetch[0],event.request);
    assert.deepEqual(h.calls.put,[]);
    assert.equal(await h.stores.get(h.name).get(absolute('./index.html')).text(),'installed homepage');
  }
});
