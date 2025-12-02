# CodeXRay: Project Blueprint

> **Vision**: To provide an X-Ray vision into the mechanics of code, from basic algorithms to complex system internals.

## 1. Project Overview (愿景与目标)

**CodeXRay** 是一个旨在将抽象的计算机科学概念转化为交互式可视化动画的教学与演示平台。
我们的目标不仅仅局限于基础算法（如排序、搜索），更致力于揭示复杂系统底层的运作机制（如 Golang GMP 调度、GC 垃圾回收、MySQL 存储引擎页分裂等）。

我们希望用户不仅是“观看”动画，而是通过“控制”时间轴和数据，像医生看 X 光片一样，彻底理解代码的骨架与内脏。

## 2. Technology Stack (技术选型)

*   **Core Framework**: `React` + `TypeScript`
    *   *Rationale*: 强大的组件化模型和类型安全，适合构建复杂的交互逻辑。
*   **Build Tool**: `Vite`
    *   *Rationale*: 极速的开发环境启动与构建体验。
*   **Styling**: `Tailwind CSS`
    *   *Rationale*: 原子化 CSS，高效构建 UI，易于维护。
*   **Animation Engine (2D)**: `Framer Motion`
    *   *Rationale*: 声明式动画 API，完美处理布局变化（Layout animations），适合排序、链表等 2D 场景。
*   **3D Rendering (Future)**: `React Three Fiber (Three.js)`
    *   *Rationale*: 为复杂的拓扑结构或系统架构图提供 3D 视角。

## 3. Architectural Design (架构设计)

为了兼顾简单的排序算法和复杂的系统模拟，我们采用 **"Generator/Snapshot" (生成器/快照)** 模式配合 **"Category Strategy" (分类策略)** 模式。

### 3.1. Core Pattern: Generator & Snapshot
算法逻辑与 UI 渲染完全解耦。

1.  **Logic Layer (Generators)**:
    *   算法不再是一次性执行完毕的函数，而是 `Generator` 函数。
    *   算法执行的每一步，通过 `yield` 产出一个 **Snapshot (快照)**。
    *   *Snapshot* 包含当前时刻的所有状态数据（数组、指针、高亮索引、系统状态日志等）。
    *   **Log Support**: 每一步快照可携带 `log: string`，用于解释当前操作（如 "M1 thread stole G2 from P2"）。

2.  **Control Layer (The Player)**:
    *   通用 Hook `useAlgorithmPlayer<T>` 负责管理时间轴。
    *   功能：`Play`, `Pause`, `Step Forward`, `Step Backward`, `Reset`, `Speed Control`。
    *   它接收 Generator，将其产出的快照序列化为一帧帧的动画。

3.  **View Layer (Visualizers)**:
    *   纯 UI 组件，无状态（Stateless）。
    *   输入：单帧 Snapshot 数据。
    *   输出：对应的视觉图像（2D 柱状图、拓扑图、内存网格等）。

### 3.2. Directory Structure & Modularity
采用按**功能模块 (Modules/Categories)** 组织的结构，而非按文件类型。

```text
src/
├── config/
│   └── registry.ts           # 全局算法注册表 (The Central Registry)
├── hooks/
│   └── useAlgorithmPlayer.ts # 通用播放器逻辑
├── modules/
│   ├── Sorting/              # [Category] 排序算法模块
│   │   ├── algorithms/       # 具体算法实现 (Generators)
│   │   │   ├── bubbleSort.ts
│   │   │   └── quickSort.ts
│   │   ├── components/       # 该类别的专用组件
│   │   │   ├── SortingVisualizer.tsx  # (View) 接收 number[]
│   │   │   └── ArrayInput.tsx         # (Input)
│   │   └── index.ts          # 导出该模块的配置 (Visualizer, Input, Algorithms)
│   │
│   ├── Graph/                # [Category] 图论模块 (Planned)
│   │   ├── components/
│   │   │   ├── GraphVisualizer.tsx    # (View) 接收 {nodes, edges}
│   │   └── ...
│   │
│   └── SystemInternals/      # [Category] 系统底层模块 (Planned)
│       ├── GMP/
│       └── GarbageCollection/
└── components/               # 通用 UI (Layout, PlayerControls)
```

## 4. Roadmap (未来规划)

### Phase 1: Foundation & Sorting (当前阶段)
*   [ ] 初始化项目骨架 (React/TS/Vite)。
*   [ ] 搭建核心架构 (Player Hook + Generator Pattern)。
*   [ ] 实现第一个模块：**Sorting (排序)**。
*   [ ] 实现冒泡排序 (Bubble Sort) 动画原型。

### Phase 2: Advanced Structures
*   [ ] 引入 **Graph (图论)** 模块。
*   [ ] 实现路径搜索算法 (BFS/DFS/Dijkstra)。
*   [ ] 支持自定义节点编辑器。

### Phase 3: System Mechanics (CodeXRay Vision)
*   [ ] **Golang GMP Scheduler**: 可视化 M-P-G 的状态流转与窃取机制。
*   [ ] **Garbage Collection**: 可视化三色标记法 (Tri-color Marking) 在内存堆上的过程。
*   [ ] **Database Internals**: 可视化 B+ Tree 的插入与页分裂 (Page Split)。

---
*Document generated on 2025-12-02. Based on discussions regarding CodeXRay architecture.*
