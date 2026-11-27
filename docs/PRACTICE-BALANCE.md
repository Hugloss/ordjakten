# Balanserad träningsmix i Mitt nästa äventyr

Riktvärden över de senaste högst 20 avslutade stationerna: 40 % utveckling, 30 % repetition, 20 % upptäckt, 10 % kreativ träning. En station är en avslutad miniövning, inte en fråga, tidsenhet eller kunskapspoäng. Detta är redaktionellt valda riktvärden, inte ett kalibrerat pedagogiskt optimum.

| Kategori | Avgränsning |
|---|---|
| Utveckla ord | Observerat stödbehov, relaterad träning, alternativ pedagogisk insats eller ett nytt sätt att träna redan mötta mål. |
| Minnas igen | Ett återbesök som är redo enligt befintlig motor. |
| Upptäcka ord | En vanlig utforskande uppgift med minst ett tidigare ej observerat faktiskt målord. Distraktorer och övriga gruppmedlemmar räknas inte som nya målord. |
| Skapa med ord | Frivillig ordverkstad utan ett prioriterat stödbehov. En rekommenderad alternativ insats räknas i stället som utveckling. |

## Urval

Befintliga motorer genererar tillgängliga kandidater och tillämpar ledtrådsnivåer, repetitionsintervall och återkopplingsregler. Koordinatorn väljer högst tre olika metoder, högst åtta deluppgifter och inga överlappande planerade mål. Balanseringen får bara välja bland kandidater som fortfarande uppfyller kraven.

Redo pedagogiska uppföljningar (prioritet 2), därefter alternativa insatser (prioritet 1), har företräde framför mixen i varje möjlig station. Annars reserveras första stationen för ett faktiskt stödbehov eller redo återbesök om något sådant finns. Utan balanshistorik behålls tidigare ordning för första stationen; ett helt nytt barn möter normalt en enkel ordövning först.

För varje möjligt nästa steg jämförs kategorins riktvärde med faktiska antal i det rullande fönstret inklusive preliminära val. Äldsta stationen faller bort vid ett fullt fönster. Största underskott får företräde, med ordinarie pedagogiska prioriteringar som utslagsgivare. Om en kategori saknar giltig uppgift väljs en annan. Inga kvoter, extra väntande uppgifter eller sparade balansskulder.

## Lagring och gränssnitt

`practiceBalance` innehåller högst 20 kategorikoder. Endast när en station i Mitt nästa äventyr når sitt färdiga tillstånd registreras dess kategori, högst en gång per stationsobjekt. Avslutade stationer sparas direkt även om barnet lämnar rundan från slutskärmen; överhoppade, oavslutade och endast planerade stationer registreras inte. Övrig träning påverkar ordinarie historikspår, inte denna mix. Äldre historik börjar med tom balanslista. Samma lokala export/radering som tidigare.

Min ordstig visar en hopfällbar sammanfattning av faktiska senaste stationer, utan målprocent, betyg, förlust eller krav på barnet. Offline-cachen innehåller det nya scriptet.

## Verifiering

Automatiska tester täcker klassificering, begränsningar, lagring, idempotent slutförande, prioriterad uppföljning, tillgänglighet, nyordsmål och deterministisk syntetisk simulering med 200 rundor. Simuleringen har avsiktligt alla kategorier redo med flera disjunkta metoder. Den visar att mixen kan närma sig riktvärdet under dessa villkor; den säger inte hur en verklig elevs mix eller inlärning kommer att se ut. `npm run check` kör befintlig CI. Frivilligt Playwright-test `python tests/browser_journey.py` kontrollerar även slutförd kontra överhoppad/avbruten station. Barnprovspelning behövs.
