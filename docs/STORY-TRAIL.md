# Berättelsespåret – förstå ord i fler situationer

43 ord har redan tre redaktionellt skrivna vardagsberättelser var.
Tidigare sparades främst ett sammanlagt resultat för frågetypen
`context` och indexet för den senaste scenen. Nu kan spelet skilja på
**vilka berättelser** barnet har mött och hur det gick i var och en.

- En ordfråga (välj vilket ord som passar) sparas med rätt/fel och
  senaste observationstid, direkt efter ett faktiskt svar i Träna
  eller en frivillig riktad övning.
- Aha-frågan efter förklaringen sparas separat: rätt direkt,
  efter omläsning eller med hjälp. Ett Aha-svar räknas inte som en
  självständigt löst ordfråga.
- Inga berättelsetexter, namn, fria svar eller användar-ID:n lagras.
  En deterministisk innehållsnyckel per redaktionell scen kopplar
  observationen till rätt version av berättelsen. Om berättelsen
  ändras försvinner dess gamla detaljevidens; om den flyttas inom
  samma ord bevaras evidensen. Äldre sammanlagd historik migreras
  inte till gissade scenresultat.

## Anpassning

Smart träning prioriterar helt oprövade berättelser före redan
observerade, sedan olösta ordfrågor och därefter lösta berättelser.
Aha prioriterar andra oprövade berättelser än den aktuella ordfrågan,
och därefter berättelser som ännu inte prövats som Aha. Inga nya
berättelser skapas automatiskt. En svår eller ofullständig
berättelsestig kan ge ordet extra prioritet i blandad träning och i
**Ge ord en ny chans**. Befintliga repetitionspauser gäller fortfarande
för det riktade urvalet. Med smart träning avstängd är ordinarie
frågetypsval och Aha-urval inte anpassade.

## Barnets vy

Efter en Aha-fråga med en skriven vardagsscen och i Min ordstig visas
**Berättelsespåret**: vilka berättelser som har prövats, vilka ordfrågor
som senast besvarades rätt och vilka Aha-övningar som behövde hjälp.
Den frivilliga tre-berättelseövningen kan börja med en ny eller
olöst berättelse. Alla tre scener förekommer fortfarande exakt en gång.

Tre rätt i samma sittning visar bara tre lyckade ordfrågor i de här
berättelserna, inte varaktig behärskning eller tre separata dagar.
Inga extra poäng, stjärnor eller repetitionsdagar delas ut.
Testa dig och högskoleprovsutmaningen varken använder eller ändrar
detaljerad berättelsehistorik. Vanlig tidigare resultatlagring är
oförändrad. Ordbankens jämförelseövningar och uttryck har sina egna
befintliga evidensmodeller.

## Kontroll

`npm run check` inkluderar tester för unika scenidentiteter,
omordning, ändrade texter, stöd kontra självständiga svar, nytt
urval och provoberoende. Frivilligt webbläsartest:
`python tests/browser_story_trail.py`. Låt även ett barn provspela
och förklara ordet med ett eget exempel. Innehållsnycklar är en
lokal versionsmekanism, inte ett säkerhetsbevis.
