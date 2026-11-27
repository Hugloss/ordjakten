/* Regenerate the browser data from the one canonical editorial JSON file. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const Q=require('../public/js/missions');
const root=path.resolve(__dirname,'../public/data');
const data=JSON.parse(fs.readFileSync(path.join(root,'missions.json'),'utf8'));
const expressions=JSON.parse(fs.readFileSync(path.join(root,'expressions.json'),'utf8'));
const errors=Q.validate(data,expressions);
if(errors.length){process.stderr.write(errors.join('\n')+'\n');process.exit(1);}
fs.writeFileSync(path.join(root,'missions.js'),
  '/* Ordjakten: redaktionella miniuppdrag för uttryck. */\nwindow.ORDJAKTEN_MISSIONS = '+JSON.stringify(data)+';\n','utf8');
process.stdout.write(`✓ Synced ${data.missions.length} authored mission entries into browser data.\n`);
