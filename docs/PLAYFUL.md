# Ordjakten 0.2.0 – lekfullt för 8–10-åringar

## Produktmål

Gör ord och begrepp roliga att förstå, inte bara roliga att gissa. Också en elev
som gissar fel ska vilja läsa vad ordet betyder och våga försöka igen.

## Flöde

1. **Snabbstart** startar 10 ord med bilder, utan tidspress (Träna).
2. **Valfria inställningar**: Träna/Testa dig, nivå, antal, timer, tema,
   ordkompis och ljud.
3. **Träna**: direkt feedback; hela frågan och svarsalternativen försvinner.
   Betydelsen och exemplet visas. Ett rätt svar ger 1 stjärna.
4. **Testa dig**: inget facit, rätt/fel eller stjärnpoäng visas innan slutet.
5. **Resultat**: rätt/fel/obesvarade, stjärnor och 1–4 positiva märken.
6. **Nästa försök**: tidigare fel kan tränas igen utan att frågorna dupliceras.

## Figuren och mikrointeraktioner

| Kompis | Emoji | Namn | Syfte |
| --- | --- | --- | --- |
| Räv | 🦊 | Roffe | Nyfiken upptäckare |
| Uggla | 🦉 | Ulla | Klok och lugn |
| Drake | 🐉 | Dino | Äventyrlig |

Kompisens val sparas lokalt i `ordjakten-v1` via validerade inställningar;
namn på barnet efterfrågas inte. Ingen spårning eller fjärrsynkning.

- Uppmuntran varierar mellan frågor med förutsägbar, testbar logik.
- Tre rätt i rad ger en liten extra kommentar men **inte** fler stjärnor.
- Etapper markerar framsteg/avklarade frågor och är skilda från stjärnor.
- Ett fel ger en vänlig reaktion, aldrig minuspoäng eller bestraffning.
- Ljudeffekter är *avstängda från början*, skapas lokalt utan ljudfiler,
  och visas aldrig som ett krav för att kunna spela.
- Animationer respekterar `prefers-reduced-motion`.

## Märken

- **Ordspanare**: genomförde en omgång oavsett poäng.
- **Tre i rad**: minst tre korrekta svar i följd.
- **Stjärnletare**: minst 80 % rätt.
- **Ordmästare**: alla rätt.

Märken ges i presentationslagret `public/js/playful.js`, utan databas.
För yngre barn är **att läsa förklaringen** viktigare än att nå högsta poäng.

## Kvalitets- och integritetsregler

- Bildfrågor visar bara uttryckligen kuraterade emojis (fortsatt 40 godkända).
- Använd egna formuleringar på förklaringarna; inga officiella prov kopieras.
- Testläge visar inte individuell prestation i realtid.
- Ordkompisljud får aldrig starta automatiskt på sidladdning.
- Ingen ny vuxen- eller barnprofil krävs.
- 121 historiska ord, teman och timerlägen är bevarade.

## Test och visuella kontroller

- `npm run check`: innehåll samt Node-test av logik, inställningar, märken.
- `python tests/browser_smoke.py`: befintliga spel/timer/mobil/test-scenarier.
- `python tests/browser_playful.py`: ordkompis, snabbstart, tre i rad,
  välvillig felrespons, märken och frånvaro av facit under prov.
- `docs/previews/`: uppdaterade skärmbilder av start, pågående och feedback.

## Nästa möjliga steg

1. Barnprovning med 3–5 elever i åldern 8–10, fånga svårlästa ord och
   missvisande emoji-varianter utan att samla in personuppgifter.
2. Skapa kuraterade fasta distraktorer där de nu slumpas ur andra definitioner.
3. Inför valfria korta tema-uppdrag, t.ex. djur, natur och vardag, först när
   ord för dessa teman har kvalitetsgranskats och märkts upp.
4. Återuppta avbrutna spel utan att bryta provrättvisan.
5. Föräldravy på samma enhet med veckans vanliga felord – utan konton.

## 0.3: äventyrsvärldar

Tre världar och fyra upptäckbara platser per värld är nu implementerade. De påverkar bara berättelsen och utseendet; inte ordpoolen eller bedömningen. Se `ADVENTURES.md`.
