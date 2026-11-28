# Ord- och frågekvalitet

Detta dokument beskriver **nulägets redaktionella språkbank och kvalitetssäkring**. PR #33 exponerar nu alla inventerade skrivna svenska frågor via ett banklokalt register med 1 416 beständiga fråge-ID:n; se [ARCHITECTURE.md](ARCHITECTURE.md) för inventering, sökning och avgränsningen mellan författade frågor och dynamiska försöksinstanser. Målarkitekturen för **separata ämnesbanker** som delar spelgränssnitt finns i [ARCHITECTURE.md](ARCHITECTURE.md). Den första svenska frågeadaptern implementeras i PR #30, men innehållets flytt till nya format är ännu inte genomförd; nedanstående filvägar och synkroniseringssteg gäller befintlig kod tills en kontrollerad migrering är gjord.

## Kanonisk ordbank

`public/data/ordbank.json` innehåller 121 unika ord från tidigare konversationer. Alla har stabila ID:n och metadata.

Browser-versionen `public/data/wordbank.js` speglar hela JSON-filen. För att synkronisera efter redigering:

```sh
python3 - <<'PY'
import json
from pathlib import Path
p=Path('public/data/ordbank.json')
data=json.loads(p.read_text(encoding='utf-8'))
Path('public/data/wordbank.js').write_text(
    '/* Generated from ordbank.json */\nwindow.ORDJAKTEN_WORDS = '+
    json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
PY
npm run check
```

Nya ord ska få nytt unikt `sv-####`-ID, nivå (`easy`, `medium`, `hard`, `expert`), `definition`, `example`, `source`, `review_status` och `illustration` (eller `null`). Ändra aldrig ett befintligt ID för att byta text.

## Urval för barnets vanliga träning

`extensionWords` och `extensionExpressions` i `public/data/curation.js`
markerar innehåll som kräver ett aktivt val av fördjupning. Det vanliga
urvalet omfattar 101 ord och 65 uttryck, inklusive alla 14 skolord.
`hardWords` låter den svåra nivån också använda 25 användbara ord om
känslor och samspel. Svårare träning behöver inte betyda ovanligare ord.

Urvalet gäller målord, genererade ordalternativ, skrivna kontextalternativ
och automatiska träningsförslag. Äldre resultat ska inte återinföra
fördjupningsord i dessa förslag. Hela databanken och dess historik bevaras;
en uttryckligen vald fördjupningsuppgift får fortfarande använda dem.
`validateSelection` kontrollerar referenser, dubbletter, skolord och
kontextalternativ. Se [beslut och fullständigt urval](POST-REVIEW-EVERYDAY.md).

## Emojis och bilder

`public/data/curation.js` är en **allowlist** över bildstödda ord. Den innehåller tre uttryckligt valda felalternativ per ord. Frågor som *grumlig* är textbaserade, eftersom 🪣 beskriver en hink och inte grumligt vatten. En vanlig sten, konservburk eller boll behöver inte visa *skrovlig*, *bucklig* respektive *studsande*.

- Granska symbolen på Android, iOS, Windows och macOS när bildstödet ska publiceras.
- Ett bildval måste beskriva det som faktiskt syns; bildens etikett får inte hävda något som symbolen inte visar.
- Använd inte en utvald emoji om ett annat alternativ är lika rimligt korrekt.
- Emoji är inte ett universellt bildspråk. Ord utan tydlig bild visas på textnivån.

## Textalternativ

Textfrågor byggs med ett korrekt facit från ordets definition och 3 (eller 4) distraktorer från andra definitioner i samma frågebank. Kategorier och synonymspärrar ligger i `curation.js`. Detta ger variation men ersätter **inte språkgranskning**.

Redaktionell kontroll per fråga före större lansering:

