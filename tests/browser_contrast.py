"""0.16 comparison mode: real Chromium UI clicks with injected local assets."""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page
OUT=Path(__file__).resolve().parents[1] / 'docs/previews'

def answer(page, right=True):
    info=page.evaluate('''() => {
      const story=document.querySelector('#focus-scene').textContent;
      const pair=window.ORDJAKTEN_CONTRASTS.pairs.find(p=>p.scenes.some(s=>s.text===story));
      const scene=pair.scenes.find(s=>s.text===story);
      const target=window.ORDJAKTEN_WORDS.words.find(w=>w.id===scene.target).word;
      return {story,target,pair:pair.id};
    }''')
    choices=page.locator('#focus-choices button')
    assert choices.count()==2
    assert len(info['story'])>35
    if right:choices.get_by_text(info['target'],exact=True).click()
    else:choices.filter(has_not_text=info['target']).first.click()
    assert page.locator('#focus-question').is_hidden()
    assert page.locator('#focus-feedback').is_visible()
    assert page.locator('#focus-definition').inner_text()
    assert 'Därför passar ordet' in page.locator('#focus-why').inner_text()
    assert page.locator('#focus-explain-word').inner_text()==info['target']
    return info

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':390,'height':850},storage_seed={})
        page.set_default_timeout(7500)
        assert page.locator('#quick-contrast').is_visible()
        page.screenshot(path=str(OUT/'v016-startsida-mobil.png'))
        page.locator('#quick-contrast').click()
        assert page.locator('#view-focus').is_visible()
        assert 'Fyra olika berättelser' in page.locator('#focus-description').inner_text()
        assert page.locator('#focus-choices button').count()==2
        assert page.locator('#focus-task').inner_text().startswith('🎯 HITTA SKILLNADEN')
        seen=[]
        page.screenshot(path=str(OUT/'v016-hitta-skillnaden-mobil.png'))
        for index in range(4):
            info=answer(page,right=index!=1)
            seen.append(info)
            if index==0:page.screenshot(path=str(OUT/'v016-aha-mobil.png'))
            page.locator('#focus-next').click()
        assert len({q['story'] for q in seen})==4
        assert len({q['pair'] for q in seen})==1
        assert page.locator('#focus-finished').is_visible()
        assert page.locator('#focus-right').inner_text()=='✅ 3 rätt'
        assert page.locator('#focus-wrong').inner_text()=='❌ 1 fel'
        assert '3 rätt och 1 fel' in page.locator('#focus-summary').inner_text()
        page.screenshot(path=str(OUT/'v016-resultat-mobil.png'))
        state=page.evaluate("JSON.parse(localStorage.getItem('ordjakten-v1'))")
        assert state['results']==[], 'Comparison added graded results'
        assert not state['reviewProgress'], 'One-sitting comparison added spaced-review evidence'
        assert sum(card.get('skills',{}).get('contrast',{}).get('attempts',0) for card in state['skillProgress'].values())==4
        page.locator('#focus-done').click()
        page.locator('[data-nav="history"]').click()
        assert 'Inga resultat sparade ännu' in page.locator('#history-list').inner_text()
        assert not errors,errors
        page.close()
        restored,errors=make_page(browser,{'width':390,'height':800},storage_seed={'ordjakten-v1':__import__('json').dumps(state)})
        assert restored.locator('#view-home').is_visible()
        restored.locator('#open-learning-home').click()
        assert int(restored.locator('#learning-total-seen').inner_text())>=2
        assert not errors,errors
        restored.close()

        tiny,errors=make_page(browser,{'width':320,'height':720})
        tiny.set_default_timeout(7500)
        tiny.locator('[data-theme-choice="light"]').click()
        tiny.locator('#high-contrast').check()
        tiny.locator('#open-learning-home').click()
        tiny.locator('[data-learning-status="all"]').click()
        tiny.locator('#learning-search').fill('grumlig')
        tiny.locator('.learning-word-toggle').first.click()
        assert tiny.locator('[data-focus-id="sv-0044"][data-focus-skill="contrast"]').is_visible()
        tiny.locator('[data-focus-id="sv-0044"][data-focus-skill="contrast"]').click()
        assert tiny.locator('#focus-title').inner_text().lower()=='grumlig eller genomskinlig'
        assert tiny.locator('#focus-choices button').count()==2
        assert tiny.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), '320px horizontal overflow'
        tiny.screenshot(path=str(OUT/'v016-ljust-kontrast-mobil.png'))
        answer(tiny,True)
        assert tiny.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        tiny.locator('#focus-back').click()
        assert tiny.locator('#view-learning').is_visible()
        assert not errors,errors
        tiny.close()
        browser.close()
    print('✓ 0.16 browser: 4 balanced scenes, child feedback, no test scores, 320px dark/light contrast, learning map')

if __name__=='__main__':main()
