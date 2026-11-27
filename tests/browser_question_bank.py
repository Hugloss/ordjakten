"""Browser regression for the independent Swedish subject bank and shared gameplay.

Uses the production HTML/CSS/script order in the about:blank Playwright harness.
This does not validate real-origin service-worker caching; other tests cover it.
"""
from playwright.sync_api import sync_playwright
from browser_smoke import make_page, browser_executable


def setup(browser, mode: str, task: str):
    page, errors = make_page(browser, {"width": 390, "height": 844}, storage_seed={})
    assert page.locator("#view-home").is_visible(), errors
    page.locator('[data-topic="expressions"]').click()
    page.locator(f'[data-expression-task="{task}"]').click()
    page.locator(f'[data-mode="{mode}"]').click()
    page.locator('[data-count="5"]').click()
    page.locator("#start").click()
    assert page.locator("#view-play").is_visible(), errors
    return page, errors


def check_bank_registry(browser):
    page, errors = make_page(browser, {"width": 1040, "height": 840}, storage_seed={})
    snapshot = page.evaluate("""() => {
        const registry = window.OrdjaktenQuestionPlatform.createRegistry();
        registry.register(window.OrdjaktenSvenskaBank.fromLegacyExpressions(
            window.ORDJAKTEN_EXPRESSIONS, window.ORDJAKTEN_MISSIONS));
        const refs = registry.listQuestionRefs('svenska');
        const order = registry.present({bankId:'svenska',id:'order-ut-0001',revision:1},{seed:99});
        return {
            banks:registry.bankInfo(),
            refs:refs.length,
            orderKind:order.responseSpec.kind,
            orderChoices:order.responseSpec.options.length,
            exposesAnswer:JSON.stringify(order).includes('correctOrder')
        };
    }""")
    assert snapshot["banks"][0]["bankId"] == "svenska", snapshot
    assert snapshot["banks"][0]["count"] == 237, snapshot
    assert snapshot["refs"] == 237, snapshot
    assert snapshot["orderKind"] == "ordering", snapshot
    assert snapshot["orderChoices"] == 3 and not snapshot["exposesAnswer"], snapshot
    assert not errors, errors
    page.close()


def reveal_story(page):
    # Ordjakten requires the learner to read the authored scene first.
    gate = page.locator("#story-reveal")
    if gate.is_visible():
        gate.click()


def meaning_training(browser):
    page, errors = setup(browser, "train", "meaning")
    reveal_story(page)
    assert page.locator(".answer-option").count() == 4
    page.locator(".answer-option").first.click()
    assert page.locator("#feedback-area").is_visible(), errors
    assert not errors, errors
    page.close()


def sentence_training(browser):
    page, errors = setup(browser, "train", "sentence")
    reveal_story(page)
    assert page.locator("#order-area").is_hidden()
    assert page.locator(".answer-option").count() == 3
    page.locator(".answer-option").first.click()
    assert page.locator("#feedback-area").is_visible(), errors
    assert not page.locator("#question-area").is_visible()
    assert not errors, errors
    page.close()


def select_order(page, indexes):
    reveal_story(page)
    for index in indexes:
        page.locator("#order-choices").locator(f'[data-order-step="{index}"]').click()


def order_training(browser):
    page, errors = setup(browser, "train", "order")
    reveal_story(page)
    assert page.locator("#order-area").is_visible()
    assert page.locator("#answer-options").is_hidden()
    select_order(page, (0, 1, 2))
    page.locator("#order-submit").click()
    assert page.locator("#feedback-area").is_visible(), errors
    diag = page.evaluate("""() => ({
      right:document.querySelector('#stat-right').textContent,
      feedback:document.querySelector('#feedback-status')?.dataset?.outcome,
      selected:[...document.querySelectorAll('#order-selection li')].map(n=>n.textContent),
      word:document.querySelector('#question-word')?.textContent,
      errors:[...document.querySelectorAll('#global-error')].map(n=>n.textContent)
    })""")
    assert page.locator("#stat-right").inner_text() == "1", diag
    assert not errors, errors
    page.close()


def exam_privacy(browser):
    page, errors = setup(browser, "test", "order")
    for round_index in range(5):
        select_order(page, (2, 0, 1) if round_index == 0 else (0, 1, 2))
        page.locator("#order-submit").click()
        assert page.locator("#feedback-area").is_hidden(), "Exam revealed feedback early"
        if round_index < 4:
            assert page.locator("#view-results").is_hidden(), "Exam ended early"
    assert page.locator("#view-results").is_visible()
    assert page.locator("#result-right").inner_text() == "4"
    assert page.locator("#result-wrong").inner_text() == "1"
    assert not errors, errors
    page.close()


def run():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True, executable_path=browser_executable(playwright),
            args=["--no-sandbox"])
        check_bank_registry(browser)
        meaning_training(browser)
        sentence_training(browser)
        order_training(browser)
        exam_privacy(browser)
        browser.close()
    print("✓ Federated Swedish bank, meaning/sentence/order gameplay, exam secrecy and scores")


if __name__ == "__main__":
    run()
