"""Optional browser regression: creative camp, owned keepsakes, mysteries, world selection."""
import json
import shutil
from playwright.sync_api import sync_playwright
from browser_smoke import make_page

def main(browser):
    seed = {"settings": {"adventure": "forest", "companion": "fox"},
            "storyProgress": {"forest": 1, "space": 1}}
    page, errors = make_page(browser, {"width":390,"height":800},
                             storage_seed={"ordjakten-v1":json.dumps(seed)})
    page.locator('#story-home [data-camp-open]').click()
    assert page.locator("#view-camp").is_visible()
    assert page.locator("#camp-inventory .camp-item").count() == 8
    assert page.locator("#camp-slots .camp-slot").count() == 6
    assert page.locator("#camp-worlds .camp-world").count() == 12
    stored = lambda: json.loads(page.evaluate("localStorage.getItem('ordjakten-v1')"))
    page.locator('[data-camp-scene="space"]').click()
    assert stored()["campLayout"]["scene"] == "space"
    page.locator('[data-camp-item="mark-forest-0"]').click()
    page.locator('[data-camp-slot="1"]').click()
    assert stored()["campLayout"]["slots"][1] == "mark-forest-0"
    page.locator('[data-camp-slot="1"]').click()
    page.locator('[data-camp-slot="0"]').click()
    assert stored()["campLayout"]["slots"][0] == "mark-forest-0"
    assert stored()["campLayout"]["slots"][1] == "free-tent"
    page.locator('[data-camp-slot="0"]').click()
    page.locator("#camp-remove").click()
    assert stored()["campLayout"]["slots"][0] is None
    assert page.locator('[data-camp-item="mark-forest-0"]').is_visible()
    page.locator('[data-camp-slot="0"]').click()
    page.locator('[data-camp-item="mark-space-0"]').click()
    assert stored()["campLayout"]["slots"][0] == "mark-space-0"
    page.locator('[data-camp-buddy="owl"]').click()
    line = page.locator("#camp-buddy-line").inner_text()
    page.locator("#camp-chat").click()
    assert page.locator("#camp-buddy-line").inner_text() != line
    prompt = page.locator("#camp-creative-prompt").inner_text()
    page.locator("#camp-prompt-next").click()
    assert page.locator("#camp-creative-prompt").inner_text() != prompt
    before = stored()
    for action in ("butterfly", "rocket", "music", "buddy"):
        page.locator(f'[data-live-action="{action}"]').click()
        assert page.locator("#camp-live-line").inner_text()
    lantern = page.locator('[data-live-action="lantern"]')
    lantern.click()
    assert lantern.get_attribute("aria-pressed") == "true"
    lantern.click()
    assert lantern.get_attribute("aria-pressed") == "false"
    egg = page.locator('[data-live-action="egg"]')
    egg.click()
    assert "🦕" in egg.inner_text()
    egg.click()
    assert "🥚" in egg.inner_text()
    assert stored() == before
    page.locator("#camp-theatre-start").click()
    page.locator('[data-theatre-choice="owl"]').click()
    assert page.locator('[data-theatre-choice="mark-space-0"]').is_visible()
    page.locator('[data-theatre-choice="mark-space-0"]').click()
    page.locator('[data-theatre-choice="mystery"]').click()
    assert page.locator("#camp-theatre-panels li").count() == 3
    assert "Ulla" in page.locator("#camp-theatre-panels").inner_text()
    page.locator("#camp-theatre-back").click()
    page.locator('[data-theatre-choice="show"]').click()
    assert "knasiga" in page.locator("#camp-theatre-story-title").inner_text()
    page.locator("#camp-theatre-close").click()
    assert page.locator("#camp-theatre-start").is_visible()
    assert stored() == before
    page.locator("#camp-theatre-start").click()
    page.locator('[data-theatre-choice="owl"]').click()
    page.locator('[data-theatre-choice="mark-space-0"]').click()
    page.locator('[data-theatre-choice="show"]').click()
    page.locator("#camp-theatre-save").click()
    assert stored()["campStories"] == [{"scene":"space","hero":"owl","prop":"mark-space-0","plot":"show"}]
    assert page.locator("#camp-theatre-save").is_disabled()
    assert {k:v for k,v in stored().items() if k != "campStories"} == {k:v for k,v in before.items() if k != "campStories"}
    page.reload()
    page.locator('#story-home [data-camp-open]').click()
    assert page.locator("#camp-story-list li").count() == 1
    page.locator("[data-story-read]").click()
    assert "knasiga" in page.locator("#camp-theatre-story-title").inner_text()
    page.locator("#camp-theatre-close").click()
    page.once("dialog", lambda dialog: dialog.accept())
    page.locator("[data-story-remove]").click()
    assert stored()["campStories"] == []
    assert page.locator("#camp-story-empty").is_visible()
    before = stored()
    page.locator("#camp-riddle-start").click()
    page.locator('[data-camp-riddle="sv-0001"]').click()
    assert page.locator("#camp-riddle-hint").is_visible()
    page.locator('[data-camp-riddle="sv-0010"]').click()
    assert page.locator("#camp-riddle-feedback").is_visible()
    page.locator("#camp-riddle-next").click()
    assert page.locator("#camp-riddle-question").is_visible()
    assert stored() == before
    page.locator('[data-camp-world="castle"]').click()
    assert page.locator("#view-camp").is_visible()
    assert stored()["settings"]["adventure"] == "castle"
    assert stored()["storyProgress"] == seed["storyProgress"]
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    page.locator("#camp-go").click()
    assert page.locator("#next-journey-banner").is_visible()
    page.locator("#next-journey-stop").click()
    assert page.locator("#view-learning").is_visible()
    page.locator('#story-learning [data-camp-open]').click()
    assert page.locator('[data-camp-slot="0"]').inner_text().find("Månstenen") >= 0
    assert stored()["results"] == before["results"]
    assert not errors, errors
    page.close()

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=shutil.which("chromium") or None,
                                    args=["--no-sandbox"])
        main(browser)
        browser.close()
    print("✓ camp, keepsakes, move/swap/remove, companion, riddles and travel")
