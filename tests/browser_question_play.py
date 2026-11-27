"""Optional Chromium regression for the new question presentation."""
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def drag(page, source, target):
    source.scroll_into_view_if_needed()
    target.scroll_into_view_if_needed()
    a = source.bounding_box()
    b = target.bounding_box()
    page.mouse.move(a["x"] + a["width"]/2, a["y"] + a["height"]/2)
    page.mouse.down()
    page.mouse.move(b["x"] + b["width"]/2, b["y"] + b["height"]/2, steps=12)
    page.mouse.up()

def main(browser):
    page, errors = make_page(browser, {"width":1100,"height":1000})
    page.locator("#quick-contexts").click()
    assert page.locator("#quest-mystery").is_visible()
    assert page.locator("#quest-mystery-progress li").count() == 4
    picture = page.locator("#quest-picture")
    assert picture.get_attribute("data-done") == "0"
    total = int(picture.get_attribute("data-total"))
    assert picture.locator(".quest-picture-cover").count() == total
    assert not page.locator("#play-score-details").evaluate("(el) => el.open")
    assert page.locator("#question-portal").is_hidden()
    assert page.locator("#question-egg").is_hidden()
    page.locator("#story-reveal").click()
    assert page.locator("#question-portal").is_visible()
    assert page.locator("#question-portal").get_attribute("data-artifact") == "map"
    drag(page, page.locator(".quest-drag-grip").first, page.locator("#quest-mystery-title"))
    assert page.locator("#question-area").is_visible()
    assert page.locator("#feedback-area").is_hidden()
    page.locator("#question-egg").click()
    assert page.locator("#question-egg-hint").is_visible()
    assert page.locator("#question-egg").get_attribute("aria-expanded") == "true"
    assert page.locator("#question-egg .quest-hatchling-fox").is_visible()
    drag(page, page.locator(".quest-drag-grip").first, page.locator("#question-portal"))
    assert page.locator("#feedback-area").is_visible()
    assert page.locator("#question-portal").is_hidden()
    assert page.locator("#reading-launch").is_visible()
    assert page.locator("#next").is_hidden()
    assert page.locator("#quest-mystery-discovery").is_hidden()
    # Finish the existing Aha gate with at most two attempts. The discovery
    # happens after supported learning too; it does not require correctness.
    for _ in range(2):
        page.locator("#reading-start").click()
        page.locator("#reading-options button").first.click()
        if page.locator("#next").is_visible():
            break
    assert page.locator("#next").is_visible()
    assert page.locator("#quest-mystery-discovery").is_visible()
    art = page.locator("#quest-discovery-art")
    assert art.locator("svg").count() == 1
    assert art.get_attribute("data-steps") == "1"
    assert art.get_attribute("data-artifact") == "map"
    assert art.locator(".quest-route-ink").is_visible()
    assert page.evaluate("new Set([...document.querySelectorAll('[id]')].map(el=>el.id)).size===document.querySelectorAll('[id]').length")
    page.locator("#next").click()
    if page.locator("#story-reveal").is_visible():
        page.locator("#story-reveal").click()
    assert page.locator("#question-portal").get_attribute("data-steps") == "1"
    assert picture.get_attribute("data-done") == "1"
    assert picture.locator(".quest-picture-cover").count() == total - 1
    assert page.locator("#question-egg").get_attribute("data-helper") == "crystal"
    assert page.locator("#question-egg .quest-crystal-art").is_visible()
    page.locator("#question-egg").click()
    assert page.locator("#question-egg .quest-crystal-light").is_visible()
    assert page.locator("#question-egg-hint").is_visible()
    assert page.locator("#answer-options").get_attribute("data-card-style") == "butterfly"
    assert not errors, errors
    page.close()

    page, errors = make_page(browser, {"width":1100,"height":1000})
    page.locator('[data-mode="test"]').click()
    page.locator('[data-level="medium"]').click()
    page.locator('[data-count="5"]').click()
    page.locator("#start").click()
    if page.locator("#story-reveal").is_visible():
        page.locator("#story-reveal").click()
    assert page.locator("#question-portal").is_visible()
    assert page.locator("#question-egg").is_hidden()
    drag(page, page.locator(".quest-drag-grip").first, page.locator("#question-portal"))
    assert page.locator("#feedback-area").is_hidden()
    assert page.locator("#stat-progress").text_content() == "2 / 5"
    assert page.locator("#question-portal").get_attribute("data-artifact") == "map"
    assert page.locator("#quest-mystery-discovery").is_hidden()
    for expected in ("lock", "lantern", "chest"):
        if page.locator("#story-reveal").is_visible():
            page.locator("#story-reveal").click()
        page.locator(".answer-option").first.click()
        assert page.locator("#feedback-area").is_hidden()
        assert page.locator("#quest-mystery-discovery").is_hidden()
        if page.locator("#story-reveal").is_visible():
            page.locator("#story-reveal").click()
        assert page.locator("#question-portal").get_attribute("data-artifact") == expected
    page.locator(".answer-option").first.click()
    assert page.locator("#view-results").is_visible()
    assert page.locator("#quest-mystery-finale").is_visible()
    finale = page.locator("#quest-finale-artwork")
    assert finale.get_attribute("data-complete") == "true"
    assert finale.get_attribute("data-treasure") == "sprout"
    assert finale.locator(".quest-treasure-sprout").is_visible()
    assert page.locator("#quest-finale-picture").get_attribute("data-done") == "5"
    assert page.locator("#quest-finale-picture .quest-picture-cover").count() == 0
    assert page.evaluate("new Set([...document.querySelectorAll('[id]')].map(el=>el.id)).size===document.querySelectorAll('[id]').length")
    assert not errors, errors
    page.close()

    page, errors = make_page(browser, {"width":320,"height":780})
    page.locator("#start").click()
    if page.locator("#story-reveal").is_visible():
        page.locator("#story-reveal").click()
    assert page.locator("#question-portal").is_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    # The ordinary accessible click path works without dragging.
    page.locator(".answer-option").first.click()
    assert page.locator("#feedback-area").is_visible()
    assert not errors, errors
    page.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None,
                                    args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ illustrated question portals, optional clue egg, drag, tap and test isolation")
