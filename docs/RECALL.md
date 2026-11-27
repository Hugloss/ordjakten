# Hitta ordet själv

Frivillig skrivövning utan färdiga svarsalternativ. Barnet får en betydelse och, om ordets exakta form förekommer en gång i en befintlig exempelmening, en lucka. Efter framgång kan spelet ta bort meningen. Om barnet behöver hjälp nästa gång börjar övningen med första bokstaven (för uttryck, första bokstaven i varje ord). Barnet kan alltid be om ledtråd eller visa svaret. Om samma ordform inte finns i en exempelmening används bara betydelsen, aldrig en påhittad böjning. Förekomst av målordet i definitionen maskeras.

## Anpassning

- Högst tre tidigare mötta ord/uttryck per runda. Tidigare rätt i betydelse, omvänd fråga, kontext, mening eller Aha (eller tidigare frivillig skrivövning) kvalificerar. Bildträff ensam kvalificerar inte.
- Övning med stöd prioriteras före nya skrivövningar och därefter oassisterade återbesök. Äldsta redo först inom gruppen. Minst 24 timmar mellan sparade observationer av samma ord.
- En direktstart från ett ordkort är **alltid stödd träning** eftersom svaret visades på kortet. Den ska inte höja eller sänka tidigare ledtrådsnivå.
- En träff utan extra ledtråd på första försöket kan minska stödet. Träff efter begärd hjälp eller tidigare miss räknas som stöd. En träff med initiala bokstäver kan leda till en övning utan dessa nästa gång.
- Samma ord i böjd form eller ett annat rimligt ord kan vara språkligt korrekt; det är inte spelets målord. Säg att flera ord kan passa, aldrig att barnet saknar förståelse. NFC, versaler/gemener, blanksteg och avslutande meningsskiljetecken normaliseras; svenska bokstäver å/ä/ö skiljs åt. Ingen automatisk semantisk bedömning av fria meningar.

## Integritet

Lokal, separat `recallProgress` innehåller endast kända innehålls-ID:n, två begränsade räknare, ledtrådsnivå, senaste typ och tidsstämpel. Ingen inskriven text, exempeltext, nätverksbegäran eller provpoäng. Ofullbordade svar sparas inte, fältet rensas vid återkoppling och navigering. Export och radering omfattar den nya historiken. Äldre sparade data läses utan migrering. Spelaren kan välja ordstigen eller gå tillbaka när som helst.

## Kontroll

`npm run check` kör de nya testfallen med befintlig snabb CI. Frivilligt webbläsartest `python tests/browser_recall.py` använder befintlig about:blank-harness och lokal lagringsshim; verklig reload/offline kräver separat test. Testa med barn om tangentbord och ledtrådar passar målgruppen. Egen mening kan senare övas med självreflektion, men ska inte automatiskt bedömas utan redaktionellt stöd.
