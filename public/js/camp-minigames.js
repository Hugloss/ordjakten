/* Three short, optional games. Authored tasks, no grades, timers, rewards,
 * automatic continuation, network access or learning-history writes. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenMiniGames=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const tile=(id,emoji,label)=>({id,emoji,label});
  const GAMES={
    dragon:{emoji:'🐉',title:'Mata draken',intro:'Hjälp Dino att välja något gott till sin picknick.',end:'Nu är picknicken dukad!'},
    lab:{emoji:'🪄',title:'Magiska labbet',intro:'Kombinera två saker i en låtsasmaskin och se vad den skapar.',end:'Vilken fin samling magiska skapelser!'},
    treasure:{emoji:'🗺️',title:'Skattjakten',intro:'Läs kartans ledtrådar och leta på rätt plats.',end:'Kartans fyra gömställen är utforskade!'}
  };
  // Correct choices are authored for the displayed objects, not inferred from emoji.
  const DRAGON=[
    {words:['sv-0006'],prompt:'Dino vill ha något knaprigt till picknicken.',hint:'Tänk på ett torrt, hårt bröd som knastrar när du biter.',
      options:[tile('soup','🥣','Slät soppa utan bitar'),tile('crispbread','🍞','Knäckebröd'),tile('yogurt','🥛','Yoghurt utan bitar')],answers:['crispbread'],result:'😋',why:'Knäckebröd är knaprigt. Det knastrar när man biter i det.'},
    // Text choices: fresh-fruit emojis cannot show dried fruit accurately.
    {words:['sv-0033'],prompt:'Nu vill Dino ha en riktigt saftig frukt.',hint:'Alla valen är frukt. Vilken har mycket vätska kvar?',options:[tile('raisins','','Torra russin'),tile('apple-rings','','Torra, torkade äppelringar'),tile('melon','','Färsk vattenmelon')],answers:['melon'],result:'🍉',why:'Färsk vattenmelon innehåller mycket vätska och är saftig. Russinen och äppelringarna har torkats så att mycket av vattnet har försvunnit.'},
    {words:['sv-0002'],prompt:'Dino letar efter något fluffigt till efterrätt.',hint:'Tänk på en mjuk kaka med mycket luft i.',options:[tile('cake','🍰','Luftig sockerkaka'),tile('carrot','🥕','Rå morot'),tile('pretzel','🥨','Hård kringla')],answers:['cake'],result:'🍰',why:'En luftig sockerkaka kan vara fluffig – mjuk och full av små luftfickor.'},
    {words:['sv-0034'],prompt:'Vilken av frukterna är avlång?',hint:'Den är mycket längre än den är bred.',options:[tile('orange','🍊','Apelsin'),tile('banana','🍌','Banan'),tile('apple','🍎','Runt äpple')],answers:['banana'],result:'🍌',why:'En banan är avlång. Den är längre än den är bred.'}
  ];
  const LAB=[
    {words:['sv-0007','sv-0015'],prompt:'Maskinen behöver något glittrigt och något mjukt.',hint:'En glittrande sten och en fjäder passar. Välj två saker.',
      options:[tile('stone','🪨','Matt, hård sten'),tile('gem','💎','Glittersten'),tile('wood','🪵','Stel träkloss'),tile('feather','🪶','Mjuk fjäder')],answers:['gem','feather'],result:'🌟☁️',why:'Glitterstenen glimmar och fjädern är mjuk. Tillsammans blev de ett magiskt stjärnmoln!'},
    {words:['sv-0003','sv-0025'],prompt:'Välj något genomskinligt och något elastiskt.',hint:'Du kan se genom en klar glasruta. En gummisnodd kan sträckas och dra ihop sig.',
      options:[tile('glass','🪟','Klar glasruta'),tile('brick','🧱','Tegelsten'),tile('rubber','➰','Gummisnodd'),tile('wood','🪵','Träkloss')],answers:['glass','rubber'],result:'🫧🌈',why:'Du kan se genom glasrutan. Gummisnodden kan sträckas och dra ihop sig igen. Glaset är genomskinligt och gummisnodden elastisk. I leken blir de en regnbågsbubbla!'},
    {words:['sv-0016','sv-0067'],prompt:'Hitta en rund och en triangelformad figur.',hint:'Cirkeln är rund. Triangeln har tre raka sidor och tre hörn.',
      options:[tile('square','🟦','Kvadrat'),tile('triangle','🔺','Triangel'),tile('star','⭐','Stjärna'),tile('circle','🔴','Cirkel')],answers:['triangle','circle'],result:'🎏✨',why:'Cirkeln har en böjd kant utan hörn och är rund. Triangeln har tre raka sidor som möts i tre hörn. I leken blir de en färgglad fantasidrake!'},
    {words:['sv-0010','sv-0018'],prompt:'Välj något prassligt och något lysande.',hint:'Papper kan rassla när det rör sig. En tänd lykta ger ifrån sig ljus.',
      options:[tile('lantern','🏮','Tänd lykta'),tile('rock','🪨','Sten'),tile('paper','📄','Tunt papper'),tile('brick','🧱','Tegelsten')],answers:['lantern','paper'],result:'📜✨',why:'Papperet prasslar och lyktan lyser. En magisk sagorulle dök upp!'}
  ];
  const TREE=tile('tree','🌳','Träd'),TENT=tile('tent','⛺','Tält'),MOON=tile('moon','🌙','Måne'),LAMP=tile('lamp','🏮','Lykta');
  const TREASURE=[
    {words:['sv-0016'],prompt:'Skatten finns vid den runda saken direkt ovanför tältet.',hint:'Hitta tältet. Gå en ruta uppåt. Leta efter något utan hörn.',
      options:[TREE,tile('ball','⚽','Boll'),tile('book','📕','Bok'),tile('flower','🌼','Blomma'),TENT,tile('rock','🪨','Sten'),tile('shell','🐚','Snäcka'),tile('orange','🍊','Apelsin'),LAMP],answers:['ball'],result:'🧭',why:'Bollen är rund och ligger i rutan direkt ovanför tältet. Du hittade en låtsaskompass!'},
    {words:['sv-0066'],prompt:'Skatten finns vid saken med fyrkantig framsida direkt till höger om trädet.',hint:'Hitta trädet. Gå en ruta åt höger. Framsidan ska ha fyra raka sidor och fyra hörn.',
      options:[tile('tent','⛺','Tält'),tile('shell','🐚','Snäcka'),tile('apple','🍎','Äpple'),tile('ball','⚽','Boll'),TREE,tile('gift','🟦','Paket med fyrkantig framsida'),tile('book','📕','Bok'),LAMP,tile('flower','🌷','Blomma')],answers:['gift'],result:'💌',why:'Paketets framsida har fyra raka sidor och fyra hörn. Paketet ligger också direkt till höger om trädet. Både formen och platsen stämmer med ledtråden.'},
    {words:['sv-0007'],prompt:'Skatten finns vid den glittriga saken direkt nedanför månen.',hint:'Hitta månen. Gå en ruta nedåt. Leta efter något som glimmar.',
      options:[tile('planet','🪐','Planet'),tile('star','⭐','Stjärna'),tile('cloud','☁️','Moln'),tile('rocket','🚀','Raket'),MOON,tile('crater','🌑','Mörk måne'),tile('flag','🚩','Flagga'),tile('gem','💎','Glittrande ädelsten'),tile('rock','🪨','Sten')],answers:['gem'],result:'🔭',why:'Ädelstenen glittrar och ligger precis nedanför månen. Där fanns en liten kikare!'},
    {words:['sv-0023'],prompt:'Skatten finns vid den prickiga saken direkt till vänster om lyktan.',hint:'Hitta lyktan. Gå en ruta åt vänster. Leta efter en sak med prickar.',
      options:[tile('leaf','🍃','Löv'),tile('tent','⛺','Tält'),tile('mushroom','🍄','Prickig svamp'),tile('ladybug','🐞','Nyckelpiga'),LAMP,tile('flower','🌻','Solros'),TREE,tile('apple','🍎','Äpple'),tile('rock','🪨','Sten')],answers:['ladybug'],result:'🎁',why:'Nyckelpigan har prickar och ligger direkt till vänster om lyktan. Du hittade den sista skatten i leken!'}
  ];
  const LEVELS={dragon:DRAGON,lab:LAB,treasure:TREASURE};
  function start(game){
    if(!Object.hasOwn(GAMES,game))return null;
    return {game,index:0,stage:'play',selected:[],feedback:'',helped:false};
  }
  function task(state){return state&&LEVELS[state.game]?.[state.index]||null;}
  function solved(state,helped=false){
    const level=task(state);
    if(!level||state.stage!=='play')return state;
    return {...state,stage:'solved',selected:level.answers.slice(),feedback:level.why,helped};
  }
  function choose(state,id){
    const level=task(state);
    if(!level||state.stage!=='play'||!level.options.some(item=>item.id===id))return state;
    if(state.game==='lab'){
      const selected=state.selected.includes(id)?state.selected.filter(x=>x!==id):
        state.selected.length<2?[...state.selected,id]:state.selected;
      return {...state,selected,feedback:selected===state.selected?'Ta bort en sak först om du vill byta.':''};
    }
    return level.answers.includes(id)?solved(state):
      {...state,feedback:level.hint};
  }
  function mix(state){
    if(state?.game!=='lab'||state.stage!=='play'||state.selected.length!==2)return state;
    const level=task(state);
    return level.answers.every(id=>state.selected.includes(id))?solved(state):
      {...state,feedback:level.hint};
  }
  function help(state){return solved(state,true);}
  function next(state){
    if(state?.stage!=='solved')return state;
    if(state.index+1===LEVELS[state.game].length)return {...state,stage:'finished'};
    return {...state,index:state.index+1,stage:'play',selected:[],feedback:'',helped:false};
  }
  function model(state){
    if(!state)return null;
    const level=task(state),meta=GAMES[state.game],total=LEVELS[state.game].length;
    return {game:state.game,stage:state.stage,meta,index:state.index,total,prompt:level.prompt,options:level.options,
      selected:state.selected,feedback:state.feedback,result:level.result,helped:state.helped,
      canMix:state.game==='lab'&&state.stage==='play'&&state.selected.length===2,
      selection:state.selected.map(id=>level.options.find(o=>o.id===id)).filter(Boolean)};
  }
  return {GAMES,LEVELS,start,choose,mix,help,next,model};
});
