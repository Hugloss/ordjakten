/* Vardagskollen: a small game-mode view driven entirely by bank-neutral questions.
 * Does not touch word scores, stars, treasures or persisted child data. */
(function(root){
  'use strict';
  const $=id=>document.getElementById(id);
  const make=(tag,className,text)=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  function mount(){
    const host=$('vardagskollen');
    if(!host)return;
    const data=root.ORDJAKTEN_VARDAGSKUNSKAP;
    const Platform=root.OrdjaktenQuestionPlatform;
    const Sessions=root.OrdjaktenQuestionSession;
    const Bank=root.OrdjaktenVardagsBank;
    if(!data||!Platform||!Sessions||!Bank){
      $('vk-error').hidden=false;
      $('vk-error').textContent='Vardagsfrågorna kunde inte läsas in. Ladda gärna om sidan.';
      return;
    }
    let registry,provider;
    try{
      registry=Platform.createRegistry();
      provider=Bank.fromAuthored(data);
      registry.register(provider);
    }catch(error){
      $('vk-error').hidden=false;
      $('vk-error').textContent='Frågebanken kunde inte startas. Prova att ladda om sidan.';
      return;
    }
    let mode='train',session=null,topicId=null;
    let attempts=[];
    const picker=$('vk-picker'),stage=$('vk-game'),summary=$('vk-summary');
    const next=$('vk-next'),feedback=$('vk-feedback'),choices=$('vk-choices');
    function setMode(value){
      mode=value;
      $('vk-train').setAttribute('aria-pressed',String(value==='train'));
      $('vk-test').setAttribute('aria-pressed',String(value==='test'));
    }
    function reset(){
      session=null;topicId=null;attempts=[];
      picker.hidden=false;stage.hidden=true;summary.hidden=true;
      feedback.hidden=true;next.hidden=true;
    }
    function renderTopics(){
      const grid=$('vk-topics');
      grid.replaceChildren();
      for(const topic of provider.listTopics()){
        const button=make('button','vk-topic');
        button.type='button';
        const strong=make('strong','',topic.icon+' '+topic.name);
        const note=make('small','',topic.description);
        const count=make('span','vk-topic-count','6 frågor · lätt till klurigt');
        button.append(strong,note,count);
        button.setAttribute('aria-label',topic.name+', 6 frågor');
        button.addEventListener('click',()=>start(topic.id));
        grid.append(button);
      }
    }
    function start(id){
      const refs=provider.listTopicQuestionIds(id).map(qid=>({
        bankId:Bank.BANK_ID,id:qid,revision:provider.getQuestion(qid).ref.revision
      }));
      session=Sessions.create(registry,{mode,refs,seed:73,sessionId:'vardagskollen'});
      attempts=[];topicId=id;
      picker.hidden=true;stage.hidden=false;summary.hidden=true;
      $('vk-current-topic').textContent=provider.listTopics().find(t=>t.id===id).name;
      renderQuestion();
    }
    function renderQuestion(){
      const item=session.current();
      if(!item){finish();return;}
      const q=item.question;
      feedback.hidden=true;feedback.replaceChildren();next.hidden=true;
      $('vk-progress').textContent='Fråga '+(item.index+1)+' av '+item.total+
        (mode==='train'?' · Träna med förklaring':' · Testa dig');
      $('vk-stimulus').textContent=q.stimulus||'';
      $('vk-question').textContent=q.prompt;
      choices.replaceChildren();
      for(const option of q.responseSpec.options){
        const button=make('button','vk-choice',option.label);
        button.type='button';
        button.dataset.optionId=option.id;
        button.addEventListener('click',()=>answer(option.id));
        choices.append(button);
      }
      $('vk-question').focus({preventScroll:true});
    }
    function answer(optionId){
      if(!session||session.current()?.answered)return;
      const current=session.current();
      const result=session.answer(optionId);
      if(!result.accepted)return;
      attempts.push({ref:{...current.question.ref},selectedOptionId:optionId});
      for(const button of choices.querySelectorAll('button')){
        button.disabled=true;
        button.setAttribute('aria-pressed',String(button.dataset.optionId===optionId));
      }
      feedback.hidden=false;
      feedback.replaceChildren();
      if(mode==='train'){
        const original=registry.resolve(current.question.ref);
        const correct=original.responseSpec.options.find(o=>o.id===original.assessmentSpec.correctOptionId);
        const right=result.feedback.status==='correct';
        feedback.dataset.outcome=right?'right':'wrong';
        feedback.append(make('strong','',right?'✅ Du hittade rätt!':'💡 Bra att du provade!'));
        if(!right)feedback.append(make('p','', 'Ett passande svar är: '+correct.label+'.'));
        feedback.append(make('p','',original.explanation[0].text));
      }else{
        feedback.dataset.outcome='pending';
        feedback.append(make('p','','Svaret är sparat. Du får se facit och förklaring efter sista frågan.'));
      }
      next.hidden=false;
      next.textContent=current.index===current.total-1?'Visa sammanfattning →':'Nästa fråga →';
      next.focus({preventScroll:true});
    }
    function finish(){
      const result=session.finish();
      stage.hidden=true;summary.hidden=false;
      const topic=provider.listTopics().find(t=>t.id===topicId);
      $('vk-summary-title').textContent='Du utforskade '+topic.name.toLocaleLowerCase('sv-SE')+'!';
      $('vk-summary-note').textContent=mode==='train'?
        'Du tränade '+result.answered+' frågor. Ta med dig det nya du har förstått!':
        'Du hade '+result.correct+' av '+result.answered+' rätt. Läs varför svaren passar, även där du redan kunde svaret.';
      const review=$('vk-review');
      review.replaceChildren();
      for(let i=0;i<attempts.length;i++){
        const attempt=attempts[i],q=registry.resolve(attempt.ref);
        const choice=q.responseSpec.options.find(o=>o.id===attempt.selectedOptionId);
        const correct=q.responseSpec.options.find(o=>o.id===q.assessmentSpec.correctOptionId);
        const li=make('li','vk-review-card');
        li.append(make('strong','',q.prompt));
        li.append(make('p','', 'Ditt svar: '+choice.label));
        li.append(make('p','', 'Passande svar: '+correct.label));
        li.append(make('p','',q.explanation[0].text));
        review.append(li);
      }
      $('vk-summary-title').focus({preventScroll:true});
    }
    $('vk-train').addEventListener('click',()=>setMode('train'));
    $('vk-test').addEventListener('click',()=>setMode('test'));
    $('vk-exit').addEventListener('click',reset);
    $('vk-new').addEventListener('click',reset);
    $('vk-again').addEventListener('click',()=>start(topicId));
    next.addEventListener('click',()=>{
      if(!session?.current()?.answered)return;
      session.next();renderQuestion();
    });
    renderTopics();reset();setMode('train');
  }
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
    else mount();
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={mount};
})(typeof globalThis!=='undefined'?globalThis:this);
