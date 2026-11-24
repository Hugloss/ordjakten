"""Ordjakten 0.11: end-to-end review variation and delayed revisit, no accounts."""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

PREVIEWS=Path(__file__).resolve().parents[1]/'docs/previews'

def choose_picture(page, is_right):
    word=page.locator('#question-word').inner_text()
    good=page.evaluate('''w => window.ORDJAKTEN_WORDS.words.find(x=>x.word===w).illustration.label''', word)
    for button in page.locator('.answer-option').all():
        if (good in button.inner_text()) == is_right:
            button.click()
            return word
    raise AssertionError(f'No matching image for {word}')

def test_word_review(browser):
    page, errors=make_page(browser,{'width':390,'height':844})
    page.set_default_timeout(5000)
    assert '0' in page.locator('#review-due-count').inner_text()
    page.locator('#quest-home-buttons [data-start-quest="scout"]').click()
    missed=choose_picture(page,False)
    for _ in range(4):
        page.locator('#next').click()
        choose_picture(page,True)
    page.locator('#next').click()
    assert page.locator('#view-results').is_visible()
    assert page.locator('#result-right').inner_text()=='4'
    assert page.locator('#result-wrong').inner_text()=='1'
    assert '🌱 1 att öva nu' in page.locator('#review-result-counts').inner_text()
    page.locator('#quest-result-buttons [data-start-quest="comeback"]').click()
    assert 'VILKET ORD PASSAR' in page.locator('#question-prompt').inner_text()
    assert page.locator('#question-word').inner_text()!=missed
    assert not page.locator('.answer-option.with-picture').count()
    assert page.locator('.answer-option').count()==4
    PREVIEWS.mkdir(parents=True,exist_ok=True)
    page.locator('#question-area').screenshot(path=PREVIEWS/'v011-repetition-ny-fraga-mobil.png')
    for button in page.locator('.answer-option').all():
        if missed in button.inner_text():
            button.click()
            break
    else: raise AssertionError(f'Review word missing: {missed}')
    assert page.locator('#feedback-area').is_visible()
    assert page.locator('#explanation-word').inner_text()==missed
    page.locator('#next').click()
    assert page.locator('#result-right').inner_text()=='1'
    assert '⏳ 1 senare' in page.locator('#review-result-counts').inner_text()
    assert '🌱 0 att öva nu' in page.locator('#review-result-counts').inner_text()
    assert page.locator('#quest-result-buttons [data-start-quest="comeback"]').is_disabled()
    assert not errors,errors
    page.close()

def test_expression_review(browser):
    page,errors=make_page(browser,{'width':1100,'height':870})
    page.set_default_timeout(5000)
    page.evaluate('Math.random=()=>0.99999')
    page.locator('[data-topic="expressions"]').click()
    page.locator('[data-expression-task="meaning"]').click()
    page.locator('[data-count="5"]').click()
    page.locator('#start').click()
    first=page.locator('#question-word').inner_text()
    page.locator('.answer-option').filter(has_text='Pappa kunde inte skjutsa den här gången.').click()
    for _ in range(4):
        page.locator('#next').click()
        page.locator('.answer-option').first.click()
    page.locator('#next').click()
    page.locator('#quest-result-buttons [data-start-quest="comeback"]').click()
    assert page.locator('#question-word').inner_text()==first
    assert 'VILKEN MENING' in page.locator('#question-prompt').inner_text()
    assert page.locator('.answer-option').count()==3
    PREVIEWS.mkdir(parents=True,exist_ok=True)
    page.locator('#question-area').screenshot(path=PREVIEWS/'v011-uttryck-ny-mening-dator.png')
    page.locator('.answer-option').first.click()
    page.locator('#next').click()
    # With a wrong first sentence response, the next variant will be order.
    # If we happened to click the right one, it must wait until the next spaced revisit.
    if page.locator('#result-wrong').inner_text()=='1':
        page.locator('#quest-result-buttons [data-start-quest="comeback"]').click()
        assert 'VAD HÄNDER FÖRST' in page.locator('#question-prompt').inner_text()
    else:
        assert page.locator('#quest-result-buttons [data-start-quest="comeback"]').is_disabled()
    assert not errors,errors
    page.close()

def test_exam_secrecy(browser):
    page,errors=make_page(browser,{'width':390,'height':780})
    page.set_default_timeout(5000)
    page.locator('[data-mode="test"]').click()
    page.locator('[data-topic="expressions"]').click()
    page.locator('[data-expression-task="meaning"]').click()
    page.locator('[data-count="5"]').click()
    page.locator('#start').click()
    for i in range(5):
        assert page.locator('#feedback-area').is_hidden()
        assert page.locator('#results-review').is_hidden()
        page.locator('.answer-option').first.click()
        if i<4:assert page.locator('#feedback-area').is_hidden()
    assert page.locator('#view-results').is_visible()
    assert not errors,errors
    page.close()

def main():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        test_word_review(browser)
        test_expression_review(browser)
        test_exam_secrecy(browser)
        browser.close()
    print('✓ Review browser: reverse words, alternating expressions, delayed recall, mobile and hidden test answers')

if __name__=='__main__':main()
