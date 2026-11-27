# Ordbroar – bygg ihop flera ord

Ordbroar är en ny del av Begreppskartan. Fem uppgiftstyper, fyra redaktionellt utformade uppgifter per typ:

| Typ | Interaktion |
|---|---|
| Sortera | Välj grupp för varje ord; ändra val före kontroll. |
| Hitta ordet som inte passar | Välj ett ord utifrån ett uttryckligt kriterium. |
| Ord i rätt följd | Matcha tre ord med tre steg i en bestämd situation; ångra senaste ord. |
| Bygg en ordbro | Välj ett ord som uppfyller den beskrivna relationen. |
| Förklara skillnaden | Välj en av tre förklaringar, reflektera sedan frivilligt med egna ord. |

Ingen drag-and-drop krävs; knappar fungerar också med tangentbord. Ordningsuppgifter gäller konkreta situationer, inte en påhittad universell intensitetsskala. Fria muntliga förklaringar bedöms inte. Användaren får alltid välja ledtråd eller facit. Första miss ger läshjälp och chans att ändra valen; andra miss visar facit. Alla val måste vara kompletta innan kontroll.

## Anpassning och evidens

Högst tre uppgifter i en runda, från olika sambandsgrupper utan gemensamma deltagande ord. Urval prioriterar tidigare stödbehov, därefter variation mellan uppgiftstyper. Ordbroar respekterar Begreppskartans ord- och relationsfilter samt ett eget uppgiftstypsfilter. Inga utfyllnadsuppgifter om filter eller överlappning begränsar urvalet. Svårare grupper ingår efter tidigare möten eller explicit val.

Separat `bridgeProgress` återanvänder Begreppskartans validerade lokala format, med egna uppgifts-ID:n och innehållskontrollkoder. Minst 24 timmar mellan registrerade försök på samma uppgift. Tidigare lästa gruppförklaringar, delade ord under kartbesöket och direktstart från ett ordkort räknas som förhandsvisning. Hjälp under uppgiften gör observationen stödd. Bara faktiskt visade kortord markeras som mötta i Min ordstig, utan att tillskriva dem förståelse, Aha-bevis eller provpoäng. Inga fria svar sparas. Radering och export omfattar också Ordbroar. Ingen ny server, paket eller CI-jobb.

## Kontroll

`npm run check` innehåller tester för innehåll, facit, ofullständiga val, urvalsfilter, väntetid och lagring. Frivilligt `python tests/browser_bridges.py` använder befintlig browser-harness för interaktioner. Nya exempel och förklaringar behöver redaktionell granskning och barnprovspelning; automatisk validering bevisar inte pedagogisk effekt.
