"""End-to-end Ordjakten 0.10 miniquest checks with no Internet or new images."""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

PREVIEWS=Path(__file__).resolve().parents[1]/'docs/previews'

def answer_picture(page,correct):
    word=page.locator('#question-word').inner_text()
    if 'VILKET ORD' in page.locator('#question-prompt').inner_text():
        label=page.evaluate('''stem => window.ORDJAKTEN_WORDS.words.find(w=>
            (window.ORDJAKTEN_CURATION.reviewClues?.[w.id] || w.definition)===stem).word''', word)
    else:
        label=page.evaluate('''word => window.ORDJAKTEN_WORDS.words.find(w=>w.word===word).illustration.label''', word)
    options=page.locator('.answer-option')
    for i in range(options.count()):
        text=options.nth(i).inner_text()
        if (label in text)==correct:
            options.nth(i).click()
            return
    raise AssertionError('No suitable picture alternative for '+word)

def complete_story(page):
    tasks=[]
    for i in range(5):
        if page.locator('#order-area').is_visible():
            tasks.append('order')
            for j in (0,1,2):page.locator(f'#order-choices [data-order-step="{j}"]').click()
            page.locator('#order-submit').click()
        else:
            task='sentence' if 'VILKEN MENING' in page.locator('#question-prompt').inner_text() else 'meaning'
            tasks.append(task)
            page.locator('.answer-option').first.click()
        assert page.locator('#feedback-area').is_visible()
        assert page.locator('#quest-progress-count').inner_text()==f'{i+1} / 5'
        if i<4:page.locator('#next').click()
    page.locator('#next').click()
    assert len(set(tasks))==3, tasks

def test_flow(browser):
    page,errors=make_page(browser,{'width':320,'height':760})
    page.locator('[data-theme-choice="light"]').click()
    page.locator('#high-contrast').check()
    assert page.locator('#quest-home-buttons .quest-card').count()==3
    assert page.locator('#quest-home-buttons [data-start-quest="comeback"]').is_disabled()
    PREVIEWS.mkdir(parents=True,exist_ok=True)
    page.locator('.quest-shelf').screenshot(path=PREVIEWS/'v010-uppdrag-mobil.png')
    page.locator('#quest-home-buttons [data-start-quest="scout"]').click()
    assert page.locator('#view-play').is_visible()
    assert page.locator('#quest-progress').is_visible()
    assert page.locator('#quest-progress-count').inner_text()=='0 / 5'
    assert page.locator('#clock-stat').is_hidden()
    answer_picture(page,False)
    for i in range(4):
        assert page.locator('#feedback-area').is_visible()
        page.locator('#next').click()
        answer_picture(page,True)
    assert page.locator('#quest-progress-count').inner_text()=='5 / 5'
    page.locator('#next').click()
    assert page.locator('#view-results').is_visible()
    assert page.locator('#result-wrong').inner_text()=='1'
    assert 'Uppdraget är klart!' in page.locator('#quest-finale-title').inner_text()
    assert page.locator('#quest-result-buttons [data-start-quest="comeback"]').is_enabled()
    page.locator('#quest-finale').screenshot(path=PREVIEWS/'v010-uppdrag-klart-mobil.png')
    page.locator('.next-steps').screenshot(path=PREVIEWS/'v010-nasta-steg-mobil.png')
    page.locator('#quest-result-buttons [data-start-quest="comeback"]').click()
    assert page.locator('#view-play').is_visible()
    assert 'Nytt försök' in page.locator('#quest-progress-title').inner_text()
    answer_picture(page,True)
    assert page.locator('#quest-progress-count').inner_text()=='1 / 1'
    page.locator('#next').click()
    assert page.locator('#view-results').is_visible()
    assert page.locator('#result-right').inner_text()=='1'
    assert page.locator('#quest-finale-title').inner_text()=='Uppdraget är klart!'
    assert page.locator('#quest-result-buttons [data-start-quest="comeback"]').is_disabled()
    page.locator('#quest-result-buttons [data-start-quest="stories"]').click()
    assert page.locator('#view-play').is_visible()
    complete_story(page)
    assert page.locator('#quest-finale-title').inner_text()=='Uppdraget är klart!'
    page.locator('#change-settings').click()
    assert '1 avklarat uppdrag' in page.locator('#quest-count-scout').inner_text()
    assert '1 avklarat uppdrag' in page.locator('#quest-count-stories').inner_text()
    assert '1 avklarat uppdrag' in page.locator('#quest-count-comeback').inner_text()
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    # Erasing all history must also erase the separate miniquest badges.
    page.locator('[data-nav="history"]').click()
    page.once('dialog',lambda dialog:dialog.accept())
    page.locator('#clear-history').click()
    page.locator('[data-nav="home"]').click()
    assert '0 avklarade uppdrag' in page.locator('#quest-count-scout').inner_text()
    assert page.locator('#quest-home-buttons [data-start-quest="comeback"]').is_disabled()
    assert not errors, errors
    page.close()

def test_test_privacy(browser):
    page,errors=make_page(browser,{'width':960,'height':800})
    page.locator('[data-mode="test"]').click()
    page.locator('[data-count="5"]').click()
    page.locator('#start').click()
    assert page.locator('#quest-progress').is_hidden()
    page.locator('.answer-option').first.click()
    assert page.locator('#feedback-area').is_hidden()
    assert page.locator('#quest-finale').is_hidden()
    assert page.locator('#stat-right').inner_text()=='1'
    assert not errors, errors
    page.close()

def main():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        test_flow(browser)
        test_test_privacy(browser)
        browser.close()
    print('✓ Quest browser: scout, comeback, stories, result choices, mobile themes and test secrecy')

if __name__=='__main__':main()
