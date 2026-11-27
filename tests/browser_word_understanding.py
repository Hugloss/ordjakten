"""Optional local checks for complete word lessons and the existing Aha flow.

Run with: python tests/browser_word_understanding.py
Uses the same injected-page harness as the other browser checks; no network.
"""
from pathlib import Path
import shutil

from playwright.sync_api import sync_playwright

from browser_smoke import make_page


PREVIEWS = Path(__file__).resolve().parents[1] / "docs" / "previews"


def current_word(page):
    return page.evaluate("""() => {
      const text = document.querySelector('#context-story').textContent;
      const row = window.ORDJAKTEN_CONTEXTS.wordContexts.find(record =>
        record.scenes.some(scene => scene.text === text));
      return window.ORDJAKTEN_WORDS.words.find(word => word.id === row.id);
    }""")


def complete_aha(page, word):
    page.locator("#reading-start").click()
    scenes = page.evaluate("""id => window.ORDJAKTEN_CONTEXTS.wordContexts
      .find(record => record.id === id).scenes.map(scene => scene.text)""", word["id"])
    labels = page.locator(".reading-option").all_inner_texts()
    right = [i for i, label in enumerate(labels) if any(text in label for text in scenes)]
    assert len(labels) == 3 and len(right) == 1, labels
    page.locator(".reading-option").nth(right[0]).click()
    assert page.locator("#next").is_visible()


def training(browser):
    page, errors = make_page(browser, {"width": 390, "height": 844})
    page.evaluate("Math.random = () => 0.37")
    page.locator("#quick-contexts").click()
    for index in range(5):
        word = current_word(page)
        assert page.locator("#word-teaching").is_hidden()
        page.locator("#story-reveal").click()
        labels = page.locator(".answer-option").all_inner_texts()
        answer = next(i for i, label in enumerate(labels)
                      if (word["word"] in label) == (index != 0))
        page.locator(".answer-option").nth(answer).click()
        lesson = page.locator("#word-teaching")
        assert lesson.is_visible()
        for text in word["teaching"].values():
            assert text in lesson.inner_text()
        assert ("Tänk på ditt svar" in lesson.inner_text()) == (index == 0)
        assert lesson.locator("input, textarea").count() == 0
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
        assert page.locator("#next").is_hidden()
        if index == 0:
            PREVIEWS.mkdir(parents=True, exist_ok=True)
            lesson.screenshot(path=str(PREVIEWS / "word-understanding-mobile.png"))
        complete_aha(page, word)
        page.locator("#next").click()
    assert page.locator("#view-results").is_visible()
    assert page.locator("#result-right").inner_text() == "4"
    assert page.locator("#result-wrong").inner_text() == "1"
    assert not errors, errors
    page.close()


def delayed_feedback(browser):
    page, errors = make_page(browser, {"width": 1100, "height": 900})
    page.locator('[data-level="medium"]').click()
    page.locator('[data-mode="test"]').click()
    page.locator('[data-count="5"]').click()
    page.locator("#start").click()
    for _ in range(5):
        if page.locator("#story-reveal").is_visible():
            page.locator("#story-reveal").click()
        page.locator(".answer-option").first.click()
        assert page.locator("#word-teaching").is_hidden()
        assert page.locator("#feedback-area").is_hidden()
    assert page.locator("#view-results").is_visible()
    assert page.locator(".review-card .word-teaching").count() == 5
    assert not errors, errors
    page.close()


def word_collection(browser):
    page, errors = make_page(browser, {"width": 320, "height": 800})
    page.locator('[data-theme-choice="light"]').click()
    page.locator("#high-contrast").check()
    page.locator('[data-nav="words"]').click()
    page.locator("#word-type-filter").select_option("words")
    while page.locator("#more-words").is_visible():
        page.locator("#more-words").click()
    assert page.locator("#word-list .word-teaching-details").count() == 121
    for name in ["Magnetisk", "Orädd", "Tvetydig"]:
        card = page.locator(".word-item").filter(has=page.get_by_role("heading", name=name, exact=True))
        card.locator("summary").click()
        assert card.locator(".word-teaching-part").count() == 4
        assert card.locator(".word-teaching").is_visible()
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    assert not errors, errors
    page.close()


if __name__ == "__main__":
    with sync_playwright() as playwright:
        bundled = playwright.chromium.executable_path
        browser = playwright.chromium.launch(headless=True,
            executable_path=bundled if Path(bundled).is_file() else shutil.which("chromium") or None,
            args=["--no-sandbox"])
        training(browser)
        delayed_feedback(browser)
        word_collection(browser)
        browser.close()
    print("✓ Complete word lessons: mobile training, separate Aha score, delayed test feedback, all 121 word cards")
