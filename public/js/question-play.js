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
    context:'Läs berättelsen igen. Vad händer? Leta efter något i texten som visar hur saken, personen eller situationen är.',
    reverse:'Läs betydelsen långsamt. Tänk på vilket ord som skulle passa in i en egen mening.',
    picture:'Titta på en bild i taget. Vilken detalj i bilden passar bäst med ordet?',
    sentence:'Läs meningarna en i taget. Tänk på vilken mening där uttrycket faktiskt passar.',
    expression:'Tänk på hela uttrycket och berättelsen, inte bara ett ord i taget.',
    meaning:'Tänk på en egen situation där du har hört ordet. Jämför sedan alternativen.'
  };
  function plan(settings,q,index=0){
    const world=Object.hasOwn(WORLDS,settings?.adventure)?WORLDS[settings.adventure]:WORLDS.forest;
    const enabled=!!q&&settings?.difficulty!=='exam'&&q.taskType!=='order'&&
      ['train','test'].includes(settings?.mode)&&Array.isArray(q.options)&&q.options.length>=2;
    const kind=q?.taskType==='context'?'context':q?.taskType==='reverse'?'reverse':
      q?.taskType==='sentence'?'sentence':q?.kind==='expression'?'expression':q?.picture?'picture':'meaning';
    // Explicitly timed rounds keep a compact, ordinary answer interaction.
    const interactive=enabled&&settings.timerMode==='off';
    return {enabled:interactive,egg:interactive&&settings.mode==='train',world,hint:HINTS[kind],
      caption:index%2===0?'För svaret genom porten!':'Vilket svar tar dig vidare?'};
  }
  function moved(x0,y0,x,y){return Math.hypot(x-x0,y-y0)>=8;}
  function inside(rect,x,y){return !!rect&&rect.width>0&&rect.height>0&&
    Number.isFinite(x)&&Number.isFinite(y)&&x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom;}
  function validDrop(drag,token,rect,x,y,optionCount){
    return !!drag&&drag.token===token&&drag.moved===true&&
      Number.isInteger(drag.index)&&drag.index>=0&&drag.index<optionCount&&inside(rect,x,y);
  }
  return {WORLDS,HINTS,plan,moved,inside,validDrop};
});
