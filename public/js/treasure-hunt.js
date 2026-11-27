/* Clue-led visits reuse the authored word tasks. Finding a place and solving
 * its word task are separate achievements. Neither depends on a clock.
 * Only bounded IDs and visit state are saved, never copied question content. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenTreasure=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ORDER=Object.freeze([2,0,3,1]);
  const MAX=Number.MAX_SAFE_INTEGER;
  const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const integer=value=>Number.isSafeInteger(value)&&value>=0;
  const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=700;
  const placeIndex=value=>Number.isInteger(value)&&value>=0&&value<4;
  const transferIndex=value=>Number.isInteger(value)&&value>=0&&value<3;
  const emptyWorld=()=>({found:[],visited:[],smallFinds:[],hints:[]});
  const freshMystery=()=>({revealed:1,attempted:[],last:null,solved:false,proofWrong:[],proofDone:false,proofLast:null,transferWrong:[],transferDone:false,transferLast:null});
  const empty=()=>({version:1,serial:0,worlds:{},active:null});
  const indexes=value=>Array.isArray(value)?[...new Set(value.filter(placeIndex))].sort((a,b)=>a-b):[];
  const knownWorld=(content,id)=>typeof id==='string'&&object(content?.worlds)&&Object.hasOwn(content.worlds,id);
  const nextClue=world=>ORDER.find(index=>!world.found.includes(index))??null;

  function catalog(data,adventures,story,missions){
    const worlds={},errors=[];
    for(const id of adventures.WORLD_IDS){
      const world=adventures.world(id),rows=data?.DATA?.[id],chapters=story?.DATA?.[id];
      const smallFind=data?.SMALL_FINDS?.[id],letter=data?.LETTER_FRAGMENTS?.[id],mystery=data?.MYSTERIES?.[id],transfer=data?.TRANSFERS?.[id];
      if(!Array.isArray(rows)||rows.length!==4||!Array.isArray(chapters)||chapters.length!==4||
        world.stops.length!==4||!text(smallFind?.name)||!text(smallFind?.emoji)||
        !Array.isArray(letter)||letter.length!==4||letter.some(part=>!text(part)||part.length>120)){
        errors.push(id);continue;
      }
      const places=[];
      rows.forEach((row,index)=>{
        const key=id+':'+index,task=missions?.tasks?.[key],chapter=chapters[index],stop=world.stops[index];
        if(!object(row)||!['description','clue','hint','why'].every(field=>text(row[field]))||
          !Array.isArray(row.lookFor)||row.lookFor.length!==2||new Set(row.lookFor).size!==2||
          row.lookFor.some(part=>!text(part)||part.length>100)||
          !task||task.key!==key||task.world!==id||task.index!==index||!text(task.target)||
          !text(task.prompt)||!text(task.word)||!text(task.definition)||!text(task.why)||
          !Array.isArray(task.options)||task.options.length!==3||
          new Set(task.options.map(option=>option.id)).size!==3||
          task.options.some(option=>typeof option.id!=='string'||!text(option.label)||typeof option.correct!=='boolean')||
          task.options.filter(option=>option.correct).length!==1||!text(chapter[3])||!text(chapter[4])){
          errors.push(key);return;
        }
        places.push({index,key,name:stop.name,emoji:stop.emoji,
          description:row.description,clue:row.clue,hint:row.hint,why:row.why,lookFor:[...row.lookFor],
          treasure:{emoji:chapter[3],name:chapter[4]},
          task:{...task,options:task.options.map(option=>({...option}))}});
      });
      if(places.length!==4)continue;
      if(!object(mystery)||!text(mystery.title)||!text(mystery.intro)||!text(mystery.why)||
        !placeIndex(mystery.target)||!Array.isArray(mystery.clues)||mystery.clues.length!==3||
        mystery.clues.some(clue=>!text(clue)||clue.length>140)||
        !Array.isArray(mystery.wrong)||mystery.wrong.length!==4||
        mystery.wrong.some((answer,index)=>index===mystery.target?answer!==null:!text(answer)||answer.length>200)){
        errors.push(id+':mystery');continue;
      }
      if(!object(transfer)||!text(transfer.title)||transfer.title.length>80||
        !text(transfer.intro)||transfer.intro.length>180||!text(transfer.why)||transfer.why.length>200||
        !transferIndex(transfer.target)||
        !Array.isArray(transfer.clues)||transfer.clues.length!==2||
        transfer.clues.some(clue=>!text(clue)||clue.length<20||clue.length>140)||
        !Array.isArray(transfer.choices)||transfer.choices.length!==3||
        transfer.choices.some(choice=>!text(choice)||choice.length<20||choice.length>175)||
        new Set(transfer.choices).size!==3||
        !Array.isArray(transfer.wrong)||transfer.wrong.length!==3||
        transfer.wrong.some((reply,index)=>index===transfer.target?reply!==null:!text(reply)||reply.length<20||reply.length>200)){
        errors.push(id+':transfer');continue;
      }
      if(new Set(places.map(place=>place.clue)).size!==4||new Set(places.map(place=>place.description)).size!==4){
        errors.push(id+':duplicates');continue;
      }
      worlds[id]={id,title:world.title,emoji:world.emoji,places,letter:[...letter],mystery:{...mystery,clues:[...mystery.clues],wrong:[...mystery.wrong]},transfer:{...transfer,clues:[...transfer.clues],choices:[...transfer.choices],wrong:[...transfer.wrong]},smallFind:{emoji:smallFind.emoji,name:smallFind.name}};
    }
    return {worlds,errors};
  }

  // The three answer pairs are reused from existing, individually reviewed
  // map evidence. They are rotated per world, not always presented correct first.
  function proofChoices(world){
    const target=world.mystery.target;
    const ids=[target,...world.places.filter(place=>place.index!==target).slice(0,2).map(place=>place.index)];
    const shift=(target+world.title.length)%ids.length;
    return [...ids.slice(shift),...ids.slice(0,shift)].map(id=>({
      id,label:world.places[id].lookFor.join(' och ')
    }));
  }
  function safeMystery(value,world){
    const target=world.mystery.target;
    if(!object(value)||!Number.isInteger(value.revealed)||value.revealed<1||value.revealed>3||
      typeof value.solved!=='boolean')return null;
    const attempted=indexes(value.attempted).filter(index=>index!==target);
    const last=value.last===null?null:placeIndex(value.last)?value.last:-1;
    if(last===-1||(value.solved&&(value.revealed!==3||last!==target))||
      (!value.solved&&last!==null&&!attempted.includes(last)))return null;
    // Old saved mysteries lack proof fields. Keep their successful find intact.
    const allowed=proofChoices(world).map(option=>option.id);
    const proofWrong=indexes(value.proofWrong).filter(index=>index!==target&&allowed.includes(index));
    const proofDone=value.proofDone===true;
    const proofLast=value.proofLast===null||value.proofLast===undefined?null:
      placeIndex(value.proofLast)?value.proofLast:-1;
    if(proofLast===-1||(proofDone&&(!value.solved||proofLast!==target))||
      (!proofDone&&proofLast!==null&&!proofWrong.includes(proofLast))||
      (!value.solved&&(proofWrong.length||proofLast!==null)))return null;
    // Legacy saves did not have transfer fields. Keep previously earned treasures
    // and proof intact. Transfer attempts cannot exist before proof is finished.
    const transferTarget=world.transfer.target;
    const transferWrong=Array.isArray(value.transferWrong)?
      [...new Set(value.transferWrong.filter(index=>transferIndex(index)&&index!==transferTarget))].sort((a,b)=>a-b):[];
    const transferDone=value.transferDone===true;
    const transferLast=value.transferLast===undefined||value.transferLast===null?null:
      transferIndex(value.transferLast)?value.transferLast:-1;
    const transferValid=transferLast!==-1&&
      (!transferDone||(proofDone&&transferLast===transferTarget))&&
      (transferDone||transferLast===null||transferWrong.includes(transferLast))&&
      (proofDone||(!transferWrong.length&&!transferDone&&transferLast===null));
    // A bad new exercise must not erase a previously solved mystery.
    // Reset just its unscored attempt state and allow a fresh try.
    return {revealed:value.revealed,attempted,last,solved:value.solved,proofWrong,proofDone,proofLast,
      transferWrong:transferValid?transferWrong:[],
      transferDone:transferValid?transferDone:false,
      transferLast:transferValid?transferLast:null};
  }
  function sanitize(raw,content){
    const clean=empty();
    if(!object(raw)||raw.version!==1)return clean;
    clean.serial=integer(raw.serial)?raw.serial:0;
    for(const id of Object.keys(content?.worlds||{})){
      const source=object(raw.worlds)&&object(raw.worlds[id])?raw.worlds[id]:null;
      if(!source)continue;
      const visited=indexes(source.visited),found=[];
      for(const index of ORDER){
        if(!Array.isArray(source.found)||!source.found.includes(index)||!visited.includes(index))break;
        found.push(index);
      }
      const smallFinds=indexes(source.smallFinds).filter(index=>visited.includes(index));
      const hints=indexes(source.hints);
      const mystery=found.length?safeMystery(source.mystery,content.worlds[id]):null;
      if(found.length||visited.length||smallFinds.length||hints.length)
        clean.worlds[id]={found,visited,smallFinds,hints,...(mystery?{mystery}:{})};
    }
    const active=raw.active;
    if(!object(active)||!knownWorld(content,active.world)||!clean.serial||active.serial!==clean.serial||
      !placeIndex(active.place)||!(active.clue===null||placeIndex(active.clue))||
      !['question','explanation','reward'].includes(active.stage)||
      !Number.isInteger(active.attempts)||active.attempts<0||active.attempts>2||
      !Array.isArray(active.optionOrder)||active.optionOrder.length!==3||new Set(active.optionOrder).size!==3)return clean;
    const world=clean.worlds[active.world]||emptyWorld(),place=content.worlds[active.world].places[active.place];
    const options=place.task.options;
    if(active.optionOrder.some(id=>!options.some(option=>option.id===id)))return clean;
    const selected=options.find(option=>option.id===active.selected)||null;
    if(active.selected!==null&&!selected)return clean;
    if(active.stage==='question'){
      if(active.outcome!==null||active.attempts>1||active.reward!==null||
        (active.attempts===0&&active.selected!==null)||(active.attempts===1&&(!selected||selected.correct)))return clean;
    }else{
      if(!['direct','supported','guided'].includes(active.outcome))return clean;
      if(active.outcome==='direct'&&(active.attempts!==0||!selected?.correct))return clean;
      if(active.outcome==='supported'&&(active.attempts!==1||!selected?.correct))return clean;
      if(active.outcome==='guided'&&((active.attempts===2&&(!selected||selected.correct))||
        (active.attempts<2&&active.selected!==null)))return clean;
    }
    let reward=null;
    if(active.stage==='reward'){
      if(!object(active.reward)||typeof active.reward.newItem!=='boolean'||!world.visited.includes(active.place))return clean;
      const matched=active.clue!==null&&active.place===active.clue;
      if(matched){
        if(active.clue!==world.found.at(-1)||active.reward.kind!=='treasure'||
          active.reward.finderAdded!==1||active.reward.newItem!==true)return clean;
      }else{
        if(active.clue!==nextClue(world)||active.reward.finderAdded!==0)return clean;
        const kind=active.clue===null?'revisit':'small';
        if(active.reward.kind!==kind||(kind==='revisit'&&active.reward.newItem)||
          (kind==='small'&&!world.smallFinds.includes(active.place)))return clean;
      }
      reward={kind:active.reward.kind,newItem:active.reward.newItem,finderAdded:active.reward.finderAdded};
    }else if(active.clue!==nextClue(world)||active.reward!==null)return clean;
    clean.active={world:active.world,place:active.place,clue:active.clue,serial:active.serial,
      stage:active.stage,attempts:active.attempts,outcome:active.outcome,selected:active.selected,
      optionOrder:[...active.optionOrder],reward};
    return clean;
  }

  function model(raw,worldId,content){
    const state=sanitize(raw,content);
    const id=knownWorld(content,worldId)?worldId:Object.keys(content?.worlds||{})[0];
    const world=content?.worlds?.[id];
    if(!world)return null;
    const progress=state.worlds[id]||emptyWorld();
    const active=state.active?.world===id?state.active:null;
    const target=active?active.clue:nextClue(progress),cluePlace=target===null?null:world.places[target];
    const places=world.places.map(place=>({...place,visited:progress.visited.includes(place.index),
      found:progress.found.includes(place.index),smallFound:progress.smallFinds.includes(place.index)}));
    let visit=null;
    if(active){
      const place=places[active.place],item=active.reward?.kind==='small'?world.smallFind:place.treasure;
      visit={serial:active.serial,index:place.index,name:place.name,emoji:place.emoji,
        matched:active.clue!==null&&active.place===active.clue,task:place.task,
        options:active.optionOrder.map(optionId=>({...place.task.options.find(option=>option.id===optionId)})),
        stage:active.stage,attempts:active.attempts,outcome:active.outcome,
        reward:active.reward?{...active.reward,...item}:null,activityKey:'treasure:'+id+':'+place.index};
    }
    const worlds=Object.values(content.worlds).map(row=>({id:row.id,title:row.title,emoji:row.emoji,
      count:state.worlds[row.id]?.found.length||0,total:4,mysterySolved:state.worlds[row.id]?.mystery?.solved===true,
      mysteryProofDone:state.worlds[row.id]?.mystery?.proofDone===true,
      mysteryTransferDone:state.worlds[row.id]?.mystery?.transferDone===true}));
    const mysteryProgress=progress.mystery||freshMystery(),mysteryContent=world.mystery;
    const mysteryAvailable=progress.found.length>0;
    const mystery={available:mysteryAvailable,title:mysteryContent.title,intro:mysteryContent.intro,
      revealed:mysteryAvailable?mysteryProgress.revealed:0,
      clues:mysteryAvailable?mysteryContent.clues.slice(0,mysteryProgress.revealed):[],
      attempted:mysteryAvailable?[...mysteryProgress.attempted]:[],
      solved:mysteryAvailable&&mysteryProgress.solved,last:mysteryAvailable?mysteryProgress.last:null,
      feedback:mysteryAvailable&&mysteryProgress.last!==null?
        (mysteryProgress.solved?mysteryContent.why:mysteryContent.wrong[mysteryProgress.last]):null,
      proof:{done:mysteryAvailable&&mysteryProgress.proofDone,
        evidence:mysteryAvailable&&mysteryProgress.proofDone?[...world.places[mysteryContent.target].lookFor]:[],
        wrong:mysteryAvailable?[...mysteryProgress.proofWrong]:[],
        choices:mysteryAvailable&&mysteryProgress.solved?proofChoices(world):[],
        feedback:mysteryAvailable&&mysteryProgress.proofLast!==null?
          (mysteryProgress.proofDone?mysteryContent.why:mysteryContent.wrong[mysteryProgress.proofLast]):null},
      transfer:mysteryAvailable&&mysteryProgress.proofDone?{
        title:world.transfer.title,intro:world.transfer.intro,clues:[...world.transfer.clues],
        choices:mysteryProgress.transferDone?[]:world.transfer.choices.map((label,id)=>({id,label})),
        wrong:[...mysteryProgress.transferWrong],done:mysteryProgress.transferDone,
        feedback:mysteryProgress.transferLast!==null?
          (mysteryProgress.transferDone?world.transfer.why:world.transfer.wrong[mysteryProgress.transferLast]):null
      }:null};
    return {id,title:world.title,emoji:world.emoji,phase:active?.stage||'map',count:progress.found.length,total:4,
      complete:progress.found.length===4,finderTotal:worlds.reduce((sum,row)=>sum+row.count,0),worlds,
      clue:cluePlace?{index:target,text:cluePlace.clue,hint:cluePlace.hint,why:cluePlace.why,
        lookFor:[...cluePlace.lookFor],hintShown:progress.hints.includes(target)}:null,
      places,mystery,letter:{count:progress.found.length,total:4,fragments:world.letter.slice(0,progress.found.length)},
      collection:progress.found.map(index=>({index,place:world.places[index].name,...world.places[index].treasure})),
      smallFinds:progress.smallFinds.map(index=>({index,place:world.places[index].name,...world.smallFind})),visit};
  }

  function visit(raw,worldId,index,content,random=Math.random){
    const state=sanitize(raw,content);
    if(state.active||!knownWorld(content,worldId)||!placeIndex(index)||state.serial===MAX)return raw;
    const world=state.worlds[worldId]||emptyWorld(),options=content.worlds[worldId].places[index].task.options;
    const optionOrder=options.map(option=>option.id);
    for(let i=optionOrder.length-1;i>0;i--){
      const value=random(),j=Math.max(0,Math.min(i,Math.floor((Number.isFinite(value)?value:0)*(i+1))));
      [optionOrder[i],optionOrder[j]]=[optionOrder[j],optionOrder[i]];
    }
    const serial=state.serial+1;
    return {...state,serial,active:{world:worldId,place:index,clue:nextClue(world),serial,stage:'question',attempts:0,
      outcome:null,selected:null,optionOrder,reward:null}};
  }

  function answer(raw,serial,optionId,content){
    const state=sanitize(raw,content),active=state.active;
    if(!active||active.serial!==serial||active.stage!=='question')return raw;
    const task=content.worlds[active.world].places[active.place].task;
    const option=task.options.find(row=>row.id===optionId);
    if(!option)return raw;
    if(option.correct)return {...state,active:{...active,selected:optionId,stage:'explanation',
      outcome:active.attempts?'supported':'direct'}};
    const attempts=active.attempts+1;
    return {...state,active:{...active,selected:optionId,attempts,
      stage:attempts===2?'explanation':'question',outcome:attempts===2?'guided':null}};
  }

  function explain(raw,serial,content){
    const state=sanitize(raw,content),active=state.active;
    if(!active||active.serial!==serial||active.stage!=='question')return raw;
    return {...state,active:{...active,stage:'explanation',outcome:'guided',selected:null}};
  }

  function finish(raw,serial,content){
    const state=sanitize(raw,content),active=state.active;
    if(!active||active.serial!==serial||active.stage!=='explanation')return raw;
    const progress=state.worlds[active.world]||emptyWorld(),matched=active.clue!==null&&active.place===active.clue;
    const visited=[...new Set([...progress.visited,active.place])].sort((a,b)=>a-b);
    const found=matched?[...progress.found,active.clue]:progress.found;
    const small=active.clue!==null&&!matched,newSmall=small&&!progress.smallFinds.includes(active.place);
    const smallFinds=newSmall?[...progress.smallFinds,active.place].sort((a,b)=>a-b):progress.smallFinds;
    const reward={kind:matched?'treasure':small?'small':'revisit',newItem:matched||newSmall,finderAdded:matched?1:0};
    return {...state,worlds:{...state.worlds,[active.world]:{...progress,found,visited,smallFinds}},
      active:{...active,stage:'reward',reward}};
  }

  function back(raw,serial,content){
    const state=sanitize(raw,content);
    // A delayed question-stage cancel must not discard an answered visit and
    // its promised find. Collect the find before returning from explanation.
    return state.active?.serial===serial&&state.active.stage!=='explanation'?{...state,active:null}:raw;
  }

  function hint(raw,worldId,content){
    const state=sanitize(raw,content);
    if(state.active||!knownWorld(content,worldId))return raw;
    const progress=state.worlds[worldId]||emptyWorld(),target=nextClue(progress);
    if(target===null||progress.hints.includes(target))return raw;
    return {...state,worlds:{...state.worlds,[worldId]:{...progress,hints:[...progress.hints,target].sort((a,b)=>a-b)}}};
  }
  function mysteryReveal(raw,worldId,content){
    const state=sanitize(raw,content);
    if(state.active||!knownWorld(content,worldId))return raw;
    const progress=state.worlds[worldId]||emptyWorld();
    if(!progress.found.length)return raw;
    const mystery=progress.mystery||freshMystery();
    if(mystery.solved||mystery.revealed>=3)return raw;
    return {...state,worlds:{...state.worlds,[worldId]:{...progress,mystery:{...mystery,revealed:mystery.revealed+1}}}};
  }
  function mysteryGuess(raw,worldId,index,content){
    const state=sanitize(raw,content);
    if(state.active||!knownWorld(content,worldId)||!placeIndex(index))return raw;
    const progress=state.worlds[worldId]||emptyWorld();
    if(!progress.found.length)return raw;
    const mystery=progress.mystery||freshMystery();
    if(mystery.solved||mystery.revealed!==3||mystery.attempted.includes(index))return raw;
    const correct=index===content.worlds[worldId].mystery.target;
    const updated={...mystery,last:index,solved:correct,
      attempted:correct?mystery.attempted:[...mystery.attempted,index].sort((a,b)=>a-b)};
    return {...state,worlds:{...state.worlds,[worldId]:{...progress,mystery:updated}}};
  }
  function mysteryProof(raw,worldId,index,content){
    const state=sanitize(raw,content);
    if(state.active||!knownWorld(content,worldId)||!placeIndex(index))return raw;
    const progress=state.worlds[worldId]||emptyWorld();
    if(!progress.found.length)return raw;
    const mystery=progress.mystery||freshMystery();
    const world=content.worlds[worldId];
    if(!mystery.solved||mystery.proofDone||mystery.proofWrong.includes(index)||
      !proofChoices(world).some(option=>option.id===index))return raw;
    const correct=index===world.mystery.target;
    const updated={...mystery,proofLast:index,proofDone:correct,
      proofWrong:correct?mystery.proofWrong:[...mystery.proofWrong,index].sort((a,b)=>a-b)};
    return {...state,worlds:{...state.worlds,[worldId]:{...progress,mystery:updated}}};
  }
  function mysteryTransfer(raw,worldId,index,content){
    const state=sanitize(raw,content);
    if(state.active||!knownWorld(content,worldId)||!transferIndex(index))return raw;
    const progress=state.worlds[worldId]||emptyWorld();
    const mystery=progress.mystery||freshMystery();
    if(!mystery.proofDone||mystery.transferDone||mystery.transferWrong.includes(index))return raw;
    const correct=index===content.worlds[worldId].transfer.target;
    const updated={...mystery,transferLast:index,transferDone:correct,
      transferWrong:correct?mystery.transferWrong:[...mystery.transferWrong,index].sort((a,b)=>a-b)};
    return {...state,worlds:{...state.worlds,[worldId]:{...progress,mystery:updated}}};
  }
  return {ORDER,catalog,sanitize,model,visit,answer,explain,finish,back,hint,mysteryReveal,mysteryGuess,mysteryProof,mysteryTransfer};
});
