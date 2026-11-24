# Ordjakten 0.9 – tre sätt att förstå ett uttryck

## Pedagogiskt mål

Ordjakten riktar sig initialt till barn omkring 8–10 år, men själva spelmotorn ska kunna växa med barnet. Ett begrepp kan förstås på mer än ett sätt: att kunna förklara det, känna igen det i ett **nytt sammanhang** och begripa ordningen i en händelsekedja.

I **Uttryck** eller **Blandat** visas därför en liten extra inställning på startsidan:

- **🎲 Blanda uppdragen (standard)**: varierar de tre uppgiftstyperna under omgången, balanserat så att en uppgiftstyp inte dominerar.
- **🧠 Förstå uttrycket**: välj den rätta betydelsen. Fyra svar normalt, fem i högskoleprovsutmaningen.
- **💬 Rätt mening**: välj den enda mening som använder uttrycket på rätt sätt. Tre textalternativ.
- **🧩 Ordna händelserna**: tryck på tre händelser i kronologisk ordning. Använd **Ångra** eller **Börja om** innan du lämnar in. Tillgängligt även utan drag-och-släpp.

**I högskoleprovsutmaningen behålls alltid fem klassiska betydelsealternativ**, även om någon valt en annan uppgiftstyp. Detta är ett pedagogiskt inspirationsläge, inte ett officiellt högskoleprov.

## Luckbokens tre frivilliga miniuppdrag

Varje av de 25 uttrycksluckorna har numera **tre separata miniuppdrag**, sammanlagt 75 möjligheter att träna. När en lucka är upplåst kan barnet välja vilken uppgift det vill göra. Standardvalet kommer från startsidans inställning, och blandläget föreslår en ännu oavklarad variant först.

En rätt utförd variant markeras separat med en ⭐. Barnet kan göra om redan klarade varianter. Fel ger pedagogisk återkoppling och en ny chans – inte ett minus eller lägre huvudpoäng. Luckan visar till exempel **2/3 uppdrag**, och samlingen visar **17 av 75 uppdrag**.

Väljer man **Visa frivilliga ledtrådar** erbjuds ett hjälpfält. Ledtråden är inte ett facit. Den visas först när barnet öppnar den. Om inställningen stängs av döljs ledtrådsvalet.

## Svarsskydd och tid

- **Träna:** Facit och betydelsen visas efter svaret; barnet kan frivilligt öppna sin lucka direkt.
- **Testa dig:** Ingen förklaring, seriestripp, lösning eller lucka visas innan omgången är klar. Då finns facit och luckor i genomgången.
- **Tidsgränser:** Samma timer används för alla uppgifter. Vid utgången tid räknas en ej inskickad ordningsuppgift som **obesvarad**, inte som fel.
- **Poäng:** Varje huvudfråga ger högst ett rätt/fel. Miniuppdrag ger inga huvudpoäng och påverkar inte resultathistoriken.

## Innehåll och källor

- `public/data/expressions.json`: de 25 tidigare uttrycken med betydelser och exempel.
- `public/data/surprises.json`: de 25 tidigare betydelse-miniuppdragen i nya situationer.
- `public/data/missions.json`: **25 redaktionellt skrivna frågor med tre meningar och tre händelser vardera** (50 nya uppgifter).
- Filerna `*.js` i samma katalog är identiska kopior för direkt användning i en statisk webbläsarapp. Ändra enbart `missions.json` och kör `npm run sync:missions` för att återskapa `missions.js`; därefter `npm run check` för kvalitetskontroll.
- `public/js/missions.js`: validering, kontroll av händelseordning och säker hantering av per-uppgift framsteg.
- `public/js/engine.js` och `public/js/app.js`: genererar balanserade omgångar, tar emot svar och håller provläge separat från träning.
- `public/css/missions.css`: skalbara, klickbara alternativ i mörkt/ljust/högkontrastläge.

Allt fungerar utan bildgenerering, nya bilder eller externa tjänster. De **73 befintliga lokala Noto Emoji-illustrationerna** och deras licensinformation från 0.7 finns kvar. Inget konto eller server krävs.

## Lokal sparning och bakåtkompatibilitet

Inställningarna `expressionTask` och `missionHints` finns i den ordinarie versionsvaliderade inställningsstrukturen. `missionProgress` mappar uttrycks-ID till en lista med klarade varianter. Tidigare `surprises` och `results` behålls oförändrade. Om någon klarade ett miniuppdrag i 0.8 räknas det som att den personen redan klarat **förstå-uttrycket** i 0.9. Radering och export av resultat hanterar även denna nya data. Endast ID:n lagras, aldrig barnets namn.

## Kvalitetsregler före publicering

Varje uttryck ska ha exakt **en** rätt meningsvariant och exakt **tre tydligt olika händelser** som kan ordnas. Validering ska slå larm vid borttappade uttryck, dubblerade svar eller ofullständiga uppgifter. Distraktorer får inte ge flera försvarbara rätta svar. De redaktionella exemplen behöver fortsatt **språkgranskas och provspelas med barn** innan bred användning.

## Tester

```sh
npm run check
python tests/browser_missions.py
python tests/browser_smoke.py
python tests/browser_surprises.py
python tests/browser_expressions.py
```

Projektet är fortfarande **lokalt och opublicerat**. GitLab Pages och GitHub Pages kan senare hosta samma statiska filer utan en backend.
