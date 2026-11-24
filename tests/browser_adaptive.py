"""0.13: adaptive learning preferences, child-facing feedback and exam fairness.

Static-injection browser smoke: saved storage across reloads remains a manual check.
"""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

OUT = Path(__file__).resolve().parents[1] / 'docs/previews'

def main():
    OUT.mkdir(exist_ok=True, parents=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=shutil.which('chromium') or None, args=['--no-sandbox'])
        page, errors = make_page(browser, {'width':390,'height':844})
        page.set_default_timeout(8000)
        assert page.locator('#adaptive-settings').is_visible()
        assert page.locator('#adaptive-practice').is_checked()
        page.locator('[data-level="medium"]').click()
        page.locator('[data-count="5"]').click()
        page.locator('#start').click()
        assert page.locator('#view-play').is_visible()
        assert page.locator('.answer-option').count()==4
        assert not page.locator('#adaptive-feedback').is_visible()
        page.locator('#question-area').screenshot(path=str(OUT/'v013-fraga-mobil.png'))
        for n in range(5):
            page.locator('.answer-option').first.click()
            assert page.locator('#feedback-area').is_visible()
            # Reading comes before the secondary skill message, not after.
            assert page.locator('#adaptive-feedback').is_hidden()
            page.locator('#reading-start').click()
            page.locator('.reading-option').first.click()
            if page.locator('#next').is_hidden():
                page.locator('#reading-start').click()
                page.locator('.reading-option').first.click()
            assert page.locator('#adaptive-feedback').is_visible()
            assert page.locator('#question-area').is_hidden()
            if n==0:
                page.locator('#feedback-area').screenshot(path=str(OUT/'v013-feedback-mobil.png'))
            page.locator('#next').click()
        assert page.locator('#view-results').is_visible()
        assert page.locator('#adaptive-results').is_visible()
        assert 'övningsmoment' in page.locator('#adaptive-results-message').inner_text()
        assert int(page.locator('#result-right').inner_text()) + int(page.locator('#result-wrong').inner_text()) == 5
        page.locator('#change-settings').click()
        assert 'Du har provat' in page.locator('#adaptive-home-summary').inner_text()
        page.locator('#adaptive-practice').uncheck()
        page.locator('#start').click()
        page.locator('.answer-option').first.click()
        assert page.locator('#adaptive-feedback').is_hidden(), 'User choice to turn adaptation off must work'
        page.on('dialog', lambda dialog: dialog.accept())
        page.locator('#leave').click()
        # Accepted confirmation returns to home; test mode must never reveal skills or answers.
        page.locator('[data-mode="test"]').click()
        assert page.locator('#adaptive-settings').is_hidden()
        page.locator('[data-count="5"]').click()
        page.locator('#start').click()
        for _ in range(5):
            if page.locator('#story-reveal').is_visible():
                page.locator('#story-reveal').click()
            page.locator('.answer-option').first.click()
            assert page.locator('#adaptive-feedback').is_hidden()
            assert page.locator('#feedback-area').is_hidden()
        assert page.locator('#view-results').is_visible()
        assert page.locator('#adaptive-results').is_hidden()
        assert not errors, errors
        page.close()
        browser.close()
    print('✓ Adaptive browser: preferences, five-question train session, feedback, opt-out, test-mode privacy, mobile')

if __name__=='__main__': main()
