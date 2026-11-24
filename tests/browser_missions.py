"""Browser checks for v0.9: mixed task types, order interaction and 3 badges/door.
No HTTP access required: loads JS/CSS directly into Chromium like browser_smoke.
"""
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

PREVIEWS=Path(__file__).resolve().parents[1]/'docs/previews'

def launch(browser):
    page,errors=make_page(browser,{'width':390,'height':844})
    assert page.locator('#view-home').is_visible(),errors
    assert page.locator('#expression-task-settings').is_hidden()
    page.locator('[data-topic="expressions"]').click()
    assert page.locator('#expression-task-settings').is_visible()
    return page,errors

def start(page,task='order',mode='train'):
    page.locator(f'[data-expression-task="{task}"]').click()
    page.locator('[data-mode="'+mode+'"]').click()
    page.locator('[data-count="5"]').click()
    page.locator('#start').click()
    assert page.locator('#view-play').is_visible()

def select_order(page,container,correct=True):
    indexes=(0,1,2) if correct else (2,0,1)
    for key in indexes:
        page.locator(container).locator(f'[data-order-step="{key}"]').click()

def test_main_order(browser):
    page,errors=launch(browser)
    page.locator('[data-theme-choice="light"]').click()
    page.locator('#high-contrast').check()
    PREVIEWS.mkdir(exist_ok=True,parents=True)
    page.locator('#expression-task-settings').screenshot(path=PREVIEWS/'v09-valj-uppdrag-mobil.png')
    start(page,'order','train')
    assert page.locator('#order-area').is_visible()
    assert page.locator('#answer-options').is_hidden()
    assert page.locator('#order-submit').is_disabled()
    page.locator('#order-area').screenshot(path=PREVIEWS/'v09-ordna-fraga-mobil.png')
    select_order(page,'#order-choices',False)
    assert page.locator('#order-selection li').count()==3
    page.locator('#order-undo').click()
    assert page.locator('#order-selection li').count()==2
    page.locator('#order-reset').click()
    assert page.locator('#order-selection li').count()==0
    select_order(page,'#order-choices',True)
    assert page.locator('#order-submit').is_enabled()
    page.locator('#order-submit').click()
    assert page.locator('#stat-right').inner_text()=='1'
    assert page.locator('#question-area').is_hidden()
    assert page.locator('#feedback-area').is_visible()
    assert not errors,errors
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.screenshot(path=PREVIEWS/'v09-ordna-feedback-mobil.png',full_page=True)
    page.close()

def test_sentence(browser):
    page,errors=launch(browser)
    start(page,'sentence','train')
    assert page.locator('#order-area').is_hidden()
    assert page.locator('.answer-option').count()==3
    assert 'VILKEN MENING' in page.locator('#question-prompt').inner_text()
    page.locator('.answer-option').first.click()
    assert page.locator('#feedback-area').is_visible()
    assert not errors,errors
    page.close()

def test_test_mode_and_book(browser):
    page,errors=launch(browser)
    start(page,'order','test')
    for index in range(5):
        select_order(page,'#order-choices',correct=index!=0)
        page.locator('#order-submit').click()
        assert page.locator('#feedback-area').is_hidden(), 'No test answer should leak before end'
        if index<4: assert page.locator('#view-results').is_hidden()
    assert page.locator('#view-results').is_visible()
    assert page.locator('#result-right').inner_text()=='4'
    assert page.locator('#result-wrong').inner_text()=='1'
    assert page.locator('.review-card').count()==5
    assert page.locator('.review-card .mission-done').count()==5
    page.locator('#results-book').click()
    assert page.locator('.book-tile:not(:disabled)').count()==5
    page.locator('.book-tile:not(:disabled)').first.click()
    wrap=page.locator('#book-bonus .bonus-question')
    assert wrap.is_visible()
    assert wrap.locator('[data-mission-choice]').count()==3
    # Choose each challenge manually; all three are independent of quiz scoring.
    wrap.locator('[data-mission-choice="meaning"]').click()
    wrap=page.locator('#book-bonus .bonus-question')
    right_index=wrap.evaluate('''node=>window.ORDJAKTEN_SURPRISES.challenges.find(c=>c.id===node.dataset.expressionId).options.findIndex(x=>x.correct)''')
    wrap.locator(f'[data-mission-answer="{right_index}"]').click()
    assert '1 av 3' in wrap.locator('.mission-progress').inner_text()
    wrap.locator('[data-mission-choice="sentence"]').click()
    wrap=page.locator('#book-bonus .bonus-question')
    right_index=wrap.evaluate('''node=>window.ORDJAKTEN_MISSIONS.missions.find(c=>c.id===node.dataset.expressionId).sentences.findIndex(x=>x.correct)''')
    wrap.locator(f'[data-mission-sentence="{right_index}"]').click()
    assert '2 av 3' in wrap.locator('.mission-progress').inner_text()
    wrap.locator('[data-mission-choice="order"]').click()
    wrap=page.locator('#book-bonus .bonus-question')
    for i in (0,1,2):
        wrap.locator(f'[data-mission-step="{i}"]').click()
    wrap.locator('[data-mission-check]').click()
    assert '3 av 3' in wrap.locator('.mission-progress').inner_text()
    assert '3 av 75' in page.locator('#book-progress').inner_text()
    assert page.locator('.book-tile[data-state="mastered"]').count()==1
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    assert page.locator('#result-right').inner_text()=='4'
    assert page.locator('#result-wrong').inner_text()=='1'
    assert not errors,errors
    page.screenshot(path=PREVIEWS/'v09-tre-uppdrag-mobil.png',full_page=True)
    page.close()

def run():
    with sync_playwright() as playwright:
        browser=playwright.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        test_main_order(browser)
        test_sentence(browser)
        test_test_mode_and_book(browser)
        browser.close()
    print('✓ Three task modes, sentence choice, order undo/reset, test secrecy, 3/3 book progress, mobile contrast')

if __name__=='__main__':run()
