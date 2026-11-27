# Tydligare frågor och förklaringar efter PR #10

27 november 2026. Bas: mergade PR #10, commit
`c6b04d0e25fa880fc73d97bdcf0067d93813d208`.

Den här omgången minskar konkreta tolkningsproblem i befintliga uppgifter.
Vardagsurvalet med 101 ord och 59 uttryck, inklusive 14 skolord, behålls.
Hela banken har fortfarande 121 ord, 67 uttryck och 363 vardagsscener.
Inga nya ord eller spel läggs till.

## Vad granskningen fann

Fyra typer av osäkerhet behövde rättas:

1. **Egenskaper som kan finnas samtidigt behandlades som motsatser.**
   Någon kan vara uppmärksam men ändå förvirrad. Ett klumpigt misstag
   visar inte i sig att någon saknar omtanke eller försiktighet.
2. **Förklaringar lade till fakta som berättelsen inte gav.** En hängande
   blomma visar inte ensam att orsaken är vattenbrist. En misstanke är
   inte bevis för att någon har tagit en sak.
3. **Förklaringar upprepade bara ordet.** ”Det är randigt eftersom det har
   ränder” hjälper mindre än att peka ut de långa färgade banden och
   jämföra dem med prickar.
4. **Återkopplingen kunde gälla en annan uppgift.** Skolans ordningsfrågor
   använde huvudscenens förklaring i stället för arbetsstegen som barnet
   just hade ordnat. Seriernas bilder och bildtexter behövde också
   granskas tillsammans.

## Omfattning

| Del | Innehåll som förbättras |
| --- | --- |
| Ord och vardagsscener | 18 befintliga ord berörs. 6 undervisningsposter, 28 scenförklaringar samt utvalda berättelser och felalternativ förbättras. |
| Vardagsuttryck | 12 uttryck får tydligare betydelsekopplingar, bättre motexempel eller mer varierade Aha-situationer. |
| Skolord | Alla 14 får en egen förklaring till arbetsstegen. Fem får också mer precisa instruktioner, svar eller återkoppling. |
| Ordjämförelser | 25 scener förtydligar vad frågan gäller eller vad informationen faktiskt visar. |
| Handlingsspel och småspel | 22 befintliga uppdrag får mer precisa förutsättningar, alternativ eller förklaringar. |
| Begrepp och ordbroar | Överlappande ord behandlas rättvisare och abstrakta hjälpord ersätts med konkreta exempel. |

Raderna beskriver olika innehållsdelar och ska inte summeras till ett
antal unika ord.

## Exempel på förbättringar

### Uppmärksam och förvirrad

Jämförelsefrågorna säger nu vilken egenskap barnet ska bedöma: hur noga
personen följer det som händer, eller att personen inte får ihop vad
informationen betyder. Förklaringen drar inte slutsatsen att den som
tittar noga också måste förstå.

Exempel från vägskyltarna: Kim har lagt märke till skyltarna, men de
pekar åt olika håll mot samma mål. Kim kan alltså vara uppmärksam och
ändå bli förvirrad. Detektivuppgiftens markerade textbitar är anpassade
till den ändrade berättelsen och valideras mot dess ordalydelse.

### Varsam och försiktig

Den tidigare ordbron kunde underkänna en försvarbar beskrivning genom att
kräva en för skarp uppdelning mellan orden. Nu förklaras att de överlappar:
att sätta ner ett glas mjukt undviker stötar; att gå långsamt på halt golv
minskar risken att ramla. En handling kan vara både varsam och försiktig.

Aha-felberättelser om klumpiga misstag tas bort för varsam, försiktig,
omsorgsfull och skonsam. Ett misstag bevisar inte att personen saknar
den efterfrågade omtanken. Ord med överlappande definitioner —
knottrig/bucklig och misstänksam/osäker — spärras även mot varandra i
genererade betydelsefrågor och omvända ordval.

