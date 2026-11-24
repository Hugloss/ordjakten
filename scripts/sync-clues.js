'use strict';
const fs=require('node:fs');
const path=require('node:path');
const data=path.join(__dirname,'../public/data/clue-ladder.json');
const out=path.join(__dirname,'../public/data/clue-ladder.js');
const content=JSON.parse(fs.readFileSync(data,'utf8'));
fs.writeFileSync(out,'window.ORDJAKTEN_CLUES = '+JSON.stringify(content,null,2)+';\n');
console.log('Synkroniserade '+content.pairs.length+' ordpar till webbläsaren.');
