/* Question presentation only. Never sees correct answers or changes scoring.
 * The egg contains a reading strategy, not a word-specific answer hint. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenQuestionPlay=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const WORLDS={
    forest:{scene:'forest',name:'Skogsporten',target:'🌿'},
    space:{scene:'space',name:'Stjärnporten',target:'⭐'},
    castle:{scene:'castle',name:'Slottsporten',target:'🏰'},
    pirate:{scene:'ocean',name:'Skattporten',target:'⚓'},
    ocean:{scene:'ocean',name:'Havsporten',target:'🐚'},
    dinosaurs:{scene:'forest',name:'Fossilporten',target:'🦕'},
    garden:{scene:'forest',name:'Trädgårdsporten',target:'🌷'},
    unicorn:{scene:'castle',name:'Sagoporten',target:'🦄'},
    animals:{scene:'forest',name:'Djurporten',target:'🐾'},
    rainbow:{scene:'castle',name:'Regnbågsporten',target:'🌈'},
    horses:{scene:'forest',name:'Äventyrsgrinden',target:'🐴'},
    music:{scene:'space',name:'Melodiporten',target:'🎵'}
  };
  const HINTS={
    school:'Läs uppgiftsordet först. Tänk på vad läraren ber dig att göra och om varje svar verkligen gör just det.',
    action:'Tänk på ordets betydelse. Föreställ dig vad som händer med varje föremål eller handling i situationen.',
    context:'Läs berättelsen igen. Vad händer? Leta efter något i texten som visar hur saken, personen eller situationen är.',
    reverse:'Läs betydelsen långsamt. Tänk på vilket ord som skulle passa in i en egen mening.',
    picture:'Titta på en bild i taget. Vilken detalj i bilden passar bäst med ordet?',
    sentence:'Läs meningarna en i taget. Tänk på vilken mening där uttrycket faktiskt passar.',
    expression:'Tänk på hela uttrycket och berättelsen, inte bara ett ord i taget.',
    meaning:'Tänk på en egen situation där du har hört ordet. Jämför sedan alternativen.'
  };
  // Narrative content depends only on the selected world and completed
  // questions, never on the answer, score, question identity or correctness.
  const MYSTERIES={
  "forest": [
    "Mysteriet med gläntans försvunna ljus",
    "Skogens lyktor har slocknat. En liten fågel hittar ett spår bland ormbunkarna.",
    "Ett kartblad sticker fram ur mossan.",
    "En liten silvernyckel ligger vid en ihålig stam.",
    "I gången bakom trädet står en släckt lykta.",
    "En kista står mitt i gläntan. Vad gömmer sig där?",
    "I kistan finns stjärnfrön. Gläntan fylls av varmt, magiskt ljus."
  ],
  "space": [
    "Mysteriet med den tysta stjärnbasen",
    "En signal från en okänd planet har tystnat. Vi undersöker den.",
    "En stjärnkarta blinkar i robotens hand.",
    "En liten nyckel passar i den gamla rymdstationens lås.",
    "Vid kontrollrummet står en märklig energilampa.",
    "En kapsel väntar vid stationens fönster. Vad finns inuti?",
    "Kapseln innehåller en stjärnsändare. Nu kan hela basen säga hej till de andra planeterna!"
  ],
  "castle": [
    "Mysteriet med drakens hemliga rum",
    "Dino har hört en märklig melodi bakom slottets vägg.",
    "En karta över slottets hemliga gångar ligger på ett bord.",
    "Ett gyllene lås sitter på en liten dörr.",
    "En gammal lykta står vid en slingrande trappa.",
    "I tornrummet finns en utsmyckad kista.",
    "Kistan innehåller en speldosa. Dino och alla vänner dansar till den hemliga melodin."
  ],
  "pirate": [
    "Mysteriet med den försvunna skattkartan",
    "En flaskpost berättar om en ö som inte finns på vanliga kartor.",
    "På stranden ligger en bit av en sjökarta.",
    "I en klippskreva glimmar en liten nyckel.",
    "En lykta står vid öppningen till en grotta.",
    "En skattkista väntar bakom en sten.",
    "Kistan innehåller en karta över nya öar och en teckning från en vän."
  ],
  "ocean": [
    "Mysteriet med pärlans sång",
    "En liten sköldpadda letar efter en borttappad, sjungande pärla.",
    "En snäcka har en karta ritad på sitt skal.",
    "En nyckel ligger i en gammal korallport.",
    "En undervattenslykta lyser svagt vid revet.",
    "Vid havets botten finns en vattentät kista.",
    "Pärlan finns i kistan! Sköldpaddan lyssnar på havets stilla sång."
  ],
  "dinosaurs": [
    "Mysteriet med det märkliga dinosaurieägget",
    "En liten dinosaurie har hittat spår som leder in i en dal.",
    "En karta över fotspåren är ritad på ett blad.",
    "Vid en stenport ligger en märklig nyckel.",
    "En liten lykta visar vägen genom en skuggig grotta.",
    "En gammal låda skyddar ett ovanligt ägg.",
    "Ur ägget tittar en liten fantasidinosaurie fram och blinkar åt oss."
  ],
  "garden": [
    "Mysteriet med den sovande blomman",
    "I trädgården finns en blomma som väntar på vårens första ljus.",
    "En karta över trädgårdens gångar ligger under ett löv.",
    "En nyckel till växthuset glittrar vid en kruka.",
    "I växthuset står en magisk växtlykta.",
    "I en frökista ligger något ovanligt.",
    "Ett magiskt frö får blomman att veckla ut sina färgglada blad."
  ],
  "unicorn": [
    "Mysteriet med enhörningens silverstjärna",
    "En enhörning har tappat en silverstjärna på sin sagostig.",
    "En liten karta syns mellan molnen.",
    "En nyckel ligger vid regnbågens fot.",
    "En lykta visar vägen till en hemlig sagogrotta.",
    "En pärlemorskimrande kista står i grottan.",
    "Silverstjärnan ligger tryggt i kistan. Enhörningen sätter den på himlen igen."
  ],
  "animals": [
    "Mysteriet med skogens hemliga hälsning",
    "Djuren har fått en lapp från en okänd vän.",
    "En karta ligger vid fågelholken.",
    "En nyckel hänger på en gren bredvid grinden.",
    "En lykta står utanför djurens lilla samlingsstuga.",
    "På stugans bord väntar en kista.",
    "I kistan ligger en bilderbok med en hälsning från djurens nya vän."
  ],
  "rainbow": [
    "Mysteriet med de gömda regnbågsfärgerna",
    "En regnbåge syns bara svagt på himlen. Vi letar efter färgerna.",
    "En karta pekar mot en bro av moln.",
    "En nyckel glittrar vid brons grind.",
    "En lykta står i ett rum fullt av prismor.",
    "En kista med färgade lock väntar längst in.",
    "I kistan finns fantasins färger. Regnbågen lyser i alla sina nyanser igen."
  ],
  "horses": [
    "Mysteriet med den lilla hästskon",
    "En ponny letar efter en borttappad lyckohästsko.",
    "En karta över ridstigarna finns vid stallet.",
    "En nyckel ligger vid en gammal grind.",
    "En lykta visar vägen längs den dunkla stigen.",
    "I ett litet stallskåp finns en kista.",
    "Lyckohästskon ligger i kistan. Ponnyn får tillbaka sin fina prydnad."
  ],
  "music": [
    "Mysteriet med den gömda melodin",
    "Några mystiska toner hörs från en tom scen.",
    "En karta med noter ligger vid scenkanten.",
    "En nyckel passar i dörren till musikrummet.",
    "En lykta står bredvid ett täckt instrument.",
    "I instrumentets låda finns en liten kista.",
    "Kistan innehåller noterna till en ny melodi som alla kan sjunga tillsammans."
  ]
};
  const PHASES=[
  {
    "id": "map",
    "emoji": "🗺️",
    "title": "Den hemliga kartan",
    "action": "Lägg ditt svar på kartan",
    "partial": "Ett tecken till blir synligt på kartan.",
    "reveal": "Kartans väg blir tydlig! Vi har hittat ett nytt spår."
  },
  {
    "id": "lock",
    "emoji": "🗝️",
    "title": "Det mystiska låset",
    "action": "För ditt svar till låset",
    "partial": "En liten markering på låset börjar lysa.",
    "reveal": "Låset öppnas. Bakom det finns en ny väg."
  },
  {
    "id": "lantern",
    "emoji": "🏮",
    "title": "Den magiska lyktan",
    "action": "För ditt svar till lyktan",
    "partial": "Ett litet ljus tänds i lyktans glas.",
    "reveal": "Lyktan lyser! Nu ser vi vad som väntar framför oss."
  },
  {
    "id": "chest",
    "emoji": "🎁",
    "title": "Den hemliga kistan",
    "action": "Lägg ditt svar vid kistan",
    "partial": "Ett tecken på kistan får ett mjukt sken.",
    "reveal": "Kistan öppnas! Mysteriet har fått sitt slut."
  }
];
  const HATCHLINGS=Object.freeze({
    forest:{id:'fox',name:'Lövkompisen'},space:{id:'star',name:'Stjärnkompisen'},
    ocean:{id:'turtle',name:'Bubbelkompisen'},castle:{id:'dragon',name:'Sagokompis-draken'}
  });
  const TREASURES=Object.freeze({
    forest:'sprout',space:'star',castle:'melody',pirate:'map',ocean:'pearl',dinosaurs:'egg',
    garden:'flower',unicorn:'star',animals:'book',rainbow:'rainbow',horses:'shoe',music:'melody'
  });
  function worldId(settings){return Object.hasOwn(WORLDS,settings?.adventure)?settings.adventure:'forest';}
  // Both question and discovery artwork use the same within-chapter progress.
  // No question content, correctness, streak or score is consulted.
  function visual(settings,chapters,index,done){
    const id=worldId(settings),chapter=chapters[index],start=index===0?0:chapters[index-1].threshold;
    const total=chapter.threshold-start,steps=Math.max(0,Math.min(total,done-start));
    const fraction=steps/total;
    return {scene:WORLDS[id].scene,artifact:chapter.id,treasure:TREASURES[id],steps,total,fraction,complete:steps===total};
  }
  const PICTURE_NAMES=Object.freeze({
    forest:'Den förtrollade skogsgläntan',space:'Den hemliga stjärnvägen',
    ocean:'Den gömda undervattensvärlden',castle:'Det magiska sagolandskapet'
  });
  // Every submitted question uncovers exactly one rectangular piece. Use
  // balanced rows of possibly different lengths to tile the entire picture.
  // The reveal order is fixed, not a lottery and not a correctness signal.
  function picture(settings,answered,total){
    if(!Number.isInteger(total)||total<1||total>100)return null;
    const done=Number.isInteger(answered)?Math.max(0,Math.min(total,answered)):0;
    const scene=WORLDS[worldId(settings)].scene;
    const rows=Math.max(1,Math.round(Math.sqrt(total*210/300)));
    const cells=[];
    for(let row=0;row<rows;row++){
      const count=Math.floor(total/rows)+(row<total%rows?1:0);
      for(let col=0;col<count;col++){
        cells.push({id:cells.length,x:300*col/count,y:210*row/rows,
          width:300/count,height:210/rows});
      }
    }
    // Reveal the centre first, then work outward, with a stable tie-break.
    const ordered=cells.slice().sort((a,b)=>{
      const dist=p=>Math.hypot((p.x+p.width/2-150)/300,(p.y+p.height/2-105)/210);
      return dist(a)-dist(b)||a.id-b.id;
    });
    const visible=new Set(ordered.slice(0,done).map(cell=>cell.id));
    return {scene,title:PICTURE_NAMES[scene],done,total,finished:done===total,
      cells:cells.map(cell=>({...cell,revealed:visible.has(cell.id)}))};
  }
  const CARD_STYLES=Object.freeze(['leaf','butterfly','crystal','scroll']);
  function mystery(settings,answered,total){
    if(!settings||!['train','test'].includes(settings.mode)||settings.timerMode!=='off'||settings.difficulty==='exam'||
      !Number.isInteger(total)||total<1||total>100)return null;
    const story=Object.hasOwn(MYSTERIES,settings.adventure)?MYSTERIES[settings.adventure]:MYSTERIES.forest;
    const done=Number.isInteger(answered)?Math.max(0,Math.min(total,answered)):0;
    // Short repetition rounds still finish with a coherent ending. They
    // discover only as many objects as there are questions.
    const order=total===1?[3]:total===2?[0,3]:total===3?[0,2,3]:[0,1,2,3];
    const chapters=order.map((id,i)=>({...PHASES[id],sceneText:story[id+2],
      threshold:Math.ceil((i+1)*total/order.length)}));
    const completed=chapters.filter(ch=>done>=ch.threshold).length;
    const finished=done===total,index=Math.min(completed,chapters.length-1),chapter=chapters[index];
    return {title:story[0],intro:story[1],ending:story[6],done,total,chapters,completed,finished,chapter,
      visual:visual(settings,chapters,index,done),picture:picture(settings,done,total),step:index+1};
  }
  function discovery(settings,answered,total){
    const current=mystery(settings,answered,total);
    if(!current||current.done===0)return null;
    const prior=mystery(settings,current.done-1,total);
    const reached=current.completed>prior.completed;
    return {artifact:prior.chapter.id,emoji:prior.chapter.emoji,
      title:reached?prior.chapter.title+' – upptäckt!':'Ett nytt spår',
      text:current.finished?current.ending:reached?prior.chapter.reveal:prior.chapter.partial,
      reached,finished:current.finished,visual:visual(settings,prior.chapters,prior.step-1,current.done),picture:current.picture};
  }
  function plan(settings,q,index=0){
    const world=Object.hasOwn(WORLDS,settings?.adventure)?WORLDS[settings.adventure]:WORLDS.forest;
    const enabled=!!q&&settings?.difficulty!=='exam'&&q.taskType!=='order'&&
      ['train','test'].includes(settings?.mode)&&Array.isArray(q.options)&&q.options.length>=2;
    const kind=q?.schoolInstruction?'school':q?.action?'action':q?.taskType==='context'?'context':q?.taskType==='reverse'?'reverse':
      q?.taskType==='sentence'?'sentence':q?.kind==='expression'?'expression':q?.picture?'picture':'meaning';
    // Explicitly timed rounds keep a compact, ordinary answer interaction.
    const interactive=enabled&&settings.timerMode==='off';
    const turn=Number.isInteger(index)&&index>=0?index:0;
    const helper=turn%2===0?'egg':'crystal';
    return {enabled:interactive,egg:interactive&&settings.mode==='train',world,hatchling:HATCHLINGS[world.scene],hint:HINTS[kind],
      helper,cardStyle:CARD_STYLES[turn%CARD_STYLES.length],messageStyle:turn%2===0?'letter':'scroll',
      caption:index%2===0?'För svaret genom porten!':'Vilket svar tar dig vidare?'};
  }
  function moved(x0,y0,x,y){return Math.hypot(x-x0,y-y0)>=8;}
  function inside(rect,x,y){return !!rect&&rect.width>0&&rect.height>0&&
    Number.isFinite(x)&&Number.isFinite(y)&&x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom;}
  function validDrop(drag,token,rect,x,y,optionCount){
    return !!drag&&drag.token===token&&drag.moved===true&&
      Number.isInteger(drag.index)&&drag.index>=0&&drag.index<optionCount&&inside(rect,x,y);
  }
  return {WORLDS,HINTS,MYSTERIES,PHASES,HATCHLINGS,TREASURES,PICTURE_NAMES,CARD_STYLES,plan,mystery,discovery,picture,moved,inside,validDrop};
});
