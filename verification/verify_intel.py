from playwright.sync_api import sync_playwright

def verify_algorithm_intel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app (assuming Vite runs on 5173 by default)
        try:
            page.goto("http://localhost:5173", timeout=10000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            return

        # Wait for the Algorithm Intel card to appear
        # We look for "算法情报" heading
        intel_heading = page.get_by_role("heading", name="算法情报")
        intel_heading.wait_for()

        # Check for tabs
        overview_tab = page.get_by_role("button", name="概览")
        tactics_tab = page.get_by_role("button", name="战术")
        deepdive_tab = page.get_by_role("button", name="深潜")

        if overview_tab.is_visible() and tactics_tab.is_visible() and deepdive_tab.is_visible():
            print("Tabs are visible.")
        else:
            print("Tabs are NOT visible.")

        # Take screenshot of Overview tab
        overview_tab.click()
        page.wait_for_timeout(500) # Wait for animation
        page.screenshot(path="verification/intel_overview.png")
        print("Overview screenshot taken.")

        # Take screenshot of Tactics tab
        tactics_tab.click()
        page.wait_for_timeout(500) # Wait for animation
        page.screenshot(path="verification/intel_tactics.png")
        print("Tactics screenshot taken.")

        # Take screenshot of Deep Dive tab
        deepdive_tab.click()
        page.wait_for_timeout(500) # Wait for animation
        page.screenshot(path="verification/intel_deepdive.png")
        print("Deep Dive screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_algorithm_intel()
