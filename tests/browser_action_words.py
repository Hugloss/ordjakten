"""Optional real-browser regression for ordinary semantic training."""
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page
from browser_question_play import drag

def force_question(page):
    page.evaluate("""() => {
      const E=window.OrdjaktenEngine,bank=window.ORDJAKTEN_WORDS;
      E.generateRound=()=>[E.makeQuestion(bank.words.find(w=>w.id==='sv-0025'),
        bank,window.ORDJAKTEN_CURATION,'medium',()=>.4)];
    }""")

def main(browser):
    page,errors=make_page(browser,{"width":1100,"height":1000})
    force_question(page)
    page.locator('[data-level="medium"]').click()
    page.locator('#start').click()
    assert page.locator('#quest-action-prompt').is_visible()
    assert page.locator('#quest-action-art').get_attribute('data-action')=='stretch'
    assert page.locator('#quest-action-art .action-rubber').is_hidden()
    answer=page.locator('.answer-option').filter(has_text='Gummiband')
    drag(page,answer.locator('.quest-drag-grip'),page.locator('#question-portal'))
    assert page.locator('#feedback-area').is_visible()
    assert page.locator('#stat-right').text_content()=='1'
    assert page.locator('#quest-action-solution-art .action-rubber').is_visible()
    assert page.locator('#quest-action-experiment').is_visible()
    before=page.locator('#stat-right').text_content()
    page.locator('#quest-action-reset').click()
    assert page.locator('#quest-action-range').input_value()=='0'
    page.locator('#quest-action-step').click()
    assert page.locator('#quest-action-range').input_value()=='25'
    page.locator('#quest-action-range').focus()
    page.keyboard.press('End')
    assert page.locator('#quest-action-range').input_value()=='100'
    art=page.locator('#quest-action-solution-art')
    art.scroll_into_view_if_needed()
    box=art.bounding_box()
    page.mouse.move(box['x']+box['width']*.75,box['y']+box['height']*.5)
    page.mouse.down()
    page.mouse.move(box['x']+box['width']*.25,box['y']+box['height']*.5,steps=8)
    page.mouse.up()
    assert 20<=int(page.locator('#quest-action-range').input_value())<=30
    assert page.locator('#stat-right').text_content()==before
    assert page.locator('#next').is_hidden()
    for _ in range(2):
        page.locator('#reading-start').click()
        page.locator('#reading-options button').first.click()
        if page.locator('#next').is_visible(): break
    assert page.locator('#next').is_visible()
    page.locator('#next').click()
    assert page.locator('#view-results').is_visible()
    assert page.locator('#result-right').inner_text()=='1'
    assert not errors,errors
    page.close()
    page,errors=make_page(browser,{"width":390,"height":800})
    force_question(page)
    page.locator('[data-mode="test"]').click()
    page.locator('[data-level="medium"]').click()
    page.locator('#start').click()
    assert page.locator('#quest-action-prompt').is_hidden()
    assert page.locator('#quest-action-art').is_hidden()
    assert page.locator('.answer-option').count()==4
    page.locator('.answer-option').first.click()
    assert page.locator('#view-results').is_visible()
    assert page.locator('#quest-action-solution').is_hidden()
    assert page.locator('#quest-action-experiment').is_hidden()
    assert not errors,errors
    page.close()

if __name__=='__main__':
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        main(browser)
        browser.close()
    print('✓ semantic actions, original score, Aha gate and test isolation')
