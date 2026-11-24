# Ordjakten 0.20 – Minnesstigen över tid

## Varför?

Ett rätt svar just nu betyder inte att ett barn kommer ihåg ordet om en vecka.
Ordjakten låter därför barnet återvända till *samma två begrepp* i **nya,
redaktionellt skrivna situationer** från hemmet, skolan, naturen och fritiden.
Inga dagliga krav, påminnelser eller inloggningar behövs.

## Vad barnet ser

- På startsidan visas **🎁 Minns du fortfarande?** först när minst ett ordpar
  har klarats i en full jämförelseomgång.
- `🎁 Prova ett återbesök` visas när en föreslagen tidpunkt har passerats.
- I **Min ordstig** visas läget för ordparet och när det kan vara roligt att
  återvända. Detta är *tips*, inte betyg eller löften om långvarig inlärning.
- Efter fyra frågor får barnet en Aha-förklaring och ett vänligt nästa steg.
- Ett svårt återbesök tar **aldrig bort ett tidigare uppnått steg**.

## Regler – reproducerbara och kodtestade

- Allt registreras **endast från frivilliga fyrafrågors jämförelseövningar**;
  vanliga Träna, Testa dig, timer och högskoleprovet påverkas inte.
- Ett helt pass är **en** observation. Fyra korrekta svar är inte fyra dagars repetition.
- För att få ett nytt minnessteg krävs minst **3 av 4 rätt**, minst ett rätt
  på **vardera ordet**, exakt två frågor per ord och minst **tre olika miljöer**.
- Samma scen-ID får inte ha använts i föregående registrerade pass.
- Ett avklarat första pass föreslår återbesök tidigast om **1 dygn**;
  ett lyckat återbesök därefter om **3 dygn**, sedan **7 dygn**.
  När alla tre steg har nåtts föreslås fortsatt repetition ungefär var 14:e dag.
- För de fyra utvalda paren med *Ledtrådstrappan* krävs nivå 1, 2 respektive 3
  för de tre stegen. Övriga åtta par har bara nivå 1 och kan ändå få återbesök
  med en annan scen och i olika miljöer.
- En omgång innan utsatt tid får gärna spelas men kan inte påskynda schemat.
- Vid en svår omgång får barnet nästa förslag efter ungefär **ett dygn**,
  utan att gamla upptäckter går förlorade.
- Försenade återbesök går bra – appen har ingen daglig inloggningsserie.

## Teknisk struktur

- `public/js/retention.js` är en separat, Node-testbar modul.
- `retentionProgress` lagras under samma `ordjakten-v1`-nyckel i webbläsarens
  localStorage. Befintliga fält och tidigare provresultat migreras som förut.
- Den sparade informationen innehåller endast par-ID, senaste scen-ID:n,
  miljö-ID:n, numeriska räknare och tidpunkter. **Inga** barns namn, texter,
  konton, externa anrop eller nya bildfiler.
- Klockan kommer från enheten och är ingen stark källa för bevisad kunskap.
- Exportera/radera historiken via befintliga kontroller. Radering omfattar
  även `retentionProgress`.
- `public/sw.js` har separat cacheversion och laddar de två nya lokala filerna.

## Begränsningar och framtida pedagogik

- Schemat är en enkel, transparent **heuristik**, inte en kliniskt eller
  vetenskapligt validerad uppskattning av långtidsminne.
- För de tolv kuraterade ordparen finns totalt 96 scener på nivå 1. För fyra
  ordpar finns dessutom 64 scener på de högre nivåerna. När scenbanken är
  förbrukad kan tidigare scener till sist återkomma. Koden kräver ändå att
  ett helt nytt steg inte bygger på samma fyra scener som i föregående pass.
- Detta omfattar inte än alla 121 enskilda ord och 25 uttryck; de använder
  redan sin tidigare repetition från v0.11–v0.19.
- Innehållet bör granskas språkligt och provspelas med barn 8–10 år. Vi bör
  särskilt kontrollera att olika miljöer verkligen kräver samma begreppsliga
  förståelse och att svarsalternativen inte är tvetydiga.
- I en miljö där Chromium blockerar navigation till localhost är verklig
  `localStorage`-beständighet över **riktig sidomladdning** och offline-läge
  fortfarande ett manuellt test innan publicering.

## Kör kontroller

```sh
npm run check
python tests/browser_retention.py
python tests/browser_clue_ladder.py
python tests/browser_context_transfer.py
```

Ingenting publiceras automatiskt från det nedladdningsbara arkivet.
