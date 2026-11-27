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

## Provspelning av skattkartans nya mysterier

Börja med **Följ skattkartan** och en skatt. Låt barnet själv hitta rätt
plats i mysteriet, välja de två bevisen och berätta *varför* med egna ord.
Öppna inte facit eller berätta det rätta svaret innan barnet fått fundera.

Låt barnet därefter själv välja om det vill öppna **Prova ett nytt fall**.
Exempel: bussen till badhuset. Fråga inte bara vilken buss som är rätt utan:

- Vad gör att det andra bussvalet inte passar **båda** detaljerna?
- Kan barnet formulera: ”Jag valde den därför att … **och** …”?
- Förstår barnet varför ett alternativ som passar ett spår ändå är fel?
- Efter ett fel, läser barnet återkopplingen och testar själv igen?
- Hittar barnet uppläsning och hjälp? Är texten lättläst på mobil?
- Förblir det frivilliga nya fallet stängt tills barnet öppnar det?

Kontrollera i ljus/mörk/högkontrast, med tangentbord, 320 px mobil och
utan ljud. Kontrollera omladdning efter ett felsvar och efter rätt svar.
Skatter, ordstjärnor och ordresultat ska inte ändras av det nya fallet.

Dokumentera observationer som *läser ledtrådarna, kombinerar två villkor,
förklarar eget svar, förstår varför annat alternativ faller bort*.
Automatiska tester verifierar funktion och tillstånd men kan inte visa
att barnet faktiskt förstår resonemanget.

### Kort observationspass för mysterier (ca 5–8 minuter)

Detta är ett **manuellt provspelsprotokoll**, inte ett utfört barnprov.
Förbered en mobil eller dator med tom testhistorik. Låt barnet själv välja
om det vill prova; avbryt när det vill. Samla inte in namn, inspelningar,
ordagranna utsagor eller uppgifter om barnet.

1. Säg bara: **”Visa hur du tänker när du väljer.”** Låt barnet hitta
   mysteriets plats och de två bevisen. Berätta inte vad som är rätt.
2. Be barnet förklara med egna ord varför platsen passar. Notera om det
   självmant tar upp *båda* detaljerna eller behöver meningsstarten.
3. Fråga om barnet vill öppna **Prova ett nytt fall**. Titta på om det
   läser båda spåren före svaren, eller provar efter bara ett.
4. Vid ett spontant fel: låt barnet läsa förklaringen utan hjälp. Notera
   om det själv kan peka ut varför det första valet inte räckte.
   Framkalla inte fel genom att uppmana barnet att välja fel.
5. När barnet hittar rätt: fråga **”Varför passar inte de andra?”**
   Om barnet svarar utan att upprepa facit visar det bättre överföring.
   Först sedan får det öppna förklaringen om det vill.

**Observera separat** (inte som ett betyg): hittar barnet knapparna?
Går texten att läsa? Använder det uppläsning? Hittar det på egen hand
*två* relevanta spår? Kan det säga varför ett delvis passande alternativ
inte räcker? Kan det försöka igen utan att bli frustrerat?

Använd nivåerna **självständigt**, **efter läshjälp/meningsstart** och
**ännu oklart** för *varje moment*, inte en totalsumma eller tidsgräns.
Om barnet läser rätt men ändå inte kan förklara två villkor behöver
innehållet förtydligas. Om barnet förstår men inte hittar rätt knapp
behöver gränssnittet rättas. Om uppläsningen behövs är det ett stöd,
inte ett misslyckande.

Gör gärna ett andra kort pass med ett annat fall (till exempel buss 4
till badhuset) utan att först visa lösningen. Rätta otydliga alternativ
innan fler fall eller belöningar läggs till. Automatiska Chromium-kontroller
finns i `tests/browser_treasure_mysteries.py` och provar 320 px i
högkontrast samt datorläge, tangentbord, återkoppling, återöppning
och att skatter/resultat är opåverkade. De kan **inte** bevisa förståelse.

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
