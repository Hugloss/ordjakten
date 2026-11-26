/* Begreppskartan – authored semantic relations, not inferred from distractors.
 * Relations are contextual; a related word is not automatically interchangeable.
 * Practice observations are separate from quizzes and other learning evidence. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.OrdjaktenConcepts=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const DAY=86400000,LIMIT=3;
  const TYPES=Object.freeze({similar:{icon:'🤝',label:'Liknande ord'},contrast:{icon:'↔️',label:'Motsatser och kontraster'},
    nuance:{icon:'🔍',label:'Små betydelseskillnader'},category:{icon:'🧺',label:'Ordgrupper'},context:{icon:'🌍',label:'Ord i olika sammanhang'}});
  const GROUPS=Object.freeze([
  {
    "id": "bk-01",
    "type": "similar",
    "title": "Nästan samma ljud när vi äter",
    "starter": true,
    "words": [
      "sv-0006",
      "sv-0032"
    ],
    "explanation": "Knaprig och frasig beskriver båda något sprött som låter när man äter. Knaprig betonar knastret, frasig ofta ett lätt frasande.",
    "questions": [
      {
        "id": "bk-01-1",
        "prompt": "Vilket ord liknar knaprig när du beskriver en spröd brödskorpa?",
        "answer": "sv-0032",
        "options": [
          "sv-0032",
          "sv-0033",
          "sv-0011"
        ],
        "why": "En frasig brödskorpa ger ett sprött ljud, ungefär som något knaprigt."
      },
      {
        "id": "bk-01-2",
        "prompt": "Vilket ord ligger nära frasig när du beskriver ett kex som knastrar?",
        "answer": "sv-0006",
        "options": [
          "sv-0006",
          "sv-0031",
          "sv-0015"
        ],
        "why": "Knaprig beskriver ett sprött knastrande när du biter."
      }
    ]
  },
  {
    "id": "bk-02",
    "type": "similar",
    "title": "Saker vi behöver vara rädda om",
    "starter": true,
    "words": [
      "sv-0012",
      "sv-0093"
    ],
    "explanation": "Skör och ömtålig ligger nära varandra. Skör betonar att något lätt går sönder; ömtålig kan också handla om andra skador.",
    "questions": [
      {
        "id": "bk-02-1",
        "prompt": "Vilket ord ligger nära skör, till exempel om ett glas som lätt går sönder?",
        "answer": "sv-0093",
        "options": [
          "sv-0093",
          "sv-0064",
          "sv-0025"
        ],
        "why": "Ett ömtåligt glas behöver hanteras varsamt."
      },
      {
        "id": "bk-02-2",
        "prompt": "Vilket ord liknar ömtålig och betonar att något lätt kan gå sönder?",
        "answer": "sv-0012",
        "options": [
          "sv-0012",
          "sv-0014",
          "sv-0021"
        ],
        "why": "Skör betyder att något lätt kan gå sönder."
      }
    ]
  },
  {
    "id": "bk-03",
    "type": "similar",
    "title": "Behåll lugnet",
    "starter": true,
    "words": [
      "ut-0003",
      "ut-0018"
    ],
    "explanation": "Ha is i magen och hålla huvudet kallt används båda bildligt om att behålla lugnet. Det första betonar att inte förhasta sig, det andra att tänka klokt under stress.",
    "questions": [
      {
        "id": "bk-03-1",
        "prompt": "Vilket uttryck ligger nära ha is i magen när det blir stressigt?",
        "answer": "ut-0018",
        "options": [
          "ut-0018",
          "ut-0009",
          "ut-0021"
        ],
        "why": "Att hålla huvudet kallt betyder att tänka lugnt och klokt."
      },
      {
        "id": "bk-03-2",
        "prompt": "Vilket uttryck ligger nära hålla huvudet kallt när du väntar på rätt tillfälle?",
        "answer": "ut-0003",
        "options": [
          "ut-0003",
          "ut-0011",
          "ut-0020"
        ],
        "why": "Att ha is i magen handlar om att behålla lugnet och inte skynda i onödan."
      }
    ]
  },
  {
    "id": "bk-04",
    "type": "contrast",
    "title": "Varmt och kallt",
    "starter": true,
    "words": [
      "sv-0052",
      "sv-0053"
    ],
    "explanation": "Iskall och het kan beskriva motsatta temperaturer, till exempel hos en dryck.",
    "questions": [
      {
        "id": "bk-04-1",
        "prompt": "Vilket ord beskriver motsatsen till iskall när vi pratar om en dryck?",
        "answer": "sv-0053",
        "options": [
          "sv-0053",
          "sv-0015",
          "sv-0014"
        ],
        "why": "Het betyder mycket varm."
      },
      {
        "id": "bk-04-2",
        "prompt": "Vilket ord beskriver motsatsen till het när vi pratar om en dryck?",
        "answer": "sv-0052",
        "options": [
          "sv-0052",
          "sv-0033",
          "sv-0007"
        ],
        "why": "Iskall betyder mycket kall."
      }
    ]
  },
  {
    "id": "bk-05",
    "type": "contrast",
    "title": "Lugn och rörelse",
    "starter": true,
    "words": [
      "sv-0083",
      "sv-0084"
    ],
    "explanation": "En plats kan vara fridfull eller livlig. Fridfull betonar lugn; livlig betonar rörelse och energi. Det är en kontrast i en miljö, inte en regel för alla sammanhang.",
    "questions": [
      {
        "id": "bk-05-1",
        "prompt": "Vilket ord ger störst kontrast till en fridfull plats när det handlar om rörelse och energi?",
        "answer": "sv-0084",
        "options": [
          "sv-0084",
          "sv-0070",
          "sv-0076"
        ],
        "why": "Livlig betyder att det finns mycket rörelse och energi."
      },
      {
        "id": "bk-05-2",
        "prompt": "Vilket ord passar en lugn plats i kontrast till en livlig skolgård?",
        "answer": "sv-0083",
        "options": [
          "sv-0083",
          "sv-0021",
          "sv-0065"
        ],
        "why": "Fridfull betyder lugn och utan störningar."
      }
    ]
  },
  {
    "id": "bk-06",
    "type": "contrast",
    "title": "Fortsätta eller ge upp",
    "starter": true,
    "words": [
      "sv-0108",
      "ut-0015"
    ],
    "explanation": "Att vara ihärdig innebär att fortsätta trots svårigheter. Att kasta in handduken betyder att sluta försöka. De beskriver olika sätt att möta en motgång.",
    "questions": [
      {
        "id": "bk-06-1",
        "prompt": "Vilket uttryck beskriver att göra tvärtom mot att fortsätta kämpa ihärdigt?",
        "answer": "ut-0015",
        "options": [
          "ut-0015",
          "ut-0017",
          "ut-0011"
        ],
        "why": "Att kasta in handduken betyder att ge upp."
      },
      {
        "id": "bk-06-2",
        "prompt": "Vilket ord beskriver den som fortsätter kämpa trots motgångar i stället för att kasta in handduken?",
        "answer": "sv-0108",
        "options": [
          "sv-0108",
          "sv-0095",
          "sv-0073"
        ],
        "why": "Ihärdig handlar om att fortsätta mot ett mål trots motgångar."
      }
    ]
  },
  {
    "id": "bk-07",
    "type": "nuance",
    "title": "Två sätt att vara noga",
    "starter": true,
    "words": [
      "sv-0088",
      "sv-0094"
    ],
    "explanation": "Varsam betonar hur man hanterar något utan att skada det. Försiktig betonar att tänka på risker. Samma person kan vara både varsam och försiktig.",
    "questions": [
      {
        "id": "bk-07-1",
        "prompt": "Vilket ord betonar att hantera något ömtåligt utan att skada det?",
        "answer": "sv-0088",
        "options": [
          "sv-0088",
          "sv-0092",
          "sv-0086"
        ],
        "why": "Varsam handlar särskilt om hur något hanteras."
      },
      {
        "id": "bk-07-2",
        "prompt": "Vilket ord betonar att tänka på riskerna innan du går ut på hal is?",
        "answer": "sv-0094",
        "options": [
          "sv-0094",
          "sv-0076",
          "sv-0071"
        ],
        "why": "Försiktig handlar om att ta hänsyn till risker."
      }
    ]
  },
  {
    "id": "bk-08",
    "type": "nuance",
    "title": "Sällan eller kort tid?",
    "starter": true,
    "words": [
      "sv-0092",
      "sv-0109"
    ],
    "explanation": "Ovanlig handlar om hur ofta något förekommer. Tillfällig handlar om hur länge något varar. Något kan vara både ovanligt och tillfälligt.",
    "questions": [
      {
        "id": "bk-08-1",
        "prompt": "En fjäril syns nästan aldrig här. Vilket ord handlar om hur sällan den förekommer?",
        "answer": "sv-0092",
        "options": [
          "sv-0092",
          "sv-0109",
          "sv-0073"
        ],
        "why": "Ovanlig beskriver hur sällan något förekommer, inte hur länge det varar."
      },
      {
        "id": "bk-08-2",
        "prompt": "En vikarie arbetar bara i dag. Vilket ord handlar om att något varar en begränsad tid?",
        "answer": "sv-0109",
        "options": [
          "sv-0109",
          "sv-0092",
          "sv-0074"
        ],
        "why": "Tillfällig beskriver en begränsad tid."
      }
    ]
  },
  {
    "id": "bk-09",
    "type": "nuance",
    "title": "Kämpa vidare eller stå fast",
    "starter": false,
    "words": [
      "sv-0077",
      "sv-0108",
      "sv-0096"
    ],
    "explanation": "Envis kan handla om att inte ge upp eller ändra sig. Ihärdig betonar fortsatt arbete mot ett mål. Obeveklig betonar att inte låta sig övertalas.",
    "questions": [
      {
        "id": "bk-09-1",
        "prompt": "Vilket ord betonar fortsatt arbete mot ett mål trots motgångar?",
        "answer": "sv-0108",
        "options": [
          "sv-0108",
          "sv-0096",
          "sv-0101"
        ],
        "why": "Ihärdig betonar uthålligt arbete; obeveklig betonar att inte låta sig påverkas."
      },
      {
        "id": "bk-09-2",
        "prompt": "Vilket ord betonar att någon inte låter sig övertalas?",
        "answer": "sv-0096",
        "options": [
          "sv-0096",
          "sv-0108",
          "sv-0102"
        ],
        "why": "Obeveklig betyder att inte låta sig påverkas eller övertalas."
      }
    ]
  },
  {
    "id": "bk-10",
    "type": "nuance",
    "title": "Känslan och det som väcker den",
    "starter": false,
    "words": [
      "sv-0060",
      "sv-0105"
    ],
    "explanation": "Förvånad beskriver hur någon känner sig. Häpnadsväckande beskriver något som väcker stark förundran eller förvåning.",
    "questions": [
      {
        "id": "bk-10-1",
        "prompt": "Vilket ord beskriver personen som reagerar på en oväntad present?",
        "answer": "sv-0060",
        "options": [
          "sv-0060",
          "sv-0105",
          "sv-0098"
        ],
        "why": "Personen blir förvånad. Häpnadsväckande beskriver i stället något som väcker förundran."
      },
      {
        "id": "bk-10-2",
        "prompt": "Vilket ord beskriver en händelse som väcker mycket stark förundran?",
        "answer": "sv-0105",
        "options": [
          "sv-0105",
          "sv-0060",
          "sv-0109"
        ],
        "why": "En häpnadsväckande händelse gör människor mycket förundrade."
      }
    ]
  },
  {
    "id": "bk-11",
    "type": "category",
    "title": "Väderord",
    "starter": true,
    "words": [
      "sv-0046",
      "sv-0047",
      "sv-0048",
      "sv-0049",
      "sv-0050",
      "sv-0051"
    ],
    "explanation": "Regnig, snöig, solig, molnig, dimmig och åskig beskriver olika slags väder. De kan förekomma tillsammans.",
    "questions": [
      {
        "id": "bk-11-1",
        "prompt": "Vilket ord hör till väderorden?",
        "answer": "sv-0051",
        "options": [
          "sv-0051",
          "sv-0034",
          "sv-0073"
        ],
        "why": "Åskig beskriver väder med åska, ofta med blixtar."
      },
      {
        "id": "bk-11-2",
        "prompt": "Vilket ord beskriver väder med mycket moln på himlen?",
        "answer": "sv-0049",
        "options": [
          "sv-0049",
          "sv-0066",
          "sv-0031"
        ],
        "why": "Molnig handlar om moln på himlen."
      }
    ]
  },
  {
    "id": "bk-12",
    "type": "category",
    "title": "Former",
    "starter": true,
    "words": [
      "sv-0016",
      "sv-0034",
      "sv-0066",
      "sv-0067",
      "sv-0065"
    ],
    "explanation": "Rund, avlång, fyrkantig, triangelformad och spetsig handlar om form. En sak kan ha flera av dessa egenskaper.",
    "questions": [
      {
        "id": "bk-12-1",
        "prompt": "Vilket ord hör till formerna?",
        "answer": "sv-0067",
        "options": [
          "sv-0067",
          "sv-0014",
          "sv-0046"
        ],
        "why": "Triangelformad beskriver en form med tre hörn och tre sidor."
      },
      {
        "id": "bk-12-2",
        "prompt": "Vilket ord beskriver formen på något som är mycket längre än det är brett?",
        "answer": "sv-0034",
        "options": [
          "sv-0034",
          "sv-0052",
          "sv-0026"
        ],
        "why": "Avlång beskriver proportionerna hos en form."
      }
    ]
  },
  {
    "id": "bk-13",
    "type": "category",
    "title": "Så rör vi oss",
    "starter": true,
    "words": [
      "sv-0008",
      "sv-0035",
      "sv-0054",
      "sv-0055",
      "sv-0057"
    ],
    "explanation": "Studsande, virvlande, flygande, simmande och springande beskriver sätt att röra sig.",
    "questions": [
      {
        "id": "bk-13-1",
        "prompt": "Vilket ord hör till ordgruppen rörelser?",
        "answer": "sv-0055",
        "options": [
          "sv-0055",
          "sv-0069",
          "sv-0024"
        ],
        "why": "Simmande betyder att ta sig fram genom vatten."
      },
      {
        "id": "bk-13-2",
        "prompt": "Vilket rörelseord beskriver något som snurrar runt?",
        "answer": "sv-0035",
        "options": [
          "sv-0035",
          "sv-0054",
          "sv-0008"
        ],
        "why": "Virvlande beskriver en snurrande rörelse."
      }
    ]
  },
  {
    "id": "bk-14",
    "type": "category",
    "title": "Känslor och reaktioner",
    "starter": true,
    "words": [
      "sv-0060",
      "sv-0061",
      "sv-0063",
      "sv-0085",
      "sv-0086",
      "sv-0095"
    ],
    "explanation": "Förvånad, skrämd, glädjefylld, förtjust, förargad och lättad beskriver känslor eller reaktioner. Känslor kan finnas samtidigt.",
    "questions": [
      {
        "id": "bk-14-1",
        "prompt": "Vilket ord beskriver en känsla i stället för en form eller en yta?",
        "answer": "sv-0086",
        "options": [
          "sv-0086",
          "sv-0019",
          "sv-0066"
        ],
        "why": "Förargad betyder lite arg eller irriterad."
      },
      {
        "id": "bk-14-2",
        "prompt": "Vilket känsloord beskriver när en oro försvinner?",
        "answer": "sv-0095",
        "options": [
          "sv-0095",
          "sv-0085",
          "sv-0060"
        ],
        "why": "Lättad är känslan av lugn efter att en oro försvunnit."
      }
    ]
  },
  {
    "id": "bk-15",
    "type": "context",
    "title": "När sikten förändras",
    "starter": true,
    "words": [
      "sv-0003",
      "sv-0044",
      "sv-0050"
    ],
    "explanation": "Genomskinlig handlar om att kunna se igenom något. Grumlig beskriver en oklar vätska. Dimmig beskriver luften när dimma gör sikten dålig.",
    "questions": [
      {
        "id": "bk-15-1",
        "prompt": "Det går inte att se långt över ängen eftersom det finns dimma i luften. Vilket ord passar luften?",
        "answer": "sv-0050",
        "options": [
          "sv-0050",
          "sv-0044",
          "sv-0003"
        ],
        "why": "Dimmig handlar om dimma i luften; grumlig om en oklar vätska."
      },
      {
        "id": "bk-15-2",
        "prompt": "Små lerpartiklar flyter i vattenglaset. Vilket ord beskriver vätskan?",
        "answer": "sv-0044",
        "options": [
          "sv-0044",
          "sv-0050",
          "sv-0003"
        ],
        "why": "Grumlig beskriver en vätska där små partiklar försämrar sikten."
      }
    ]
  },
  {
    "id": "bk-16",
    "type": "context",
    "title": "Ljus från olika håll",
    "starter": true,
    "words": [
      "sv-0007",
      "sv-0018",
      "sv-0037"
    ],
    "explanation": "Glittrig beskriver något som glimmar i ljus. Lysande kan beskriva något som ger ifrån sig ljus. Speglande beskriver hur en yta återger en bild.",
    "questions": [
      {
        "id": "bk-16-1",
        "prompt": "I sjön syns en tydlig bild av träden. Vilket ord beskriver vattenytan?",
        "answer": "sv-0037",
        "options": [
          "sv-0037",
          "sv-0018",
          "sv-0039"
        ],
        "why": "En speglande yta återger en bild genom att reflektera ljus."
      },
      {
        "id": "bk-16-2",
        "prompt": "En lampa ger själv ifrån sig ljus och lyser upp rummet. Vilket ord passar bäst?",
        "answer": "sv-0018",
        "options": [
          "sv-0018",
          "sv-0007",
          "sv-0037"
        ],
        "why": "Lysande betonar här att lampan ger ifrån sig ljus."
      }
    ]
  },
  {
    "id": "bk-17",
    "type": "context",
    "title": "Kylda saker och bildliga uttryck",
    "starter": true,
    "words": [
      "sv-0052",
      "sv-0070",
      "ut-0003"
    ],
    "explanation": "Iskall kan beskriva en mycket kall sak. Frusen kan beskriva någon som känner sig kall. Ha is i magen är ett bildligt uttryck om lugn, inte om kroppstemperatur.",
    "questions": [
      {
        "id": "bk-17-1",
        "prompt": "Du väntar lugnt på din tur utan att förhasta dig. Vilket uttryck passar?",
        "answer": "ut-0003",
        "options": [
          "ut-0003",
          "sv-0052",
          "sv-0070"
        ],
        "why": "Att ha is i magen betyder bildligt att behålla lugnet."
      },
      {
        "id": "bk-17-2",
        "prompt": "Du står ute i kylan och känner dig mycket kall. Vilket ord beskriver känslan?",
        "answer": "sv-0070",
        "options": [
          "sv-0070",
          "ut-0003",
          "sv-0063"
        ],
        "why": "Frusen beskriver någon som känner sig mycket kall."
      }
    ]
  },
  {
    "id": "bk-18",
    "type": "context",
    "title": "Två uttryck med hålla",
    "starter": true,
    "words": [
      "ut-0004",
      "ut-0006",
      "ut-0018"
    ],
    "explanation": "Hålla tummarna handlar om att hoppas. Hålla ett öga på handlar om uppsikt. Hålla huvudet kallt handlar om att tänka lugnt under stress.",
    "questions": [
      {
        "id": "bk-18-1",
        "prompt": "Du hoppas att din kompis lyckas i tävlingen. Vilket uttryck passar?",
        "answer": "ut-0004",
        "options": [
          "ut-0004",
          "ut-0006",
          "ut-0018"
        ],
        "why": "Hålla tummarna betyder att hoppas att något går bra."
      },
      {
        "id": "bk-18-2",
        "prompt": "Du passar hunden medan din kompis hämtar jackan. Vilket uttryck passar?",
        "answer": "ut-0006",
        "options": [
          "ut-0006",
          "ut-0004",
          "ut-0018"
        ],
        "why": "Hålla ett öga på betyder att hålla uppsikt över något."
      }
    ]
  }
]);
  const count=n=>Number.isInteger(n)&&n>=0?Math.min(n,9999):0;
  const time=n=>Number.isSafeInteger(n)&&n>=0&&n<=4102444800000?n:0;
  const text=value=>typeof value==='string'&&value.trim().length>0;
  function stamp(parts){
    let hash=2166136261;
    for(const char of JSON.stringify(parts)){hash=Math.imul(hash^char.charCodeAt(0),16777619);}
    return (hash>>>0).toString(16).padStart(8,'0');
  }
  function catalog(words,data=GROUPS){
    const byId=new Map(words.map(word=>[word.id,word]));
    const groups=[],tasks=[],errors=[],groupIds=new Set(),questionIds=new Set(),prompts=new Set();
    for(const group of data){
      if(!group||!/^bk-\d{2}$/.test(group.id)||groupIds.has(group.id)||!Object.hasOwn(TYPES,group.type)||
        typeof group.starter!=='boolean'||!text(group.title)||!text(group.explanation)||
        !Array.isArray(group.words)||group.words.length<2||group.words.length>6||
        new Set(group.words).size!==group.words.length||group.words.some(id=>!byId.has(id))||
        !Array.isArray(group.questions)||group.questions.length!==2){
        errors.push('Ogiltigt ordsamband: '+group?.id);continue;
      }
      const localIds=new Set(),localPrompts=new Set(),rows=[];
      for(const q of group.questions){
        const prompt=text(q?.prompt)?q.prompt.trim().toLocaleLowerCase('sv-SE'):'';
        if(!q||!new RegExp('^'+group.id+'-[12]$').test(q.id)||questionIds.has(q.id)||localIds.has(q.id)||
          !prompt||prompts.has(prompt)||localPrompts.has(prompt)||!text(q.why)||
          !group.words.includes(q.answer)||!Array.isArray(q.options)||q.options.length!==3||
          new Set(q.options).size!==3||q.options.some(id=>!byId.has(id))||!q.options.includes(q.answer)){
          errors.push('Ogiltig sambandsfråga: '+q?.id);continue;
        }
        const options=q.options.map(id=>({id,label:byId.get(id).name,correct:id===q.answer}));
        if(new Set(options.map(option=>option.label.toLocaleLowerCase('sv-SE'))).size!==3){
          errors.push('Dubblerat svar: '+q.id);continue;
        }
        localIds.add(q.id);localPrompts.add(prompt);
        rows.push({...q,groupId:group.id,type:group.type,starter:group.starter,options,
          stamp:stamp([group.id,group.type,group.words,group.explanation,q,
            [...new Set([...group.words,...q.options])].map(id=>[id,byId.get(id).name,byId.get(id).definition])])});
      }
      if(rows.length!==2||new Set(rows.map(q=>q.answer)).size!==2){
        errors.push('Behöver två olika målord: '+group.id);continue;
      }
      groupIds.add(group.id);
      for(const q of rows){questionIds.add(q.id);prompts.add(q.prompt.trim().toLocaleLowerCase('sv-SE'));}
      groups.push({...group,words:group.words.map(id=>byId.get(id)),questions:rows});tasks.push(...rows);
    }
    return {groups,tasks,errors};
  }
  function sanitize(raw,tasks){
    const out=Object.create(null);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return out;
    for(const task of tasks){
      const card=raw[task.id];
      if(!card||typeof card!=='object'||Array.isArray(card)||card.stamp!==task.stamp)continue;
      const attempts=count(card.attempts),lastAt=time(card.lastAt);
      if(!attempts||!lastAt||!['direct','supported','previewed'].includes(card.last))continue;
      out[task.id]={stamp:task.stamp,attempts,lastAt,last:card.last,
        direct:Math.min(attempts,Math.max(Number(card.last==='direct'),count(card.direct)))};
    }
    return out;
  }
  function plan(content,raw={},known=new Set(),now=Date.now(),random=Math.random,groupId=null,wordId=null){
    const progress=sanitize(raw,content.tasks);
    const eligible=new Set(content.groups.filter(group=>groupId?group.id===groupId:
      (!wordId||group.words.some(word=>word.id===wordId))&&
      (wordId||group.starter||group.words.some(word=>known.has(word.id))||
        group.questions.some(task=>progress[task.id]))).map(group=>group.id));
    const rows=content.tasks.filter(task=>eligible.has(task.groupId)).map(task=>({task,card:progress[task.id],
      dueAt:progress[task.id]?progress[task.id].lastAt+DAY:0,draw:random()}));
    const ready=rows.filter(row=>row.dueAt<=now);
    const rank=row=>row.card?.last==='supported'?0:!row.card?1:row.card.last==='previewed'?2:3;
    ready.sort((a,b)=>rank(a)-rank(b)||a.dueAt-b.dueAt||
      Number(known.has(b.task.answer))-Number(known.has(a.task.answer))||a.draw-b.draw||a.task.id.localeCompare(b.task.id));
    const chosen=[],groups=new Set();
    for(const row of ready){
      if(groups.has(row.task.groupId))continue;
      chosen.push(row.task);groups.add(row.task.groupId);
      if(chosen.length===(groupId?1:LIMIT))break;
    }
    return {round:chosen,ready:ready.length,waiting:rows.length-ready.length};
  }
  function record(raw,tasks,id,outcome,now=Date.now()){
    const task=tasks.find(row=>row.id===id),at=time(now);
    if(!task||!at||!['direct','supported','previewed'].includes(outcome))return raw;
    const out=sanitize(raw,tasks),prior=out[id];
    if(prior&&at<prior.lastAt+DAY)return raw;
    out[id]={stamp:task.stamp,attempts:Math.min(9999,(prior?.attempts||0)+1),lastAt:at,last:outcome,
      direct:Math.min(9999,(prior?.direct||0)+Number(outcome==='direct'))};
    return out;
  }
  function outcome(task,id,attempts,previewed=false){
    if(!task||!task.options.some(option=>option.id===id)||
      !Number.isInteger(attempts)||attempts<0||attempts>=2)return null;
    const correct=id===task.answer;
    if(!correct&&attempts===0)return {step:'retry',outcome:null};
    return {step:correct?'complete':'guided',outcome:previewed?'previewed':correct&&attempts===0?'direct':'supported'};
  }
  function summary(tasks,progress,now=Date.now()){
    const clean=sanitize(progress,tasks),cards=Object.values(clean);
    return {total:tasks.length,seen:cards.length,direct:cards.filter(card=>card.direct>0).length,
      needsPractice:cards.some(card=>card.last==='supported'&&card.lastAt+DAY<=now),
      ready:tasks.some(task=>!clean[task.id]||clean[task.id].lastAt+DAY<=now)};
  }
  function forWord(content,id){return content.groups.filter(group=>group.words.some(word=>word.id===id));}
  function shuffle(items,random=Math.random){
    const copy=items.slice();
    for(let i=copy.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[copy[i],copy[j]]=[copy[j],copy[i]];}
    return copy;
  }
  return {DAY,LIMIT,TYPES,GROUPS,catalog,sanitize,plan,record,outcome,summary,forWord,shuffle};
});
