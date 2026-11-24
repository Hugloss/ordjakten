"""Fast Chromium checks for the SVG map layer across all twelve worlds."""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

ROOT = Path(__file__).resolve().parents[1]
PREVIEWS = ROOT / 'docs' / 'previews'


def run():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':1040,'height':800})
        page.set_default_timeout(8000)
        assert page.locator('#adventure-preview-map svg').count()==1
        worlds=page.evaluate('Object.keys(window.OrdjaktenAdventures.WORLDS)')
        assert len(worlds)==12
        for world in worlds:
            page.evaluate('(w)=>document.querySelector(`button[data-adventure="${w}"]`).click()',world)
            assert page.locator('#adventure-preview-map svg').get_attribute('data-world')==world
            assert page.locator('#adventure-preview-map .map-stop').count()==4
            assert page.locator('#adventure-preview-map .map-road').count()==1
        assert page.locator('#adventure-preview-map svg').get_attribute('aria-label').startswith('Musikscenen.')
        page.locator('button[data-adventure="pirate"]').click()
        page.locator('[data-count="5"]').click()
        page.locator('#start').click()
        assert page.locator('#journey-map svg').get_attribute('data-world')=='pirate'
        initial_svg=page.evaluate('document.querySelector("#journey-map svg")')
        assert page.locator('#journey-map .map-player').get_attribute('transform').startswith('translate(')
        start_position=page.locator('#journey-map .map-player').get_attribute('transform')
        # Real pointer click and then visual progress. No right/wrong information from the map.
        page.locator('.answer-option').first.click()
        assert page.locator('#journey-map .map-road-done').get_attribute('stroke-dasharray')=='20.00 100'
        assert page.locator('#journey-map .map-player').get_attribute('transform')!=start_position
        assert page.locator('#journey-map .map-stop.map-reached').count()==0
        assert page.locator('#explanation-definition').is_visible()
        assert not page.locator('#question-area').is_visible()
        assert not errors,errors
        page.close()

        mobile,errors=make_page(browser,{'width':375,'height':812})
        mobile.locator('button[data-adventure="unicorn"]').click()
        mobile.locator('[data-theme-choice="light"]').click()
        assert mobile.locator('#adventure-preview-map svg').get_attribute('data-world')=='unicorn'
        assert mobile.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
        mobile.screenshot(path=PREVIEWS/'ny-karta-valj-varld-mobil.png',full_page=True)
        mobile.locator('[data-count="5"]').click()
        mobile.locator('#start').click()
        assert mobile.locator('#journey-map svg').get_attribute('data-world')=='unicorn'
        assert mobile.locator('#journey-stops li').count()==4
        assert mobile.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
        mobile.screenshot(path=PREVIEWS/'enhorning-karta-mobil.png',full_page=True)
        assert not errors,errors
        mobile.close()

        test,errors=make_page(browser,{'width':390,'height':844})
        test.locator('button[data-adventure="space"]').click()
        test.locator('[data-mode="test"]').click()
        test.locator('[data-count="5"]').click()
        test.locator('#start').click()
        test.locator('.answer-option').first.click()
        assert not test.locator('#feedback-area').is_visible()
        assert not test.locator('#adventure-milestone').is_visible()
        assert test.locator('#stat-right').inner_text()=='1', 'test mode reveals only number answered'
        assert test.locator('#journey-map .map-road-done').get_attribute('stroke-dasharray')=='20.00 100'
        assert not errors,errors
        test.close()
        browser.close()
    print('✓ SVG maps: 12 themes previewed; desktop progress; mobile layout; test-mode privacy')


if __name__=='__main__':
    run()
