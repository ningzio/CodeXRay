
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # iPhone X viewport
        context = await browser.new_context(viewport={'width': 375, 'height': 812})
        page = await context.new_page()

        # Connect to the dev server
        await page.goto("http://localhost:5173/")
        await page.wait_for_load_state("networkidle")

        # Take a screenshot
        await page.screenshot(path="/home/jules/verification/layout_mobile.png")

        # Check scroll height
        scroll_height = await page.evaluate("document.body.scrollHeight")
        window_height = await page.evaluate("window.innerHeight")

        print(f"Mobile - Scroll Height: {scroll_height}, Window Height: {window_height}")

        if scroll_height > window_height:
             print("SUCCESS: Page is scrollable on mobile.")
        else:
             print("FAILURE: Page is NOT scrollable on mobile.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
