# Läs med mig – läs i små delar

Ett frivilligt stöd för barn som tycker att en längre berättelse är svår
att läsa på en gång. Ingår i **Träna**, inte Testa dig.

1. Barnet ser den vanliga stora berättelsen.
2. Vid behov trycker barnet på **📖 Läs med mig – en del i taget**.
3. En stor textdel visas i taget. Man kan gå tillbaka eller framåt.
4. Därefter visas **hela berättelsen igen**, så att barnet kan läsa
   sammanhanget innan det öppnar svarsalternativen.
5. Det vanliga Aha-steget efter svaret finns kvar.

Tekniskt: en liten modul delar den **redan skrivna** berättelsen vid
ordgränser. Alla ord förblir i samma ordning. Inget AI-genererat innehåll,
ingen ny poäng, ingen server och inga nya bilder. Det finns högst fyra delar.

Funktionen visas bara för berättelser som faktiskt går att dela i minst
två meningsfulla bitar. Vissa korta texter är fortfarande enklast att
läsa direkt. Den frivilliga knappen ersätter inte en riktig kontroll
av ordförståelse; Aha-frågan finns kvar.

Om webbläsaren har stöd för svensk uppläsning läses den **aktuella
textdelen** upp när man trycker på Lyssna. Inget spelas automatiskt.

### Tester
- `npm run check` kontrollerar textbevarande och integration.
- `python tests/browser_guided_reading.py` testar flödet i Chromium
  (kräver Playwright och Chromium).
- Under manuell provspelning: kontrollera att barnet hittar knappen,
  kan gå bakåt, ser hela berättelsen före svaren och inte fastnar.

## Barnvänlig textdelning

Berättelser delas nu helst vid meningar och naturliga pauser.
Korta meningar utan en bra paus visas som en enda helhet; knappen
**Läs med mig** visas bara när det finns flera meningsfulla delar.

Uttryck (t.ex. `för en gångs skull`) hålls alltid ihop i samma del.
Under stegvis läsning döljs hela den vanliga frågerutan, så att den
inte konkurrerar med texten som ska läsas. När barnet väljer
**Visa hela berättelsen** återkommer originaltexten i fokus innan
svaren kan visas.

Automatiska innehållstester går genom alla 129 vanliga vardagsscener
och 25 uttryck och kontrollerar att inga ord försvinner.
