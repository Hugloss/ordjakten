# Ordjakten 0.18 – förstå samma ord i olika sammanhang

## Pedagogiskt mål

Barn ska skilja mellan två **närliggande ord** i *flera olika miljöer*, inte memorera facit till en upprepad berättelse. Det här är en varsam, regelbaserad övning och **ingen diagnos** av barnets språkliga förmåga.

### Ordparet grumlig / genomskinlig

- **Hemma:** ett glas med uppvirvlad jord jämfört med klart vatten.
- **I skolan:** laboration med grumlat vatten och rent vatten i ett provrör.
- **I naturen:** en sjö efter regn jämfört med en bäck där botten syns.
- **På fritiden:** vatten vid bryggan jämfört med en klar simbassäng.

Att känna igen *grumlig* i köket är inte samma sak som att kunna välja rätt ord när det handlar om en sjö. Ordbanken innehåller också andra par, som *skrovlig/bucklig* och *randig/prickig*.

## Innehåll och vad som faktiskt är gjort

- **12 ordpar × 8 kuraterade situationer = 96 berättelser**, varav 48 är nytillkomna. De tidigare texterna behöll sina grundsituationer, men 31 justerades så att platsnamnen verkligen stämmer med texten.
- Varje ord förekommer som facit i fyra redaktionellt skrivna situationer och minst tre skilda miljöer. Ord som inte kan illustreras entydigt får fortfarande text, inga missvisande bilder.
- En omgång är fortfarande **fyra frågor**: exakt två svar med vardera ordet och minst tre miljöer. Svar och scenordning blandas. Det finns inte fler knappar eller svårare inställningar för barnet.
- En ny omgång prioriterar **helt nya berättelser**. Med två omgångar kan barnet möta alla åtta olika berättelser för ett par. När alla har provats kan svårare miljöer få förtur.
- **Hitta skillnaden** är en separat mikroövning utan timer, testpoäng, stjärnor eller extra repetitionsdagar. De vanliga spellägena har samma frågeurval och poängregler som tidigare.

## Smart anpassning – enkel och inspekterbar

Varje kuraterad scen har ett **stabilt scen-ID** samt en av `hem`, `skola`, `natur`, `fritid`. Vid varje klick lagras endast: ID för rätt ord, ID för valt ord, tidsstämpel, scen-ID och miljö. Inga berättelsetexter, namn eller fria svar lagras.

1. Ett dokumenterat fel inom ett godkänt ordpar kan skapa ett vänligt förslag att jämföra orden igen.
2. Den nya frågeväljaren prioriterar **inte nyligen besvarade scener** och **tidigare oprövade miljöer**. Den tar också hänsyn till om ett visst ord fortfarande förväxlas i en viss miljö.
3. För att ta bort ett tidigare träningsförslag krävs nu **flera korrekta svar på minst två olika scener, två miljöer och båda orden** under de tre senaste svaren. Tre upprepade korrekta klick på samma scen räcker inte.
4. När rekommendationerna blir färre betyder det att övningen går bättre; det är **inte** en automatisk bedömning att barnet behärskar ordet på lång sikt.

Urvalet söker igenom högst 36 möjliga balanserade frågekombinationer för ett ordpar. Ingen AI, automatisk textgenerering, betald bildtjänst eller extern backend används.

## Redaktionell enda källa och kommandon

Ändra endast `public/data/contrasts.json` för ordpar och exempel:

```bash
npm run sync:contrasts
npm run check
python tests/browser_context_transfer.py
```

`public/data/contrasts.js` är en genererad browser-kopia. Innehållstestet kontrollerar en unik scenidentifierare, fyra facit per ord, minst tre miljöer per ord, entydig textstruktur och att rätt ord inte står direkt i frågebeskrivningen. **Språklig entydighet kan ändå inte bevisas automatiskt**. Låt barn i målgruppen provspela de nya exemplen innan bred lansering.

## Lokal data och uppgradering

- Samma lagringsnyckel `ordjakten-v1` som tidigare. Gammal `confusionProgress` utan scen-ID fortsätter att fungera, men tidigare miljö kan inte rekonstrueras och **gissas inte**.
- Nya svar innehåller `sceneId` och `context` verifierade mot den kuraterade källan. Förfalskade eller felaktiga miljöer ignoreras.
- Högst **tolv** senaste observationshändelser för varje par sparas, med begränsade räknare. Allt finns på enheten och ingår i redan existerande export/radering.
- `public/sw.js` har fått ny cacheversion för de uppdaterade lokala filerna.

## Kvalitetsstatus och begränsningar

Testerna kontrollerar bland annat att de första två omgångarna inte upprepar samma scen, att förväxling i naturmiljö kan prioriteras, att felaktiga ID:n kastas bort, och att provpoäng förblir separata. Manuell språkgranskning och barnprovspelning behövs. En riktig webbläsaromladdning med localStorage och offlineläge på en normal webbplatsorigin är **ännu inte verifierad**: Chromium i denna testmiljö blockerar `127.0.0.1` med `ERR_BLOCKED_BY_ADMINISTRATOR`. Injektionsbaserade webbläsartester och simulerad lokal lagring är gröna.
