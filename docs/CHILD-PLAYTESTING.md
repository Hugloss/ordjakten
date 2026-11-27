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
   på skärmen. Rättelse och aktuell förklaring visas direkt. Kompletterande
   undervisning öppnas under *Fler exempel och fundera själv*.
4. **Pröva**: En separat Aha-fråga med tre alternativ frågar om **en annan
   situation** där uttrycket/ordet passar. Alla 121 ord har tre skrivna
   situationer och en separat lista med granskade felberättelser.
5. **Vidare**: *Nästa ord* visas när barnet svarat rätt eller fått ett förklarat exempel efter två försök.
   Fel på kontrollen ger stöd att läsa igen och pröva, inte minuspoäng.

## Skyddsräcken

- Den korta kontrollen är **inte** ett nytt provresultat och påverkar
  varken vanliga rätt/fel eller stjärnor. Separata Aha-observationer kan
  användas för att välja senare, frivilliga återbesök.
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
- Är huvudförklaringen tillräcklig innan barnet öppnar fler exempel?
- Kan barnet lyssna på både berättelsen, förklaringen och Aha-frågan när
  webbläsaren stöder uppläsning? Lyssnar det på samma alternativ som visas?
- Fråga vad det tror att Aha-frågan betyder och varför ett svar passar.
- Låt barnet svara fel på Aha-frågan; blir det hjälpt att läsa igen?
- Testa även vanliga ord utan berättelse, bildord och **Testa dig**.
- Prova med skärmläsare, tangentbord, 320 px mobil och reducerade animationer.

Automatiska kontroller: `npm run check`, samt `python tests/browser_reading_flow.py`
med Playwright och Chromium installerade.

## Test av läsbarhet och Aha-frågor

Se `docs/READING-FLOW.md` för ett barnprovtest utan hjälp i svarssituationen. Vi observerar om barnet verkligen läser och kan använda ordet i en ny berättelse; att trycka på en knapp är inte bevis för förståelse.


## Nytt provspelningstest
Observera utan att vägleda: hittar barnet berättelsen på första skärmen, läser det betydelsen innan Aha-frågan och förstår det varför rätt exempel passar? Vid första fel ska förklaringen återkomma. Vid ett andra fel visas facit pedagogiskt, utan att ett gissat svar får räknas som självständig förståelse. Prova mobil, dator, ljus/mörk, lång berättelse och Testa dig. Ingen lästid lagras om barnet.

## Fördjupade ordförklaringar: fem ord åt gången

Välj fem befintliga, vanliga ord, gärna från olika områden: exempelvis
genomskinlig, grumlig, sparsam, uppmärksam och lättad. Låt barnet själv
välja om det vill besvara den frivilliga tankefrågan muntligt.

1. Be barnet peka ut vad i berättelsen som gör att ordet passar.
2. Fråga varför motexemplet inte visar samma betydelse. Hjälp efteråt om
   själva ordet i motexemplet var svårt att läsa.
3. Be om ett eget exempel som skiljer sig från spelets tre berättelser.
   Ett muntligt svar räcker; bedöm inte stavning som ordförståelse.
4. Visa eller beskriv en ny situation efter en paus, utan att först läsa
   förklaringen igen. Lyssna efter barnets skäl, inte bara rätt ord.
5. Fråga vilken förklaring som hjälpte och om någon ruta var för lång.
   Avsluta när barnet vill; fem ord är ett urval, inget krav på att bli klar.

Skilj i anteckningarna mellan svårigheter att läsa texten, förstå ordets
betydelse och använda det i en ny situation. Rätta oklara scener eller
svarsalternativ innan nya ord läggs till. Se [WORD-UNDERSTANDING.md](WORD-UNDERSTANDING.md).
