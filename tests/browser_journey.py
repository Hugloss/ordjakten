"""Optional browser interaction regression for mixed ungraded stations."""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def main(browser):
    page, errors = make_page(browser, {"width":390,"height":800}, storage_seed={})
    page.locator('[data-mode="test"]').click()
    stored = lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    before = stored()
    page.locator("#next-journey-home-start").click()
    assert page.locator("#next-journey-banner").is_visible()
    assert page.locator("#view-focus").is_visible()
    assert "Äventyr · 1 av" in page.locator("#next-journey-progress").inner_text()
    for _ in range(4):
        if page.locator("#focus-finished").is_visible():
            break
        page.locator('#focus-choices button:not(:disabled)').first.click()
        page.locator("#focus-next").click()
    assert page.locator("#focus-finished").is_visible()
    assert page.locator("#next-journey-skip").is_hidden()
    assert page.locator("#focus-other-skill").is_hidden()
    after = stored()
    assert after["skillProgress"]
    assert after["results"] == before["results"]
    assert after["settings"] == before["settings"]
    page.locator("#focus-done").click()
    for _ in range(3):
        if page.locator("#view-journey").is_visible():
            break
        page.locator("#next-journey-skip").click()
    assert page.locator("#view-journey").is_visible()
    assert "1 av" in page.locator("#next-journey-summary").inner_text()
    assert page.locator("#next-journey-banner").is_hidden()
    assert stored() == after
    page.locator("#next-journey-back").click()
    assert page.locator("#view-learning").is_visible()
    page.locator("#next-journey-learning-start").click()
    assert page.locator("#next-journey-banner").is_visible()
    page.locator("#next-journey-stop").click()
    assert page.locator("#view-learning").is_visible()
    assert page.locator("#next-journey-banner").is_hidden()
    assert stored()["results"] == before["results"]
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    assert not errors, errors
    page.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None,
                                  args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ one-click journey, focus, skip, cancellation and unchanged test history")
