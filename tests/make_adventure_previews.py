"""Optional helper: regenerate review screenshots; not part of the deployed site."""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

HERE=Path(__file__).resolve().parents[1]/'docs'/'previews'
HERE.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True, executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
    page,errors=make_page(browser,{'width':1100,'height':850})
    page.locator('.adventure-setup').screenshot(path=str(HERE/'valj-aventyr-desktop.png'))
    page.locator('[data-adventure="space"]'.replace('[data-adventure','button[data-adventure')).click()
    page.locator('.adventure-setup').screenshot(path=str(HERE/'valj-rymdaventyr.png'))
    page.locator('[data-count="5"]').click()
    page.locator('#start').click()
    page.locator('#adventure-journey').screenshot(path=str(HERE/'rymdkarta-start.png'))
    for i in range(3):
        w=page.locator('#question-word').inner_text()
        label=page.evaluate('w=>window.ORDJAKTEN_WORDS.words.find(e=>e.word===w).illustration.label',w)
        page.locator('.answer-option').filter(has_text=label).click()
        if i==2: page.locator('#adventure-milestone').screenshot(path=str(HERE/'hittad-plats.png'))
        page.locator('#next').click()
    page.locator('#adventure-journey').screenshot(path=str(HERE/'rymdkarta-halvags.png'))
    page.close()
    mob,errors2=make_page(browser,{'width':390,'height':844})
    mob.locator('.adventure-setup').screenshot(path=str(HERE/'valj-aventyr-mobil.png'))
    mob.locator('button[data-adventure="castle"]').click()
    mob.locator('#quick-start').click()
    mob.locator('#adventure-journey').screenshot(path=str(HERE/'drakslottet-karta-mobil.png'))
    assert not errors and not errors2,(errors,errors2)
    mob.close()
    browser.close()
print('Created',len(list(HERE.glob('*aventyr*'))),'theme previews and scene shots')
