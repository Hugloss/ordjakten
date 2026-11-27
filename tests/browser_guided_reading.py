"""Optional Chromium test: guided reading does not change scoring or leak answers."""
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def main():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,
            executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':375,'height':812})
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
        page.locator('#quick-contexts').click()
        assert page.locator('#view-play').is_visible()
        story=page.locator('#context-story').text_content().strip()
        assert page.locator('#guided-start').is_visible()
        page.locator('#guided-start').click()
        assert page.locator('#guided-reading').is_visible()
        assert page.locator('#reading-story').is_hidden()
        assert page.locator('#story-reveal').is_hidden()
        assert page.locator('#answer-options').is_hidden()
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
        page.locator('#story-reveal').click()
        assert page.locator('#answer-options').is_visible()
        page.locator('.answer-option').first.click()
        assert page.locator('#feedback-area').is_visible()
        assert page.locator('#reading-launch').is_visible()
        assert not errors,errors
        browser.close()

if __name__=='__main__':
    main()
