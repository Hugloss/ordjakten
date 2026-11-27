# Fem sätt att förstå ord

Min ordstig visar fem **oberoende övningssignaler**, inte en kunskapsnivå eller en stege. Ingen ny lagring, inget provresultat och inga ändrade Testa dig-regler.

| Sätt | Observation |
| --- | --- |
| Hitta ordet eller bilden | Rätt omvänd fråga eller granskad bildfråga |
| Förstå betydelsen | Rätt betydelsefråga, betydelseuppdrag eller Aha om betydelsen |
| Förstå i en berättelse | Rätt kontext/meningsuppgift eller direkt Aha-svar; hjälpta Aha visas separat |
| Skilja på liknande ord | Rätt ordval i redaktionell jämförelse |
| Nya exempel över tid | Två olika Aha-exempel rätt på första försöket efter lässteget med minst ett dygn emellan, enligt befintliga evidensregler |

En ordningsuppgift, en bild, upprepad igenkänning eller historiska aggregat ersätter inte belägg för de andra färdigheterna. Om redaktionell övning saknas visas det, utan minuspoäng. Ingen diagnos eller påstående om långsiktig behärskning. Äldre progress bibehålls; inga påhittade historiska exempel.

Största knappen i ordkortet väljer först en observerad svårighet, därefter en oprövad tillgänglig övning. Barnet kan välja ett annat sätt. Även bildord har textbaserade betydelsefrågor nu (med granskade textpoolen). En enskild Aha-runda kan startas även utan tidigare missar; samma 24-timmars väntetid gäller. Personliga Aha-planen från startsidan behåller urvalet av tidigare svårigheter. Vid en redan godkänd Aha-situation väljs ett annat ännu ej krediterat exempel när möjligt. Ord som bara mötts i Aha kvarstår i ordstigen när behovet är löst.

## Frivillig webbläsarkontroll
Kör tests/browser_word_profile.py med Playwright. Kontrollera tomt kort, betydelse och kontext som olika observationer, direkt Aha från ett ordkort, återgång till samma ord, väntestatus och oförändrad provhistorik. Browser-harnessen använder en localStorage-shim, inte riktig origin/offline-reload.
