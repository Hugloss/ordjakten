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
dess Aha-steg, den uttryckliga fortsättningen av stjärnraden och de
egna rätta svaren på skattkartans orduppgifter.

## Skattkartan: ledtråd, plats och orduppgift

Startsidan har knappen **Följ skattkartan**. Kartan använder de tolv
befintliga världarna med fyra platser vardera. Alla fyra platser går att
välja från början. Varje plats har ett namn, en bildsymbol och en kort
beskrivning av det som finns där. Barnet behöver inte tolka enbart färg,
emoji eller okända karttecken.

En ledtråd beskriver en bestämd plats utan att säga dess namn. Exempel:
**Sök efter ett stort träd där en uggla håller ordning på böcker.** Barnet
jämför ledtråden med platsernas beskrivningar och väljer en plats.
En extra ledtråd är frivillig och minskar inte den möjliga belöningen.
Alla ledtrådar har dessutom två skrivna hållpunkter, exempelvis **ett stort
träd** och **en uggla med böcker**. Under **Leta efter båda** delas ledtråden
upp när barnet ber om hjälp. Efter en avstickare visas hållpunkterna
tillsammans med ledtråden och den valda platsens beskrivning. Spelet
namnger inte rätt plats i förväg eller antar att en sak saknas bara för
att den inte står i en beskrivning.

Besöket innehåller den orduppgift som redan är skriven för den platsen.
Det finns två olika framsteg:

| Händelse | Sakletare | Ordfrågan |
| --- | --- | --- |
| Barnet väljer platsen som passar ledtråden och avslutar besöket | En sakletarpoäng och ledtrådens skatt | Bedöms genom barnets eget svar |
| Barnet väljer en annan plats och avslutar besöket | Ett vanligt litet fynd vid första besöket, ingen sakletarpoäng | Samma möjlighet att få en ordstjärna |
| Eget rätt svar på ordfrågan, direkt eller efter en ny titt | Ändrar inte platsvalet | En stjärna för platsens uppgift |
| Två fel eller uttrycklig hjälp visar lösningen | Rätt plats ger fortfarande sin skatt | Ingen stjärna för visat facit |
| Återbesök där fynd eller stjärna redan samlats | Ingen extra poäng eller dubblett | Ingen extra stjärna |

Efter en avstickare ligger den ursprungliga ledtråden kvar. Barnet kan
leta vidare och få hela skatten när det hittar rätt plats. Vanliga fynd
benämns som små fynd; spelet kallar dem inte dåliga eller barnet dålig på
att leta. Varje karta har fyra sakletarpoäng och fyra möjliga ordstjärnor.
När alla ledtrådar är lösta är kartan färdig, men platserna kan återbesökas.
Det finns ingen timer, fartbonus, nedräkning eller förlust av tidigare fynd.

### Mysterier: hitta, bevisa, förklara och pröva i en ny situation

Efter barnets första skatt öppnas ett fristående mysterium i varje värld.
Barnet får tre ledtrådar, väljer en plats och läser varför ett annat val
inte passar. Efter lösningen finns en frivillig bevisfråga med två konkreta
detaljer från platsen. **Berätta som en detektiv** uppmuntrar sedan barnet
att själv säga *därför att* och använda båda spåren. Ett skrivet exempel
kan öppnas vid behov, men inget fritt svar eller tal spelas in.

När barnet har löst bevisfrågan blir **Prova ett nytt fall** tillgängligt
under en stängd, frivillig panel. Alla tolv kartor har en egen redaktionellt
skriven vardagssituation med två nya ledtrådar och tre alternativ:
- Ett alternativ passar båda detaljerna.
- Ett alternativ passar bara den första detaljen.
- Ett alternativ passar bara den andra detaljen.

Exempel: klassen ska till badhuset med **buss 4**. Buss 4 mot centrum har
rätt nummer men fel mål. Buss 6 mot badhuset har rätt mål men fel nummer.
Barnet behöver kontrollera **både bussnummer och destination**, inte bara
känna igen ett bekant ord. Felval ger en konkret förklaring och låses som
redan provade; det går att pröva ett annat svar utan stress. Efter rätt
val kan barnet först berätta med egna ord innan förklaringen öppnas.