1. Är definitionen språkligt korrekt för det testade ordet?
2. Finns det exakt ett försvarbart rätt svar i just denna fråga?
3. Är distraktorerna rimliga och lagom svåra, inte obegripliga nonsensalternativ?
4. Är svarsalternativens längd, grammatik och detaljnivå jämförbara?
5. Är exempelmeningen korrekt och begriplig?
6. Finns det risk för att facit avslöjas i en tidigare fråga?
7. Är bilden på lätt nivå rätt och begriplig för ett barn som aldrig sett ordet förut?

Automatiska tester verifierar ID:n, korrektsvar, dubbla etiketter, antal svar och 25 olika frågor per nivå. De kan **inte** bevisa semantisk entydighet.

## Nästa steg för innehållet

Inför redaktionell status per fråga (utkast/granskad/publicerad). För en skolversion bör svarsalternativen sparas som individuellt granskade uppgifter med fasta option-ID:n, snarare än väljas från genererade definitionsgrupper.

## Historik: de första 25 vardagsuttrycken (version 0.6)

Detta avsnitt beskriver det tidigare införandet. Den **nuvarande** källfilen `public/data/expressions.json` innehåller 73 uttryck, varav 65 ingår i det vanliga urvalet och 8 är frivillig fördjupning. För inventering och framtida innehållsmodell, se [ARCHITECTURE.md](ARCHITECTURE.md).

Uttryck med sammanhang ligger **inte** i `ordbank.json`. De har stabila `ut-####`-ID:n i `data/expressions.json` och en identisk browser-export i `data/expressions.js`.

Det finns fem manuellt valda betydelsealternativ per uttryck, ett rätt. Motorn använder fyra svar i vanliga nivåer och fem i högskoleprovsutmaningen. Alla tvådelade Aha-förklaringar visas **efter** svaret i Träna och bara i facit efter Testa dig. Inga emojis används som alternativ för bildliga uttryck.

Se `EXPRESSIONS.md` för innehållsformat, synkroniseringskommando, pedagogik och redaktionell granskningslista.

## Pedagogisk kvalitetsstandard (pågående genomgång)
Ordträning ska ge mer än igenkänning. Alla 121 befintliga ord har nu `teaching` med fyra redaktionellt skrivna fält: `explanation` (enkel konkret förklaring), `familiar` (vardagsexempel), `nonExample` (när ordet inte passar), `ownPrompt` (fråga att besvara muntligt eller tänka på). Innehållskontrollen kräver dessa fält och tre egna vardagsscener för varje ord. Motorn hanterar fortfarande äldre eller ofullständiga ordposter utan att hitta på innehåll.

Visa förklaringen efter svaret, i fokusträning, facit och ordsamlingen. För kända felalternativ visas även vilket annat ord svaret handlar om. Gissa inte en förklaring för en bildetikett eller en handling. Självformulerat språk bedöms inte automatiskt och sparas inte. Tankefrågan är frivillig och ger ingen poäng.

Granska begreppets gräns: motexemplet ska verkligen sakna den testade betydelsen, och det ska finnas exakt ett försvarbart alternativ i den konkreta uppgiften. För Aha behövs en separat lista med granskade berättelser; se [CONTEXTS.md](CONTEXTS.md). Fullständig teknisk täckning ersätter inte språkgranskning med lärare eller barnprovspelning. Aktuell omfattning och nästa kvalitetssteg finns i [WORD-UNDERSTANDING.md](WORD-UNDERSTANDING.md).

En förklaring ska peka ut ledtråden i den aktuella uppgiften och visa hur
den hör ihop med betydelsen. Lägg inte till en orsak som berättelsen
inte ger stöd för, och behandla inte egenskaper som motsatser när de kan
finnas samtidigt. Märk nya exempel som exempel. I bildserier ska bild,
rubrik och bildtext höra till samma händelse.

Skolordens ordningsuppgifter kräver ett eget `orderExplanation` i
`missions.json`. Det förklarar sambandet mellan arbetsstegen och används
i träning, fokus, facit och bonus. Betydelse- och meningsuppgifternas
förklaringar får inte lånas till ordningsfrågan. Se
[granskningen efter PR #10](CLEARER-EXPLANATIONS.md).
