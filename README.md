# CodeXRay: 算法原理可视化与多语言代码同步解析

## 项目简介

CodeXRay 是一个交互式的算法可视化工具，旨在帮助用户直观地理解排序算法的内部工作原理。它将算法动画、实时日志输出与代码高亮同步展示，并支持多种编程语言的代码切换，让学习者能够以自己熟悉的语言追踪算法的每一步执行。

## 主要特性

-   **动画式算法可视化**：动态展示排序过程中数据元素的移动和比较。
-   **递归范围高亮**：特别针对像快速排序这样的递归算法，通过视觉手段清晰地展现当前处理的子数组范围。
-   **多语言代码同步**：支持 JavaScript、Python、Go 等多种语言的算法代码展示，并且代码行高亮与动画完美同步。
-   **实时执行日志**：详细记录算法每一步操作，帮助理解决策过程。
-   **响应式布局**：优化了界面布局，确保在不同设备上都能获得良好的体验。
-   **全中文界面**：为中文用户提供友好的学习环境。

## 已实现算法

-   **冒泡排序 (Bubble Sort)**
-   **快速排序 (Quick Sort)**

## 技术栈

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS
-   **Animation**: Framer Motion
-   **Code Parsing**: 自定义解析器 (支持 `// @label:tag` 和 `# @label:tag` 标记)

## 本地运行

要将 CodeXRay 部署到您的本地机器上，请遵循以下步骤：

1.  **克隆仓库:**
    ```bash
    git clone https://github.com/your-username/CodeXRay.git
    cd CodeXRay
    ```

2.  **安装依赖:**
    ```bash
    npm install
    ```

3.  **启动开发服务器:**
    ```bash
    npm run dev
    ```
    应用将在 `http://localhost:5173/` 上运行。

4.  **构建生产版本 (可选):**
    ```bash
    npm run build
    ```

## 贡献

欢迎社区贡献！如果您有新的算法、语言实现或其他功能改进，请随时提交 Pull Request。

## 许可证

MIT License