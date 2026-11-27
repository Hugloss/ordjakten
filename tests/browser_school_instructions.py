"""Optional browser regression for dedicated school tasks (no extra CI job)."""
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def main(browser):
    page, errors = make_page(browser, {"width": 390, "height": 800}, {})
    page.locator("#quick-school").click()
    assert "Skolans uppgiftsord" in page.locator("#play-tag").inner_text()
    assert page.locator("#school-feedback").is_hidden()
    words = page.evaluate("window.ORDJAKTEN_EXPRESSIONS.expressions.filter(e=>e.category==='school-instruction').map(e=>e.phrase)")
    seen = set()
    for _ in range(5):
        word = page.locator("#question-word").inner_text()
        assert word in words and word not in seen
        seen.add(word)
        assert "LÄS UPPGIFTEN" in page.locator("#question-prompt").inner_text()
        assert page.locator("#answer-options").is_hidden()
        page.locator("#story-reveal").click()
        assert page.locator(".answer-option").count() == 3
        assert "läraren ber om" in page.locator("#question-instruction").inner_text()
        page.locator(".answer-option").first.click()
        assert page.locator("#school-feedback").is_visible()
        assert page.locator("#school-feedback-rule").inner_text()
        assert "Exempelsvar:" in page.locator("#school-feedback-answer").inner_text()
        assert page.locator("#next").is_hidden()
        for _ in range(2):
            if page.locator("#next").is_visible():
                break
            page.locator("#reading-start").click()
            page.locator("#reading-options button").first.click()
        assert page.locator("#next").is_visible()
        page.locator("#next").click()
    assert page.locator("#view-results").is_visible()
    assert "Skolans uppgiftsord" in page.locator("#results-descriptor").inner_text()
    page.locator("#play-again").click()
    assert page.locator("#question-word").inner_text() in words
    assert not errors, errors
    page.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None, args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ school task flow, worked feedback, Aha and replay")
