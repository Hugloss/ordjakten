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

## Samma uttryck kan betyda olika saker

Nästa steg använder sex **befintliga** uttryck. De får 18 ytterligare,
redaktionellt skrivna situationer. För varje uttryck finns två berättelser
med olika tydliga betydelser och en där informationen inte räcker för att
välja betydelse. Alla sex hör till vardagsurvalet.

| Uttryck | Två betydelser som barnet får skilja åt |
| --- | --- |
| Häng med | Följa med till en plats eller förstå en förklaring. |
| Hoppa över | Göra ett hopp över något eller låta en uppgift vara och gå vidare. |
| Hoppa ner från pallen | Kliva ner när det beskrivs så, eller göra ett hopp när det uttryckligen är uppgiften. |
| Vända blad | Bläddra i en bok eller lämna något bakom sig och börja om. |
| Tappa tråden | Tappa en riktig tråd eller glömma vad man höll på att säga. |
| Få kalla fötter | Frysa om fötterna eller bli tveksam inför något man tänkt göra. |

I meningsövningen visas en situation och tre korta svar. Förklaringen efter
svaret använder den aktuella situationens betydelse. Den pekar ut en exakt
ledtråd ur berättelsen och förklarar vad den hjälper oss att förstå. Barnet
ska kunna säga **varför** en betydelse passar här.

I de oklara situationerna är rätt svar en konkret fråga som skiljer de två
möjligheterna åt. Frågan bygger på den information barnet faktiskt har fått.
Vi väljer inte en betydelse utifrån en vuxens outtalade avsikt, och ger inte
en påhittad bokstavlig betydelse till ett uttryck som saknar en sådan.

### Befintliga övningar och synliga förklaringar

**Min ordstig → Alla ord → välj uttrycket → Förstå i en berättelse**
använder alla tre situationerna en gång i den korta fokusövningen. Vanliga
meningsfrågor och luckbokens meningsuppgift använder samma skrivna innehåll.
Ordsamlingen har en frivillig fördjupning med de olika situationerna.

Fristående Aha börjar med en neutral beskrivning av uttryckets möjliga
betydelser. Den avslöjar inte vilken betydelse som gäller i nästa fråga.
Aha väljer en annan tydlig situation än den som nyss visades. Det är bara
de två tydliga betydelsesituationerna som kan bli Aha-underlag. Ett bra
förtydligande i en oklar situation är värdefull övning, men visar inte att
barnet har identifierat en bestämd avsikt som berättelsen inte anger.

En befintlig serie illustrerar sin ursprungliga berättelse. När den visas
efter en annan betydelse presenteras den som **en annan berättelse**, med
sin egen text och sina egna bilder. Den aktuella frågans text läggs inte
ovanpå en serie som föreställer något annat.

### Innehållsformat och kontroll

De sex posterna i `missions.json` får `contextReading` och `contextScenes`.
Varje scen har ett stabilt ID, en situation, en betydelse, en citerad
ledtråd, en förklaring, en jämförelse, hjälp att fråga och tre egna svar.
`kind: meaning` kräver en bestämd betydelse; `kind: clarify` betyder att
barnet behöver mer information. Alla felalternativ har egen återkoppling.

Valideringen kräver två betydelsescener och en förtydligandescen per
uttryck, unika scen-ID:n och svar, en korrekt lösning samt en ledtråd som
faktiskt finns i situationen. Ofullständiga scener får inte ersättas med
en gammal förklaring till en annan betydelse.

Aha:s nya scen-ID:n är knutna till rätt uttryck. Äldre observationsnycklar
bevaras. Uppföljning av frivillig träning använder de aktuella scenerna och
deras svar; ändrat innehåll får inte jämföras som om det vore samma uppgift.
Det tillkommer inget separat betyg eller antagande om barnets språkförmåga.

Logik- och presentationstester ska kontrollera motsatta betydelser, oklara
fall, uppgiftsspecifik återkoppling, nya Aha-situationer och fortsatt stöd
för gamla sparade övningar. Faktisk webbläsarverifiering dokumenteras i PR:n.
Barnprovspelning behöver särskilt undersöka om barnet kan hitta ledtråden
med egna ord och be om förtydligande utan att känna att det har gjort fel.

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

### Genomfört efter publiceringen av PR #15

På den riktiga HTTPS-sidan i Chrome har samtliga 48 temakombinationer
valts genom spelets kontroller. Världsintroduktionens beräknade stil
visade opak bakgrund i alla kombinationer och borttagen världston i
högkontrastläget. Ingen horisontell sidskroll uppstod vid 1348 CSS-pixlar.
Ljust och mörkt tema granskades också visuellt.

En komplett fokusövning för **Hoppa ner från pallen** provades med
meningsfråga, betydelsefråga och ordningsuppgift. Ett bokstavligt hopp
valdes avsiktligt för att kontrollera återkopplingen. Den efterföljande
Aha-frågan visade en gemensam situation och tre korta svar. **Hoppa i
overallen** hittades i vardagsurvalet och dess förklaring öppnades i
ordsamlingen. Låsta ordningsknappar behöll full opacitet och streckad kant.

Kontrollen fångade två presentationer som därefter putsades: Aha-steget
säger **Välj svar**, och fokusförklaringen delas i stycken med kortare
rättelse och färre upprepade exempel. Vardagsuttryckens fristående lässteg
förklarar att den visade betydelsen är en av flera möjliga.
