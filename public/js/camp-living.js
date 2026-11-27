/* Local, optional sensory play. No progress, persistence, timers or rewards. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenLiving=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const IDS=Object.freeze(['butterfly','lantern','egg','rocket','music','buddy']);
  const SCENES=Object.freeze({
    glade:{sky:'☀️',edge:'🌲',ground:'🌿'},
    space:{sky:'🌙',edge:'🪐',ground:'✨'},
    coast:{sky:'⛅',edge:'🌊',ground:'🐚'},
    garden:{sky:'🌈',edge:'🌷',ground:'🌼'}
  });
  const REACTIONS=Object.freeze({
    butterfly:['Fjärilen fladdrar förbi. Så lätt och smidig!','Fjärilen landar mjukt. Ser du de färgglada vingarna?'],
    lantern:['Lyktan lyser i mörkret. Nu är det ljust!','Lyktan är släckt. Vi kan tända den igen.'],
    egg:['Titta, en liten dinosaurie tittar fram! Skalet har öppnats.','Dinosaurien gömmer sig i sitt ägg igen.'],
    rocket:['Raketen svävar upp mot stjärnorna!','Raketen gör en ny tur bland molnen!'],
    music:['Pling, plong! Tänk på tre toner som går uppåt.','Nu går tonerna nedåt. Vilken melodi vill du hitta på?'],
    buddy:['Hej! Vad roligt att utforska tillsammans.','Vad vill du prova? Kanske lyser något eller rör sig!']
  });
  const NOTES=Object.freeze([[523.25,659.25,783.99],[783.99,659.25,523.25]].map(Object.freeze));
  function start(){return {last:null,phases:Object.fromEntries(IDS.map(id=>[id,0]))};}
  function react(state,id){
    if(!state||!IDS.includes(id))return state;
    const phase=state.phases[id]===1?0:1;
    return {last:id,phases:{...state.phases,[id]:phase}};
  }
  function model(state,scene,buddy){
    const p=state.phases;
    const objects=[
      {id:'butterfly',emoji:'🦋',label:'Få fjärilen att flyga'},
      {id:'lantern',emoji:p.lantern?'🏮':'🕯️',label:p.lantern?'Släck lyktan':'Tänd lyktan',pressed:!!p.lantern},
      {id:'egg',emoji:p.egg?'🦕':'🥚',label:p.egg?'Stäng ägget':'Öppna ägget',pressed:!!p.egg},
      {id:'rocket',emoji:'🚀',label:'Skjut upp raketen'},
      {id:'music',emoji:p.music?'🎶':'🎵',label:'Spela en melodi'},
      {id:'buddy',emoji:buddy.emoji,label:'Hälsa på '+buddy.name}
    ];
    return {scenery:SCENES[scene]||SCENES.glade,objects,
      message:state.last?REACTIONS[state.last][p[state.last]?0:1]:'Vad händer om du trycker på något?',
      notes:state.last==='music'?NOTES[p.music?0:1]:[]};
  }
  return {IDS,SCENES,start,react,model};
});
