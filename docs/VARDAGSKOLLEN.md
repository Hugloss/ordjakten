# Vardagskollen – vardagskunskap för barn 7–10 år

## Syfte

Vardagskollen kompletterar Ordjaktens fantasivärldar med det som barn behöver
förstå i sin egen vardag. Frågorna handlar inte bara om att minnas namn; barnet
läser en kort situation och övar orsak och verkan, begrepp, säkerhet, sammanhang
och egna kloka val.

## Kanoniskt innehåll

- **Ämnesbank:** `vardagskunskap`, skild från språkbanken `svenska`.
- **Enda redigerbara källa:** `public/data/vardagskunskap.js`.
- **Manifest:** `content/banks/vardagskunskap/manifest.json`.
- **Adapter:** `public/js/banks/vardagskunskap.js`.
- **Spelvy:** `public/js/vardagskollen.js`, kopplar frågor till generisk
  `question-platform.js` och `question-session.js`.
- **ID:** `vk-0001` … `vk-0060`. Identifierare och revisionsnummer får
  inte återanvändas för en ny frågebetydelse.
- **Svarsalternativ:** stabila ID:n härleds från deras normaliserade text och
  påverkas inte av hur alternativen sorteras i en spelomgång.
- **Revision:** höj `revision` om scenario, facit eller formulering ändras så
  att ett gammalt svar inte längre betyder samma sak.
- **Granskningsstatus:** alla 60 frågor är **utkast** (`draft`) tills en vuxen
  språk-/faktagranskare och barnprovspelning bekräftat innehållet.

Ämnena har egna kunskapsmål och innehåll men använder samma neutrala motor.
Frågorna innehåller inga hänvisningar till en specifik spelform, stjärnor,
timer, kartor eller belöningar. En framtida vardagsscen kan referera till
en `{bankId, id, revision}` utan att kopiera frågan.

## Omfattning

| Tema | ID-intervall | Antal |
|---|---|---:|
| Människokroppen | vk-0001–0006 | 6 |
| Naturen | vk-0007–0012 | 6 |
| Köket | vk-0013–0018 | 6 |
| Hemmet och trygghet | vk-0019–0024 | 6 |
| Väder och årstider | vk-0025–0030 | 6 |
| Trafiken | vk-0031–0036 | 6 |
| Vänskap och samarbete | vk-0037–0042 | 6 |
| Tid och planering | vk-0043–0048 | 6 |
| Pengar i vardagen | vk-0049–0054 | 6 |
| Digital vardag | vk-0055–0060 | 6 |

Varje tema har två lätta, två medelsvåra och två lite klurigare frågor.

## Spelsätt och integritet

**Träna** visar förklaringen efter ett svar. **Testa dig** behåller facit och
förklaringar dolda i gränssnittet tills hela omgången är klar. Resultatet i
Vardagskollen är lokalt för den pågående omgången och läggs inte till äldre
ordprov, stjärnor, skattfynd eller beständig lärandehistorik. Inga konton,
nätverksanrop, fri text, namn på barn eller spårning används.

En omgång består av samtliga sex frågor i det valda temat. Ingen timer eller
poängavdrag. Efteråt kan barnet läsa igenom facit och förklaringar och prova
ett annat tema. Det går bra att byta till en annan del av Ordjakten utan att
den äldre historiken ändras.

## Redaktionell granskning innan publicering

1. Kontrollera fakta, särskilt medicinsk-, mat- och trafiksäkerhetskunskap.
2. Kontrollera att exakt ett alternativ är försvarbart i situationen.
3. Kontrollera att felalternativen är rimliga för 7–10 år, inte löjliga.
4. Kontrollera att barnet kan läsa scenen och förstå frågan; testa med barn.
5. Kontrollera att scenen inte avslöjar facit och att förklaringen verkligen
   svarar på varför rätt svar passar.
6. Kontrollera mobil, fokus, kontraster, tangentbord och offline.
7. Vid framtida ändring: bevara ID och höj revision när innebörden ändras.
8. Planera fler frågor inom varje tema innan man kopplar adaptiv repetition
   och fler spelvärldar.

Tekniska kontroller: `node --test tests/vardagskunskap.test.js`,
`npm run check` och `python tests/browser_vardagskollen.py` (Playwright krävs).
