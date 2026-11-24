"""v0.17: verify that only actual wrong contrast choices drive child-friendly suggestions."""
import json
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

OUT=Path(__file__).resolve().parents[1]/'docs/previews'

def one_question(page, correct):
    scene=page.locator('#focus-scene').inner_text()
    info=page.evaluate('''scene => {
      const pair=window.ORDJAKTEN_CONTRASTS.pairs.find(p=>p.scenes.some(s=>s.text===scene));
      const story=pair.scenes.find(s=>s.text===scene);
      const word=window.ORDJAKTEN_WORDS.words.find(w=>w.id===story.target).word;
      return {pair:pair.id,target:word};
    }''',scene)
    buttons=page.locator('#focus-choices button')
    assert buttons.count()==2
    if correct:buttons.get_by_text(info['target'],exact=True).click()
    else:buttons.filter(has_not_text=info['target']).click()
    assert page.locator('#focus-feedback').is_visible()
    assert page.locator('#focus-question').is_hidden()
    assert page.locator('#focus-why').inner_text()
    return info

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':390,'height':844},storage_seed={})
        page.set_default_timeout(7500)
        assert page.locator('#confusion-home').is_hidden()
        page.locator('#quick-contrast').click()
        pair_id=None
        for i in range(4):
            detail=one_question(page,correct=i==3)
            pair_id=detail['pair']
            if i==0:page.screenshot(path=str(OUT/'v017-jamfor-fraga-mobil.png'))
            page.locator('#focus-next').click()
        assert page.locator('#focus-finished').is_visible()
        state=page.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        assert state['results']==[], 'Comparison must not create a graded result'
        assert not state['reviewProgress'], 'Comparison cannot count as spaced review'
        card=state['confusionProgress'][pair_id]
        assert (card['wrong'],card['right'],card['attempts'])==(3,1,4)
        assert len(card['recent'])==4
        assert all(set(e)=={'target','chosen','at','sceneId','context'} for e in card['recent'])
        page.locator('#focus-done').click()
        page.locator('[data-nav="home"]').click()
        assert page.locator('#confusion-home').is_visible()
        assert page.locator('#confusion-list .confusion-card').count()==1
        assert 'kluriga flera gånger' in page.locator('#confusion-list').inner_text()
        page.screenshot(path=str(OUT/'v017-kompass-mobil-mork.png'),full_page=True)
        page.locator('#confusion-home').screenshot(path=str(OUT/'v017-kompass-kort-mork.png'))
        page.locator('#confusion-list [data-confusion-pair]').click()
        assert page.locator('#view-focus').is_visible()
        for _ in range(4):
            detail=one_question(page,correct=True)
            assert detail['pair']==pair_id
            page.locator('#focus-next').click()
        assert page.locator('#focus-finished').is_visible()
        page.locator('#focus-done').click()
        page.locator('[data-nav="home"]').click()
        assert page.locator('#confusion-home').is_hidden(), 'Three recent correct answers should reduce priority'
        state2=page.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        assert len(state2['confusionProgress'][pair_id]['recent'])==8
        page.locator('[data-mode="test"]').click()
        page.locator('[data-level="medium"]').click()
        page.locator('[data-count="5"]').click()
        page.locator('#start').click()
        for _ in range(5):page.locator('.answer-option').first.click()
        assert page.locator('#view-results').is_visible()
        state3=page.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        assert state3['confusionProgress']==state2['confusionProgress'], 'Test changed confusion evidence'
        assert len(state3['results'])==1
        assert not errors,errors
        page.close()

        # History stored by previous version still loads; a narrow light screen
        # renders the exact recommendation without horizontal overflow.
        novice=state.copy()
        novice['settings']['theme']='light'
        novice['settings']['contrast']=True
        light,errors=make_page(browser,{'width':320,'height':730},storage_seed={'ordjakten-v1':json.dumps(novice)})
        assert light.locator('#confusion-home').is_visible()
        assert light.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        light.screenshot(path=str(OUT/'v017-kompass-ljus-320.png'),full_page=True)
        light.locator('#confusion-home').screenshot(path=str(OUT/'v017-kompass-kort-ljus.png'))
        light.on('dialog',lambda dialog:dialog.accept())
        light.locator('[data-nav="history"]').click()
        light.locator('#clear-history').click()
        reset=light.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        assert not reset['confusionProgress']
        light.locator('[data-nav="home"]').click()
        assert light.locator('#confusion-home').is_hidden()
        assert not errors,errors
        light.close();browser.close()
    print('✓ v0.17: 2-option errors, gentle pair suggestions, targeted 4-story practice, recovery, 320px, no exam leakage')

if __name__=='__main__':main()
