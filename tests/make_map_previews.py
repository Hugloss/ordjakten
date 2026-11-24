"""Optional preview capture: requires local Chromium + Python Playwright + Pillow."""
from pathlib import Path
import shutil
from io import BytesIO
from PIL import Image,ImageDraw,ImageFont
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

OUT=Path(__file__).resolve().parents[1]/'docs'/'previews'

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as playwright:
        browser=playwright.chromium.launch(headless=True, executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':980,'height':800})
        worlds=page.evaluate('Object.entries(window.OrdjaktenAdventures.WORLDS).map(([id,world])=>[id,world.title])')
        screenshots=[]
        for id,title in worlds:
            page.evaluate('(world)=>document.querySelector(`button[data-adventure="${world}"]`).click()',id)
            data=page.locator('#adventure-preview-map svg').screenshot()
            screenshots.append((title,Image.open(BytesIO(data)).convert('RGB')))
        assert not errors,errors
        page.close()
        browser.close()
    cellw,cellh=450,237
    canvas=Image.new('RGB',(cellw*3+64,cellh*4+80),'#0b1220')
    draw=ImageDraw.Draw(canvas)
    try:font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',19)
    except OSError:font=ImageFont.load_default()
    draw.text((30,15),'Ordjakten – 12 äventyrskartor',font=font,fill='#f8fafc')
    for n,(title,im) in enumerate(screenshots):
        row,col=divmod(n,3);x=20+col*(cellw+8);y=55+row*cellh
        draw.rounded_rectangle((x,y,x+cellw-8,y+cellh-8),radius=11,fill='#19253a')
        draw.text((x+12,y+9),title,font=font,fill='#f8fafc')
        thumb=im.copy();thumb.thumbnail((cellw-20,cellh-43))
        canvas.paste(thumb,(x+8,y+39))
    target=OUT/'alla-12-kartor.png';canvas.save(target,optimize=True)
    print(target)

if __name__=='__main__':main()
