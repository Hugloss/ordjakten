"""Verify history migration/rehydration using a memory-backed storage shim.

The restricted Chromium sandbox blocks navigation to any served origin. This
is NOT a real browser persistence test: localStorage is explicitly simulated.
Run the manual origin/reload checklist in docs/QA-v0.14.md before publishing.
"""
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import ROOT

FILES = ('data/wordbank.js','data/curation.js','data/expressions.js','data/comics.js',
         'data/surprises.js','data/missions.js','data/word-contexts.js','data/contrasts.js','data/clue-ladder.js','js/engine.js',
         'js/playful.js','js/adventures.js','js/adventure-map.js','js/comics.js',
         'js/surprises.js','js/missions.js','js/quests.js','js/review.js',
         'js/adaptive.js','js/learning-map.js','js/contrast.js','js/confusions.js','js/clue-ladder.js','js/focus-practice.js','js/app.js')
STYLES=('style.css','playful.css','adventures.css','expressions.css','comics.css',
        'surprises.css','missions.css','quests.css','review.css','contexts.css',
        'adaptive.css','learning-map.css','focus-practice.css','contrast.css','confusions.css','clue-ladder.css')

def open_with_storage(browser,initial=None):
    page=browser.new_page(viewport={'width':390,'height':844})
    page.set_default_timeout(8000)
    page.set_content((ROOT/'index.html').read_text())
    page.evaluate("""(start) => {
      const values = Object.assign(Object.create(null),start);
      Object.defineProperty(window,'localStorage',{configurable:true,value:{
        getItem:key => Object.hasOwn(values,key) ? values[key] : null,
        setItem:(key,value) => { values[key]=String(value); },
        removeItem:key => { delete values[key]; },
        clear:() => { for(const key of Object.keys(values)) delete values[key]; }
      }});
    }""",initial or {})
    for name in STYLES:page.add_style_tag(content=(ROOT/'css'/name).read_text())
    for name in FILES:page.add_script_tag(content=(ROOT/name).read_text())
    return page

def main():
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page=open_with_storage(browser)
        page.locator('#quick-start').click()
        for _ in range(5):
            page.locator('.answer-option').first.click()
            page.locator('#next').click()
        assert page.locator('#view-results').is_visible()
        state=page.evaluate("localStorage.getItem('ordjakten-v1')")
        assert 'skillProgress' in state
        page.close()
        restored=open_with_storage(browser,{'ordjakten-v1':state})
        restored.locator('#open-learning-home').click()
        assert int(restored.locator('#learning-total-seen').inner_text())==5
        restored.locator('[data-nav="history"]').click()
        restored.on('dialog',lambda dialog:dialog.accept())
        restored.locator('#clear-history').click()
        fresh=restored.evaluate("localStorage.getItem('ordjakten-v1')")
        restored.close()
        emptied=open_with_storage(browser,{'ordjakten-v1':fresh})
        emptied.locator('#open-learning-home').click()
        assert emptied.locator('#learning-total-seen').inner_text()=='0'
        emptied.close();browser.close()
    print('✓ Storage rehydration with a localStorage *shim*: history, map and clear-results consistency')

if __name__=='__main__':main()
