"""Child usability regression: read story, choose, read explanation, check understanding."""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

ROOT = Path(__file__).resolve().parents[1]
PREVIEWS=ROOT/'docs'/'previews'

def answer_reading(page):
    assert page.locator('#reading-launch').is_visible()
    assert page.locator('#reading-check').is_hidden()
    assert page.locator('#next').is_hidden()
    page.locator('#reading-start').click()
    assert page.locator('#reading-check').is_visible()
    assert page.locator('.reading-option').count()==3
    assert page.locator('#next').is_hidden(), 'Next must not appear before comprehension check'
    # The options themselves are not marked as correct in the DOM: the user
    # must choose. In the browser test, compare with curated question text.
    prompt=page.locator('#reading-check-title').inner_text()
    labels=page.locator('.reading-option').all_inner_texts()
    if 'Vilken NY situation' in prompt:
        challenge=page.evaluate('''() => window.ORDJAKTEN_SURPRISES.challenges.find(x=>
          document.querySelector('#reading-check-title').textContent.includes(
            window.ORDJAKTEN_EXPRESSIONS.expressions.find(e=>e.id===x.id).phrase))''')
        right=next(o['label'] for o in challenge['options'] if o['correct'])
    elif 'Vilket svar följer instruktionen' in prompt:
        raw_answers=page.evaluate('''() => {
          const phrase=document.querySelector('#explanation-word').textContent;
          const entry=window.ORDJAKTEN_EXPRESSIONS.expressions.find(e=>e.phrase===phrase);
          const challenge=window.ORDJAKTEN_SURPRISES.challenges.find(c=>c.id===entry.id);
          const mission=window.ORDJAKTEN_MISSIONS.missions.find(m=>m.id===entry.id);
          return [...challenge.options,...mission.sentences]
            .filter(option=>option.correct).map(option=>option.label);
        }''')
        matching=[label for label in raw_answers if label.split('” – ',1)[0]+'”' in prompt]
        assert len(matching)==1, (prompt,raw_answers)
        right=matching[0].split('” – ',1)[1]
    elif 'Vilken ANNAN berättelse' in prompt:
        records=page.evaluate('window.ORDJAKTEN_CONTEXTS.wordContexts')
        righttexts={s['text'] for r in records for s in r['scenes']
                    if r['id'] == page.evaluate('''() => {
                      const title=document.querySelector('#reading-check-title').textContent;
                      return window.ORDJAKTEN_WORDS.words.find(w=>title.includes('”'+w.word+'”'))?.id;
                    }''')}
        right=next(label.split('\n',1)[-1].strip() for label in labels if label.split('\n',1)[-1].strip() in righttexts)
    else:
        definition=page.locator('#explanation-definition').inner_text()
        right=definition
    bad=[i for i,t in enumerate(labels) if right not in t]
    if bad:
        page.locator('.reading-option').nth(bad[0]).click()
        assert page.locator('#next').is_hidden()
        assert page.locator('#reading-check').is_hidden()
        assert page.locator('.explanation').is_visible()
        page.locator('#reading-launch').is_visible()
        page.locator('#reading-start').click()
        labels=page.locator('.reading-option').all_inner_texts()
    good=[i for i,t in enumerate(labels) if right in t]
    assert len(good)==1, (prompt,right,labels)
    page.locator('.reading-option').nth(good[0]).click()
    assert page.locator('#reading-check').get_attribute('data-complete')=='true'
    assert page.locator('#reading-why').is_visible()
    assert page.locator('#next').is_visible()

def context_mobile(browser):
    page,errors=make_page(browser,{'width':360,'height':800})
    page.locator('#quick-contexts').click()
    assert page.locator('#context-scene').is_visible()
    assert page.locator('#story-reveal').is_visible()
    assert page.locator('#answer-options').is_hidden()
    # An unexplained place name must no longer appear below the story.
    assert page.locator('#question-word').is_hidden()
    assert 'BERÄTTELSEN' in page.locator('.context-scene-label').inner_text()
    PREVIEWS.mkdir(exist_ok=True,parents=True)
    page.locator('#question-area').screenshot(path=str(PREVIEWS/'reading-first-mobile.png'))
    page.locator('#story-reveal').click()
    assert page.locator('.answer-option').first.is_visible()
    question_word=page.evaluate('''() => {
      const story=document.querySelector('#context-story').textContent;
      const record=window.ORDJAKTEN_CONTEXTS.wordContexts.find(r=>r.scenes.some(s=>s.text===story));
      return window.ORDJAKTEN_WORDS.words.find(w=>w.id===record.id).word;
    }''')
    page.locator('.answer-option').filter(has_text=question_word).click()
    assert page.locator('#question-area').is_hidden()
    assert page.locator('#explanation-definition').is_visible()
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    page.locator('#feedback-area').screenshot(path=str(PREVIEWS/'reading-explanation-mobile.png'))
    answer_reading(page)
    page.locator('#next').click()
    assert page.locator('#story-reveal').is_visible()
    assert not errors,errors
    page.close()

def expressions_mobile(browser):
    page,errors=make_page(browser,{'width':390,'height':820})
    page.locator('[data-topic="expressions"]').click()
    page.locator('[data-expression-task="meaning"]').click()
    page.locator('[data-count="5"]').click()
    page.locator('#start').click()
    assert page.locator('#expression-scene').is_visible()
    assert page.locator('#answer-options').is_hidden()
    page.locator('#story-reveal').click()
    # Wrong or right original answers must both open a reading explanation.
    page.locator('.answer-option').first.click()
    answer_reading(page)
    assert not errors,errors
    page.close()

def test_mode(browser):
    page,errors=make_page(browser,{'width':600,'height':800})
    page.locator('[data-mode="test"]').click()
    page.locator('[data-topic="expressions"]').click()
    page.locator('[data-expression-task="meaning"]').click()
    page.locator('[data-count="5"]').click()
    page.locator('#start').click()
    for _ in range(5):
        assert page.locator('#story-reveal').is_visible()
        assert page.locator('#answer-options').is_hidden()
        page.locator('#story-reveal').click()
        assert page.locator('.answer-option').first.is_visible()
        page.locator('.answer-option').first.click()
        assert page.locator('#feedback-area').is_hidden()
        assert page.locator('#reading-check').is_hidden()
    assert page.locator('#view-results').is_visible()
    assert not errors,errors
    page.close()

if __name__=='__main__':
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        context_mobile(browser)
        expressions_mobile(browser)
        test_mode(browser)
        browser.close()
    print('✓ read-first stories, Aha gate, mobile layout and unbiased test mode')
