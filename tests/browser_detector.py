"""Optional browser regression for evidence selection, with injected storage."""
import json
import shutil
import time
from playwright.sync_api import sync_playwright
from browser_smoke import make_page


def main(browser):
    page, errors = make_page(browser, {"width": 390, "height": 800}, storage_seed={})
    page.locator('[data-mode="test"]').click()
    stored = lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    before = stored()
    page.locator("#open-learning-home").click()
    page.locator('[data-learning-status="all"]').click()
    page.locator("#learning-search").fill("Grumlig")
    page.locator(".learning-word-toggle").click()
    page.locator('[data-detector-target="sv-0044"]').click()
    assert page.locator("#view-detector").is_visible()
    assert page.locator("#detector-story-text").is_visible()
    assert page.locator("#detector-word-stage").is_hidden()
    page.locator("#detector-read").click()
    page.locator('[data-detector-word="sv-0044"]').click()
    assert page.locator("#detector-clue-stage").is_visible()
    assert page.locator("#detector-story-text").is_visible()
    page.locator('[data-detector-quote="1"]').click()
    assert page.locator("#detector-help-text").is_visible()
    assert stored() == before
    page.locator('[data-detector-quote="0"]').click()
    assert page.locator("#detector-feedback").is_visible()
    assert page.locator("#detector-story-text mark").is_visible()
    after = stored()
    card = next(iter(after["detectorProgress"].values()))
    assert card["word"] == "previewed"
    assert card["wordRight"] == 0
    assert card["clue"] == "supported"
    assert card["clueRight"] == 0
    assert {k:v for k,v in after.items() if k != "detectorProgress"} == {
        k:v for k,v in before.items() if k != "detectorProgress"}
    page.locator("#detector-next").click()
    assert page.locator("#detector-finished").is_visible()
    page.locator("#detector-done").click()
    assert page.locator(".learning-word-detail").is_visible()
    # One remaining authored scene is still available, but the first is waiting.
    page.locator('[data-detector-target="sv-0044"]').click()
    page.locator("#detector-back").click()
    assert stored() == after
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    page.locator('[data-nav="history"]').click()
    page.on("dialog", lambda dialog: dialog.accept())
    page.locator("#clear-history").click()
    assert not stored()["detectorProgress"]
    assert not errors, errors
    page.close()


def advanced(browser):
    now = int(time.time() * 1000)
    for level in [2, 3]:
        seed = {"detectorLevels": {"js-01": {"level": level, "lastAt": now - 172800000, "proof": None}}}
        page, errors = make_page(browser, {"width": 390, "height": 800}, storage_seed={
            "ordjakten-v1": json.dumps(seed)})
        page.locator('[data-mode="test"]').click()
        stored = lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
        before = stored()
        page.locator("#open-learning-home").click()
        page.locator('[data-learning-status="all"]').click()
        page.locator("#learning-search").fill("Grumlig")
        page.locator(".learning-word-toggle").click()
        page.locator('[data-detector-target="sv-0044"]').click()
        assert page.locator("#detector-story-text").is_visible()
        assert page.locator("#detector-word-stage").is_hidden()
        assert page.locator("#detector-think").is_visible() == (level == 3)
        page.locator("#detector-read").click()
        page.locator('[data-detector-word="sv-0044"]').click()
        assert page.locator("#detector-clue-options button").count() == 3
        check = page.locator("#detector-clue-check")
        if level == 3:
            assert check.is_visible() and check.is_disabled()
            first = page.locator('[data-detector-quote="0"]')
            first.click()
            assert first.get_attribute("aria-pressed") == "true"
            assert check.is_disabled()
            first.click()
            assert first.get_attribute("aria-pressed") == "false"
            first.click()
            page.locator('[data-detector-quote="1"]').click()
            assert check.is_enabled()
            assert stored() == before
            check.click()
        else:
            assert check.is_hidden()
            page.locator('[data-detector-quote="0"]').click()
        assert page.locator("#detector-feedback").is_visible()
        assert page.locator("#detector-story-text mark").count() == level - 1
        after = stored()
        assert after["detectorLevels"] == before["detectorLevels"]
        assert after["results"] == before["results"]
        page.locator("#detector-next").click()
        page.locator("#detector-done").click()
        page.locator('[data-nav="history"]').click()
        page.on("dialog", lambda dialog: dialog.accept())
        page.locator("#clear-history").click()
        assert not stored()["detectorLevels"]
        assert not stored()["detectorProgress"]
        assert not errors, errors
        page.close()


if __name__ == "__main__":
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None,
                                  args=["--no-sandbox"])
        main(browser)
        advanced(browser)
        browser.close()
    print("✓ Story, word choice, exact excerpt, supported retry, privacy and reset")
