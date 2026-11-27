/* Authored map clues. Place indices follow the existing adventure stops.
 * The visible description contains the evidence needed to choose a place;
 * no clue depends on colour, an emoji, a time limit or an unseen map detail. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenTreasureData=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DATA={
    forest:[
      {
        description:'En liten fågel sitter på en skylt där skogen börjar.',
        clue:'Leta vid skogens kant. En liten fågel sitter på en skylt där.',
        lookFor:['skogens kant','en fågel på en skylt'],
        hint:'Leta efter både fågeln och skylten vid skogens kant.',
        why:'Fågeln sitter på skylten där skogen börjar. Både platsen och fågeln stämmer med ledtråden.'
      },
      {
        description:'Vid stigen växer svampar i en ring runt en sten.',
        clue:'Följ stigen till en ring av svampar. I mitten ligger en sten.',
        lookFor:['svampar i en ring','en sten i mitten'],
        hint:'Du letar efter svampar i en ring, med en sten i mitten.',
        why:'Svamparna står i en ring runt stenen. Det är de två sakerna som ledtråden beskriver.'
      },
      {
        description:'En uggla har böcker i ett stort träd.',
        clue:'Sök efter ett stort träd där en uggla håller ordning på böcker.',
        lookFor:['ett stort träd','en uggla med böcker'],
        hint:'Både ugglan och böckerna ska finnas vid trädet.',
        why:'Här finns både en uggla och böcker i trädet. Därför passar den här platsen.'
      },
      {
        description:'Lyktor hänger mellan träden runt en öppen plats.',
        clue:'Hitta den öppna platsen där lyktor hänger mellan träden.',
        lookFor:['en öppen plats','lyktor mellan träden'],
        hint:'Titta efter en öppen plats med lyktor mellan träden.',
        why:'Platsen är öppen och har lyktor mellan träden. Båda delarna finns i ledtråden.'
      }
    ],
    space:[
      {
        description:'En robot står med packlådor bredvid en raket.',
        clue:'En robot packar lådor inför resan. Välj platsen där den står bredvid en raket.',
        lookFor:['en robot med lådor','en raket bredvid roboten'],
        hint:'Leta efter både roboten med lådorna och raketen.',
        why:'Roboten, packlådorna och raketen finns på samma plats. Det är där resan ska börja.'
      },
      {
        description:'Fotavtryck syns i dammet bland små stenar.',
        clue:'Leta där fötter har lämnat avtryck i dammet. Små stenar ligger bredvid.',
        lookFor:['fotavtryck i dammet','små stenar bredvid'],
        hint:'Du behöver hitta både avtrycken i dammet och de små stenarna.',
        why:'Avtrycken syns i dammet och stenarna ligger bredvid. Det stämmer med beskrivningen i ledtråden.'
      },
      {
        description:'En planet omges av stora ringar av is och sten.',
        clue:'Sök efter en planet med is och sten i stora ringar runt sig.',
        lookFor:['en planet','ringar av is och sten'],
        hint:'Ringarna ska gå runt planeten och bestå av is och sten.',
        why:'Isen och stenarna bildar ringar runt planeten. Det gör att den här platsen passar.'
      },
      {
        description:'En byggnad har ett stort fönster och en kikare mot rymden.',
        clue:'Res till byggnaden där du kan titta genom ett stort fönster med en kikare.',
        lookFor:['ett stort fönster','en kikare i byggnaden'],
        hint:'Välj byggnaden med både ett stort fönster och en kikare.',
        why:'Byggnaden har fönstret och kikaren som ledtråden nämner. Här kan vi titta ut i rymden.'
      }
    ],
    castle:[
      {
        description:'En vakt står vid en stor dörr med flaggor ovanför.',
        clue:'Leta efter en vakt vid en stor dörr. Ovanför dörren hänger flaggor.',
        lookFor:['en vakt vid en stor dörr','flaggor ovanför dörren'],
        hint:'Du ska hitta både vakten vid dörren och flaggorna ovanför.',
        why:'Vakten står vid den stora dörren med flaggor ovanför. Alla delarna hör till samma plats.'
      },
      {
        description:'Nycklar i olika former hänger på krokar längs väggen.',
        clue:'Gå dit där nycklar i olika former hänger på väggens krokar.',
        lookFor:['nycklar i olika former','krokar på väggen'],
        hint:'Leta efter nycklar på krokar längs väggen.',
        why:'Här hänger nycklarna på krokar, precis som ledtråden beskriver.'
      },
      {
        description:'En vänlig drake sitter på en kudde och berättar sagor.',
        clue:'Hitta den som berättar sagor från sin kudde. Det är en vänlig drake.',
        lookFor:['en drake som berättar sagor','en kudde som draken sitter på'],
        hint:'Draken ska sitta på en kudde och berätta.',
        why:'Draken sitter på kudden och berättar sagor. Därför är det hit ledtråden leder.'
      },
      {
        description:'Ett rum har hyllor med böcker och en låda med glittrande stenar.',
        clue:'Sök i rummet med bokhyllor. Där finns också en låda med stenar som glittrar.',
        lookFor:['hyllor med böcker','en låda med glittrande stenar'],
        hint:'Både bokhyllorna och lådan med stenar ska finnas i rummet.',
        why:'Rummet har böcker på hyllorna och glittrande stenar i en låda. Båda ledtrådarna passar.'
      }
    ],
    pirate:[
      {
        description:'En kapten står på en båt med segel och en kompass.',
        clue:'Leta efter kaptenen på en båt. Båten har segel och en kompass.',
        lookFor:['en kapten på en båt','segel och en kompass'],
        hint:'Välj platsen med kaptenen, seglet och kompassen.',
        why:'Kaptenen står ombord på båten med seglet och kompassen. Det är samma plats som i ledtråden.'
      },
      {
        description:'På ett bord ligger en karta med ett stort kryss.',
        clue:'Hitta bordet där en karta ligger utbredd. På papperet syns ett stort kryss.',
        lookFor:['en karta på ett bord','ett stort kryss på kartan'],
        hint:'Leta efter ett bord och en karta med ett kryss.',
        why:'Kartan ligger på bordet och har ett stort kryss. Därför passar den här platsen.'
      },
      {
        description:'På en strand ligger snäckor och en flaska med ett meddelande.',
        clue:'Sök längs stranden efter snäckor och en flaska med ett meddelande i.',
        lookFor:['snäckor på stranden','en flaska med ett meddelande'],
        hint:'Både snäckorna och flaskan ska ligga på stranden.',
        why:'Snäckorna och flaskan med meddelandet ligger tillsammans på stranden. Ledtråden beskriver just det.'
      },
      {
        description:'En stor kista innehåller en bok med ett snöre runt.',
        clue:'Leta efter en stor kista. Inuti finns en bok med ett snöre runt.',
        lookFor:['en stor kista','en bok med ett snöre runt'],
        hint:'Du letar efter kistan med boken och snöret.',
        why:'Boken med snöret ligger i kistan. Det stämmer med båda delarna av ledtråden.'
      }
    ],
    ocean:[
      {
        description:'Snäckor i olika former ligger i sanden vid vattnet.',
        clue:'Hitta sanden vid vattnet där snäckor i olika former ligger.',
        lookFor:['snäckor i olika former','sand vid vattnet'],
        hint:'Sök efter snäckorna i sanden, alldeles vid vattnet.',
        why:'Snäckorna ligger i sanden vid vattnet. Både sakerna och platsen stämmer.'
      },
      {
        description:'Små fiskar simmar mellan koraller under vattnet.',
        clue:'Dyk i fantasin till platsen där små fiskar simmar mellan koraller.',
        lookFor:['små fiskar','koraller under vattnet'],
        hint:'Leta efter både fiskarna och korallerna under vattnet.',
        why:'De små fiskarna simmar mellan korallerna. Det är den undervattensplats som ledtråden beskriver.'
      },
      {
        description:'Sköldpaddor simmar i en vik som skyddas av klippor.',
        clue:'Sök efter viken med sköldpaddor. Klippor skyddar vattnet där.',
        lookFor:['sköldpaddor i en vik','klippor som skyddar vattnet'],
        hint:'Sköldpaddorna och klipporna ska finnas vid samma vik.',
        why:'Här finns sköldpaddorna i viken mellan klipporna. Båda kännetecknen passar.'
      },
      {
        description:'Delfiner hoppar över vågorna nära en liten båt.',
        clue:'Hitta den lilla båten där du kan se delfiner hoppa över vågorna.',
        lookFor:['en liten båt','delfiner som hoppar över vågor'],
        hint:'Leta efter delfinerna och den lilla båten.',
        why:'Delfinerna hoppar nära båten, precis som ledtråden beskriver.'
      }
    ],
    dinosaurs:[
      {
        description:'I leran syns stora avtryck efter fötter.',
        clue:'Leta på marken där stora fötter har lämnat avtryck i lera.',
        lookFor:['lera på marken','stora avtryck efter fötter'],
        hint:'Välj leran med de stora avtrycken efter fötter.',
        why:'Leran visar stora avtryck efter fötter. Det är spåren som ledtråden ber oss leta efter.'
      },
      {
        description:'En forskare visar en gammal sten som liknar ett ägg.',
        clue:'Hitta forskaren som visar en gammal sten med samma form som ett ägg.',
        lookFor:['en forskare','en gammal sten formad som ett ägg'],
        hint:'Leta efter forskaren och stenen som ser ut som ett ägg.',
        why:'Forskaren visar den äggformade stenen. Det är båda kännetecknen från ledtråden.'
      },
      {
        description:'Från en utkiksplats syns ett högt berg med en öppning i toppen.',
        clue:'Sök upp utkiksplatsen där du ser ett högt berg med en öppning längst upp.',
        lookFor:['ett högt berg','en öppning i bergets topp'],
        hint:'Du ska kunna se både det höga berget och öppningen i toppen.',
        why:'Från utkiksplatsen ser vi bergets öppning i toppen. Den platsen stämmer med ledtråden.'
      },
      {
        description:'I fantasidalen går stora dinosaurier bland höga växter.',
        clue:'Gå i fantasin dit där stora dinosaurier vandrar mellan höga växter.',
        lookFor:['stora dinosaurier','höga växter'],
        hint:'Välj platsen där dinosaurierna går bland växterna.',
        why:'Här finns både dinosaurierna och de höga växterna. Det är den plats vi letar efter.'
      }
    ],
    garden:[
      {
        description:'En trädgårdsmästare står vid krukor och en påse frön.',
        clue:'Leta efter den som ska så frön. Där finns både krukor och en fröpåse.',
        lookFor:['krukor','en påse frön'],
        hint:'Välj platsen med trädgårdsmästaren, krukorna och fröna.',
        why:'Trädgårdsmästaren har krukor och frön att så. Alla delarna i ledtråden finns här.'
      },
      {
        description:'Tulpaner växer längs en stig med en liten skylt.',
        clue:'Följ den lilla skylten till stigen där tulpaner växer längs kanten.',
        lookFor:['tulpaner längs en stig','en liten skylt vid stigen'],
        hint:'Leta efter både tulpanerna och den lilla skylten vid stigen.',
        why:'Här finns tulpanerna längs stigen och skylten som ledtråden nämner.'
      },
      {
        description:'Fjärilar flyger över blommorna på en äng.',
        clue:'Hitta ängen där fjärilar flyger mellan blommorna.',
        lookFor:['fjärilar','blommor på en äng'],
        hint:'Du letar efter både fjärilar och blommor på en äng.',
        why:'Fjärilarna flyger över ängens blommor. Därför passar den här platsen.'
      },
      {
        description:'En liten damm med stilla vatten ligger bland blommor och runda stenar.',
        clue:'Sök efter stilla vatten med blommor och runda stenar runt kanten.',
        lookFor:['stilla vatten','blommor och runda stenar vid kanten'],
        hint:'Leta efter dammen som omges av blommor och runda stenar.',
        why:'Dammens kant har både blommor och runda stenar. De hjälper oss att känna igen platsen.'
      }
    ],
    unicorn:[
      {
        description:'Ett glittrande spår går över små kullar.',
        clue:'Leta efter ett spår som glittrar när det slingrar sig över små kullar.',
        lookFor:['ett glittrande spår','små kullar'],
        hint:'Både det glittrande spåret och kullarna ska finnas där.',
        why:'Spåret glittrar och går över kullarna. Det stämmer med ledtrådens två delar.'
      },
      {
        description:'En bro med regnbågens färger går över en bäck.',
        clue:'Hitta vägen över bäcken. Där finns en bro med regnbågens färger.',
        lookFor:['en bro över en bäck','regnbågens färger på bron'],
        hint:'Leta efter bron som går över bäcken och har flera färger.',
        why:'Bron har regnbågens färger och går över bäcken. Därför passar den här platsen.'
      },
      {
        description:'Hjärtformade stenar ligger på en öppen plats bland fåglar.',
        clue:'Sök på den öppna platsen där fåglar sitter bland stenar formade som hjärtan.',
        lookFor:['fåglar','stenar formade som hjärtan'],
        hint:'Du ska hitta både fåglarna och de hjärtformade stenarna.',
        why:'Här finns fåglarna och stenarna som liknar hjärtan. Det är kännetecknen i ledtråden.'
      },
      {
        description:'Enhörningar leker på en äng full av blommor.',
        clue:'Hitta ängen där enhörningar leker bland blommorna.',
        lookFor:['en äng med blommor','enhörningar som leker'],
        hint:'Välj platsen med både enhörningar och blommor på en äng.',
        why:'Enhörningarna leker bland ängens blommor. Ledtråden beskriver den här platsen.'
      }
    ],
    animals:[
      {
        description:'En katt tittar fram bakom en gardin i ett litet hus.',
        clue:'Leta vid det lilla huset där en katt tittar fram bakom en gardin.',
        lookFor:['ett litet hus','en katt bakom en gardin'],
        hint:'Både katten och gardinen ska finnas i huset.',
        why:'Katten tittar fram bakom gardinen i huset. Det är samma plats som i ledtråden.'
      },
      {
        description:'En hund leker med en boll bland parkens bänkar.',
        clue:'Hitta platsen med bänkar där en hund leker med en boll.',
        lookFor:['bänkar','en hund med en boll'],
        hint:'Leta efter hunden med bollen, nära bänkarna.',
        why:'Hunden, bollen och bänkarna finns tillsammans här. Därför stämmer platsen.'
      },
      {
        description:'En kanin nosar på en morot vid en grind.',
        clue:'Gå till grinden där en kanin nosar på en morot.',
        lookFor:['en grind','en kanin som nosar på en morot'],
        hint:'Kaninen och moroten ska finnas vid grinden.',
        why:'Kaninen nosar på moroten vid grinden. Alla delarna i ledtråden passar.'
      },
      {
        description:'Flera olika djur sitter tillsammans på en stor filt med frukt.',
        clue:'Hitta den stora filten där flera olika djur har samlats kring frukt.',
        lookFor:['en stor filt med frukt','flera olika djur tillsammans'],
        hint:'Sök efter flera olika djur, en stor filt och frukt.',
        why:'Djuren har samlats på filten med frukten. Det är just den samlingen som ledtråden beskriver.'
      }
    ],
    rainbow:[
      {
        description:'Moln bildar en port med en låda färgpennor bakom.',
        clue:'Sök efter en öppning formad av moln. Bakom den väntar en låda färgpennor.',
        lookFor:['en öppning bland molnen','en låda färgpennor bakom öppningen'],
        hint:'Välj öppningen bland molnen med pennlådan bakom.',
        why:'Molnen bildar en port och pennorna finns bakom den. Det stämmer med ledtråden.'
      },
      {
        description:'På ett bord står penslar och skålar med färg.',
        clue:'Leta efter bordet med penslar och skålar fyllda med färg.',
        lookFor:['penslar på ett bord','skålar med färg på bordet'],
        hint:'Både penslarna och färgskålarna ska stå på bordet.',
        why:'Här står penslarna och skålarna med färg på ett bord. Alla kännetecknen passar.'
      },
      {
        description:'Såpbubblor svävar i luften ovanför en slingrande stig.',
        clue:'Följ stigen där såpbubblor svävar i luften ovanför dig.',
        lookFor:['en stig','såpbubblor i luften ovanför stigen'],
        hint:'Leta efter såpbubblorna ovanför stigen.',
        why:'Såpbubblorna svävar över den slingrande stigen. Det är den plats ledtråden beskriver.'
      },
      {
        description:'Ett högt torn har lampor och regnbågens alla färger.',
        clue:'Hitta det höga tornet med lampor och regnbågens alla färger.',
        lookFor:['ett högt torn med lampor','regnbågens färger på tornet'],
        hint:'Välj tornet som har både lampor och många färger.',
        why:'Tornet har lamporna och regnbågens färger. Båda delarna i ledtråden finns här.'
      }
    ],
    horses:[
      {
        description:'I en bod finns höbalar och en korg med morötter.',
        clue:'Leta i boden där höbalar ligger bredvid en korg med morötter.',
        lookFor:['höbalar i en bod','en korg med morötter'],
        hint:'Du letar efter både höbalarna och morotskorgen i boden.',
        why:'Boden innehåller höbalar och en korg med morötter. Det gör att den stämmer med ledtråden.'
      },
      {
        description:'En ponny står i en hage vid ett staket.',
        clue:'Sök efter en hage där en liten ponny väntar vid staketet.',
        lookFor:['en ponny','en hage med staket'],
        hint:'Välj hagen med ponnyn vid staketet.',
        why:'Ponnyn står vid hagens staket. Både djuret och platsen passar ledtråden.'
      },
      {
        description:'En stig för ryttare går förbi ett träd och en liten bäck.',
        clue:'Följ ryttarnas väg som går förbi ett träd och en liten bäck.',
        lookFor:['ett träd vid ryttarnas stig','en liten bäck vid samma stig'],
        hint:'Leta efter ryttarnas stig med både trädet och bäcken.',
        why:'Ryttarnas stig passerar både trädet och bäcken. De två kännetecknen visar vägen.'
      },
      {
        description:'Rosetter med långa band hänger på en tavla på gården.',
        clue:'Hitta tavlan på gården där rosetter med långa band hänger.',
        lookFor:['en tavla på gården','rosetter med långa band'],
        hint:'Leta efter tavlan med rosetter och långa band.',
        why:'Rosetterna med banden hänger på tavlan. Det är det ledtråden ber oss hitta.'
      }
    ],
    music:[
      {
        description:'En ensam musiker spelar från ett notblad.',
        clue:'Hitta musikern som spelar ensam och läser från ett blad med noter.',
        lookFor:['en ensam musiker','ett blad med noter'],
        hint:'Här ska det vara en ensam musiker med ett notblad.',
        why:'Musikern spelar ensam från notbladet. Det skiljer platsen från scenen där en hel grupp står.'
      },
      {
        description:'Trummor och gitarrer står i ett rum med en liten klocka.',
        clue:'Gå till rummet med en liten klocka där trummor och gitarrer står.',
        lookFor:['trummor och gitarrer','en liten klocka i rummet'],
        hint:'Sök efter både instrumenten och den lilla klockan i rummet.',
        why:'Trummorna, gitarrerna och klockan finns i samma rum. Det är platsen i ledtråden.'
      },
      {
        description:'Lampor hänger över ett öppet golv med plats att dansa.',
        clue:'Hitta det öppna golvet där du kan dansa under lamporna.',
        lookFor:['ett öppet golv att dansa på','lampor ovanför golvet'],
        hint:'Leta efter golvet med gott om dansplats och lampor ovanför.',
        why:'Det öppna golvet har plats för dans under lamporna. Båda kännetecknen stämmer.'
      },
      {
        description:'En grupp musiker står på en scen vid en mikrofon.',
        clue:'Sök efter en hel grupp musiker som står tillsammans vid en mikrofon.',
        lookFor:['en grupp musiker','en mikrofon vid gruppen'],
        hint:'Välj platsen med flera musiker och en mikrofon.',
        why:'Här står flera musiker tillsammans vid mikrofonen. Ledtråden beskriver en grupp, så den ensamma musikern passar inte.'
      }
    ]
  };
  // Four earned story fragments in each world.
  const LETTER_FRAGMENTS={
  "forest": [
    "Ett brev har gömts bland skogens träd.",
    "En fågel lämnade ett spår, men glömde att säga var.",
    "Ugglan visste att två ledtrådar kan hjälpa mer än en.",
    "Nu har du hittat alla fyra platser. Skogens hemliga brev är ditt!"
  ],
  "space": [
    "Ett meddelande väntar bland stjärnorna.",
    "Roboten såg något ovanligt och skrev ner två kännetecken.",
    "När beskrivningarna jämförs går det att välja rätt väg.",
    "Uppdrag slutfört! Du har hittat hela rymdmeddelandet."
  ],
  "castle": [
    "I slottet finns ett brev med fyra delar.",
    "En vakt såg nycklar och flaggor men visste inte vad han letade efter.",
    "Han lärde sig att läsa ledtråden en gång till.",
    "Nu kan slottets hemliga brev läsas från början till slut!"
  ],
  "pirate": [
    "En pirat har gömt ett brev på fyra platser.",
    "Kaptenen följde inte bara ett kryss på kartan.",
    "Hon jämförde också vad hon såg med orden i ledtråden.",
    "Alla fyra brevdelarna är hittade. Vilken skattletare du är!"
  ],
  "ocean": [
    "Ett brev har färdats under vågorna.",
    "En delfin fann ett spår vid en liten båt.",
    "Ett annat spår visade vad som fanns i vattnet.",
    "Nu har du samlat havets hemliga meddelande!"
  ],
  "dinosaurs": [
    "Ett gammalt meddelande låg gömt i marken.",
    "Någon hade sett stora spår men visste inte vems de var.",
    "Fler kännetecken hjälpte letaren att förstå platsen.",
    "Nu har du hittat alla delarna i dinosauriernas brev!"
  ],
  "garden": [
    "Någon har lämnat ett hemligt brev i trädgården.",
    "Ett litet frö kan vara svårt att hitta utan en beskrivning.",
    "När du tittar efter två saker blir valet tydligare.",
    "Du hittade alla fyra platser. Trädgårdsbrevet är komplett!"
  ],
  "unicorn": [
    "Ett glittrande brev väntar i sagolandet.",
    "En vän såg ett märkligt spår men stannade upp och tänkte.",
    "Orden i ledtråden hjälpte henne att välja bland platserna.",
    "Alla fyra delarna är samlade. Sagobrevet är ditt!"
  ],
  "animals": [
    "Djuren har skrivit ett brev tillsammans.",
    "Ett djur såg en ledtråd, ett annat såg något mer.",
    "Tillsammans kunde de beskriva platsen tydligare.",
    "Nu har du läst djurens hemliga brev i fyra delar!"
  ],
  "rainbow": [
    "Ett färgglatt brev har delats i fyra bitar.",
    "Det räcker inte alltid att bara titta på färgen.",
    "Vad som händer på platsen är också en viktig ledtråd.",
    "Du hittade alla bitar. Regnbågsbrevet är färdigt!"
  ],
  "horses": [
    "Ett meddelande väntar vid hästarnas gård.",
    "Någon såg ett spår och försökte beskriva det för en vän.",
    "När vännen lyssnade på alla detaljer hittade de rätt.",
    "Nu har du samlat hela brevet från hästgården!"
  ],
  "music": [
    "Ett hemligt brev ligger bland musikinstrumenten.",
    "En ton kan vara stark, men den säger inte var man är.",
    "Fler ord behövs för att skilja scenen från övningsrummet.",
    "Du har hittat hela musikbrevet. Bra ledtrådsarbete!"
  ]
};
  // Three contextual clues and grounded explanations for each one-time mystery.
  const MYSTERIES={
  "forest": {
    "title": "Ugglans försvunna bok",
    "intro": "Ugglan hittar inte sin bok. Var kan den vara?",
    "target": 2,
    "clues": [
      "Boken är inte utomhus på marken.",
      "Den som har boken tycker om att läsa uppe i ett träd.",
      "På platsen finns redan flera andra böcker."
    ],
    "why": "Ugglan har böcker i ett stort träd. Både trädet och böckerna passar ledtrådarna.",
    "wrong": [
      "Vid skogsbrynet finns en fågel på en skylt, men inga böcker uppe i ett träd.",
      "Vid svampstigen finns en sten och svampar, inte böcker i ett träd.",
      null,
      "Vid gläntan hänger lyktor, men det finns inga böcker hos en uggla."
    ]
  },
  "space": {
    "title": "Robotens försvunna låda",
    "intro": "Roboten har tappat bort en låda som behövs på resan. Var finns den?",
    "target": 0,
    "clues": [
      "Lådan hör till något som ska följa med på en resa.",
      "Någon har redan samlat fler lådor där.",
      "En robot står precis bredvid en raket."
    ],
    "why": "Vid raketen står en robot med packlådor. Alla ledtrådarna pekar på samma plats.",
    "wrong": [
      null,
      "Här finns fotspår i damm, men ingen robot med packlådor.",
      "Här finns en planet med ringar, inte en robot som packar.",
      "Här finns en kikare och ett stort fönster, men inga packlådor bredvid en raket."
    ]
  },
  "castle": {
    "title": "Den försvunna glittrande stenen",
    "intro": "En liten sten har försvunnit ur skattkammaren. Var kan den ligga?",
    "target": 3,
    "clues": [
      "Stenen ligger inomhus.",
      "Den förvaras i en låda i ett rum med böcker.",
      "Flera andra stenar glittrar i samma låda."
    ],
    "why": "I rummet med bokhyllor finns en låda med glittrande stenar. Där passar alla tre spåren.",
    "wrong": [
      "Vakten står vid en dörr med flaggor, inte vid en låda med stenar.",
      "På krokarna hänger nycklar, inte glittrande stenar i en låda.",
      "Draken sitter på en kudde och berättar sagor, men har ingen stenlåda.",
      null
    ]
  },
  "pirate": {
    "title": "Flaskposten som försvann",
    "intro": "Kaptenen väntar på ett brev i en flaska. Var ligger flaskan?",
    "target": 2,
    "clues": [
      "Brevet finns inte ombord på ett skepp.",
      "Det har lagts i en flaska som ligger utomhus.",
      "Runt flaskan ligger snäckor på sanden."
    ],
    "why": "På stranden finns både snäckor och en flaska med meddelande. Där möts ledtrådarna.",
    "wrong": [
      "Kaptenens båt har segel och kompass, men ingen flaska på sanden.",
      "Bordet har en karta med ett kryss, inte en flaska bland snäckor.",
      null,
      "I kistan finns en bok med snöre, inte ett brev i en flaska."
    ]
  },
  "ocean": {
    "title": "Den borttappade snäckan",
    "intro": "En vän har tappat bort en vacker snäcka. Var letar ni?",
    "target": 0,
    "clues": [
      "Snäckan ligger inte ute på djupt vatten.",
      "Den finns nära strandkanten.",
      "Flera snäckor ligger i sanden vid vattnet."
    ],
    "why": "Vid strandkanten ligger snäckor i sanden. Alla tre ledtrådarna handlar om samma plats.",
    "wrong": [
      null,
      "Här simmar fiskar mellan koraller under vattnet, inte i sanden vid stranden.",
      "I viken finns sköldpaddor mellan klippor, inte snäckor i strandens sand.",
      "Delfinerna hoppar nära en båt, men snäckan ligger inte där."
    ]
  },
  "dinosaurs": {
    "title": "Forskarens borttappade anteckning",
    "intro": "En forskare har glömt var hon såg en märklig sten. Var var hon?",
    "target": 1,
    "clues": [
      "Forskaren såg något som såg ut att höra till ett djur.",
      "Hon höll inte på att följa spår i lera.",
      "Föremålet var en gammal sten som liknade ett ägg."
    ],
    "why": "Forskaren visar en gammal sten som liknar ett ägg. Det är den stenen som beskrivs.",
    "wrong": [
      "I leran syns fotavtryck, men forskaren letar efter en äggliknande sten.",
      null,
      "Från utkiksplatsen syns ett berg, men ingen sten som ser ut som ett ägg.",
      "I dalen finns stora dinosaurier och växter, men inte forskarens sten."
    ]
  },
  "garden": {
    "title": "Påsen med hemliga frön",
    "intro": "Trädgårdsmästaren saknar en påse frön. Var kan den ligga?",
    "target": 0,
    "clues": [
      "Påsen finns där någon arbetar med växter.",
      "Det finns flera krukor på platsen.",
      "En trädgårdsmästare står bredvid en påse frön."
    ],
    "why": "Trädgårdsmästaren står vid krukorna och påsen med frön. Alla ledtrådarna passar.",
    "wrong": [
      null,
      "Vid tulpanstigen står en liten skylt, men inga krukor med en påse frön.",
      "På ängen flyger fjärilar över blommorna, men där arbetar ingen med fröpåsar.",
      "Vid dammen finns vatten och stenar, men ingen påse frön vid krukor."
    ]
  },
  "unicorn": {
    "title": "Halsbandet vid bron",
    "intro": "En vän tappade ett halsband när hon gick över vatten. Var ska vi leta?",
    "target": 1,
    "clues": [
      "Hon gick inte över land hela vägen.",
      "Hon använde en bro för att ta sig över en bäck.",
      "Bron hade samma färger som en regnbåge."
    ],
    "why": "Bron med regnbågens färger går över en bäck. Där passar både bron och vattnet.",
    "wrong": [
      "Det glittrande spåret går över kullar, inte över en bäck med en bro.",
      null,
      "Här ligger hjärtformade stenar bland fåglar, men ingen bro går över vattnet.",
      "På ängen leker enhörningar bland blommor, men det finns ingen regnbågsbro."
    ]
  },
  "animals": {
    "title": "Kaninens försvunna morot",
    "intro": "Kaninen har tappat bort sin morot. Var kan den ha blivit kvar?",
    "target": 2,
    "clues": [
      "Kaninen var inte inne i ett hus.",
      "Den stannade utanför vid en grind.",
      "Där stod kaninen och nosade på en morot."
    ],
    "why": "Vid grinden nosar kaninen på en morot. Både djuret, platsen och föremålet stämmer.",
    "wrong": [
      "Här finns en katt vid en gardin inne i ett hus, inte en kanin vid en grind.",
      "Här leker en hund med en boll i parken, inte en kanin med morot.",
      null,
      "Här sitter flera djur på en filt med frukt, men ingen kanin vid en grind."
    ]
  },
  "rainbow": {
    "title": "Den saknade penseln",
    "intro": "En målare kan inte hitta sin pensel. Var kan den vara?",
    "target": 1,
    "clues": [
      "Den ligger där någon arbetar med färg.",
      "Det finns flera skålar med färg på platsen.",
      "Penslarna står tillsammans på ett bord."
    ],
    "why": "På bordet står penslar och färgskålar. Det är just den arbetsplatsen ledtrådarna beskriver.",
    "wrong": [
      "Bakom molnporten finns färgpennor, men inga penslar i färgskålar på ett bord.",
      null,
      "Här svävar såpbubblor över en stig, inte penslar vid ett målarbord.",
      "Tornet har lampor och regnbågsfärger, men inga penslar på ett bord."
    ]
  },
  "horses": {
    "title": "Den försvunna rosetten",
    "intro": "Efter en tävling saknar någon en rosett. Var hänger den?",
    "target": 3,
    "clues": [
      "Den har inte lämnats vid hästarnas mat.",
      "Den sitter upphängd på gården.",
      "Där finns en tavla med flera rosetter och långa band."
    ],
    "why": "Rosetter med långa band hänger på en tavla på gården. Det är just den platsen.",
    "wrong": [
      "I boden finns hö och morötter, men ingen tavla med rosetter.",
      "I hagen står en ponny vid ett staket, men inga rosetter hänger där.",
      "Längs ridstigen finns träd och bäck, inte en tavla med långa band.",
      null
    ]
  },
  "music": {
    "title": "Den borttappade mikrofonen",
    "intro": "En grupp ska uppträda men hittar inte sin mikrofon. Var finns den?",
    "target": 3,
    "clues": [
      "Mikrofonen ska användas av flera personer tillsammans.",
      "Den ligger inte i rummet där instrumenten övas.",
      "En hel grupp musiker står på en scen vid mikrofonen."
    ],
    "why": "På scenen står flera musiker tillsammans vid mikrofonen. Det skiljer platsen från den ensamma musikern.",
    "wrong": [
      "Här spelar en ensam musiker från ett notblad, inte en grupp vid en mikrofon.",
      "Övningsrummet har trummor, gitarrer och en klocka, men ingen grupp på scen.",
      "På dansgolvet hänger lampor, men ingen musikgrupp står med mikrofonen.",
      null
    ]
  }
};
  const SMALL_FINDS={
    forest:{emoji:'🪵',name:'Liten vedbit'},
    space:{emoji:'📎',name:'Robotens gem'},
    castle:{emoji:'🧵',name:'Kort trådbit'},
    pirate:{emoji:'🪵',name:'Liten träbit'},
    ocean:{emoji:'🪨',name:'Slät sten'},
    dinosaurs:{emoji:'🍂',name:'Torrt löv'},
    garden:{emoji:'🌱',name:'Liten planta'},
    unicorn:{emoji:'🪨',name:'Liten grå sten'},
    animals:{emoji:'🪶',name:'Liten fjäder'},
    rainbow:{emoji:'📄',name:'Pappersbit'},
    horses:{emoji:'🌾',name:'Grässtrå'},
    music:{emoji:'🎟️',name:'Pappersbiljett'}
  };
  for(const rows of Object.values(DATA)){
    rows.forEach(row=>{Object.freeze(row.lookFor);Object.freeze(row);});Object.freeze(rows);
  }
  for(const item of Object.values(MYSTERIES)){Object.freeze(item.clues);Object.freeze(item.wrong);Object.freeze(item);}
  for(const item of Object.values(SMALL_FINDS))Object.freeze(item);
  for(const parts of Object.values(LETTER_FRAGMENTS))Object.freeze(parts);
  return Object.freeze({DATA:Object.freeze(DATA),SMALL_FINDS:Object.freeze(SMALL_FINDS),LETTER_FRAGMENTS:Object.freeze(LETTER_FRAGMENTS),MYSTERIES:Object.freeze(MYSTERIES)});
});
