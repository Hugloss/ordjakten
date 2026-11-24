"""One-off curation script: exports glyph art from an already installed open-source Noto Emoji font.

No image generation and no externally hosted assets: the images are existing
Noto Color Emoji glyph artwork, exported as small PNG files for offline use.
The font itself is not distributed. The small PNGs preserve the original design.
"""
import json
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'public/data'
ASSETS=ROOT/'public/assets/story-icons'
FONT=Path('/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf')
if not FONT.exists():
    raise SystemExit('Noto Color Emoji font is required only when rebuilding assets, not at runtime')

# Icons reinforce the text instead of trying to illustrate an entire complicated idea.
# Each row has two short contextual scenes and a final memorable takeaway.
STORIES={
 'ut-0001':dict(before=['🏒','⏳'],after=['🚗','🏒'],aha=['✨','👍'],takeaway='Det hände som ett undantag, inte som vanligt.'),
 'ut-0002':dict(before=['🚌','⏰'],after=['🏃','🚌'],aha=['⏳','✅'],takeaway='Precis innan det blev för sent!'),
 'ut-0003':dict(before=['🏒','😰'],after=['😌','💭'],aha=['🧠','👍'],takeaway='Lugn först – beslut sedan.'),
 'ut-0004':dict(before=['🤞','🏒'],after=['💛','⭐'],aha=['🤞','😊'],takeaway='Man hoppas att det ska gå bra.'),
 'ut-0005':dict(before=['💬','😮'],after=['🤔','🔍'],aha=['🧠','💡'],takeaway='Tro inte automatiskt på allt du hör.'),
 'ut-0006':dict(before=['🚲','🏪'],after=['👀','🚲'],aha=['👀','✅'],takeaway='Håll koll på något en stund.'),
 'ut-0007':dict(before=['⚽','🪟'],after=['⚽','😮'],aha=['🍀','👍'],takeaway='Något dåligt var nära att hända, men gjorde inte det.'),
 'ut-0008':dict(before=['💬','❌'],after=['🧭','🤔'],aha=['💡','🧭'],takeaway='Man har helt fel, fast det inte handlar om en cykel.'),
 'ut-0009':dict(before=['🌧️','⛈️'],after=['🏃','🏠'],aha=['⚡','👟'],takeaway='Spring iväg snabbt!'),
 'ut-0010':dict(before=['🧩','🤝'],after=['🧩','✅'],aha=['✨','👍'],takeaway='Allting fungerar utan problem.'),
 'ut-0011':dict(before=['🚌','⏰'],after=['🏃','⚡'],aha=['⏱️','👟'],takeaway='Nu gäller det att skynda sig!'),
 'ut-0012':dict(before=['📚','😬'],after=['💬','💪'],aha=['💪','✅'],takeaway='Gör det jobbiga fast du helst vill slippa.'),
 'ut-0013':dict(before=['🥱','👀'],after=['😴','💤'],aha=['⏳','💤'],takeaway='Något håller nästan på att hända.'),
 'ut-0014':dict(before=['🏒','🥅'],after=['🥅','😁'],aha=['🔥','⭐'],takeaway='Man får lust att fortsätta när det går bra.'),
 'ut-0015':dict(before=['🧩','😣'],after=['🛑','🧩'],aha=['🛑','😮‍💨'],takeaway='Sluta försöka eller ge upp för stunden.'),
 'ut-0016':dict(before=['🏫','🧹'],after=['🧹','🤝'],aha=['🤝','✨'],takeaway='Alla hjälper till med en liten del.'),
 'ut-0017':dict(before=['😟','🙋'],after=['💬','🤝'],aha=['💪','✅'],takeaway='Våga ta itu med det som känns svårt.'),
 'ut-0018':dict(before=['🥅','😰'],after=['😌','🎯'],aha=['🧠','🧊'],takeaway='Fortsätt tänka lugnt fast det blir stressigt.'),
 'ut-0019':dict(before=['💬','💡'],after=['🤝','💡'],aha=['🤝','😊'],takeaway='Ni förstår och tänker ungefär likadant.'),
 'ut-0020':dict(before=['🏒','🎉'],after=['⏳','🏒'],aha=['🛑','⏳'],takeaway='Fira inte förrän du vet hur det slutar.'),
 'ut-0021':dict(before=['🔘','😕'],after=['😱','🎭'],aha=['🔍','💡'],takeaway='Ett litet problem görs mycket större.'),
 'ut-0022':dict(before=['📚','🧺'],after=['🍳','⏰'],aha=['📋','⏰'],takeaway='Ha många saker på gång samtidigt.'),
 'ut-0023':dict(before=['🙅','💭'],after=['🤔','✅'],aha=['🔄','💡'],takeaway='Ändra sig efter att ha tänkt om.'),
 'ut-0024':dict(before=['💦','😆'],after=['💦','😣'],aha=['🛑','💧'],takeaway='Något går för långt och blir för mycket.'),
 'ut-0025':dict(before=['🏒','😔'],after=['🌅','📖'],aha=['➡️','🌟'],takeaway='Släpp det gamla och gå vidare.'),
}

# Some Noto Emoji font versions have no glyph for a combined emoji: replace
# unsupported sequences with neutral, meaningful existing glyphs at curation time.
REPLACEMENTS={'😮‍💨':'😮'}
FONTFACE=ImageFont.truetype(str(FONT),109)
ASSETS.mkdir(parents=True,exist_ok=True)
for item in STORIES.values():
    for stage in ('before','after','aha'):
        item[stage]=[REPLACEMENTS.get(icon,icon) for icon in item[stage]]
icons=sorted({e for row in STORIES.values() for stage in ('before','after','aha') for e in row[stage]})
manifest={}
for icon in icons:
    cps='-'.join(f'{ord(x):x}' for x in icon)
    name=f'{cps}.png'
    # This rasterizes already authored, pre-existing icon artwork. It does not
    # create or generate novel drawings or compose a narrative image.
    canvas=Image.new('RGBA',(164,164),(0,0,0,0))
    painter=ImageDraw.Draw(canvas)
    bbox=painter.textbbox((0,0),icon,font=FONTFACE,embedded_color=True)
    width,height=bbox[2]-bbox[0],bbox[3]-bbox[1]
    if width<2 or height<2:
        raise ValueError(f'Unsupported font icon: {icon!r}')
    painter.text(((164-width)/2-bbox[0],(164-height)/2-bbox[1]),icon,font=FONTFACE,embedded_color=True)
    alpha=canvas.getchannel('A')
    crop=alpha.getbbox()
    if not crop:
        raise ValueError(f'Blank icon: {icon!r}')
    img=canvas.crop(crop)
    img.thumbnail((116,116),Image.Resampling.LANCZOS)
    result=Image.new('RGBA',(128,128),(0,0,0,0))
    result.alpha_composite(img,((128-img.width)//2,(128-img.height)//2))
    result.save(ASSETS/name,optimize=True)
    manifest[icon]='./assets/story-icons/'+name

bundle={'version':1,'attribution':'Noto Color Emoji · Google · SIL Open Font License 1.1','iconPaths':manifest,'stories':STORIES}
(DATA/'comics.json').write_text(json.dumps(bundle,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(DATA/'comics.js').write_text('/* Curerade serierutor med återanvända, färdiga fria Noto Emoji-illustrationer. */\nwindow.ORDJAKTEN_COMICS = '+json.dumps(bundle,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(f'Curated {len(STORIES)} expression stories and exported {len(icons)} already existing emoji glyphs, {sum(f.stat().st_size for f in ASSETS.glob("*.png"))//1024} KiB total')
