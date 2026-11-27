# Stjärnor och lekfull återkoppling

Ordjakten uppmuntrar barnet att tänka i lugn och ro, läsa förklaringen och
fortsätta utforska. Stjärnorna är en samling i spelet. De visar varken ett
betyg eller att ett ord är färdiglärt.

## En stjärnrad att fylla

1. En vanlig ordjakt börjar en rad med en stjärna för varje fråga.
2. Ett rätt huvudsvar tänder frågans stjärna och sparar den direkt.
3. Efter ett fel kan ett eget rätt Aha-svar tända samma saknade stjärna.
   En fråga ger högst en stjärna i raden; Aha ger aldrig extra provpoäng.
4. Efter två fel i Aha visas en förklaring. Att få facit ger ingen stjärna.
   Barnet kan gå vidare och fortsätta med stjärnraden senare.
5. På startsidan och resultatsidan finns en knapp för radens återstående
   frågor. De får skrivna vardagssituationer och kan besvaras i egen takt,
   utan timer. Redan samlade stjärnor ligger kvar.
6. Hela raden firas när den är fylld, också om barnet har övat vidare.
   En ny vanlig omgång börjar en ny rad; samlingens total försvinner inte.

En avbruten rad kan innehålla frågor barnet aldrig hann se. Därför skiljer
sammanfattningen på **i första rundan** och **i fortsatt träning**, utan att
påstå att varje fortsatt fråga tidigare var fel. Det går att fortsätta
radens återstående frågor även efter en sidomladdning.

Fristående fokus, Aha, ordverkstad och berättelseuppdrag har kvar sina egna
övnings- och minnesmärkesregler. Denna samling gäller huvudomgången,
dess Aha-steg och den uttryckliga fortsättningen av stjärnraden.

## Samlingsmärken

| Stjärnor | Samlingsmärke |
| ---: | --- |
| 5 | Första gnistan |
| 15 | Stjärnblomman |
| 30 | Stjärnkompassen |
| 50 | Stjärnlyktan |
| 75 | Stjärnvingarna |
| 100 | Stjärnslottet |

Alla mål syns från början och bygger på samma stjärntotal. Märkena är
kosmetiska; de kräver varken köp, tidtagning, dagliga besök eller en följd
av rätta svar. Inget låser undervisningsinnehållet. När alla sex märken är
samlade kan barnet fortsätta spela och samla stjärnor.

Efter rundan kan barnet också få ett kort uppmuntrande märke:

- **Ordspanare** beskriver att barnet gav sig ut på en ordjakt.
- **Stjärnletare** anger det faktiska antalet rätt direkt när det är minst
  80 procent av frågorna i den ursprungliga raden.
- **Övade vidare** visar stjärnor som tillkommit under fortsatt träning.
- **Alla stjärnor** firar en fylld rad, oavsett om den krävde fler försök.

Ordkompisarna Roffe, Ulla och Dino uppmuntrar försök och eftertanke.
Återkopplingen lovar inte att ett enda svar innebär att ordet är inlärt.

## Resultat och sparande

`star-collection.js` håller samlingens total och en aktiv rad med högst
25 ord- eller uttrycks-ID:n. Varje rad har ett löpnummer. Dubbla anrop,
redan insamlade stjärnor och anrop från äldre rader ger inget extra.
Varje utdelad stjärna sparas omedelbart i den befintliga lokala historiken.

Vid första uppdateringen hämtas stjärnor från giltiga sparade resultat.
Äldre resultat som redan har rullats bort går inte att återskapa. Därefter
är totalen oberoende av gränsen på 50 sparade resultat. Återstående frågor
sparas som ID:n; inga frågetexter eller uppgifter om barnet behövs.

I **Testa dig** delas stjärnorna ut först efter att testet har avslutats.
Inget i stjärnsamlingen avslöjar rätt eller fel under testet. Fortsatt
stjärnträning sker i Träna utan timer, ändrar inte tidigare resultat och
lägger inte till ett nytt provresultat. De verkliga övningssvaren kan
fortfarande hjälpa det befintliga repetitionssystemet; kosmetiska
stjärnor ändrar inte dess regler för återbesök över tid.

Exporten innehåller stjärnsamlingen. Rensa historik tar bort den tillsammans
med övriga sparade framsteg, efter appens befintliga bekräftelse.

## Läsvänlig presentation

Samlingen finns på startsidan och i rundans resultat. Under träningen visas
en kompakt stjärnrad. Märken och stjärnor har text som beskriver deras
status, så att betydelsen inte beror på färg. Textytor använder befintliga
kontrastfärger i ljust, mörkt och högkontrastläge. Korten radbryts på smala
skärmar och respekterar minskad rörelse. Under 380 CSS-pixlar får märkena
en egen rad så att långa namn kan läsas utan olyckliga ordbrytningar.

## Kontroll före publicering

`npm run check` kör innehåll, logik, presentation och Pages-resurser.
Stjärnmodellens tester täcker bland annat omladdning, migrering, dubbletter,
gamla svar, fulla rader och gränsen på sparad historik. Integrationstester
kör produktionsfunktionerna för Aha, fortsättning utan timer och testläge.

Prova även i den publicerade webbläsaren: fel huvudsvar följt av rätt Aha,
guidad förklaring med kvarvarande stjärna, fortsättning av raden, omladdning,
fullt samlingsmärke samt text vid stor förstoring. Barnprovspelning ska
bedöma om målen känns roliga och om barnet använder förklaringarna.

## Genomförd kontroll i publicerat spel

PR #18 provspelades i den publicerade HTTPS-versionen:

- En femfrågorsomgång fick 3 rätt i huvudfrågorna. Ett eget rätt Aha-svar
  fyllde ytterligare en stjärna. Två fel följda av visat facit gav ingen
  stjärna för det återstående ordet.
- Samlingen ökade från 13 till 17 stjärnor. Stjärnblomman firades vid 15.
  Efter omladdning fanns både totalen 17 och raden 4 av 5 kvar.
- Fortsättningsknappen gav bara det återstående ordet, Snöig, i en ny
  vardagssituation utan timer. Eget rätt svar fyllde raden till 5 av 5 och
  ökade samlingen till 18. Rätt Aha efteråt gav ingen dubbel stjärna.
- Den fyllda raden firades med **Övade vidare** och **Alla stjärnor**.
  Texten angav **3 i första rundan · 2 i fortsatt träning**. Historiken
  behöll samma fyra rader och det ursprungliga resultatet 3 rätt av 5.
- Ljust och mörkt läge granskades visuellt. Vid 337 CSS-pixlar med
  webbläsarförstoring fanns ingen horisontell överrullning. Inga egna
  konsolfel eller varningar uppstod under flödet.

Kontrollen ledde till att historikens gamla stjärnsiffra togs bort och
märkena fick en kolumn på riktigt smala läsytor. Historiken förklarar nu
att första svaren ligger kvar medan stjärnor kan samlas genom mer träning.
Faktisk barnprovspelning återstår; den tekniska kontrollen mäter inte
hur motiverande samlingen upplevs eller hur lätt barnen läser texterna.
