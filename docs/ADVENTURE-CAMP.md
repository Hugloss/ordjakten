# Min äventyrsplats

Ett frivilligt kreativt område nås från startsidan, Min ordstig och slutskärmen. Barnet får en plats med sex positioner, fyra valbara bakgrunder och sex föremål redan från början. De 48 befintliga berättelsemärkena är också dekorativa föremål när motsvarande kapitel har genomförts. Inget föremål förbrukas eller försvinner när barnet flyttar eller lägger tillbaka det. Inredning fungerar med vanliga knappar, både föremål först och tom plats först; ingen dragning eller tidspress krävs.

Ett nyvunnet märke kan väljas direkt från slutskärmen via ”Placera mitt nya minnesmärke”. Ordkompisen (Roffe, Ulla eller Dino) har tre återanvändbara, vänliga repliker. Kreativa språkförslag använder föremål som faktiskt står på platsen: beskriva, berätta, sätta ihop en mening eller förklara placeringen. Ingen fri text efterfrågas, sparas eller bedöms.

Sex fristående minigåtor använder faktiska ord-ID:n från ordbanken i redaktionellt skrivna miljöer. Första felaktiga valet visar ledtråd, andra visar förklaringen; barnet kan också välja förklaring direkt. Gåtorna är frivilliga, oberoende av adaptiv historik, provpoäng, upptäckter eller repetition. Ingen ny belöning för omspelning.

Världsväljaren visar alla tolv världar med deras verkliga kapitelframsteg. Att välja värld ändrar befintlig äventyrsinställning, men startar inte en uppgift. Separat startknapp använder den ordinarie adaptiva träningsmotorn med aktuell tillgänglighet. Dekoration och gåtor är tillgängliga även när repetitionsuppgifter vilar. Världar och fria dekorationer är inte låsta bakom resultat.

`campLayout` lagrar endast ett av fyra miljö-ID:n och högst sex kända, unika föremåls-ID:n. Både generell historiksanering och platsens egen validering kontrollerar ägande mot sparade berättelsekapitel. Export och radering omfattar platsen. Ordkompisen och värld använder tidigare lokala inställningar. Inga nätanrop, konton, personuppgifter eller nya paket. Alla val är reversibla och inga dagliga krav eller förlorade föremål införs.

`npm run check` kontrollerar lagring, ägande, placering, flyttning, världar, gåtor och integration med befintliga vyer. Frivilligt `python tests/browser_camp.py` använder samma Chromium-harness. CSS-bakgrunder och emoji är avsiktligt lätta och fungerar offline; full visuell granskning och barnprovspelning återstår.
