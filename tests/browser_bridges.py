"""Optional real-browser interaction test; localStorage uses the existing shim."""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page


def main(browser):
    page, errors = make_page(browser, {"width": 390, "height": 800}, storage_seed={})
    page.locator('[data-mode="test"]').click()
    stored = lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    before = stored()
    page.locator("#concepts-home-open").click()
    page.locator("#bridges-kind").select_option("sort")
    page.locator("#bridges-quick").click()
    assert page.locator("#bridges-question").is_visible()
    assert page.locator("#bridges-check").is_disabled()
    assert page.locator(".bridge-sort-row").count() == 6
    task = page.evaluate("""(prompt) => window.OrdjaktenBridges.DATA.find(t=>t.prompt===prompt)""",
                         page.locator("#bridges-prompt").inner_text())
    for index, word in enumerate(task["cards"]):
        page.locator(f'[data-bridge-sort="{word}"][data-bridge-bin="{task["solution"][index]}"]').click()
    assert page.locator("#bridges-check").is_enabled()
    first = task["cards"][0]
    wrong = 1 - task["solution"][0]
    page.locator(f'[data-bridge-sort="{first}"][data-bridge-bin="{wrong}"]').click()
    page.locator("#bridges-check").click()
    assert page.locator("#bridges-help-text").is_visible()
    assert stored() == before
    page.locator(f'[data-bridge-sort="{first}"][data-bridge-bin="{task["solution"][0]}"]').click()
    page.locator("#bridges-check").click()
    assert page.locator("#bridges-feedback").is_visible()
    after = stored()
    assert after["bridgeProgress"][task["id"]]["last"] == "supported"
    assert {k:v for k,v in after.items() if k != "bridgeProgress"} == {
        k:v for k,v in before.items() if k != "bridgeProgress"}
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    page.locator("#concepts-back").click()
    page.locator('[data-learning-status="all"]').click()
    page.locator("#learning-search").fill("Dimmig")
    page.locator(".learning-word-toggle").click()
    page.locator('[data-concept-word="sv-0050"]').click()
    page.locator("#bridges-kind").select_option("order")
    page.locator("#bridges-quick").click()
    assert page.locator(".bridge-slot").count() == 3
    page.locator('[data-bridge-order="sv-0003"]').click()
    page.locator('[data-bridge-undo="true"]').click()
    assert page.locator("#bridges-check").is_disabled()
    for word in ["sv-0003", "sv-0044", "sv-0050"]:
        page.locator(f'[data-bridge-order="{word}"]').click()
    page.locator("#bridges-check").click()
    assert stored()["bridgeProgress"]["ob-12"]["last"] == "previewed"
    page.locator("#bridges-next").click()
    page.locator("#bridges-done").click()
    assert page.locator("#concepts-map").is_visible()
    page.locator("#concepts-back").click()
    assert page.locator(".learning-word-detail").is_visible()
    page.locator('[data-nav="history"]').click()
    page.on("dialog", lambda dialog: dialog.accept())
    page.locator("#clear-history").click()
    assert not stored()["bridgeProgress"]
    assert not errors, errors
    page.close()


if __name__ == "__main__":
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None,
                                  args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ sorting, retry, ordering, preview isolation, navigation and reset")
