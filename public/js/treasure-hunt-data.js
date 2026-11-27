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
        hint:'Läs efter både fågeln och skylten vid skogens kant.',
        why:'Fågeln sitter på skylten där skogen börjar. Både platsen och fågeln stämmer med ledtråden.'
      },
      {
        description:'Vid stigen växer svampar i en ring runt en sten.',
        clue:'Följ stigen till en ring av svampar. I mitten ligger en sten.',
        hint:'Du letar efter svampar i en ring, med en sten i mitten.',
        why:'Svamparna står i en ring runt stenen. Det är de två sakerna som ledtråden beskriver.'
      },
      {
        description:'En uggla har böcker i ett stort träd.',
        clue:'Sök efter ett stort träd där en uggla håller ordning på böcker.',
        hint:'Både ugglan och böckerna ska finnas vid trädet.',
        why:'Här finns både en uggla och böcker i trädet. Därför passar den här platsen.'
      },
      {
        description:'Lyktor hänger mellan träden runt en öppen plats.',
        clue:'Hitta den öppna platsen där lyktor hänger mellan träden.',
        hint:'Titta efter en öppen plats med lyktor mellan träden.',
        why:'Platsen är öppen och har lyktor mellan träden. Båda delarna finns i ledtråden.'
      }
    ],
    space:[
      {
        description:'En robot står med packlådor bredvid en raket.',
        clue:'En robot packar lådor inför resan. Välj platsen där den står bredvid en raket.',
        hint:'Leta efter både roboten med lådorna och raketen.',
        why:'Roboten, packlådorna och raketen finns på samma plats. Det är där resan ska börja.'
      },
      {
        description:'Fotavtryck syns i dammet bland små stenar.',
        clue:'Leta där fötter har lämnat avtryck i dammet. Små stenar ligger bredvid.',
        hint:'Du behöver hitta både avtrycken i dammet och de små stenarna.',
        why:'Avtrycken syns i dammet och stenarna ligger bredvid. Det stämmer med beskrivningen i ledtråden.'
      },
      {
        description:'En planet omges av stora ringar av is och sten.',
        clue:'Sök efter en planet med is och sten i stora ringar runt sig.',
        hint:'Ringarna ska gå runt planeten och bestå av is och sten.',
        why:'Isen och stenarna bildar ringar runt planeten. Det gör att den här platsen passar.'
      },
      {
        description:'En byggnad har ett stort fönster och en kikare mot rymden.',
        clue:'Res till byggnaden där du kan titta genom ett stort fönster med en kikare.',
        hint:'Välj byggnaden med både ett stort fönster och en kikare.',
        why:'Byggnaden har fönstret och kikaren som ledtråden nämner. Här kan vi titta ut i rymden.'
      }
    ],
    castle:[
      {
        description:'En vakt står vid en stor dörr med flaggor ovanför.',
        clue:'Leta efter en vakt vid en stor dörr. Ovanför dörren hänger flaggor.',
        hint:'Du ska hitta både vakten vid dörren och flaggorna ovanför.',
        why:'Vakten står vid den stora dörren med flaggor ovanför. Alla delarna hör till samma plats.'
      },
      {
        description:'Nycklar i olika former hänger på krokar längs väggen.',
        clue:'Gå dit där nycklar i olika former hänger på väggens krokar.',
        hint:'Läs efter nycklar på krokar längs väggen.',
        why:'Här hänger nycklarna på krokar, precis som ledtråden beskriver.'
      },
      {
        description:'En vänlig drake sitter på en kudde och berättar sagor.',
        clue:'Hitta den som berättar sagor från sin kudde. Det är en vänlig drake.',
        hint:'Draken ska sitta på en kudde och berätta.',
        why:'Draken sitter på kudden och berättar sagor. Därför är det hit ledtråden leder.'
      },
      {
        description:'Ett rum har hyllor med böcker och en låda med glittrande stenar.',
        clue:'Sök i rummet med bokhyllor. Där finns också en låda med stenar som glittrar.',
        hint:'Både bokhyllorna och lådan med stenar ska finnas i rummet.',
        why:'Rummet har böcker på hyllorna och glittrande stenar i en låda. Båda ledtrådarna passar.'
      }
    ],
    pirate:[
      {
        description:'En kapten står på en båt med segel och en kompass.',
        clue:'Leta efter kaptenen på en båt. Båten har segel och en kompass.',
        hint:'Välj platsen med kaptenen, seglet och kompassen.',
        why:'Kaptenen står ombord på båten med seglet och kompassen. Det är samma plats som i ledtråden.'
      },
      {
        description:'På ett bord ligger en karta med ett stort kryss.',
        clue:'Hitta bordet där en karta ligger utbredd. På papperet syns ett stort kryss.',
        hint:'Leta efter ett bord och en karta med ett kryss.',
        why:'Kartan ligger på bordet och har ett stort kryss. Därför passar den här platsen.'
      },
      {
        description:'På en strand ligger snäckor och en flaska med ett meddelande.',
        clue:'Sök längs stranden efter snäckor och en flaska med ett meddelande i.',
        hint:'Både snäckorna och flaskan ska ligga på stranden.',
        why:'Snäckorna och flaskan med meddelandet ligger tillsammans på stranden. Ledtråden beskriver just det.'
      },
      {
        description:'En stor kista innehåller en bok med ett snöre runt.',
        clue:'Leta efter en stor kista. Inuti finns en bok med ett snöre runt.',
        hint:'Du letar efter kistan med boken och snöret.',
        why:'Boken med snöret ligger i kistan. Det stämmer med båda delarna av ledtråden.'
      }
    ],
    ocean:[
      {
        description:'Snäckor i olika former ligger i sanden vid vattnet.',
        clue:'Hitta sanden vid vattnet där snäckor i olika former ligger.',
        hint:'Sök efter snäckorna i sanden, alldeles vid vattnet.',
        why:'Snäckorna ligger i sanden vid vattnet. Både sakerna och platsen stämmer.'
      },
      {
        description:'Små fiskar simmar mellan koraller under vattnet.',
        clue:'Dyk i fantasin till platsen där små fiskar simmar mellan koraller.',
        hint:'Leta efter både fiskarna och korallerna under vattnet.',
        why:'De små fiskarna simmar mellan korallerna. Det är den undervattensplats som ledtråden beskriver.'
      },
      {
        description:'Sköldpaddor simmar i en vik som skyddas av klippor.',
        clue:'Sök efter viken med sköldpaddor. Klippor skyddar vattnet där.',
        hint:'Sköldpaddorna och klipporna ska finnas vid samma vik.',
        why:'Här finns sköldpaddorna i viken mellan klipporna. Båda kännetecknen passar.'
      },
      {
        description:'Delfiner hoppar över vågorna nära en liten båt.',
        clue:'Hitta den lilla båten där du kan se delfiner hoppa över vågorna.',
        hint:'Leta efter delfinerna och den lilla båten.',
        why:'Delfinerna hoppar nära båten, precis som ledtråden beskriver.'
      }
    ],
    dinosaurs:[
      {
        description:'I leran syns stora avtryck efter fötter.',
        clue:'Leta på marken där stora fötter har lämnat avtryck i lera.',
        hint:'Välj leran med de stora avtrycken efter fötter.',
        why:'Leran visar stora avtryck efter fötter. Det är spåren som ledtråden ber oss leta efter.'
      },
      {
        description:'En forskare visar en gammal sten som liknar ett ägg.',
        clue:'Hitta forskaren som visar en gammal sten med samma form som ett ägg.',
        hint:'Leta efter forskaren och stenen som ser ut som ett ägg.',
        why:'Forskaren visar den äggformade stenen. Det är båda kännetecknen från ledtråden.'
      },
      {
        description:'Från en utkiksplats syns ett högt berg med en öppning i toppen.',
        clue:'Sök upp utkiksplatsen där du ser ett högt berg med en öppning längst upp.',
        hint:'Du ska kunna se både det höga berget och öppningen i toppen.',
        why:'Från utkiksplatsen ser vi bergets öppning i toppen. Den platsen stämmer med ledtråden.'
      },
      {
        description:'I fantasidalen går stora dinosaurier bland höga växter.',
        clue:'Gå i fantasin dit där stora dinosaurier vandrar mellan höga växter.',
        hint:'Välj platsen där dinosaurierna går bland växterna.',
        why:'Här finns både dinosaurierna och de höga växterna. Det är den plats vi letar efter.'
      }
    ],
    garden:[
      {
        description:'En trädgårdsmästare står vid krukor och en påse frön.',
        clue:'Leta efter den som ska så frön. Där finns både krukor och en fröpåse.',
        hint:'Välj platsen med trädgårdsmästaren, krukorna och fröna.',
        why:'Trädgårdsmästaren har krukor och frön att så. Alla delarna i ledtråden finns här.'
      },
      {
        description:'Tulpaner växer längs en stig med en liten skylt.',
        clue:'Följ den lilla skylten till stigen där tulpaner växer längs kanten.',
        hint:'Läs efter både tulpanerna och den lilla skylten vid stigen.',
        why:'Här finns tulpanerna längs stigen och skylten som ledtråden nämner.'
      },
      {
        description:'Fjärilar flyger över blommorna på en äng.',
        clue:'Hitta ängen där fjärilar flyger mellan blommorna.',
        hint:'Du letar efter både fjärilar och blommor på en äng.',
        why:'Fjärilarna flyger över ängens blommor. Därför passar den här platsen.'
      },
      {
        description:'En liten damm ligger bland blommor och runda stenar.',
        clue:'Sök efter stilla vatten med blommor och runda stenar runt kanten.',
        hint:'Leta efter dammen som omges av blommor och runda stenar.',
        why:'Dammens kant har både blommor och runda stenar. De hjälper oss att känna igen platsen.'
      }
    ],
    unicorn:[
      {
        description:'Ett glittrande spår går över små kullar.',
        clue:'Leta efter ett spår som glittrar när det slingrar sig över små kullar.',
        hint:'Både det glittrande spåret och kullarna ska finnas där.',
        why:'Spåret glittrar och går över kullarna. Det stämmer med ledtrådens två delar.'
      },
      {
        description:'En bro med regnbågens färger går över en bäck.',
        clue:'Hitta vägen över bäcken. Där finns en bro med regnbågens färger.',
        hint:'Leta efter bron som går över bäcken och har flera färger.',
        why:'Bron har regnbågens färger och går över bäcken. Därför passar den här platsen.'
      },
      {
        description:'Hjärtformade stenar ligger på en öppen plats bland fåglar.',
        clue:'Sök på den öppna platsen där fåglar sitter bland stenar formade som hjärtan.',
        hint:'Du ska hitta både fåglarna och de hjärtformade stenarna.',
        why:'Här finns fåglarna och stenarna som liknar hjärtan. Det är kännetecknen i ledtråden.'
      },
      {
        description:'Enhörningar leker på en äng full av blommor.',
        clue:'Hitta ängen där enhörningar leker bland blommorna.',
        hint:'Välj platsen med både enhörningar och blommor på en äng.',
        why:'Enhörningarna leker bland ängens blommor. Ledtråden beskriver den här platsen.'
      }
    ],
    animals:[
      {
        description:'En katt tittar fram bakom en gardin i ett litet hus.',
        clue:'Leta vid det lilla huset där en katt tittar fram bakom en gardin.',
        hint:'Både katten och gardinen ska finnas i huset.',
        why:'Katten tittar fram bakom gardinen i huset. Det är samma plats som i ledtråden.'
      },
      {
        description:'En hund leker med en boll bland parkens bänkar.',
        clue:'Hitta platsen med bänkar där en hund leker med en boll.',
        hint:'Leta efter hunden med bollen, nära bänkarna.',
        why:'Hunden, bollen och bänkarna finns tillsammans här. Därför stämmer platsen.'
      },
      {
        description:'En kanin nosar på en morot vid en grind.',
        clue:'Gå till grinden där en kanin nosar på en morot.',
        hint:'Kaninen och moroten ska finnas vid grinden.',
        why:'Kaninen nosar på moroten vid grinden. Alla delarna i ledtråden passar.'
      },
      {
        description:'Flera olika djur sitter tillsammans på en stor filt med frukt.',
        clue:'Hitta den stora filten där flera olika djur har samlats kring frukt.',
        hint:'Sök efter flera olika djur, en stor filt och frukt.',
        why:'Djuren har samlats på filten med frukten. Det är just den samlingen som ledtråden beskriver.'
      }
    ],
    rainbow:[
      {
        description:'Moln bildar en port med en låda färgpennor bakom.',
        clue:'Sök efter en öppning formad av moln. Bakom den väntar en låda färgpennor.',
        hint:'Välj öppningen bland molnen med pennlådan bakom.',
        why:'Molnen bildar en port och pennorna finns bakom den. Det stämmer med ledtråden.'
      },
      {
        description:'På ett bord står penslar och skålar med färg.',
        clue:'Leta efter bordet med penslar och skålar fyllda med färg.',
        hint:'Både penslarna och färgskålarna ska stå på bordet.',
        why:'Här står penslarna och skålarna med färg på ett bord. Alla kännetecknen passar.'
      },
      {
        description:'Såpbubblor svävar i luften ovanför en slingrande stig.',
        clue:'Följ stigen där såpbubblor svävar i luften ovanför dig.',
        hint:'Leta efter såpbubblorna ovanför stigen.',
        why:'Såpbubblorna svävar över den slingrande stigen. Det är den plats ledtråden beskriver.'
      },
      {
        description:'Ett högt torn har lampor och regnbågens alla färger.',
        clue:'Hitta det höga tornet med lampor och regnbågens alla färger.',
        hint:'Välj tornet som har både lampor och många färger.',
        why:'Tornet har lamporna och regnbågens färger. Båda delarna i ledtråden finns här.'
      }
    ],
    horses:[
      {
        description:'I en bod finns höbalar och en korg med morötter.',
        clue:'Leta i boden där höbalar ligger bredvid en korg med morötter.',
        hint:'Du letar efter både höbalarna och morotskorgen i boden.',
        why:'Boden innehåller höbalar och en korg med morötter. Det gör att den stämmer med ledtråden.'
      },
      {
        description:'En ponny står i en hage vid ett staket.',
        clue:'Sök efter en hage där en liten ponny väntar vid staketet.',
        hint:'Välj hagen med ponnyn vid staketet.',
        why:'Ponnyn står vid hagens staket. Både djuret och platsen passar ledtråden.'
      },
      {
        description:'En stig för ryttare går förbi ett träd och en liten bäck.',
        clue:'Följ ryttarnas väg som går förbi ett träd och en liten bäck.',
        hint:'Leta efter ryttarnas stig med både trädet och bäcken.',
        why:'Ryttarnas stig passerar både trädet och bäcken. De två kännetecknen visar vägen.'
      },
      {
        description:'Rosetter med långa band hänger på en tavla på gården.',
        clue:'Hitta tavlan på gården där rosetter med långa band hänger.',
        hint:'Leta efter tavlan med rosetter och långa band.',
        why:'Rosetterna med banden hänger på tavlan. Det är det ledtråden ber oss hitta.'
      }
    ],
    music:[
      {
        description:'En ensam musiker spelar från ett notblad.',
        clue:'Hitta musikern som spelar ensam och läser från ett blad med noter.',
        hint:'Här ska det vara en ensam musiker med ett notblad.',
        why:'Musikern spelar ensam från notbladet. Det skiljer platsen från scenen där en hel grupp står.'
      },
      {
        description:'Trummor och gitarrer står i ett rum med en liten klocka.',
        clue:'Gå till rummet med en liten klocka där trummor och gitarrer står.',
        hint:'Sök efter både instrumenten och den lilla klockan i rummet.',
        why:'Trummorna, gitarrerna och klockan finns i samma rum. Det är platsen i ledtråden.'
      },
      {
        description:'Lampor hänger över ett öppet golv med plats att dansa.',
        clue:'Hitta det öppna golvet där du kan dansa under lamporna.',
        hint:'Leta efter golvet med gott om dansplats och lampor ovanför.',
        why:'Det öppna golvet har plats för dans under lamporna. Båda kännetecknen stämmer.'
      },
      {
        description:'En grupp musiker står på en scen vid en mikrofon.',
        clue:'Sök efter en hel grupp musiker som står tillsammans vid en mikrofon.',
        hint:'Välj platsen med flera musiker och en mikrofon.',
        why:'Här står flera musiker tillsammans vid mikrofonen. Ledtråden beskriver en grupp, så den ensamma musikern passar inte.'
      }
    ]
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
    rows.forEach(Object.freeze);Object.freeze(rows);
  }
  for(const item of Object.values(SMALL_FINDS))Object.freeze(item);
  return Object.freeze({DATA:Object.freeze(DATA),SMALL_FINDS:Object.freeze(SMALL_FINDS)});
});
