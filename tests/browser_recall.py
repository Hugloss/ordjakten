"""Optional browser regression for typed word recall, no real-origin reload."""
import json
import shutil
import time
from playwright.sync_api import sync_playwright
from browser_smoke import make_page


def main(browser):
    now = int(time.time() * 1000)
    seed = {"settings": {"mode": "test", "timerMode": "total"},
            "skillProgress": {"sv-0001": {"skills": {
                "meaning": {"right": 1, "wrong": 0, "streak": 1, "attempts": 1, "lastAt": now - 1000}},
                "lastScene": -1}}}
    page, errors = make_page(browser, {"width": 390, "height": 800},
                             storage_seed={"ordjakten-v1": json.dumps(seed)})
    page.locator('[data-mode="test"]').click()
    stored = lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    before = stored()
    page.locator("#recall-home-start").click()
    assert page.locator("#view-recall").is_visible()
    assert "…" in page.locator("#recall-cloze").inner_text()
    assert "skrovlig" not in page.locator("#recall-cloze").inner_text().lower()
    assert page.locator("#recall-letter-hint").is_hidden()
    page.locator("#recall-answer").fill("skrovlig")
    page.locator("#recall-answer").press("Enter")
    assert page.locator("#recall-feedback").is_visible()
    assert page.locator("#recall-answer").input_value() == ""
    after = stored()
    assert after["recallProgress"]["sv-0001"]["direct"] == 1
    assert after["recallProgress"]["sv-0001"]["stage"] == 2
    assert {k:v for k,v in after.items() if k != "recallProgress"} == {
        k:v for k,v in before.items() if k != "recallProgress"}
    page.locator("#recall-next").click()
    assert page.locator("#recall-finished").is_visible()
    page.locator("#recall-done").click()
    assert page.locator("#recall-learning-start").is_hidden()
    page.locator('[data-learning-status="all"]').click()
    page.locator("#learning-search").fill("För en gångs skull")
    page.locator(".learning-word-toggle").click()
    page.locator('[data-recall-word="ut-0001"]').click()
    page.locator("#recall-answer").fill("syntetisk testtext")
    page.locator("#recall-answer").press("Enter")
    assert page.locator("#recall-form").is_visible()
    assert "Andra ord kan också passa" in page.locator("#recall-response").inner_text()
    assert "ut-0001" not in stored()["recallProgress"]
    page.locator("#recall-hint").click()
    assert page.locator("#recall-letter-hint").is_visible()
    page.locator("#recall-answer").fill("för en gångs skull")
    page.locator("#recall-answer").press("Enter")
    after = stored()
    assert after["recallProgress"]["ut-0001"]["direct"] == 0
    assert after["recallProgress"]["ut-0001"]["assisted"] == 1
    assert "syntetisk testtext" not in json.dumps(after)
    page.locator("#recall-next").click()
    page.locator("#recall-done").click()
    assert page.locator(".learning-word-detail").is_visible()
    assert page.locator('[data-recall-word="ut-0001"]').count() == 0
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    page.locator('[data-nav="history"]').click()
    page.on("dialog", lambda dialog: dialog.accept())
    page.locator("#clear-history").click()
    assert not stored()["recallProgress"]
    assert not errors, errors
    page.close()

    page, errors = make_page(browser, {"width": 1100, "height": 900},
                             storage_seed={"ordjakten-v1": json.dumps(seed)})
    page.locator("#recall-home-start").click()
    page.locator("#recall-answer").fill("syntetisk text som inte sparas")
    page.locator("#recall-back").click()
    assert page.locator("#recall-answer").input_value() == ""
    assert "recallProgress" not in stored() or not stored()["recallProgress"]
    assert not errors, errors
    page.close()


if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None,
                                    args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ Typed recall, optional help, spacing, private input and unchanged test scores")
