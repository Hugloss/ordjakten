# Aha-övningar och verklig ordförståelse

Den första provspelningen visade att barnet kunde klicka sig förbi långa
förklaringar och att stora svarsrutor skymde berättelsen. Läsflödet har därför
separata steg: **läs först → svara → läs förklaringen → använd i en ny uppgift**.

## En viktig skillnad

Ett rätt svar på en ordfråga betyder inte automatiskt att barnet kan använda
ordet. Aha-kontrollen registrerar därför oberoende om barnet:

- klarade den **direkt** (`first`),
- behövde läsa igen men klarade den (`retry`), eller
- fick förklaringen visad med rätt exempel (`guided`).

Det sparas som små räknare per anonymt innehålls-ID (`readingProgress`) och
skiljs åt mellan `transfer` (ny berättelse/uttryck) och `recognition`
(definitionsigenkänning). Inga svarstexter, barnnamn eller konton lagras.
Aha-kontrollen ger **inga extra provpoäng och inga stjärnor**.

Efter ett understött svar kan nästa vanliga *Träna*-omgång prioritera ett
**nytt sammanhang** för ordet, eller en annan uppgiftstyp om nya berättelser
saknas. Efter två självständiga svar i separata omgångar minskar den extra
prioriteten. Det är en enkel pedagogisk heuristik, inte ett säkert bevis på
att begreppet är inlärt. `Testa dig` och högskoleprovsläget påverkas inte.

## Visuellt fokus för 8–10 år

Berättelsens text är stor, svaren dolda fram till steg 2, och en berättelses
platsrubrik visas i samma ruta som själva berättelsen – inte nedanför som en
lös rubrik. På återkopplingssidan är rätt/fel direkt synligt, men firandet
är nedtonat tills barnet har provat förklaringen.

## Förälders provspelning

Låt barnet spela fem vardagsfrågor utan instruktioner. Lägg särskilt märke till:
läser barnet spontant berättelsen, förstår det Aha-förklaringen, och kan
barnet resonera om *varför* det valde rätt i det nya exemplet? Om inte måste
text och distraktorer granskas, inte bara storleken på knapparna ändras.

Kör `npm run check`, `python tests/browser_reading_flow.py`, och prova lagring
över sidomladdning i vanlig webbläsare innan publicering.
