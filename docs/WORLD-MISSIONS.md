# Spelbara berättelseuppdrag

De 48 berättelsekapitlen i Ordjaktens tolv världar har nu var sitt redaktionellt skrivet ordproblem (41 unika målord ur den riktiga ordbanken). Barnet väljer en konkret handling eller ett föremål i berättelsen, inte bara en abstrakt definition. Tre alternativ blandas vid start. Första miss visar ordets förklaring och ger ett nytt försök. Vid andra miss, eller om barnet väljer att lösa uppgiften tillsammans med ordkompisen, visas en genomarbetad lösning. Ett uttryckligt val att fortsätta berättelsen öppnar kapitlets avslutning.

De besökta platserna och nästa plats går att trycka på direkt från kartan på startsidan, Min ordstig, slutskärmarna och äventyrsplatsen. Senare kapitel visas som berättelsekontext. Hela världen har ett ändligt avslut och tidigare kapitel kan spelas om. Alla världar kan väljas från början. Det finns alltid ett synligt paus-/stoppval.

En avslutad berättelse ger samma befintliga kosmetiska minnesmärke som motsvarande adaptiva äventyr. Direkt lösning, lösning med stöd och ett genomgånget exempel ger alla berättelsen ett avslut; inget påstående om oberoende återkallning. Ingen ny belöning vid återbesök och ingen dubblering mellan adaptiv runda och berättelse. Avbruten uppgift före avslut sparar inget nytt kapitel. Barnet kan placera ett nyupptäckt märke direkt på sin äventyrsplats.

Detta är en frivillig parallell spelväg, inte en ändring i den adaptiva träningsplanen. Berättelseuppdragen ändrar endast `storyProgress`. De ger inga provpoäng, färdighetsobservationer, nya repetitionsbevis, balanseringsposter, tidsgränser, eller automatiskt vidare spel. Ordäventyret är fortfarande tillgängligt från slutskärmen när riktiga stationer är redo. Ingen ny lagringsnyckel, nätåtkomst eller nya paket.

## Testning

`npm run check` verifierar innehåll, kapitelordning, stöd, återbesök, dubbleringsskydd, samling och integration. `python tests/browser_world_missions.py` är ett frivilligt interaktionstest i samma Chromium-harness som tidigare. Det kontrollerar även att lärandehistoriken är oförändrad. Visuell granskning och barnprovspelning behövs för att mäta begriplighet och spelglädje.
