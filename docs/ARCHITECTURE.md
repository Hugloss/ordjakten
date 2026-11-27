# Arkitektur – ämnesoberoende lärplattform

**Status: föreslagen målarkitektur för granskning, inte implementerad.** Senast genomgången 2026-11-27 mot `main` och den mergade [PR #28](https://github.com/Hugloss/ordjakten/pull/28). Den här sidan är **enda kanoniska beskrivningen av målarkitekturen**. [CONTENT.md](CONTENT.md) dokumenterar hur befintligt språkinnehåll redigeras idag; [PRODUCT.md](PRODUCT.md) dokumenterar produktprinciper. Respektive spelforms dokument beskriver nuvarande beteende, inte en konkurrerande arkitektur.

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

## Verifierad inventering – vilka objekt finns redan?

**Ögonblicksbild 2026-11-27, `main` efter mergade PR #28 och #29.** Detta är **antal källposter**, inte antalet unika frågor; lägg aldrig ihop talen till en total. Inventeringen förblir en granskningsöversikt; katalog och framtida counts ska genereras från innehållsfilerna.

| Källa (befintlig) | Verifierat | Nuvarande identitet och framtida roll |
| --- | ---: | --- |
| `public/data/ordbank.json` | 121 ord | `sv-####` identifierar ett målord/begrepp, **inte** varje fråga om ordet. |
| `public/data/word-contexts.json` | 121 ordposter, 363 scener | Samma `sv-####` binder in tre scener per ord; scener behöver separata, stabila stimulus-/uppgifts-ID:n. |
| `public/data/expressions.json` | 73 uttryck | `ut-####` binder uttryck med scen, fem alternativ och förklaringar. Uttrycks-ID blir begreppsalias; separat ID för varje bedömningsuppgift. |
| `public/data/missions.json` | 73 uppdragsposter | **Exakt samma 73 uttrycks-ID:n** som i uttrycksbanken. Mening/ordning är egna aktiviteter, inte kopior av ordet. |
| `public/data/surprises.json` | 73 utmaningar | Exakt samma 73 uttrycks-ID:n; innehåller ytterligare uppgifter. |
| `public/data/comics.json` | 73 serier kopplade till uttryck | Samma 73 uttrycks-ID:n som objekt-nycklar; serie är återanvändbar media/berättelse, inte en synonym till frågan. |
| `public/data/contrasts.json` | 12 jämförelsepar, 96 scener | `js-01` o.s.v. för par och **96 unika scen-ID:n**. Behåll relationerna till båda målord. |
| `public/data/clue-ladder.json` | 4 jämförelsepar, 64 nivåscener | Fyra befintliga `js-...`-referenser; nivåscenerna har egna `ld-...`-ID:n som ska bevaras. |
| `public/js/mission-portals-data.js` | 32 berättelser, 96 steg/uppdrag | Berättelserna har ID:n; de **96 stegen saknar egna ID:n** och har facit/alternativ inbäddade. Separera frågan från scenen före omordning. |
| `public/js/treasure-hunt-data.js` | 48 platsledtrådar | Ledtrådarna saknar egna ID:n och är knutna till värld + platsindex. Ytterligare mysterier och överföringsuppgifter finns i samma modul. |
| `public/js/action-words.js` | 23 skrivna handlingsuppgifter | Varje handling har kort lokalt ID och ordreferens; behöver global uppgiftsidentitet och tydlig bedömnings-/presentationsgräns. |
| `public/js/story-quests.js` och `public/js/world-missions.js` | Innehåll för vardera 12 världar | Berättelsekapitel respektive skrivna världsuppdrag i JS; inventera varje kapitel/uppgift separat före migrering. |
| `public/js/adventures.js`, `public/js/question-play.js` | Världs- och presentationsdata | Äger världar, kartor, scenpresentation och ledtrådstexter – inte framtida fråge-ID:n, facit eller kunskapsmål. |
| `public/data/curation.js` | Urvals- och bildstödsregler | Separera redaktionella bildkopplingar/felalternativ från användaranpassat urval och generell spelpresentation. |

**Resultat av referenskontroll:** 121/121 ord-ID:n matchar posterna i `word-contexts.json`. Mängderna av 73 uttrycks-ID:n är identiska mellan `expressions.json`, `missions.json`, `surprises.json` och serienycklarna i `comics.json`. Det är **referenser till samma begrepp**, inte 292 olika uttryck. Någon semantisk kontroll av alla frågetexter är ännu inte utförd; avsaknad av främmande ID:n bevisar inte avsaknad av innehållsdubletter.

**Viktigt om "en källa":** Även idag är vissa `*.json` redaktionella original med synkade `*.js`-exports, medan andra uppgifter endast finns som JS-objekt. Den senare gruppen ska **inventeras innan flytt**, inte slås ihop genom textmatchning. Skapade presentationer, fysiska interaktioner och berättelser ska bara brytas ut som egna objekt där det faktiskt ger återanvändbarhet. Målet är en ägare per innehållsobjekt – inte att pressa allt till en enda jättestor JSON-fil.

### ID-policy och migreringskarta

| Gammal referens | Föreslagen identitet framåt | Skydd |
| --- | --- | --- |
| `sv-0001` som både ord och fråga | Begrepp behåller `sv-0001` som bestående alias; varje separat fråga får `q-...` | Äldre ordhistorik mappas via explicit alias, inte via ändrat ID. |
| `ut-0001` i fyra innehållskällor | Ett uttryck `ut-0001`, plus fråge-/uppgifts-ID:n och referenser | Bevara scen, svarsalternativ, förklaringar och uppgiftsvariant. |
| `wordContexts[sv-...].scenes[0..2]` | Varje stimulus/scen och eventuell fråga får eget ID | Engångsmappning av ursprungligt ord-ID **och** position före redaktionell omordning. |
| `mission-portals-data.STORIES[detective].stages[0..2]` | Stabilt `scene/step`-ID som refererar till självständig `questionId` | Versionerad mappning från berättelse-ID + gamla stegindex; flytta inte stegen först. |
| `treasure-hunt-data.DATA[forest][0..3]` | Separat `placeId`/`clueId` och eventuellt `questionId` | Bevara gamla platsindex i migreringsmappningen och intjänade fynd. |
| `js-01`, `js-01-01`, `ld-...` | Behåll befintliga stabila identiteter där de redan är entydiga | Tilldela dem rätt objekttyp; skapa inte nya identiteter enbart för snyggare prefix. |
| `action-words.js` lokala handlings-ID:n | Globala uppgifts-ID:n med alias från handlings-ID + ord-ID | Skilj rätt-svar-kontroll från animation och manipulation. |

Nya ID:n får vara läsbara men ska **inte härledas från dagens arrayposition vid varje bygge**. Ett migrerat steg får permanent ID även om placering eller ordning senare ändras. Övergången ska ha en envägs, testad tabell `legacyReference → newId`; tvetydigheter måste granskas manuellt. Ingen tyst deduplicering, omnumrering, sammanslagning eller radering av sparad progression.

## Minsta interoperabla kontrakt – specificera före implementation

Detta är **kontraktsutkast, inte befintlig kod eller fastslaget JSON-schema**. Kontraktet ska göra det möjligt att både läsa gamla språkfrågor och senare lägga till fysik/kemi utan spelformsspecifika fält i frågorna.

### 1. Registry, fråga och sammansatt uppgift

- `ContentRef = {id, revision, locale}`. `id` är stabilt, `revision` ökar vid ändring i betydelse/facit/formulering, `locale` är innehållets språk. Sluta använda fråge-ID som synonym till ämnets begrepps-ID.
- `Question = {ref, skillIds, stimulusRefs?, prompt, responseSpec, assessmentSpec, explanation?, review, provenance?, assetRefs?}`. Frågan är en självständig bedömningsbar enhet och **får inte ha gameMode/adventure/reward/score/localStorage-fält**.
- `Task/Activity = {id, revision, objectives, steps/questionRefs}` kan vara flera uppgifter, en simulerad laboration eller ett frivilligt fritt resonemang. En fråga behöver **inte** vara flerval eller ens binärt rätt/fel.
- `Scene = {id, revision, narrative, activityRefs, assetRefs, transitions}`. Ett äventyr äger ordningen och upplevelsen, men inte uppgiftens facit. En scen kan referera till flera frågor och samma fråga får användas av flera scener.
- `Collection = {id, criteria | orderedRefs}` skiljer fasta redaktionella listor från dynamiskt sökfilter. Gemensam fråga = gemensamt refererat ID, inte en kopia av dess text.

### 2. Svar, bedömning och hjälp

- `ResponseSpec` beskriver **hur svar lämnas** (exempelvis `single-choice`, `multi-choice`, `numeric`, `quantity-with-unit`, `math-expression`, `chemical-equation`, `ordering`, `text`). Interaktionskomponenten väljs av capability-matchning, inte av ämnesnamnet.
- `AssessmentSpec` anger **hur ett svar kan bedömas** (exakt matchning, ett eller flera tillåtna alternativ, numerisk tolerans, dimension/enhet, symbolisk ekvivalens, atom- och laddningsbevarande, rubrik/mänsklig granskning eller medvetet obetygsatt). Flera vetenskapligt ekvivalenta svar är tillåtna. Normalisering får inte förlora enheter eller betydelse.
- `AssessmentOutcome = {status, evidence, score?}` har minst `correct`, `incorrect`, `partial`, `ungraded`, `needs-review`, `invalid`. `score`, om det används, är **bedömningsmått** och inte stjärnor eller spelbelöning.
- `FeedbackPolicy` bestämmer **när** facit/ledtrådar visas (omedelbart i Träna, först efteråt i Testa). `HintContent` hör till uppgiften eller en pedagogisk strategi; ledtrådens **visning** styrs av spelpolicyn. Rätt/fel behöver inte vara synligt i alla spelformer.

### 3. Instans, slump, händelse och progression

- `QuestionInstance = {instanceId, questionRef, parameters?, seed?, choiceOrder?, contextRef?, manifestId}` fryser frågerevisionen och alternativens stabila ID:n för ett försök. Parametriserad uppgift får deterministiskt facit från samma parametrar och bedömningsversion; förklaringen måste vara giltig även efter variation.
- `AttemptEvidence = {attemptId, instanceId, assessmentStatus, assessedSkillIds, assistance, originMode, eventTime?, assessmentRevision}` förklarar **vad som observerades**, inte automatiskt att barnet kan eller inte kan. `assistance` ska exempelvis skilja självständigt svar, upprepat försök, ledtråd och förhandsvisning. Undvik att spara barns fria texter, ljud eller identifierare.
- `GameEvent = {sessionId, modeId, eventType, sceneId?, instanceId?, payloadVersion}` får uppdatera ett separat `GameProgress` (plats, kapitel, fynd) medan godkänd `AttemptEvidence` kan uppdatera `LearningProgress` (övningssignaler och repetition). Dessa är **olika projektioner**, även om samma försök utlöser dem.
- `StorageEnvelope` har egen schemaversion, aktiva sessionsreferenser och innehållsmanifest-ID. Appversion, innehållsrevision och lagringsschema **får inte blandas ihop**. En äldre nyckel `ordjakten-v1` måste kunna läsas och migreras idempotent eller förbli i säkert kompatibilitetsläge tills migrering är klar.
- `ContentManifest` låser publicerade fråga-/asset-revisioner och offline-buntens version så att cacheuppdatering inte blandar gammalt facit med ny fråga. Om referensen inte finns: **stoppa/visa kontrollerat fel**, hitta inte på ersättningsfråga.

### 4. Spelmodellen får endast begära kapabiliteter

En spelmodell förklarar exempelvis `supportedResponses: [single-choice, numeric]`, vilka feedbackflöden som tillåts och om sessionen är låst eller adaptiv. Urvalet söker frågor vars **krav** uppfylls; frågan behöver inte listas mot varje framtida spelmodell. Redaktionellt urval till världar och uppdrag sker genom samlingar, kunskapsmål eller scenreferenser, **inte genom fältet "spelformer" på frågan**.

**Särskild gräns för prov:** Även om statisk/offline JavaScript inte kan gömma nedladdat facit för den som analyserar koden ska UI, loggning, utvärderingshändelser och progressionsvyer inte avslöja det för barnet före avslutad omgång.

## Första migrationspilot – konkreta acceptanskriterier

**Rekommenderat innehåll:** använd ett redan redaktionellt skrivet flervalsobjekt från `expressions.json`, exempelvis uttrycket `ut-0001` med dess fasta alternativ. Skapa vid implementation en **enda kanonisk fråga** med eget ID och en läsadapter för befintlig datakälla. Verifiera återanvändning i Träna och Testa. Prova därefter en **referens** från en separat äventyrsscen (utan att skriva över en existerande portalfråga eller dess manus). Inga nya frågor dupliceras för att göra pilotfallet möjligt.

**Kriterier innan pilot-PR får mergas:**

1. Kanoniskt fråga-/alternativ-ID och revision är oförändrade oavsett spelform; text, facit och förklaring är jämförda mot nuvarande källa.
2. Ingen fråga eller bedömare importerar `adventures.js`, `mission-portals.js` eller UI; spelmodellen får bara fråga/instans och neutralt bedömningsresultat.
3. Ett prov avslöjar inte rätt svar i UI förrän omgången är avslutad. Träning får frivillig hjälp utan att ändra facit.
4. Äldre `sv-####`/`ut-####`-historik, `ordjakten-v1`, portalsteg, fynd och belöningar migreras inte i smyg och förloras inte vid omladdning. Först dokumenterad alias-/instansmappning, sedan migrationskod.
5. Samma fråga får två olika presentationer utan två manuellt redigerade frågetexter; tests kan kontrollera referensintegritet samt identisk bedömning.
6. Testerna täcker rätt, fel, delvis/obetygsatt som kontrakt, assisterat svar, slumpad alternativordning, återupptagen session, export/import/radering och offline-cachegräns. Kemi-/fysikgraderare behöver inte vara implementerade i denna pilot, men får inte kräva ett nytt `Question`-kontrakt.
7. Inget oavsiktligt beroende av konto, nätverk, backend, stor extern runtime, kopiering av licensierade resurser eller sparande av rå fritext introduceras.

**Nästa verifiering före själva kodflytten:** gå igenom `world-missions.js` och `story-quests.js` på objektnivå och kontrollera semantiska dubbleringar mellan formulerade portaluppdrag, världsmysterier och ord-/uttrycksfrågor. De inventerade talen ovan visar **strukturella mängder**, inte att semantisk deduplicering är färdig.

## Migration i små, verifierbara PR:er – ingen kod ändras av denna beskrivning

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
