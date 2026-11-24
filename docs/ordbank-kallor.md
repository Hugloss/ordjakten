# Ordjakten – samlad frågeordsbank

Det här är en **fristående startbank med 121 unika svenska målord** hämtade från våra tidigare spel och exempel i ChatGPT (till och med 23 november 2026). Inget har publicerats på GitHub eller GitLab.

## Innehåll

- **121 unika ord** med betydelse och exempelmening. Dubletter från återanvända testomgångar är borttagna.
- **47 ord med preliminärt utvalda emojis** – endast på lätt nivå.
- **74 ord utan bild**, vilket är avsiktligt när en emoji kan vilseleda.
- Fördelning: 47 lätt, 48 medel, 25 svårt och 1 expert.
- Varje ord har ett stabilt id, källa, nivå och granskningsstatus.

## Källgrupper (ursprungliga frågeord)

- **första_10:** 10 ord
- **första_20_tillägg:** 10 ord
- **nya_20:** 20 ord
- **nya_5:** 5 ord
- **ordjakten_2_lätt:** 25 ord
- **ordjakten_2_medel:** 25 ord
- **ordjakten_2_svårt:** 25 ord
- **exempel_högskoleprov:** 1 ord

## Viktig bildregel

Emoji ska matcha **betydelsen**, inte bara associera till ett objekt. Exempel:

- `Randig` → 🦓 fungerar för ett barn.
- `Regnig` → 🌧️ fungerar.
- `Grumlig` → en hink 🪣 räcker **inte** för att illustrera grumligt vatten; ingen bild är kopplad.
- `Skrovlig` → en vanlig sten 🪨 visar inte att ytan faktiskt är skrovlig; ingen bild är kopplad.
- `Bucklig` → en vanlig konservburk 🥫 visar inte att den är intryckt; ingen bild är kopplad.

Fältet `illustration.review_status = editorial_candidate` betyder att emojin är preliminärt vald men fortfarande bör kontrolleras i riktig mobil och desktop före publicering.

## Datamodell

Varje ord i `ordjakten-ordbank.json` har fälten:

- `id`: stabilt id som framtida resultat kan referera till
- `word`: målordet som presenteras i spelet
- `definition`: tydlig betydelse
- `example`: exempelmening
- `difficulty`: `easy`, `medium`, `hard` eller `expert`
- `source`: vilken tidigare fråga eller omgång ordet kom från
- `illustration`: antingen `null` eller `{kind, value, label, review_status}`
- `review_status`: `draft` tills innehåll och flervalsalternativ granskats

Banken omfattar **ord, betydelser och exempel**, inte färdiggranskade fyra- eller femsvarsalternativ för varje ord. Alternativen behöver byggas och testas separat, så att inte två svar av misstag kan vara rätt.

## Framtida spelarkitektur

Samma bank ska kunna användas i olika spellägen utan att kopieras:

- **Träna:** direkt återkoppling, förklaring, frivillig repetition.
- **Testa:** resultat efter avslutat prov.
- **Expert / högskoleprovsliknande:** text, fem alternativ och valfri tidtagning – utan att utge sig för att vara officiellt högskoleprov.

Använd gärna `id` i lokalt sparad statistik så att frågor kan omformuleras utan att historiken tappar kopplingen.

## Kommande kvalitetsarbete

Före en publik version: granska tvetydiga betydelser, kontrollera grammatik i exempelmeningar, skriv och verifiera rimliga distraktorer för varje svårighetsgrad och låt barn provspela.
