# Arkitektur – ämnesoberoende lärplattform

**Status: beslutad målbild att granska, inte implementerad arkitektur.** Senast genomgången 2026-11-27 mot `main` och den mergade [PR #28](https://github.com/Hugloss/ordjakten/pull/28). Den här sidan är **enda kanoniska beskrivningen av målarkitekturen**. [CONTENT.md](CONTENT.md) dokumenterar hur befintligt språkinnehåll redigeras idag; [PRODUCT.md](PRODUCT.md) dokumenterar produktprinciper. Respektive spelforms dokument beskriver nuvarande beteende, inte en konkurrerande arkitektur.

## Syfte och hårda gränser

Ordjakten ska kunna lägga till matematik, kemi, fysik, historia och nya spelformer utan att skriva om frågor, kopiera innehåll mellan spelformer eller byta ut den nuvarande webbappen.

1. **Frågan vet inget om spelform, tema, kartor, belöningar, timer, användare eller UI.** Spelmodeller konsumerar frågor via ett neutralt gränssnitt. Frågorna ska därför inte innehålla `gameModes` som redaktionellt ägd lista.
2. **Kunskapsmål är inte frågor.** Ett begrepp/en färdighet kan undersökas med många frågor och metoder; en fråga kan relatera till flera mål och ämnen.
3. **Svarstyp är inte bedömning.** Inmatningskomponent, tolkning/normalisering och bedömningsstrategi är skilda kontrakt.
4. **Bedömning är inte pedagogisk slutsats.** Ett enskilt korrekt svar, ett avklarat kapitel och uppnådd färdighet är olika observationer.
5. **Berättelser är inte frågebanker.** Scener, kapitel, kartor, dialog och samlarobjekt refererar till fråge-ID:n utan att äga facit.
6. **Regler är inte presentation.** Spelmodellens tillståndsövergångar kan testas utan DOM, och presentationen bestämmer inte rätt/fel.
7. **Redaktionella filer är källan till sanningen.** Webbläsarformat, sökindex, rapporter och offline-paket är genererade vyer. Två manuellt redigerade kopior är förbjudna.
8. **Stabila ID:n, reproducerbarhet och bakåtkompatibilitet** gäller innehåll, frågeinstanser och barns redan sparade historia.
9. **Lokalt, integritetsvänligt, åtkomligt och offline** är grundkrav. Ingen ny backend, konto eller AI-generering under barnets spelsession krävs för målbilden.

## Logiska delar och ansvar

Det här är **ansvarsgränser**, inte förslag om mikrotjänster eller fler repositories.

| Del | Äger | Får inte äga |
| --- | --- | --- |
| Taxonomi & kunskapsmodell | Ämnen, begrepp, färdigheter, förkunskaper, relationer, läroplanskopplingar | Spelflöden, facit, belöningar |
| Content Registry | Publicerade innehållsobjekt, stabila ID:n, revisioner, länkar, licenser | Urval efter individ, UI, sessionsdata |
| Stimulus & frågebank | Granskad fråga, källtext/bild, alternativ, svarsspecifikation, förklaringar | Spelvärld, timer, resultat |
| Frågeinstans | Vald revision, parametrar, slumpfrö och ordning för ett enskilt försök | Bestående kunskapsnivå |
| Urvalspolicy | Filtrering efter mål, ålder, svårighet, täckning, repetition och kompatibilitet | Facit, UI, belöningar |
| Interaktionsadapter | Flerval, siffra, text, sortering, formler, enhetssvar, simulator | Färdighetsbedömning, poängregler |
| Svarsnormalisering & bedömning | Typad tolkning, validering, korrekt/partiellt/obetygsatt/kan inte bedömas | Narrativ, nivåupplåsning, rendering |
| Återkopplingspolicy | Om/när förklaring, ledtråd och facit visas | Skapande av nya facit |
| Spelmodell | Lägen som Träna, Testa, Upptäck, Skattkarta: tillstånd, regler, steg | Egna kopior av frågor eller ämneslogik |
| Berättelse & uppdrag | Scener, ledtrådssekvens, världar, koppling till fråge-ID | Ägande av frågors svar |
| Belöningspolicy | Fynd, stjärnor, märken och frivilliga omtag | Slutsatser om kunskap |
| Lärande/evidens | Bedömningsobservationer, stödgrad, repetition, rekommendationer | Kartpositioner, spelföremål |
| Lagring & migration | Versionssatt lokalt tillstånd, import/export/radera, äldre ID-mappning | Frågegenerering och UI |
| Presentation & tillgänglighet | Läsbar text, tema, responsivitet, uppläsning, alternativa interaktioner | Urvalets facit och spelregler |
| Publicering & resurser | Licenser, bilder, innehållsversioner, paketering, cache/manifest | Manuella extra innehållsbanker |

**Beroenderiktning:** Innehåll och taxonomi är oberoende av spel. Urval och bedömning använder gemensamma innehållskontrakt. Spelmodeller anropar urval/bedömning och producerar spelhändelser. UI-adaptrar visar modellerna. Lagringsadaptern sparar typade händelser/tillstånd. Kärnkomponenterna får inte importera en specifik spelvärld, DOM eller browserlager.

## Innehållsmodell – det som faktiskt sparas i Git

Skilj på följande identiteter:

- **Subject/Topic/Skill/Concept:** vad innehållet handlar om och vad barnet tränar. Flera ämnen per mål är tillåtna, exempelvis multiplikation i fysik. Svårighetsgrad är redaktionell och kan kalibreras; ålder/årskurs är en urvalsindikator, inte spelform.
- **Stimulus:** ett självständigt textstycke, experiment, bild, diagram, ljud, simulering eller scenario. Delas bara när sammanhang och pedagogisk tolkning verkligen är samma.
- **Question:** ett självständigt granskat bedömningsobjekt som pekar på kunskapsmål och eventuellt stimulus. Har stabilt ID, revision, språk, instruktion, typad svarsspecifikation, förklaring, käll- och granskningsstatus. Inget äventyrs-ID eller spelmode-ID.
- **QuestionVariant/Template:** medvetet olika formuleringar eller versionssatta, redaktionellt granskade parameteriserade uppgifter. De är inte "dubletter" bara för att kunskapsmålet sammanfaller.
- **QuestionInstance:** den faktiskt serverade/visade frågan med låst revision, parametrar, slumpfrö, alternativordning och respons-ID. Kan återställas exakt efter omladdning.
- **Activity/TaskSet:** kan omfatta flera frågor, obetygsatta resonemang eller laborativa steg. Även framtida simuleringar ryms här utan att låtsas vara en flervalsfråga.
- **Scene/Adventure:** egna scener, stabila steg-ID:n, ordningsrelationer, samlarföremål och referenser till frågor/aktiviteter. Ingen inbäddad kopia av frågans facit.
- **Collection/Playlist:** redaktionellt urval, till exempel "grundläggande bråk" eller "detektivens första kapitel". Den pekar på objekt och uttrycker ett mål, inte frågornas innehåll.
- **Asset:** media med ägare/ursprung, licens, alt-text, språk, versionsinfo och offline-stöd. Fråga och scenario refererar till asset-ID.

Relationer är **typade** (exempelvis `question assesses skill`, `question uses stimulus`, `scene contains activity`, `adventure contains scene`, `question variantOf question`, `skill prerequisiteOf skill`), inte endast fria taggar. Taxonomiska etiketter styr filtrering, inte spelformsregler.

### Illustrativt kontrakt (inte implementerat schema)

```json
{
  "id": "q-math-00042",
  "revision": 1,
  "locale": "sv-SE",
  "skillIds": ["skill-multiplication-basic"],
  "prompt": "Vad är 8 × 7?",
  "response": {"kind": "numeric"},
  "assessment": {"kind": "numeric-exact", "expected": 56},
  "explanation": "Åtta grupper med sju i varje ger 56.",
  "review": {"status": "draft", "source": "original"}
}
```

Det här objektet vet inte om det visas i **Testa dig**, ett piratäventyr eller en skattjakt. En scen refererar till dess ID (och en fastställd revision via releasemanifestet); endast scenen äger sin dialog och sitt fynd. Motsvarande kemiuppgift kan kräva `chemical-equation` och stödkontroll för atombevarande, medan fysik kan kräva värde **och enhet**, tolerans och dimensionskontroll. För algebra krävs matematisk ekvivalenskontroll, inte jämförelse av textsträngar. Obetygsatt fri reflektion får aldrig omvandlas till automatiskt godkänt prov.

## Från innehåll till en genomförd uppgift

1. **Discovery:** frågeregister och taxonomi hittar möjliga kunskapsmål/frågor; ett genererat index stödjer sökning. Inga kopior i spelmappen.
2. **Eligibility:** urvalspolicyn filtrerar på publicerad status, ålder, språk, ämne, kunskapsmål, tillgänglighet, nödvändiga interaktions- och bedömningsförmågor. En spelmodell annonserar vad den kan visa, men frågan känner inte till spelformen.
3. **Selection:** vald policy (prov, övning, läroplansmål, frivillig repetition, redaktionell sekvens) avgör ordningen; adaptivt urval får **inte** påverka ett låst prov mellan frågor.
4. **Instantiation:** fråga + revision + seed/parametrar + eventuell scenkontext fryses i en `QuestionInstance`. Parametriserade mallar behöver både version och frö; uppgiften ska kunna reproduceras vid återupptagning eller granskning.
5. **Interaction:** renderer visar uppgiften med tillgänglig komponent. Svar sparas som typat svar; inte som en positionsberoende knappetikett.
6. **Assessment:** ämnes- eller svarstypadapter gör säker normalisering och bedömning med en tydlig utfallsmodell (`correct`, `incorrect`, `partial`, `ungraded`, `needs-review` eller `invalid`). Bedömningsresultatet är neutralt; poäng och fynd är någon annans beslut.
7. **Feedback policy:** Träna kan visa hjälp direkt. Testa dig får inte visa rätt svar, sammanfattning eller facit förrän avslutat prov. Publicering i statisk/offline-app kan dock **inte** ge kryptografiskt skydd mot att en tekniskt kunnig person läser nedladdat facit.
8. **Evidence:** försök och stödgrad blir observationer knutna till fråge-ID, revision, instans-ID, färdighet, kontext och om svaret var självständigt. **Felval eller hint i ett spel är inte automatiskt bevis på att ett ämne inte behärskas.**
9. **Projections:** lärandeprogression/repetition uppdateras av relevanta observationer; spelprogression, kapitel och belöningar uppdateras separat av spelhändelser. De får dela händelse, men inte statusfält eller slutsats.
10. **Persistence:** begränsade lokala resultat/instansdata och spelstatus valideras vid import, återställs deterministiskt och raderas tillsammans på begäran.

## Särskilt viktiga frikopplingar som lätt missas

| Koppling att undvika | Varför den måste brytas |
| --- | --- |
| Fråge-ID = begrepps-ID | Flera uppgifter kan pröva samma förmåga; en uppgift kan pröva flera färdigheter. |
| Svarsknapp = facit | Alternativ ska ha stabila ID:n; randomisering får inte ändra betydelse eller historik. |
| Svarskomponent = bedömning | Tal, enheter, kemiska ekvationer och öppna svar behöver olika validatorer. |
| Svar rätt = kunskap inlärd | Hjälp, återförsök, visat facit och upprepning påverkar hur observationen bör tolkas. |
| Urval = spelmotor | Provlåsning, repetition, ämnestäckning och adaptiv prioritering ska kunna bytas oberoende. |
| Svårighet = antal alternativ = årskurs | Separata dimensioner; fyra alternativ är en möjlig presentation, inte ett universellt krav. |
| Text = en enda scen = ett enda språk | Lokaliserade instruktioner, stimulus och tillgängliga bild-/ljudalternativ behöver egna referenser. |
| Fråga = kapitelsteg | Kapitelsteg behöver stabila ID:n och eget flöde; ska inte bero på arraypositioner. |
| Äventyr = samlarföremål = prestation | Belöningar får inte förvränga provresultat eller sparad kunskapsprofil. |
| Generated JS = redaktionell källa | Endast ett original per innehållspost; genererade filer kontrolleras och märks som härledda. |
| Browserhistorik = innehållsversion | Lagringsschema, frågerevision, spelprogression och appversion utvecklas oberoende. |
| Publicerad fråga = fri att återanvända | Licens, källa, granskning, ålderslämplighet och bildrättigheter måste följa med. |

### Barn, tillgänglighet och integritet

- Redan nuvarande principer behålls: ingen registrering, personidentifierare, klasslista, rå fritext, ljudinspelning eller personprofil på servern. Vid framtida fritextsvar: bedöm lokalt/med frivillig granskning och lagra inte råtext som standard.
- Inställningar för uppläsning, textstorlek, kontrast, reducerad rörelse och alternativa inmatningssätt är **presentationspreferenser**, inte fråga-/kunskapsegenskaper. En fråga måste även ha ett begripligt textalternativ när det är möjligt.
- Kemi/fysik-exempel ska vara pedagogiskt och fysiskt säkra. Simulatorers regler och mätvärden ska vara reproducerbara, åtskilda från visuella animationer; en simulator är en aktivitet, inte automatiskt ett facit.
- Källor, licenser, recensionsstatus och innehållsursprung ska ingå i granskningskedjan. AI kan hjälpa redaktörer skapa förslag, men barnets session ska bara konsumera granskade, godkända uppgifter.

## Git: struktur, index och ändringshistorik

**Föreslagen målstruktur; katalogerna finns inte nödvändigtvis idag:**

```text
content/
  taxonomy/        # ämnen, begrepp, färdigheter, förkunskaper
  stimuli/          # delade scenunderlag, texter, diagram, media-referenser
  questions/        # språk, matematik, kemi, fysik ... en redaktionell källa
  activities/       # sammansatta/öppna uppdrag
  adventures/       # scener, steg, fråge-referenser
  collections/      # redaktionella listor och urval
  assets/           # manifest, licens, alt-text
src/
  core/             # registry, selection, instance, assessment, evidence
  interactions/     # typade svarskomponenter
  game-modes/       # train, exam, discovery, treasure
  presentations/    # kartor, berättelser, ljud, hög kontrast
  storage/          # migrering, import/export, offline
public/             # webbapp och genererade/paketerade innehållsfiler
docs/ARCHITECTURE.md
```

- Ett objekt har **oföränderligt ID**, schema-/innehållsrevision och granskningsstatus (`draft → reviewed → published → retired`). Återanvänd aldrig borttagna ID:n. Ändra inte en publicerad frågas facit "tyst"; en sakligt ny uppgift får nytt ID, medan kompatibla rättelser får ny revision och dokumenterad migration.
- Länkningar kontrolleras mot ett **releasemanifest** som låser konkreta revisioner och resurser. Export/historik kan visa vilken frågerevision som användes. Tidigare ID:n mappas explicit vid migration; okända äldre resultat kastas inte tyst.
- Genererat **sökindex** och innehållsrapport kan besvara: "vilka frågor testar multiplikation?", "vilka äventyr använder q-42?", "vad ändrades i denna PR?". Indexet är inte en ny manuell källa.
- CI bör kontrollera schema, unika ID:n, brutna länkar, felaktiga svar, godkända capabilities, språkalternativ, licensstatus, assets, uttjänta frågor och innehållsrevisioner. Semantisk likhet ger **varning och redaktionell granskning**, inte automatisk borttagning; avsiktliga varianter länkas med `variantOf`.
- Varje innehålls-PR bör rapportera **skapade/ändrade/arkiverade objekt, ändrade svar/kunskapsmål, påverkade samlingar/spelformer och migrationsrisk**. Git commit-historik är ändringslogg; skriv inte parallella manuella register.
- Skript för synkning av JSON till JS ersätts så småningom av **en** reproducerbar byggpipeline; offline-cache, manifest och publicerade filer måste uppdateras atomärt så att aldrig gammal fråga blandas med nytt facit.

## Granskning av dagens beroenden (2026-11-27)

Detta beskriver **nuläget**, inte att kod redan migrerats.

| Nuläge i `main` | Risk / framtida gräns |
| --- | --- |
| `public/js/engine.js` har `VALID_ADVENTURES`, frågekonstruktion, `generateRound`, validering och `sanitizeHistory` | Separera världsregister, fråga/instans, urval och lagring. |
| `public/js/adaptive.js` hanterar observationskort, scenrotation, prioritering och val av frågetyp | Separera evidens, repetitionspolicy, urval och typval. |
| `public/js/app.js` knyter ihop många moduler och äger `localStorage`-nyckeln `ordjakten-v1` | Inför neutrala orkestrerings- och lagringsgränser; ingen big-bang-omskrivning. |
| `public/js/mission-portals-data.js` äger 32 berättelser med 96 inbäddade uppdrag | Flytta på sikt frågor till registret; behåll berättelser som refererande upplevelser. |
| `public/js/mission-portals.js` utgår från tre steg och stegindex vid progression | Inför stabila steg- och frågeinstans-ID:n med migrering för äldre fynd/steg. |
| `public/js/treasure-hunt.js` modellerar både upptäckt, svar, mysterier och belöningar | Frikoppla uppgifts-/bedömningsresultat från karta och fynd. |
| `public/js/adventures.js` beskriver världar och `public/js/question-play.js` använder världs-ID och lägesinställningar | Temat ska vara presentation/upplevelse, inte en dold urvals-/facitregel. |
| `public/data/*.json` + motsvarande `*.js`, `public/data/curation.js` och synkskript | Etablera en redaktionell källa och genererade browserartefakter med täckningskontroll. |
| `public/sw.js` innehåller hårdkodat cacheversionsnamn och resurslista | Frikoppla innehållsrelease/manifest och cachepaketering; bevara offline. |

### Migration i små, verifierbara PR:er – ingen kod ändras av denna beskrivning

1. **Inventera och klassificera** samtliga innehållskällor (frågor, stimulus, äventyr, begrepp, medieobjekt), tilldela beständiga ID:n där de saknas och registrera användningsrelationer. Bevara publicerade belöningar och progression.
2. **Fastställ minimikontrakten** för question, question instance, typed response, assessment, event/evidence, scene, story step och content manifest. Besluta först vilka fält som är kanoniska och vilka som är härledda.
3. **Bygg en läsadapter** från befintliga JSON/JS-källor till neutralt frågeformat. Gör **ett pilotfall**: samma fråga i Träna/Testa och ett äventyr, med existerande UI och identiskt facit. Ingen samtidig kopia får bli redigerbar.
4. **Separera bedömning/urval/feedback i turordning**, med låst provläge och oförändrad testsemantik. Lägg sedan till en typad numerisk fråga och enhetssvar som domänneutral validering innan flera ämnen införs.
5. **Separera event och progression** med backfill/migrering från `ordjakten-v1`; verifiera import, export, radering, omladdning, ofullständig session och samma historiska resultat. Ogiltiga eller äldre ID:n ska ge kontrollerad hantering, inte tyst förlust.
6. **Flytta upplevelserna gradvis**, inklusive Upptäckarklubbens 96 uppdrag och Skattkartans ledtrådar, till referenser. Testa flera spelformer mot samma kunskapsmål och bevara alla samlarföremål.
7. **Inför release- och kvalitetsrapporter** (dubblettkontroll, brytande ändringar, licenser, reproducerbar byggning och offline-paket). Avveckla äldre dubbelkällor endast efter paritetskontroll.

**Definition of done för varje framtida migrerings-PR:** existerande frågor/facit och pedagogiska förklaringar är oförändrade om inte innehållsrevision uttryckligen granskats; alla gamla progressionsposter kan läsas eller migreras; Testa dig avslöjar inget facit i UI före avslut; tränings- och belöningslogik påverkar inte bedömningsresultat; offline, lokal integritet och tillgänglighet fungerar; inga parallella redigerbara källor införs.

## Utanför målbilden just nu

Ingen server, databas, kontosystem, generell AI-rättning, molnprofil, klasslistor eller mikrotjänster. En plugin-/adapterarkitektur här betyder **små typade moduler och kontrakt i samma repo**; externa standardformat eller import-/exportsystem kan anslutas senare utan att diktera hela den interna modellen.
