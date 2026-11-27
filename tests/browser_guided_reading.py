"""Optional Chromium test: guided reading does not change scoring or leak answers."""
import json
from playwright.sync_api import sync_playwright
from browser_smoke import browser_executable, make_page

def ensure_readable_parts(page):
    # Unit tests check natural boundaries in all authored scenes. This UI
    # smoke test forces two parts if the randomly selected story is short,
    # so it always verifies the reading controls and focus behavior.
    page.evaluate("""() => {
      const api=window.OrdjaktenGuidedReading;
      const natural=api.partsFor;
      api.partsFor=(text,opts)=>{
        const parts=natural(text,opts);
        if(parts.length>1)return parts;
        const midpoint=text.indexOf(' ',Math.floor(text.length/2));
        if(midpoint<15||text.length-midpoint<16)return parts;
        return [text.slice(0,midpoint),text.slice(midpoint+1)];
      };
    }""")

def main():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,
            executable_path=browser_executable(p),args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':375,'height':812})
        ensure_readable_parts(page)
        page.locator('#quick-contexts').click()
        assert page.locator('#view-play').is_visible()
        story=page.locator('#context-story').text_content().strip()
        assert page.locator('#guided-start').is_visible()
        page.locator('#guided-start').click()
        assert page.locator('#guided-reading').is_visible()
        assert page.locator('#reading-story').is_hidden()
        assert page.locator('#story-reveal').is_hidden()
        assert page.locator('#answer-options').is_hidden()
        # Hidden answers must also be guarded at the shared submit entry point.
        page.locator('.answer-option').first.evaluate('(button) => button.click()')
        assert page.locator('#feedback-area').is_hidden()
        assert page.locator('#stat-right').text_content()=='0'
        assert page.locator('#stat-wrong').text_content()=='0'
        pieces=[page.locator('#guided-part').inner_text()]
        while not page.locator('#guided-next').inner_text().startswith('Visa hela'):
            page.locator('#guided-next').click()
            pieces.append(page.locator('#guided-part').inner_text())
        assert ' '.join(pieces)==story
        page.locator('#guided-previous').click()
        assert page.locator('#guided-reading').is_visible()
        page.locator('#guided-full').click()
        assert page.locator('#guided-reading').is_hidden()
        assert page.locator('#context-story').is_visible()
        assert page.locator('#reading-story').is_visible()
        assert page.evaluate("document.activeElement.id")=='reading-story'
        assert page.locator('#context-story').text_content().strip()==story
        assert page.locator('#stat-right').text_content()=='0'
        assert page.locator('#stat-wrong').text_content()=='0'
        page.locator('#story-reveal').click()
        assert page.locator('#answer-options').is_visible()
        page.locator('.answer-option').first.click()
        assert page.locator('#feedback-area').is_visible()
        assert page.locator('#reading-launch').is_visible()
        assert not errors,errors
        page.close()

        # Every scored question keeps the original read/choose flow and never
        # offers the training-only helper or the Aha feedback between answers.
        seed={'ordjakten-v1':json.dumps({'settings':{
            'mode':'test','topic':'expressions','difficulty':'medium','count':5,
            'expressionTask':'meaning','timerMode':'off'}})}
        page,errors=make_page(browser,{'width':900,'height':850},seed)
        page.locator('#start').click()
        for _ in range(5):
            assert page.locator('#guided-start').is_hidden()
            assert page.locator('#guided-reading').is_hidden()
            assert page.locator('#reading-story').is_visible()
            page.locator('#story-reveal').click()
            page.locator('.answer-option').first.click()
            assert page.locator('#feedback-area').is_hidden()
        assert page.locator('#view-results').is_visible()
        assert page.locator('.review-card').count()==5
        assert not errors,errors
        page.close()

        # Reading assistance must not freeze a timed question. A timeout while
        # the helper is open still records an unanswered question and shows the
        # usual training explanation, without awarding a correct answer.
        seed={'ordjakten-v1':json.dumps({'settings':{
            'mode':'train','topic':'expressions','difficulty':'medium','count':5,
            'expressionTask':'meaning','timerMode':'per','timerSeconds':10}})}
        page,errors=make_page(browser,{'width':900,'height':850},seed)
        ensure_readable_parts(page)
        page.clock.install()
        page.locator('#start').click()
        page.locator('#guided-start').click()
        page.clock.fast_forward(11_000)
        assert page.locator('#feedback-area').is_visible()
        assert page.locator('#feedback-status').get_attribute('data-outcome')=='unanswered'
        assert page.locator('#stat-right').text_content()=='0'
        assert page.locator('#stat-wrong').text_content()=='0'
        assert page.locator('#question-area').is_hidden()
        assert not errors,errors
        page.close()
        browser.close()

if __name__=='__main__':
    main()
