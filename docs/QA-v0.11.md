# Ordjakten 0.11 – testnoteringar

- **65/65 Node-tester passerade** (`npm run check`), inklusive åtta nya repetitionskontroller.
- Webbläsarkontroll: `browser_smoke.py` och `browser_review.py` passerade i Chromium; repetitionsflödet kontrollerade bildfråga → fel → omvänd textfråga → rätt → uppskjutet återbesök samt ett uttryck som återkom som en ny meningsuppgift.
- Äldre Chromium-kontroller passerade efter uppdaterade förväntningar: `browser_quests.py`, `browser_expressions.py`, `browser_playful.py`, `browser_adventures.py`, `browser_missions.py`, `browser_surprises.py`.
- Alla tolv teman och alla 121 ord finns kvar. Bild-/serietillgångar har inte ändrats.
- Chrome i testmiljön blockerar `http://127.0.0.1`; därför kan **lokal lagring över verklig sidomladdning** inte påstås vara E2E-verifierad. Parser, schema, migration och scheduler är testade i Node. Riktig sidomladdning ska testas manuellt.
- **Öppna frågor:** pedagogisk granskning av distraktorer, återbesöksintervall samt test med svenska barn.
