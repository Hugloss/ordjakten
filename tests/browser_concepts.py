"""Optional browser regression for concept relations and preview-aware evidence."""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page


def main(browser):
    page, errors = make_page(browser, {"width": 390, "height": 800}, storage_seed={})
    page.locator('[data-mode="test"]').click()
    stored = lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    before = stored()
    page.locator("#concepts-home-open").click()
    assert page.locator("#view-concepts").is_visible()
    assert page.locator("#concepts-list details").count() == 18
    page.locator('[data-concept-type="similar"]').click()
    assert page.locator("#concepts-list details").count() == 3
    first = page.locator('[data-concept-group="bk-01"]')
    first.locator("summary").click()
    assert first.locator(".concept-word").count() == 2
    assert first.locator(".concept-explanation").is_visible()
    assert stored() == before
    first.locator('[data-concept-practice="bk-01"]').click()
    assert page.locator("#concepts-question").is_visible()
    assert page.locator("#concepts-map").is_hidden()
    page.locator("#concepts-reveal").click()
    assert page.locator("#concepts-feedback").is_visible()
    after = stored()
    assert len(after["conceptProgress"]) == 1
    card = next(iter(after["conceptProgress"].values()))
    assert card["last"] == "previewed" and card["direct"] == 0
    assert {k:v for k,v in after.items() if k != "conceptProgress"} == {
        k:v for k,v in before.items() if k != "conceptProgress"}
    page.locator("#concepts-next").click()
    page.locator("#concepts-done").click()
    assert page.locator("#concepts-map").is_visible()
    page.locator("#concepts-back").click()
    page.locator('[data-learning-status="all"]').click()
    page.locator("#learning-search").fill("Dimmig")
    page.locator(".learning-word-toggle").click()
    page.locator('[data-concept-word="sv-0050"]').click()
    assert page.locator("#concepts-word-note").inner_text() == "Samband till Dimmig"
    assert page.locator("#concepts-list details").count() == 2
    page.locator('[data-concept-type="similar"]').click()
    assert page.locator("#concepts-empty").is_visible()
    assert page.locator("#concepts-quick").is_disabled()
    page.locator("#concepts-clear-filter").click()
    assert page.locator("#concepts-list details").count() == 18
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    page.locator("#concepts-back").click()
    assert page.locator(".learning-word-detail").is_visible()
    assert stored() == after
    page.locator('[data-nav="history"]').click()
    page.on("dialog", lambda dialog: dialog.accept())
    page.locator("#clear-history").click()
    assert not stored()["conceptProgress"]
    assert not errors, errors
    page.close()

    page, errors = make_page(browser, {"width": 1100, "height": 900}, storage_seed={})
    page.locator("#concepts-home-open").click()
    page.locator('[data-concept-type="category"]').click()
    page.locator("#concepts-quick").click()
    assert "Ordgrupper" in page.locator("#concepts-question-type").inner_text()
    prompt = page.locator("#concepts-prompt").inner_text()
    correct = page.evaluate("""(prompt) => window.OrdjaktenConcepts.GROUPS.flatMap(g=>g.questions)
        .find(q=>q.prompt===prompt).answer""", prompt)
    page.locator(f'[data-concept-answer="{correct}"]').click()
    result = json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    card = next(iter(result["conceptProgress"].values()))
    assert card["last"] == "direct" and card["direct"] == 1
    assert not result["results"]
    assert not errors, errors
    page.close()


if __name__ == "__main__":
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None,
                                  args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ Relation map, filtering, preview evidence, quick practice and reset")
