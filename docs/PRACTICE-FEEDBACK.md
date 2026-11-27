# Pedagogisk återkopplingsloop

Ordjakten kan nu prova ett annat sätt att öva när samma observerade stödbehov återkommer. Detta är en begränsad inom-elev, inom-mål återkoppling, inte en mätning av vilken metod som orsakar bättre inlärning.

## Mål och kontroller

412 möjliga uppföljningsmål i nuvarande material (188 skrivmål, 188 Aha-mål med minst två författade exempel, 36 exakta sambandsfrågor). En elev får endast en registrering för ett mål där stöd faktiskt har observerats. Uppföljningsmålet behåller sitt eget facit och sin egen tidsplan.

| Ursprungligt mål | Möjlig alternativ övning |
|---|---|
| Aha i en berättelse | Orddetektiven med samma målord eller Ordverkstaden för ordet |
| Aktiv återkallning | Ordverkstaden för samma ord |
| En viss sambandsfråga | Ordbro i samma redaktionella grupp, med frågans målord faktiskt involverat |

Ordverkstadens fria meningar bedöms aldrig. En alternativ station är bara en genomförd övning, inte ett nytt mått på målets kunskap. Fokuspass, jämförelsers minnesstig och övriga metoder har kvar sina egna observationer; de får inte påhittade tvärmetodseffekter.

## Regler

1. Två stödobservationer för samma mål minst ett dygn isär. Aha kräver dessutom olika källnycklar. Gamla entydigt stödda observationer kan ge en första observation, inte två; förhandsvisning och gamla blandade räknare är inte stödbevis.
2. Både det ursprungliga målet och alternativet måste finnas bland de redan tillgängliga kandidaterna. Ett alternativ kan tillfälligt få samma prioritet som ett stödbehov. Andra verkliga behov behålls. Äventyrsgränser och överlappningskontroll gäller.
3. Bara en avslutad alternativ station öppnar ett väntande försök. Förhandsförslag, påbörjat, överhoppat eller avbrutet arbete registrerar inget försök. Baslinjen måste fortfarande vara densamma.
4. Uppföljningen blir tidigast redo efter ett dygn från alternativets avslut och enligt originalmotorns tidsplan. Under väntan erbjuds inte ytterligare frivilliga länkade alternativ automatiskt. Inga låsta frågor skapas.
5. Ett senare faktiskt direkt eller stött svar på exakt originalmål avslutar försöket. För Aha krävs en annan källnyckel än baslinjen; ändrad fråga, förhandsvisning, tidigt svar eller mer än 60 dagar utan jämförbar observation ger ingen resultatetikett. Sambandsfrågan får vara samma fråga efter en paus; detta bevisar inte överföring till nya frågor.
6. Ett direkt svar nollställer den aktuella stödföljden. Fortsatt stöd kräver ytterligare en tidsfördelad observation innan nästa alternativa försök. Högst fyra jämförbara uppföljningar per mål lagras. För samma mål föredras en metod med fler direkta än stödda uppföljningar, sedan en oprövad metod, sedan tidigare stödda. Detta är en försiktig regel för nästa val, inte ett statistiskt beräknat effektmått.

## Integritet och begränsningar

`feedbackProgress` lagras lokalt med målets och alternativets innehållsnycklar/kontrollkoder, tider och begränsade utfall. Ordens Aha-version omfattar både de egna scenerna och den separata listan med felalternativ inklusive deras berättelsetexter. Ett ändrat alternativ får därför inte jämföras som om frågan vore identisk. Inga egna svar, meningar, namn eller externa analyser. Okända mål, gamla innehållsversioner och ogiltiga uppföljningar filtreras. Radering och export omfattar fältet. Ett väntande försök kan läsas efter omladdning. Vanliga övningar är fortsatt frivilliga, även när ett automatiskt återbesök vilar.

Barnet kan ha övat utanför appen eller i andra övningar mellan tillfällena. Vi vet därför inte varför ett senare svar förbättrats. Aha visar ordets betydelse före frågan; en direkt Aha-träff är inte självständig ordåterkallning. UI visar bara antal väntande/jämförbara uppföljningar och observerade utfall, aldrig en effektprocent, diagnos eller förmågepoäng. Rekommendationerna behöver utvärderas genom användning.

## Test

`npm run check` inkluderar verkliga innehållslänkar, skilda mål, klockgränser, avbrutna och förhandsvisade försök, återaktivering, metodval, lagringsvalidering och integration med äventyrsplaneraren. Ingen ny CI-workflow eller externa paket.
