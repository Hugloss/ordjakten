/* Optional reading support: split a short Swedish story into readable parts.
 * No data is sent outside the browser. Every original word is preserved. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenGuidedReading=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function partsFor(text,{target=38,maxParts=4,minChars=55}={}){
    if(typeof text!=='string')return [];
    const clean=text.trim().replace(/\s+/g,' ');
    if(!clean)return [];
    if(clean.length<minChars)return [clean];
    const max=Math.min(5,Math.max(2,Number.isInteger(maxParts)?maxParts:4));
    const goal=Math.min(90,Math.max(30,Number.isFinite(target)?target:38));
    const tokens=clean.split(' ');
    let chunks=[],buffer='';
    for(const token of tokens){
      const next=buffer?buffer+' '+token:token;
      if(buffer && next.length>goal+4 && buffer.length>=Math.floor(goal*0.65)){
        chunks.push(buffer);
        buffer=token;
      }else buffer=next;
      if(/[.!?][”"']?$/.test(token) && buffer.length>=22){
        chunks.push(buffer);buffer='';
      }
    }
    if(buffer)chunks.push(buffer);
    if(chunks.length>1 && chunks[chunks.length-1].length<13){
      chunks[chunks.length-2]+=' '+chunks.pop();
    }
    while(chunks.length>max){
      let smallest=Infinity,position=0;
      for(let i=0;i<chunks.length-1;i++){
        const size=chunks[i].length+chunks[i+1].length;
        if(size<smallest){smallest=size;position=i;}
      }
      chunks.splice(position,2,chunks[position]+' '+chunks[position+1]);
    }
    // Short scenes with just one long sentence: split at a word boundary.
    if(chunks.length===1 && clean.length>=minChars){
      let middle=-1,distance=Infinity;
      for(let i=0;i<clean.length;i++){
        if(clean[i]!==' ')continue;
        const delta=Math.abs(i-clean.length/2);
        if(i>=20 && clean.length-i-1>=20 && delta<distance){middle=i;distance=delta;}
      }
      if(middle!==-1)chunks=[clean.slice(0,middle),clean.slice(middle+1)];
    }
    return chunks;
  }
  return {partsFor};
});
