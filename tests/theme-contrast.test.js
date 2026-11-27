'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {WORLD_IDS}=require('../public/js/adventures');
const root=path.resolve(__dirname,'../public');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sheets=[...html.matchAll(/<link rel="stylesheet" href="\.\/([^"]+)"/g)]
  .map(match=>fs.readFileSync(path.join(root,match[1]),'utf8'));

// This is a palette regression, not a browser/CSS engine. It covers authored
// theme attributes and the explicit text/control patterns below in production
// stylesheet order. It excludes forced-colors, layout and decorative SVG art.
function split(value,separator=','){
  const parts=[];let start=0,depth=0;
  for(let i=0;i<value.length;i++){
    if(value[i]==='('||value[i]==='[')depth++;
    if(value[i]===')'||value[i]===']')depth--;
    if(value[i]===separator&&!depth){parts.push(value.slice(start,i).trim());start=i+1;}
  }
  parts.push(value.slice(start).trim());return parts;
}
function parseRules(css){
  const result=[];css=css.replace(/\/\*[\s\S]*?\*\//g,'');
  let offset=0;
  while(offset<css.length){
    const open=css.indexOf('{',offset);if(open<0)break;
    const header=css.slice(offset,open).trim();let end=open+1,depth=1;
    for(;end<css.length&&depth;end++){if(css[end]==='{')depth++;if(css[end]==='}')depth--;}
    const body=css.slice(open+1,end-1);offset=end;
    if(header.startsWith('@')){
      if(header.startsWith('@media')&&!header.includes('forced-colors'))result.push(...parseRules(body));
      continue;
    }
    const declarations=split(body,';').filter(Boolean).map(row=>{
      const colon=row.indexOf(':');
      return {name:row.slice(0,colon).trim(),value:row.slice(colon+1).replace(/!important/g,'').trim(),important:row.includes('!important')};
    });
    for(const selector of split(header))result.push({selector,declarations});
  }
  return result;
}
const rules=sheets.flatMap(parseRules);
function specificity(selector){
  const simple=selector.replace(/:not\(([^()]*)\)/g,'$1');
  const attributes=simple.match(/\[[^\]]*\]/g)||[];
  const rest=simple.replace(/\[[^\]]*\]/g,'');
  return (rest.match(/#[\w-]+/g)||[]).length*1000000+
    (attributes.length+(rest.match(/\.[\w-]+|:[\w-]+/g)||[]).length)*1000+
    (rest.replace(/[#.:][\w-]+/g,'').match(/(?:^|[\s>+~])[a-z][\w-]*/gi)||[]).length;
}
function cascade(matches){
  const result={},priority={};
  for(const rule of rules){
    if(!matches(rule.selector))continue;
    for(const declaration of rule.declarations){
      const rank=(declaration.important?1000000000:0)+specificity(rule.selector);
      if(rank<(priority[declaration.name]??-1))continue;
      result[declaration.name]=declaration.value;priority[declaration.name]=rank;
    }
  }
  return result;
}
function palette(theme,contrast,world){
  const attributes={'data-theme':theme,'data-contrast':contrast,'data-adventure':world};
  return cascade(selector=>{
    if(selector===':root'||selector==='html')return true;
    if(!/^html(?:\[[^\]]+\])+$/.test(selector))return false;
    return [...selector.matchAll(/\[([^=\]]+)(?:=['"]?([^'"\]]+)['"]?)?\]/g)]
      .every(([,name,value])=>name in attributes&&(value===undefined||attributes[name]===value));
  });
}
function resolve(value,variables){
  for(let i=0;i<12&&value.includes('var(');i++)value=value.replace(/var\((--[\w-]+)(?:,\s*([^()]+))?\)/g,
    (_,name,fallback)=>variables[name]??fallback??assert.fail('Missing color token '+name));
  assert.ok(!value.includes('var('),'Unresolved color '+value);return value;
}
function color(value){
  if(value==='transparent')return [0,0,0,0];
  if(value.startsWith('#')){
    let hex=value.slice(1);if(hex.length===3)hex=[...hex].map(c=>c+c).join('');
    return [0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255).concat(1);
  }
  const match=value.match(/^rgba?\(([^)]+)\)$/);assert.ok(match,'Unsupported color '+value);
  const channels=match[1].split(',').map(Number);
  return channels.slice(0,3).map(c=>c/255).concat(channels[3]??1);
}
const blend=(front,back,alpha=front[3])=>front.slice(0,3).map((value,i)=>value*alpha+back[i]*(1-alpha)).concat(1);
function backgrounds(value,behind){
  let result=behind;
  for(const layer of split(value).reverse()){
    let stops;
    if(layer.startsWith('linear-gradient(')){
      stops=(layer.match(/#[0-9a-f]{3,8}\b|rgba?\([^()]+\)|\btransparent\b/gi)||[]).map(color);
      const samples=stops.slice();
      for(let i=1;i<stops.length;i++)for(const t of [.25,.5,.75])
        samples.push(stops[i].map((channel,j)=>channel*t+stops[i-1][j]*(1-t)));
      stops=samples;
    }else stops=[color(layer)];
    result=stops.flatMap(stop=>result.map(back=>blend(stop,back)));
  }
  return result;
}
function luminance(rgb){
  return rgb.slice(0,3).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4)
    .reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
}
function ratio(foreground,background){
  const a=luminance(foreground),b=luminance(background);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
function styles(patterns,variables){
  return Object.fromEntries(Object.entries(cascade(selector=>patterns.includes(selector)))
    .map(([name,value])=>[name,resolve(value,variables)]));
}
function textRatio(chain,variables){
  let ink=color(variables['--text']),paper=[color(variables['--page'])];const layers=[];
  for(const patterns of chain){
    const style=styles(patterns,variables);layers.push({style,behind:paper});
    paper=backgrounds(style.background||'transparent',paper);
    if(style.color&&style.color!=='inherit')ink=color(style.color);
  }
  let pairs=paper.map(background=>({foreground:ink,background}));
  for(const {style,behind} of layers.reverse()){
    const brightness=Number(style.filter?.match(/brightness\(([\d.]+)\)/)?.[1]||1);
    pairs=pairs.map(pair=>Object.fromEntries(Object.entries(pair).map(([key,rgb])=>
      [key,rgb.slice(0,3).map(c=>Math.min(1,c*brightness)).concat(1)])));
    const opacity=Number(style.opacity??1);
    if(opacity!==1)pairs=pairs.flatMap(pair=>behind.map(back=>({
      foreground:blend(pair.foreground,back,opacity),background:blend(pair.background,back,opacity)})));
  }
  return Math.min(...pairs.map(pair=>ratio(pair.foreground,pair.background)));
}
const modes=WORLD_IDS.flatMap(world=>['light','dark'].flatMap(theme=>['normal','high'].map(contrast=>({
  name:world+'/'+theme+'/'+contrast,variables:palette(theme,contrast,world),contrast
}))));

test('all twelve worlds retain readable text palettes in both themes and contrast modes',()=>{
  assert.equal(WORLD_IDS.length,12);assert.equal(modes.length,48);
  for(const {name,variables:v} of modes){
    for(const background of ['--page','--surface','--surface-2','--accent-soft']){
      assert.ok(ratio(color(v['--text']),color(v[background]))>=7,name+' main text on '+background);
      assert.ok(ratio(color(v['--muted']),color(v[background]))>=4.5,name+' supporting text on '+background);
    }
    assert.ok(ratio(color(v['--world-color']),color(v['--surface']))>=4.5,name+' world label on panel');
  }
});

test('high contrast overrides every light world tint without removing its decorative accent',()=>{
  for(const world of WORLD_IDS)for(const theme of ['light','dark']){
    const high=palette(theme,'high',world),normal=palette(theme,'normal',world);
    assert.equal(high['--world-wash'],'transparent',world+'/'+theme);
    assert.equal(high['--world-color'],normal['--world-color']);
  }
});

test('world text surfaces stay opaque and readable above bright or dark scenery',()=>{
  const patterns=[['.adventure-intro'],['.adventure-journey'],['.journey-stop','.journey-stop.reached'],
    ['.adventure-milestone'],['.story-card'],['.story-place',".story-place[data-state='visited']"],
    ['.story-earned'],['.mission-scene'],['.camp-mini-stage'],
    ['.story-quest-option','.story-quest-option:hover'],['.camp-theatre-choice','.camp-theatre-choice:hover'],
    ['.camp-live-object',".camp-live-object[aria-pressed='true']","#view-camp button[aria-pressed='true']"],
    ['.camp-mini-tile',".camp-mini-tile[aria-pressed='true']","#view-camp button[aria-pressed='true']"]];
  for(const {name,variables:v} of modes)for(const pattern of patterns){
    const style=styles(pattern,v);
    const light=backgrounds(style.background,[color('#ffffff')]),dark=backgrounds(style.background,[color('#000000')]);
    assert.deepEqual(light,dark,name+' opaque '+pattern.join(', '));
    assert.ok(Math.min(...light.map(bg=>ratio(color(v['--text']),bg)))>=7,name+' text on '+pattern[0]);
  }
});

test('locked controls and their helper text keep readable contrast instead of fading',()=>{
  const panel=['.panel'],disabled=['button','button:disabled'];
  const cases=[
    ['primary',[panel,[...disabled,'.primary-button','.primary-button:disabled']]],
    ['guided previous',[['.guided-reading'],[...disabled,'.secondary-button','.secondary-button:disabled','.guided-actions button','.guided-actions button:disabled']]],
    ['order undo',[panel,[...disabled,'.mission-order-controls button','.mission-order-controls button:disabled']]],
    ['quest help',[panel,[...disabled,'.quest-card','.quest-card:disabled'],['.quest-card small']]],
    ['next step',[panel,[...disabled,'.next-step-button','.next-step-button:disabled']]],
    ['practice goal',[panel,[...disabled,'.practice-goals button','.practice-goals button:disabled'],['.practice-goals small']]],
    ['focus order',[panel,[...disabled,'.focus-choice']]],
    ['locked book',[panel,[...disabled,'.book-tile','.book-tile:disabled']]],
    ['primary hover',[panel,['button','.primary-button','button:not(:disabled):hover','.primary-button:not(:disabled):hover']]]
  ];
  for(const {name,variables:v} of modes)for(const [label,chain] of cases){
    const measured=textRatio(chain,v);
    assert.ok(measured>=4.5,`${name} ${label}: ${measured.toFixed(2)}:1`);
  }
});

test('right, wrong and unanswered feedback remain readable after controls are locked',()=>{
  const cases=[
    [['.reading-check'],['button','button:disabled','.reading-option','.reading-option:disabled',".reading-option[data-correct='true']"]],
    [['.reading-check'],['button','button:disabled','.reading-option','.reading-option:disabled',".reading-option[data-wrong='true']"]],
    [['.bonus-question'],['button','button:disabled','.bonus-answer','.bonus-answer[disabled]','.bonus-answer.is-right']],
    [['.panel'],['button','button:disabled','.mission-choice','.mission-choice:disabled','.mission-choice.is-wrong']],
    [['.feedback-status']],
    [['.feedback-status','.feedback-status[data-outcome="wrong"]']],
    [['.feedback-status','.feedback-status[data-outcome="unanswered"]']],
    [['.focus-verdict']],
    [['.focus-verdict',".focus-verdict[data-outcome='wrong']"]]
  ];
  for(const {name,variables:v} of modes)for(const chain of cases){
    const measured=textRatio(chain,v);
    assert.ok(measured>=4.5,`${name} ${chain.at(-1).at(-1)}: ${measured.toFixed(2)}:1`);
  }
});
