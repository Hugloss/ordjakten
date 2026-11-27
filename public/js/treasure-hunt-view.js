/* A clickable map with ordinary keyboard-friendly buttons. The model owns
 * destinations and rewards; no correct destination is encoded in the map UI. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenTreasureView=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const number=value=>Number.isSafeInteger(value)&&value>=0?value:0;
  function maker(host){
    return (tag,className='',text='')=>{
      const node=host.ownerDocument.createElement(tag);
      node.className=className;node.textContent=String(text);return node;
    };
  }
  function action(el,label,key,value='',serial=null,primary=false){
    const button=el('button',(primary?'primary-button':'secondary-button')+' treasure-action',label);
    button.type='button';button.dataset[key]=String(value);
    if(serial!==null)button.dataset.treasureSerial=String(serial);
    return button;
  }
  function speech(el,kind,enabled,serial=null){
    if(!enabled)return [];
    const id='treasure-listen-'+kind;
    const labels={clue:'🔊 Lyssna på ledtråden och platserna',task:'🔊 Lyssna på uppgiften',explanation:'🔊 Lyssna på förklaringen'};
    const button=action(el,labels[kind], 'treasureListen',kind,serial);
    button.id=id;button.setAttribute('aria-pressed','false');
    const status=el('p','treasure-speech-status');status.id=id+'-status';
    status.setAttribute('role','status');status.hidden=true;
    return [button,status];
  }
  function scenery(host){
    const doc=host.ownerDocument;
    const svg=doc.createElementNS(NS,'svg');
    for(const [name,value] of Object.entries({viewBox:'0 0 900 620',preserveAspectRatio:'none',class:'treasure-map-scenery','aria-hidden':'true',focusable:'false'}))svg.setAttribute(name,value);
    const draw=(tag,attrs)=>{const node=doc.createElementNS(NS,tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));svg.append(node);return node;};
    draw('path',{d:'M0 60 Q180 10 270 125 T550 70 T900 115 V0 H0 Z',class:'treasure-terrain'});
    draw('path',{d:'M0 500 Q170 420 360 530 T700 480 T900 535 V620 H0 Z',class:'treasure-terrain'});
    draw('path',{d:'M210 135 C350 65 450 95 675 160 S740 350 500 315 S100 355 220 470 S580 555 705 465',class:'treasure-trail-shadow'});
    draw('path',{d:'M210 135 C350 65 450 95 675 160 S740 350 500 315 S100 355 220 470 S580 555 705 465',class:'treasure-trail'});
    for(const [cx,cy] of [[440,110],[485,530],[72,300],[825,290]]){
      draw('path',{d:`M${cx} ${cy-14} L${cx+4} ${cy-4} L${cx+14} ${cy} L${cx+4} ${cy+4} L${cx} ${cy+14} L${cx-4} ${cy+4} L${cx-14} ${cy} L${cx-4} ${cy-4} Z`,class:'treasure-map-spark'});
    }
    return svg;
  }
  function scoreStrip(el,model,wordStars){
    const strip=el('div','treasure-scores');strip.setAttribute('aria-label','Dina framsteg på den här kartan');
    const navigation=el('div','treasure-score');
    navigation.append(el('span','','🧭 Sakletare'),el('strong','',`${number(model.count)} av ${number(model.total)} ledtrådar`));
    const words=el('div','treasure-score');
    words.append(el('span','','⭐ Ordfrågor'),el('strong','',`${wordStars.length} av ${number(model.total)} stjärnor`));
    strip.append(navigation,words);return strip;
  }
  function collection(el,model){
    const found=Array.isArray(model.collection)?model.collection:[],small=Array.isArray(model.smallFinds)?model.smallFinds:[];
    const box=el('details','treasure-collection');
    box.append(el('summary','',`🎒 Mina fynd · ${found.length} ${found.length===1?'skatt':'skatter'}`));
    box.append(el('h3','','Skatter från ledtrådarna'));
    if(found.length){
      const list=el('ul','treasure-find-list');
      for(const item of found){const row=el('li','treasure-found-item');
        const icon=el('span','treasure-find-icon',item.emoji);icon.setAttribute('aria-hidden','true');
        const copy=el('div');copy.append(el('strong','',item.name),el('span','',item.place));row.append(icon,copy);list.append(row);}
      box.append(list);
    }else box.append(el('p','','Här sparas skatterna när du hittar platserna som ledtrådarna beskriver.'));
    if(small.length){
      box.append(el('h3','','Små fynd från avstickare'));
      const list=el('ul','treasure-find-list');
      for(const item of small){const row=el('li','treasure-small-item');row.append(el('span','treasure-find-icon',item.emoji),el('span','',item.name+' · '+item.place));list.append(row);}
      box.append(list);
    }
    return box;
  }
  function mapView(host,el,model,options,wordStars){
    const intro=el('header','treasure-map-heading');
    const copy=el('div');
    copy.append(el('p','treasure-world-name',model.emoji+' '+model.title));
    const title=el('h1','','Skattkartan');title.id='treasure-stage-title';title.tabIndex=-1;
    copy.append(title,el('p','','Läs ledtråden. Välj platsen som passar.'));intro.append(copy);
    const worlds=options.worlds||model.worlds||[];
    if(worlds.length){
      const picker=el('div','treasure-world-picker'),label=el('label','','Byt karta');label.htmlFor='treasure-world';
      const select=el('select','field');select.id='treasure-world';select.dataset.treasureWorld='';
      for(const world of worlds){const option=el('option','',world.emoji+' '+world.title);option.value=world.id;option.selected=world.id===model.id;select.append(option);}
      picker.append(label,select);intro.append(picker);
    }
    host.append(intro,scoreStrip(el,model,wordStars));
    const clue=el('section','treasure-clue');clue.setAttribute('aria-labelledby','treasure-clue-title');
    if(model.clue){
      const heading=el('h2','',`Ledtråd ${number(model.count)+1} av ${number(model.total)}`);heading.id='treasure-clue-title';
      clue.append(heading,el('p','treasure-clue-text',model.clue.text));
      const controls=el('div','treasure-controls');
      const hint=action(el,'💡 En ledtråd till','treasureHint');hint.setAttribute('aria-expanded',String(!!model.clue.hintShown));hint.setAttribute('aria-controls','treasure-hint');
      controls.append(...speech(el,'clue',options.canReadAloud),hint);clue.append(controls);
      const help=el('p','treasure-hint',model.clue.hintShown?model.clue.hint:'');help.id='treasure-hint';help.tabIndex=-1;help.setAttribute('role','status');help.hidden=!model.clue.hintShown;clue.append(help);
    }else{
      const heading=el('h2','','Alla skatter på kartan hittade!');heading.id='treasure-clue-title';
      clue.append(heading,el('p','','Du har följt alla fyra ledtrådarna. Besök en plats igen för att öva på ordfrågan, eller välj en annan karta.'));
    }
    host.append(clue);
    const map=el('section','treasure-map-board');map.setAttribute('aria-label','Välj en plats på kartan');
    map.append(scenery(host));
    for(const place of model.places){
      const button=action(el,'','treasurePlace',place.index);button.className='treasure-place'+(place.found?' treasure-place-found':'');
      const icon=el('span','treasure-place-icon',place.emoji);icon.setAttribute('aria-hidden','true');
      button.append(icon,el('strong','treasure-place-name',place.name),el('span','treasure-place-description',place.description));
      const state=el('span','treasure-place-state',place.found?'✓ Skatt hittad':place.visited?'Besökt – du kan komma tillbaka':'Besök platsen');button.append(state);
      if(wordStars.includes(place.index))button.append(el('span','treasure-place-star','⭐ Ordfrågans stjärna samlad'));
      map.append(button);
    }
    host.append(map,el('p','treasure-reassurance','Ta den tid du behöver. Dina fynd och stjärnor sparas här i webbläsaren.'),collection(el,model));
    const rules=el('details','treasure-rules');rules.append(el('summary','','Så fungerar skattjakten'),
      el('p','','När du hittar platsen som ledtråden beskriver får du en skatt och en sakletarpoäng efter uppgiften. Vid en annan plats finns en uppgift och ett litet fynd. Sedan kan du leta vidare.'),
      el('p','','Ett eget rätt svar på ordfrågan ger en stjärna. Du kan få hjälp och prova igen. Varje plats kan ge en ordstjärna, och varje ledtråd kan ge en sakletarpoäng. Inget beror på hur fort du svarar.'));
    host.append(rules);
  }
  function wordReward(el,model,options,wordStars){
    const visit=model.visit,own=visit.outcome==='direct'||visit.outcome==='supported',saved=wordStars.includes(visit.index);
    const box=el('div','treasure-word-reward');
    if(own&&options.starReward?.added){
      box.append(el('strong','','⭐ En ordstjärna till din samling!'));
      if(Number.isSafeInteger(options.totalStars))box.append(el('p','',`Du har ${number(options.totalStars)} ${options.totalStars===1?'stjärna':'stjärnor'} i hela samlingen.`));
      for(const item of options.starReward.milestones||[])box.append(el('p','',`${item.icon||'✨'} Du samlade ${item.title}!`));
    }else if(saved)box.append(el('p','','⭐ Ordfrågans stjärna finns i din samling.'));
    else if(!own)box.append(el('p','','Vi tittade på svaret tillsammans. Du kan besöka platsen igen och prova själv för att samla ordstjärnan.'));
    return box;
  }
  function visitView(host,el,model,options,wordStars){
    const visit=model.visit,task=visit.task,serial=visit.serial;
    const top=el('header','treasure-visit-heading');
    const icon=el('span','treasure-visit-icon',visit.emoji);icon.setAttribute('aria-hidden','true');
    const copy=el('div');copy.append(el('p','treasure-world-name',model.emoji+' '+model.title));
    const title=el('h1','','Du är vid '+visit.name);title.id='treasure-stage-title';title.tabIndex=-1;copy.append(title);top.append(icon,copy);
    host.append(top,scoreStrip(el,model,wordStars));
    const arrival=el('section','treasure-arrival');
    if(visit.matched){arrival.append(el('h2','','Här stämmer ledtråden!'),el('p','',model.clue?.why||'Du hittade platsen som ledtråden beskriver.'));
      if(model.phase!=='reward')arrival.append(el('p','','Efter uppgiften får du platsens skatt och en sakletarpoäng.'));
    }else if(model.clue){
      arrival.append(el('h2','','En liten avstickare'),el('p','','Ledtråden leder till en annan plats. Här finns också en ordfråga. Sedan kan du leta vidare.'));
      const comparison=el('dl','treasure-comparison');
      comparison.append(el('dt','','Ledtråden säger'),el('dd','',model.clue.text),
        el('dt','','Här, vid '+visit.name),el('dd','',model.places.find(place=>place.index===visit.index)?.description||''));
      arrival.append(comparison);
    }
    else arrival.append(el('h2','','Välkommen tillbaka!'),el('p','','Här kan du öva på ordfrågan igen. Dina hittade skatter finns kvar.'));
    host.append(arrival);
    if(model.phase==='question'){
      const question=el('section','treasure-task');question.setAttribute('aria-labelledby','treasure-question-title');
      const companion=options.companion;
      const heading=el('h2','',companion?.name?(companion.emoji||'')+' Hjälp '+companion.name:'Hjälp ordkompisen');heading.id='treasure-question-title';
      question.append(heading,el('p','treasure-task-prompt',task.prompt),...speech(el,'task',options.canReadAloud,serial));
      if(visit.attempts){const hint=el('div','treasure-hint');hint.id='treasure-hint';hint.tabIndex=-1;hint.setAttribute('role','status');
        hint.append(el('strong','','Läs hjälpen och prova igen.'),el('p','',task.word+' – '+task.definition));question.append(hint);}
      const answers=el('div','treasure-answers');answers.setAttribute('role','group');answers.setAttribute('aria-label','Välj svar på ordfrågan');
      for(const option of visit.options){const button=action(el,option.label,'treasureAnswer',option.id,serial);button.className='reading-option treasure-answer';answers.append(button);}
      question.append(answers,action(el,'Lös det tillsammans med ordkompisen','treasureExplain','',serial));host.append(question);
    }else if(model.phase==='explanation'){
      const explanation=el('section','treasure-task');
      explanation.append(el('h2','',visit.outcome==='guided'?'Vi löser det tillsammans':'Du hittade ett svar som passar!'),el('p','treasure-word-definition',task.word+' – '+task.definition));
      const correct=task.options.find(option=>option.correct);
      explanation.append(el('p','treasure-solution','Vi väljer: '+(correct?.label||'')),el('p','treasure-task-prompt',task.why),...speech(el,'explanation',options.canReadAloud,serial),wordReward(el,model,options,wordStars));
      explanation.append(action(el,'Titta på fyndet','treasureFinish','',serial,true));host.append(explanation);
    }else if(model.phase==='reward'){
      const reward=visit.reward||{},box=el('section','treasure-reward'+(reward.kind==='treasure'?' treasure-reward-special':''));
      box.setAttribute('aria-labelledby','treasure-reward-title');
      const mark=el('span','treasure-reward-icon',reward.emoji||'🎒');mark.setAttribute('aria-hidden','true');
      const heading=el('h2','',reward.newItem?(reward.kind==='treasure'?'Din nya skatt: ':'Ditt nya fynd: ')+reward.name:reward.kind==='treasure'?'Skatten finns i din samling':'Du har besökt platsen igen');heading.id='treasure-reward-title';
      box.append(mark,heading);
      if(reward.finderAdded)box.append(el('p','treasure-finder-earned','🧭 +1 sakletarpoäng. Du hittade platsen med hjälp av ledtråden.'));
      else if(model.clue&&!visit.matched)box.append(el('p','','Det lilla fyndet ger ingen sakletarpoäng. Läs ledtråden igen och leta efter platsen som passar.'));
      else box.append(el('p','','Det här besöket ger ingen ny sakletarpoäng. Dina tidigare fynd finns kvar.'));
      if(reward.kind==='small'&&!reward.newItem)box.append(el('p','',reward.name+' från den här platsen finns redan i din samling.'));
      box.append(wordReward(el,model,options,wordStars));
      const label=visit.matched?(model.complete?'Se den färdiga kartan':'Till kartan och nästa ledtråd'):model.clue?'Till kartan – leta vidare':'Till kartan';
      box.append(action(el,label,'treasureBack','',serial,true));host.append(box,collection(el,model));
    }
    if(model.phase!=='reward')host.append(action(el,'Till kartan','treasureBack','',serial));
  }
  function render(host,model,options={}){
    if(!host)return;
    host.replaceChildren();host.hidden=!model||!Array.isArray(model.places);
    if(host.hidden)return;
    const el=maker(host),wordStars=[...new Set((options.wordStars||[]).filter(index=>Number.isInteger(index)&&index>=0&&index<model.total))];
    options={canReadAloud:false,...options};
    host.className='treasure-hunt';host.dataset.treasureWorldId=model.id;
    if(model.phase==='map'||!model.visit)mapView(host,el,model,options,wordStars);
    else visitView(host,el,model,options,wordStars);
  }
  return {render};
});
