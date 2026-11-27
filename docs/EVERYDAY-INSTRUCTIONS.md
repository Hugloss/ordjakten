# Uttryck i vardagen och läsbara teman

27 november 2026.

## Vad barnet ska få hjälp med

Ett vardagligt uttryck kan låta som en annan handling än den som talaren
menar. Varje ny uppgift ger därför en konkret situation innan barnet får
välja betydelse. Förklaringen säger vad orden betyder **just där**.

| Uttryck | Den betydelse som tränas i de skrivna situationerna |
| --- | --- |
| Hoppa i overallen | Ta på sig overallen. |
| Hoppa ner från pallen | Kliva lugnt ner, när den vuxne tydligt visar eller säger att det är det som avses. |
| Släng på dig jackan | Ta på sig jackan. |
| Slå dig ner | Sätta sig. |
| Häng med | Följa med någon. |
| Hoppa över | Lämna en uppgift eller ett steg och gå vidare, när instruktionen säger det. |

”Hoppa ner” kan också betyda ett verkligt hopp. ”Hoppa över” kan handla
om att hoppa över något på marken. De betydelserna är inte fel svenska.
Uppgifterna ska inte kräva att barnet gissar en vuxens outtalade avsikt.
Kontrasterande exempel och frågor som ”Menar du att jag ska kliva ner?”
hjälper barnet att skilja situationerna åt.

## Samma tydlighet genom hela spelet

De sex uttrycken har stabila ID:n `ut-0070`–`ut-0075`. De ingår i det
vanliga vardagsurvalet och går också att hitta i ordsamlingen och Min
ordstig. Inga äldre uttryck eller sparade framsteg tas bort.

Varje uttryck har en betydelsefråga, en uppgift med en ny situation,
tre händelser att ordna, en serie med tre rutor och en separat Aha-situation.
I de uppgifter som frågar efter en handling hör alla svar till samma scen.
Scenen visas en gång före kortare svarsalternativ. Återkopplingen hämtas
från den uppgift som barnet faktiskt besvarade.

Aha byter till en annan skriven situation. Alternativ från olika scener
blandas inte i dessa frågor. Meningsfrågor, fokusövningar, berättelseluckor
och facit använder samma innehåll. Ordsamlingen har en frivillig öppning
**Vad menas här?** med förklaringar och hjälp att fråga vidare.

Efter tillägget finns 121 ord och 73 uttryck, varav 14 skolord. De 73
berättelseluckorna har sammanlagt 219 uppgiftsvarianter. Det automatiska
vardagsurvalet omfattar 101 ord och 65 uttryck; frivillig fördjupning
innehåller fortfarande 20 ord och 8 uttryck. Detta är ett redaktionellt
urval, inte en uppmätt frekvenslista.

## Läsbarhet som del av varje tema

Världarnas färger får ligga kvar i kartor och dekorationer. Text, svar,
förklaringar och återkoppling behöver tydliga textytor. Barnet ska också
kunna läsa ett svar efter att knappen har låsts.

Granskningen gäller ljus och mörk bakgrund, hög kontrast, valda och låsta
knappar samt de tolv äventyrsvärldarna. Färgvärden och CSS-regler kan
kontrolleras automatiskt. Det ersätter inte att läsa den renderade sidan
på olika skärmar eller att provspela med barn.

Palettesterna går igenom 48 kombinationer: tolv världar, två färgteman och
två kontrastlägen. De kräver minst 7:1 för primär text på de granskade
textytorna och minst 4,5:1 för stödtext, knappar och återkoppling. Testerna
läser produktionsfilerna i sidans stylesheet-ordning och tar hänsyn till
de utvalda selektorernas specificitet, bakgrundslager och genomskinlighet.
De granskar inte alla möjliga DOM-kombinationer eller webbläsarens layout.

W3C:s kontrastkriterier anger minst 4,5:1 för vanlig text på AA-nivå och
7:1 på AAA-nivå. Inaktiva kontroller har ett undantag i kriterierna, men
vi behåller läsbar text även där eftersom svar och instruktioner fortfarande
behöver gå att läsa. Se [Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
och [Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html).
En kontroll av utvalda färgpar är inte en fullständig tillgänglighetsgranskning.

## Kontroller inför publicering

`npm run check` validerar att JSON och webbläsardata överensstämmer, att
samtliga uttryck har kompletta uppgifter och att de nya uppgifterna finns
i rätt urval. Regressionstester kontrollerar gemensamma scener, nya
Aha-situationer, uppgiftsspecifik återkoppling och att skolfrågorna behåller
sina egna instruktioner.

Den publicerade sidan behöver också kontrolleras med de nya uttrycken i
ljust och mörkt tema, hög kontrast och smal layout. Anteckna faktisk
webbläsarverifiering i publicerings-PR:n. Barnprovspelning, fysisk pekskärm
och svensk röst behöver fortsatt provas separat.
