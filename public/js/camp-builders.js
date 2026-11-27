/* Optional creative construction games. Finite guided builds followed by
 * free editing. Only session-local, authored pieces; no knowledge or score writes. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenBuilders=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const piece=(id,label,emoji,shape=null,pattern='solid',color='blue')=>({id,label,emoji,shape,pattern,color});
  const world={
    emoji:'🏗️',title:'Bygg en värld',intro:'Gör en liten by runt bäcken.',kind:'place',
    end:'Nu har du byggt en egen liten by!',
    slots:['Uppe till vänster','Uppe i mitten','Uppe till höger','Till vänster om bäcken','Över bäcken','Till höger om bäcken','Nere till vänster','Nere i mitten','Nere till höger'],
    base:['🌲','🌿','🌲','🌼','💧','🌼','🌿','🌿','🌿'],
    tasks:[
      {slot:4,words:['sv-0034'],prompt:'Bygg en avlång bro i mitten, över bäcken.',hint:'En avlång sak är mycket längre än den är bred. Välj den långa bron och tryck på bäcken.',
       options:[piece('rock','Rund sten','🪨'),piece('bridge','Lång träbro','🌉'),piece('flower','Blomma','🌷')],answer:'bridge',why:'Bron är mycket längre än den är bred. Det är därför formen är avlång. Bron ligger nu tvärs över bäcken.'},
      {slot:1,words:['sv-0066'],prompt:'Placera ett hus med fyrkantig vägg direkt ovanför bron.',hint:'Väggen ska ha fyra raka sidor och fyra hörn. Tryck på rutan direkt ovanför bron.',
       options:[piece('round-hut','Rund hydda','🛖','circle','solid','orange'),piece('house','Hus med kvadratisk vägg','🏠','square','solid','blue'),piece('tree','Träd','🌳')],answer:'house',why:'Väggen i bilden har fyra raka sidor som möts i fyra hörn. Den är fyrkantig. Huset står direkt ovanför bron.'},
      {slot:3,words:['sv-0067'],prompt:'Sätt ett tält med triangelformad öppning direkt till vänster om bron.',hint:'Öppningen ska ha tre raka sidor och tre hörn. Välj tältet och rutan direkt till vänster om bron.',
       options:[piece('ball','Boll','⚽'),piece('tent','Tält med triangelformad öppning','⛺','triangle','solid','orange'),piece('box','Låda','📦','square')],answer:'tent',why:'Tältets öppning har tre raka sidor och tre hörn. Tältet ligger till vänster om bron.'},
      {slot:5,words:['sv-0018'],prompt:'Sätt något lysande direkt till höger om bron.',hint:'Den tända lyktan ger ifrån sig ljus. Välj den och rutan direkt till höger om bron.',
       options:[piece('book','Bok','📚'),piece('plant','Planta','🪴'),piece('lantern','Tänd lykta','🏮')],answer:'lantern',why:'Lyktan lyser och står till höger om bron.'}
    ]
  };
  const paint={
    emoji:'🎨',title:'Målarverkstaden',intro:'Måla fyra former på en gemensam tavla.',kind:'preview',
    end:'Titta på din färdiga mönstertavla!',
    slots:['Övre vänstra delen','Övre högra delen','Nedre vänstra delen','Nedre högra delen'],
    base:['','','',''],
    tasks:[
      {slot:0,words:['sv-0022','sv-0016'],prompt:'Måla en randig cirkel.',hint:'En cirkel är rund. Ränder är långa streck.',
       options:[piece('dots-circle','Cirkel med prickar','','circle','dots','purple'),piece('striped-circle','Cirkel med ränder','','circle','stripes','blue'),piece('plain-circle','Enfärgad cirkel','','circle','solid','orange')],answer:'striped-circle',why:'Cirkeln är rund och har ränder. Den är randig.'},
      {slot:1,words:['sv-0023','sv-0067'],prompt:'Måla en prickig triangel.',hint:'Formen ska ha tre raka sidor och tre hörn. Mönstret ska bestå av små prickar.',
       options:[piece('dots-square','Kvadrat med prickar','','square','dots','green'),piece('stripes-triangle','Triangel med ränder','','triangle','stripes','orange'),piece('dots-triangle','Triangel med prickar','','triangle','dots','purple')],answer:'dots-triangle',why:'Formen har tre raka sidor och tre hörn, så den är en triangel. De små prickarna gör den prickig. Både formen och mönstret stämmer med uppgiften.'},
      {slot:2,words:['sv-0066'],prompt:'Måla en fyrkantig form utan mönster.',hint:'Leta efter en enfärgad form med fyra raka sidor och fyra hörn.',
       options:[piece('solid-square','Enfärgad kvadrat','','square','solid','green'),piece('solid-triangle','Enfärgad triangel','','triangle','solid','blue'),piece('pattern-square','Kvadrat med ränder','','square','stripes','purple')],answer:'solid-square',why:'Kvadraten har fyra raka sidor och fyra hörn. Hela ytan har samma färg, så den är också utan mönster. Den randiga kvadraten har rätt form men ett mönster.'},
      {slot:3,words:['sv-0034','sv-0022'],prompt:'Måla en avlång, randig form.',hint:'Leta efter formen som är mycket längre än den är bred och har ränder.',
       options:[piece('dots-long','Avlång form med prickar','','long','dots','orange'),piece('round-stripes','Cirkel med ränder','','circle','stripes','green'),piece('long-stripes','Avlång form med ränder','','long','stripes','orange')],answer:'long-stripes',why:'Formen är avlång och har långa ränder.'}
    ]
  };
  const robot={
    emoji:'🤖',title:'Robotverkstaden',intro:'Bygg en robot med huvud, kropp, armar och fötter.',kind:'preview',
    end:'Roboten är färdig och redo för fantasiäventyr!',
    slots:['Huvud','Kropp','Armar','Fötter'],base:['','','',''],
    tasks:[
      {slot:0,words:['sv-0016'],prompt:'Roboten behöver ett runt huvud.',hint:'Leta efter huvudet som är format som en cirkel, utan hörn.',
       options:[piece('square-head','Fyrkantigt huvud','','square','solid','green'),piece('round-head','Runt huvud','','circle','solid','blue'),piece('triangle-head','Triangelformat huvud','','triangle','solid','orange')],answer:'round-head',why:'Kanten böjer sig hela vägen runt och har inga hörn. Huvudet i bilden är format som en cirkel och är därför runt.'},
      {slot:1,words:['sv-0066'],prompt:'Sätt dit en fyrkantig kropp.',hint:'Kroppen i bilden ska ha fyra raka sidor som möts i fyra hörn.',
       options:[piece('round-body','Rund kropp','','circle','solid','purple'),piece('triangle-body','Triangelformad kropp','','triangle','solid','orange'),piece('square-body','Fyrkantig kropp','','square','solid','green')],answer:'square-body',why:'Kroppen i bilden har fyra raka sidor och fyra hörn. Den är fyrkantig. Just den här fyrkanten är en kvadrat med lika långa sidor.'},
      {slot:2,words:['sv-0025'],prompt:'Välj elastiska armar som kan sträckas och dra ihop sig.',hint:'De fjädrande armarna kan återgå till sin form.',
       options:[piece('spring-arms','Fjädrande armar','➿'),piece('wood-arms','Stela träarmar','🪵'),piece('metal-arms','Stela metallarmar','🔩')],answer:'spring-arms',why:'Fjädrarna kan sträckas och återgå till sin form. De är elastiska.'},
      {slot:3,words:['sv-0022'],prompt:'Roboten önskar sig randiga fötter.',hint:'Ränder är långa streck, inte små prickar.',
       options:[piece('dot-feet','Prickiga fötter','','long','dots','purple'),piece('plain-feet','Enfärgade fötter','','long','solid','green'),piece('stripe-feet','Randiga fötter','','long','stripes','orange')],answer:'stripe-feet',why:'Fötterna har ränder. Nu kan roboten ge sig ut på äventyr!'}
    ]
  };
  const GAMES={world,paint,robot};
  function start(game){
    if(!Object.hasOwn(GAMES,game))return null;
    return {game,index:0,stage:'play',board:GAMES[game].base.map(()=>null),selected:null,feedback:'',helped:false};
  }
  function meta(s){return s&&Object.hasOwn(GAMES,s.game)?GAMES[s.game]:null;}
  function task(s){return meta(s)?.tasks[s.index]||null;}
  function palette(s){
    const g=meta(s);
    return !g?[]:s.stage==='free'?g.tasks.flatMap(t=>t.options):task(s)?.options||[];
  }
  function choose(s,id){
    if(!meta(s)||!['play','free'].includes(s.stage)||!palette(s).some(p=>p.id===id))return s;
    return {...s,selected:id,feedback:''};
  }
  function complete(s,helped=false){
    const t=task(s);
    if(!t||s.stage!=='play')return s;
    const board=s.board.slice();board[t.slot]=t.answer;
    return {...s,board,stage:'solved',selected:null,feedback:t.why,helped};
  }
  function place(s,slot){
    const g=meta(s),t=task(s);
    if(!g||!Number.isInteger(slot)||slot<0||slot>=g.slots.length||!s.selected)return s;
    if(s.stage==='free'){
      // World pieces can go anywhere; painting/robot pieces belong to their
      // authored panel or part, preserving a readable, coherent creation.
      if(g.kind==='preview'&&!g.tasks.some(row=>row.slot===slot&&row.options.some(p=>p.id===s.selected)))
        return {...s,feedback:'Välj en del som passar på den här platsen.'};
      const board=s.board.slice();board[slot]=s.selected;
      return {...s,board,selected:null,feedback:'Du ändrade ditt bygge!'};
    }
    if(s.stage!=='play'||g.kind!=='place')return s;
    if(slot!==t.slot||s.selected!==t.answer)return {...s,feedback:t.hint};
    return complete(s);
  }
  function confirm(s){
    const g=meta(s),t=task(s);
    if(!g||g.kind!=='preview'||s.stage!=='play'||!s.selected)return s;
    return s.selected===t.answer?complete(s):{...s,feedback:t.hint};
  }
  function help(s){return complete(s,true);}
  function next(s){
    const g=meta(s);
    if(!g||s.stage!=='solved')return s;
    if(s.index===g.tasks.length-1)return {...s,stage:'finished'};
    return {...s,index:s.index+1,stage:'play',selected:null,feedback:'',helped:false};
  }
  function free(s){
    return s?.stage==='finished'?{...s,stage:'free',selected:null,feedback:''}:s;
  }
  function model(s){
    const g=meta(s);
    if(!g)return null;
    const t=task(s),options=palette(s),all=g.tasks.flatMap(row=>row.options);
    const preview=g.kind==='preview'&&s.stage==='play'&&s.selected?t.slot:null;
    const cells=g.slots.map((label,index)=>{
      const id=index===preview?s.selected:s.board[index];
      return {index,label,base:g.base[index],piece:all.find(p=>p.id===id)||null,
        preview:index===preview,target:s.stage==='play'&&g.kind==='preview'&&index===t.slot};
    });
    return {game:s.game,stage:s.stage,title:g.title,emoji:g.emoji,kind:g.kind,index:s.index,total:g.tasks.length,
      prompt:s.stage==='finished'?g.end:s.stage==='free'?'Lek fritt! Välj en del och tryck där du vill placera den.':t.prompt,
      feedback:s.feedback,helped:s.helped,selected:s.selected,options,cells,
      canConfirm:s.stage==='play'&&g.kind==='preview'&&!!s.selected,
      clickable:s.stage==='free'||(s.stage==='play'&&g.kind==='place')};
  }
  return {GAMES,start,choose,place,confirm,help,next,free,model};
});
