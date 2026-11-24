"""0.15 isolated guided-practice browser workflows, no server or network needed.

The shared helper injects assets in about:blank. It checks actual interactions
but does not prove persistence across a physical browser reload.
"""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

OUT = Path(__file__).resolve().parents[1] / 'docs/previews'


def open_trail(page, name):
    page.locator('#open-learning-home').click()
    page.locator('[data-learning-status="all"]').click()
    page.locator('#learning-search').fill(name)
    assert page.locator('.learning-word-card').count() == 1
    page.locator('.learning-word-toggle').click()
    assert page.locator('.learning-word-detail').is_visible()


def answer_to_next(page, select_correct=False):
    assert page.locator('#view-focus').is_visible()
    assert page.locator('#focus-question').is_visible()
    if select_correct:
        page.locator('#focus-choices button').filter(has_text='Grumlig').click()
    else:
        page.locator('#focus-choices button').filter(has_not_text='Grumlig').first.click()
    assert page.locator('#focus-question').is_hidden()
    assert page.locator('#focus-feedback').is_visible()
    assert page.locator('#focus-definition').inner_text()
    page.locator('#focus-next').click()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=shutil.which('chromium') or None, args=['--no-sandbox'])
        page, errors = make_page(browser, {'width':390, 'height':844})
        open_trail(page, 'grumlig')
        page.locator('[data-focus-skill="context"][data-focus-id]').last.click()
        assert page.locator('#focus-description').inner_text().startswith('Ord i vardagen')
        assert page.locator('#focus-choices button').count() == 4
        assert page.locator('#focus-progress').inner_text() == 'Uppgift 1 av 3'
        stories = []
        for i in range(3):
            story=page.locator('#focus-scene').inner_text()
            assert len(story)>20, story
            stories.append(story)
            if i == 0:
                page.screenshot(path=str(OUT/'v015-riktad-fraga-mobil.png'))
            page.locator('#focus-choices button').filter(has_not_text='Grumlig').first.click() if i in (0,2) else page.locator('#focus-choices button').filter(has_text='Grumlig').click()
            assert page.locator('#focus-feedback').is_visible()
            assert page.locator('#focus-question').is_hidden()
            assert 'Varför passar ordet?' in page.locator('#focus-why').inner_text()
            if i == 0:
                page.screenshot(path=str(OUT/'v015-riktad-aha-mobil.png'))
            page.locator('#focus-next').click()
        assert len(set(stories))==3, stories
        assert page.locator('#focus-finished').is_visible()
        assert '1 rätt och 2 fel' in page.locator('#focus-summary').inner_text()
        assert page.locator('#focus-right').inner_text() == '✅ 1 rätt'
        assert page.locator('#focus-wrong').inner_text() == '❌ 2 fel'
        page.screenshot(path=str(OUT/'v015-riktad-resultat-mobil.png'))
        page.locator('#focus-done').click()
        assert page.locator('#view-learning').is_visible()
        assert page.locator('#learning-search').input_value().lower()=='grumlig'
        assert page.locator('.learning-word-detail').is_visible()
        assert page.locator('.learning-evidence').first.is_visible()
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        page.locator('#learning-back').click()
        page.locator('[data-nav="history"]').click()
        assert 'Inga resultat sparade ännu' in page.locator('#history-list').inner_text(), 'Guided practice must not count as a regular test result'
        page.locator('[data-nav="home"]').click()
        assert page.locator('#learning-home-focus').is_visible(), 'Failed context should be suggested on the home page'
        page.locator('#learning-home-focus-start').click()
        assert page.locator('#view-focus').is_visible()
        assert page.locator('#focus-description').inner_text().startswith('Ord i vardagen')
        page.locator('#focus-back').click()
        assert page.locator('#view-learning').is_visible()
        assert not errors,errors
        page.close()

        expr, errors = make_page(browser, {'width':900, 'height':800})
        expr.locator('[data-mode="test"]').click()
        expr.locator('[data-count="5"]').click()
        open_trail(expr,'För en gångs skull')
        expr.locator('[data-focus-skill="order"][data-focus-id]').last.click()
        assert expr.locator('#focus-choices [data-focus-step]').count()==3
        assert expr.locator('#focus-check-order').is_disabled()
        expr.locator('[data-focus-step="2"]').click()
        assert expr.locator('#focus-undo').is_enabled()
        expr.locator('#focus-undo').click()
        expr.locator('[data-focus-step="1"]').click()
        expr.locator('#focus-reset').click()
        for n in range(3):expr.locator(f'[data-focus-step="{n}"]').click()
        assert expr.locator('#focus-check-order').is_enabled()
        expr.locator('#focus-check-order').click()
        assert expr.locator('#focus-feedback').is_visible()
        assert expr.locator('#focus-verdict-title').inner_text()=='Bra jobbat!'
        assert expr.locator('#focus-why').is_visible()
        expr.locator('#focus-next').click()
        for _ in range(2):
            assert expr.locator('#focus-choices [data-focus-choice]').count()>=3
            expr.locator('#focus-choices [data-focus-choice]').first.click()
            expr.locator('#focus-next').click()
        assert expr.locator('#focus-finished').is_visible()
        assert expr.locator('#focus-other-skill').is_visible()
        expr.locator('#focus-other-skill').click()
        assert expr.locator('#view-focus').is_visible()
        expr.locator('#focus-back').click()
        expr.locator('#learning-back').click()
        assert expr.locator('[data-mode="test"]').get_attribute('aria-pressed')=='true', 'Focus modified settings'
        assert expr.locator('[data-count="5"]').get_attribute('aria-pressed')=='true'
        expr.locator('#start').click()
        for _ in range(5):
            expr.locator('.answer-option').first.click()
            assert expr.locator('#feedback-area').is_hidden(), 'Focus practice leaked answer feedback into Testa dig'
        assert expr.locator('#view-results').is_visible()
        assert not errors,errors
        expr.close()

        tiny, errors = make_page(browser, {'width':320, 'height':700})
        tiny.locator('[data-theme-choice="light"]').click()
        tiny.locator('#high-contrast').check()
        open_trail(tiny,'Regnig')
        tiny.locator('[data-focus-skill="picture"][data-focus-id]').last.click()
        assert tiny.locator('#focus-choices .focus-choice-emoji').count()==4
        assert tiny.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'Overflow in 320px focus view'
        tiny.screenshot(path=str(OUT/'v015-latt-bilder-mobil.png'))
        tiny.locator('[data-nav="home"]').click()
        assert tiny.locator('#view-home').is_visible()
        assert not errors,errors
        tiny.close()
        browser.close()
    print('✓ 0.15 browser focus: 3 distinct stories, feedback, independent results, expressions, test integrity, 320px themes')

if __name__=='__main__': main()
