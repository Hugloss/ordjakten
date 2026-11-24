# Ordjakten 0.13 – smart variation efter vad barnet kan

## Varför?

Ett barn kan förstå definitionen av **grumlig** men fortfarande ha svårt att känna igen grumligt vatten i en ny berättelse. I stället för att behandla ordet som helt "rätt" eller "fel" sparas framsteg **separat per frågetyp**.

| Färdighet | Exempel | Tillgänglig när |
|---|---|---|
| Hitta rätt bild | Välj en tydlig emoji | Lätt |
| Förstå betydelsen | Välj bästa förklaringen | Medel / Svårt, uttryck |
| Hitta rätt ord | Läs betydelsen, välj ordet | Medel / Svårt |
| Ord i vardagen | Läs en kort berättelse | Endast 43 granskade scenord |
| Välj rätt mening | Välj en mening som använder uttrycket rätt | Uttryck |
| Ordna berättelsen | Sätt tre händelser i ordning | Uttryck |

Detta är enkla, transparenta **övningssignaler**, inte diagnoser eller bevis på att någon kan eller inte kan ett ord. Enstaka rätt/fel räcker inte för en vetenskaplig bedömning av lärande.

## Hur urvalet fungerar

1. **Träna** har en ny inställning ”Variera efter vad jag behöver öva”, som är på från början och går att stänga av.
2. Frågetypen väljs utifrån tidigare resultat på **just den typen**. Två rätt i följd efter ett missat moment räcker för att momentet inte längre ska prioriteras som svårt. Andra moment för samma ord fortsätter vara separata.
3. Högst ungefär halva omgången reserveras för tidigare svåra begrepp **när det finns annat material att utforska**. Resten blandas från den vanliga banken. Om nästan allt tillgängligt material är tidigare svårt kan andelen bli högre för att ge en fullständig omgång.
4. Den befintliga schemalagda repetitionskön respekteras: ord som har viloperiod väljs inte med förtur och hoppas över i normalt urval när tillräckligt annat innehåll finns.
5. En spelomgång innehåller fortfarande **högst en fråga per ord/uttryck**. Svårighetsgrad, ämne och inställningen för vardagsscener respekteras alltid.
6. För ett ord med tre kuraterade scener växlas **scen 1 → 2 → 3** mellan besvarade kontextfrågor, så barnet inte lär sig en enskild berättelse utantill.
7. **Träna mina fel** använder fortfarande den äldre växlingslogiken och dess tidsschema, så tidigare lärupplevelse och garantier består.
8. **Berättelsehjälten** behåller den garanterade blandningen av *förstå, rätt mening och rätt ordning* – anpassningen stängs av just under det uppdraget.

**Testa dig / Högskoleprovsutmaningen**: frågorna väljs utan individuellt urval och facit visas först efter avslutad omgång. De besvarade frågorna uppdaterar lokal övningshistorik **först efter testet**, inte mellan dess frågor. Timer, poäng och antal alternativ påverkas inte av anpassningen.

## Exempel med grumlig

- Rätt på **betydelse**: betydelsemomentets räknare ökar.
- Fel på **ord i vardagen**: en **annan vardagsscen** blir relevant i fortsatt träning.
- Nästa vanliga omgång kan prioritera ett kontextmoment för *grumlig* men innehåller också andra ord.
- Om barnet får två rätt i följd på just kontextmomentet slutar den delen prioriteras som svår. Andra färdigheter påverkas inte automatiskt.

## Tekniskt kontrakt och privatliv

Implementerat i `public/js/adaptive.js`; ingen AI-tjänst används. Fältet `skillProgress` läggs till i befintligt `ordjakten-v1`-objekt i lokal `localStorage`. Nyckeln ändras inte.

Exempel:

```json
{
  "sv-0044": {
    "skills": {
      "meaning": {"right": 1, "wrong": 0, "streak": 1, "attempts": 1, "lastAt": 1800000000000},
      "context": {"right": 0, "wrong": 1, "streak": 0, "attempts": 1, "lastAt": 1800000600000}
    },
    "lastScene": 0
  }
}
```

- Inga namn, personnummer, elevlistor, svarstexter, bilder av barn eller andra identifierande uppgifter lagras.
- Endast begränsade heltalsräknare, fråge-ID, typ, senaste tidpunkt och senaste scenindex.
- Vid inläsning valideras ID, frågetyp, räknare och tidsstämplar. Max 500 begrepp hanteras.
- **Äldre versioner** utan `skillProgress` laddas som förut och får nya färdigheter först när barnet svarar igen; gammal historik och repetitionsplan bevaras.
- Exporten av historik tar med färdighetsframsteg. ”Radera sparade resultat” raderar dem också.
- Informationen stannar på enheten; rensad webbläsardata innebär att den försvinner.

## Kontroller

```bash
npm run check
python tests/browser_adaptive.py
python tests/browser_review.py
python tests/browser_quests.py
python tests/browser_smoke.py
```

Deterministiska tester kontrollerar fristående färdigheter, prioritering av kontext efter fel, scenrotation, väntetid, slumpat urval, Testa dig utan personalisering, gamla resultat, 121 ord och 25 uttryck. Chromium-tester kontrollerar också gränssnitt, provsekretess och att anpassning kan stängas av.

**Känd begränsning:** Den isolerade webbläsartestmiljön kan inte navigera till localhost. `npm start` svarar korrekt via HTTP, men verklig omladdning med kvarvarande localStorage och PWA-offline-läge ska provas manuellt före publicering. Alla redaktionella distraktorer och förklaringar behöver barnprovspelas och språkgranskas.
