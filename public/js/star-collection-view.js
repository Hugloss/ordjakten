/* Readable, optional collection display. The reward model owns all scoring;
 * this renderer only turns its public view into text and ordinary controls. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenStarView=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const count=value=>Number.isSafeInteger(value)&&value>=0?value:0;
  const stars=value=>value===1?'stjärna':'stjärnor';
  function maker(host){
    return (tag,className='',text='')=>{
      const node=host.ownerDocument.createElement(tag);
      node.className=className;node.textContent=text;return node;
    };
  }
  function roundDisplay(host,round,mini=false){
    const el=maker(host),total=Math.min(25,count(round?.total));
    if(!round||!total)return null;
    const earned=Math.min(total,count(round.earned));
    const direct=Math.min(earned,count(round.direct));
    const practised=Math.min(earned-direct,count(round.practised));
    const box=el('div','star-round'+(mini?' star-round-mini':''));
    const title=el(mini?'p':'h3','star-round-title',earned===total
      ?'Alla stjärnor i din rad samlade!'
      :'Din stjärnrad');
    const amount=el('p','star-round-count',`${earned} av ${total} stjärnor samlade`);
    amount.setAttribute('role','status');amount.setAttribute('aria-live','polite');
    const list=el('ol','star-round-slots');list.setAttribute('aria-label','Din stjärnrad');
    for(let i=0;i<total;i++){
      const collected=i<earned;
      const item=el('li','star-slot'+(collected?' star-slot-earned':''));
      item.setAttribute('aria-label',`Stjärna ${i+1} av ${total}: ${collected?'samlad':'kvar att samla'}`);
      const icon=el('span','',collected?'★':'☆');icon.setAttribute('aria-hidden','true');
      item.append(icon);list.append(item);
    }
    box.append(title,amount,list);
    if(!mini){
      const note=practised>0
        ?`${direct} i första rundan · ${practised} i fortsatt träning.`
        :earned===total?'Du har hittat rätt på alla frågor i din stjärnrad.':
          'Du kan läsa förklaringen och fortsätta öva. Stjärnorna du redan har är kvar.';
      box.append(el('p','star-round-note',note));
    }
    return box;
  }
  function renderRound(host,round){
    if(!host)return;
    host.replaceChildren();
    const content=roundDisplay(host,round,true);
    host.hidden=!content;
    if(content)host.append(content);
  }
  function render(host,view,{round=null,compact=false}={}){
    if(!host)return;
    host.replaceChildren();host.hidden=!view||!Array.isArray(view.milestones);
    if(host.hidden)return;
    const el=maker(host),total=count(view?.total);
    const header=el('div','star-collection-header');
    const emblem=el('span','star-collection-emblem','★');emblem.setAttribute('aria-hidden','true');
    const heading=el('div','star-collection-heading');
    heading.append(el(compact?'h3':'h2','','Min stjärnsamling'),
      el('p','star-collection-total',`${total} ${stars(total)} ${total===1?'samlad':'samlade'}`));
    header.append(emblem,heading);host.append(header);
    if(!compact)host.append(el('p','star-collection-rules',
      'Ett rätt svar i ordjakten ger en stjärna. Varje fråga kan ge en stjärna, även när du övar vidare.'));
    const progress=el('div','star-collection-next');
    if(view?.next){
      const next=view.next,remaining=count(next.remaining);
      progress.append(el('strong','',`${remaining} ${stars(remaining)} kvar till ${next.title}`));
      const bar=el('progress','star-collection-meter');
      bar.setAttribute('max',String(Math.max(1,count(next.goal))));
      bar.setAttribute('value',String(Math.min(count(next.goal),count(next.progress))));
      bar.setAttribute('aria-label',`På väg till ${next.title}`);
      progress.append(bar);
    }else{
      progress.append(el('strong','','Alla samlingsmärken är dina!'),
        el('p','','Du kan fortsätta upptäcka ord och samla stjärnor i din egen takt.'));
    }
    host.append(progress);
    const milestones=Array.isArray(view?.milestones)?view.milestones.slice(0,6):[];
    const grid=el('ul','star-collection-grid');grid.setAttribute('aria-label','Dina samlingsmärken');
    for(const milestone of milestones){
      const item=el('li','star-collection-item'+(milestone.earned?' star-collection-earned':''));
      const icon=el('span','star-collection-icon',milestone.icon||'★');icon.setAttribute('aria-hidden','true');
      item.append(icon,el('strong','',String(milestone.title||'')),
        el('span','star-collection-state',milestone.earned?'Samlat ✓':`Vid ${count(milestone.at)} stjärnor`));
      if(milestone.description)item.append(el('small','',String(milestone.description)));
      grid.append(item);
    }
    if(compact){
      const details=el('details','star-collection-details');
      details.append(el('summary','',`Mina samlingsmärken · ${count(view?.completed)} av ${milestones.length}`),grid);
      host.append(details);
    }else host.append(grid);
    const roundContent=roundDisplay(host,round);
    if(roundContent)host.append(roundContent);
    const action=el('button','primary-button star-collection-action');action.type='button';
    const remaining=Array.isArray(round?.remaining)?round.remaining.length:0;
    if(remaining){
      action.dataset.starRecovery=String(round.roundId||'');
      action.textContent=round.earned>0
        ?remaining===1?'Samla den sista stjärnan →':`Samla de sista ${remaining} stjärnorna →`
        :`Fortsätt med ${remaining} ${remaining===1?'fråga':'frågor'} →`;
    }else{
      action.dataset.starStart='';action.textContent='⭐ Börja en ny stjärnrad · 5 ord →';
    }
    host.append(action,el('p','star-collection-reassurance','Ta den tid du behöver. Dina stjärnor finns kvar.'));
  }
  return {render,renderRound};
});
