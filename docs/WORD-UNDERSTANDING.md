# Förstå orden: genomgång av hela den befintliga ordbanken

Fortsättning på PR #9, 27 november 2026. Uppgiften är att förbättra de ord
som redan finns, med konkreta förklaringar och användning i nya situationer.

Efter att PR #9 mergats följs denna genomgång av en
[post-review av vardagsurval och spelens tydlighet](POST-REVIEW-EVERYDAY.md).
Den fullständiga banken nedan bevaras. Den vanliga träningen prioriterar
nu 101 av orden och 59 av uttrycken; övriga kan väljas som fördjupning.

## Omfattning

| Innehåll | Före denna omgång | Efter denna omgång |
| --- | ---: | ---: |
| Befintliga ord | 121 | 121 |
| Ord med alla fyra undervisningsfält | 14 | 121 |
| Ord med tre egna vardagssituationer | 55 | 121 |
| Vardagssituationer | 165 | 363 |
| Ord utan egna vardagssituationer | 66 | 0 |

107 ord får fördjupad undervisning och 66 ord får sammanlagt 198 nya
vardagssituationer. De tidigare förklaringarna och situationerna granskas
samtidigt. Ordens ID:n, nivåer och ordningsföljd bevaras; gamla scenindex
flyttas inte. Även det befintliga expertordet får innehåll, men flyttas inte
in i barnets vanliga ordurval.

Detta är fullständig **innehållstäckning**, inte ett bevis för att barn har
lärt sig orden. Databanken behåller statusen `editorial_draft` och orden
behåller `review_status: draft`.

## Vad varje ord ska hjälpa barnet att förstå

| Fält i `teaching` | Uppgift |
| --- | --- |
| `explanation` | Förklara betydelsen enkelt och konkret. Visa vad som händer eller vad egenskapen består i. |
| `familiar` | Knyt betydelsen till något barnet kan känna igen från vardagen. |
| `nonExample` | Visa när ordet inte passar och vad som gör skillnaden. |
| `ownPrompt` | Bjud in barnet att berätta eller tänka med egna ord. Frågan är frivillig. |

Förklaringen ska inte bara upprepa målordet med ett annat slut. Ett exempel
får inte bygga på att barnet först kan ett svårare ord. Ett motexempel måste
sakna just den egenskap som övas: en annan färg eller en annan sak räcker
inte om samma ord fortfarande kan beskriva den.

Tre vardagsscener prövar användningen i olika sammanhang. Varje scen har en
egen `why` som knyter svaret till det som faktiskt beskrivs. Barnet behöver
inte hitta på ett exempel för att få gå vidare, och egna formuleringar
poängsätts eller lagras inte.

## Begrepp som kräver särskild noggrannhet

- **Orädd och modig:** orädd betyder att inte känna rädsla i situationen.
  Att göra något trots rädsla kan vara modigt. Förklaringarna värderar inte
  barnet utifrån om det är rädd eller orädd.
- **Magnetisk:** både en magnet och material som dras till en magnet kan
  beskrivas. Alla metaller dras inte till en vanlig magnet. Den omvända
  frågans ledtråd behöver stämma med samma betydelse.
- **Ångande:** den vita skyn över varm mat består av små droppar som bildas
  när vattenånga kyls. Förklaringar som pekade ut uppvärmning som det som
  direkt gör dropparna synliga rättas även i jämförelseövningen.
- **Fyrkantig:** fyra sidor och hörn innebär inte att alla sidor måste vara
  lika långa. En rektangel kan också vara fyrkantig.
- **Betänksam:** det finns en tvekan eller ett skäl att tänka efter; ordet
  ska inte användas som en allmän etikett för allt tänkande.
- **Ofrånkomlig och oåterkallelig:** något som inte kan undvikas skiljer sig
  från något som inte kan göras ogjort. Scenerna ska visa den skillnaden.
- **Tvetydig:** samma uttryck har två möjliga betydelser. De tidigare
  rättade exemplen med mus och krona behålls i samma scenpositioner.

