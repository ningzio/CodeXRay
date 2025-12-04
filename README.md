# CodeXRay: AI-Driven Algorithm Visualization Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 项目简介 (Project Overview)

CodeXRay 是一个 **AI 驱动的开源算法可视化平台**，旨在通过 "X-Ray" 般的透视能力，帮助开发者和学习者深入理解代码的内部运行机制。

与传统的算法动画不同，CodeXRay 强调 **"代码与逻辑的同步"**。它不仅展示数据移动的动画，还通过独创的 **"Shadow Code System"** 将动画帧与源代码（JavaScript, Python, Go）逐行映射，让用户能够以自己熟悉的编程语言追踪算法的每一次决策。

本项目是一个探索 **AI 辅助软件工程** 的实验场，从代码生成到文档维护，AI 在其中扮演了核心角色。

## 🎯 项目目标 (Goals)

1.  **直观理解 (Intuition):** 通过高质量的动画和交互，打破算法的抽象壁垒。
2.  **多语言对照 (Polyglot):** 支持多种主流编程语言，帮助开发者跨语言理解算法实现。
3.  **战术手册 (Tactical Handbook):** 提供超越教科书定义的实战指南（适用场景、坑点、最佳实践）。
4.  **工程示范 (Engineering Demo):** 展示现代前端架构（React + TypeScript + Vite）与 AI 协作的最佳实践。

## 🏗️ 架构设计 (Architecture)

CodeXRay 采用了一系列先进的设计模式来确保扩展性和性能：

### 1. Generator/Snapshot 模式 (逻辑与视图分离)
为了实现可逆的时间轴控制（播放、暂停、回退），我们不直接在组件中执行算法。
-   **Generators:** 算法逻辑被封装为 TypeScript Generator 函数。
-   **Snapshots:** 算法的每一步操作都会 `yield` 一个不可变的状态快照 (Snapshot)。
-   **Player:** 视图层通过消费这些快照来驱动动画，从而实现无副作用的时间旅行调试。

### 2. Shadow Code System (影子代码系统)
这是实现代码高亮同步的核心机制。
-   **Display Code:** 预定义的静态代码字符串，包含特殊的锚点注释 (例如 `// @label:swap`)。
-   **Execution Mapping:** 运行时的 Generator 会抛出对应的 `label`，系统捕捉该 label 并自动高亮当前语言对应的代码行。

### 3. Shell + Runner 模式
为了处理不同类型算法（如数组排序 vs 图论算法）的差异，采用了 `Shell` 管理全局状态，`Runner` 组件通过 `key` 强制重置生命周期的策略，确保不同算法间的数据隔离和类型安全。

## 🛠️ 开发规范 (Development Standards)

### 技术栈
-   **Frontend:** React 18, TypeScript, Vite
-   **Styling:** Tailwind CSS (支持深色/浅色主题)
-   **Animation:** Framer Motion
-   **State Management:** React Hooks + Generators

### 目录结构
项目采用 **"按功能模块 (Feature-based)"** 的组织方式：
```text
src/
├── modules/              # 核心功能模块
│   ├── Sorting/          # 排序算法模块
│   │   ├── algorithms/   # 纯逻辑 (Generators)
│   │   └── components/   # 专用可视化组件
│   ├── Graph/            # 图论算法模块
│   └── ...
├── components/           # 通用 UI 组件 (CodeViewer, PlayerControls)
├── hooks/                # 全局 Hooks (useAlgorithmPlayer)
└── types.ts              # 类型定义
```

### 贡献指南
1.  **Immutability:** 所有算法 Generator 必须产出数据的深拷贝，禁止直接修改上一帧的状态。
2.  **Tactical Content:** 添加新算法时，必须完善 "Algorithm Intelligence" 面板，提供复杂度、适用场景等战术信息。
3.  **Clean Code:** 遵循 ESLint 和 Prettier 规范。

## 🚀 未来规划 (Roadmap)

-   [ ] **更多算法库:** 覆盖动态规划、贪心算法、树/图的高级算法 (AVL, Red-Black Tree)。
-   [ ] **自定义输入:** 允许用户输入自定义数据集进行可视化。
-   [ ] **AI 助手集成:** 集成 LLM 以提供实时的代码解释和问答功能。
-   [ ] **移动端优化:** 进一步优化在手机和平板上的交互体验。
-   [ ] **性能分析:** 实时展示算法运行的时间/空间复杂度图表。

## 💻 本地运行 (Getting Started)

1.  **克隆仓库:**
    ```bash
    git clone https://github.com/ningzio/CodeXRay.git
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

4.  **构建:**
    ```bash
    npm run build
    ```

## 📄 许可证

MIT License
