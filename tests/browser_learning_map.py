"""0.14 visual learning trail: fresh/played states, accessible paths and theme.

Uses the existing offline HTML/CSS injection test helper. This cannot prove
that localStorage persists after real navigation; see docs QA checklist.
"""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

OUT=Path(__file__).resolve().parents[1]/'docs/previews'

def play_five(page):
    page.locator('[data-count="5"]').click()
    page.locator('#quick-start').click()
    for _ in range(10):
        if page.locator('#view-results').is_visible():
            break
        page.locator('.answer-option').first.click()
        assert page.locator('#feedback-area').is_visible()
        page.locator('#next').click()
    assert page.locator('#view-results').is_visible()


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as playwright:
        browser=playwright.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':1060,'height':900})
        page.locator('#open-learning-home').click()
        assert page.locator('#view-learning').is_visible()
        assert page.locator('#learning-total-seen').inner_text()=='0'
        assert page.locator('#learning-empty').is_visible()
        page.locator('[data-learning-status="all"]').click()
        assert page.locator('.learning-word-card').count()==18
        assert page.locator('#learning-more').is_visible()
        page.locator('#learning-more').click()
        assert page.locator('.learning-word-card').count()==36
        page.locator('#learning-search').fill('grumlig')
        assert page.locator('.learning-word-card').count()==1
        button=page.locator('.learning-word-toggle')
        button.click()
        assert button.get_attribute('aria-expanded')=='true'
        assert page.locator('.learning-word-detail').is_visible()
        assert page.locator('.learning-steps li').count()==4
        assert page.locator('.learning-steps li[data-done="true"]').count()==0
        page.locator('#learning-search').fill('')
        page.locator('#learning-back').click()
        assert page.locator('#view-home').is_visible()
        assert not errors,errors
        page.close()

        child,errors=make_page(browser,{'width':390,'height':844})
        play_five(child)
        assert child.locator('#learning-finale').is_visible()
        child.locator('#open-learning-results').click()
        assert child.locator('#view-learning').is_visible()
        seen=int(child.locator('#learning-total-seen').inner_text())
        assert seen==10,seen # quick start overrides setup to 10
        assert child.locator('.learning-word-card').count()==10
        assert child.locator('.learning-steps li:visible').count()==0 # closed by default
        first=child.locator('.learning-word-toggle').first
        first.click()
        assert first.get_attribute('aria-expanded')=='true'
        assert child.locator('.learning-word-detail:visible').count()==1
        assert child.locator('.learning-steps li:visible').count()==4
        assert child.locator('.learning-steps li[data-done="true"]:visible').count()>=1
        assert child.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'Mobile horizontal overflow'
        child.screenshot(path=str(OUT/'v014-ordstig-detalj-mobil.png'),full_page=False)
        child.evaluate("document.documentElement.style.scrollBehavior='auto'; document.scrollingElement.scrollTop=0")
        child.screenshot(path=str(OUT/'v014-ordstig-mobil-mork.png'),full_page=False)
        child.locator('#learning-back').click()
        child.locator('[data-theme-choice="light"]').click()
        child.locator('#high-contrast').check()
        child.locator('#open-learning-home').click()
        assert child.locator('.learning-word-card').count()==10
        assert child.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'Light-mode overflow'
        child.screenshot(path=str(OUT/'v014-ordstig-mobil-ljus.png'),full_page=False)
        assert not errors,errors
        child.close()

        testpage,errors=make_page(browser,{'width':1000,'height':820})
        testpage.locator('[data-mode="test"]').click()
        testpage.locator('[data-level="medium"]').click()
        testpage.locator('[data-count="5"]').click()
        testpage.locator('#start').click()
        for _ in range(5):
            testpage.locator('.answer-option').first.click()
            assert testpage.locator('#feedback-area').is_hidden()
            assert testpage.locator('#view-learning').is_hidden()
        assert testpage.locator('#view-results').is_visible()
        testpage.locator('#open-learning-results').click()
        testpage.evaluate("window.scrollTo({top:0,behavior:'instant'})")
        testpage.screenshot(path=str(OUT/'v014-ordstig-dator.png'),full_page=False)
        assert int(testpage.locator('#learning-total-seen').inner_text())==5
        testpage.locator('[data-learning-status="all"]').click()
        testpage.locator('#learning-search').fill('för en gångs skull')
        assert testpage.locator('.learning-word-card').count()==1
        testpage.locator('.learning-word-toggle').click()
        assert testpage.locator('.learning-word-detail').is_visible()
        assert not errors,errors
        testpage.close()
        tiny,errors=make_page(browser,{'width':320,'height':710})
        tiny.locator('#open-learning-home').click()
        tiny.locator('[data-learning-status="all"]').click()
        tiny.locator('#learning-search').fill('för en gångs skull')
        tiny.locator('.learning-word-toggle').click()
        assert tiny.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), '320px text overflows'
        assert tiny.locator('.learning-steps li:visible').count()==4
        assert not errors,errors
        tiny.close()
        browser.close()
    print('✓ 0.14 learning map: empty state, 146 entries, learning evidence, 320+ mobile, themes, test concealment')

if __name__=='__main__': main()
