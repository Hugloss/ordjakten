"""Browser rendering validation using real bundled PNG bytes on data: URLs.

Chromium here blocks local HTTP and file navigation; injection matches the
existing project's smoke harness, with data: image URLs for visual fidelity.
The app shipped to users uses relative paths to locally bundled PNG files.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_smoke import make_page
import shutil, base64, json

ROOT=Path(__file__).resolve().parents[1]
PREVIEWS=ROOT/'docs/previews'
COMICS=json.loads((ROOT/'public/data/comics.json').read_text())

def load_existing_icons_as_data(page):
  # Only for this blocked-network test environment, preserve shipped paths.
  # No image source is generated, just reuse packaged PNG bytes.
  embedded={emoji:'data:image/png;base64,'+base64.b64encode((ROOT/'public'/path[2:]).read_bytes()).decode()
            for emoji,path in COMICS['iconPaths'].items()}
  page.evaluate('icons => { for (const [key,value] of Object.entries(icons)) window.ORDJAKTEN_COMICS.iconPaths[key]=value }',embedded)


def browser_check():
  with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
    for width,height,theme,name in [(390,844,'dark','seriestripp-mobil.png'),(1050,900,'light','seriestripp-dator.png')]:
      page,errors=make_page(browser,{'width':width,'height':height})
      load_existing_icons_as_data(page)
      page.evaluate('Math.random = () => 0.999999')
      page.locator(f'[data-theme-choice="{theme}"]').click()
      page.locator('[data-topic="expressions"]').click()
      page.locator('[data-expression-task="meaning"]').click()
      page.locator('[data-count="5"]').click()
      page.locator('#start').click()
      assert page.locator('#question-word').inner_text()=='För en gångs skull'
      assert page.locator('#expression-reveal').is_hidden()
      page.locator('.answer-option').filter(has_text='Pappa kunde inte skjutsa den här gången.').click()
      assert page.locator('#expression-reveal').is_visible()
      page.locator('#expression-open').click()
      assert page.locator('#expression-comic .comic-panel').count()==3
      assert 'Det hände som ett undantag' in page.locator('.comic-panel').nth(2).inner_text()
      page.wait_for_function('''() => [...document.querySelectorAll('#expression-comic img')].every(i => i.complete && i.naturalWidth > 0)''')
      assert page.locator('#expression-comic img').count()==6
      assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'horizontal overflow on {width}px'
      assert not errors,errors
      page.screenshot(path=PREVIEWS/name,full_page=True)
      page.close()

    page,errors=make_page(browser,{'width':390,'height':844})
    load_existing_icons_as_data(page)
    page.locator('[data-topic="expressions"]').click()
    page.locator('[data-expression-task="meaning"]').click()
    page.locator('[data-count="25"]').click()
    page.locator('#start').click()
    # In-browser loop avoids 25 long Playwright scroll/actionability checks.
    result=page.evaluate('''() => {
      const snapshots=[];
      for(let i=0;i<25;i++){
        document.querySelector('.answer-option').click();
        document.querySelector('#expression-open').click();
        const comic=document.querySelector('#expression-comic');
        const count=comic.querySelectorAll('.comic-panel').length;
        const bonus=document.querySelectorAll('#expression-bonus [data-mission-answer]').length;
        if(count!==3||bonus!==2)throw Error('Missing panels or bonus in phrase '+i);
        snapshots.push(document.querySelector('#explanation-word').textContent);
        document.querySelector('#next').click();
      }
      return snapshots;
    }''')
    assert len(set(result))==25
    assert page.locator('#view-results').is_visible()
    assert not errors,errors
    page.close()
    browser.close()
  print('✓ Comics visual browser test: original PNGs, 25 complete expressions, mobile and desktop layouts')

if __name__=='__main__':browser_check()
