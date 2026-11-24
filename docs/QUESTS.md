# Ordjakten 0.10 – frivilliga miniuppdrag och nästa steg

## Varför?

En spelomgång ska kännas meningsfull även om barnet får flera fel. Vi vill belöna **nyfikenhet, försök och förbättring**, inte bara full pott. På startsidan kan barnet fortfarande ställa in allt själv, men kan nu också starta ett av tre korta miniuppdrag med ett tryck. Alla använder den befintliga frågebanken och samma korrekta facit.

## Uppdragen

| Uppdrag | Startar med | Vad krävs för att klara det? |
| --- | --- | --- |
| 🔎 Ordspanaren | 5 ord, Träna, ingen timer | Besvara fem ord. Rätt och fel räknas båda som genomförda försök. |
| 💬 Berättelsehjälten | 5 uttryck, Blandade uttrycksuppgifter, ingen timer | Besvara fem uttryck med minst ett Förstå, ett Rätt mening och ett Ordna händelser. |
| 🌱 Nytt försök | Tidigare fel, Träna, ingen timer | Svara rätt på minst ett tidigare fel. Finns bara om gamla fel verkligen finns i banken. |

Om barnet inte har gjort fel tidigare är **Nytt försök** inaktivt med en tydlig förklaring. Uppdraget söker över andra nivåer och kategorier, inte bara den nuvarande inställningen. Ett korrekt omtag minskar den vanliga fellistan precis som tidigare.

**🎲 Överraska mig** väljer slumpmässigt ett av de för tillfället tillgängliga uppdragen.

Alla tre fungerar med vilken ordkompis och vilket äventyr som helst. Inget av uppdragen kräver en viss dag, uppkoppling, medlemskap, snabbhet eller ett visst antal rätt. Vi ber aldrig om barnets namn eller personuppgifter.

## UI och återkoppling

- På startsidan finns en kompakt rad med tre uppdragskort och antalet gånger som barnet har klarat varje sort.
- I **Träna** visas en egen framstegsmätare som är skild från rätt/fel och stjärnpoäng.
- När omgången avslutas visar belöningsskärmen om uppdraget blev klart. Ett ofullständigt uppdrag ger uppmuntran, inte minuspoäng.
- Efter varje omgång visas tre nya val: fem ord, fem uttryck eller repetition av tidigare fel. Repetition är inaktiv om inga gamla fel finns.
- **Testa dig är oförändrat.** Inga stjärnor, uppdragsmål eller facit visas under ett prov; de frivilliga uppdragen startar alltid träningsläge.

## Lokal datamodell

`questCounts` sparas i den redan befintliga `ordjakten-v1`-posten i webbläsarens localStorage, med de tre uppdrags-ID:na `scout`, `stories` och `comeback`. Värdena är heltal mellan 0 och 999. Endast **antal avklarade omgångar** lagras, inga tider eller individuella svar för uppdragen. Det påverkar inte `results`, `mistakes`, `surprises` eller `missionProgress`. `sanitizeHistory` uppgraderar äldre historik med nollräknare. Radera sparade resultat raderar också uppdragsräknarna. Export innehåller även dessa räknare.

`public/js/quests.js` är en ren, beroendefri modul för tillgängliga uppdrag, preset-planer och godkännanderegler. `public/js/engine.js` fortsätter ansvara för frågeurval och facit. Uppdrag kan inte förfalska rätt/fel-poäng. På en pågående omgång hålls en ögonblicksbild av tidigare fel; för att klara repetitionsuppdraget måste svaret vara rätt på en **redan tidigare missad** fråga, inte på ett nytt fel från samma omgång.

## Läget inför bredare lansering

Innehållet är fortfarande ett redaktionellt utkast. Testa uppdragens formuleringar med barn 8–10 år, särskilt att det är tydligt att även fel svar i Ordspanaren och Berättelsehjälten är värdefulla försök. Ingen press att spela dagligen.

## Tester

```sh
npm run check
python tests/browser_quests.py
python tests/browser_smoke.py
python tests/browser_playful.py
python tests/browser_missions.py
```

Koden är fortfarande **byggfri och statisk**. Uppdragens HTML, CSS och JS ligger i `public/` och är inkluderade i service workerns offline-förteckning. Ingen deploy har utförts.
