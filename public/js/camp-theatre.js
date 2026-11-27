/* Sagoteatern: an optional, finite story-making activity. No scores,
 * automatic history writes, currency, random rewards or automatic continuation. */
(function(root,factory){
  const api=factory(root.OrdjaktenCamp||(typeof require==='function'?require('./adventure-camp'):null),
    root.OrdjaktenPlayful||(typeof require==='function'?require('./playful'):null));
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenTheatre=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(Camp,Playful){
  'use strict';
  const PLACES=Object.freeze({
    glade:'i skogsgläntan',space:'under stjärnhimlen',coast:'på stranden',garden:'i sagoträdgården'
  });
  const PLOTS=Object.freeze([
    {id:'mystery',emoji:'🔎',label:'Ett litet mysterium',title:'En hemlig hälsning',
      middle:name=>name+' hittar en märklig lapp. Tänk om föremålet kan vara en ledtråd?',
      end:name=>name+' lägger föremålet bredvid lappen. Då upptäcker '+name+' en tecknad hälsning från en vän. Vilken fin överraskning!',endEmoji:'💌'},
    {id:'friend',emoji:'🐦',label:'Hjälp en ny vän',title:'En vänlig signal',
      middle:name=>'En liten fågel letar efter sin vän. '+name+' använder föremålet i en hälsning som syns på långt håll.',
      end:name=>'Fågelns vän ser hälsningen och kommer fram. '+name+' vinkar till dem båda. Nu kan de leka tillsammans!',endEmoji:'🤝'},
    {id:'show',emoji:'🎪',label:'En tokig föreställning',title:'Den knasiga föreställningen',
      middle:name=>name+' bjuder in en vän och låtsas att föremålet är en magisk rekvisita. Föreställningen börjar!',
      end:name=>'Vännen hittar på en tokig roll. '+name+' spelar med och båda börjar skratta. Vilken rolig saga!',endEmoji:'🎉'}
  ]);
  const STAGES=['hero','prop','plot','ending'];
  const HEADINGS={hero:'Vem ska vara huvudperson?',prop:'Vilken sak ska vara med?',plot:'Vad ska hända i sagan?',ending:'Titta! Du har skapat en saga!'};
  function start(layout,items,preferred){
    const camp=Camp.sanitize(layout,items);
    const byId=new Map(items.map(item=>[item.id,item]));
    const propIds=camp.slots.filter(Boolean);
    // Empty and sparsely decorated camps are playable immediately.
    for(const item of Camp.STARTER){
      if(propIds.length>=3)break;
      if(byId.has(item.id)&&!propIds.includes(item.id))propIds.push(item.id);
    }
    const heroes=Object.entries(Playful.COMPANIONS).map(([id,buddy])=>({id,label:buddy.name,emoji:buddy.emoji}));
    const selected=heroes.findIndex(hero=>hero.id===preferred);
    if(selected>0)heroes.unshift(...heroes.splice(selected,1));
    const props=propIds.map(id=>{const item=byId.get(id);return {id,label:item.name,emoji:item.emoji};});
    return {stage:'hero',scene:camp.scene,heroes,props,hero:null,prop:null,plot:null};
  }
  function choices(state){
    if(!state)return [];
    if(state.stage==='hero')return state.heroes;
    if(state.stage==='prop')return state.props;
    if(state.stage==='plot')return PLOTS.map(({id,label,emoji})=>({id,label,emoji}));
    return [];
  }
  function choose(state,id){
    const choice=choices(state).find(item=>item.id===id);
    if(!choice)return state;
    const index=STAGES.indexOf(state.stage);
    return {...state,[state.stage]:choice.id,stage:STAGES[index+1]};
  }
  function back(state){
    const index=STAGES.indexOf(state?.stage);
    if(index<=0)return state;
    const stage=STAGES[index-1];
    const next={...state,stage};
    for(const key of STAGES.slice(index-1,3))next[key]=null;
    return next;
  }
  function model(state){
    if(!state)return null;
    const hero=state.heroes.find(item=>item.id===state.hero);
    const prop=state.props.find(item=>item.id===state.prop);
    const plot=PLOTS.find(item=>item.id===state.plot);
    const scene=Camp.SCENES[state.scene];
    const panels=state.stage==='ending'&&hero&&prop&&plot?[
      {emoji:scene.sky+' '+hero.emoji+' '+prop.emoji,title:'Det börjar så här',
        text:hero.label+' är '+PLACES[state.scene]+'. Där finns något spännande: '+prop.label+'.'},
      {emoji:hero.emoji+' '+prop.emoji+' '+plot.emoji,title:'Sedan händer något',
        text:plot.middle(hero.label)},
      {emoji:plot.endEmoji+' '+hero.emoji,title:'Så slutar sagan',text:plot.end(hero.label)}
    ]:[];
    return {heading:HEADINGS[state.stage],step:Math.min(STAGES.indexOf(state.stage)+1,3),
      selected:[hero,prop,plot].filter(Boolean).map(item=>item.emoji+' '+item.label),
      choices:choices(state),title:panels.length?plot.title:'',panels,canBack:state.stage!=='hero'};
  }
  function record(state){
    return state?.stage==='ending'&&model(state).panels.length===3?
      {scene:state.scene,hero:state.hero,prop:state.prop,plot:state.plot}:null;
  }
  function restore(row,items){
    if(!row||!Object.hasOwn(Camp.SCENES,row.scene)||!items.some(item=>item.id===row.prop))return null;
    let state=start({scene:row.scene,slots:[row.prop]},items,row.hero);
    state=choose(choose(choose(state,row.hero),row.prop),row.plot);
    return record(state)?state:null;
  }
  return {start,choices,choose,back,model,record,restore};
});
