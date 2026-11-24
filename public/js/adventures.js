/* Äventyrsvärldar: fristående, presentationsbaserade. Påverkar aldrig frågor, facit eller poäng. */
(function (root, factory) {
  const api=factory();
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
  root.OrdjaktenAdventures=api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const WORLDS=Object.freeze({
    "forest":Object.freeze({
      emoji:"🌲",
      title:"Mystiska skogen",
      short:"Skogen",
      teaser:"Följ stigen",
      group:"upptack",
      description:"Följ stigen och upptäck skogens gömda platser.",
      intro:"Stigen väntar! Varje ord tar oss längre in i skogen.",
      ending:"Du har vandrat hela vägen genom Mystiska skogen!",
      stops:Object.freeze([
        Object.freeze({"emoji":"🌿","name":"Skogsbrynet","message":"Du har nått skogsbrynet!"}),
        Object.freeze({"emoji":"🍄","name":"Svampstigen","message":"Du hittade svampstigen!"}),
        Object.freeze({"emoji":"🦉","name":"Uggleträdet","message":"Du har kommit till uggleträdet!"}),
        Object.freeze({"emoji":"🏕️","name":"Hemliga gläntan","message":"Du hittade den hemliga gläntan!"}),
      ]),
    }),
    "space":Object.freeze({
      emoji:"🚀",
      title:"Rymdäventyret",
      short:"Rymden",
      teaser:"Utforska planeter",
      group:"upptack",
      description:"Res bland planeter och hitta en hemlig stjärnbas.",
      intro:"Raketen lyfter! Varje ord för oss närmare nästa planet.",
      ending:"Du har klarat hela rymdresan!",
      stops:Object.freeze([
        Object.freeze({"emoji":"🚀","name":"Uppskjutning","message":"Raketen har lyft!"}),
        Object.freeze({"emoji":"🌙","name":"Månen","message":"Du har landat på månen!"}),
        Object.freeze({"emoji":"🪐","name":"Ringplaneten","message":"Du upptäckte ringplaneten!"}),
        Object.freeze({"emoji":"🌟","name":"Stjärnbasen","message":"Du nådde stjärnbasen!"}),
      ]),
    }),
    "castle":Object.freeze({
      emoji:"🏰",
      title:"Drakslottet",
      short:"Slottet",
      teaser:"Öppna hemliga rum",
      group:"upptack",
      description:"Utforska slottet och hitta den gömda skattkammaren.",
      intro:"Slottsporten öppnas! Ord för ord tar vi oss framåt.",
      ending:"Du har utforskat hela Drakslottet!",
      stops:Object.freeze([
        Object.freeze({"emoji":"🚪","name":"Slottsporten","message":"Du kom igenom slottsporten!"}),
        Object.freeze({"emoji":"🗝️","name":"Nyckelrummet","message":"Du hittade nyckelrummet!"}),
        Object.freeze({"emoji":"🐉","name":"Draksalen","message":"Du nådde draksalen!"}),
        Object.freeze({"emoji":"💎","name":"Skattkammaren","message":"Du upptäckte skattkammaren!"}),
      ]),
    }),
    "pirate":Object.freeze({
      emoji:"🏴‍☠️",
      title:"Piratjakten",
      short:"Piraterna",
      teaser:"Hitta en skatt",
      group:"upptack",
      description:"Följ en skattkarta över vågor och hemliga öar.",
      intro:"Skepp ohoj! Vi navigerar mot piraternas hemliga skatt.",
      ending:"Du hittade piraternas försvunna ordskatt!",
      stops:Object.freeze([
        Object.freeze({"emoji":"⛵","name":"Piratbåten","message":"Du har klivit ombord på piratbåten!"}),
        Object.freeze({"emoji":"🗺️","name":"Skattkartan","message":"Du hittade ett spår på skattkartan!"}),
        Object.freeze({"emoji":"🏝️","name":"Hemliga ön","message":"Du nådde den hemliga ön!"}),
        Object.freeze({"emoji":"🪙","name":"Skattkistan","message":"Du hittade piratskatten!"}),
      ]),
    }),
    "ocean":Object.freeze({
      emoji:"🐬",
      title:"Havets hemligheter",
      short:"Havet",
      teaser:"Dyk under ytan",
      group:"upptack",
      description:"Dyk ner och upptäck ett undervattensrike.",
      intro:"På med cyklopet! Varje ord tar oss lite djupare.",
      ending:"Du utforskade hela undervattensvärlden!",
      stops:Object.freeze([
        Object.freeze({"emoji":"🐚","name":"Snäckstranden","message":"Du hittade snäckstranden!"}),
        Object.freeze({"emoji":"🐠","name":"Korallrevet","message":"Du simmade fram till korallrevet!"}),
        Object.freeze({"emoji":"🐢","name":"Sköldpaddsviken","message":"Du nådde sköldpaddsviken!"}),
        Object.freeze({"emoji":"🐬","name":"Delfinbukten","message":"Du upptäckte delfinbukten!"}),
      ]),
    }),
    "dinosaurs":Object.freeze({
      emoji:"🦕",
      title:"Dinosaurielandet",
      short:"Dinosaurier",
      teaser:"Spåra dinosaurier",
      group:"upptack",
      description:"Följ spåren genom en förhistorisk dal.",
      intro:"Titta! Ett dinosauriespår! Vi följer det ord för ord.",
      ending:"Du har utforskat hela Dinosaurielandet!",
      stops:Object.freeze([
        Object.freeze({"emoji":"👣","name":"Fotspåren","message":"Du hittade stora fotspår!"}),
        Object.freeze({"emoji":"🥚","name":"Dinosaurieägget","message":"Du upptäckte ett dinosaurieägg!"}),
        Object.freeze({"emoji":"🌋","name":"Vulkandalen","message":"Du tog dig till vulkandalen!"}),
        Object.freeze({"emoji":"🦖","name":"Dinosauriernas dal","message":"Du nådde dinosauriernas dal!"}),
      ]),
    }),
    "garden":Object.freeze({
      emoji:"🌸",
      title:"Sagoträdgården",
      short:"Trädgården",
      teaser:"Hitta magiska blommor",
      group:"magi",
      description:"Vandra bland blommor och hitta sagornas hemliga damm.",
      intro:"Blommorna vaknar! Följ den glittrande trädgårdsstigen.",
      ending:"Du fick Sagoträdgårdens alla hemligheter att blomma!",
      stops:Object.freeze([
        Object.freeze({"emoji":"🌱","name":"Frögläntan","message":"Du planterade sagans första frö!"}),
        Object.freeze({"emoji":"🌷","name":"Tulpanstigen","message":"Du hittade tulpanstigen!"}),
        Object.freeze({"emoji":"🦋","name":"Fjärilsängen","message":"Du kom till fjärilsängen!"}),
        Object.freeze({"emoji":"🧚","name":"Älvdammen","message":"Du upptäckte den magiska älvdammen!"}),
      ]),
    }),
    "unicorn":Object.freeze({
      emoji:"🦄",
      title:"Enhörningsdalen",
      short:"Enhörningarna",
      teaser:"Följ gnistrande spår",
      group:"magi",
      description:"Hitta enhörningarnas glittrande dal.",
      intro:"Ett gnistrande spår! Vi följer det över kullarna.",
      ending:"Du har hittat enhörningarnas hemliga dal!",
      stops:Object.freeze([
        Object.freeze({"emoji":"✨","name":"Gnisterstigen","message":"Du fann gnisterstigen!"}),
        Object.freeze({"emoji":"🌈","name":"Regnbågsbron","message":"Du gick över regnbågsbron!"}),
        Object.freeze({"emoji":"💖","name":"Hjärtgläntan","message":"Du hittade hjärtgläntan!"}),
        Object.freeze({"emoji":"🦄","name":"Enhörningsängen","message":"Du nådde enhörningsängen!"}),
      ]),
    }),
    "animals":Object.freeze({
      emoji:"🐰",
      title:"Djurvännernas by",
      short:"Djurvännerna",
      teaser:"Träffa söta djur",
      group:"magi",
      description:"Hälsa på busiga, vänliga djur i deras lilla by.",
      intro:"Hej kompis! Djuren väntar vid första stigen.",
      ending:"Du har hälsat på alla djurvänner i byn!",
      stops:Object.freeze([
        Object.freeze({"emoji":"🐱","name":"Kattstugan","message":"Du hittade kattstugan!"}),
        Object.freeze({"emoji":"🐶","name":"Hundparken","message":"Du nådde hundparken!"}),
        Object.freeze({"emoji":"🐰","name":"Kaninhagen","message":"Du besökte kaninhagen!"}),
        Object.freeze({"emoji":"🐻","name":"Vänskapsplatsen","message":"Du nådde vänskapsplatsen!"}),
      ]),
    }),
    "rainbow":Object.freeze({
      emoji:"🌈",
      title:"Regnbågslandet",
      short:"Regnbågen",
      teaser:"Samla färger",
      group:"magi",
      description:"Följ en färgglad stig hela vägen över molnen.",
      intro:"En regnbåge visar vägen! Nu börjar färgäventyret.",
      ending:"Du fyllde hela Regnbågslandet med färger!",
      stops:Object.freeze([
        Object.freeze({"emoji":"☁️","name":"Molnporten","message":"Du har hittat molnporten!"}),
        Object.freeze({"emoji":"🎨","name":"Färgverkstaden","message":"Du nådde färgverkstaden!"}),
        Object.freeze({"emoji":"🫧","name":"Bubbelstigen","message":"Du hittade bubbelstigen!"}),
        Object.freeze({"emoji":"🌈","name":"Regnbågstornet","message":"Du nådde regnbågstornet!"}),
      ]),
    }),
    "horses":Object.freeze({
      emoji:"🐴",
      title:"Hästgården",
      short:"Hästgården",
      teaser:"Träffa hästarna",
      group:"magi",
      description:"Utforska stallet och följ stigen till en härlig ridtur.",
      intro:"Hästarna gnäggar välkommen! Vi upptäcker gården ord för ord.",
      ending:"Du har utforskat hela Hästgården!",
      stops:Object.freeze([
        Object.freeze({"emoji":"🥕","name":"Foderboden","message":"Du hittade foderboden!"}),
        Object.freeze({"emoji":"🐴","name":"Ponnyhagen","message":"Du besökte ponnyhagen!"}),
        Object.freeze({"emoji":"🏇","name":"Ridstigen","message":"Du tog dig till ridstigen!"}),
        Object.freeze({"emoji":"🏅","name":"Rosettplatsen","message":"Du nådde rosettplatsen!"}),
      ]),
    }),
    "music":Object.freeze({
      emoji:"🎤",
      title:"Musikscenen",
      short:"Musiken",
      teaser:"Skapa din show",
      group:"magi",
      description:"Öva på sång och dans inför den stora ordshowen.",
      intro:"Musiken börjar! Varje ord tar oss närmare scenen.",
      ending:"Du klarade hela showen på Musikscenen!",
      stops:Object.freeze([
        Object.freeze({"emoji":"🎵","name":"Första tonen","message":"Du hittade din första ton!"}),
        Object.freeze({"emoji":"🎸","name":"Replokalen","message":"Du nådde replokalen!"}),
        Object.freeze({"emoji":"💃","name":"Dansgolvet","message":"Du tog dig till dansgolvet!"}),
        Object.freeze({"emoji":"🎤","name":"Stora scenen","message":"Du nådde stora scenen!"}),
      ]),
    }),
  });
  const WORLD_IDS=Object.freeze(Object.keys(WORLDS));
  function isWorld(id){return typeof id==='string' && Object.prototype.hasOwnProperty.call(WORLDS,id);}
  function world(id){return isWorld(id)?WORLDS[id]:WORLDS.forest;}
  function stageSteps(total){if(!Number.isInteger(total)||total<1||total>100)return [];return [1,2,3,4].map((n,index)=>({index,threshold:Math.ceil(total*n/4)}));}
  function stages(id,total,answered=0){const steps=stageSteps(total);const done=Number.isFinite(answered)?Math.max(0,Math.min(total,Math.floor(answered))):0;return steps.map(({index,threshold})=>({index,threshold,...world(id).stops[index],reached:done>=threshold}));}
  function newlyReached(id,total,before,after){return stages(id,total,after).filter(stop=>stop.threshold>before&&stop.threshold<=after);}
  return {WORLDS,WORLD_IDS,isWorld,world,stages,newlyReached};
});
