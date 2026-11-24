"""Actual browser journeys for curated expression stories, scoring and answer secrecy."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import shutil
from browser_smoke import make_page

ROOT = Path(__file__).resolve().parents[1]
PREVIEWS=ROOT/'docs'/'previews'
PREVIEWS.mkdir(parents=True, exist_ok=True)


def run():
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':1050,'height':920})
        page.evaluate('Math.random=()=>0.99999')  # deterministic order for the fixture: first expression is hockey.
        page.locator('[data-topic="expressions"]').click()
        page.locator('[data-expression-task="meaning"]').click()
        assert '25 uttryck' in page.locator('#pool-info').inner_text()
        page.locator('[data-count="5"]').click()
        page.locator('#start').click()
        assert page.locator('#question-word').inner_text()=='För en gångs skull'
        assert 'hockeyn' in page.locator('#expression-story').inner_text()
        assert not page.locator('#expression-reveal').is_visible()
        assert page.locator('#answer-options .answer-option').count()==4
        # Screenshot of the real text-only story question
        page.screenshot(path=PREVIEWS/'uttryck-fraga-desktop.png',full_page=True)
        wrong=page.locator('.answer-option').filter(has_text='Pappa kunde inte skjutsa den här gången.')
        assert wrong.count()==1
        wrong.click()
        assert not page.locator('#question-area').is_visible()
        assert page.locator('#expression-reveal').is_visible()
        page.locator('#expression-open').click()
        assert page.locator('#expression-comic .comic-panel').count()==3
        assert 'Nu kunde han skjutsa' in page.locator('#expression-comic').inner_text()
        assert page.locator('#expression-comic .comic-icons').count()==3
        assert page.locator('#expression-comic .comic-icons img, #expression-comic .comic-icon-fallback').count()>=5
        assert 'Något händer den här gången' in page.locator('#explanation-definition').inner_text()
        page.screenshot(path=PREVIEWS/'uttryck-aha-desktop.png',full_page=True)
        assert page.locator('#stat-wrong').inner_text()=='1'
        page.locator('#next').click()
        for _ in range(4):
            page.locator('.answer-option').first.click()
            page.locator('#next').click()
        assert page.locator('#view-results').is_visible()
        assert page.locator('#result-right').inner_text()=='4'
        assert page.locator('#result-wrong').inner_text()=='1'
        page.locator('#change-settings').click()
        page.locator('#review-only').check()
        # Wrong answers also persisted when questions were expressions.
        assert 'redo' in page.locator('#review-info').inner_text()
        assert not errors,errors
        page.close()

        mixed,errors=make_page(browser,{'width':390,'height':844})
        mixed.locator('[data-topic="mixed"]').click()
        mixed.locator('[data-expression-task="meaning"]').click()
        mixed.locator('[data-count="10"]').click()
        mixed.locator('[data-theme-choice="light"]').click()
        mixed.locator('#start').click()
        kind_counts={'word':0,'expression':0}
        for i in range(10):
            kind='expression' if mixed.locator('#expression-scene').is_visible() else 'word'
            kind_counts[kind]+=1
            mixed.locator('.answer-option').first.click()
            assert not mixed.locator('#question-area').is_visible()
            assert mixed.locator('#expression-reveal').is_visible()==(kind=='expression')
            assert mixed.evaluate('document.documentElement.scrollWidth <= window.innerWidth'),f'overflow at question {i+1}'
            mixed.locator('#next').click()
        assert kind_counts=={'word':5,'expression':5},kind_counts
        assert mixed.locator('#view-results').is_visible()
        assert not errors,errors
        mixed.close()

        exam,errors=make_page(browser,{'width':375,'height':812})
        exam.evaluate('Math.random=()=>0.99999')
        exam.locator('[data-topic="expressions"]').click()
        exam.locator('[data-mode="test"]').click()
        exam.locator('[data-level="exam"]').click()
        exam.locator('[data-count="5"]').click()
        exam.locator('#start').click()
        assert exam.locator('.answer-option').count()==5
        for i in range(5):
            exam.locator('.answer-option').first.click()
            assert not exam.locator('#feedback-area').is_visible(), 'Answer or Aha leaked into test mode'
            if i!=4:
                assert not exam.locator('#view-results').is_visible()
        assert exam.locator('#view-results').is_visible()
        assert exam.locator('.review-card .expression-scene-mini').count()==5
        assert exam.locator('.review-card .comic-review').count()==5
        exam.locator('.review-card .comic-review').first.locator('summary').click()
        assert exam.locator('.review-card .comic-review').first.locator('.comic-panel').count()==3
        assert not errors,errors
        exam.close()

        mobile,errors=make_page(browser,{'width':320,'height':740})
        mobile.evaluate('Math.random=()=>0.99999')
        mobile.locator('[data-topic="expressions"]').click()
        mobile.locator('[data-expression-task="meaning"]').click()
        mobile.locator('[data-theme-choice="dark"]').click()
        mobile.locator('[data-count="5"]').click()
        mobile.locator('#start').click()
        assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        mobile.screenshot(path=PREVIEWS/'uttryck-fraga-mobil.png',full_page=True)
        mobile.locator('.answer-option').first.click()
        assert mobile.locator('#expression-reveal').is_visible()
        assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        mobile.screenshot(path=PREVIEWS/'uttryck-aha-mobil.png',full_page=True)
        assert not errors,errors
        mobile.close()

        quick,errors=make_page(browser,{'width':390,'height':844})
        quick.locator('#quick-expressions').click()
        assert quick.locator('#view-play').is_visible()
        assert 'Uttryck' in quick.locator('#play-tag').inner_text()
        assert quick.locator('#stat-progress').inner_text()=='1 / 5'
        assert quick.locator('#question-word').is_visible()
        assert not errors,errors
        quick.close()
        browser.close()
    print('✓ Expression browser journeys: hockey story, Aha panels, 4/1 scoring, mixed, exam privacy, mobile layouts')

if __name__=='__main__':run()
