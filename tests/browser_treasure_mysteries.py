"""Chromium regression: a child's complete mystery and two-clue transfer.

This tests the real production HTML, CSS and app event handlers using the
repository's offline about:blank harness.  It simulates interactions; it is
NOT an observed playtest with a child or a real-origin service-worker test.

Run: python tests/browser_treasure_mysteries.py
Requires: pip install playwright && python -m playwright install chromium
"""
import json

from playwright.sync_api import sync_playwright

from browser_smoke import browser_executable, make_page


def saved(page):
    raw = page.evaluate("localStorage.getItem('ordjakten-v1')")
    assert raw, "Ordjakten must save progress"
    return json.loads(raw)


def no_horizontal_overflow(page):
    size = page.evaluate("""() => ({
        viewport: window.innerWidth,
        page: document.documentElement.scrollWidth,
        content: document.querySelector('#treasure-content').scrollWidth,
        overhanging: [...document.querySelectorAll('body *')]
            .filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden')
            .map(el => ({el, rect: el.getBoundingClientRect()}))
            .filter(x => x.rect.right > window.innerWidth + 1 || x.rect.left < -1)
            .slice(0, 12)
            .map(x => ({
                tag: x.el.tagName, id: x.el.id, cls: String(x.el.className).slice(0, 80),
                left: Math.round(x.rect.left), right: Math.round(x.rect.right),
                width: Math.round(x.rect.width)
            }))
    })""")
    assert size["page"] <= size["viewport"], f"Horizontal scrolling at {size}"


def enter_map(page):
    page.locator("#quick-treasure").click()
    assert page.locator("#view-treasure").is_visible()
    assert page.locator("#treasure-world").input_value() == "forest"
    assert page.locator("[data-treasure-place]").count() == 4
    assert page.locator(".treasure-mystery-clue").count() == 0


def earn_first_treasure(page):
    # Play the ordinary authored word task with explicit help. It must NOT
    # grant a word star while still unlocking the first map mystery.
    page.locator('[data-treasure-place="2"]').click()
    assert page.locator(".treasure-task").is_visible()
    page.locator("[data-treasure-explain]").click()
    page.locator("[data-treasure-finish]").click()
    assert "sakletarpoäng" in page.locator(".treasure-reward").inner_text()
    page.locator("[data-treasure-back]").click()
    assert saved(page)["treasureHunt"]["worlds"]["forest"]["found"] == [2]
    assert page.locator(".treasure-mystery-clue").count() == 1


def solve_original_mystery(page):
    assert page.locator("[data-treasure-mystery-guess]").count() == 0
    assert page.locator(".treasure-transfer").count() == 0

    page.locator("[data-treasure-mystery-reveal]").click()
    page.locator("[data-treasure-mystery-reveal]").click()
    assert page.locator(".treasure-mystery-clue").count() == 3
    wrong = page.locator('[data-treasure-mystery-guess="0"]')
    wrong.click()
    assert page.locator('[data-treasure-mystery-guess="0"]').is_disabled()
    assert "skylt" in page.locator(".treasure-mystery-feedback").inner_text().lower()
    page.locator('[data-treasure-mystery-guess="2"]').click()

    assert page.locator(".treasure-mystery-success").count() == 1
    assert page.locator(".treasure-transfer").count() == 0
    page.locator('[data-treasure-mystery-proof="0"]').click()
    assert page.locator('[data-treasure-mystery-proof="0"]').is_disabled()
    page.locator('[data-treasure-mystery-proof="2"]').click()

    assert page.locator(".treasure-proof-reflection").is_visible()
    example = page.locator("details.treasure-proof-example")
    assert example.locator("p").is_hidden()
    example.locator("summary").click()
    assert example.locator("p").is_visible()
    assert "därför att" in example.locator("p").inner_text()
    assert page.locator(".treasure-transfer").count() == 1


