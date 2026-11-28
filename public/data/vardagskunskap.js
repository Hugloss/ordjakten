/* Kanonisk, originalskriven frågebank. Duplicera inte dessa frågor i spelkoden. */
(function(root){
  'use strict';
  const data={
  "bankId": "vardagskunskap",
  "version": 1,
  "language": "sv-SE",
  "topics": [
    {
      "id": "manniskokroppen",
      "name": "Människokroppen",
      "icon": "🫀",
      "description": "Kroppens delar, sinnen, rörelse och hälsa."
    },
    {
      "id": "naturen",
      "name": "Naturen",
      "icon": "🌱",
      "description": "Växter, djur, kretslopp och hur vi tar hand om naturen."
    },
    {
      "id": "koket",
      "name": "Köket",
      "icon": "🥕",
      "description": "Matlagning, råvaror, mått och säkerhet."
    },
    {
      "id": "hemmet",
      "name": "Hemmet och trygghet",
      "icon": "🏠",
      "description": "Hålla ordning, upptäcka risker och be om hjälp."
    },
    {
      "id": "vader",
      "name": "Väder och årstider",
      "icon": "🌦️",
      "description": "Temperatur, regn, vind och förändringar ute."
    },
    {
      "id": "trafiken",
      "name": "Trafiken",
      "icon": "🚲",
      "description": "Säkra val till fots, på cykel och i trafiken."
    },
    {
      "id": "samarbete",
      "name": "Vänskap och samarbete",
      "icon": "🤝",
      "description": "Förstå känslor, lyssna och lösa problem tillsammans."
    },
    {
      "id": "tid",
      "name": "Tid och planering",
      "icon": "🗓️",
      "description": "Tid, ordningsföljd och att planera dagen."
    },
    {
      "id": "pengar",
      "name": "Pengar i vardagen",
      "icon": "🪙",
      "description": "Priser, växel, sparande och kloka val."
    },
    {
      "id": "digitalt",
      "name": "Digital vardag",
      "icon": "💻",
      "description": "Länkar, lösenord, bilder och kritiskt tänkande."
    }
  ],
  "questions": [
    {
      "id": "vk-0001",
      "topicId": "manniskokroppen",
      "level": 1,
      "stimulus": "Efter att Kim har sprungit uppför en backe andas Kim snabbare.",
      "prompt": "Vilka organ tar upp syre från luften så att syret kan gå vidare till blodet?",
      "choices": [
        "Lungorna",
        "Magsäcken",
        "Njurarna",
        "Skelettet"
      ],
      "correctIndex": 0,
      "explanation": "I lungorna förs syre från luften över till blodet. Hjärtat pumpar sedan runt blodet i kroppen.",
      "skill": "kroppens-funktioner",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0002",
      "topicId": "manniskokroppen",
      "level": 1,
      "stimulus": "Noa känner ett dunkande i bröstet efter att ha hoppat hopprep.",
      "prompt": "Vad gör hjärtat?",
      "choices": [
        "Bryter ner maten",
        "Pumpar blod genom kroppen",
        "Skapar luft i lungorna",
        "Styr hur benen växer"
      ],
      "correctIndex": 1,
      "explanation": "Hjärtat är en muskel som pumpar blod. Blodet transporterar bland annat syre och näring.",
      "skill": "kroppens-funktioner",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0003",
      "topicId": "manniskokroppen",
      "level": 2,
      "stimulus": "Det är varmt ute och Mira blir svettig när hon leker.",
      "prompt": "Varför hjälper svett kroppen att svalna?",
      "choices": [
        "Den gör att kroppen slutar behöva vatten",
        "Den stänger av kroppens muskler",
        "När svetten avdunstar försvinner värme från huden",
        "Den får hjärtat att stanna en stund"
      ],
      "correctIndex": 2,
      "explanation": "När svett avdunstar från huden tas värme med. Därför kan kroppen kylas ner.",
      "skill": "orsak-och-verkan",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0004",
      "topicId": "manniskokroppen",
      "level": 2,
      "stimulus": "Efter toalettbesöket ska en grupp barn äta mellanmål.",
      "prompt": "Varför är det viktigt att tvätta händerna med tvål?",
      "choices": [
        "För att fingrarna ska bli starkare",
        "För att maten ska bli varmare",
        "För att kroppen ska kunna sova bättre",
        "För att minska mängden smuts och smittämnen på händerna"
      ],
      "correctIndex": 3,
      "explanation": "Tvål och vatten hjälper till att få bort smuts och smittämnen. Det minskar risken att föra dem vidare till maten.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0005",
      "topicId": "manniskokroppen",
      "level": 3,
      "stimulus": "Sana böjer armen och lyfter sin ryggsäck.",
      "prompt": "Vad gör musklerna när hon böjer armen?",
      "choices": [
        "De drar i skelettet så att leden rör sig",
        "De gör att armens ben blir kortare",
        "De fyller skelettet med luft",
        "De stänger av lederna"
      ],
      "correctIndex": 0,
      "explanation": "Muskler drar i ben via senor och får leder att röra sig. Benen blir inte kortare när armen böjs.",
      "skill": "kroppens-funktioner",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0006",
      "topicId": "manniskokroppen",
      "level": 3,
      "stimulus": "Olle har lekt länge och märker att det är svårt att koncentrera sig när han är trött.",
      "prompt": "Vilken vana hjälper hjärnan och kroppen att återhämta sig?",
      "choices": [
        "Att hoppa över vilan varje dag",
        "Att få tillräckligt med sömn",
        "Att aldrig röra på sig",
        "Att låta bli att dricka vatten"
      ],
      "correctIndex": 1,
      "explanation": "Sömn hjälper hjärnan och kroppen att vila och återhämta sig. Hur mycket sömn man behöver kan variera.",
      "skill": "orsak-och-verkan",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0007",
      "topicId": "naturen",
      "level": 1,
      "stimulus": "I skolan sätter klassen en frösådd i fönstret och vattnar jorden.",
      "prompt": "Vad behöver många gröna växter för att växa och bilda sin näring?",
      "choices": [
        "Bara jord utan vatten",
        "Bara vind",
        "Ljus, vatten och luft",
        "En ficklampa som alltid är avstängd"
      ],
      "correctIndex": 2,
      "explanation": "Gröna växter använder ljus, vatten och koldioxid från luften i fotosyntesen. De behöver också näringsämnen.",
      "skill": "naturens-samband",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0008",
      "topicId": "naturen",
      "level": 1,
      "stimulus": "En humla flyger från en blomma till en annan.",
      "prompt": "Vad kan humlan hjälpa blommorna med?",
      "choices": [
        "Att frysa jorden",
        "Att göra regnet surare",
        "Att byta färg på bladen",
        "Att flytta pollen mellan blommor"
      ],
      "correctIndex": 3,
      "explanation": "När humlan besöker blommor kan pollen flyttas mellan dem. Det kan hjälpa växter att bilda frön.",
      "skill": "naturens-samband",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0009",
      "topicId": "naturen",
      "level": 2,
      "stimulus": "På hösten faller löv till marken. Efter lång tid finns mindre kvar av dem.",
      "prompt": "Vad hjälper till att bryta ner döda löv?",
      "choices": [
        "Svampar, bakterier och småkryp",
        "Bara dagsljuset",
        "Fåglars vingslag",
        "Stenar som växer"
      ],
      "correctIndex": 0,
      "explanation": "Nedbrytare som svampar, bakterier och smådjur bryter ner döda växtdelar. Näringsämnen kan återgå till marken.",
      "skill": "naturens-samband",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0010",
      "topicId": "naturen",
      "level": 2,
      "stimulus": "I en äng äter harar gräs. Rävar kan i sin tur äta harar.",
      "prompt": "Vad är en möjlig följd om det plötsligt finns mycket mindre gräs?",
      "choices": [
        "Hararna får automatiskt mer mat",
        "Hararna kan få svårare att hitta mat",
        "Rävarna börjar tillverka gräs",
        "Alla djur byter genast bostad"
      ],
      "correctIndex": 1,
      "explanation": "Mindre gräs kan ge hararna mindre mat. Då kan även andra djur i näringskedjan påverkas.",
      "skill": "orsak-och-verkan",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0011",
      "topicId": "naturen",
      "level": 3,
      "stimulus": "Ett barn hittar en fjärilslarv på ett blad.",
      "prompt": "Vilken förändring kan larven genomgå innan den blir en vuxen fjäril?",
      "choices": [
        "Den blir en fisk",
        "Den blir en myra",
        "Den förpuppas och utvecklas",
        "Den blir ett nytt blad"
      ],
      "correctIndex": 2,
      "explanation": "Hos många fjärilar blir larven en puppa innan den vuxna fjärilen kommer fram.",
      "skill": "naturens-samband",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0012",
      "topicId": "naturen",
      "level": 3,
      "stimulus": "Efter picknicken ligger en plastförpackning kvar på marken.",
      "prompt": "Varför är det klokt att ta med förpackningen till en soptunna?",
      "choices": [
        "Därför att plast blir till jord direkt",
        "Därför att djuren måste ha plast att äta",
        "Därför att marken blir varmare av plast",
        "Därför att skräp kan skada djur och bli kvar länge i naturen"
      ],
      "correctIndex": 3,
      "explanation": "Skräp kan skada djur och spridas i miljön. Att ta med det hem eller lägga det rätt är ett sätt att ta ansvar.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0013",
      "topicId": "koket",
      "level": 1,
      "stimulus": "Ella ska hjälpa till att göra fruktsallad.",
      "prompt": "Vad är ett bra första steg innan hon tar i maten?",
      "choices": [
        "Tvätta händerna med tvål och vatten",
        "Smaka på allt med samma sked",
        "Lägga maten på golvet",
        "Låta disken stå framme"
      ],
      "correctIndex": 0,
      "explanation": "Rena händer minskar risken att smuts och smittämnen följer med till maten.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0014",
      "topicId": "koket",
      "level": 1,
      "stimulus": "Receptet säger att det behövs en deciliter vatten.",
      "prompt": "Vilket mått motsvarar en deciliter?",
      "choices": [
        "10 milliliter",
        "100 milliliter",
        "1 liter",
        "1000 milliliter"
      ],
      "correctIndex": 1,
      "explanation": "En deciliter är 100 milliliter. Tio deciliter är en liter.",
      "skill": "mata-och-jamfora",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0015",
      "topicId": "koket",
      "level": 2,
      "stimulus": "En vuxen har skurit rå kyckling på en skärbräda. Nu ska grönsaker skäras till en sallad som äts rå.",
      "prompt": "Vad är säkrast att göra med skärbrädan först?",
      "choices": [
        "Bara torka av med en torr handduk",
        "Lägga grönsakerna direkt ovanpå",
        "Diska skärbrädan ordentligt eller använda en ren annan",
        "Ställa skärbrädan på golvet"
      ],
      "correctIndex": 2,
      "explanation": "Rå kyckling kan bära bakterier. En ren skärbräda och rena redskap minskar risken att bakterier sprids till salladen.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0016",
      "topicId": "koket",
      "level": 2,
      "stimulus": "Vattnet kokar i kastrullen och bubblor stiger upp.",
      "prompt": "Vad händer när flytande vatten blir vattenånga?",
      "choices": [
        "Vattnet förvandlas till sand",
        "Vattnet blir en ny metall",
        "Vattnet slutar bestå av vatten",
        "Vattnet övergår från vätska till gas"
      ],
      "correctIndex": 3,
      "explanation": "Vid kokning kan vatten gå från flytande form till vattenånga, som är gas.",
      "skill": "orsak-och-verkan",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0017",
      "topicId": "koket",
      "level": 3,
      "stimulus": "En plåt har nyss tagits ut ur ugnen och är fortfarande het.",
      "prompt": "Vad är ett säkert sätt att hantera plåten?",
      "choices": [
        "Låta en vuxen använda ordentliga grytvantar",
        "Hålla i plåten med bara händerna",
        "Stänka vatten på handen och lyfta direkt",
        "Testa värmen med fingertoppen"
      ],
      "correctIndex": 0,
      "explanation": "Heta plåtar kan ge brännskador. En vuxen kan använda värmetåliga grytvantar och ställa plåten säkert.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0018",
      "topicId": "koket",
      "level": 3,
      "stimulus": "Det blir kokt ris över efter middagen. Familjen vill äta resterna en annan dag.",
      "prompt": "Vad är ett bra sätt att ta hand om riset?",
      "choices": [
        "Låta riset stå framme i rumstemperatur hela natten",
        "Kylla ner riset snabbt och ställa det i kylskåpet",
        "Blanda riset med smutsigt diskvatten",
        "Lägga riset i solen på balkongen"
      ],
      "correctIndex": 1,
      "explanation": "Kokt ris bör kylas ner snabbt och förvaras kallt, eftersom bakterier annars kan växa till. Be en vuxen hjälpa till.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0019",
      "topicId": "hemmet",
      "level": 1,
      "stimulus": "Brandvarnaren hemma börjar tjuta och det luktar rök.",
      "prompt": "Vilket är det viktigaste att göra?",
      "choices": [
        "Gömma sig under sängen",
        "Vänta tills larmet slutar",
        "Ta sig ut till en säker plats och larma en vuxen eller 112",
        "Öppna alla skåp för att leta efter rök"
      ],
      "correctIndex": 2,
      "explanation": "Vid rök eller brand ska man ta sig ut och stanna ute. Vid fara ringer man 112 när man är i säkerhet.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0020",
      "topicId": "hemmet",
      "level": 1,
      "stimulus": "Vattenkranen står och rinner fast ingen använder den.",
      "prompt": "Vad gör du bäst?",
      "choices": [
        "Låter vattnet rinna tills nästa dag",
        "Häller mer vatten i diskhon",
        "Sätter på en annan kran också",
        "Stänger kranen och säger till om den läcker"
      ],
      "correctIndex": 3,
      "explanation": "Genom att stänga kranen sparar man vatten. Om den läcker behöver en vuxen få veta det.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0021",
      "topicId": "hemmet",
      "level": 2,
      "stimulus": "Du ser ett eluttag och hittar en metallgem på golvet.",
      "prompt": "Vad är en säker regel?",
      "choices": [
        "Stoppa aldrig in föremål i eluttag",
        "Prova om gemet får plats",
        "Häll vatten i uttaget först",
        "Peta i uttaget med en nyckel"
      ],
      "correctIndex": 0,
      "explanation": "Eluttag kan ge farliga elstötar. Man ska aldrig stoppa in saker i dem.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0022",
      "topicId": "hemmet",
      "level": 2,
      "stimulus": "En flaska med rengöringsmedel står i ett skåp. Den har en färgglad etikett.",
      "prompt": "Vad gör du om du undrar vad den innehåller?",
      "choices": [
        "Smakar lite för att ta reda på det",
        "Frågar en vuxen och låter flaskan vara",
        "Häller över den i en läskflaska",
        "Blandar den med ett annat medel"
      ],
      "correctIndex": 1,
      "explanation": "Rengöringsmedel kan vara farliga. Låt en vuxen läsa etiketten och hantera produkten.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0023",
      "topicId": "hemmet",
      "level": 3,
      "stimulus": "Ett glas går sönder och det ligger vassa skärvor på köksgolvet.",
      "prompt": "Vad är klokast att göra?",
      "choices": [
        "Springa barfota förbi skärvorna",
        "Plocka upp allt med bara händerna",
        "Hålla andra borta och be en vuxen städa upp",
        "Trampa sönder de stora bitarna"
      ],
      "correctIndex": 2,
      "explanation": "Glasskärvor kan skära huden. Håll avstånd och be en vuxen ta hand om dem med rätt redskap.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0024",
      "topicId": "hemmet",
      "level": 3,
      "stimulus": "En okänd person ringer på dörren när ett barn är hemma utan vuxen i rummet.",
      "prompt": "Vilket val är klokast?",
      "choices": [
        "Öppna direkt utan att fråga",
        "Berätta sin adress för personen",
        "Släppa in personen för att vara artig",
        "Kontakta en ansvarig vuxen innan dörren öppnas"
      ],
      "correctIndex": 3,
      "explanation": "Du behöver inte öppna för en okänd person. Ta kontakt med en ansvarig vuxen om du är osäker.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0025",
      "topicId": "vader",
      "level": 1,
      "stimulus": "Det är kallt på morgonen och termometern visar minus fem grader.",
      "prompt": "Vad betyder minus fem grader?",
      "choices": [
        "Att temperaturen är fem grader under noll",
        "Att luften är fem grader varmare än noll",
        "Att det alltid kommer snöa",
        "Att vinden blåser fem meter per sekund"
      ],
      "correctIndex": 0,
      "explanation": "Minus fem grader betyder att temperaturen ligger fem grader under noll på Celsiusskalan.",
      "skill": "mata-och-jamfora",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0026",
      "topicId": "vader",
      "level": 1,
      "stimulus": "Prognosen visar att det kan regna på vägen till skolan.",
      "prompt": "Vilken sak är mest användbar att ta med?",
      "choices": [
        "Solglasögon för att stoppa regn",
        "Regnjacka eller paraply",
        "En extra badring",
        "En vinterskida"
      ],
      "correctIndex": 1,
      "explanation": "En regnjacka eller ett paraply hjälper dig att hålla dig torrare om det börjar regna.",
      "skill": "anvanda-kunskap",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0027",
      "topicId": "vader",
      "level": 2,
      "stimulus": "En vattenpöl på asfalten blir mindre under en torr, varm dag.",
      "prompt": "Vilken process förklarar att vattnet kan försvinna från pölen?",
      "choices": [
        "Frysning till is",
        "Att vattnet blir sten",
        "Avdunstning till vattenånga",
        "Att asfalten skapar nytt vatten"
      ],
      "correctIndex": 2,
      "explanation": "En del av vattnet kan avdunsta och bli vattenånga i luften. Det kan ske även när vattnet inte kokar.",
      "skill": "orsak-och-verkan",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0028",
      "topicId": "vader",
      "level": 2,
      "stimulus": "På hösten blir dagarna oftast kortare i Sverige.",
      "prompt": "Vad är en viktig orsak till att årstiderna förändras?",
      "choices": [
        "Att månen flyttar träden",
        "Att molnen alltid är mörkare",
        "Att solen slocknar lite på hösten",
        "Att jordaxelns lutning ändrar hur solljuset faller under året"
      ],
      "correctIndex": 3,
      "explanation": "Jordaxelns lutning gör att norra halvklotet får olika mycket dagsljus och solvärme under året.",
      "skill": "naturens-samband",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0029",
      "topicId": "vader",
      "level": 3,
      "stimulus": "Du är ute på ett öppet fält när åskan närmar sig.",
      "prompt": "Var är det säkrast att söka skydd?",
      "choices": [
        "Inomhus i en stadig byggnad",
        "Under ett ensamt högt träd",
        "Bredvid ett metallstängsel",
        "Mitt ute på den öppna marken"
      ],
      "correctIndex": 0,
      "explanation": "En stadig byggnad är ett bra skydd vid åska. Undvik öppna fält och ensamma höga träd.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0030",
      "topicId": "vader",
      "level": 3,
      "stimulus": "En flagga på skolgården blåser kraftigt åt ena hållet.",
      "prompt": "Vad visar flaggans rörelse främst?",
      "choices": [
        "Hur varmt vattnet är",
        "Att vinden rör luften åt ett visst håll",
        "Hur mycket solen väger",
        "Att det snart blir vinter"
      ],
      "correctIndex": 1,
      "explanation": "Vinden är luft som rör sig. En flagga kan visa åt vilket håll luften blåser.",
      "skill": "tolka-tecken",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0031",
      "topicId": "trafiken",
      "level": 1,
      "stimulus": "Ett barn kommer fram till ett övergångsställe på väg till skolan.",
      "prompt": "Vad bör barnet göra före det går över?",
      "choices": [
        "Springa direkt utan att titta",
        "Titta bara på mobilen",
        "Stanna upp, se åt båda hållen och försäkra sig om att det är säkert",
        "Vända ryggen mot bilarna"
      ],
      "correctIndex": 2,
      "explanation": "Ett övergångsställe gör inte att bilar alltid stannar. Se efter att det är säkert innan du går över.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0032",
      "topicId": "trafiken",
      "level": 1,
      "stimulus": "Nellie sätter på sig cykelhjälmen före en cykeltur.",
      "prompt": "Vad är hjälmens viktigaste uppgift?",
      "choices": [
        "Hjälpa cykeln att åka snabbare",
        "Skydda händerna mot kyla",
        "Göra att man aldrig kan falla",
        "Minska risken för huvudskador vid en olycka"
      ],
      "correctIndex": 3,
      "explanation": "En rätt använd cykelhjälm kan minska risken för skador på huvudet om man ramlar.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0033",
      "topicId": "trafiken",
      "level": 2,
      "stimulus": "Det är mörkt när familjen går längs en väg.",
      "prompt": "Varför är reflexer bra att använda?",
      "choices": [
        "De gör det lättare för förare att upptäcka dig",
        "De får bilen att bromsa automatiskt",
        "De ersätter behovet av att se sig för",
        "De fungerar bara när det är ljust"
      ],
      "correctIndex": 0,
      "explanation": "Reflexer syns när de träffas av till exempel billyktor och kan hjälpa förare att upptäcka någon i tid.",
      "skill": "orsak-och-verkan",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0034",
      "topicId": "trafiken",
      "level": 2,
      "stimulus": "En buss har säkerhetsbälten vid sätena.",
      "prompt": "Vad bör en passagerare göra när den sitter där?",
      "choices": [
        "Ta av bältet för att kunna resa sig snabbt",
        "Använda säkerhetsbältet",
        "Sitta på knä på sätet",
        "Hålla bältet i handen utan att knäppa det"
      ],
      "correctIndex": 1,
      "explanation": "När det finns bälte i bussen ska passageraren använda det. Bältet kan minska skador vid en kraftig inbromsning.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0035",
      "topicId": "trafiken",
      "level": 3,
      "stimulus": "En bil har stannat framför övergångsstället, men det finns ett körfält till bredvid.",
      "prompt": "Vad behöver du tänka på innan du går över?",
      "choices": [
        "Att alla andra fordon säkert också har stannat",
        "Att bilen bakom alltid ser dig",
        "Att ett fordon i nästa körfält kan komma och att du måste se dig för",
        "Att det är bäst att blunda när du går"
      ],
      "correctIndex": 2,
      "explanation": "Ett stillastående fordon kan skymma andra fordon. Kontrollera hela vägen och gå bara när det är säkert.",
      "skill": "tolka-situation",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0036",
      "topicId": "trafiken",
      "level": 3,
      "stimulus": "Du cyklar och ska svänga vänster vid en korsning.",
      "prompt": "Vilket förberedande beteende hjälper dig att svänga säkrare?",
      "choices": [
        "Bara titta ner på framhjulet",
        "Plötsligt svänga utan att se dig för",
        "Blunda och hålla hårt i styret",
        "Se dig om, visa vart du ska och följa trafikreglerna"
      ],
      "correctIndex": 3,
      "explanation": "Se dig omkring och visa avsikt i god tid. Hur du passerar korsningen beror på vägen och trafikläget.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0037",
      "topicId": "samarbete",
      "level": 1,
      "stimulus": "En kompis är tystare än vanligt på rasten.",
      "prompt": "Hur kan du ta reda på hur kompisen mår utan att gissa?",
      "choices": [
        "Fråga vänligt hur det är och lyssna på svaret",
        "Bestämma att kompisen måste vara arg",
        "Säga till alla att kompisen är ledsen",
        "Låtsas veta precis vad kompisen tänker"
      ],
      "correctIndex": 0,
      "explanation": "Människor kan vara tysta av många skäl. Genom att fråga och lyssna får du bättre veta vad kompisen vill berätta.",
      "skill": "tolka-situation",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0038",
      "topicId": "samarbete",
      "level": 1,
      "stimulus": "Två barn vill använda samma boll samtidigt.",
      "prompt": "Vilket sätt kan hjälpa dem att lösa problemet?",
      "choices": [
        "Att båda drar i bollen",
        "Att turas om eller komma överens om gemensamma regler",
        "Att en alltid bestämmer åt den andra",
        "Att lämna bollen gömd"
      ],
      "correctIndex": 1,
      "explanation": "Att föreslå turordning eller regler som båda accepterar kan göra leken rättvisare.",
      "skill": "samarbete",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0039",
      "topicId": "samarbete",
      "level": 2,
      "stimulus": "Sam frågar om en kram. Alex säger nej.",
      "prompt": "Vad bör Sam göra?",
      "choices": [
        "Kramas ändå för att visa vänskap",
        "Be andra övertala Alex",
        "Respektera svaret och låta bli att kramas",
        "Säga att Alex inte får vara med"
      ],
      "correctIndex": 2,
      "explanation": "Alla har rätt att säga nej till kroppskontakt. Ett nej ska respekteras även mellan vänner.",
      "skill": "granser-och-respekt",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0040",
      "topicId": "samarbete",
      "level": 2,
      "stimulus": "Någon råkar välta en kompis bygge så att det går sönder.",
      "prompt": "Vilket är ett bra sätt att ta ansvar?",
      "choices": [
        "Skylla på någon som inte var där",
        "Skratta och gå därifrån",
        "Säga att kompisen är för känslig",
        "Be om ursäkt och fråga om man kan hjälpa till att bygga upp igen"
      ],
      "correctIndex": 3,
      "explanation": "En ursäkt kan följas av en handling som försöker rätta till det som hänt.",
      "skill": "samarbete",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0041",
      "topicId": "samarbete",
      "level": 3,
      "stimulus": "Ett barn får inte vara med i en lek eftersom de andra redan har börjat.",
      "prompt": "Vad är ett omtänksamt nästa steg?",
      "choices": [
        "Fråga om barnet vill vara med och hjälpa gruppen hitta en plats i leken",
        "Säga åt barnet att aldrig fråga igen",
        "Gömma leksakerna för barnet",
        "Låtsas att barnet inte finns"
      ],
      "correctIndex": 0,
      "explanation": "Att bjuda in och försöka anpassa leken kan hjälpa fler att känna sig välkomna.",
      "skill": "samarbete",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0042",
      "topicId": "samarbete",
      "level": 3,
      "stimulus": "Du blir väldigt frustrerad när en skoluppgift känns svår.",
      "prompt": "Vad kan hjälpa dig att komma vidare?",
      "choices": [
        "Riva sönder uppgiften direkt",
        "Ta en kort paus och be om hjälp om det behövs",
        "Bestämma att du aldrig kan lära dig något",
        "Säga åt alla andra att sluta arbeta"
      ],
      "correctIndex": 1,
      "explanation": "En liten paus och hjälp med nästa steg kan göra en svår uppgift lättare att hantera.",
      "skill": "tolka-situation",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0043",
      "topicId": "tid",
      "level": 1,
      "stimulus": "Skolan börjar klockan 08.30. Vägen dit tar 20 minuter om allt går som planerat.",
      "prompt": "Vilken är den senaste tiden du behöver gå hemifrån för att hinna precis i tid?",
      "choices": [
        "08.30",
        "08.20",
        "08.10",
        "08.50"
      ],
      "correctIndex": 2,
      "explanation": "08.30 minus 20 minuter är 08.10. I verkligheten kan det vara klokt att lägga till lite extra tid.",
      "skill": "mata-och-jamfora",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0044",
      "topicId": "tid",
      "level": 1,
      "stimulus": "Klassen räknar hur många dagar det går på en vanlig vecka.",
      "prompt": "Hur många dagar har en vecka?",
      "choices": [
        "Fem",
        "Sex",
        "Åtta",
        "Sju"
      ],
      "correctIndex": 3,
      "explanation": "En vecka har sju dagar: måndag, tisdag, onsdag, torsdag, fredag, lördag och söndag.",
      "skill": "fakta-och-begrepp",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0045",
      "topicId": "tid",
      "level": 2,
      "stimulus": "En kaka ska gräddas i 12 minuter. Den sätts in klockan 15.05.",
      "prompt": "Vilken tid har det gått 12 minuter?",
      "choices": [
        "15.17",
        "15.12",
        "15.07",
        "15.50"
      ],
      "correctIndex": 0,
      "explanation": "Fem minuter över tre plus tolv minuter blir sjutton minuter över tre: 15.17.",
      "skill": "mata-och-jamfora",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0046",
      "topicId": "tid",
      "level": 2,
      "stimulus": "På fredagen finns en läxa som ska vara klar på måndag morgon.",
      "prompt": "Vilket val gör det lättare att hinna?",
      "choices": [
        "Vänta tills efter måndag",
        "Bestämma en tid på helgen då läxan ska göras",
        "Glömma bort vilken dag det är",
        "Börja packa väskan nästa vecka"
      ],
      "correctIndex": 1,
      "explanation": "Om du planerar in tid före måndag hinner du arbeta i lugnare takt och kan fråga om hjälp vid behov.",
      "skill": "planering",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0047",
      "topicId": "tid",
      "level": 3,
      "stimulus": "En familj ska baka. De ska blanda smeten, grädda kakan och till sist låta den svalna.",
      "prompt": "Vilken ordning fungerar bäst?",
      "choices": [
        "Svalna, blanda, grädda",
        "Grädda, svalna, blanda",
        "Blanda, grädda, svalna",
        "Svalna, grädda, blanda"
      ],
      "correctIndex": 2,
      "explanation": "Först blandas ingredienserna. Sedan gräddas kakan och efteråt behöver den svalna.",
      "skill": "ordningsfoljd",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0048",
      "topicId": "tid",
      "level": 3,
      "stimulus": "Tåget går klockan 12.45. Du är på stationen klockan 12.20.",
      "prompt": "Hur många minuter är det kvar till avgång?",
      "choices": [
        "15 minuter",
        "20 minuter",
        "35 minuter",
        "25 minuter"
      ],
      "correctIndex": 3,
      "explanation": "Från 12.20 till 12.45 går det 25 minuter.",
      "skill": "mata-och-jamfora",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0049",
      "topicId": "pengar",
      "level": 1,
      "stimulus": "En anteckningsbok kostar 18 kronor. Du betalar med en tjugokronorssedel.",
      "prompt": "Hur mycket ska du få tillbaka?",
      "choices": [
        "2 kronor",
        "8 kronor",
        "12 kronor",
        "38 kronor"
      ],
      "correctIndex": 0,
      "explanation": "20 kronor minus 18 kronor är 2 kronor.",
      "skill": "mata-och-jamfora",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0050",
      "topicId": "pengar",
      "level": 1,
      "stimulus": "Du har 50 kronor och köper något för 35 kronor.",
      "prompt": "Hur mycket har du kvar?",
      "choices": [
        "25 kronor",
        "15 kronor",
        "35 kronor",
        "85 kronor"
      ],
      "correctIndex": 1,
      "explanation": "50 minus 35 är 15 kronor kvar.",
      "skill": "mata-och-jamfora",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0051",
      "topicId": "pengar",
      "level": 2,
      "stimulus": "En butik säljer en penna för 8 kronor och ett paket med två likadana pennor för 14 kronor.",
      "prompt": "Vilket val ger lägst pris per penna om du behöver två?",
      "choices": [
        "Två lösa pennor för 16 kronor",
        "En lös penna för 8 kronor",
        "Tvåpack för 14 kronor",
        "Båda kostar lika mycket"
      ],
      "correctIndex": 2,
      "explanation": "Två lösa pennor kostar 16 kronor. Tvåpacket kostar 14 kronor, så det är billigare för två.",
      "skill": "mata-och-jamfora",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0052",
      "topicId": "pengar",
      "level": 2,
      "stimulus": "Du har 30 kronor. En sak som du verkligen vill köpa kostar 40 kronor.",
      "prompt": "Vad kan du göra utan att låna pengar?",
      "choices": [
        "Säga att den kostar mindre",
        "Ta den utan att betala",
        "Köpa den och hoppas att någon annan betalar",
        "Spara 10 kronor till innan du köper den"
      ],
      "correctIndex": 3,
      "explanation": "40 minus 30 är 10 kronor. Om du sparar ihop mellanskillnaden kan du köpa saken senare.",
      "skill": "planering",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0053",
      "topicId": "pengar",
      "level": 3,
      "stimulus": "På en reklamskylt står det: 'Det här är världens bästa ryggsäck!'",
      "prompt": "Hur bör du förstå påståendet?",
      "choices": [
        "Som reklamens åsikt, inte som ett bevisat faktum",
        "Som en mätning gjord av alla människor",
        "Som en regel som står i lagen",
        "Som ett löfte om att ingen annan väska kan fungera"
      ],
      "correctIndex": 0,
      "explanation": "Reklam försöker övertyga. Ett starkt påstående är inte automatiskt ett bevis.",
      "skill": "kallkritik",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0054",
      "topicId": "pengar",
      "level": 3,
      "stimulus": "Efter köpet får en kund ett kvitto från butiken.",
      "prompt": "Vad kan kvittot hjälpa kunden med?",
      "choices": [
        "Att se framtidens väder",
        "Att kontrollera vad som köptes och vad det kostade",
        "Att automatiskt göra varan gratis",
        "Att bestämma butikens öppettider"
      ],
      "correctIndex": 1,
      "explanation": "Kvittot visar bland annat vad som köptes och priset. Det kan också vara bra vid frågor om köpet.",
      "skill": "anvanda-kunskap",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0055",
      "topicId": "digitalt",
      "level": 1,
      "stimulus": "Du får ett meddelande från någon du inte känner: 'Klicka här och skriv ditt lösenord så får du en present!'",
      "prompt": "Vad är ett tryggt val?",
      "choices": [
        "Skriva lösenordet direkt",
        "Skicka lösenordet till flera vänner först",
        "Inte lämna ut lösenordet och fråga en vuxen om hjälp",
        "Klicka på länken för att prova"
      ],
      "correctIndex": 2,
      "explanation": "Lösenord ska hållas hemliga. Okända länkar och löften om presenter kan vara försök att lura dig.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0056",
      "topicId": "digitalt",
      "level": 1,
      "stimulus": "Du har tagit en rolig bild där en kompis syns tydligt.",
      "prompt": "Vad bör du göra innan du delar bilden på nätet?",
      "choices": [
        "Dela utan att fråga",
        "Låtsas att kompisen inte är med",
        "Skriva kompisens adress till bilden",
        "Fråga kompisen om det är okej"
      ],
      "correctIndex": 3,
      "explanation": "Den som syns på bilden ska få säga till om den vill att den delas. Be också en vuxen om råd vid behov.",
      "skill": "granser-och-respekt",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0057",
      "topicId": "digitalt",
      "level": 2,
      "stimulus": "Du hittar två olika svar på en fråga på internet.",
      "prompt": "Vad hjälper dig att avgöra vilket svar som verkar trovärdigt?",
      "choices": [
        "Undersöka vem som skrivit, när och vilka källor som används",
        "Välja sidan med flest blinkande färger",
        "Tro på det kortaste svaret direkt",
        "Bara lita på första sökresultatet"
      ],
      "correctIndex": 0,
      "explanation": "Avsändare, datum och källor hjälper dig att bedöma om information kan vara tillförlitlig.",
      "skill": "kallkritik",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0058",
      "topicId": "digitalt",
      "level": 2,
      "stimulus": "Ett spel frågar efter ditt fullständiga namn, hemadress och telefonnummer för att få ett extra föremål.",
      "prompt": "Vad är klokast?",
      "choices": [
        "Skriva allt så snabbt som möjligt",
        "Låta bli att lämna uppgifterna och fråga en vuxen",
        "Lägga upp uppgifterna offentligt först",
        "Be en kompis fylla i dina uppgifter"
      ],
      "correctIndex": 1,
      "explanation": "Personuppgifter behöver skyddas. Dela inte onödiga uppgifter för att få saker i spel.",
      "skill": "trygga-val",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0059",
      "topicId": "digitalt",
      "level": 3,
      "stimulus": "Någon delar en film där en person ser ut att säga något märkligt.",
      "prompt": "Varför ska du vara försiktig innan du tror på filmen?",
      "choices": [
        "För att filmer aldrig visar verkliga personer",
        "För att allt som är ovanligt måste vara falskt",
        "För att film och ljud kan redigeras eller förfalskas",
        "För att alla filmer kommer från samma källa"
      ],
      "correctIndex": 2,
      "explanation": "Bilder, film och ljud kan manipuleras. Kontrollera gärna om påståendet går att hitta hos trovärdiga källor.",
      "skill": "kallkritik",
      "reviewStatus": "draft",
      "revision": 1
    },
    {
      "id": "vk-0060",
      "topicId": "digitalt",
      "level": 3,
      "stimulus": "En kompis vill fortsätta spela trots att ni suttit stilla länge.",
      "prompt": "Vilket förslag kan vara bra för kroppen?",
      "choices": [
        "Spela längre utan att flytta sig",
        "Hoppa över mat och sömn",
        "Sitta närmare skärmen hela tiden",
        "Ta en paus, röra på sig och vila ögonen"
      ],
      "correctIndex": 3,
      "explanation": "Pauser och rörelse är bra när man har suttit stilla länge. Ögonen får också vila från skärmen.",
      "skill": "anvanda-kunskap",
      "reviewStatus": "draft",
      "revision": 1
    }
  ]
};
  if(typeof module!=='undefined'&&module.exports)module.exports=data;
  root.ORDJAKTEN_VARDAGSKUNSKAP=data;
})(typeof globalThis!=='undefined'?globalThis:this);
