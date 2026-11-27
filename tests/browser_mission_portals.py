"""Real Chromium regression for Upptäckarklubben's complete story flow.

Runs against the actual HTML/CSS/JS in the about:blank harness. LocalStorage
is shimmed (not a production-origin cache test). This simulates user actions,
not a child playtest and not a measurement of reading comprehension.
"""
import json
from playwright.sync_api import sync_playwright
from browser_smoke import make_page, browser_executable


def stored(page):
    value=page.evaluate("localStorage.getItem('ordjakten-v1')")
    assert value
    return json.loads(value)


def no_overflow(page):
    dims=page.evaluate("""() => ({
      viewport:innerWidth,actual:document.documentElement.scrollWidth
    })""")
    assert dims["actual"]<=dims["viewport"],dims


def one_story(page):
    page.locator("#quick-portals").click()
    assert page.locator("#view-portals").is_visible()
    assert page.locator(".portal-card").count()==12
    assert page.locator("#portal-more").is_visible()
    assert page.locator(".portal-progress").inner_text().startswith("🎒 0 av 52")
    assert page.locator(".portal-card-done").count()==0
    assert page.locator(".portal-journey").count()==0
    # Keep 52 themes discoverable without showing 52 cards at once.
    # Category and page-size choices never modify score or stored progress.
    page.locator('[data-portal-filter="mystery"]').click()
    assert page.locator(".portal-card").count()==11
    assert page.locator('[data-portal-filter="mystery"]').get_attribute("aria-pressed")=="true"
    assert "Visar 11 av 11" in page.locator(".portal-filter-count").inner_text()
    assert page.locator("#portal-more").count()==0
    page.locator('[data-portal-filter="fantasy"]').click()
    assert page.locator(".portal-card").count()==12
    assert page.locator("#portal-more").is_visible()
    page.locator("#portal-more").click()
    assert page.locator(".portal-card").count()==13
    assert page.locator("#portal-more").count()==0
    page.locator('[data-portal-filter="all"]').click()
    assert page.locator(".portal-card").count()==12
    page.locator("#portal-more").click()
    assert page.locator(".portal-card").count()==24
    assert page.evaluate("document.activeElement.id")=="portal-card-hotel"
    assert "Visar 24 av 52" in page.locator(".portal-filter-count").inner_text()
    no_overflow(page)
    before=stored(page)
    page.locator('[data-portal-open="detective"]').click()
    assert page.locator(".portal-clue").count()==2
    assert page.locator(".portal-choice").count()==3
    assert page.locator(".portal-journey-step").count()==3
    story=page.evaluate("""()=>window.OrdjaktenPortalsData.STORIES.find(x=>x.id==='detective')""")
    assert story["ending"] not in page.locator("#portals-content").inner_text()
    assert story["stages"][1]["scene"] not in page.locator("#portals-content").inner_text()

    for number,stage in enumerate(story["stages"]):
        assert stage["scene"] in page.locator(".portal-story").inner_text()
        assert page.locator(".portal-clue").count()==2
        for clue in stage["clues"]:
            assert clue in page.locator(".portal-clues").inner_text()
        assert stage["why"] not in page.locator("#portals-content").inner_text()
        wrong=(stage["answer"]+1)%3
        page.locator(f'[data-portal-answer="{wrong}"]').click()
        assert page.locator(f'[data-portal-answer="{wrong}"]').is_disabled()
        assert stage["wrong"][wrong] in page.locator(".portal-feedback").inner_text()
        assert page.locator(".portal-feedback").get_attribute("role")=="status"
        assert page.locator("[data-portal-next]").count()==0
        page.locator("[data-portal-hint]").click()
        assert "Läs det första spåret" in page.locator(".portal-hint").inner_text()
        assert stored(page)["discoveryPortals"]["detective"]["hint"] is True
        correct=page.locator(f'[data-portal-answer="{stage["answer"]}"]')
        if number==1:
            correct.focus()
            page.keyboard.press("Enter")
        else:
            correct.click()
        assert page.locator(".portal-choice").count()==0
        assert stage["why"] in page.locator(".portal-success").inner_text()
        assert page.locator("[data-portal-next]").count()==1
        page.locator("[data-portal-next]").click()
        if number<2:
            assert f"Del {number+2} av 3" in page.locator("#portal-stage-title").inner_text()

    assert page.locator(".portal-finish").is_visible()
    assert story["ending"] in page.locator(".portal-finish").inner_text()
    assert story["keepsake"]["name"] in page.locator(".portal-finish").inner_text()
    assert page.locator("[data-portal-answer]").count()==0
    after=stored(page)
    assert after["discoveryPortals"]["detective"]=={
      "rev":1,"step":3,"solved":True,"wrong":[],"hint":False
    }
    for key in ["results","starCollection","treasureHunt","reviewProgress","skillProgress"]:
        assert after.get(key)==before.get(key),f"unrelated {key} changed"
    page.locator("[data-portal-back]").first.click()
    assert page.locator(".portal-card-done").count()==1
    assert "1 av 52" in page.locator(".portal-progress").inner_text()
    # A new adventure is available from the mystery category. Its state
    # survives closing the adventure and reopening the browser.
    page.locator('[data-portal-filter="mystery"]').click()
    assert page.locator('[data-portal-open="rail-ticket"]').is_visible()
    page.locator('[data-portal-open="rail-ticket"]').click()
    rail=page.evaluate("""()=>window.OrdjaktenPortalsData.STORIES.find(x=>x.id==='rail-ticket')""")
    assert rail["stages"][0]["scene"] in page.locator(".portal-story").inner_text()
    page.locator(f'[data-portal-answer="{rail["stages"][0]["answer"]}"]').click()
    assert rail["stages"][0]["why"] in page.locator(".portal-success").inner_text()
    page.locator("[data-portal-next]").click()
    assert "Del 2 av 3" in page.locator("#portal-stage-title").inner_text()
    page.locator("[data-portal-back]").first.click()
    assert stored(page)["discoveryPortals"]["rail-ticket"]["step"]==1
    page.locator('[data-portal-open="agents"]').click()
    agent=page.evaluate("""()=>window.OrdjaktenPortalsData.STORIES.find(x=>x.id==='agents').stages[0]""")
    page.locator(f'[data-portal-answer="{(agent["answer"]+1)%3}"]').click()
    assert stored(page)["discoveryPortals"]["agents"]["step"]==0
    no_overflow(page)
    return stored(page),story


