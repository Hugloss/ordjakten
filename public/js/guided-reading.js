/* Read a story in meaningful steps, not arbitrary word-count fragments.
 * The source story remains unchanged; no text is generated or transmitted. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenGuidedReading=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MIN_PIECE=22;
  const MAX_PIECES=4;
  // A cut immediately after one of these words produces a dangling phrase.
  const DANGLING=/\b(?:och|eller|att|som|med|utan|till|från|för|av|på|i|en|ett|den|det|de|om|så|var|kunde|kan|ska|har|hade)$/i;
  // Start the next card at a natural change in the story, not at an article.
  const CLAUSE_START=/\b(?:men|fast|eftersom|medan|innan|därefter|sedan|samtidigt|trots att|därför att|när|att)\b/gi;
  function boundaries(text,protectedPhrase){
    const found=new Map();
    function add(index,cost){
      if(index<=0||index>=text.length||text[index]!==' ')return;
      if(protectedPhrase){
        const phrase=protectedPhrase.toLocaleLowerCase('sv-SE');
        const low=text.toLocaleLowerCase('sv-SE');
        let from=0,i;
        while((i=low.indexOf(phrase,from))!==-1){
          if(index>i && index<i+phrase.length)return;
          from=i+1;
        }
      }
      const left=text.slice(0,index).trim();
      if(DANGLING.test(left))return;
      found.set(index,Math.min(cost,found.get(index)??Infinity));
    }
    for(let i=1;i<text.length;i++){
      if(text[i]!==' ')continue;
      // Sentence and clause punctuation create the best natural pauses.
      const previous=text.slice(0,i).trimEnd();
      if(/[.!?][”"']?$/.test(previous))add(i,0);
      else if(/[,;:][”"']?$/.test(previous))add(i,10);
    }
    for(const match of text.matchAll(CLAUSE_START)){
      const index=match.index;
      if(match[0].toLocaleLowerCase('sv-SE')==='att' &&
        !/(?:^|\s)så\s/i.test(text.slice(Math.max(0,index-32),index)))continue;
      if(index>0 && text[index-1]===' ')add(index-1,27);
    }
    if(protectedPhrase){
      const phrase=protectedPhrase.trim();
      if(phrase.length>=10 && phrase.length<=45 &&
         text.toLocaleLowerCase('sv-SE').startsWith(phrase.toLocaleLowerCase('sv-SE')) &&
         text[phrase.length]===' '){
        // Isolating the expression itself can be useful: it is one concept.
        const idx=phrase.length;
        found.set(idx,2);
      }
    }
    // For genuinely long single clauses, allow a restrained word-boundary
    // fallback. Short one-sentence stories are better kept together.
    if(text.length>=115){
      for(let i=1;i<text.length;i++){
        if(text[i]===' ')add(i,65);
      }
    }
    return [...found].map(([index,cost])=>({index,cost}));
  }
  function partsFor(text,{maxParts=MAX_PIECES,minChars=56,protectedPhrase=''}={}){
    if(typeof text!=='string')return [];
    const clean=text.trim().replace(/\s+/g,' ');
    if(!clean)return [];
    if(clean.length<Math.max(30,Number(minChars)||56))return [clean];
    const max=Math.min(MAX_PIECES,Math.max(2,Number.isInteger(maxParts)?maxParts:MAX_PIECES));
    const candidates=boundaries(clean,protectedPhrase);
    if(!candidates.length)return [clean];
    let pieces=[{start:0,end:clean.length}];
    const ideal=Math.max(44,Math.ceil(clean.length/Math.min(max,Math.max(2,Math.ceil(clean.length/75)))));
    while(pieces.length<max){
      let best=null;
      for(let section=0;section<pieces.length;section++){
        const {start,end}=pieces[section],length=end-start;
        if(length<minChars)continue;
        for(const item of candidates){
          const cut=item.index;
          if(cut<=start||cut>=end)continue;
          const left=cut-start,right=end-cut-1;
          const isProtectedPrefix=Boolean(protectedPhrase) && start===0 && cut===protectedPhrase.trim().length;
          if(left<(isProtectedPrefix?10:MIN_PIECE)||right<MIN_PIECE)continue;
          // Prefer natural sentence boundaries and readable, balanced parts.
          const score=item.cost + Math.abs(left-ideal)*0.34 + Math.abs(right-ideal)*0.18;
          // Avoid producing a needless extra card for already-short segments.
          if(item.cost>=60 && length<115)continue;
          if(!best||score<best.score)best={section,cut,score};
        }
      }
      if(!best)break;
      const {start,end}=pieces[best.section];
      pieces.splice(best.section,1,{start,end:best.cut},{start:best.cut+1,end});
    }
    return pieces.map(part=>clean.slice(part.start,part.end));
  }
  return {partsFor};
});