def exercise_voluntary_transfer(page):
    transfer = page.locator("details.treasure-transfer")
    assert transfer.count() == 1
    assert transfer.get_attribute("open") is None
    assert transfer.locator("summary").is_visible()
    assert transfer.locator("[data-treasure-mystery-transfer]").first.is_hidden()
    assert "Sams försvunna vantar" in transfer.locator("summary").inner_text()

    # Native details supports keyboard opening; no automatic start/score.
    transfer.locator("summary").focus()
    page.keyboard.press("Enter")
    assert transfer.get_attribute("open") is not None
    assert transfer.locator("[data-treasure-mystery-transfer]").count() == 3
    assert transfer.locator("[data-treasure-listen='transfer']").count() == 1
    author = page.evaluate("window.OrdjaktenTreasureData.TRANSFERS.forest")
    assert author["why"] not in transfer.inner_text(), "Correct explanation leaked before answering"

    before = saved(page)
    assert before["treasureHunt"]["worlds"]["forest"]["mystery"]["proofDone"]

    # The first distractor matches only 'forgotten clothes' but no lost-property box.
    transfer.locator('[data-treasure-mystery-transfer="0"]').click()
    transfer = page.locator("details.treasure-transfer")
    assert transfer.get_attribute("open") is not None, "Feedback must remain in view"
    assert transfer.locator('[data-treasure-mystery-transfer="0"]').is_disabled()
    feedback = transfer.locator(".treasure-mystery-feedback")
    assert feedback.get_attribute("role") == "status"
    assert author["wrong"][0] in feedback.inner_text(), "Feedback must explain the selected partial match"
    assert page.evaluate("document.activeElement.id") == "treasure-transfer-title"
    after_wrong = saved(page)
    assert after_wrong["treasureHunt"]["worlds"]["forest"]["mystery"]["transferWrong"] == [0]
    assert after_wrong["treasureHunt"]["worlds"]["forest"]["found"] == before["treasureHunt"]["worlds"]["forest"]["found"]
    assert after_wrong["starCollection"] == before["starCollection"]
    assert after_wrong["results"] == before["results"]
    assert author["why"] not in transfer.inner_text()
    return after_wrong, author


def finish_after_reload(browser, state, author, viewport):
    page, errors = make_page(browser, viewport, {"ordjakten-v1": json.dumps(state, ensure_ascii=False)})
    page.locator("#quick-treasure").click()
    transfer = page.locator("details.treasure-transfer")
    assert transfer.get_attribute("open") is not None, "Retry should be visible after reopening"
    assert transfer.locator('[data-treasure-mystery-transfer="0"]').is_disabled()
    assert transfer.locator(".treasure-mystery-feedback").is_visible()
    before = saved(page)
    transfer.locator('[data-treasure-mystery-transfer="1"]').click()
    transfer = page.locator("details.treasure-transfer")
    assert transfer.get_attribute("open") is not None
    assert transfer.locator("[data-treasure-mystery-transfer]").count() == 0
    assert "nya fallet" in transfer.locator(".treasure-mystery-success").inner_text()
    why = transfer.locator("details.treasure-transfer-why")
    assert why.locator("p").is_hidden(), "Authored reason must stay opt-in"
    why.locator("summary").click()
    assert author["why"] in why.locator("p").inner_text()
    after = saved(page)
    mystery = after["treasureHunt"]["worlds"]["forest"]["mystery"]
    assert mystery["transferDone"] and mystery["transferLast"] == 1
    assert after["treasureHunt"]["worlds"]["forest"]["found"] == before["treasureHunt"]["worlds"]["forest"]["found"]
    assert after["starCollection"] == before["starCollection"]
    assert after["results"] == before["results"]
    no_horizontal_overflow(page)
    assert not errors, f"Browser errors after restore: {errors}"
    page.close()


def run():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True,
            executable_path=browser_executable(playwright), args=["--no-sandbox"])
        for viewport, theme in [
            ({"width": 320, "height": 780}, "light"),
            ({"width": 1100, "height": 850}, "dark"),
        ]:
            page, errors = make_page(browser, viewport, storage_seed={})
            page.locator(f'[data-theme-choice="{theme}"]').click()
            if theme == "light":
                page.locator("#high-contrast").check()
            enter_map(page)
            no_horizontal_overflow(page)
            earn_first_treasure(page)
            solve_original_mystery(page)
            state, author = exercise_voluntary_transfer(page)
            no_horizontal_overflow(page)
            assert not errors, f"Browser errors in {theme}: {errors}"
            page.close()
            finish_after_reload(browser, state, author, viewport)
        browser.close()
    print("✓ Mystery transfer: mobile high-contrast and desktop; wrong/try again;"
          " keyboard; reload; zero extra rewards; no early answer leakage")


if __name__ == "__main__":
    run()
