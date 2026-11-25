"""Optional browser regression for the unscored personal Aha round.

The shared about:blank harness uses a localStorage shim, not a real-origin
reload test. Run locally with Playwright/Chromium; no new PR runner is needed.
"""
import json
import shutil
import time
from playwright.sync_api import sync_playwright
from browser_smoke import make_page


def main(browser):
    day = 86400000
    now = int(time.time() * 1000)
    card = {"first": 0, "supported": 1, "streak": 0, "lastAt": now - 2 * day,
            "quality": 0, "proofs": [], "lastEvidence": "expression:challenge",
            "lastQualifiedAt": 0}
    seed = {"settings": {"mode": "test", "timerMode": "total"},
            "results": [{"finishedAt": now - day, "mode": "test", "level": "easy",
                         "right": 5, "total": 5}],
            "readingProgress": {"ut-0001": card}}
    page, errors = make_page(browser, {"width": 390, "height": 800},
                             storage_seed={"ordjakten-v1": json.dumps(seed)})
    # Save the sanitized baseline with deliberately non-training settings.
    page.locator('[data-mode="test"]').click()
    stored = lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    before = stored()
    assert page.locator("#aha-home-start").is_visible()
    assert "1 ny berättelse" in page.locator("#aha-home-start").inner_text()
    page.locator("#aha-home-start").click()
    assert page.locator("#view-aha").is_visible()
    assert page.locator("#aha-round-definition").is_visible()
    assert page.locator("#aha-round-question").is_hidden()
    assert page.locator("#aha-round-progress").inner_text() == "Berättelse 1 av 1"
    page.locator("#aha-round-reveal").click()
    assert page.locator("#aha-round-read").is_hidden()
    options = page.locator("#aha-round-options button")
    right = page.evaluate("""() => window.ORDJAKTEN_MISSIONS.missions
      .find(x=>x.id==='ut-0001').sentences.find(x=>x.correct).label""")
    wrong = next(i for i, text in enumerate(options.all_text_contents()) if text != right)
    options.nth(wrong).click()
    assert page.locator("#aha-round-read").is_visible()
    assert stored()["readingProgress"] == before["readingProgress"]
    page.locator("#aha-round-reveal").click()
    options.get_by_text(right, exact=True).click()
    assert page.locator("#aha-round-feedback").is_visible()
    after = stored()
    observed = after["readingProgress"]["ut-0001"]["transfer"]
    assert observed["supported"] == 2 and observed["quality"] == 0
    assert observed["lastEvidence"] == "expression:mission"
    assert {k:v for k,v in after.items() if k != "readingProgress"} == {
        k:v for k,v in before.items() if k != "readingProgress"}
    page.locator("#aha-round-next").click()
    assert page.locator("#aha-round-finished").is_visible()
    page.locator("#aha-round-done").click()
    assert page.locator("#view-learning").is_visible()
    assert page.locator("#aha-learning").is_visible()
    assert page.locator("#aha-learning-start").is_hidden()
    page.locator('[data-learning-status="practice"]').click()
    assert page.locator('[data-learning-open="ut-0001"]').is_visible()
    page.locator('[data-nav="history"]').click()
    page.on("dialog", lambda dialog: dialog.accept())
    page.locator("#clear-history").click()
    assert not stored()["readingProgress"]
    page.locator('[data-nav="home"]').click()
    assert page.locator("#aha-home").is_hidden()
    assert not errors, errors
    page.close()

    # Leaving before completing an Aha must not invent an observation.
    page, errors = make_page(browser, {"width": 1100, "height": 900},
                             storage_seed={"ordjakten-v1": json.dumps(seed)})
    page.locator("#aha-home-start").click()
    page.locator("#aha-round-reveal").click()
    page.locator("#aha-round-back").click()
    assert stored()["readingProgress"] == seed["readingProgress"]
    assert page.locator("#aha-learning-start").is_visible()
    assert not errors, errors
    page.close()


if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True,
            executable_path=shutil.which("chromium") or None, args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ Personal Aha round, waiting, score isolation, navigation and reset")
