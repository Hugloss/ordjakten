"""Browser checks for the child-facing everyday knowledge experience.
Reuses the existing Chromium runner; no additional workflow job.
"""
from playwright.sync_api import sync_playwright
from browser_smoke import make_page, browser_executable


def make(browser, width=1040):
    page, errors = make_page(browser, {"width": width, "height": 850}, storage_seed={})
    assert page.locator("#view-home").is_visible(), errors
    assert page.locator("#vardagskollen").is_visible()
    assert page.locator(".vk-topic").count() == 10
    return page, errors


def finish_round(page):
    for index in range(6):
        assert page.locator("#vk-game").is_visible()
        assert page.locator(".vk-choice").count() == 4
        page.locator(".vk-choice").first.click()
        assert page.locator("#vk-next").is_visible()
        page.locator("#vk-next").click()
    assert page.locator("#vk-summary").is_visible()
    assert page.locator(".vk-review-card").count() == 6


def training(browser):
    page, errors = make(browser)
    page.locator(".vk-topic").first.click()
    assert page.locator("#vk-game").is_visible()
    assert page.locator("#vk-stimulus").text_content().strip()
    page.locator(".vk-choice").first.click()
    assert page.locator("#vk-feedback").is_visible()
    assert page.locator("#vk-feedback").text_content().strip()
    page.locator("#vk-next").click()
    for _ in range(5):
        page.locator(".vk-choice").first.click()
        assert page.locator("#vk-feedback").is_visible()
        page.locator("#vk-next").click()
    assert page.locator("#vk-summary").is_visible()
    assert page.locator(".vk-review-card").count() == 6
    assert not errors, errors
    page.close()


def exam(browser):
    page, errors = make(browser)
    page.locator("#vk-test").click()
    assert page.locator("#vk-test").get_attribute("aria-pressed") == "true"
    page.locator(".vk-topic").nth(2).click()
    for index in range(6):
        assert page.locator("#vk-summary").is_hidden()
        assert page.locator("#vk-feedback").is_hidden()
        page.locator(".vk-choice").first.click()
        feedback = page.locator("#vk-feedback").text_content()
        assert "Svaret är sparat" in feedback
        assert "Passande svar:" not in feedback
        assert "✅" not in feedback
        assert "💡" not in feedback
        assert page.locator("#vk-summary").is_hidden()
        page.locator("#vk-next").click()
    assert page.locator("#vk-summary").is_visible()
    assert page.locator(".vk-review-card").count() == 6
    assert page.locator(".vk-review-card").first.get_by_text("Passande svar:", exact=False)
    page.locator("#vk-new").click()
    assert page.locator("#vk-picker").is_visible()
    assert page.locator("#vk-game").is_hidden()
    assert not errors, errors
    page.close()


def mobile(browser):
    page, errors = make(browser, width=320)
    page.locator('[data-theme-choice="light"]').click()
    page.locator("#high-contrast").check()
    assert page.evaluate("document.body.scrollWidth <= window.innerWidth")
    page.locator(".vk-topic").nth(3).click()
    assert page.evaluate("document.body.scrollWidth <= window.innerWidth")
    page.locator(".vk-choice").first.click()
    assert page.locator("#vk-feedback").is_visible()
    assert not errors, errors
    page.close()


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True,
            executable_path=browser_executable(playwright), args=["--no-sandbox"])
        training(browser)
        exam(browser)
        mobile(browser)
        browser.close()
    print("✓ Vardagskollen: all topics, 6-question rounds, delayed test feedback, mobile contrasts")


if __name__ == "__main__":
    main()
