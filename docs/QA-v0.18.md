# QA – Ordjakten 0.18

## Genomförda tester

- `npm run check`: **138 tester godkända**. Dessutom valideras 121 ord, 25 uttryck, 129 vardagsberättelser, 96 scenbaserade jämförelser, 25 seriestrippar och uppgiftsvariationer.
- `python tests/browser_context_transfer.py`: **godkänt**. Två kompletta jämförelseomgångar med samma par: 4 helt olika scener i andra omgången, minst tre olika miljöer, jämnt facit, spårning av faktiskt valt ord, Aha-förklaring, förväxlingsförslag och återhämtning, provlägesisolering samt mobil (320 px, ljust och hög kontrast).
- `python tests/browser_contrast.py`: **godkänt**, äldre 0.16-jämförelser med mobil, eget resultat och ordstig.
- `python tests/browser_confusions.py`: **godkänt**, 0.17-kompassen och återhämtning.
- `python tests/browser_focus_practice.py`, `python tests/browser_adaptive.py`, `python tests/browser_contexts.py`, `python tests/browser_storage_rehydration.py`: **godkänt** (den sista använder en localStorage-simulering).
- `python tests/browser_adventures.py`: **godkänt**, tolv fullständiga femordsäventyr.
- `python tests/browser_smoke.py`: **godkänt**, provpass, 5-svarsläge, timer och grundläggande mobilvisning.

## Specifika integritets- och pedagogiska kontroller

- Endast kuraterade tvåvalsfrågor sparar ordparsspecifik förväxlingsdata.
- Stabilt scen-ID och miljö gör att nästa omgång inte råkar återanvända samma nyligen lösta berättelser.
- Tre rätta klick på en enda scen räcker inte för att markera återhämtning; olika scener, miljöer och båda orden krävs.
- Äldre sparade händelser utan kontext bevaras utan fabricerad kontext.
- Inga extra testpoäng eller stjärnor delas ut av jämförelserna.
- Alla 12 ordpar är redaktionella utkast. Kontrollera särskilt så att varje berättelse är lättbegriplig och har ett otvetydigt svar vid barnprovspelning.

## Begränsningar inför publicering

- Lokal server svarar i containern, men Chromium testmiljö blockerar direkt navigering till `http://127.0.0.1:<port>/` med `ERR_BLOCKED_BY_ADMINISTRATOR`. **Lagring över riktig sidomladdning, cache/service worker och offline behöver därför testas manuellt på en vanlig webbplatsorigin.**
- Automatiska tester kan inte visa att alla meningar faktiskt förstås av 8–10-åringar. Planera en kort provspelning och revidera otydliga distraktorer.
- Ingen repo- eller webbpublicering har gjorts.
