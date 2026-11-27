# Utvecklingsplan – idéer vi inte vill glömma

## Nästa arkitektursteg – utan att tappa befintligt innehåll

Den kanoniska målbilden och den detaljerade migreringsordningen finns i [ARCHITECTURE.md](ARCHITECTURE.md). Inventera först frågor, kunskapsmål, scener, ID:n, återkoppling och belöningar. Inför därefter en liten läsadapter och ett gemensamt pilotfall innan innehåll flyttas. Separera sedan bedömning, urval och lärandeprogression från spelmodellerna, med bevarad webbläsarhistorik. De nuvarande språkspelens regler och offline-funktion är kompatibilitetskrav, inte något som ska skrivas om samtidigt.

## Nuvarande MVP (finns i koden)

- Ordjakten som namn, barnvänlig design och svenska texter.
- Startsida, Träna och Testa dig, Lätt/Medel/Svårt/Högskoleprovsutmaning.
- Bildstöd endast på Lätt, utan missvisande automatiska illustrationer.
- 121 tidigare ord + 25 vardagsuttryck, definitioner, exempel, filtrerbar ordbank.
- Enstaka ord, uttryck med berättelseluckor eller en blandning, utan att förlora tidigare historik.
- Aha-förklaringar i Träna och fördröjt facit i Testa dig; karta hopfällbar på mobil.
- 5/10/15/20/25 frågor med slumpad ordning.
- Total/per-fråga/ingen timer med valfria tider och egen tid.
- Direkt återkoppling i Träna; fördröjt facit i Testa dig.
- Rätt/fel/obesvarade, repetitionslista och sparad historik.
- Mörkt/ljust/auto samt hög kontrast.
- Offline-stöd efter första besöket, relativt filsystem för GitLab Pages.
- Kod- och innehållstester; ingen publicering ännu.

## Prioritet 1: Kvalitet före bredare lansering

- Redaktörsgranska de 25 nya vardagsuttrycken och alla handskrivna svarsalternativ. Testa om Aha-rutorna verkligen hjälper 8–10-åringar att förstå skillnaden mellan orden i uttrycket och vad uttrycket betyder.

- Språkgranska alla 121 ord och deras exempelmeningar.
- Skapa redaktionellt godkända *fasta distraktorer* för varje fråga.
- Barnprovspela lätt nivån, särskilt emoji-bilder på flera plattformar.
- Lägga till browser-E2E i CI (Chromium), inklusive timer, mörkt/ljust och mobil.
- Återuppta pågående omgång efter oavsiktlig omladdning (valfritt, utan att påverka provrättvisa).
- Testa med svensk skärmläsare och tangentbord.

## Prioritet 2: Pedagogiskt djup

- Visuell **Min ordstig** för alla ord och uttryck finns i 0.14. **🎯 Träna det här!** med riktade mikroövningar är implementerad i 0.15. Fortsätt testa om barn tolkar de fyra markörerna rätt och om förslag på nästa övning hjälper mer än de distraherar.

- **Genomfört 0.16–0.18:** jämförelseövningar med närliggande ord och 96 redaktionellt skrivna scener för tolv par med olika vardagsmiljöer. Nästa steg: provspela med barn och granska om variationen leder till verklig begreppsförståelse.
- **Genomfört:** välj Blanda / Upptäck nytt / Ge ord en ny chans i Träna. Urvalet visar tillgängliga frågor, respekterar repetitionspauser och påverkar inte Testa dig.
- Schemalagd repetition finns i 0.11, 129 scenbaserade frågor för 43 ord i 0.12 och **färdighetsanpassad variation per frågetyp** finns i 0.13. Nästa steg: barnprovspela urvalsregler, tidsintervall, förklaringar och distraktorer; utöka scenbanken där barnen oftast fastnar.
- Testa belöningar (nu implementerade) på riktiga barn 8–10 år och förenkla efter feedback.
- Tolv äventyrsvärldar och deras SVG-stigar finns i 0.5. Barnprovspela framför allt mobilkartans tydlighet och hur delmål uppfattas.
- Tre frivilliga miniuppdrag utan köp eller daglighetskrav är implementerade i 0.10. Fortsätt utvärdera fler varianter med barn.
- Valfri julkalender med 24 språkluckor som bygger på berättelsefrågorna, men utan obligatorisk daglig inloggning eller datainsamling.
- Fler uttryck i separata åldersnivåer; i 0.6 är uttrycksbanken fortfarande för cirka 8–10 år.
- Föräldravy med vilka begrepp barnet behöver öva, utan persondata.
- Fler nivåer och ämnesindelning (svenska, engelska, NO, SO, matematik).
- Möjlighet att sätta egen tid per fråga och tillgängliga uppspelade instruktioner.

## Prioritet 3: Högskoleprovet och äldre användare

- Stor separat expertbank med noggrant granskade 5-alternativsfrågor.
- 10 ord / 3 minuter som snabbval och statistik per delomgång.
- Förklaringar efter provpasset; inga facit under tiden.
- Ingen användning av namn, grafik eller material som antyder att det är ett officiellt högskoleprov.

## Prioritet 4: Distribution

- Skapa ett repository *när ni bestämt konto*.
- GitLab Pages kan publicera `public/` automatiskt på main efter gröna kontroller.
- Alternativ: GitHub Pages eller Cloudflare Pages, helt statiskt.
- Riktig domän och eventuella skol-/lärarkonton först när de behövs.

## Saker att inte lägga till för tidigt

- Ingen databas, server eller login innan verkliga behov finns.
- Ingen barnprofil med namn, klasslistor, kontaktuppgifter eller spårningsanalys.
- Inga tunga ramverk eller onödiga runtime-beroenden.
- Ingen automatisk fråga-på-kommando-generator utan redaktionell kontroll.


## Efter 0.17 – nästa pedagogiska steg

- Kuratera fler entydiga jämförelsepar och alternativa berättelser som provspelas med barn.
- Testa om längre intervall mellan olika jämförelser hjälper förståelsen (inte tolka fyra svar i en session som fyra dagar).
- Ge barnet möjlighet att jämföra närliggande uttryck, men först när det finns kvalitetssäkrade exempel.
- Verifiera PWA offline, verklig localStorage-omladdning och tillgänglighet i en normal webbläsare innan publicering.
