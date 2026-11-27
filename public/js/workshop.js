/* Ordverkstaden: reconstruct an existing example, repair a story label,
 * and reflect. No grading of free language, new scenarios, or stored text. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenWorkshop=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const wordForm=value=>value.normalize('NFC').toLocaleLowerCase('sv-SE').replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}]+$/gu,'');
  const text=value=>typeof value==='string'?value.trim().replace(/\s+/gu,' '):'';
  const draw=(items,random)=>items[Math.min(items.length-1,Math.max(0,Math.floor(random()*items.length)))];
  function shuffle(items,random){
    const out=items.slice();
    for(let i=out.length-1;i>0;i--){
      const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));
      [out[i],out[j]]=[out[j],out[i]];
    }
    return out;
  }
  function chunks(item){
    const original=text(item?.example);
    if(!original||!item?.name)return [];
    let units=original.split(' ');
    if(item.kind==='expression'){
      // Never split the idiom itself, or guess an inflected form. An intact
      // example remains available in reflection even if building is skipped.
      const phrase=text(item.name).split(' ').map(wordForm);
      const at=units.findIndex((_,i)=>phrase.every((word,j)=>units[i+j]&&wordForm(units[i+j])===word));
      if(at<0)return [];
      units.splice(at,phrase.length,units.slice(at,at+phrase.length).join(' '));
    }
    if(units.length<3)return [];
    const count=Math.min(5,units.length),result=[];
    // Preserve each token and punctuation exactly, grouping adjacent words.
    // These are puzzle pieces, not a syntactic parse.
    for(let i=0,offset=0;i<count;i++){
      const size=Math.ceil((units.length-offset)/(count-i));
      result.push(units.slice(offset,offset+size).join(' '));offset+=size;
    }
    if(new Set(result).size<2)return [];
    return result;
  }
  function build(item,random=Math.random){
    const parts=chunks(item);
    if(!parts.length)return null;
    let pieces=shuffle(parts.map((label,id)=>({id,label})),random);
    // Do not start with the solution already assembled.
    if(pieces.map(piece=>piece.label).join(' ')===parts.join(' ')){
      const first=pieces.findIndex(piece=>piece.label!==pieces[0].label);
      if(first>0)[pieces[0],pieces[first]]=[pieces[first],pieces[0]];
    }
    return {type:'build',parts,pieces,original:parts.join(' ')};
  }
  function built(task,selected){
    if(task?.type!=='build'||!Array.isArray(selected)||
      new Set(selected).size!==selected.length||
      selected.some(id=>!Number.isInteger(id)||!task.pieces.some(piece=>piece.id===id)))return null;
    const sentence=selected.map(id=>task.pieces.find(piece=>piece.id===id).label).join(' ');
    const complete=selected.length===task.pieces.length;
    return {sentence,complete,same:complete&&sentence===task.original};
  }
  function repair(item,catalog,contrasts,random=Math.random){
    const pair=contrasts?.pairs?.find(p=>p.left===item.id||p.right===item.id);
    if(!pair)return null;
    const left=catalog.find(w=>w.id===pair.left),right=catalog.find(w=>w.id===pair.right);
    if(!left||!right)return null;
    const a=draw(pair.scenes.filter(s=>s.target===left.id),random);
    const b=draw(pair.scenes.filter(s=>s.target===right.id),random);
    if(!a||!b)return null;
    const given=draw([left,right],random);
    const scenes=shuffle([a,b],random).map(scene=>{
      const target=scene.target===left.id?left:right;
      return {id:scene.id,title:scene.title,text:scene.text,word:target.name,
        why:scene.why,difference:scene.difference,needsRepair:target.id!==given.id};
    });
    return {type:'repair',pairId:pair.id,given:given.name,scenes};
  }
  function plan(item,catalog,contrasts,random=Math.random){
    if(!item||!catalog.some(row=>row.id===item.id)||!text(item.example)||!text(item.definition))return null;
    return {item,steps:[build(item,random),repair(item,catalog,contrasts,random),{type:'reflect'}].filter(Boolean)};
  }
  function pick(catalog,contrasts,history,eligible,random=Math.random){
    const extensions=new Set(catalog.filter(item=>item.everyday===false).map(item=>item.id));
    const extensionPairs=new Set((contrasts?.pairs||[])
      .filter(pair=>extensions.has(pair.left)||extensions.has(pair.right))
      .flatMap(pair=>[pair.left,pair.right]));
    const everyday=catalog.filter(item=>item.everyday!==false&&!extensionPairs.has(item.id));
    const ready=everyday.filter(item=>eligible(item,history)||history?.recallProgress?.[item.id]);
    const pairs=new Set((contrasts?.pairs||[]).filter(p=>p.starter).flatMap(p=>[p.left,p.right]));
    const starter=everyday.filter(item=>pairs.has(item.id));
    return draw(ready.length?ready:starter.length?starter:everyday,random)||null;
  }
  return {chunks,build,built,repair,plan,pick};
});
