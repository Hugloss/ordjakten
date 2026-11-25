"""Optional browser regression for the ungraded language workshop."""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page


def main(browser):
    page, errors = make_page(browser, {"width": 390, "height": 800},
                             storage_seed={})
    page.locator('[data-mode="test"]').click()
    stored = lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    before = stored()
    page.locator("#open-learning-home").click()
    page.locator('[data-learning-status="all"]').click()
    page.locator("#learning-search").fill("Grumlig")
    page.locator(".learning-word-toggle").click()
    page.locator('[data-workshop-word="sv-0044"]').click()
    assert page.locator("#view-workshop").is_visible()
    assert page.locator("#workshop-build").is_visible()
    assert page.locator("#workshop-build-check").is_disabled()
    pieces = page.locator("#workshop-pieces button")
    count = pieces.count()
    pieces.first.click()
    page.locator("#workshop-build-undo").click()
    assert page.locator("#workshop-build-check").is_disabled()
    page.locator("#workshop-build-show").click()
    assert page.locator("#workshop-build-example").is_visible()
    for i in range(count):
        page.locator(f'[data-workshop-piece="{i}"]').click()
    page.locator("#workshop-build-check").click()
    assert "Du byggde vår exempelmening" in page.locator("#workshop-feedback-title").inner_text()
    page.locator("#workshop-next").click()
    assert page.locator("#workshop-repair").is_visible()
    assert page.locator("#workshop-repair-choices button").count() == 2
    page.locator("#workshop-repair-choices button").first.click()
    assert page.locator("#workshop-feedback").is_visible()
    assert "Här behöver vi byta ord:" in page.locator("#workshop-feedback-body").inner_text()
    page.locator("#workshop-next").click()
    assert page.locator("#workshop-reflect").is_visible()
    page.locator("#workshop-reflection").fill("En syntetisk mening för testet.")
    page.locator("#workshop-reflection-show").click()
    assert page.locator("#workshop-reflection-example").is_visible()
    page.locator("#workshop-reflection-done").click()
    assert page.locator("#workshop-finished").is_visible()
    assert page.locator("#workshop-reflection").input_value() == ""
    assert stored() == before
    page.locator("#workshop-done").click()
    assert page.locator("#view-learning").is_visible()
    assert page.locator(".learning-word-detail").is_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    page.locator('[data-workshop-word="sv-0044"]').click()
    page.locator("#workshop-back").click()
    assert stored() == before
    assert not errors, errors
    page.close()


if __name__ == "__main__":
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None,
                                  args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ Workshop construction, repair, private reflection and unchanged history")
