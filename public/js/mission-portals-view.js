/* Keyboard-friendly themed discovery: no animation, countdown or score.
 * Views use textContent only. Future stages and correct keys stay in the model. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenPortalsView=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function node(doc,tag,className='',value=''){
    const el=doc.createElement(tag);
    el.className=className;el.textContent=value;return el;
  }
  function button(doc,label,key,value=''){
    const el=node(doc,'button','portal-button',label);
    el.type='button';el.dataset[key]=String(value);return el;
  }
  function listen(doc,enabled){
    if(!enabled)return [];
    const b=button(doc,'🔊 Lyssna på scenen och spåren','portalListen');
    b.id='portal-listen';b.setAttribute('aria-pressed','false');
    const status=node(doc,'p','portal-speech-status');
    status.id='portal-listen-status';status.hidden=true;status.setAttribute('role','status');
    return [b,status];
  }
  function path(doc,current){
    const list=node(doc,'ol','portal-journey');
    for(let i=0;i<3;i++){
      const finished=current.step===3||i<current.step||i===current.step&&current.stage?.solved;
      const item=node(doc,'li','portal-journey-step'+(finished?' portal-journey-finished':i===current.step?' portal-journey-current':''));
      item.append(node(doc,'span','portal-step-symbol',finished?'✓':String(i+1)),
        node(doc,'span','',finished?'Avklarat':i===current.step?'Du är här':'Väntar'));
      list.append(item);
    }
    list.setAttribute('aria-label','Äventyrets tre uppdrag');
    return list;
  }
  function gallery(host,doc,model,options){
    const heading=node(doc,'h1','', '🗺️ Upptäckarklubben');
    heading.id='portal-title';heading.tabIndex=-1;
    host.append(heading,node(doc,'p','portal-intro','Välj ett äventyr. Följ spåren, upptäck platser och lös gåtor i din egen takt. Alla äventyr är öppna från början.'));
    const count=node(doc,'p','portal-progress',`🎒 ${model.doneCount} av ${model.entries.length} upptäckarfynd samlade`);
    count.setAttribute('role','status');host.append(count);
    const selected=['mystery','fantasy','explore','creative'].includes(options.category)?options.category:'all';
    const categories=[['all','Alla äventyr'],['mystery','🔎 Mysterier'],['fantasy','✨ Fantasivärldar'],
      ['explore','🧭 Upptäcktsresor'],['creative','🎨 Skapa och klura']];
    const filters=node(doc,'div','portal-filters');
    filters.setAttribute('role','group');filters.setAttribute('aria-label','Välj vilken sorts äventyr du vill se');
    for(const [id,label] of categories){
      const count=id==='all'?model.entries.length:model.entries.filter(row=>row.group===id).length;
      const control=button(doc,label+' · '+count,'portalFilter',id);
      control.id='portal-filter-'+id;
      control.className='portal-filter'+(selected===id?' portal-filter-selected':'');
      control.setAttribute('aria-pressed',String(selected===id));filters.append(control);
    }
    host.append(filters);
    const shown=model.entries.filter(row=>selected==='all'||row.group===selected);
    const chosenCount=node(doc,'p','portal-filter-count',`Visar ${shown.length} av ${model.entries.length} äventyr`);
    chosenCount.setAttribute('role','status');host.append(chosenCount);
    const grid=node(doc,'div','portal-grid');
    for(const row of shown){
      const item=button(doc,'','portalOpen',row.id);
      item.className='portal-card'+(row.done?' portal-card-done':'');
      const icon=node(doc,'span','portal-card-icon',row.emoji);icon.setAttribute('aria-hidden','true');
      const title=node(doc,'strong','portal-card-title',row.title);
      const body=node(doc,'span','portal-card-intro',row.intro);
      const status=node(doc,'span','portal-card-progress',row.done?
        '✓ Uppdrag klart · '+row.keepsake.name:`${row.count} av 3 spår lösta`);
      item.append(icon,title,body,status);grid.append(item);
    }
    host.append(grid);
    const info=node(doc,'p','portal-note','Det finns ingen timer eller poängjakt. Du kan be om hjälp, prova igen och fortsätta senare. Dina fynd sparas bara i den här webbläsaren.');
    host.append(info);
  }
  function adventure(host,doc,model,options){
    const current=model.current;
    const back=button(doc,'← Till alla äventyr','portalBack');
    back.classList.add('portal-back');host.append(back);
    const header=node(doc,'header','portal-header');
    const icon=node(doc,'span','portal-hero-icon',current.emoji);icon.setAttribute('aria-hidden','true');
    const copy=node(doc,'div','portal-header-copy');
    const title=node(doc,'h1','',current.title);title.id='portal-title';title.tabIndex=-1;
    copy.append(node(doc,'p','portal-eyebrow','UPPTÄCKARKLUBBEN'),title,
      node(doc,'p','portal-intro',current.intro));
    header.append(icon,copy);host.append(header,path(doc,current));
    if(current.done){
      const box=node(doc,'section','portal-finish');
      box.append(node(doc,'span','portal-finish-icon',current.keepsake.emoji),
        node(doc,'h2','','🎉 Du klarade äventyret!'),
        node(doc,'p','',current.ending),
        node(doc,'p','portal-keepsake','🎒 Nytt fynd i upptäckarboken: '+current.keepsake.name));
      const again=button(doc,'Välj ett nytt äventyr','portalBack');
      again.classList.add('portal-main-button');
      box.append(again);host.append(box);
      return;
    }
    const stage=current.stage;
    const section=node(doc,'section','portal-scene');
    const heading=node(doc,'h2','',`Del ${current.step+1} av 3 · ${stage.title}`);
    heading.id='portal-stage-title';heading.tabIndex=-1;
    section.append(heading,node(doc,'p','portal-story',stage.scene));
    const clues=node(doc,'ol','portal-clues');
    for(const [i,clue] of stage.clues.entries()){
      const li=node(doc,'li','portal-clue');
      li.append(node(doc,'strong','',`Spår ${i+1}`),node(doc,'span','',clue));
      clues.append(li);
    }
    section.append(clues,...listen(doc,options.canReadAloud));
    if(stage.solved){
      const success=node(doc,'div','portal-success');
      success.append(node(doc,'h3','','✓ Du hittade lösningen!'),
        node(doc,'p','',stage.feedback),
        node(doc,'p','portal-own-words','Kan du säga varför? Prova: ”Jag valde det här därför att … och …”'));
      section.append(success);
      const next=button(doc,current.step===2?'🎒 Se ditt upptäckarfynd':'Fortsätt äventyret','portalNext');
      next.classList.add('portal-main-button');section.append(next);
    }else{
      section.append(node(doc,'h3','','Vilket svar passar båda spåren?'));
      const choices=node(doc,'div','portal-choices');choices.setAttribute('role','group');
      choices.setAttribute('aria-label','Välj det svar som passar båda ledtrådarna');
      for(const row of stage.choices){
        const choice=button(doc,(row.position+1)+'. '+row.label+(row.tried?' – redan provat':''),'portalAnswer',row.index);
        choice.classList.add('portal-choice');
        choice.disabled=row.tried;choices.append(choice);
      }
      section.append(choices);
      if(stage.feedback){
        const feedback=node(doc,'p','portal-feedback','Läs båda spåren igen. '+stage.feedback+' Prova ett annat svar.');
        feedback.id='portal-feedback';feedback.tabIndex=-1;feedback.setAttribute('role','status');section.append(feedback);
      }
      if(!stage.hint){
        const help=button(doc,'💡 Hjälp mig jämföra','portalHint');section.append(help);
      }else{
        const help=node(doc,'div','portal-hint');
        help.setAttribute('role','status');
        help.append(node(doc,'strong','','Så kan du tänka:'),
          node(doc,'p','','Läs det första spåret. Hitta svaren där det stämmer. Läs sedan det andra spåret. Ett svar behöver passa båda.'));
        section.append(help);
      }
    }
    section.append(node(doc,'p','portal-note','Du får tänka så länge du vill. Ett felval tar inte bort något fynd.'));
    host.append(section);
  }
  function render(host,model,options={}){
    if(!host)return;
    host.replaceChildren();
    if(!model){host.hidden=true;return;}
    host.hidden=false;host.className='portal-world';
    const doc=host.ownerDocument;
    if(!model.current)gallery(host,doc,model,options);
    else adventure(host,doc,model,options);
  }
  return {render};
});
