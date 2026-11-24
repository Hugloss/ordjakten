# Ordjakten 0.14 – Min ordstig

## Syfte

En spelvänlig **översikt av vilka slags övningar barnet har provat**. Stigen är **inte ett betyg eller ett mått på faktisk kunskapsnivå**. Den är ett sätt att visa framsteg utan tävling, förlust av stjärnor eller dagliga krav.

Varje ord och uttryck i den befintliga banken har en egen kort stig med fyra *oberoende* markörer:

| Markör | När den visas som uppnådd | Vad den **inte** bevisar |
|---|---|---|
| 🔎 Upptäckt | Begreppet har besvarats minst en gång i en avslutad omgång, eller finns i äldre repetitionshistorik. | Att barnet kan ordet. |
| 🧠 Hittat bild/betydelse | Minst ett korrekt svar på bild eller betydelse. | Långsiktig förståelse efter bara ett rätt svar. |
| 🎭 Provat på fler sätt | Ett korrekt svar på *vardagsscen* eller *hitta ordet* (vanligt ord); korrekt mening/ordning i uttrycksfråga eller luckbok. | Att barnet behärskar alla möjliga situationer. |
| ⭐ Klarat flera gånger | Minst tre korrekta svar fördelade på minst två frågetyper, **eller** minst två korrekta återbesök efter ett tidigare fel (även om ett senare svar blir fel), **eller** tre avklarade uppgiftstyper i en uttryckslucka. | Permanent inlärning eller diagnos. |

Stegen kan komma i annan ordning. Ett korrekt svar på **omvänd ordfråga** får aldrig markeras som att barnet klarat **en vardagsberättelse**. Ord utan skrivna vardagsscener får därför *Hitta rätt ord* som möjlig tredje markör. Svåra begrepp med enbart text förloras inte.

**Inga poäng eller stjärnor förändras.** Det är samma `skillProgress`, `reviewProgress`, `missionProgress` och äldre `mistakes` som används sedan tidigare. Tom/äldre data antas inte innebära att barnet redan kan ett visst ord.

## Användarflöde

1. Startsidan visar en kompakt **Min ordstig**-översikt.
2. Efter en genomförd omgång finns en knapp i resultatvyn.
3. En egen sida visar totalt upptäckta ord, hittade bilder/betydelser, ord prövade på fler sätt och flera lyckade försök.
4. Barnet kan söka bland **121 ord och 25 uttryck**, filtrera på *Mina upptäckter*, *Öva igen*, *Fler sätt* eller *Alla ord* samt byta mellan ord och uttryck.
5. Tryck på ett ord: se en fyra-stegs-stig, betydelse, exempel och ett vänligt förslag på nästa övning. Det går att läsa med tangentbord och skärmläsare.
6. När det finns många ord visas högst 18 åt gången, med **Visa fler**.

Den text som visas på stigen speglar *faktiska observationer*: grumlig med rätt på betydelsen men fel på scenen får 🔎 + 🧠, medan 🎭 och ⭐ väntar.

## Arkitektur

- `public/js/learning-map.js`: ren, testbar derivation med `catalog`, `detail`, `entries`, `summary`, `filter`.
- `public/js/app.js`: läser samma befintliga anonyma historik som urvalsmotorn, ritar gränssnittet, hanterar sökning och navigering.
- `public/css/learning-map.css`: CSS-tokenbaserade färger för mörkt/ljust/hög kontrast och responsiv fyr-stegs-stig.
- `public/index.html`: startsida, resultatsida och ny vy.
- `public/sw.js`: cachar nya statiska filer under `ordjakten-static-v14`.

Ingen ny localStorage-nyckel, backend, AI-inferens, bildfil eller nätverksbegäran tillkommer. Den befintliga historikexporten och raderingen omfattar fortfarande all framstegsdata; själva stigen byggs om från dessa vid visning.

## Testa

```sh
npm run check
python tests/browser_learning_map.py
python tests/browser_storage_rehydration.py
python tests/browser_smoke.py
python tests/browser_adaptive.py
python tests/browser_review.py
```

**QA-gräns:** Den särskilda `browser_storage_rehydration.py` injicerar en *minnessimulering* av localStorage och bevisar att historiken kan serialiseras, läsas och rensas genom appens gränssnitt. Den bevisar **inte** att verklig localStorage fungerar över en fysisk sidomladdning. Chromium i testmiljön blockerar navigation till lokala och artificiella origins. Verifiera därför i en vanlig webbläsare före lansering: 1) spela och spara, 2) ladda om sidan, 3) kontrollera kartans steg, 4) pröva offline/PWA, 5) radera lokala resultat och kontrollera på nytt.

**Pedagogisk gräns:** Testsuite avgör inte hur väl uppgifterna lär ut svenska. Frågebank, distraktorer och belöningar behöver barnprovspelas innan publik skol-användning.
