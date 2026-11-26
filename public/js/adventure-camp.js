/* Min äventyrsplats. A small offline creative playground.
 * Free starter pieces and earned story keepsakes; no currency, purchases,
 * deadlines, scores, random rewards or items that can be lost by absence. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenCamp=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCENES=Object.freeze({
    glade:{label:'🌲 Skogsglänta',sky:'☀️',edge:'🌲',ground:'🌿'},
    space:{label:'🌙 Stjärnhimmel',sky:'🌙',edge:'🪐',ground:'✨'},
    coast:{label:'🌊 Strand',sky:'⛅',edge:'🌊',ground:'🐚'},
    garden:{label:'🌸 Sagoträdgård',sky:'🌈',edge:'🌷',ground:'🌼'}
  });
  const STARTER=Object.freeze([
    {id:'free-book',name:'Sagobok',emoji:'📚'},
    {id:'free-tent',name:'Tält',emoji:'⛺'},
    {id:'free-lantern',name:'Lykta',emoji:'🏮'},
    {id:'free-flower',name:'Blomma',emoji:'🌼'},
    {id:'free-blanket',name:'Picknickfilt',emoji:'🧺'},
    {id:'free-telescope',name:'Kikare',emoji:'🔭'}
  ]);
  const SLOTS=Object.freeze(['Uppe till vänster','Uppe i mitten','Uppe till höger','Nere till vänster','Nere i mitten','Nere till höger']);
  const INITIAL=Object.freeze(['free-tent',null,'free-lantern',null,'free-book',null]);
  const RIDDLES=Object.freeze([
  {
    "id": "camp-01",
    "emoji": "📚",
    "title": "Vad hörs i sagoboken?",
    "story": "Ordkompisen vänder på de tunna bladen i sagoboken. De ger ifrån sig ett lätt rasslande ljud. Hur kan papperet beskrivas?",
    "words": [
      "sv-0010",
      "sv-0001",
      "sv-0011"
    ],
    "hint": "Lyssna i tankarna på ljudet från papper som rör sig.",
    "why": "Prasslig beskriver något som ger ett lätt rasslande ljud när det rör sig."
  },
  {
    "id": "camp-02",
    "emoji": "🏮",
    "title": "Lyktan vid tältet",
    "story": "Det är mörkt i gläntan. En tänd lykta ger ifrån sig eget ljus så att vi kan läsa. Vilket ord beskriver den?",
    "words": [
      "sv-0018",
      "sv-0037",
      "sv-0044"
    ],
    "hint": "Ljuset kommer från lyktan, inte från en bild som speglas.",
    "why": "Lysande betyder att något ger ifrån sig ljus. Speglande betyder att en yta återger en bild med hjälp av ljus."
  },
  {
    "id": "camp-03",
    "emoji": "🎨",
    "title": "Mönstret på en flagga",
    "story": "Ordkompisen ritar en form med tre raka sidor som möts i tre hörn. Vilket ord beskriver formen?",
    "words": [
      "sv-0067",
      "sv-0066",
      "sv-0016"
    ],
    "hint": "Räkna hörnen på formen.",
    "why": "En triangelformad sak har tre sidor och tre hörn."
  },
  {
    "id": "camp-04",
    "emoji": "🧺",
    "title": "Vecken i filten",
    "story": "Picknickfilten har legat hoptryckt i en väska. När vi breder ut den finns många veck kvar. Hur kan filten beskrivas?",
    "words": [
      "sv-0036",
      "sv-0043",
      "sv-0041"
    ],
    "hint": "Tänk på veck i tyg, inte knutar i ett snöre eller gropar i hård metall.",
    "why": "Skrynklig beskriver något som har många veck eller rynkor."
  },
  {
    "id": "camp-05",
    "emoji": "🔍",
    "title": "En ömtålig upptäckt",
    "story": "Vid tältet ligger en tunn glasprydnad. Om den tappas i marken går den lätt sönder. Vilket ord passar?",
    "words": [
      "sv-0012",
      "sv-0001",
      "sv-0025"
    ],
    "hint": "Vad kan hända om föremålet faller? Tänk inte på hur ytan känns.",
    "why": "Skör betyder att något lätt kan gå sönder."
  },
  {
    "id": "camp-06",
    "emoji": "🐦",
    "title": "Fågeln vid gläntan",
    "story": "En fågel landar plötsligt bredvid ordkompisen. Det var helt oväntat! Ordkompisen spärrar upp ögonen av överraskning. Vilket ord passar bäst?",
    "words": [
      "sv-0060",
      "sv-0070",
      "sv-0062"
    ],
    "hint": "Tänk på vad man känner när något händer som man inte hade väntat sig.",
    "why": "Förvånad beskriver någon som reagerar på något oväntat."
  }
]);
  const VALID_ID=/^(?:free-(?:book|tent|lantern|flower|blanket|telescope)|mark-(?:forest|space|castle|pirate|ocean|dinosaurs|garden|unicorn|animals|rainbow|horses|music)-[0-3])$/;
  function inventory(storyProgress,story,adventures){
    const items=STARTER.map(item=>({...item,source:'Från början',world:null}));
    for(const id of adventures.WORLD_IDS){
      const model=story.model(storyProgress,id);
      for(const chapter of model.chapters.filter(c=>c.visited)){
        items.push({id:'mark-'+id+'-'+chapter.index,name:chapter.keepsake,emoji:chapter.emoji,
          source:adventures.world(id).title,world:id});
      }
    }
    return items;
  }
  // Structural validation can be shared by the general history loader;
  // ownership is checked again against the actual current inventory.
  function shape(raw){
    const value=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
    const used=new Set();
    const source=Array.isArray(value.slots)?value.slots:INITIAL;
    const slots=SLOTS.map((_,i)=>{
      const id=source[i];
      if(typeof id!=='string'||!VALID_ID.test(id)||used.has(id))return null;
      used.add(id);return id;
    });
    return {scene:typeof value.scene==='string'&&Object.hasOwn(SCENES,value.scene)?value.scene:'glade',slots};
  }
  function sanitize(raw,items){
    const value=shape(raw),owned=new Set(items.map(item=>item.id));
    return {...value,slots:value.slots.map(id=>owned.has(id)?id:null)};
  }
  function changeScene(raw,scene,items){
    if(typeof scene!=='string'||!Object.hasOwn(SCENES,scene))return raw;
    const state=sanitize(raw,items);
    return state.scene===scene?raw:{...state,scene};
  }
  function place(raw,id,index,items){
    if(!Number.isInteger(index)||index<0||index>=SLOTS.length||!items.some(item=>item.id===id))return raw;
    const state=sanitize(raw,items),slots=state.slots.slice(),previous=slots.indexOf(id);
    if(previous===index)return raw;
    // Move an existing object, swapping with the destination if occupied.
    // An object from the inventory puts the old decoration back in storage.
    if(previous>=0)slots[previous]=slots[index];
    slots[index]=id;
    return {...state,slots};
  }
  function remove(raw,index,items){
    if(!Number.isInteger(index)||index<0||index>=SLOTS.length)return raw;
    const state=sanitize(raw,items);
    if(!state.slots[index])return raw;
    const slots=state.slots.slice();slots[index]=null;return {...state,slots};
  }
  function prompt(state,items,index=0){
    const placed=sanitize(state,items).slots.map(id=>items.find(item=>item.id===id)).filter(Boolean);
    const n=Number.isInteger(index)&&index>=0?index:0;
    if(!placed.length)return [
      'Hur skulle du beskriva den här platsen med tre ord?',
      'Tänk att en vän kommer hit. Vad skulle ni kunna göra tillsammans?'
    ][n%2];
    const item=placed[n%placed.length],other=placed[(n+1)%placed.length];
    const name='”'+item.name+'”',otherName='”'+other.name+'”';
    const prompts=[
      'Titta på föremålet '+name+'. Hitta tre ord som beskriver det.',
      'Tänk att '+name+' finns med i en saga. Vad händer först?',
      other!==item?'Hitta på en mening där föremålen '+name+' och '+otherName+' båda finns med.':
        'Vilken annan sak skulle passa tillsammans med '+name+'? Berätta varför.',
      'Beskriv platsen för någon som inte ser den. Var finns '+name+'?'
    ];
    return prompts[n%prompts.length];
  }
  const CHAT=Object.freeze({
    fox:['Vilket mysigt ställe! Jag undrar vad vi skulle kunna hitta på här.','En plats kan se ut på många sätt. Vad vill du ändra?','Jag gillar sagor där en liten sak får ett stort äventyr.'],
    owl:['Hoj! Jag tittar efter former, färger och små detaljer. Vad ser du?','Ett ord kan hjälpa en annan att föreställa sig en plats.','Vi kan hitta på en berättelse här tillsammans.'],
    dragon:['Här skulle en liten drake kunna ha picknick!','Tänk om sakerna här kunde vara med i en saga.','Vilken färg skulle en drakes favoritplats ha?']
  });
  function dialogue(companion,index=0){
    const lines=Object.hasOwn(CHAT,companion)?CHAT[companion]:CHAT.fox;
    return lines[(Number.isInteger(index)&&index>=0?index:0)%lines.length];
  }
  function worlds(storyProgress,current,story,adventures){
    return adventures.WORLD_IDS.map(id=>{
      const w=adventures.world(id),m=story.model(storyProgress,id);
      return {id,emoji:w.emoji,title:w.title,group:w.group,count:m.count,total:m.total,
        complete:m.complete,chapter:m.chapter.title,current:id===current};
    });
  }
  function riddles(words,data=RIDDLES){
    const byId=new Map(words.map(word=>[word.id,word]));
    const seen=new Set(),tasks=[];
    for(const row of data){
      if(!row||!/^camp-\d{2}$/.test(row.id)||seen.has(row.id)||
        !['emoji','title','story','hint','why'].every(key=>typeof row[key]==='string'&&row[key].trim())||
        !Array.isArray(row.words)||row.words.length!==3||new Set(row.words).size!==3||
        !row.words.every(id=>byId.get(id)?.kind==='word'&&byId.get(id)?.name))continue;
      const options=row.words.map((id,index)=>({id,label:byId.get(id).name,correct:index===0}));
      if(new Set(options.map(option=>option.label)).size!==3)continue;
      seen.add(row.id);
      tasks.push({...row,options});
    }
    return tasks;
  }
  function shuffleOptions(task,random=Math.random){
    const options=task.options.slice();
    for(let i=options.length-1;i>0;i--){
      const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));
      [options[i],options[j]]=[options[j],options[i]];
    }
    return options;
  }
  function answer(task,id,attempts){
    if(!Number.isInteger(attempts)||attempts<0||attempts>1)return null;
    const option=task?.options.find(row=>row.id===id);
    if(!option)return null;
    return option.correct?'solved':attempts===0?'hint':'explain';
  }
  return {SCENES,STARTER,SLOTS,RIDDLES,shape,inventory,sanitize,changeScene,place,remove,prompt,dialogue,worlds,riddles,shuffleOptions,answer};
});
