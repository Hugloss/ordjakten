"""v0.19: real click-through for the curated three-step inference ladder.
Screenshots are genuine app-rendered UI, no image-generation service.
"""
from pathlib import Path
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/previews'

def open_grumlig(page):
    if not page.locator('#view-learning').is_visible():
        page.locator('#open-learning-home').click()
    page.locator('[data-learning-status="all"]').click()
    page.locator('#learning-search').fill('grumlig')
    btn=page.locator('[data-learning-open="sv-0044"]')
    if btn.get_attribute('aria-expanded')!='true':btn.click()
    assert page.locator('#learning-list [data-focus-id="sv-0044"][data-focus-skill="contrast"]').count()==1
    page.locator('#learning-list [data-focus-id="sv-0044"][data-focus-skill="contrast"]').click()
    assert page.locator('#view-focus').is_visible()

def play_round(page,level,wrongs=()):
    assert page.locator('#focus-clue-level').is_visible()
    expected={1:'Tydliga ledtrådar',2:'Läs mellan raderna',3:'Dra egna slutsatser'}[level]
    assert expected in page.locator('#focus-clue-level').inner_text()
    pairs=[];contexts=set();scenes=[]
    for i in range(4):
        story=page.locator('#focus-scene').inner_text()
        details=page.evaluate('''story => {
          const root=window.ORDJAKTEN_CONTRASTS.pairs[0];
          const tier=window.ORDJAKTEN_CLUES.pairs[0];
          const scenes=root.scenes.concat(...tier.levels.map(t=>t.scenes));
          const scene=scenes.find(s=>s.text===story);
          const word=window.ORDJAKTEN_WORDS.words.find(w=>w.id===scene.target).word;
          return {word,sceneId:scene.id,context:scene.context,level:scene.id.startsWith('ld-')?Number(scene.id.split('-')[2]):1};
        }''',story)
        assert details['level']==level,details
        pairs.append(details['word']);contexts.add(details['context']);scenes.append(details['sceneId'])
        assert page.locator('#focus-why').is_hidden()
        buttons=page.locator('#focus-choices button')
        assert buttons.count()==2
        if i in wrongs:
            buttons.filter(has_not_text=details['word']).click()
        else:
            buttons.get_by_text(details['word'],exact=True).click()
        assert page.locator('#focus-question').is_hidden()
        assert page.locator('#focus-feedback').is_visible()
        assert page.locator('#focus-why').is_visible()
        if level>1:assert 'Ledtråden:' in page.locator('#focus-why').inner_text()
        if i==0:
            name='v019-dra-slutsats-aha-mobil.png' if level==3 else 'v019-lasa-mellan-raderna-aha-mobil.png'
            if level>1:page.screenshot(path=str(OUT/name),full_page=True)
        page.locator('#focus-next').click()
    assert page.locator('#focus-finished').is_visible()
    assert len(set(scenes))==4
    assert len(contexts)>=3
    assert sorted({name:pairs.count(name) for name in pairs}.values())==[2,2]
    return scenes

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':390,'height':844},storage_seed={})
        page.set_default_timeout(8000)
        open_grumlig(page)
        assert 'Tydliga ledtrådar' in page.locator('#focus-clue-level').inner_text()
        play_round(page,1)
        assert 'färre ledtrådar' in page.locator('#focus-next-hint').inner_text()
        page.locator('#focus-done').click()
        open_grumlig(page)
        assert 'Läs mellan raderna' in page.locator('#focus-clue-level').inner_text()
        page.screenshot(path=str(OUT/'v019-lasa-mellan-raderna-mobil.png'),full_page=True)
        l2=play_round(page,2)
        page.locator('#focus-done').click()
        open_grumlig(page)
        assert 'Dra egna slutsatser' in page.locator('#focus-clue-level').inner_text()
        page.screenshot(path=str(OUT/'v019-dra-slutsats-mobil.png'),full_page=True)
        l3=play_round(page,3,wrongs=[0,1,2]);assert not set(l2)&set(l3)
        assert 'tydligare ledtrådar' in page.locator('#focus-next-hint').inner_text()
        stored=page.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        assert stored['results']==[]
        assert stored['clueProgress']['js-01']['level']==2
        assert stored['clueProgress']['js-01']['reached']==3
        assert stored['clueProgress']['js-01']['visits']==3
        assert len(stored['confusionProgress']['js-01']['recent'])==12
        assert not errors,errors
        page.close()

        # Simulated rehydration (not a navigated origin): earlier test results
        # stay intact while our new stage resumes at the correct level.
        restored,errors=make_page(browser,{'width':390,'height':844},storage_seed={'ordjakten-v1':json.dumps(stored)})
        open_grumlig(restored)
        assert 'Läs mellan raderna' in restored.locator('#focus-clue-level').inner_text()
        restored.locator('[data-nav="history"]').click()
        restored.on('dialog',lambda dialog:dialog.accept())
        restored.locator('#clear-history').click()
        clean=restored.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        assert not clean['clueProgress']
        assert not clean['confusionProgress']
        assert not errors,errors
        restored.close()

        mobile,errors=make_page(browser,{'width':320,'height':740},storage_seed={})
        mobile.locator('[data-theme-choice="light"]').click()
        mobile.locator('#high-contrast').check()
        open_grumlig(mobile)
        assert mobile.locator('#focus-clue-level').is_visible()
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth')
        mobile.screenshot(path=str(OUT/'v019-ledtradar-ljust-320px.png'),full_page=True)
        assert not errors,errors
        mobile.close()

        exam,errors=make_page(browser,{'width':1100,'height':880},storage_seed={})
        exam.locator('#exam-preset').click();exam.locator('#start').click()
        assert exam.locator('.answer-option').count()==5
        assert exam.locator('#focus-clue-level').is_hidden()
        assert not errors,errors
        exam.close();browser.close()
    print('✓ 0.19 Chromium: 1→2→3→2 after success/struggle, 64 curated scenes, mobile high contrast, exam unaffected')

if __name__=='__main__':main()
