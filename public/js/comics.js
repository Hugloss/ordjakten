/* Bildserier byggda enbart av befintliga, fria ikoner. Ingen bildgenerering. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.OrdjaktenComics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const stages = Object.freeze([
    {key:'before',label:'1 • BERÄTTELSEN'},
    {key:'after',label:'2 • SÅ HÄNGER DET IHOP'},
    {key:'aha',label:'3 • UTTRYCKETS BETYDELSE'}
  ]);
  function validate(data, expressions) {
    const errors=[];
    if(!data || !data.stories || !data.iconPaths || !expressions || !Array.isArray(expressions.expressions)) return ['Ogiltig seriedata'];
    const ids=new Set(expressions.expressions.map(e=>e.id));
    for(const [id,story] of Object.entries(data.stories)) {
      if(!ids.has(id))errors.push(id+' finns inte i uttrycksbanken');
      if(!story || typeof story.takeaway!=='string' || story.takeaway.trim().length<15)errors.push(id+' saknar slutsats');
      for(const stage of stages){
        const icons=story && story[stage.key];
        if(!Array.isArray(icons)||icons.length<1||icons.length>3) {errors.push(id+' har fel antal bilder för '+stage.key);continue;}
        for(const icon of icons){
          const file=data.iconPaths[icon];
          if(typeof file!=='string'||!/^\.\/assets\/story-icons\/[0-9a-f-]+\.png$/.test(file))errors.push(id+' har bild utan godkänt lokalt bildspår: '+icon);
        }
      }
    }
    for(const id of ids)if(!data.stories[id])errors.push('Serie saknas för '+id);
    return errors;
  }
  function make(tag, className, value) {
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(value!==undefined)el.textContent=value;
    return el;
  }
  function renderAnimal(target,expression){
    if(!target)return false;
    target.replaceChildren();
    if(!expression?.animal||typeof document==='undefined')return false;
    const template=document.getElementById('quest-animal-template');
    const source=template?.content?.querySelector('svg');
    const animal=source&&[...source.children].find(node=>node.getAttribute('data-animal')===expression.animal);
    if(!animal)return false;
    const svg=source.cloneNode(false);
    svg.append(animal.cloneNode(true));
    target.append(svg);
    return true;
  }
  function render(target, expression, data) {
    if(!target||!expression)return false;
    target.replaceChildren();
    const story=data && data.stories && data.stories[expression.id];
    if(!story)return false;
    const track=make('div','comic-grid');
    stages.forEach((step,i)=>{
      const card=make('article','comic-panel');
      const count=make('span','comic-step',step.label);
      const art=make('div','comic-icons');
      art.setAttribute('aria-hidden','true');
      if(!(i===1&&renderAnimal(art,expression)))for(const icon of story[step.key]){
        const src=data.iconPaths[icon];
        const img=document.createElement('img');
        img.className='comic-icon';img.src=src;img.alt='';img.width=96;img.height=96;
        img.loading='lazy';img.decoding='async';
        // If an icon cannot be loaded (e.g. partial offline asset), keep the
        // meaning readable and render the existing Unicode symbol as fallback.
        img.addEventListener('error',()=>{
          const fallback=make('span','comic-icon-fallback',icon);
          fallback.setAttribute('aria-hidden','true');img.replaceWith(fallback);
        },{once:true});
        art.append(img);
      }
      const title=make('h4','comic-caption-title',i===2?'💡 Vad betyder uttrycket?':expression.reveal[i].title);
      const body=make('p','comic-caption',i===2?story.takeaway:expression.reveal[i].text);
      card.append(count,art,title,body);
      track.append(card);
    });
    target.append(track);
    return true;
  }
  return {stages,validate,render,renderAnimal};
});
