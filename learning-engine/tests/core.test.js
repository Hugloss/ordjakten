'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Assessment}=require('../index');
test('standalone package can load its own canonical assessment contract',()=>{
 assert.equal(Assessment.SCHEMA_VERSION,'learning-assessment.v1');
});
test('a typed evidence observation preserves coarse metadata but never raw responses',()=>{
 const question={ref:{bankId:'physics',id:'q-wave',revision:1},
  responseSpec:{kind:'numeric'},assessmentSpec:{kind:'numeric-exact',expected:42},
  skillIds:['wave-speed'],reviewStatus:'reviewed'};
 const result=Assessment.fromEvaluator(question,{status:'correct'},{id:'numeric',revision:1});
 const ledger=Assessment.createEvidenceLedger();
 const entry=ledger.record({attemptId:'s:1',instanceId:'s:1',mode:'train',
  assistance:'none',assessment:result,difficultyBand:'foundational',
  activityKind:'numeric',observedDay:20000,rawAnswer:'never persist me'});
 assert.equal(entry.difficultyBand,'foundational');
 assert.equal(entry.observedDay,20000);
 assert.equal(JSON.stringify(entry).includes('never persist'),false);
 assert.throws(()=>ledger.record({attemptId:'s:1',instanceId:'s:1',
  mode:'train',assessment:result}),/Duplicate/);
 assert.throws(()=>ledger.record({attemptId:'s:2',instanceId:'s:2',
  mode:'train',assessment:result,difficultyBand:'raw text?'}),/difficulty/);
});
