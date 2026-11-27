"""Optional mobile/desktop smoke for training goals (storage shim, not real reload)."""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def main():
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':360,'height':800},storage_seed={})
        page.locator('[data-level="medium"]').click()
        page.locator('[data-count="5"]').click()
        page.locator('[data-practice-goal="focus"]').click()
        assert page.locator('#goal-focus-count').inner_text()=='0'
        page.locator('#start').click()
        assert page.locator('#setup-error').is_visible()
        assert 'Inget behöver' in page.locator('#setup-error').inner_text()
        page.locator('[data-practice-goal="discover"]').click()
        assert page.locator('#setup-error').is_hidden()
        assert int(page.locator('#goal-discover-count').inner_text())>=5
        page.locator('[data-mode="test"]').click()
        assert page.locator('#practice-goal-settings').is_hidden()
        page.locator('[data-mode="train"]').click()
        assert page.locator('[data-practice-goal="discover"]').get_attribute('aria-pressed')=='true'
        seeded=page.evaluate('''() => {
          const E=window.OrdjaktenEngine,D=window.OrdjaktenAdaptive,B=window.OrdjaktenReading;
          const id=E.getPool(window.ORDJAKTEN_WORDS,window.ORDJAKTEN_CURATION,'medium')
            .find(w=>window.ORDJAKTEN_CONTEXTS.wordContexts.some(c=>c.id===w.id)).id;
          const history=E.sanitizeHistory(null);
          history.settings={...history.settings,difficulty:'medium',count:5,practiceGoal:'focus'};
          history.skillProgress=D.record({}, {id,kind:'word',taskType:'meaning'},'right');
          history.readingProgress=B.recordProgress({},id,'context','guided');
          return JSON.stringify(history);
        }''')
        assert not errors,errors
        page.close()
        page,errors=make_page(browser,{'width':360,'height':800},storage_seed={'ordjakten-v1':seeded})
        assert page.locator('#goal-focus-count').inner_text()=='1'
        assert 'kortare' in page.locator('#practice-goal-help').inner_text()
        page.locator('#start').click()
        assert page.locator('#stat-progress').inner_text().replace(' ','')=='1/1'
        assert 'Ge ord en ny chans' in page.locator('#play-tag').inner_text()
        assert page.locator('#context-story').is_visible()
        page.on('dialog',lambda dialog:dialog.accept())
        page.locator('#leave').click()
        page.locator('[data-nav="history"]').click()
        page.locator('#clear-history').click()
        state=json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
        assert not state['readingProgress']
        assert state['settings']['practiceGoal']=='mixed'
        assert not errors,errors
        page.close();browser.close()
    print('✓ Practice goals: explicit empty state, shorter round, test isolation, stored settings and reset')

if __name__=='__main__':main()
