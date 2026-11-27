# 🎭 Ord i vardagen – nya situationer för kända begrepp (0.12)

## Varför det behövs

Ett barn kan känna igen definitionen av *grumlig* utan att kunna använda ordet när det beskriver något annat. Ett scenbaserat ordkort säger inte ordet eller dess definition i förväg. Barnet måste känna igen vilken **egenskap** som finns i situationen. Direkt efter svaret visas kort orddefinition och sedan en **specifik Aha-koppling** från berättelsen till begreppet.

## Exempel: grumlig

1. Jord blandas med ett glas vatten och man ser inte igenom det.
2. Efter oväder har sand och lera rörts upp i sjön.
3. Kritpulver blandas i vatten i klassrummet.

Alla tre är **separata redaktionella frågor**, inte automatiskt omformulerade kopior. Varje har en specificerad förklaring och fyra textalternativ. Använd inte en generisk hink-emoji: det kan lära barnet fel association.

## Innehåll och teknik

- `public/data/word-contexts.json`: enda redaktionella datakälla, samtliga 121 befintliga ord × 3 situationer = 363.
- `public/data/word-contexts.js`: maskinellt genererad fil som fungerar offline i en klassisk statisk HTML-webbapp. Synkronisera med `npm run sync:contexts`.
- `public/js/engine.js`: `validateContexts`, `makeContextQuestion` och variantval i `generateRound`.
- `public/js/review.js`: känner igen frågetypen `context` i den gamla repetitionskön. Inga lagringsnycklar, ID:n eller schematider ändras.
- `public/js/app.js`: scen visas *före* svaret; konkret Aha-förklaring visas *efter* svaret. Provets facitspärr gäller fortfarande.
- `public/css/contexts.css`: temaanpassade, stora och högkontrastvänliga textrutor.

En post har `id`, fyra kuraterade `distractors` (ID:n från samma ordlista), minst två separata `readingDistractors` och tre poster i `scenes`, var och en med `title`, `text` och `why`. De fyra alternativen i huvudfrågan är **det rätta ordet och tre av fyra granskade förväxlingsord** i slumpad ordning.

`readingDistractors` är den enda källan till felaktiga berättelser i ordets Aha-fråga. Listan är separat eftersom frågorna går åt olika håll: ett ord som inte beskriver den första berättelsen kan ändå ha en egen berättelse där målbegreppet också passar. Ett skört föremål kan till exempel vara runt. Granska därför **samtliga tre scener** för varje ID i Aha-listan mot målordet. Listan får inte innehålla målordet självt, okända ID:n, dubbleringar eller spärrade nära synonymer. Utan två olika skrivna Aha-alternativ använder motorn en betydelsefråga; den lånar aldrig huvudfrågans distraktorer. Innehållskontrollen stoppar sådana ofullständiga poster före leverans.

Upplevelsen lägger inte till några externa tjänster eller bilder. Befintliga scenindex 0–2 behålls, eftersom den lokala återbesökshistoriken hänvisar till dem.

## Tillgänglighet och förtroende

- Frågans text är alltid läsbar; den ersätts efter val så att förklaringen kommer först.
- Lätt använder bara de 30 godkända bildfrågorna. Ord med osäkra bilder får textkort. Fördjupningsprovet får aldrig scenfrågor, eftersom det är en separat, klassisk övningsform.
- Samma ord kan återkomma i andra situationer; efter två rätta återbesök kan en ny berättelse användas utan att återanvända första scenen.
- Vid **Testa dig** visas inga rätt/fel-markeringar eller Aha-rutor förrän testet avslutas.
- Spelaren kan stänga av inblandningen av scenfrågor på startsidan. Snabbknappen använder medelnivå och ger fem garanterade scenfrågor.
- All lokal historik förblir lokal. Ingen barnprofil, konto, övervakning eller daglig påminnelse.

## Redaktionscheck före bredare lansering

Varje nytt kort måste granskas mot följande: 1) Är scenen lätt att läsa för målåldern? 2) Finns bara ett rimligt svar? 3) Är alternativen tillräckligt näraliggande för att vara meningsfulla utan att bli synonymer? 4) Är situationerna verkligt olika? 5) Avslöjar scenen inte ordets stavning? 6) Förklarar `why` **varför** ordet passar just den händelsen? 7) Undviks missvisande bilder och känsliga elevuppgifter?

`npm run check` upptäcker saknad täckning, tekniska fel, duplicering, avslöjat målord i rubrik/text och några uppenbara närliggande alternativ. Det kan inte avgöra pedagogisk kvalitet eller alla möjliga betydelser. Behåll därför statusen **redaktionellt utkast** tills barn och lärare har provspelat. Se [den samlade genomgången](WORD-UNDERSTANDING.md).
