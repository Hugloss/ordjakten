"""Aha transfer evidence is saved without changing the main question grade.

Uses an injected localStorage shim because this runner cannot navigate to a real
localhost origin. It does NOT claim to test a real-origin reload or offline mode.
"""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page


def main(browser):
    page, errors = make_page(browser, {'width': 360, 'height': 800}, storage_seed={})
    page.locator('#quick-contexts').click()
    assert page.locator('#context-story').is_visible()
    assert page.locator('#question-word').is_hidden()
    page.locator('#story-reveal').click()
    word_id, word = page.evaluate('''() => {
      const text=document.querySelector('#context-story').textContent;
      const record=window.ORDJAKTEN_CONTEXTS.wordContexts.find(r=>r.scenes.some(s=>s.text===text));
      const word=window.ORDJAKTEN_WORDS.words.find(w=>w.id===record.id);
      return [word.id,word.word];
    }''')
    page.locator('.answer-option').filter(has_text=word).click()
    assert page.locator('#next').is_hidden()
    page.locator('#reading-start').click()
    correct = page.evaluate('''() => {
      const text=document.querySelector('#explanation-word').textContent;
      const w=window.ORDJAKTEN_WORDS.words.find(w=>w.word===text);
      const scenes=window.ORDJAKTEN_CONTEXTS.wordContexts.find(r=>r.id===w.id).scenes;
      return [...document.querySelectorAll('.reading-option')].findIndex(b=>
        scenes.some(s=>b.textContent.includes(s.text)));
    }''')
    assert correct >= 0
    page.locator('.reading-option').nth(next(i for i in range(3) if i!=correct)).click()
    assert page.locator('#next').is_hidden()
    page.locator('#reading-start').click()
    correct = page.evaluate('''() => {
      const text=document.querySelector('#explanation-word').textContent;
      const w=window.ORDJAKTEN_WORDS.words.find(w=>w.word===text);
      const scenes=window.ORDJAKTEN_CONTEXTS.wordContexts.find(r=>r.id===w.id).scenes;
      return [...document.querySelectorAll('.reading-option')].findIndex(b=>
        scenes.some(s=>b.textContent.includes(s.text)));
    }''')
    page.locator('.reading-option').nth(next(i for i in range(3) if i!=correct)).click()
    saved_json=page.evaluate("localStorage.getItem('ordjakten-v1')")
    assert saved_json, 'Guided Aha result must persist even before round is finished'
    saved=json.loads(saved_json)
    assert saved['readingProgress'][word_id]['transfer']['supported']==1
    assert page.locator('#next').is_visible()
    assert not errors, errors
    page.close()

    # Simulates a new page reading the saved state. It is NOT a localhost reload.
    replay, errors=make_page(browser, {'width': 360, 'height': 800},
                             storage_seed={'ordjakten-v1': saved_json})
    assert replay.evaluate('''(id) => window.OrdjaktenReading.needsReview(
      window.OrdjaktenReading.sanitizeProgress(JSON.parse(localStorage.getItem('ordjakten-v1')).readingProgress),id,'transfer')''',word_id)
    assert not errors, errors
    replay.close()

    exam, errors=make_page(browser, {'width': 390, 'height': 800}, storage_seed={})
    exam.locator('[data-mode="test"]').click()
    exam.locator('[data-topic="expressions"]').click()
    exam.locator('[data-expression-task="meaning"]').click()
    exam.locator('[data-count="5"]').click()
    exam.locator('#start').click()
    for _ in range(5):
        exam.locator('#story-reveal').click()
        exam.locator('.answer-option').first.click()
    assert exam.locator('#view-results').is_visible()
    raw=json.loads(exam.evaluate("localStorage.getItem('ordjakten-v1')"))
    assert not raw['readingProgress'], 'Scored tests must not change Aha learning history'
    assert not errors, errors
    exam.close()

if __name__=='__main__':
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path=shutil.which('chromium') or None, args=['--no-sandbox'])
        main(browser)
        browser.close()
    print('✓ Aha support saved, replayed, kept separate from scores and test mode')
