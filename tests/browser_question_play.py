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
    assert page.locator("#question-portal").is_hidden()
    assert page.locator("#question-egg").is_hidden()
    page.locator("#story-reveal").click()
    assert page.locator("#question-portal").is_visible()
    page.locator("#question-egg").click()
    assert page.locator("#question-egg-hint").is_visible()
    assert page.locator("#question-egg").get_attribute("aria-expanded") == "true"
    drag(page, page.locator(".quest-drag-grip").first, page.locator("#question-portal"))
    assert page.locator("#feedback-area").is_visible()
    assert page.locator("#question-portal").is_hidden()
    assert page.locator("#reading-launch").is_visible()
    assert page.locator("#next").is_hidden()
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
    assert page.locator("#stat-progress").inner_text() == "2 / 5"
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
