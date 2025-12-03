from playwright.sync_api import sync_playwright

def verify_dijkstra_graph_text():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto("http://localhost:5173", timeout=10000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            return

        # Find the algorithm selector button.
        # It's a button with role "button" and likely contains "冒泡排序" initially.
        # We can also find it by its generic class if needed, or by placeholder "选择算法" if no initial value (but there is one).

        # Click the dropdown
        # Using a more generic selector for the button inside the dropdown container
        dropdown_button = page.locator("button[aria-haspopup='true']").first
        dropdown_button.click()

        # Wait for menu items
        page.wait_for_selector("div[role='menu']")

        # Find the option containing "Dijkstra"
        # The component uses <a> tags with role="menuitem"
        dijkstra_option = page.get_by_role("menuitem", name="Dijkstra 最短路径")

        # If text match is tricky, try partial
        if not dijkstra_option.is_visible():
             dijkstra_option = page.locator("a[role='menuitem']").filter(has_text="Dijkstra")

        dijkstra_option.click()

        # Wait for graph to render
        page.wait_for_timeout(1000)

        # Take screenshot of the graph visualizer
        graph_area = page.locator("svg").first
        if graph_area.is_visible():
            graph_area.screenshot(path="verification/dijkstra_graph_text.png")
            print("Graph screenshot taken.")
        else:
            print("Graph SVG not found.")

        browser.close()

if __name__ == "__main__":
    verify_dijkstra_graph_text()
