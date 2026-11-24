# Frivillig uppläsning av Ordjakten

- **Lyssna på texten** finns vid frågan, och **Lyssna på förklaringen**
  efter svaret. Båda är avstängda tills barnet själv trycker.
- Webbläsarens inbyggda Web Speech API används med `sv-SE` och lugnare
  läshastighet. Appen skickar inga texter till en Ordjakten-server.
- Om stöd saknas visas inte knapparna. Svenska röster och eventuell
  offlineförmåga beror på webbläsare och operativsystem.
- Att lyssna ersätter **inte** Aha-frågan. Spelet bedömer aldrig
  automatiskt om barnet verkligen läst en text.
- En pågående uppläsning stoppas när barnet svarar, går till nästa fråga,
  börjar förståelsefrågan, byter vy eller lämnar fliken.

Manuell kontroll: prova uppläsning och stopp på mobil och dator,
och verifiera att inget spelas automatiskt. Korrekt svenska röster och
ljudutgång kan inte valideras av projektets automatiska kodtester.
