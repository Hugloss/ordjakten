# Första publiceringen och provspelningen

27 november 2026. Utgår från mergade PR #11 och efterföljande putsning
av starten, förklaringarna och läshjälpen.

## Det barnet möter

- **Spela 5 ord direkt** börjar med fem lätta ord i Träna, utan timer.
  Den vanliga inställningspanelen behåller sina val och standarden tio ord.
- Rättelsen och förklaringen till det aktuella svaret ligger öppna.
  Kompletterande undervisning kan öppnas under **Fler exempel och fundera
  själv**. Skoluppgifternas fler exempel och hjälp ligger i en motsvarande
  öppning. Varje ny uppgift börjar med den delen stängd.
- Facit och ordsamlingen behåller fullständiga ordförklaringar.
- **Lyssna på frågan och svaren** läser Aha-frågan och alternativen i
  deras visade ordning, utan facit. Knappen visas när webbläsaren har
  talstöd. Ingen uppläsning startar automatiskt.
- Experiment och dekorativa handlingsbilder är undanlagda under
  Aha-frågan. Omläsning återför barnet till förklaringen.
- Träningsmål utan tillgängliga frågor går inte att välja. Om ett sparat
  mål blivit tomt väljs Blanda och hjälpraden berättar vad som ändrats.

Vardagsurvalet är fortsatt 101 ord och 59 uttryck, inklusive 14 skolord.
Innehåll, facit och tidigare resultat påverkas inte av presentationen.

## Automatiska kontroller

`npm run check` passerar med 504 Node-tester, innehållsvalidering och
kontroll av 71 HTML-resurser, 154 offline-sökvägar och 49 skript.
Nya regressioner gäller:

- Att kärnförklaring och rättelse syns medan frivilligt material förblir
  tillgängligt, samt att öppna detaljer inte följer med till nästa ord.
- Att Aha-uppläsningen följer frågan och alternativen, även efter
  omblandning, utan att läsa facit eller dold fördjupning.
- Att tomma träningsmål inte leder till en misslyckad start och att
  snabbstarten faktiskt skapar fem frågor.
- Att resultatmärket använder omgångens verkliga antal frågor och
  behåller samma gräns för belöningen.

De befintliga valfria browser-testerna är uppdaterade för den kortare
snabbstarten och de nedfällbara förklaringarna. De kräver en installerad
Chromium-binär. Testerna som injicerar HTML i `about:blank` bevisar inte
att den publicerade sidans lagring och offlinefunktion fungerar.

## Kontrollera den publicerade versionen

Publiceringsadressen är https://hugloss.github.io/ordjakten/.
Följ senaste **Publish Ordjakten to GitHub Pages** och bekräfta att
**Deploy** lyckats. Läs därefter sidan på HTTPS i en riktig webbläsare.

1. Starta fem ord utan inställningar. Kontrollera att förklaring, Aha och
   nästa ord går att nå med tydliga knappar.
2. Svara fel och öppna fler exempel. Rättelsen ska synas från början;
   nästa ord ska börja med fördjupningen stängd.
3. Prova skoluppgift och Aha. Den aktuella instruktionen ska höra ihop
   med svaren och den aktuella förklaringen.
4. Prova uppläsning där en svensk röst finns. Stoppa, svara och byt
   fråga; inget gammalt tal ska fortsätta över nästa steg.
5. Genomför Testa dig och kontrollera att facit visas efter omgången.
6. Ladda om och kontrollera att inställningar och resultat finns kvar.
   Prova både dator och smal mobilvy, med ljus och mörk bakgrund.
7. Efter installation av service worker: ladda om, koppla från nätet
   och kontrollera att en tidigare inläst version går att spela.

Anteckna vilka av dessa kontroller som faktiskt har körts i
publicerings-PR:n. Ett godkänt automatiskt test ska inte beskrivas som
en genomförd kontroll i webbläsare eller med barn.

### Genomfört på den publicerade sidan, 27 november 2026

PR #12 publicerades via GitHub Actions. Följande kontroller gjordes
därefter i Chrome på den riktiga HTTPS-adressen:

- En komplett snabbstart med fem ord: rätt och fel huvudsvar, öppning
  av fler exempel, omläsning efter fel Aha-svar och guidning efter två
  fel. Nästa ord börjar med fler exempel stängda. Resultatet blev
  fyra rätt av fem, utan att Aha-stödet ändrade huvudpoängen.
- En komplett femfrågorsomgång i Testa dig: facit doldes under alla
  frågor och visades tillsammans med resultatet först efter sista svaret.
- Skolordet Tolka: huvudförklaringen, frivilliga extra exempel och en
  Aha-fråga där alla alternativ hör till samma nya uppgift.
- Resultatet från snabbstarten fanns kvar i Resultat efter omladdning.
- Startsidan granskades visuellt i datorvy. Inga fel eller varningar
  från själva spelet noterades i webbläsarkonsolen under kontrollerna.

Kontrollen upptäckte att Stjärnletare skrev ”åtta av tio” även efter
fem frågor. Den följande rättningen använder omgångens faktiska antal.
En dubbel punkt i den guidade Aha-förklaringen rättades också.

Knappen för Aha-uppläsning visades och gick att aktivera, men faktiskt
ljud och kvaliteten på en svensk röst har inte verifierats. Mobilvy,
ljus bakgrund och spel med nätet frånkopplat återstår att prova på
de enheter som ska användas. Inget barn har deltagit i dessa kontroller.

## Första korta testet med barn

Låt barnet börja själv och observera fem ord. Fråga om det kan peka ut
ledtråden, förklara varför svaret passar och ge ett eget exempel.
Notera var det tvekar, om det använder uppläsningen eller fler exempel,
och om det vill spela vidare. Avsluta när barnet vill.

Barnprovspelning återstår tills en sådan observation faktiskt har
gjorts. Se [den fullständiga planen](CHILD-PLAYTESTING.md).
