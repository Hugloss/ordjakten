"""End-to-end smoke for Ordjakten's child-friendly UX.

Uses the same no-network, in-memory page as browser_smoke.py; no external assets.
"""
from browser_smoke import make_page
from browser_reading_flow import answer_reading
import shutil
from playwright.sync_api import sync_playwright


def answer_correct(page):
    word = page.locator('#question-word').inner_text()
    correct_label = page.evaluate("""word => window.ORDJAKTEN_WORDS.words.find(w => w.word === word).illustration.label""", word)
    page.locator('.answer-option').filter(has_text=correct_label).click()


def main():
    with sync_playwright() as playwright:
        browser=playwright.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page, errors = make_page(browser, {'width':390,'height':844})
        page.locator('[data-companion="owl"]').click()
        assert page.locator('[data-companion="owl"]').get_attribute('aria-pressed') == 'true'
        assert 'Ulla' in page.locator('.hero-companion-message').inner_text()
        page.locator('[data-count="5"]').click()
        page.locator('#start').click()
        assert page.locator('#play-companion-emoji').inner_text() == '🦉'
        assert page.locator('#mission-bar').is_visible()
        for i in range(3):
            answer_correct(page)
            assert page.locator('#feedback-area').is_visible()
            assert not page.locator('#question-area').is_visible()
            assert page.locator('#feedback-message').inner_text()
            assert page.locator('#feedback-reward').is_visible()
            assert page.locator('#explanation-definition').is_visible()
            assert page.locator('#play-stars').inner_text() == f'⭐ {i+1} av 5 stjärnor'
            answer_reading(page)
            page.locator('#next').click()
        assert not page.locator('#play-streak').is_visible()
        word=page.locator('#question-word').inner_text()
        right=page.evaluate("""word => window.ORDJAKTEN_WORDS.words.find(w=>w.word===word).illustration.label""",word)
        page.locator('.answer-option').filter(has_not_text=right).first.click()
        assert page.locator('#feedback-title').inner_text()
        assert page.locator('#stat-wrong').inner_text() == '1'
        answer_reading(page)
        assert page.locator('#play-stars').inner_text() == '⭐ 4 av 5 stjärnor'
        page.locator('#next').click()
        answer_correct(page)
        answer_reading(page)
        page.locator('#next').click()
        assert page.locator('#view-results').is_visible()
        assert page.locator('#result-right').inner_text() == '4'
        assert page.locator('#result-wrong').inner_text() == '1'
        assert page.locator('#rewards-stars').inner_text() == '⭐ 5 av 5 stjärnor i din rad'
        assert 'Alla stjärnor' in page.locator('#rewards-badges').inner_text()
        assert 'Övade vidare' in page.locator('#rewards-badges').inner_text()
        assert not errors, errors
        page.close()

        # No live feedback or star count during 'Testa dig'.
        test, errors=make_page(browser,{'width':320,'height':750})
        test.locator('[data-mode="test"]').click()
        test.locator('[data-count="5"]').click()
        test.locator('#start').click()
        assert not test.locator('#mission-bar').is_visible()
        assert test.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        test.locator('.answer-option').first.click()
        assert not test.locator('#feedback-area').is_visible()
        assert test.locator('#stat-right').inner_text() == '1'  # Counts completed, not correctness.
        assert not errors, errors
        test.close()
        quick, errors=make_page(browser,{'width':390,'height':844})
        quick.locator('#quick-start').click()
        assert quick.locator('#view-play').is_visible()
        assert quick.locator('#stat-progress').inner_text() == '1 / 5'
        assert quick.locator('#play-tag').inner_text().startswith('📚 Träna')
        assert quick.locator('#clock-stat').is_hidden()
        assert not errors, errors
        quick.close()
        browser.close()
    print('✓ Browser playful: companion, 3-answer streak, 4 stars, feedback, badges, test privacy')


if __name__ == '__main__':
    main()
