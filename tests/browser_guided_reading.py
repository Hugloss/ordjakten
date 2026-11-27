"""Optional Chromium test: guided reading does not change scoring or leak answers."""
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def main():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,
            executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':375,'height':812})
        page.locator('#quick-contexts').click()
        assert page.locator('#view-play').is_visible()
        story=page.locator('#context-story').text_content().strip()
        assert page.locator('#guided-start').is_visible()
        page.locator('#guided-start').click()
        assert page.locator('#guided-reading').is_visible()
        assert page.locator('#story-reveal').is_hidden()
        assert page.locator('#answer-options').is_hidden()
        pieces=[page.locator('#guided-part').inner_text()]
        while not page.locator('#guided-next').inner_text().startswith('Visa hela'):
            page.locator('#guided-next').click()
            pieces.append(page.locator('#guided-part').inner_text())
        assert ' '.join(pieces)==story
        page.locator('#guided-previous').click()
        assert page.locator('#guided-reading').is_visible()
        page.locator('#guided-full').click()
        assert page.locator('#guided-reading').is_hidden()
        assert page.locator('#context-story').is_visible()
        page.locator('#story-reveal').click()
        assert page.locator('#answer-options').is_visible()
        page.locator('.answer-option').first.click()
        assert page.locator('#feedback-area').is_visible()
        assert page.locator('#reading-launch').is_visible()
        assert not errors,errors
        browser.close()

if __name__=='__main__':
    main()