def restore(browser,viewport,saved,story):
    page,errors=make_page(browser,viewport,{"ordjakten-v1":json.dumps(saved,ensure_ascii=False)})
    page.locator("#quick-portals").click()
    assert page.locator(".portal-card-done").count()==1
    page.locator('[data-portal-open="detective"]').click()
    assert page.locator(".portal-finish").is_visible()
    assert story["keepsake"]["name"] in page.locator(".portal-finish").inner_text()
    page.locator("[data-portal-back]").first.click()
    page.locator('[data-portal-filter="mystery"]').click()
    page.locator('[data-portal-open="rail-ticket"]').click()
    assert "Del 2 av 3" in page.locator("#portal-stage-title").inner_text()
    page.locator("[data-portal-back]").first.click()
    page.locator('[data-portal-open="agents"]').click()
    assert page.locator('[data-portal-answer="1"]').count()==1
    assert page.locator('[data-portal-answer="1"]').is_disabled()
    no_overflow(page)
    if viewport["width"]==320:
        page.on("dialog", lambda dialog: dialog.accept())
        page.locator('[data-nav="history"]').click()
        page.locator("#clear-history").click()
        assert stored(page)["discoveryPortals"]=={}
        page.locator('[data-nav="home"]').click()
        page.locator("#quick-portals").click()
        assert page.locator(".portal-card-done").count()==0
    assert not errors,errors
    page.close()


def run():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=browser_executable(p),args=["--no-sandbox"])
        for viewport,theme in [({"width":320,"height":780},"light"),
                               ({"width":1100,"height":850},"dark")]:
            page,errors=make_page(browser,viewport,storage_seed={})
            page.locator(f'[data-theme-choice="{theme}"]').click()
            if theme=="light":
                page.locator("#high-contrast").check()
            snapshot,story=one_story(page)
            assert not errors,errors
            no_overflow(page)
            page.close()
            restore(browser,viewport,snapshot,story)
        browser.close()
    print("✓ 52 portals, 156 stages, category paging, new-story resume, keyboard, mobile/desktop, no scoring")


if __name__=="__main__":
    run()
