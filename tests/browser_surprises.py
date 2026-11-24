"""Chromium checks for the optional 25-door discovery book and hidden answer keys.
Uses bundled local Noto PNG bytes – no generated images, no external HTTP.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_smoke import make_page
import base64, json, shutil

ROOT=Path(__file__).resolve().parents[1]
PREVIEWS=ROOT/'docs/previews'
COMICS=json.loads((ROOT/'public/data/comics.json').read_text())

def embed_icons(page):
  embedded={emoji:'data:image/png;base64,'+base64.b64encode((ROOT/'public'/url[2:]).read_bytes()).decode()
            for emoji,url in COMICS['iconPaths'].items()}
  page.evaluate('icons=>Object.assign(window.ORDJAKTEN_COMICS.iconPaths,icons)',embedded)

def test_training(browser):
  page,errors=make_page(browser,{'width':390,'height':844})
  embed_icons(page)
  page.evaluate('Math.random=()=>0.999999')
  page.locator('[data-topic="expressions"]').click()
  page.locator('[data-expression-task="meaning"]').click()
  page.locator('#open-book-home').click()
  assert page.locator('#view-book').is_visible()
  assert page.locator('.book-tile').count()==25
  assert page.locator('.book-tile:disabled').count()==25
  assert page.locator('#book-detail').is_hidden()
  page.locator('#book-start-expressions').click()
  assert page.locator('#question-word').inner_text()=='För en gångs skull'
  assert not page.locator('#expression-reveal').is_visible()
  page.locator('.answer-option').filter(has_text='Pappa kunde inte skjutsa den här gången.').click()
  assert page.locator('#stat-wrong').inner_text()=='1'
  assert page.locator('#expression-reveal').is_visible()
  assert page.locator('#expression-surprise-body').is_hidden()
  assert page.locator('#expression-comic .comic-panel').count()==0
  page.locator('#expression-open').click()
  assert page.locator('#expression-comic .comic-panel').count()==3
  assert page.locator('#expression-bonus [data-mission-answer]').count()==2
  page.wait_for_function('''() => [...document.querySelectorAll('#expression-comic img')].every(i=>i.complete&&i.naturalWidth>0)''')
  assert page.locator('#expression-comic img').count()>0
  page.locator('#expression-bonus [data-mission-answer]').filter(has_text='Leo följer med varje tisdag').click()
  assert page.locator('.bonus-message[data-outcome="wrong"]').is_visible()
  assert page.locator('#stat-wrong').inner_text()=='1', 'Bonus must not alter main result'
  page.locator('#expression-bonus [data-mission-answer]').filter(has_text='Oftast kan Leo inte').click()
  assert 'Du klarade uppdraget' in page.locator('#expression-bonus .bonus-message').inner_text()
  assert page.locator('#stat-right').inner_text()=='0'
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.screenshot(path=PREVIEWS/'v08-lucka-trana-mobil.png',full_page=True)
  page.on('dialog',lambda dialog:dialog.accept())
  page.locator('#leave').click()
  assert page.locator('#view-home').is_visible()
  page.locator('#open-book-home').click()
  assert page.locator('.book-tile:disabled').count()==24
  assert page.locator('.book-tile[data-state="mastered"]').count()==1
  page.locator('.book-tile[data-state="mastered"]').click()
  assert page.locator('#book-detail').is_visible()
  assert page.locator('#book-phrase').inner_text()=='För en gångs skull'
  assert page.locator('#book-comic .comic-panel').count()==3
  assert '1 av 3' in page.locator('#book-bonus .mission-progress').inner_text()
  assert '1 hittade' in page.locator('#book-progress').inner_text()
  assert '1 öppnade' in page.locator('#book-progress').inner_text()
  assert '1 av 75' in page.locator('#book-progress').inner_text()
  page.screenshot(path=PREVIEWS/'v08-luckbok-mobil.png',full_page=True)
  page.locator('#book-go-home').click()
  page.locator('[data-theme-choice="light"]').click()
  page.locator('#open-book-home').click()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert page.locator('#book-detail').is_visible()
  page.screenshot(path=PREVIEWS/'v08-luckbok-ljus-mobil.png',full_page=True)
  assert not errors, errors
  page.close()

def test_exam(browser):
  page,errors=make_page(browser,{'width':1050,'height':860})
  embed_icons(page)
  page.evaluate('Math.random=()=>0.999999')
  page.locator('[data-topic="expressions"]').click()
  page.locator('[data-expression-task="meaning"]').click()
  page.locator('[data-mode="test"]').click()
  page.locator('[data-count="5"]').click()
  page.locator('#start').click()
  assert page.locator('.answer-option').count()==4
  for i in range(5):
    page.evaluate('document.querySelector(".answer-option").click()')
    assert page.locator('#feedback-area').is_hidden()
    assert not page.locator('#expression-reveal').is_visible()
    if i<4: assert page.locator('#view-results').is_hidden()
  assert page.locator('#view-results').is_visible()
  assert page.locator('#review-list details.comic-review').count()==5
  page.locator('.comic-review summary').first.click()
  assert page.locator('.comic-review .bonus-question').first.is_visible()
  page.locator('#results-book').click()
  assert page.locator('.book-tile:disabled').count()==20
  assert page.locator('.book-tile:not(:disabled)').count()==5
  assert page.locator('#book-progress').is_visible()
  page.locator('.book-tile:not(:disabled)').first.click()
  assert page.locator('#book-detail').is_visible()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  page.screenshot(path=PREVIEWS/'v08-luckbok-dator.png',full_page=True)
  assert not errors,errors
  page.close()

def run():
  PREVIEWS.mkdir(exist_ok=True,parents=True)
  with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
    test_training(browser)
    test_exam(browser)
    browser.close()
  print('✓ 25-door book, optional story, new-situation challenge, scoring isolation, test secrecy, mobile themes')

if __name__=='__main__':run()
