"""v0.18: adaptation to new story contexts, test isolation, and mobile UI."""
import json
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

OUT=Path(__file__).resolve().parents[1]/'docs/previews'

def answer(page,right=True):
    scene=page.locator('#focus-scene').inner_text()
    details=page.evaluate('''story => {
        const pair=window.ORDJAKTEN_CONTRASTS.pairs.find(p=>p.scenes.some(s=>s.text===story));
        const s=pair.scenes.find(s=>s.text===story);
        const word=window.ORDJAKTEN_WORDS.words.find(w=>w.id===s.target).word;
        return {pair:pair.id,sceneId:s.id,context:s.context,word};
    }''',scene)
    assert page.locator('#focus-context-label').is_visible()
    assert details['context'] in ('hem','skola','natur','fritid')
    assert page.locator('#focus-context-label').inner_text()
    options=page.locator('#focus-choices button')
    assert options.count()==2
    if right: options.get_by_text(details['word'],exact=True).click()
    else: options.filter(has_not_text=details['word']).click()
    assert page.locator('#focus-question').is_hidden()
    assert page.locator('#focus-feedback').is_visible()
    assert page.locator('#focus-why').inner_text().startswith('⚖️ Aha!')
    return details

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':390,'height':844},storage_seed={})
        page.set_default_timeout(7000)
        page.locator('#quick-contrast').click()
        assert page.locator('#view-focus').is_visible()
        assert 'flera platser' in page.locator('#focus-description').inner_text()
        page.screenshot(path=str(OUT/'v018-jamfor-i-olika-miljoer-mobil.png'))
        first=[]
        for i in range(4):
            first.append(answer(page,right=i==3))
            if i==0:page.screenshot(path=str(OUT/'v018-aha-i-vardagen-mobil.png'))
            page.locator('#focus-next').click()
        assert len({s['context'] for s in first})>=3
        assert len({s['sceneId'] for s in first})==4
        assert len({s['word'] for s in first})==2
        assert page.locator('#focus-finished').is_visible()
        assert 'miljöer' in page.locator('#focus-summary').inner_text()
        page.screenshot(path=str(OUT/'v018-flera-miljoer-resultat-mobil.png'))
        saved=page.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        assert saved['results']==[] and not saved['reviewProgress']
        pair=first[0]['pair']
        rec=saved['confusionProgress'][pair]['recent']
        assert len(rec)==4
        assert all(set(e)=={'target','chosen','at','sceneId','context'} for e in rec)
        assert {e['sceneId'] for e in rec}=={s['sceneId'] for s in first}
        page.locator('#focus-done').click()
        page.locator('[data-nav="home"]').click()
        assert page.locator('#confusion-home').is_visible()
        assert 'miljö' in page.locator('.confusion-context-tip').first.inner_text()
        page.locator('#confusion-list [data-confusion-pair]').click()
        second=[]
        for _ in range(4):
            second.append(answer(page,True))
            page.locator('#focus-next').click()
        assert not {s['sceneId'] for s in second}&{s['sceneId'] for s in first},'The repeated session reused a memorized scene'
        assert len({s['context'] for s in second})>=3
        assert len({s['word'] for s in second})==2
        page.locator('#focus-done').click()
        page.locator('[data-nav="home"]').click()
        assert page.locator('#confusion-home').is_hidden(), 'Varied correct scenes should reduce the suggestion'
        before=page.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        page.locator('[data-mode="test"]').click()
        page.locator('[data-level="medium"]').click()
        page.locator('[data-count="5"]').click()
        page.locator('#start').click()
        for _ in range(5):page.locator('.answer-option').first.click()
        assert page.locator('#view-results').is_visible()
        after=page.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        assert after['confusionProgress']==before['confusionProgress']
        assert len(after['results'])==1
        assert not errors,errors
        page.close()

        tiny,errors=make_page(browser,{'width':320,'height':760},storage_seed={})
        tiny.locator('[data-theme-choice="light"]').click()
        tiny.locator('#high-contrast').check()
        tiny.locator('#quick-contrast').click()
        assert tiny.locator('#focus-context-label').is_visible()
        assert tiny.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        tiny.screenshot(path=str(OUT/'v018-miljoer-ljust-tema-mobil.png'))
        answer(tiny,True)
        assert tiny.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        assert not errors,errors
        tiny.close()
        browser.close()
    print('✓ v0.18 Chromium: balanced contexts, new stories on revisit, only approved evidence, 320px high contrast, exam isolation')

if __name__=='__main__':main()