Nya fallet är **inte** ett prov och ger inga poäng, extra skatter eller
ordstjärnor. Kartans ordövning är opåverkad. Endast korta index för
felalternativ och löst/olöst sparas lokalt under mysteriet. Tidigare
sparade mysterier utan de nya fälten fortsätter fungera. Framtida
kartledtrådar och deras svar avslöjas inte av det nya fallet.

Källan för samtliga tolv fall är `public/js/treasure-hunt-data.js`
(`TRANSFERS`). Motor och granskning finns i `public/js/treasure-hunt.js`,
`tests/treasure-hunt-content.test.js`, `tests/treasure-hunt.test.js`,
`tests/treasure-hunt-view.test.js` och `tests/treasure-integration.test.js`.
Kör `npm run check` före merge. Ett verkligt barnprov krävs fortfarande
för att bedöma om barnet *förstår och förklarar* de två spåren.

### Kartmärken och nästa steg

**Min skattbok** samlar de tolv kartorna med separata räknare för hittade
skatter och ordstjärnor. Fyra avslutade rätta platsbesök ger kartans
**kartmärke**, oavsett hur mycket hjälp ordfrågorna krävde. Samlingen
räknas direkt från redan sparade fynd. Den har ingen ny poängräknare,
ingen ny sparad märkeshistorik och inga låsta världar.

En färdig karta visar sitt märke och hur många ordstjärnor som återstår.
Barnet kan gå direkt till en plats vars ordstjärna saknas eller välja
nästa karta som inte är färdig. När alla kartor är färdiga försvinner
förslaget om en ny karta; de befintliga platserna är fortsatt öppna för
ordövning. Ett kartmärke säger att barnet har följt kartans ledtrådar,
inte att varje ord är inlärt.

### Sparande och återkoppling

Kartans fynd är en separat samling från berättelseuppdragens minnesmärken.
Ordfrågornas stjärnor ökar den befintliga stjärnsamlingens total utan att
byta ut en pågående vanlig stjärnrad. Varje plats har en beständig nyckel,
så omladdning eller upprepade klick inte ger nya stjärnor. Orduppgifterna
är övning och skriver inte om provresultat eller registrerar ett ord som
inlärt. Platsvalet används inte som ett mått på ordkunskap.

Fynd, ledtråd, använda hjälptexter och pågående besök sparas lokalt med
övriga framsteg. Även svarsalternativens ordning och ett första felsvar
finns kvar efter omladdning. **Till kartan** kan lämna en obesvarad uppgift.
Efter ett svar leder **Titta på fyndet** vidare till belöningen, så barnet
inte råkar lämna den utlovade skatten bakom sig. Även en fördröjd
avbrytknapp från frågesteget ignoreras under förklaringen. Huvudmenyns
**Spela** låter barnet fortsätta besöket senare. Export och rensning
omfattar också skattkartan.

`treasure-hunt-data.js` innehåller de 48 ledtrådarna. `treasure-hunt.js`
kopplar dem till de befintliga platserna och uppgifterna och håller
besökets tillstånd. `treasure-hunt-view.js` visar karta, uppgift,
förklaring och fynd med vanliga knappar och läsbara textytor. Färgerna
följer ljust, mörkt och högkontrastläge. Uppläsning är frivillig och läser
bara den aktuella ledtråden, synliga platsbeskrivningar eller uppgiften.
Synliga hållpunkter och hjälpen efter ett första felsvar ingår också i
uppläsningen. Vid en avstickare kan barnet lyssna på jämförelsen mellan
ledtråden och den valda platsen. Ingen dold destinationsförklaring eller
kommande lösning läses upp.

Modell- och integrationstester kontrollerar skillnaden mellan platsval
och ordsvar, sparande, ny chans, guidad hjälp, dubbletter och skyddet av
tidigare resultat. I den lokala förhandsversionen kontrollerades fel plats
med egen ordstjärna, rätt plats med guidad hjälp, återbesök utan dubbla
belöningar och återupptagen uppgift efter omladdning. Kartan provades med
tangentbord, i ljust och mörkt tema samt med extra hög kontrast. Vid
337 CSS-pixlars bredd låg platserna i en kolumn utan horisontell
överrullning. Faktisk barnprovspelning återstår.

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
