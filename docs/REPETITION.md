# 🧠 Smart repetition i Ordjakten 0.11

## Lärandemålet

Ett barn som missar ett ord ska få en **ny chans som kräver att det tänker på ett annat sätt** – inte bara samma bild eller svarsalternativ i en annan ordning. Det är fortfarande frivilligt och roligt; ingen daglig spelserie, inget krav att komma tillbaka ett visst datum.

## Två sorters variation

1. **Ord**: normal fråga (ord → betydelse, på lätt nivå bildalternativ) blir omvänd fråga (betydelse → välj ord). Nästa omgång kan vända tillbaka. Alla 121 historiska ord kan användas, även ord utan bild. Två gamla definitioner som innehöll sitt eget svar (*surrande*, *magnetisk*) har särskilda repetitionsledtrådar i `data/curation.js`.
2. **Uttryck**: efter att ha missat en betydelsefråga får barnet en annan situation där uttrycket ska användas rätt. Sedan kan barnet ordna tre händelser och efter det återbesöka betydelsen. Dessa är redaktionellt skrivna i `data/missions.json`. Uttrycksscen från den ursprungliga frågan visas inte ovanför meningsrepetitionen, så att barnet behöver resonera om den nya situationen.

Högskoleprovsutmaningen behåller formatet **fem textalternativ** och använder betydelsefrågor även i repetition av uttryck.

## När kommer frågan tillbaka?

| Händelse | Status / tid |
|---|---|
| Felaktigt svar | Redo efter att omgången har avslutats |
| Första rätta återbesöket | Väntar i 1 timme |
| Andra rätta återbesöket | Väntar i 24 timmar |
| Tredje rätta återbesöket | Inlärt |
| Ett nytt fel på ett inlärt ord | Blir redo igen |
| Obesvarad fråga / tidsgräns | Lägger inte till ett fel |

Det är **enkel schemalagd repetition**, inte ett bevisat optimalt forskningsschema. Intervallen kan justeras efter återkoppling från barn och lärare. Klockan används bara för att avgöra när *en frivillig fråga* är redo. Inga påminnelser, nätverkstjänster eller inloggningar används. Ett korrekt svar innan ordet är redo förkortar inte intervallet.

## Design / rättvisa

- Repetitionskön väljer aldrig samma mål-ID två gånger i samma omgång.
- Lätt-lägets **nya** repetitionsfråga saknar bilder när man ska välja ordet utifrån betydelsen; den ursprungliga lätt-frågan kan fortfarande använda bildstöd.
- ”Testa dig” visar inga rätt/fel-besked eller definitioner förrän provet avslutas. Både poäng och obesvarade svar räknas som tidigare.
- Miniuppdragets märke och repetitionsstatus ger **inga extra provpoäng**.
- Om frågor väntar till senare är knappen ”Ge ett ord en ny chans” tillfälligt otillgänglig; övriga spel fungerar som vanligt.
- Betydelse och exempel står kvar efter varje svar i Träna. Ordkompis, karta, ljudeffekter och tema fungerar som tidigare.

## Lagring och migration

`localStorage`-nyckeln är fortfarande `ordjakten-v1`; inget konto och ingen server används. Ett nytt fält `reviewProgress` innehåller endast ID, återbesökssteg, tid, senaste frågetyp och antal försök:

```json
{
  "sv-0044": {"streak": 1, "dueAt": 1800003600000, "lastVariant": "reverse", "attempts": 2}
}
```

- `streak`: 0–3, där 3 är inlärt.
- `dueAt`: millisekunder sedan epoch (0 när inlärt).
- `lastVariant`: `picture`, `meaning`, `reverse`, `sentence`, `order`.
- `attempts`: räknare max 9999.

Tidigare `mistakes` och `results` behålls för kompatibilitet. Vid första starten migreras gamla registrerade fel till repetitionskön som **redo nu**, om de inte redan har en kortpost. Samma ID migreras inte på nytt vid omladdning. Export och radering av lokal data inkluderar kön.

## Automatisk kontroll

- `npm run check` validerar frågebanken och kör tester för äldre versioner plus repetitionslogiken.
- `python tests/browser_review.py` testar ord som får omvänd fråga, uttryck som får ny mening, repetitionsfördröjning, layout och dolt facit.
- `python tests/browser_smoke.py` testar bland annat timer, 4/5 alternativ och mobillayout.
- Webbläsartesterna i denna testmiljö injicerar statiska filer i en isolerad sida eftersom lokal HTTP-navigering blockeras. **Återladdning + localStorage** behöver dessutom kontrolleras manuellt i vanlig webbläsare innan offentlig lansering. Migration och återbesöksgränser har automatiska Node-tester.

## Kommande kvalitetsarbete

Repetitionsfrågorna har giltiga tekniska facit, men **alla distraktorer är fortfarande redaktionella utkast**. För ett riktigt skolverktyg behöver både vanliga frågor och omvända frågor språkgranskas. Vi bör särskilt skriva fler *helt nya situationsmeningar* för de ord som 8–10-åringar oftast missar, så att repetitionen utmanar förståelsen ytterligare.
