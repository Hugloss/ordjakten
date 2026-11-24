"""End-to-end visual/interaction checks of v0.20 gentle spaced revisits.

Uses the in-memory page shell from browser_smoke. This is NOT evidence
of localStorage persistence across real-origin reloads or offline caching.
"""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/previews'
DAY=86400000

def open_pair(page):
    if page.locator('#view-home').is_visible():
        page.locator('#open-learning-home').click()
    page.locator('[data-learning-status="all"]').click()
    page.locator('#learning-search').fill('grumlig')
    btn=page.locator('[data-learning-open="sv-0044"]')
    if btn.get_attribute('aria-expanded')!='true':btn.click()
    page.locator('#learning-list [data-focus-id="sv-0044"][data-focus-skill="contrast"]').click()
    assert page.locator('#view-focus').is_visible()

def play_pair(page,level=1,misses=()):
    assert ['Tydliga ledtrådar','Läs mellan raderna','Dra egna slutsatser'][level-1] in page.locator('#focus-clue-level').inner_text()
    scene_ids=[]
    for i in range(4):
        story=page.locator('#focus-scene').inner_text()
        details=page.evaluate('''story=>{
          const p=window.ORDJAKTEN_CONTRASTS.pairs[0],tier=window.ORDJAKTEN_CLUES.pairs[0];
          const scene=p.scenes.concat(...tier.levels.map(x=>x.scenes)).find(s=>s.text===story);
          return {id:scene.id,word:window.ORDJAKTEN_WORDS.words.find(w=>w.id===scene.target).word};
        }''',story)
        scene_ids.append(details['id'])
        choices=page.locator('#focus-choices button')
        if i in misses:choices.filter(has_not_text=details['word']).click()
        else:choices.get_by_text(details['word'],exact=True).click()
        assert page.locator('#focus-feedback').is_visible()
        assert page.locator('#focus-question').is_hidden()
        page.locator('#focus-next').click()
    assert page.locator('#focus-finished').is_visible()
    return scene_ids

def home(page):
    page.locator('#focus-done').click()
    page.locator('[data-nav="home"]').click()
    assert page.locator('#view-home').is_visible()

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':390,'height':840},storage_seed={})
        page.set_default_timeout(8000)
        page.evaluate('(n)=>{window.Date.now=()=>n;}',10*DAY)
        assert page.locator('#retention-home').is_hidden()
        open_pair(page)
        scene1=play_pair(page,1)
        assert 'Provat båda orden' in page.locator('#focus-next-hint').inner_text()
        card=page.evaluate('JSON.parse(localStorage.getItem("ordjakten-v1")).retentionProgress["js-01"]')
        assert card['stage']==1 and card['dueAt']==11*DAY
        assert card['verifiedContexts']
        home(page)
        assert page.locator('#retention-home').is_visible()
        assert page.locator('#retention-ready').inner_text()=='0'
        assert page.locator('#retention-later').inner_text()=='1'
        assert page.locator('#retention-home-list button').count()==0
        page.screenshot(path=str(OUT/'v020-vanta-pa-aterbesok-mobil.png'),full_page=True)
        page.evaluate('(n)=>{window.Date.now=()=>n;}',11*DAY)
        page.locator('#open-learning-home').click()
        page.locator('#learning-back').click()
        assert page.locator('#retention-ready').inner_text()=='1'
        assert page.locator('#retention-home-list button').count()==1
        page.screenshot(path=str(OUT/'v020-aterbesok-mobil.png'),full_page=True)
        page.locator('#retention-home').screenshot(path=str(OUT/'v020-minnesstigen-kort.png'))
        page.locator('#retention-home-list button').click()
        assert page.locator('#view-focus').is_visible()
        assert 'Läs mellan raderna' in page.locator('#focus-clue-level').inner_text()
        scene2=play_pair(page,2)
        assert not set(scene1)&set(scene2)
        card=page.evaluate('JSON.parse(localStorage.getItem("ordjakten-v1")).retentionProgress["js-01"]')
        assert card['stage']==2 and card['dueAt']==14*DAY
        assert 'Kom ihåg nästa gång' in page.locator('#focus-next-hint').inner_text()
        home(page)
        page.evaluate('(n)=>{window.Date.now=()=>n;}',14*DAY)
        page.locator('#open-learning-home').click();page.locator('#learning-back').click()
        page.locator('#retention-home-list button').click()
        play_pair(page,3,misses=(0,1,2))
        card=page.evaluate('JSON.parse(localStorage.getItem("ordjakten-v1")).retentionProgress["js-01"]')
        assert card['stage']==2 and card['lastScore']==1 and card['dueAt']==15*DAY
        assert 'ny chans' in page.locator('#focus-next-hint').inner_text()
        # No regular exam results added by review exercises.
        assert page.evaluate('JSON.parse(localStorage.getItem("ordjakten-v1")).results.length')==0
        home(page)
        page.locator('#exam-preset').click();page.locator('#start').click()
        assert page.locator('.answer-option').count()==5
        assert not errors,errors
        saved=page.evaluate('localStorage.getItem("ordjakten-v1")')
        page.close()
        restored,errors=make_page(browser,{'width':390,'height':840},storage_seed={'ordjakten-v1':saved})
        stored=restored.evaluate('JSON.parse(localStorage.getItem("ordjakten-v1"))')
        assert stored['retentionProgress']['js-01']['stage']==2
        restored.locator('[data-nav="history"]').click()
        restored.on('dialog',lambda d:d.accept())
        restored.locator('#clear-history').click()
        clear=restored.evaluate('JSON.parse(localStorage.getItem("ordjakten-v1"))')
        assert not clear['retentionProgress'] and not clear['clueProgress']
        assert not errors,errors
        restored.close()
        light,errors=make_page(browser,{'width':320,'height':740},storage_seed={})
        light.locator('[data-theme-choice="light"]').click();light.locator('#high-contrast').check()
        assert light.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert light.locator('#retention-home').is_hidden()
        assert not errors,errors
        light.close();browser.close()
    print('✓ v0.20 Chromium: 1d→3d recall, novel stories, gentle retry, hidden exam, mobile themes')

if __name__=='__main__':main()
