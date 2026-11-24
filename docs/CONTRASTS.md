# ⚖️ Hitta skillnaden — Ordjakten 0.16

## Vad är syftet?

Barnet lär sig att **skilja två ord som lätt kan förväxlas** genom att pröva vart och ett i flera olika situationer. Åtta skrivna berättelser hör nu till ett ordpar. En **spelomgång väljer fyra**, där vardera ordet är facit **exakt två gånger** och minst tre miljöer ingår. Berättelserna och förklaringarna är handskrivna; motorn genererar inga nya betydelser eller berättelser.

Exempel: *grumlig* / *genomskinlig*.

- När lera virvlar runt så att barnet inte kan se ner i sjön, passar **grumlig** bäst.
- När vatten är så klart att stenarna på botten syns, passar **genomskinlig** bäst.

Efter varje svar visas en förklaring av varför ett visst ord passar, samt **skillnaden mot det andra ordet**. Den nya frågan syns inte samtidigt med förklaringen.

## Så använder barnet övningen

1. Klicka på **⚖️ Hitta skillnaden** på startsidan. Det är ett snabbval med 10 enklare godkända par för barn omkring 8–10 år.
2. Eller öppna **Min ordstig**, sök efter ett ord som har ett jämförelsepar, och välj **Hitta skillnaden** där. Då kan även de två svårare paren tränas.
3. Svara på fyra korta situationer; de två ordvalen kommer i olika ordning.
4. Efter varje svar: läs Aha-förklaringen. Efter sista frågan visas antal rätt och fel, utan betyg.

Det är en **riktad träningsövning**, inte del av de ordinarie testen. Den har ingen timer och lägger inte till poäng i provinnehållet, äventyrskartan eller stjärnjakter. Sparade jämförelsesvar räknas däremot som observationsdata för `contrast`-färdigheten per korrekt begrepps-ID. Fyra svar i samma omgång räknas aldrig som flera utspridda repetitionsdagar. Varje par har nu åtta kuraterade scener med miljö-ID; nästa övning väljer andra scener när de finns.

## Innehållskvalitet

Alla ord måste finnas i den ordinarie banken. Ändra **endast** `public/data/contrasts.json`, och kör sedan:

```sh
npm run sync:contrasts
npm run check
```

Efter 0.18: Se även [CONTEXT-TRANSFER.md](CONTEXT-TRANSFER.md).

Varje par måste ha `id`, `left`, `right`, `title`, `starter` och **åtta** `scenes`. Varje scen innehåller `title`, `text`, `target`, `why` och `difference`. Båda ordens ID ska vara facit fyra gånger vardera i hela banken. Varje scen ska också ha stabilt `id` och `context` (hem, skola, natur eller fritid).

Valideringen stoppar okända ID:n, dubbla par, ofullständiga texter, dubbla scener, synliga målord i frågetexten och obalanserade svar. **Automatisk validering bevisar inte att innehållet är pedagogiskt entydigt**. Inför bred publicering ska en människa språkgranska alla exempel och provspela dem med barn i aktuell åldersgrupp. Ord kan ha överlappande betydelser i andra sammanhang; våra berättelser ska göra vilken betydelse som avses entydig.

## Arkitektur

- `public/data/contrasts.json`: enda redaktionella sanningskällan.
- `scripts/sync-contrasts.js`: bygger browser-versionen `public/data/contrasts.js`.
- `public/js/contrast.js`: validering, ordparsval, fyra balanserade frågor.
- `public/js/focus-practice.js`: återanvänder befintlig separat mikroövningsvy.
- `public/js/adaptive.js`: uppdaterar separat färdighet `contrast`.
- `public/js/learning-map.js`: visar att en jämförelse är provad, utan att kalla det en avklarad vardagssituation.
- `public/js/app.js`: snabbstart, ordstig, återkoppling, avskilda resultat.
- `tests/contrast.test.js`, `tests/browser_contrast.py`: automatisk kontroll samt riktig klickning i Chromium.

Allt är statiskt och fungerar utan uppkopplad tjänst. Jämförelseövningar läggs inte in i *Testa dig* eller högskoleprovsläget.
