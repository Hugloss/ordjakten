# 💬 Uttrycksjakten – vardagsuttryck som små berättelseluckor

**Version 0.6** introducerar uttryck som egen frågetyp, i samma Ordjakten-app.

## Varför en egen frågetyp?

Ett uttryck som **"för en gångs skull"** går inte att lära ut genom att peka på en emoji för ett enskilt substantiv. Barn behöver sammanhang: **vad brukar hända, och vad är annorlunda just nu?**

Exemplet i spelbanken:

> För en gångs skull kunde min pappa skjutsa barnen till hockeyn.

Det betyder: **Den här gången gick det, fast pappa vanligtvis inte kan skjutsa.** Det betyder inte nödvändigtvis att det bokstavligen är den enda gången någonsin.

Efter svaret döljs frågan och alternativen. Barnet ser:

- 📖 Ett rakt svar på vad uttrycket betyder.
- 🎁 Två korta *Aha-rutor*: ”Så brukar det vara” → ”Men den här gången”.
- ✨ En andra exempelmening som visar samma uttryck i en ny situation.

Andra uttryck, till exempel **"ha is i magen"**, visas med ”Det känns pirrigt” → ”Var lugn och tänk efter”. Vi använder inte missvisande bilder som antyder att uttrycket ska förstås bokstavligt.

## Hur barnet väljer

Startskärmen har **Ord**, **Uttryck** och **Blandat**, plus två snabbknappar:

- ⚡ Spela 10 ord direkt.
- 💬 Prova 5 kluriga uttryck.

I **Blandat** väljer motorn ungefär hälften enskilda ord och hälften uttryck för varje omgång. Frågorna upprepas inte inom samma omgång. Alla 12 äventyrskartor, tema-, timer- och ordkompisval fungerar precis som tidigare.

Uttrycksbanken innehåller **25 separat skrivna uttryck anpassade för cirka 8–10 år**. Tills vi har fler uttryck per nivå är det samma uttrycksbank för Lätt, Medel och Svårt. Uttryck visas alltid med **text** (inga emoji-svar); bara den högskoleprovsinspirerade nivån ändrar antalet svar till fem. Vid blandade omgångar gäller nivåvalet de enskilda orden.

## Träna och Testa dig

- **Träna:** Rätt/fel och Aha-rutor visas direkt. Den vanliga timerregeln pausar förklaringen vid total-timer.
- **Testa dig:** Rätt svar, Aha-rutor och förklaringar visas **inte under provet**. Facit med exempel och Aha-rutorna visas på resultatsidan.
- Fel på uttryck sparas med stabilt `ut-####`-ID, kan repeteras och kan exporteras tillsammans med resultat. Historik från 0.5 migreras till frågetypen Ord utan att förlora poäng.

## Dataformat och redigering

- `public/data/expressions.json`: kanonisk källa, med 25 uttryck.
- `public/data/expressions.js`: identisk browser-export, inläsbar utan bundler.
- `public/js/engine.js`: frågegenerering och schemavalidering.
- `tests/expressions.test.js`: 7 tester för innehåll, blandade omgångar, ID:n, historik och frågornas form.
- `tests/browser_expressions.py`: riktig Chromium-testning av spel, provläge, facit och mobil.

Varje uttryck har en struktur i den här stilen:

```json
{
  "id": "ut-0001",
  "phrase": "För en gångs skull",
  "scene": "För en gångs skull kunde min pappa skjutsa barnen till hockeyn.",
  "definition": "Något händer den här gången, fast det inte brukar hända så ofta.",
  "example": "För en gångs skull kom bussen i tid.",
  "reveal": [
    {"title": "📅 Så brukar det vara", "text": "Pappa kan oftast inte skjutsa till hockeyn."},
    {"title": "🚗 Men den här gången", "text": "Nu kunde han skjutsa! Det var ovanligt."}
  ],
  "options": [
    {"label": "Det gick den här gången fast det sällan brukar gå.", "correct": true},
    {"label": "Det händer på samma sätt varje gång.", "correct": false}
  ]
}
```

*Ovan är en pedagogisk formatillustration med två alternativ, inte en färdig datarad.* I den faktiska banken måste varje uttryck ha exakt **fem** unika svarsalternativ, varav ett korrekt. Normalläget väljer tre av de fyra felaktiga, expertläget använder alla fem.

För att synkronisera exporten efter att ha redigerat JSON:

```sh
python3 - <<'PY'
import json
from pathlib import Path
bank=Path('public/data/expressions.json')
data=json.loads(bank.read_text(encoding='utf-8'))
Path('public/data/expressions.js').write_text(
    '/* Samma innehåll som expressions.json, för användning utan byggsteg. */\n'
    'window.ORDJAKTEN_EXPRESSIONS = '
    +json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',
    encoding='utf-8')
PY
npm run check
```

## Redaktionell kvalitet

Uttrycken är **handskrivna utkast**, inte automatiskt hämtade provfrågor. Före bred publicering bör någon med språklig kompetens kontrollera uttryckens betydelser och alla distraktorer, och gärna provspela med barn i rätt ålder. De automatiska testerna garanterar **inte** semantisk entydighet.

Vi undviker:

- bokstavliga illustrationer av bildliga uttryck,
- alternativ som också kan vara korrekta,
- dolda rätt/fel-ledtrådar i provläget,
- långa förklaringar som måste läsas innan barnet ens får gissa.

## Nästa idé: adventskalender utan tvång

Vi har nu redan *berättelseluckan*: en liten vardagssituation → gissning → Aha-upplevelse. En eventuell julkalender kan senare visa 24 olika berättelseluckor, men **ska inte** kräva konton eller tvinga barn att spela varje dag. Den befintliga spelmotorn och uttrycksbanken kan återanvändas.
