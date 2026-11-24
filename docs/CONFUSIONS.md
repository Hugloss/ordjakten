# ⚖️ Förväxlingskompassen – Ordjakten 0.17

## Mål

Barn i åldern 8–10 år ska få hjälp att **skilja närliggande begrepp**, utan att appen sätter etiketter på barnet eller upprepar exakt samma facit som ett förhör.

Om barnet exempelvis väljer *genomskinlig* när berättelsen beskriver *grumlig* ska appen kunna känna igen **vilket alternativ som förväxlades**. Till skillnad från en vanlig felräknare behövs facit, det valda alternativet och ett redaktionellt godkänt ordpar.

## Vad som faktiskt är implementerat

1. `contrast.js` ger varje av två svarsalternativ ett ID i den befintliga ordlistan. En jämförelse har fortfarande fyra handskrivna berättelser, två där vartdera ordet är korrekt.
2. `confusions.js` lagrar rätt/fel och en begränsad följd av högst tolv svar per godkänt par: rätt begrepps-ID, valt begrepps-ID och tidpunkt.
3. Ett fel på jämförelsen kan ge ett **mjukt träningsförslag**. Om förväxlingen dyker upp flera gånger kan paret prioriteras för snabbstarten *Hitta skillnaden*.
4. På startsidan visas **Ord att jämföra** när det finns relevant underlag. Barnet kan direkt trycka **Jämför orden** och få samma fyra korta, skrivna berättelser.
5. När barnet senare svarar rätt flera gånger minskar behovet av ett träningsförslag. Tre senaste rätta jämförelsesvar tar bort paret från listan, men **det är inte ett påstående om fullständig ordförståelse**.
6. **Träna** och **Testa dig** förblir separata. Vanliga ordprov/högskoleprovsfrågor, stjärnor och repetitionsintervall påverkas inte av kompassens egna svar.

## Begränsningar

- Förväxlingskompassen används bara för **12 manuellt granskade ordpar**. Fel i fyralternativsfrågor är inte ett tillräckligt säkert underlag för att slå fast en förväxling. Inga nya ordpar genereras automatiskt.
- Upprepade rätt på samma fyra berättelser är **en indikator på övning, inte ett bevis på långsiktig inlärning**. Senare version kan tillföra nya kuraterade situationer och återbesök efter längre tid.
- Poänganpassningen är en lättförklarad heuristik, inte en AI-modell eller ett pedagogiskt diagnosverktyg.
- En feltryckning kan ge ett förslag; upprepade fel ges större prioritet. Återhämtning motverkar att en miss blir en permanent etikett.

## Datamodell och integritet

Lokal webbläsarhistorik heter fortfarande `ordjakten-v1` för bakåtkompatibilitet. Nu kan den innehålla `confusionProgress`:

```json
{
  "js-01": {
    "attempts": 2,
    "right": 0,
    "wrong": 2,
    "lastAt": 1770000000000,
    "recent": [
      {"target": "sv-0044", "chosen": "sv-0003", "at": 1770000000000}
    ]
  }
}
```

`target` och `chosen` måste tillhöra samma redaktionella ordpar, annars kastas de bort vid återläsning. Max **12 senaste händelser per par** och maximalt tillåtna heltalsräknare används. Inga fritextsvar, barnnamn eller konton lagras. All data stannar på enheten och tas med vid export/radering.

`engine.sanitizeHistory()` behåller den nya råsektionen från äldre/nyare historik, medan `confusions.sanitize()` verifierar den mot den aktuella ordparslistan. **Radera sparade resultat** raderar även förväxlingshistoriken. En äldre historik utan denna sektion fungerar utan migrering av ord, stjärnor eller provresultat.

## Kvalitetssäkring

- `npm run check`: innehållsvalidering och automatiska enhetstester inklusive rena/ogiltiga svar, felriktning, historikbegränsning, återhämtning och provisolering.
- `python tests/browser_confusions.py`: riktig Chromium med JS/CSS injicerad från projektet. Testar hela fyrfrågorsövningen, rekommendation, fortsatt träning, återhämtning, 320 px högkontrast och att vanliga prov inte ändrar förväxlingsdata.
- Övriga webbläsartester kan köras som regression. **Lagring efter omladdning från en verklig webbplatsorigin har ännu inte verifierats**: testmiljön blockerar sådan navigering. Se `docs/QA-v0.17.md` för manuell kontroll.

Inga nya illustrationer har gjorts eller köpts.

## Utökning i 0.18: specifika vardagsmiljöer

En ny observation får även `sceneId` och `context` från den kuraterade scenen. Gamla v0.17-händelser har fortsatt tre fält och är fortfarande giltiga, men deras miljö antas inte i efterhand. Urvalet prioriterar unika scener och kontexter som barnet har upplevt svårigheter med. För att minska ett förväxlingsförslag efter flera korrekta svar i den nya versionen krävs **olika scener, minst två miljöer och båda orden**. Tidsbegränsningen (tolv händelser per par) är oförändrad. Se `CONTEXT-TRANSFER.md` för detaljer.
