"""Optional Chromium smoke tests (pip install playwright; playwright install chromium).

The HTML/assets are injected into about:blank to remain testable even in
restricted CI containers without network/localhost navigation. LocalStorage
and offline network caching are separately covered by manual tests.
"""
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1] / "public"


def make_page(browser, viewport, storage_seed=None):
    page = browser.new_page(viewport=viewport)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.set_content((ROOT / "index.html").read_text(encoding="utf-8"))
    if storage_seed is not None:
        # A localStorage shim for about:blank. This is NOT a real-origin reload test.
        page.evaluate("""(initial) => {
          const values=Object.assign(Object.create(null),initial);
          Object.defineProperty(window,'localStorage',{configurable:true,value:{
            getItem:k=>Object.hasOwn(values,k)?values[k]:null,
            setItem:(k,v)=>{values[k]=String(v)},
            removeItem:k=>{delete values[k]},
            clear:()=>{for(const k of Object.keys(values))delete values[k]}
          }});
        }""",storage_seed)

    page.add_style_tag(content=(ROOT / "css/style.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/playful.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/adventures.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/expressions.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/comics.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/surprises.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/missions.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/quests.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/review.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/contexts.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/adaptive.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/learning-map.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/focus-practice.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/contrast.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/confusions.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/clue-ladder.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/retention.css").read_text(encoding="utf-8"))
    page.add_style_tag(content=(ROOT / "css/reading-flow.css").read_text(encoding="utf-8"))
    for name in ("data/wordbank.js", "data/curation.js", "data/expressions.js", "data/comics.js", "data/surprises.js", "data/missions.js", "data/word-contexts.js", "data/contrasts.js", "data/clue-ladder.js", "js/engine.js", "js/playful.js", "js/adventures.js", "js/adventure-map.js", "js/comics.js", "js/surprises.js", "js/missions.js", "js/quests.js", "js/review.js", "js/adaptive.js", "js/learning-map.js", "js/contrast.js", "js/confusions.js", "js/clue-ladder.js", "js/retention.js", "js/focus-practice.js", "js/reading-check.js", "js/aha-plan.js", "js/recall.js", "js/app.js"):
        page.add_script_tag(content=(ROOT / name).read_text(encoding="utf-8"))
    return page, errors


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None, args=["--no-sandbox"])
        desktop, errors = make_page(browser, {"width": 1100, "height": 900})
        assert desktop.locator("#view-home").is_visible()
        desktop.locator('[data-mode="test"]').click()
        desktop.locator('[data-level="medium"]').click()
        desktop.locator('[data-count="5"]').click()
        desktop.locator("#start").click()
        for _ in range(5):
            assert desktop.locator(".answer-option").count() == 4
            desktop.locator(".answer-option").first.click()
            assert not desktop.locator("#feedback-area").is_visible(), "Answer leaked during test"
        assert desktop.locator("#view-results").is_visible()
        assert desktop.locator(".review-card").count() == 5
        assert not errors, f"Browser JS errors: {errors}"
        desktop.close()

        exam, errors = make_page(browser, {"width": 1100, "height": 850})
        exam.locator("#exam-preset").click()
        exam.locator("#start").click()
        assert exam.locator(".answer-option").count() == 5
        assert exam.locator("#stat-clock").text_content() == "03:00"
        assert not errors, f"Browser JS errors: {errors}"
        exam.close()

        mobile, errors = make_page(browser, {"width": 320, "height": 780})
        mobile.locator('[data-theme-choice="light"]').click()
        mobile.locator("#high-contrast").check()
        assert mobile.evaluate("document.body.scrollWidth <= window.innerWidth")
        mobile.locator("#start").click()
        assert mobile.evaluate("document.body.scrollWidth <= window.innerWidth")
        mobile.locator(".answer-option").first.click()
        assert mobile.locator("#feedback-area").is_visible()
        assert not mobile.locator("#question-area").is_visible()
        assert not errors, f"Browser JS errors: {errors}"
        mobile.close()

        timed, errors = make_page(browser, {"width": 900, "height": 750})
        timed.locator('[data-mode="test"]').click()
        timed.locator('[data-count="5"]').click()
        timed.locator('[data-timer="total"]').click()
        timed.locator('#timer-preset').select_option('custom')
        timed.locator('#custom-min').fill('0')
        timed.locator('#custom-sec').fill('5')
        timed.locator('#start').click()
        assert timed.locator("#view-play").is_visible()
        timed.wait_for_timeout(5300)
        assert timed.locator("#view-results").is_visible(), "Total time did not finish"
        assert timed.locator("#result-empty").text_content() == '5'
        assert timed.locator("#result-wrong").text_content() == '0'
        assert not errors, f"Browser JS errors: {errors}"
        timed.close()
        browser.close()
    print("✓ Browser smoke: test mode, exam preset, timer expiry, mobile themes, hide question")


if __name__ == "__main__":
    main()
