'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const Treasure=require('../public/js/treasure-hunt-data');
const A=require('../public/js/adventures');
const Story=require('../public/js/story-quests');
const Missions=require('../public/js/world-missions');
const L=require('../public/js/learning-map');
const bank=require('../public/data/ordbank.json');
const expressions=require('../public/data/expressions.json');

test('every existing map place has its own clue, visible description, help and explanation',()=>{
  assert.deepEqual(Object.keys(Treasure.DATA),A.WORLD_IDS);
  const descriptions=[],clues=[];
  for(const world of A.WORLD_IDS){
    const places=A.world(world).stops,rows=Treasure.DATA[world];
    assert.equal(rows.length,places.length,world);
    rows.forEach((row,index)=>{
      assert.deepEqual(Object.keys(row),['questionId','description','clue','lookFor','hint','why']);
      assert.equal(row.questionId,'treasure-place-'+world+'-'+String(index+1).padStart(2,'0'));
      for(const field of ['description','clue','hint','why']){
        const text=row[field];
        assert.equal(typeof text,'string',world+':'+index+':'+field);
        assert.ok(text.trim().length>=20,world+':'+index+':'+field);
        assert.ok(text.length<=200,world+':'+index+':'+field+' should fit a short reading step');
      }
      assert.ok(row.description.length<=110,world+':'+index+' map description');
      assert.ok(!row.clue.toLocaleLowerCase('sv').includes(places[index].name.toLocaleLowerCase('sv')),
        world+':'+index+' clue should describe its destination without naming the button');
      descriptions.push(row.description);clues.push(row.clue);
    });
  }
  assert.equal(descriptions.length,48);
  assert.equal(new Set(descriptions).size,48);
  assert.equal(new Set(clues).size,48);
});

test('every clue offers two short comparison features without naming a destination',()=>{
  let count=0;
  for(const world of A.WORLD_IDS){
    const destinationNames=A.world(world).stops.map(place=>place.name.toLocaleLowerCase('sv'));
    const pairs=new Set();
    Treasure.DATA[world].forEach((row,index)=>{
      const key=world+':'+index;
      assert.ok(Array.isArray(row.lookFor),key);
      assert.equal(row.lookFor.length,2,key+' should split the clue into two reading steps');
      const normalized=row.lookFor.map(feature=>{
        assert.equal(typeof feature,'string',key);
        assert.equal(feature,feature.trim(),key);
        assert.ok(feature.length>=3&&feature.length<=60,key+' comparison phrase length');
        assert.ok(!/[.!?\n]/u.test(feature),key+' should remain a short phrase');
        const text=feature.toLocaleLowerCase('sv');
        for(const name of destinationNames)
          assert.ok(!text.includes(name),key+' comparison should describe rather than name a place');
        return text;
      });
      assert.equal(new Set(normalized).size,2,key+' needs two different features');
      pairs.add([...normalized].sort().join('|'));
      count++;
    });
    assert.equal(pairs.size,4,world+' needs a distinct pair for each destination');
  }
  assert.equal(count,48);
});

test('every clue destination reuses a valid existing word task and keepsake',()=>{
  const words=L.catalog(bank,expressions,{});
  const content=Missions.catalog(words,Story);
  assert.deepEqual(content.errors,[]);
  for(const [world,rows] of Object.entries(Treasure.DATA)){
    rows.forEach((row,index)=>{
      const task=content.tasks[world+':'+index];
      assert.ok(task,world+':'+index+' must retain its existing place task');
      assert.ok(bank.words.some(word=>word.id===task.target));
      assert.equal(task.options.filter(option=>option.correct).length,1);
      assert.ok(Story.DATA[world][index][4]);
    });
  }
});

test('common finds have readable names distinct from the existing special treasures',()=>{
  assert.deepEqual(Object.keys(Treasure.SMALL_FINDS),A.WORLD_IDS);
  const special=new Set(Object.values(Story.DATA).flatMap(rows=>rows.map(row=>row[4])));
  const names=[];
  for(const item of Object.values(Treasure.SMALL_FINDS)){
    assert.ok(item.emoji&&item.name);
    assert.ok(item.name.length<=25);
    assert.ok(!special.has(item.name));
    names.push(item.name);
  }
  assert.equal(new Set(names).size,12);
});

