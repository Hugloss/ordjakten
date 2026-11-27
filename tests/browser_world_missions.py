"""Optional browser regression for interactive world chapters and earned keepsakes."""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def main(browser):
    seed={"settings":{"adventure":"forest"}}
    page, errors=make_page(browser,{"width":390,"height":800},
                           storage_seed={"ordjakten-v1":json.dumps(seed)})
    page.locator('#story-home .mission-place-button').first.click()
    assert page.locator('#view-world-mission').is_visible()
    assert 'Ett prassel' in page.locator('#world-mission-title').inner_text()
    assert page.locator('#world-mission-options button').count()==3
    page.locator('[data-mission-action="1"]').click()
    assert page.locator('#world-mission-hint').is_visible()
    page.locator('[data-mission-action="0"]').click()
    assert page.locator('#world-mission-explanation').is_visible()
    assert 'Prasslig' in page.locator('#world-mission-definition').inner_text()
    page.locator('#world-mission-finish').click()
    assert page.locator('#world-mission-ending').is_visible()
    assert 'Stiglövet' in page.locator('#world-mission-mark').inner_text()
    stored=lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    first=stored()
    assert first['storyProgress']=={'forest':1}
    assert not first['results'] and not first['skillProgress']
    assert not first['practiceBalance'] and not first['adventureChallenge']
    page.locator('#world-mission-next').click()
    assert 'Svamparnas' in page.locator('#world-mission-title').inner_text()
    page.locator('#world-mission-reveal').click()
    assert stored()==first
    page.locator('#world-mission-finish').click()
    assert stored()['storyProgress']=={'forest':2}
    page.locator('#world-mission-map .story-place[data-state=visited] button').first.click()
    page.locator('#world-mission-reveal').click()
    page.locator('#world-mission-finish').click()
    assert page.locator('#world-mission-earned').is_hidden()
    assert stored()['storyProgress']=={'forest':2}
    page.locator('#world-mission-map .story-place[data-state=next] button').click()
    page.locator('#world-mission-reveal').click()
    page.locator('#world-mission-finish').click()
    assert stored()['storyProgress']=={'forest':3}
    page.locator('#world-mission-decorate').click()
    assert page.locator('#view-camp').is_visible()
    assert page.locator('[data-camp-item="mark-forest-2"]').get_attribute('aria-pressed')=='true'
    page.locator('[data-camp-slot="1"]').click()
    assert stored()['campLayout']['slots'][1]=='mark-forest-2'
    assert not stored()['results'] and not stored()['skillProgress']
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    assert not errors,errors
    page.close()

if __name__=='__main__':
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        main(browser)
        browser.close()
    print('✓ world mission actions, hint, ending, replay and camp decoration')
