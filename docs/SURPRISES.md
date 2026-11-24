# Berättelseluckor — Ordjakten 0.8

## Idé och ålder

Ett litet samlarhäfte, **inte en kalender bunden till datum**. Barn 8–10 år hittar ett uttryck under Träna och kan frivilligt öppna en lucka med tre redan befintliga illustrationer och ett nytt miniuppdrag. Fokus är ordförståelse och överföring till en **annan situation**. Inga extra poäng ges i testet.

### Så fungerar det

1. **Låst:** Luckan visar 🔒 utan att avslöja uttrycket.
2. **Upptäckt:** Barnet har besvarat uttrycket i Träna. Luckan låses upp, även om svaret var fel. I Testa dig låses besvarade uttryck upp **först när provet avslutas**.
3. **Öppnad:** Barnet klickar på 🎁 och ser en befintlig serie i tre scener + ett nytt miniuppdrag. Detta är frivilligt, och ”Nästa ord” är aldrig låst bakom uppdraget.
4. **Förstådd:** Barnet hittar vilket av två **nya vardagsexempel** som passar uttrycket. Då får luckan en ⭐. Fel svar får en lugn andra chans. Detta ändrar inte rätt/fel, timer eller stjärnorna från huvudspelet.

**Exempel – ”för en gångs skull”:** I ordfrågan kan pappa ovanligtvis skjutsa till hockeyn. Efteråt väljer barnet mellan en ny situation där Leo *oftast inte* kan följa med men kan det just i dag, och en situation där han följer med som vanligt. Förklaringen hjälper barnet att känna igen ett undantag i en annan berättelse.

## Färdiga bilder, inga nya illustrationer

Alla serier använder de **73 redan paketerade Noto Emoji-PNG:erna** från version 0.7, med deras SIL Open Font License 1.1-information i `public/assets/story-icons/NOTO-EMOJI-LICENSE-AND-COPYRIGHT.txt`. Inga nya bilder genereras eller laddas ner. Tecknen är stöd: samtliga serierutor har läsbara svenska bildtexter; saknad bild får en emoji som reserv.

## Säker, enkel arkitektur

- `public/data/surprises.json`: redaktionell källa för **25 manuellt skrivna miniuppdrag** med ett rätt svar, ett närliggande felval, en unik ny vardagssituation och en återkoppling.
- `public/data/surprises.js`: exakt samma data, för statisk användning utan byggverktyg.
- `public/js/surprises.js`: validering, rättningslogik och säker hantering av lokal luckhistorik.
- `public/css/surprises.css`: temaoberoende, responsiva luckor och läsbara svarsfärger.
- `public/js/app.js`: luckbok, öppna/stäng, minifråga, lokal sparning och integration efter testet.
- `public/sw.js`: lägger till nya filer i offline-cache (v8). GitLab/GitHub Pages kan fortsatt hosta samma statiska filer.

Lokal historik använder bara samlingarna `surprises.unlocked`, `.opened`, `.mastered` med uttrycks-ID:n (`ut-0001` osv.). **Inga namn, användarkonton eller personuppgifter lagras av denna funktion.** Gamla resultat migrerar automatiskt med tom luckbok. Export och Radera resultat inkluderar också lucksamlingen.

Ingen kalender krävs, inget löfte om dagliga nytt innehåll: barn kan spela när de vill och hitta luckor i valfri ordning. **Testa dig visar aldrig en lucka eller dess facit under provets gång.** Oupptäckta testfrågor som inte ens besvarats låser inte upp luckor.

## Kvalitetsregler för innehåll

- Samma 25 uttryck och ursprungliga ordfrågor bevaras.
- Minifrågan använder **inte den ursprungliga meningen**; den prövar om barnet känner igen uttrycket i en ny situation.
- Båda alternativen ska vara begripliga och realistiska för barn 8–10 år; inga rena nonsensdistraktorer.
- Facit är alltid entydigt. Valen kan stå i olika ordning beroende på uttryck.
- Lättlästa förklaringar och mörk/ljus/högkontrast kontrolleras automatiskt och manuellt.
- Ordbanken och bonusuppdragen är fortfarande redaktionella utkast som bör språkgranskas och provspelas med barn innan bred publicering.

## Tester

```sh
npm run check
python tests/browser_surprises.py
python tests/browser_smoke.py
python tests/browser_expressions.py
```

Det finns också egna kontroller i `tests/surprises.test.js` för 25 poster, unika facit, uppgraderingar och felaktiga ID:n.