De genererade betydelsefrågorna spärrar dessutom fler överlappande par,
bland annat skör/ömtålig, fluffig/mjuk, vass/spetsig, envis/ihärdig,
missvisande/skenbar och tillfällig/efemär. Spärrarna är ett stöd för
redaktionen; de kan inte upptäcka all semantisk tvetydighet.

## Separata felalternativ till Aha

Huvudfrågan frågar vilket **ord** som passar en bestämd berättelse.
Aha frågar vilken **berättelse** som visar ordet i en annan situation.
Samma lista med felord är inte automatiskt säker i båda riktningarna.
En berättelse om en skör skål kan exempelvis också beskriva en rund sak.

Alla ord har därför en egen `readingDistractors`-lista. För varje ID i
listan granskas alla tre möjliga felberättelser mot målordet. Aha använder
enbart dessa källor och visar två olika felberättelser tillsammans med en
ny rätt berättelse. Huvudfrågans fyra `distractors` används separat.

Valideringen kräver minst två unika Aha-källor som finns i både ord- och
scenbanken. Självreferenser, kända nära synonymer och saknade källor stoppas.
Om en äldre eller ofullständig bank ändå når motorn faller Aha tillbaka
till en betydelsefråga. Ett sådant svar räknas som igenkänning, inte som
nytt belägg för användning i en annan situation.

## Visning och beteende

Den befintliga visningen återanvänds i vanlig träning, fokusträning,
provets facit och den sökbara ordbanken. På ordkorten kan barnet öppna
**Så används ordet**. Ett felaktigt svar kan också få en förklaring av det
valda ordet när motorn säkert känner igen det.

Bildnivån behåller sina bildfrågor. Högskoleprovsutmaningen behåller fem
svarsalternativ. I Testa dig visas undervisningen först efter avslutat
prov. Tankefrågorna och Aha-svaren ger inga extra provpoäng eller stjärnor.
Inga nya minispel eller externa beroenden införs.

## Verifiering

Kört den 27 november 2026: `npm run check` passerar med **444 tester**,
innehållsvalidering och kontroll av appens statiska resurser. Den automatiska
webbläsarkontrollen nedan har **inte kunnat köras klart** i arbetsmiljön:
en fungerande lokal Chromium saknas och molnwebbläsaren kunde inte nå
utvecklingsservern. Gränssnittskontroll och barnprovspelning återstår.

```sh
npm run check
python tests/browser_word_understanding.py
```

Den snabba kontrollen kräver fullständig täckning för samtliga 121 ID:n,
de fyra undervisningsfälten, 363 scener, separata Aha-källor, oförändrad
ordmängd och identiska JSON- och webbläsarfiler. Testerna kör huvudfrågor
och Aha-frågor över hela scenbanken, prövar borttagna eller felaktiga
Aha-listor och skyddar poäng, återbesöksregler och hantering av äldre data.

Den lokala webbläsarkontrollen provar mobilträning med ett fel och fyra
rätt, tre Aha-alternativ, förklaring efter svaret, dolt facit under prov
och samtliga 121 ordkort. Den kontrollerar också ljus högkontrastvy i
320 px. Testet använder den befintliga injicerade sidmiljön och verifierar
därför inte installation av service worker eller lagring över en riktig
omladdning. Offlinecache är uppdaterad för de ändrade resurserna.

## Nästa kvalitetssteg

Fortsätt med språkgranskning av svarsalternativ och barnprovspelning av
det befintliga innehållet. Börja med fem vanliga ord åt gången. Be barnet
peka ut vad i berättelsen som visar betydelsen, förklara varför ett
motexempel inte passar och använda ordet i en egen ny situation. Återkom
efter en paus utan att först visa förklaringen.

Observera också om mängden text går att läsa utan att barnet tappar lusten.
Förenkla en förklaring när den inte hjälper; lägg inte till fler ord för
att kompensera. Ett rätt klick räcker inte för att avgöra förståelse.
Se [CHILD-PLAYTESTING.md](CHILD-PLAYTESTING.md) för det konkreta upplägget.