test('similar music locations expose the distinction used by their clues',()=>{
  const rows=Treasure.DATA.music;
  assert.match(rows[0].description,/ensam musiker.*notblad/);
  assert.match(rows[0].clue,/ensam.*noter/);
  assert.match(rows[3].description,/grupp musiker.*mikrofon/);
  assert.match(rows[3].clue,/grupp musiker.*mikrofon/);
  assert.ok(rows[0].lookFor.some(feature=>feature.includes('ensam musiker')));
  assert.ok(rows[0].lookFor.some(feature=>feature.includes('noter')));
  assert.ok(rows[3].lookFor.some(feature=>feature.includes('grupp musiker')));
  assert.ok(rows[3].lookFor.some(feature=>feature.includes('mikrofon')));
  assert.ok(!rows[3].description.includes('ensam'));
  assert.ok(!rows[0].description.includes('mikrofon'));
});

test('all twelve new cases have independent two-clue evidence and feedback for partial matches',()=>{
  assert.deepEqual(Object.keys(Treasure.TRANSFERS),A.WORLD_IDS);
  const titles=new Set(),intros=new Set();
  for(const id of A.WORLD_IDS){
    const task=Treasure.TRANSFERS[id];
    assert.ok(task.title.length>=10&&task.title.length<=80,id);
    assert.ok(task.intro.length>=20&&task.intro.length<=180,id);
    assert.equal(task.clues.length,2,id);
    assert.equal(new Set(task.clues).size,2,id);
    assert.ok(task.clues.every(clue=>clue.length>=20&&clue.length<=140),id);
    assert.equal(task.choices.length,3,id);
    assert.equal(new Set(task.choices).size,3,id);
    assert.ok(task.choices.every(choice=>choice.length>=20&&choice.length<=175),id);
    assert.ok(Number.isInteger(task.target)&&task.target>=0&&task.target<3,id);
    assert.equal(task.wrong.length,3,id);
    task.wrong.forEach((feedback,index)=>{
      if(index===task.target)assert.equal(feedback,null,id);
      else assert.ok(feedback.length>=20&&feedback.length<=200,id);
    });
    assert.ok(task.why.length>=30&&task.why.length<=200,id);
    assert.ok(Object.isFrozen(task.clues)&&Object.isFrozen(task.choices)&&Object.isFrozen(task.wrong),id);
    titles.add(task.title);intros.add(task.intro);
  }
  assert.equal(titles.size,12);assert.equal(intros.size,12);
});

test('mystery storytelling is consistent and avoids naming the answer in headings',()=>{
  assert.doesNotMatch(Treasure.MYSTERIES.dinosaurs.title,/anteckning/i,
    'the scientist finds a stone, not a lost written note');
  assert.doesNotMatch(Treasure.MYSTERIES.unicorn.title,/bron|regnbåge/i,
    'the title must not tell the child which place solves the mystery');
  const garden=Treasure.TRANSFERS.garden;
  assert.doesNotMatch([...garden.clues,...garden.choices,garden.why].join(' '),/varje dag/i,
    'watering every day is not a universal rule for plants');
});

test('the offline browser export contains the same immutable authored content',()=>{
  const context=vm.createContext({});
  vm.runInContext(fs.readFileSync(require.resolve('../public/js/treasure-hunt-data'),'utf8'),context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.OrdjaktenTreasureData)),JSON.parse(JSON.stringify(Treasure)));
  assert.ok(Object.isFrozen(Treasure.DATA));
  assert.ok(Object.isFrozen(Treasure.DATA.forest));
  assert.ok(Object.isFrozen(Treasure.DATA.forest[0]));
  for(const rows of Object.values(Treasure.DATA))
    for(const row of rows)assert.ok(Object.isFrozen(row.lookFor));
});

test('each map has four short authored letter fragments',()=>{
 assert.deepEqual(Object.keys(Treasure.LETTER_FRAGMENTS),A.WORLD_IDS);
 for(const id of A.WORLD_IDS){const parts=Treasure.LETTER_FRAGMENTS[id];assert.equal(parts.length,4);
  for(const part of parts)assert.ok(part.length>=25&&part.length<=120&&!/[<>]/.test(part));
  assert.equal(new Set(parts).size,4);}
});

test('all twelve context mysteries have concrete clues and feedback for each wrong place',()=>{
  assert.deepEqual(Object.keys(Treasure.MYSTERIES),A.WORLD_IDS);
  for(const [id,m] of Object.entries(Treasure.MYSTERIES)){
    assert.ok(m.title.length>=8&&m.intro.length>=20);
    assert.equal(m.clues.length,3);assert.equal(m.wrong.length,4);
    assert.ok(Number.isInteger(m.target)&&m.target>=0&&m.target<4);
    for(const clue of m.clues)assert.ok(clue.length>=20&&clue.length<=140);
    m.wrong.forEach((feedback,index)=>{
      if(index===m.target)assert.equal(feedback,null);
      else assert.ok(typeof feedback==='string'&&feedback.length>=25&&feedback.length<=200);
    });
    assert.ok(m.why.length>=25);
  }
});
