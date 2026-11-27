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
    const labels={clue:'🔊 Lyssna på ledtråden och platserna',mystery:'🔊 Lyssna på mysteriet',arrival:'🔊 Lyssna på ledtråden och platsen',task:'🔊 Lyssna på uppgiften',explanation:'🔊 Lyssna på förklaringen',transfer:'🔊 Lyssna på det nya fallet'};
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
  function clueParts(el,clue){
    const box=el('div','treasure-clue-parts');
    if(!Array.isArray(clue?.lookFor)||clue.lookFor.length!==2)return box;
    box.append(el('strong','','Leta efter båda:'));
    const list=el('ul');
    for(const part of clue.lookFor)list.append(el('li','',part));
    box.append(list);return box;
  }
  function worldProgress(model,options,wordStars){
    return (options.worlds||model.worlds||[]).map(world=>{
      const saved=model.worlds?.find(row=>row.id===world.id),total=number(world.total??saved?.total)||4;
      return {...world,total,count:Math.min(total,number(world.id===model.id?model.count:world.count??saved?.count)),
        starCount:Math.min(total,world.id===model.id?wordStars.length:number(world.starCount))};
    });
  }
  function mapBook(el,worlds,current){
    const box=el('details','treasure-map-book'),earned=worlds.filter(world=>world.count===world.total).length;
    box.append(el('summary','',`🧭 Min skattbok · ${earned} av ${worlds.length} kartmärken`),
      el('p','','När du har hittat en kartas fyra skatter får du kartmärket. Du kan välja vilken karta du vill.'));
    const list=el('ul','treasure-badge-list');list.setAttribute('aria-label','Dina kartmärken');
    for(const world of worlds){
      const collected=world.count===world.total,row=el('li');
      const button=action(el,'','treasureWorldChoice',world.id);
      button.className='treasure-map-badge'+(collected?' treasure-map-badge-earned':'');
      if(world.id===current)button.setAttribute('aria-current','true');
      const icon=el('span','treasure-badge-icon',world.emoji);icon.setAttribute('aria-hidden','true');
      button.append(icon,el('strong','treasure-badge-name',world.title),
        el('span','treasure-badge-state',collected?'✓ Kartmärke samlat':world.count?'Fortsätt leta':'Börja leta'),
        el('span','treasure-badge-count',`${world.count} av ${world.total} skatter`),
        el('span','treasure-badge-count',`⭐ ${world.starCount} av ${world.total} ordstjärnor`),
        el('span','treasure-badge-count',world.mysteryTransferDone?'🧠 Nya fallet löst':world.mysteryProofDone?'🧠 Spårbevis klart':
          world.mysterySolved?'🔍 Platsen hittad · spårbevis kvar':'🔍 Mysterium kvar'));
      if(world.id===current)button.append(el('span','treasure-badge-current','Den här kartan'));
      row.append(button);list.append(row);
    }
    box.append(list);return box;
  }
  function completeMap(el,box,model,worlds,wordStars){
    box.className+=' treasure-complete';
    const mark=el('div','treasure-complete-mark');
    const icon=el('span','treasure-complete-icon',model.emoji);icon.setAttribute('aria-hidden','true');
    const copy=el('div');copy.append(el('p','treasure-badge-label','Kartmärke samlat'),el('strong','treasure-complete-world',model.title));
    mark.append(icon,copy);box.append(mark);
    const heading=el('h2','','Alla skatter på kartan hittade!');heading.id='treasure-clue-title';
    const earned=worlds.filter(world=>world.count===world.total).length;
    box.append(heading,el('p','','Du har följt alla fyra ledtrådarna. Kartmärket finns i din skattbok.'));
    if(worlds.length)box.append(el('p','treasure-complete-count',`${earned} av ${worlds.length} kartmärken samlade`));
    const missing=model.places.filter(place=>!wordStars.includes(place.index)),controls=el('div','treasure-controls');
    if(missing.length){
      box.append(el('p','',missing.length===1?'Det finns 1 ordstjärna kvar på kartan.':`Det finns ${missing.length} ordstjärnor kvar på kartan.`));
      controls.append(action(el,'Öva ordfrågan vid '+missing[0].name,'treasurePlace',missing[0].index,null,true));
    }else box.append(el('p','','Du har också samlat alla fyra ordstjärnorna på kartan!'));
    const next=worlds.find(world=>world.id!==model.id&&world.count<world.total);
    if(next)controls.append(action(el,'Utforska '+next.title,'treasureWorldChoice',next.id,null,!missing.length));
    else if(worlds.length&&earned===worlds.length){
      box.append(el('p','treasure-all-maps','Alla kartmärken är samlade! Du kan besöka platserna igen när du vill.'));
      if(worlds.some(world=>world.starCount<world.total))box.append(el('p','','I skattboken ser du vilka kartor som har ordstjärnor kvar.'));
    }
    if(controls.children.length)box.append(controls);
  }
  // The journey shows progress, not future destinations or answers.
  function treasureTrail(el,model){
    const trail=el('section','treasure-journey');
    trail.setAttribute('aria-label','Din skattstig');
    trail.append(el('h2','','Din skattstig'));
    const list=el('ol','treasure-journey-steps');
    for(let step=0;step<model.total;step++){
      const done=step<model.count,now=!model.complete&&step===model.count;
      const item=el('li','treasure-journey-step'+(done?' treasure-journey-done':now?' treasure-journey-current':''));
      const icon=el('span','treasure-journey-icon',done?'✓':now?'🧭':'?');
      icon.setAttribute('aria-hidden','true');
      const label=done?'Skatt hittad':now?'Nästa ledtråd':'Inte hittad än';
      item.append(icon,el('span','',`Steg ${step+1}: ${label}`));
      if(now)item.setAttribute('aria-current','step');
      list.append(item);
    }
    trail.append(list);
    trail.append(el('p','treasure-journey-note',model.complete?
      'Alla fyra skatter är hittade. Ditt kartmärke finns i skattboken.':
      'Följ en ledtråd i taget. Du får tänka och prova igen utan tidspress.'));
    return trail;
  }
  function secretLetter(el,model){
    const fragments=Array.isArray(model.letter?.fragments)?model.letter.fragments:[];
    const total=number(model.letter?.total)||4,box=el('section','treasure-letter');
    box.setAttribute('aria-label','Hemliga brevet');
    box.append(el('h2','','✉️ Det hemliga brevet'),
      el('p','',fragments.length===total?'Hela brevet är hittat! Läs det från början till slut.':'Varje rätt plats ger en ny del av brevet. Läs det du har hittat hittills.'));
    const list=el('ol','treasure-letter-parts');
    for(let i=0;i<total;i++){
      const unlocked=i<fragments.length,line=el('li','treasure-letter-part'+(unlocked?' treasure-letter-open':''));
      line.append(el('span','treasure-letter-symbol',unlocked?'✉️':'🔒'),el('span','',unlocked?fragments[i]:'Brevrad '+(i+1)+' är fortfarande gömd.'));
      list.append(line);
    }
    box.append(list);return box;
  }
  function mysteryCard(el,model,options){
    const story=model.mystery;
    if(!story)return null;
    const box=el('section','treasure-mystery');
    box.setAttribute('aria-labelledby','treasure-mystery-title');
    const heading=el('h2','',story.available?'🔍 '+story.title:'🔒 Ett mysterium väntar');
    heading.id='treasure-mystery-title';heading.tabIndex=-1;
    box.append(heading);
    if(!story.available){
      box.append(el('p','','Hitta din första skatt på kartan. Då öppnas ett mysterium att lösa.'));
      return box;
    }
    box.append(el('p','treasure-mystery-intro',story.intro));
    const clues=el('ol','treasure-mystery-clues');
    for(const [index,clue] of story.clues.entries())
      clues.append(el('li','treasure-mystery-clue','Ledtråd '+(index+1)+': '+clue));
    box.append(clues);
    box.append(...speech(el,'mystery',options.canReadAloud));
    if(story.solved){
      box.append(el('p','treasure-mystery-success','✓ Mysteriet löst! Du jämförde ledtrådarna och hittade platsen.'));
      if(story.feedback)box.append(el('p','treasure-mystery-feedback',story.feedback));
      if(story.proof){
        const proof=el('div','treasure-proof');
        proof.append(el('h3','','🧩 Spårdetektivens bevis'));
        if(story.proof.done){
          proof.append(el('p','treasure-proof-done','✓ Du hittade de två detaljer som passar platsen. Bra jämfört!'));
          // An optional spoken explanation practises reasoning, not speed or scoring.
          // The model reveals the authored evidence only after proof completion.
          if(Array.isArray(story.proof.evidence)&&story.proof.evidence.length===2){
            const [first,second]=story.proof.evidence;
            const reflect=el('div','treasure-proof-reflection');
            reflect.append(el('h4','','🗣️ Berätta som en detektiv'),
              el('p','','Kan du berätta för någon varför platsen passar? Använd båda spåren.'),
              el('p','','Börja gärna: ”Jag valde den här platsen därför att … och …”'));
            const example=el('details','treasure-proof-example');
            example.append(el('summary','','Visa ett exempel om du vill ha hjälp'),
              el('p','','Jag valde platsen därför att jag hittade '+first+' och '+second+'. Båda spåren passar.'));
            reflect.append(example,el('p','','Du behöver inte skriva något. Berätta högt eller tänk tyst. Inga extra poäng behövs.'));
            proof.append(reflect);
          }
        }else{
          proof.append(el('p','','Vilka två detaljer visar varför platsen passar? Välj ett par.'));
          const choices=el('div','treasure-proof-choices');
          choices.setAttribute('role','group');
          choices.setAttribute('aria-label','Vilka två detaljer passar platsen?');
          for(const choice of story.proof.choices){
            const tried=story.proof.wrong.includes(choice.id);
            const button=action(el,choice.label+(tried?' – redan provat':''),'treasureMysteryProof',choice.id);
            button.className='treasure-proof-choice'+(tried?' treasure-mystery-tried':'');
            button.disabled=tried;
            choices.append(button);
          }
          proof.append(choices);
          if(story.proof.feedback){
            const feedback=el('p','treasure-mystery-feedback');
            feedback.setAttribute('role','status');
            feedback.textContent='Nästan! '+story.proof.feedback+' Läs detaljerna och försök igen.';
            proof.append(feedback);
          }
        }
        box.append(proof);
      }
      if(story.proof?.done&&story.transfer){
        const next=story.transfer,transfer=el('details','treasure-transfer');
        const summary=el('summary','','🔎 Prova ett nytt fall: '+next.title);
        summary.id='treasure-transfer-title';summary.tabIndex=-1;
        if(next.done||next.wrong.length)transfer.setAttribute('open','');
        transfer.append(summary,el('p','treasure-transfer-intro',next.intro),
          el('p','','Läs båda ledtrådarna. Vilket svar passar dem tillsammans?'));
        const clues=el('ol','treasure-mystery-clues');
        for(const [index,clue] of next.clues.entries())
          clues.append(el('li','treasure-mystery-clue','Spår '+(index+1)+': '+clue));
        transfer.append(clues,...speech(el,'transfer',options.canReadAloud));
        if(next.done){
          transfer.append(el('p','treasure-mystery-success','✓ Du hittade lösningen till det nya fallet!'),
            el('p','','Kan du säga varför båda spåren passar? Berätta gärna med egna ord.'));
          const help=el('details','treasure-transfer-why');
          help.append(el('summary','','Visa förklaringen om du vill'),
            el('p','treasure-mystery-feedback',next.feedback||''));
          transfer.append(help);
        }else{
          const choices=el('div','treasure-proof-choices');
          choices.setAttribute('role','group');
          choices.setAttribute('aria-label','Välj det svar som passar båda spåren');
          for(const choice of next.choices){
            const tried=next.wrong.includes(choice.id);
            const button=action(el,choice.label+(tried?' – redan provat':''),'treasureMysteryTransfer',choice.id);
            button.className='treasure-proof-choice'+(tried?' treasure-mystery-tried':'');
            button.disabled=tried;
            choices.append(button);
          }
          transfer.append(choices);
          if(next.feedback){
            const feedback=el('p','treasure-mystery-feedback');
            feedback.setAttribute('role','status');
            feedback.textContent='Titta på båda spåren. '+next.feedback+' Prova ett annat svar.';
            transfer.append(feedback);
          }
        }
        transfer.append(el('p','treasure-mystery-note','Ett frivilligt nytt fall. Du får försöka igen i din egen takt. Inga skatter eller stjärnor påverkas.'));
        box.append(transfer);
      }
    }else if(story.revealed<3){
      box.append(el('p','','Du har '+story.revealed+' av 3 ledtrådar. Läs nästa för att få fler spår.'));
      box.append(action(el,'Visa ledtråd '+(story.revealed+1),'treasureMysteryReveal','',null,true));
    }else{
      box.append(el('p','treasure-mystery-prompt','Nu har du tre ledtrådar. Vilken plats passar dem tillsammans?'));
      const choices=el('div','treasure-mystery-choices');
      choices.setAttribute('role','group');choices.setAttribute('aria-label','Välj plats för mysteriet');
      for(const place of model.places){
        const tried=story.attempted.includes(place.index);
        const button=action(el,place.emoji+' '+place.name+(tried?' – redan provad':''),'treasureMysteryGuess',place.index);
        button.className='treasure-mystery-choice'+(tried?' treasure-mystery-tried':'');
        button.disabled=tried;
        choices.append(button);
      }
      box.append(choices);
      if(story.feedback){
        const feedback=el('p','treasure-mystery-feedback');
        feedback.setAttribute('role','status');
        feedback.textContent='Inte riktigt. '+story.feedback+' Läs de tre ledtrådarna och prova en annan plats.';
        box.append(feedback);
      }
    }
    box.append(el('p','treasure-mystery-note','Det finns ingen timer. Du får prova igen utan att förlora skatter eller ordstjärnor.'));
    return box;
  }
  function mapView(host,el,model,options,wordStars){
    const intro=el('header','treasure-map-heading');
    const copy=el('div');
    copy.append(el('p','treasure-world-name',model.emoji+' '+model.title));
    const title=el('h1','','Skattkartan');title.id='treasure-stage-title';title.tabIndex=-1;
    copy.append(title,el('p','',model.complete?'Här finns dina hittade skatter. Du kan besöka platserna igen.':'Läs ledtråden. Välj platsen som passar.'));intro.append(copy);
    const worlds=worldProgress(model,options,wordStars);
    if(worlds.length){
      const picker=el('div','treasure-world-picker'),label=el('label','','Byt karta');label.htmlFor='treasure-world';
      const select=el('select','field');select.id='treasure-world';select.dataset.treasureWorld='';
      for(const world of worlds){const option=el('option','',`${world.emoji} ${world.title} · ${world.count} av ${world.total} skatter`);option.value=world.id;option.selected=world.id===model.id;select.append(option);}
      picker.append(label,select);intro.append(picker);
    }
    host.append(intro,scoreStrip(el,model,wordStars),treasureTrail(el,model),secretLetter(el,model));
    const clue=el('section','treasure-clue');clue.setAttribute('aria-labelledby','treasure-clue-title');
    if(model.clue){
      const heading=el('h2','',`Ledtråd ${number(model.count)+1} av ${number(model.total)}`);heading.id='treasure-clue-title';
      clue.append(heading,el('p','treasure-clue-text',model.clue.text));
      const controls=el('div','treasure-controls');
      const hint=action(el,'💡 En ledtråd till','treasureHint');hint.setAttribute('aria-expanded',String(!!model.clue.hintShown));hint.setAttribute('aria-controls','treasure-hint');
      controls.append(...speech(el,'clue',options.canReadAloud),hint);clue.append(controls);
      const help=el('div','treasure-hint');help.id='treasure-hint';help.tabIndex=-1;help.setAttribute('role','status');help.hidden=!model.clue.hintShown;
      if(model.clue.hintShown)help.append(el('p','',model.clue.hint),clueParts(el,model.clue));
      clue.append(help);
    }else{
      completeMap(el,clue,model,worlds,wordStars);
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
    host.append(map,el('p','treasure-reassurance','Ta den tid du behöver. Dina fynd och stjärnor sparas här i webbläsaren.'));
    const mystery=mysteryCard(el,model,options);if(mystery)host.append(mystery);
    host.append(collection(el,model));
    if(worlds.length)host.append(mapBook(el,worlds,model.id));
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
      arrival.append(comparison,clueParts(el,model.clue),...speech(el,'arrival',options.canReadAloud,serial));
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
      if(reward.finderAdded){
        box.append(el('p','treasure-finder-earned','🧭 +1 sakletarpoäng. Du hittade platsen med hjälp av ledtråden.'));
        const fragment=model.letter?.fragments?.at(-1);
        if(fragment)box.append(el('p','treasure-letter-unlocked','✉️ Ny del av brevet: '+fragment));
      }
      else if(model.clue&&!visit.matched)box.append(el('p','','Det lilla fyndet ger ingen sakletarpoäng. Läs ledtråden igen och leta efter platsen som passar.'));
      else box.append(el('p','','Det här besöket ger ingen ny sakletarpoäng. Dina tidigare fynd finns kvar.'));
      if(reward.kind==='small'&&!reward.newItem)box.append(el('p','',reward.name+' från den här platsen finns redan i din samling.'));
      box.append(wordReward(el,model,options,wordStars));
      const label=visit.matched?(model.complete?'Se den färdiga kartan':'Till kartan och nästa ledtråd'):model.clue?'Till kartan – leta vidare':'Till kartan';
      box.append(action(el,label,'treasureBack','',serial,true));host.append(box,collection(el,model));
    }
    if(model.phase==='question')host.append(action(el,'Till kartan','treasureBack','',serial));
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
