# Aha: nya berättelser är starkare bevis än upprepade gissningar

## Vad som ändras
Aha-uppgiften använder nu en annan **redaktionsskriven vardagsberättelse**
än förra gången när ordet har flera. För uttryck växlar vi mellan
två redan skrivna källor: luckbokens exempel och meningens uppdrag.

En hjälpt Aha-uppgift sparas som ett behov av framtida träning, även om
ordets vanliga fråga blev rätt. Två senare **självständigt korrekta svar
i olika situationer på olika dagar** visar starkare överförd förståelse.
Två snabba svar på samma exempel räcker inte. Missar barnet senare får
ordet en ny chans igen.

Detta är en varsam övningssignal, inte ett säkert mått på läsförståelse
och inte något betyg. Aha-resultatet påverkar **inte provpoäng**.
`Testa dig` använder fortfarande samma oberoende frågeval som tidigare.

## Dataskydd och kompatibilitet
All historik lagras enbart i webbläsaren. Vi sparar **korta koder för
de redaktionsskrivna exemplen** (t.ex. `context:1`), inte
barnets egna formuleringar eller råa svar. Äldre `readingProgress`
läses som tidigare, utan att nollställas.
Misslyckas lokal lagring fungerar spelet ändå.

## Tester
`npm run check` kontrollerar att alla kuraterade sammanhang och uttryck
har rätt svar, att exempel varierar, att upprepningar samma dag inte
skapar falsk säkerhet, att tidigare sparningar fungerar och att
provpoängen är oförändrade. Det finns ingen ny CI-jobbmatris.
