"""Chromium integration: twelve complete adventures with five questions each.

This test uses real DOM click events for the repeated answer loop, while the
separate browser_smoke.py and browser_maps.py exercise actual pointer clicks.
Avoids Playwright scroll/transition waits on every one of sixty answers.
"""
from browser_smoke import make_page
from playwright.sync_api import sync_playwright
import shutil


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=shutil.which('chromium') or None, args=['--no-sandbox'])
        page, errors = make_page(browser, {'width': 390, 'height': 844})
        page.set_default_timeout(8000)
        worlds = page.evaluate('Object.keys(window.OrdjaktenAdventures.WORLDS)')
        assert len(worlds) == 12
        for adventure in worlds:
            print('START',adventure,flush=True)
            page.evaluate('(id)=>document.querySelector(`button[data-adventure="${id}"]`).click()', adventure)
            assert page.locator('#adventure-preview-map svg').get_attribute('data-world') == adventure
            page.evaluate('document.querySelector("[data-count=\'5\']").click()')
            page.evaluate('document.querySelector("#start").click()')
            assert page.locator('#journey-map .map-stop').count() == 4
            assert page.locator('#journey-map svg').get_attribute('data-world') == adventure
            for i in range(5):
                # Use the known verified answer only to test the UI; this is not
                # made visible to the child and never changes the app's scoring.
                page.evaluate('''() => {
                    const word=document.querySelector('#question-word').textContent;
                    const answer=window.ORDJAKTEN_WORDS.words.find(x=>x.word===word).illustration.label;
                    const btn=[...document.querySelectorAll('.answer-option')].find(b=>b.textContent.includes(answer));
                    if(!btn)throw Error('Correct option missing for '+word);
                    btn.click();
                }''')
                assert not page.locator('#question-area').is_visible()
                assert page.locator('#explanation-definition').is_visible()
                assert page.locator('#journey-map .map-reached').count() == [0,1,2,3,4][i]
                assert page.locator('#journey-stops .reached').count() == [0,1,2,3,4][i]
                assert float(page.locator('#journey-map .map-road-done').get_attribute('stroke-dasharray').split()[0]) == (i+1)*20
                assert page.locator('#adventure-milestone').is_visible() == (i != 0)
                page.evaluate('document.querySelector("#next").click()')
            assert page.locator('#view-results').is_visible()
            assert page.locator('#finale-stops').inner_text() == '4 av 4 platser utforskade'
            assert page.locator('#result-right').inner_text() == '5'
            assert page.locator('#result-wrong').inner_text() == '0'
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
            page.evaluate('document.querySelector("#change-settings").click()')
            print('DONE',adventure,flush=True)
        assert not errors, errors
        page.close()
        browser.close()
    print('✓ Browser adventures: 12 complete five-word journeys, map stages, scores and mobile layout')


if __name__ == '__main__':
    main()
