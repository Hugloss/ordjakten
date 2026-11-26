# Begreppskartan – ord som hör ihop

Frivillig, filterbar karta med 18 redaktionellt utformade ordsamband, 49 befintliga ord/uttryck och 36 frågor. Fem relationstyper: liknande betydelse, motsatser och kontraster, nyanser, ordgrupper, olika sammanhang. Relationer är uttryckligen formulerade och förklarade; befintliga distraktorgrupper används inte som påstådda synonymer. Nära synonymer behöver inte vara utbytbara. Kontraster anges i ett sammanhang. Ordgrupper kan överlappa.

Öppna från startsidans Ordverkstad, Min ordstig eller ett specifikt ordkort. Expandera ett samband för att läsa orden, deras betydelser och en förklaring. Prova gruppen eller starta högst tre olika samband. Vald typ och ordavgränsning gäller för både karta och snabbpass. Om inget är redo visas ett tydligt tomläge.

Snabbpass föredrar tidigare stödbehov, därefter en blandning av relationstyper. Utan känd historik används startgrupper; svårare grupper kan väljas av barnet och ingå när relaterade ord har mötts. En fråga får vila minst 24 timmar efter en avslutad uppgift. Den andra frågan i samma grupp kan fortfarande väljas; aldrig båda i samma snabbpass.

Förhandsvisade förklaringar och ordkort räknas som övning med stöd, aldrig som självständig förstaträff. Vid första miss visas sambandsförklaringen och ett nytt försök; vid andra miss eller frivilligt visat facit visas förklaringen. Antal olika frågor provade är inte ett betyg eller bevis på att alla ord i gruppen behärskas. Bara målordet för en avslutad uppgift markeras som mött i Min ordstig. Den vanliga färdighetsprofilen och Aha-observationerna ändras inte.

`conceptProgress` är en separat, begränsad del av befintlig lokal historik: fråge-ID, innehållskontrollkod, försök, senaste utfall, antal direkta träffar och tidsstämpel. Ändrat innehåll förkastar inaktuella observationer. Export och radering omfattar denna historik. Inga egna meningar, nya konton, externa beroenden eller nätverksanrop.

## Kontroll

Kör `npm run check`. Frivilligt `python tests/browser_concepts.py` använder befintlig Chromium-harness och lokal lagringsshim. Kontrollera filter, återgång, förhandsvisning, stöd, återbesök, små skärmar och nollställning. Nya semantiska förklaringar och exempel behöver fortfarande redaktionell granskning och barnprovspelning; automatisk validering bevisar inte entydighet eller pedagogisk effekt.
