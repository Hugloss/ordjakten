# Provspelning med barn: tydligt läsflöde

## Bakgrund

Vid provspelning (8–10 år) var berättelsen för liten jämfört med orden och
barnet tryckte lätt på **Nästa** utan att läsa förklaringen. Det här är en
konkret användbarhetsbrist, inte ett problem som kan lösas med fler stjärnor.

## Så ska Träna fungera

1. **Läs**: Berättelsen visas före svaren, i stor text och med tydlig rubrik.
2. **Välj**: Barnet öppnar alternativen med *Jag har läst – visa svaren*.
   Berättelsen finns kvar så att det går att gå tillbaka och läsa igen.
3. **Förstå**: Efter rätt/fel försvinner frågan och förklaringen blir störst
   på skärmen. Exempel och Aha-ruta visas med läsbar text.
4. **Pröva**: En separat tvåvalskontroll frågar om **en annan situation**
   där uttrycket/ordet passar, när en granskad sådan finns. Annars får
   barnet välja mellan två redan granskade betydelser.
5. **Vidare**: *Nästa ord* visas först när kontrollen är rätt besvarad.
   Fel på kontrollen ger stöd att läsa igen och pröva, inte minuspoäng.

## Skyddsräcken

- Den korta kontrollen är **inte** ett nytt provresultat och påverkar
  varken vanliga rätt/fel, stjärnor eller repetitionsschema.
- I **Testa dig** / högskoleprovsutmaningen visas ingen förklaring eller
  efterfråga under provet. Frågeantalet och tiden påverkas inte.
- Ingen tidsbaserad låsning av knappar: barn läser i olika takt.
- Inga felaktiga eller syntetiska bilder tillförs.
- Texten, inte dekor, ska dominera; mörkt/ljust tema och 320 px kontrolleras.
- Att klicka rätt på Aha-frågan **bevisar inte** full förståelse. Fråga
  också barnet muntligt vad ordet betyder och om det kan hitta ett eget exempel.

## Snabb manuell provspelningscheck

- Visa en uttrycksberättelse för barnet utan att ge instruktioner.
  Fråga vilket textstycke det tittade på först.
- Kan barnet visa med fingret **vad det skulle läsa** innan alternativen?
- Kan barnet hitta den nya förklaringen och läsa den utan hjälp?
- Fråga vad det tror att Aha-frågan betyder och varför ett svar passar.
- Låt barnet svara fel på Aha-frågan; blir det hjälpt att läsa igen?
- Testa även vanliga ord utan berättelse, bildord och **Testa dig**.
- Prova med skärmläsare, tangentbord, 320 px mobil och reducerade animationer.

Automatiska kontroller: `npm run check`, samt `python tests/browser_reading_flow.py`
med Playwright och Chromium installerade.
