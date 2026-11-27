# Träningsmål: barnet väljer vad det vill öva

Ordjakten erbjuder tre val i **Träna** (inte expert/provläge):

- **Blanda**: befintligt blandat urval; smart variation är fortfarande frivillig.
- **Upptäck nytt**: bara frågor om begrepp utan registrerade försök,
  Aha-observationer, repetitionskort, äldre fel eller avklarade uttrycksuppdrag.
  Det betyder oprövade i den sparade historiken – inte att barnet aldrig hört ordet.
- **Ge ord en ny chans**: begrepp med en repetitionsfråga som är redo,
  en tillgänglig uppgiftstyp som behöver övas, eller en Aha-fråga som
  krävde hjälp. Ett rätt huvudsvar kan alltså följas av mer träning i nya
  sammanhang. Befintliga repetitionspauser respekteras.

Ämne och svårighetsgrad begränsar alla tre urvalen. Antalet tillgängliga
frågor visas innan start. Om det finns färre än önskat blir omgången
kortare; inga andra begrepp fylls på i de två riktade målen. Vid tomt
urval får barnet välja annat mål eller annan nivå. Ingen fråga upprepas
i samma omgång.

Det gamla valet Träna mina fel har företräde och återställer träningsmålet
till Blanda. Äventyrens snabbval och miniuppdrag behåller sina egna regler.
Testa dig och högskoleprovsutmaningen använder inte träningsmålet. Poäng,
belöningar och Aha-resultat har samma regler som tidigare. Målet sparas
lokalt som en inställning; inga nya personuppgifter eller nätanrop behövs.

## Provspela

Välj Medel och fem frågor. Öva ett ord, prova sedan Upptäck nytt och
kontrollera att redan registrerade ord inte kommer igen. Ge ett ord en
ny chans efter en understödd Aha-kontroll. Testa ett urval med bara en
fråga, ett tomt urval och byte till Testa dig. Kontrollera också att de
gamla snabbknapparna inte ändrar sin utlovade frågetyp. Rensa historiken
och kontrollera att Aha-observationerna försvinner.

Kör `npm run check` och den frivilliga `python tests/browser_practice_goals.py`
med Playwright/Chromium. En riktig barnprovspelning behövs fortfarande
för att bedöma begriplighet och inlärning.
