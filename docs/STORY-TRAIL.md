# Berättelsespåret – förstå ord i fler situationer

Alla 121 ord har tre redaktionellt skrivna vardagsberättelser var, totalt 363.
Tidigare sparades främst ett sammanlagt resultat för frågetypen
`context` och indexet för den senaste scenen. Nu kan spelet skilja på
**vilka berättelser** barnet har mött och hur det gick i var och en.

- En ordfråga (välj vilket ord som passar) sparas med rätt/fel och
  senaste observationstid, direkt efter ett faktiskt svar i Träna
  eller en frivillig riktad övning.
- Aha-frågan efter förklaringen och den fristående Aha-rundan sparas separat: rätt direkt,
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
Aha behåller reglerna för ett nytt exempel och tidigare tillgodoräknade
exempel. Inom det tillåtna urvalet prioriteras helt oprövade berättelser,
och därefter berättelser som ännu inte prövats som Aha. Inga nya
berättelser skapas automatiskt. En svår eller ofullständig
berättelsestig kan ge ordet extra prioritet i blandad träning och i
**Ge ord en ny chans**. Befintliga repetitionspauser gäller fortfarande
för det riktade urvalet. Berättelsespårets prioritering av oprövade
situationer används när smart träning är på. Grundreglerna för nya
Aha-exempel och separata tillgodoräknade exempel gäller alltid.

## Barnets vy

Efter en Aha-fråga med en skriven vardagsscen visas en kort sammanfattning
av **Berättelsespåret** när smart träning är på. I Min ordstig visas
hela spåret: vilka berättelser som har prövats, vilka ordfrågor som
senast besvarades rätt och vilka Aha-övningar som behövde hjälp.
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
