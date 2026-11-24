# QA – Ordjakten 0.17

## Automatisk kontroll

Kör `npm run check` och `python tests/browser_confusions.py` från projektroten.

Nytt i v0.17:

- När barnet väljer det andra ordet i ett **godkänt tvåvalspar** sparas vilket ord barnet faktiskt valde, inte svarstexten.
- Tre fel och ett rätt i en kort jämförelse ger ett vänligt förslag på startsidan, **Jämför orden** leder till rätt övning.
- Fyra senare korrekta jämförelser på samma par avaktiverar förslaget.
- Vanliga Testa dig-resultat påverkar inte den nya förväxlingsdatan.
- Felaktiga och okända lagrade par-ID:n tas inte emot.
- Radera historik ska även rensa `confusionProgress`.
- Både 390 px mörkt och 320 px ljust/högkontrast har kontrollerats.

## Manuell kontroll inför publicering

1. Packa upp projektet, kör `npm start` och öppna den visade adressen i en **vanlig webbläsare**.
2. Gå till **Hitta skillnaden**, svara fel minst två gånger på samma par, avsluta fyra frågor. Kontrollera att startsidan erbjuder paret för jämförelse.
3. Ladda om sidan. Kontrollera att förslaget är kvar. Stäng och öppna webbläsaren och gör om kontrollen.
4. Slutför en ny jämförelse med fyra rätt och kontrollera att förslaget försvinner.
5. Växla mellan mörkt, ljust och högkontrast. Verifiera läsbarhet även i liten mobilbredd.
6. Starta **Testa dig** med 5 och 10 frågor. Kontrollera att resultatet väntar till slutet och att förväxlingskortet inte ändras.
7. Exportera resultat, kontrollera att endast godkända ID:n/räknare följer med. Radera historiken och kontrollera att förslaget försvinner även efter omladdning.
8. Koppla ned nätverket och kontrollera en tidigare installerad PWA med redan cachelagrat innehåll. Detta är en separat kontroll från att JS fungerar i testmiljön.
9. Låt några barn 8–10 år testa ordparen: kontrollera att ordvalen har en entydig betydelse i berättelserna och att återkopplingen känns uppmuntrande.

Det finns inga annonser, konton eller servrar i denna version. Ingen publicering har gjorts.