Överlappningen mellan varsam och försiktig har stämts av mot
[Svenska Akademiens ordböcker](https://svenska.se/?id=xnr163910&q=f%C3%B6rsiktig).
Den redaktionella spärren betyder att orden kan skapa ett osäkert facit
i den här frågeformen; den påstår inte att orden alltid betyder samma sak.

### Skör, ihålig och långsam

Äggförklaringen visar vad som händer: skalet kan spricka av en stöt,
stoppningen ger efter och dämpar stötarna. Röruppgiften skiljer på ett
tomrum inuti och att just det här röret också har öppna ändar och plats
för kulan. Varken alla ihåliga föremål eller alla rör släpper igenom
vilken kula som helst.

Musikuppgiften börjar med en snabb melodi. Barnet väljer att låta det gå
längre tid mellan tonerna. De andra svaren spelar lika snabbt men
starkare eller svagare. Förklaringen skiljer därmed tempo från ljudstyrka.

### Vardagsuttryck

De tolv uttrycken är för en gångs skull, i sista stund, ha is i magen,
hålla tummarna, ta det med en nypa salt, hålla ett öga på, det var nära
ögat, lägga benen på ryggen, vara på vippen, dra sitt strå till stacken,
hålla huvudet kallt och gå över styr.

*På vippen* beskriver att något är mycket nära att hända. Förklaringen
lovar inte att händelsen senare inträffar eller att den måste gå att
stoppa. *Hålla ett öga på* visar att någon tittar till det som ska passas.
*Lägga benen på ryggen* visar springande, inte bara en ospecificerad
brådska. Seriernas två första rutor håller sig till samma huvudberättelse;
andra vardagssituationer finns i exempel och Aha. De gemensamma
rubrikerna är nu ”Berättelsen”, ”Så hänger det ihop” och ”Uttryckets
betydelse”. De förutsätter inte att varje berättelse handlar om att
något brukar vara på ett sätt men ändras just den här gången.

### Återkoppling till rätt skoluppgift

Varje skoluppdrag har ett skrivet `orderExplanation` som beskriver hur
de tre arbetsstegen bygger på varandra. `schoolFeedback` väljer den
texten för ordningsfrågor i träning, fokus och facit. Den lånar inte
huvudfrågans exempel. En tom vardagskoppling visas inte som en tom ruta.

Bonusuppgiften använder samma förklaring både efter rätt ordning och
som hjälp efter fel ordning. Ett exempel för *sammanfatta*:

> När du har läst hela texten kan du lättare se vad som är viktigast.
> De delarna hjälper dig att skriva en kort version som fortfarande
> säger vad texten handlar om.

Arbetsstegen är ett stöd för att planera uppgiften. Förklaringarna påstår
inte att detta är den enda möjliga arbetsgången i verkligheten.

## Granskningsregel för fortsatt arbete

Varje ändrad uppgift granskas tillsammans med rätt svar, samtliga
felalternativ, förklaring, rubrik och eventuell bild. Fråga särskilt:

- Vad i texten visar att just detta svar passar?
- Kan ett felalternativ också stämma utan att barnet missförstått ordet?
- Skiljer förklaringen det som står i texten från ett nytt exempel eller
  en möjlig orsak?
- Förklaras sambandet med enklare ord än det som barnet ska lära sig?
- Fungerar texten även efter hjälp, utan att tillskriva barnet ett val
  som spelet gjorde automatiskt?

## Verifiering och kvarvarande kontroll

Innehåll och speländringar har granskats även av en annan granskare.
Tester kontrollerar att förbjudna ordpar inte konkurrerar i båda
frågeriktningarna och att skolans ordningsfeedback använder rätt källa.
De befintliga kontrollerna täcker JSON/JS-synk, ordurval, scenreferenser,
detektivens ordagranna ledtrådar, balanserade jämförelser och statiska
resurser. Offlinecachen uppdateras till v62.

`npm run check` passerar: samtliga 461 automatiska tester samt
sidkontrollen med 69 HTML-resurser, 152 offline-sökvägar och 48 skript.
De två nya regressionstesterna skyddar mot överlappande felalternativ
och skolåterkoppling från fel exempel.

Ordens ID:n, scenindex, uppgiftsantal och facit bevaras. Befintlig
innehållsversionskontroll kan göra att en ändrad detektiv- eller
begreppsuppgift behöver övas igen; tidigare provresultat ändras inte.

Ingen faktisk webbläsarkörning eller barnprovspelning har gjorts i den
här omgången. Visuell kontroll av de längre förklaringarna på mobil och
provspelning med barn återstår. Använd gärna
[barnprovspelningsplanen](CHILD-PLAYTESTING.md) för att se om barnet kan
peka ut ledtråden och förklara varför andra svar inte passar.
