"""Optional browser regression: five independent word-understanding dimensions."""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page


def main(browser):
    page, errors = make_page(browser, {"width": 390, "height": 800},
                             storage_seed={})
    page.locator('[data-mode="test"]').click()
    before = json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    page.locator("#open-learning-home").click()
    page.locator('[data-learning-status="all"]').click()
    page.locator("#learning-search").fill("För en gångs skull")
    page.locator('.learning-word-toggle').click()
    rows = page.locator(".learning-profile li")
    assert rows.count() == 5
    assert page.locator('[data-facet="recognition"]').get_attribute("data-state") == "unavailable"
    assert page.locator('[data-facet="meaning"]').get_attribute("data-state") == "new"
    assert page.locator('[data-facet="contrast"]').get_attribute("data-state") == "unavailable"
    assert page.locator('[data-facet="transfer"]').get_attribute("data-state") == "new"
    page.locator('[data-aha-word="ut-0001"]').click()
    assert page.locator("#view-aha").is_visible()
    assert page.locator("#aha-round-word").inner_text() == "För en gångs skull"
    page.locator("#aha-round-reveal").click()
    correct = page.evaluate("""() => {
      const mission=window.ORDJAKTEN_MISSIONS.missions.find(x=>x.id==='ut-0001');
      const challenge=window.ORDJAKTEN_SURPRISES.challenges.find(x=>x.id==='ut-0001');
      return [mission.sentences.find(x=>x.correct).label,challenge.options.find(x=>x.correct).label];
    }""")
    options = page.locator("#aha-round-options button")
    options.nth(next(i for i,t in enumerate(options.all_text_contents()) if t in correct)).click()
    page.locator("#aha-round-next").click()
    page.locator("#aha-round-done").click()
    assert page.locator("#view-learning").is_visible()
    assert page.locator('.learning-word-detail').is_visible()
    assert page.locator('[data-facet="story"]').get_attribute("data-state") == "right"
    assert page.locator('[data-facet="meaning"]').get_attribute("data-state") == "new"
    assert page.locator('[data-facet="transfer"]').get_attribute("data-state") == "waiting"
    assert page.locator('[data-aha-word="ut-0001"]').count() == 0
    after = json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    assert {k:v for k,v in before.items() if k != "readingProgress"} == {
        k:v for k,v in after.items() if k != "readingProgress"}
    page.locator('[data-learning-status="discovered"]').click()
    assert page.locator('[data-learning-open="ut-0001"]').count() == 1
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    assert not errors, errors
    page.close()


if __name__ == "__main__":
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None,
                                  args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ Independent dimensions, voluntary Aha, spaced revisit and unchanged test history")
