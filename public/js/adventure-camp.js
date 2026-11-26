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
    return {scene:Object.hasOwn(SCENES,value.scene)?value.scene:'glade',slots};
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
    const prompts=[
      'Titta på '+item.name.toLocaleLowerCase('sv-SE')+'. Hitta tre ord som beskriver den eller bilden av den.',
      'Tänk att '+item.name.toLocaleLowerCase('sv-SE')+' finns med i en saga. Vad händer först?',
      other!==item?'Hitta på en mening där '+item.name.toLocaleLowerCase('sv-SE')+' och '+other.name.toLocaleLowerCase('sv-SE')+' båda finns med.':
        'Vilken annan sak skulle passa tillsammans med '+item.name.toLocaleLowerCase('sv-SE')+'? Berätta varför.',
      'Beskriv platsen för någon som inte ser den. Var finns '+item.name.toLocaleLowerCase('sv-SE')+'?'
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
  return {SCENES,STARTER,SLOTS,shape,inventory,sanitize,changeScene,place,remove,prompt,dialogue,worlds};
});
