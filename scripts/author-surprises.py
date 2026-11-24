#!/usr/bin/env python3
"""Developer-only: curated situational practice per existing Swedish expression.
Run to sync bundled JSON and browser JS (no dependencies or network).
"""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
examples=[
 ('Oftast kan Leo inte följa med, men just i dag kunde han.','Leo följer med varje tisdag, precis som vanligt.','Något som brukar vara ovanligt händer just den här gången.'),
 ('Vi skickade uppgiften precis innan tiden tog slut.','Vi skickade uppgiften flera dagar före sista dagen.','I sista stund betyder att man hinner precis innan det är för sent.'),
 ('Sara väntade lugnt och tänkte efter före sitt beslut.','Sara fattade sitt beslut direkt utan att fundera.','Att ha is i magen är att behålla lugnet och inte skynda fram ett beslut.'),
 ('Vi hoppas att storasysters match ska gå bra.','Vi vet redan säkert att matchen är vunnen.','Man håller tummarna när man hoppas på något bra.'),
 ('Jag hörde ett rykte men vet inte om det stämmer.','Jag såg själv vad som hände och vet att det är sant.','Man tar något med en nypa salt när man inte tror på allt direkt.'),
 ('Jag tittar till väskan medan min vän hämtar vatten.','Jag lånar väskan och tar med den till mitt hem.','Att hålla ett öga på något är att hålla koll på det.'),
 ('Bollen flög förbi fönstret utan att slå sönder det.','Bollen träffade fönstret och krossade rutan.','Det var nära ögat när något dåligt nästan hände men inte gjorde det.'),
 ('Jag gissade helt fel på vad ordet betydde.','Jag cyklade till biblioteket och kom fram.','Ute och cykla betyder här att ha fel eller vara förvirrad.'),
 ('Vi skyndade oss hem när det började ösregna.','Vi gick extra långsamt och stannade ofta.','Att lägga benen på ryggen betyder att springa eller skynda sig.'),
 ('Allt fungerade lätt och utan problem när vi byggde kojan.','Vi fick börja om flera gånger eftersom inget fungerade.','När något går som smort går det smidigt och utan större problem.'),
 ('Vi började jobba snabbare för att hinna till bussen.','Vi tog en lång rast fast vi hade bråttom.','Att sätta fart betyder att komma igång eller öka tempot.'),
 ('Jag ville slippa erkänna misstaget men gjorde det ändå.','Jag låtsades att inget hänt och vägrade prata.','Att bita i det sura äpplet är att göra något jobbigt som behövs.'),
 ('Liam var precis på väg att somna i soffan.','Liam hade sovit gott i flera timmar.','På vippen betyder att något nästan händer.'),
 ('Efter första lyckade försöket ville hon prova igen direkt.','Efter första försöket ville hon aldrig prova igen.','Att få blodad tand är att få mersmak och lust att fortsätta.'),
 ('Vi försökte länge men bestämde oss till sist för att sluta.','Vi fortsatte trots svårigheterna och gav aldrig upp.','Att kasta in handduken är att ge upp eller sluta försöka.'),
 ('Alla i klassen hjälpte till med en liten uppgift var.','En person fick göra allt medan de andra tittade på.','Att dra sitt strå till stacken betyder att bidra med sin del.'),
 ('Hon tog tag i det svåra samtalet redan i dag.','Hon sköt upp det svåra samtalet ännu en vecka.','Att ta tjuren vid hornen betyder att våga möta ett problem.'),
 ('Han tänkte lugnt trots att alla omkring honom blev stressade.','Han blev så arg att han slutade lyssna på andra.','Att hålla huvudet kallt är att förbli lugn och tänka klart.'),
 ('Vi förstod direkt varandras idéer om hur kojan skulle byggas.','Vi var helt oense och förstod inte den andres idéer.','Att vara på samma våglängd är att förstå och tänka lika.'),
 ('Vi började fira innan vi visste vem som hade vunnit.','Vi väntade med firandet tills matchen var avslutad.','Man ropar hej för tidigt när man firar innan allt är säkert.'),
 ('Vi gjorde en liten miss till en jättestor katastrof.','Vi löste ett litet problem utan att överdriva det.','Att göra en höna av en fjäder är att överdriva ett litet problem.'),
 ('Hon tränade, packade och planerade festen samtidigt.','Hon hade inga planer och bara en liten sak att göra.','Många järn i elden betyder att ha flera saker på gång.'),
 ('Först sa han nej, men efter en stund ändrade han sig.','Han tyckte precis likadant hela tiden.','Att komma på andra tankar betyder att ändra sin uppfattning.'),
 ('Det började som ett roligt skämt men blev för mycket.','Alla hade lagom roligt och ingen blev upprörd.','När något går över styr blir det för mycket eller svårt att styra.'),
 ('Efter bråket bestämde vi oss för att börja om.','Vi fortsatte att älta samma gamla bråk varje dag.','Att vända blad är att släppa det som varit och gå vidare.')
]
expressions=json.loads((root/'public/data/expressions.json').read_text(encoding='utf-8'))['expressions']
assert len(examples)==len(expressions)==25
surprises=[]
for i,entry in enumerate(expressions):
    right,wrong,feedback=examples[i]
    # Alternate correct index, so the mini task cannot be solved by always tapping option 1.
    options=[{'label':right,'correct':True},{'label':wrong,'correct':False}] if i%2==0 else [{'label':wrong,'correct':False},{'label':right,'correct':True}]
    surprises.append({'id':entry['id'],'prompt':'Vilken NY situation passar uttrycket ”'+entry['phrase'].lower()+'”?','options':options,'explanation':feedback})
payload={'version':1,'description':'25 frivilliga miniuppdrag med NYA situationer som visar överförd förståelse. Öppnas efter inlärning, aldrig under prov.','challenges':surprises}
(root/'public/data/surprises.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'public/data/surprises.js').write_text('/* Frivilliga miniuppdrag till 25 färdiga uttrycksserier. */\nwindow.ORDJAKTEN_SURPRISES = '+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Created',len(surprises),'curated bonus tasks')
