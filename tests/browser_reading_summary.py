"""End-to-end check: the Aha step never alters original quiz points."""
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def run(browser):
    page,errors=make_page(browser,{'width':360,'height':780})
    page.locator('#quick-contexts').click()
    for i in range(5):
        assert page.locator('#context-scene').is_visible()
        assert page.locator('#answer-options').is_hidden()
        original=page.locator('#context-story').inner_text()
        page.locator('#story-reveal').click()
        word=page.evaluate("""() => {
          const text=document.querySelector('#context-story').textContent;
          const record=window.ORDJAKTEN_CONTEXTS.wordContexts.find(r=>r.scenes.some(s=>s.text===text));
          return window.ORDJAKTEN_WORDS.words.find(w=>w.id===record.id).word;
        }""")
        page.locator('.answer-option').filter(has_text=word).click()
        assert page.locator('#feedback-area').is_visible()
        assert page.locator('#reading-launch').is_visible()
        assert page.locator('#reading-check').is_hidden()
        assert page.locator('#feedback-cheer').is_hidden()
        assert page.locator('#next').is_hidden()
        page.locator('#reading-start').click()
        assert page.locator('.reading-option').count()==3
        labels=page.locator('.reading-option').all_inner_texts()
        texts=page.evaluate("""() => {
          const word=document.querySelector('#explanation-word').textContent;
          const record=window.ORDJAKTEN_CONTEXTS.wordContexts.find(r=>
            window.ORDJAKTEN_WORDS.words.find(w=>w.id===r.id)?.word===word);
          return record.scenes.map(s=>s.text);
        }""")
        correct=[j for j,t in enumerate(labels) if any(scene in t and scene!=original for scene in texts)]
        assert len(correct)==1,(word,labels)
        if i==0:
            wrong=next(j for j in range(len(labels)) if j!=correct[0])
            page.locator('.reading-option').nth(wrong).click()
            assert page.locator('#next').is_hidden()
            assert page.locator('.explanation').is_visible()
            page.locator('#reading-start').click()
            labels=page.locator('.reading-option').all_inner_texts()
            correct=[j for j,t in enumerate(labels) if any(scene in t and scene!=original for scene in texts)]
            assert len(correct)==1,(word,labels)
        page.locator('.reading-option').nth(correct[0]).click()
        assert page.locator('#next').is_visible()
        page.locator('#next').click()
    assert page.locator('#view-results').is_visible()
    assert page.locator('#result-right').inner_text()=='5'
    assert page.locator('#result-wrong').inner_text()=='0'
    assert page.locator('#results-reading').is_visible()
    assert '4 av 5 Aha-frågor direkt' in page.locator('#results-reading-detail').inner_text()
    assert not errors,errors
    page.close()

if __name__=='__main__':
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        run(browser)
        browser.close()
    print('✓ Read, transfer to new contexts, retry and show separate unscored summary')
