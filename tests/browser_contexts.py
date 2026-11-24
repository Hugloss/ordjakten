"""Ordjakten 0.12: contextual word questions without new or misleading images.

Runs in injected static-page mode; no HTTP access or storage persistence needed.
"""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

PREVIEWS=Path(__file__).resolve().parents[1]/'docs/previews'


def identify_word(page):
    return page.evaluate('''() => {
      const text=document.getElementById('context-story').textContent;
      const title=document.getElementById('question-word').textContent;
      const row=window.ORDJAKTEN_CONTEXTS.wordContexts.find(x=>
        x.scenes.some(scene=>scene.title===title && scene.text===text));
      return window.ORDJAKTEN_WORDS.words.find(w=>w.id===row.id).word;
    }''')


def test_train(browser):
    page,errors=make_page(browser,{'width':390,'height':844})
    page.set_default_timeout(6000)
    page.locator('#quick-contexts').click()
    assert page.locator('#view-play').is_visible()
    assert 'VILKET ORD PASSAR' in page.locator('#question-prompt').inner_text()
    assert page.locator('#context-scene').is_visible()
    assert page.locator('.answer-option').count()==4
    assert page.locator('.with-picture').count()==0
    assert not page.locator('#context-aha').is_visible()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    PREVIEWS.mkdir(parents=True,exist_ok=True)
    page.locator('#question-area').screenshot(path=str(PREVIEWS/'v012-vardag-fraga-mobil.png'))
    word=identify_word(page)
    page.locator('.answer-option').filter(has_text=word).click()
    assert page.locator('#question-area').is_hidden()
    assert page.locator('#context-aha').is_visible()
    assert 'Varför passar ordet?' in page.locator('#context-aha').inner_text()
    assert page.locator('#explanation-word').inner_text()==word
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.locator('#feedback-area').screenshot(path=str(PREVIEWS/'v012-vardag-aha-mobil.png'))
    for _ in range(4):
        page.locator('#next').click()
        w=identify_word(page)
        page.locator('.answer-option').filter(has_text=w).click()
    page.locator('#next').click()
    assert page.locator('#view-results').is_visible()
    assert page.locator('#result-right').inner_text()=='5'
    assert page.locator('#result-wrong').inner_text()=='0'
    assert not errors,errors
    page.close()


def test_test_mode_and_settings(browser):
    page,errors=make_page(browser,{'width':1120,'height':820})
    page.set_default_timeout(6000)
    page.locator('[data-level="medium"]').click()
    assert page.locator('#context-settings').is_visible()
    page.locator('#context-mix').uncheck()
    assert not page.locator('#context-mix').is_checked()
    page.locator('#context-mix').check()
    page.locator('[data-mode="test"]').click()
    page.locator('[data-count="5"]').click()
    page.evaluate('Math.random=()=>0.12')
    page.locator('#start').click()
    n_context=0
    for _ in range(5):
        if page.locator('#context-scene').is_visible():
            n_context+=1
            assert page.locator('#context-aha').is_hidden()
        page.locator('.answer-option').first.click()
        assert page.locator('#feedback-area').is_hidden()
    assert n_context>=1, 'At least one authored contextual item must be present in this deterministic medium round'
    assert page.locator('#view-results').is_visible()
    assert page.locator('.review-card').count()==5
    assert page.locator('.context-review-why').count()==n_context
    assert not errors,errors
    page.close()


def test_theme_and_level(browser):
    page,errors=make_page(browser,{'width':320,'height':800})
    page.locator('[data-theme-choice="light"]').click()
    page.locator('#high-contrast').check()
    page.locator('#quick-contexts').click()
    assert page.locator('#context-scene').is_visible()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.locator('#question-area').screenshot(path=str(PREVIEWS/'v012-vardag-ljust-mobil.png'))
    assert not errors,errors
    page.close()
    exam,errors=make_page(browser,{'width':1024,'height':800})
    exam.locator('#exam-preset').click()
    assert exam.locator('#context-settings').is_hidden()
    exam.locator('#start').click()
    assert exam.locator('.answer-option').count()==5
    assert exam.locator('#context-scene').is_hidden()
    assert not errors,errors
    exam.close()


def main():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        test_train(browser)
        test_test_mode_and_settings(browser)
        test_theme_and_level(browser)
        browser.close()
    print('✓ Vardagsscener: 5 rätt, Aha, 320px light theme, exam unchanged, test facit hidden')


if __name__=='__main__':main()
