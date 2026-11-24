/* Small offline SVG maps. Decorative only: questions, scoring and timer live in engine.js.
   World artwork uses vector primitives, not remote images or untrusted HTML. */
(function (root, factory) {
  const api = factory(root.OrdjaktenAdventures || (typeof require === 'function' ? require('./adventures.js') : null));
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenMap = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Adventures) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const PATH = 'M45 230 C107 254 111 168 186 181 C258 194 259 76 342 98 C427 123 405 210 498 199 C590 188 602 78 703 95';
  const cache = new WeakMap();
  const DECOR = Object.freeze({
    forest:[['tree',90,100,1.2],['mushroom',285,238,1],['tree',602,226,1.5],['tree',720,235,.75]],
    space:[['planet',95,89,1.5],['sparkle',275,35,1],['planet',570,67,.85],['sparkle',685,250,1.3]],
    castle:[['castle',101,110,1.2],['flag',420,36,1],['castle',616,247,.75],['sparkle',710,32,.8]],
    pirate:[['palm',86,112,1.15],['island',295,236,1],['ship',602,236,.92],['cross',693,54,1]],
    ocean:[['fish',87,96,1.2],['coral',277,239,1],['fish',584,64,1.15],['bubbles',695,208,1.1]],
    dinosaurs:[['fern',93,100,1.3],['volcano',290,250,1.2],['egg',606,68,1.05],['fern',705,229,1.1]],
    garden:[['flower',92,108,1.35],['butterfly',300,235,1],['flower',590,67,1.2],['flower',690,240,.9]],
    unicorn:[['rainbow',101,95,1.45],['sparkle',300,242,1.1],['heart',585,62,1.4],['cloud',690,240,1]],
    animals:[['paw',102,94,1.3],['house',293,240,1.2],['paw',593,68,1],['house',692,250,.85]],
    rainbow:[['cloud',97,113,1.15],['rainbow',300,239,1.4],['sparkle',592,55,1.2],['cloud',693,244,.9]],
    horses:[['stable',100,99,1.2],['fence',287,251,1.1],['horseshoe',578,63,1.2],['fence',690,248,.85]],
    music:[['notes',94,101,1.25],['stage',300,242,1.15],['notes',585,65,1.3],['spotlight',698,218,1.1]]
  });
  function clamp(n,min,max){return Number.isFinite(n)?Math.max(min,Math.min(max,n)):min;}
  function model(id,total,answered) {
    const worldId = Adventures.isWorld(id) ? id : 'forest';
    const n = Number.isInteger(total) && total >= 1 && total <= 100 ? total : 5;
    const done = Math.floor(clamp(answered,0,n));
    return {id:worldId,total:n,answered:done,fraction:done/n,
      stages:Adventures.stages(worldId,n,done),world:Adventures.world(worldId)};
  }
  function svgEl(doc, tag, attrs={}, text) {
    const node=doc.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attrs)) node.setAttribute(key,String(value));
    if(text!==undefined)node.textContent=String(text);
    return node;
  }
  function append(parent,tag,attrs={},text){const node=svgEl(parent.ownerDocument,tag,attrs,text);parent.append(node);return node;}
  function motif(parent,type,x,y,scale){
    const g=append(parent,'g',{transform:`translate(${x} ${y}) scale(${scale})`,class:'map-motif motif-'+type,'aria-hidden':'true'});
    const r=(tag,attrs={},text)=>append(g,tag,attrs,text);
    switch(type){
      case 'tree':r('rect',{x:-4,y:-7,width:8,height:43,rx:3,class:'map-wood'});[-13,0,13].forEach((yy,i)=>r('path',{d:`M0 ${yy-34} L${-23+i*3} ${yy+11} H${23-i*3} Z`,class:'map-leaf'}));break;
      case 'mushroom':r('rect',{x:-5,y:1,width:10,height:22,rx:4,class:'map-cream'});r('path',{d:'M-23 3 Q-19 -30 0 -30 Q20 -30 23 3 Z',class:'map-bright'});r('circle',{cx:-8,cy:-12,r:4,class:'map-cream'});r('circle',{cx:8,cy:-19,r:3,class:'map-cream'});break;
      case 'planet':r('circle',{cx:0,cy:0,r:23,class:'map-bright'});r('ellipse',{cx:0,cy:0,rx:39,ry:9,transform:'rotate(-24)',class:'map-stroke','stroke-width':6,fill:'none'});r('circle',{cx:9,cy:-8,r:5,class:'map-cream'});break;
      case 'sparkle':r('path',{d:'M0 -25 L6 -6 L24 0 L6 6 L0 25 L-6 6 L-24 0 L-6 -6 Z',class:'map-bright'});break;
      case 'castle':r('rect',{x:-25,y:-4,width:50,height:39,rx:2,class:'map-accent'});r('rect',{x:-36,y:-25,width:17,height:60,class:'map-bright'});r('rect',{x:19,y:-25,width:17,height:60,class:'map-bright'});r('path',{d:'M-38 -25 V-37 H-30 V-30 H-22 V-37 H-17 V-25 M17 -25 V-37 H25 V-30 H31 V-37 H38 V-25',class:'map-stroke','stroke-width':4,fill:'none'});r('path',{d:'M-9 35 V13 A9 9 0 0 1 9 13 V35',class:'map-door'});break;
      case 'flag':r('path',{d:'M-16 28 V-32',class:'map-stroke','stroke-width':4,fill:'none'});r('path',{d:'M-14 -32 L27 -19 L-14 -7 Z',class:'map-bright'});break;
      case 'palm':r('path',{d:'M0 27 Q10 6 0 -22',class:'map-stroke','stroke-width':8,fill:'none'});[-70,-32,12,57,100].forEach(a=>r('ellipse',{cx:0,cy:-29,rx:7,ry:23,transform:`rotate(${a} 0 -18)`,class:'map-leaf'}));break;
      case 'island':r('ellipse',{cx:0,cy:22,rx:44,ry:13,class:'map-accent'});r('path',{d:'M-25 19 Q-3 -18 20 19',class:'map-bright'});break;
      case 'ship':r('path',{d:'M-37 8 H37 L23 26 H-23 Z',class:'map-accent'});r('path',{d:'M0 8 V-32 M3 -27 L28 0 H3 Z',class:'map-stroke',fill:'none','stroke-width':4});r('path',{d:'M2 -27 L25 0 H2 Z',class:'map-bright'});break;
      case 'cross':r('path',{d:'M-18 -18 L18 18 M18 -18 L-18 18',class:'map-stroke','stroke-width':9,fill:'none'});break;
      case 'fish':r('ellipse',{cx:0,cy:0,rx:25,ry:15,class:'map-bright'});r('path',{d:'M20 0 L44 -16 V16 Z',class:'map-accent'});r('circle',{cx:-12,cy:-4,r:3,class:'map-dot'});break;
      case 'coral':r('path',{d:'M0 30 V-30 M0 -3 L-22 -20 M-22 -20 V-34 M0 10 L24 -8 M24 -8 V-25 M0 23 L-18 10',class:'map-stroke',fill:'none','stroke-width':8,'stroke-linecap':'round'});break;
      case 'bubbles':[[0,0,10],[24,-21,8],[-18,-34,6],[14,-54,4]].forEach(([cx,cy,rad])=>r('circle',{cx,cy,r:rad,class:'map-outline',fill:'none','stroke-width':3}));break;
      case 'fern':r('path',{d:'M0 30 Q-8 -5 0 -35',class:'map-stroke',fill:'none','stroke-width':3});[-28,-18,-8,2,12].forEach((yy,i)=>{r('ellipse',{cx:-12,cy:yy,rx:14,ry:5,transform:`rotate(${-35+i*4} -12 ${yy})`,class:'map-leaf'});r('ellipse',{cx:12,cy:yy-4,rx:14,ry:5,transform:`rotate(${35-i*4} 12 ${yy-4})`,class:'map-leaf'});});break;
      case 'volcano':r('path',{d:'M-40 30 L-13 -18 H12 L41 30 Z',class:'map-accent'});r('path',{d:'M-15 -18 Q0 -5 12 -18',class:'map-stroke',fill:'none','stroke-width':5});r('path',{d:'M-10 -25 Q-20 -38 -10 -47 M4 -27 Q18 -38 10 -49',class:'map-outline',fill:'none','stroke-width':4});break;
      case 'egg':r('ellipse',{cx:0,cy:0,rx:21,ry:29,class:'map-cream'});r('circle',{cx:4,cy:-7,r:5,class:'map-accent'});r('circle',{cx:-7,cy:10,r:4,class:'map-accent'});break;
      case 'flower':r('path',{d:'M0 5 V36',class:'map-stroke',fill:'none','stroke-width':5});[0,60,120,180,240,300].forEach(a=>r('ellipse',{cx:0,cy:-13,rx:9,ry:17,transform:`rotate(${a} 0 0)`,class:'map-bright'}));r('circle',{cx:0,cy:0,r:9,class:'map-cream'});break;
      case 'butterfly':r('ellipse',{cx:-12,cy:-10,rx:15,ry:23,transform:'rotate(-26 -12 -10)',class:'map-bright'});r('ellipse',{cx:12,cy:-10,rx:15,ry:23,transform:'rotate(26 12 -10)',class:'map-bright'});r('ellipse',{cx:-10,cy:13,rx:11,ry:14,class:'map-accent'});r('ellipse',{cx:10,cy:13,rx:11,ry:14,class:'map-accent'});r('path',{d:'M0 -18 V25',class:'map-stroke','stroke-width':4});break;
      case 'rainbow':for(let i=0;i<4;i++)r('path',{d:`M${-40+i*7} 20 A${40-i*7} ${40-i*7} 0 0 1 ${40-i*7} 20`,class:['map-bright','map-accent','map-cream','map-outline'][i],fill:'none','stroke-width':6,'stroke-linecap':'round'});break;
      case 'heart':r('path',{d:'M0 26 C-37 2 -32 -24 -12 -25 Q-2 -25 0 -12 Q6 -29 19 -25 C42 -21 29 6 0 26 Z',class:'map-bright'});break;
      case 'cloud':r('path',{d:'M-26 12 Q-41 -8 -15 -15 Q-10 -38 11 -24 Q30 -30 32 -12 Q50 -6 29 14 H-26 Z',class:'map-cream'});break;
      case 'paw':r('ellipse',{cx:0,cy:13,rx:22,ry:17,class:'map-bright'});[[-21,-14],[-8,-27],[11,-27],[24,-14]].forEach(([cx,cy])=>r('ellipse',{cx,cy,rx:8,ry:11,class:'map-bright'}));break;
      case 'house':r('rect',{x:-26,y:-5,width:52,height:36,rx:3,class:'map-accent'});r('path',{d:'M-34 -5 L0 -35 L34 -5 Z',class:'map-bright'});r('rect',{x:-7,y:9,width:14,height:22,class:'map-door'});break;
      case 'stable':r('rect',{x:-34,y:-12,width:68,height:44,class:'map-accent'});r('path',{d:'M-42 -12 L0 -42 L42 -12 Z',class:'map-bright'});r('path',{d:'M-12 32 V2 Q0 -8 12 2 V32',class:'map-door'});break;
      case 'fence':[-24,0,24].forEach(a=>r('rect',{x:a-3,y:-19,width:6,height:50,rx:2,class:'map-wood'}));[-11,15].forEach(yy=>r('rect',{x:-33,y:yy,width:66,height:6,class:'map-accent'}));break;
      case 'horseshoe':r('path',{d:'M-20 -22 V8 A20 20 0 0 0 20 8 V-22',class:'map-outline','stroke-width':12,fill:'none','stroke-linecap':'round'});break;
      case 'notes':r('path',{d:'M0 -26 V19 M27 -36 V8 M0 -26 L27 -36',class:'map-stroke',fill:'none','stroke-width':5});r('ellipse',{cx:-8,cy:19,rx:13,ry:8,transform:'rotate(-25 -8 19)',class:'map-bright'});r('ellipse',{cx:19,cy:8,rx:13,ry:8,transform:'rotate(-25 19 8)',class:'map-bright'});break;
      case 'stage':r('rect',{x:-43,y:-33,width:86,height:66,rx:4,class:'map-accent'});r('path',{d:'M-43 -33 Q-26 -10 -30 14 L-43 33 M43 -33 Q26 -10 30 14 L43 33',class:'map-bright','stroke-width':4});r('circle',{cx:0,cy:-4,r:15,class:'map-cream'});break;
      case 'spotlight':r('path',{d:'M-18 -30 L18 -30 L33 -12 L-33 -12 Z',class:'map-accent'});r('path',{d:'M-19 -12 L-36 29 H36 L19 -12',class:'map-glow'});break;
    }
    return g;
  }
  function point(path,fraction){
    if(typeof path.getTotalLength==='function' && typeof path.getPointAtLength==='function'){
      const p=path.getPointAtLength(path.getTotalLength()*clamp(fraction,0,1));
      return {x:p.x,y:p.y};
    }
    // Browsers without SVG geometry APIs still show all stages and labels.
    return {x:45+658*fraction,y:188};
  }
  function build(target,state,preview){
    const doc=target.ownerDocument;
    const svg=svgEl(doc,'svg',{viewBox:'0 0 760 300',class:'adventure-svg','data-world':state.id,role:'img',focusable:'false','aria-label':'Äventyrskarta för '+state.world.title});
    append(svg,'rect',{x:1,y:1,width:758,height:298,rx:23,class:'map-sky'});
    if(state.id==='space'){
      [[60,42,2],[184,38,3],[376,31,2],[473,56,3],[643,35,2],[733,179,2],[406,246,2],[219,255,2]].forEach(([x,y,r])=>append(svg,'circle',{cx:x,cy:y,r,class:'map-star'}));
      append(svg,'path',{d:'M0 268 Q125 215 240 285 T485 267 T760 254 V299 H0 Z',class:'map-ground'});
    }else if(state.id==='ocean'){
      append(svg,'path',{d:'M0 226 Q85 208 170 227 T350 226 T530 227 T760 225 V300 H0 Z',class:'map-ground'});
      [50,156,268].forEach(y=>append(svg,'path',{d:`M0 ${y} Q95 ${y-14} 190 ${y} T380 ${y} T570 ${y} T760 ${y}`,class:'map-water',fill:'none','stroke-width':3}));
    }else{
      append(svg,'path',{d:'M0 226 Q99 194 194 231 T400 220 T600 216 T760 224 V299 H0 Z',class:'map-ground'});
      append(svg,'path',{d:'M0 272 Q145 242 280 277 T545 262 T760 271 V299 H0 Z',class:'map-ground-alt'});
    }
    const scenic=append(svg,'g',{class:'map-scenery','aria-hidden':'true'});
    for(const [type,x,y,s] of DECOR[state.id])motif(scenic,type,x,y,s);
    const road=append(svg,'path',{d:PATH,class:'map-road',fill:'none','stroke-width':13,'stroke-linecap':'round','stroke-linejoin':'round'});
    const completed=append(svg,'path',{d:PATH,class:'map-road-done',fill:'none','stroke-width':8,'stroke-linecap':'round','stroke-linejoin':'round',pathLength:100});
    const stops=state.stages.map((stage,i)=>{
      const p=point(road,(i+1)/4);
      const g=append(svg,'g',{class:'map-stop','data-stop':String(i+1),transform:`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`});
      append(g,'circle',{r:28,class:'map-stop-back'});
      append(g,'circle',{r:22,class:'map-stop-inner'});
      append(g,'text',{class:'map-stop-icon',x:0,y:10,'text-anchor':'middle'},stage.emoji);
      return g;
    });
    const player=append(svg,'g',{class:'map-player','aria-hidden':'true'});
    append(player,'path',{d:'M0 10 L-7 -2 H7 Z',class:'map-player-arrow'});
    append(player,'circle',{cx:0,cy:-15,r:17,class:'map-player-dot'});
    append(player,'text',{x:0,y:-9,'text-anchor':'middle',class:'map-player-star'},'★');
    target.replaceChildren(svg);
    return {svg,road,completed,stops,player,preview};
  }
  function render(target,id,total,answered,opts={}){
    if(!target || !target.ownerDocument) throw new Error('Map container required');
    const state=model(id,total,answered);
    const preview=Boolean(opts.preview);
    let view=cache.get(target);
    if(!view || view.svg.dataset.world!==state.id || view.preview!==preview){
      view=build(target,state,preview);cache.set(target,view);
    }
    view.completed.setAttribute('stroke-dasharray',`${(state.fraction*100).toFixed(2)} 100`);
    view.stops.forEach((g,i)=>{
      const reached=state.stages[i].reached;
      g.classList.toggle('map-reached',reached);
      g.classList.toggle('map-locked',!reached);
      g.setAttribute('aria-label',state.stages[i].name+(reached?' upptäckt':' återstår'));
    });
    const p=point(view.road,state.fraction);
    view.player.setAttribute('transform',`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);
    view.svg.setAttribute('aria-label',`${state.world.title}. ${state.answered} av ${state.total} ord avklarade. ${state.stages.filter(s=>s.reached).length} av 4 platser upptäckta.`);
    target.dataset.world=state.id;
    return state;
  }
  return {PATH,DECOR,model,render};
});
