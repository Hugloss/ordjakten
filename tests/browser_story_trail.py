"""Story trail smoke, with localStorage shim (not a real-origin reload)."""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def main():
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium') or None,args=['--no-sandbox'])
        page,errors=make_page(browser,{'width':360,'height':800},storage_seed={})
        seeded=page.evaluate("""() => {
          const E=window.OrdjaktenEngine,D=window.OrdjaktenAdaptive,C=window.ORDJAKTEN_CONTEXTS;
          const words=E.getPool(window.ORDJAKTEN_WORDS,window.ORDJAKTEN_CURATION,'medium');
          const r=C.wordContexts.find(r=>words.some(w=>w.id===r.id)&&
            [...r.distractors,...(r.readingDistractors||[])].some(id=>C.wordContexts.some(c=>c.id===id)));
          const word=words.find(w=>w.id===r.id);
          const state=E.sanitizeHistory(null);
          state.settings={...state.settings,difficulty:'medium',count:5,practiceGoal:'focus'};
          state.contextProgress=D.recordContext({},C,r.id,0,r.scenes[0].text,'main','right');
          state.contextProgress=D.recordContext(state.contextProgress,C,r.id,1,r.scenes[1].text,'aha','guided');
          return {id:r.id,word:word.word,scenes:r.scenes,state:JSON.stringify(state)};
        }""")
        assert not errors,errors
        page.close()
        page,errors=make_page(browser,{'width':360,'height':800},
            storage_seed={'ordjakten-v1':seeded['state']})
        assert page.locator('#goal-focus-count').inner_text()=='1'
        page.locator('#start').click()
        assert page.locator('#context-story').inner_text()==seeded['scenes'][2]['text']
        page.locator('#story-reveal').click()
        page.locator('.answer-option').filter(has_text=seeded['word']).click()
        assert page.locator('#context-story-trail').is_hidden()
        page.locator('#reading-start').click()
        labels=page.locator('.reading-option').all_inner_texts()
        correct=next(i for i,text in enumerate(labels) if seeded['scenes'][0]['text'] in text)
        page.locator('.reading-option').nth(correct).click()
        assert page.locator('#context-story-trail').is_visible()
        assert '3 av 3 berättelser' in page.locator('#context-story-trail').inner_text()
        summary=page.evaluate("""id=>{
          const D=window.OrdjaktenAdaptive,C=window.ORDJAKTEN_CONTEXTS;
          return D.contextSummary(C.wordContexts.find(r=>r.id===id),
            JSON.parse(localStorage.getItem('ordjakten-v1')).contextProgress);
        }""",seeded['id'])
        assert summary['correct']==2 and summary['needs']==1
        assert summary['scenes'][0]['lastAha']=='first'
        page.locator('#next').click()
        assert page.locator('#view-results').is_visible()
        page.locator('#open-learning-results').click()
        page.locator('#learning-search').fill(seeded['word'])
        page.locator('[data-learning-open="'+seeded['id']+'"]').click()
        trail=page.locator('#learning-detail-'+seeded['id']+' .story-trail')
        assert trail.locator('li').count()==3
        assert 'Aha: övat med hjälp' in trail.inner_text()
        assert not errors,errors
        page.close();browser.close()
    print('✓ Story trail: new scene, separate Aha, persisted evidence and word map')

if __name__=='__main__':main()
