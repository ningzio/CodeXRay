# CodeXRay

## Project Overview

CodeXRay is an interactive, web-based algorithm visualization platform built with **React**, **TypeScript**, and **Vite**. Its primary goal is to provide an "X-Ray vision" into the mechanics of code, helping users understand algorithms and system internals through animations synchronized with source code.

**Key Features:**
*   **Algorithm Visualization:** Dynamic animations for sorting algorithms (Bubble Sort, Quick Sort), and now graph algorithms (BFS).
*   **Shadow Code System:** A unique architecture that synchronizes the visualization with source code in multiple languages (**JavaScript**, **Python**, **Go**).
*   **Recursion Visualization:** Visual cues (dimming) to show active recursion ranges in complex algorithms like Quick Sort.
*   **Internationalization:** Fully localized for Chinese users.

## Architecture

The project follows a strict **"Generator/Snapshot"** pattern to decouple algorithmic logic from UI rendering:

1.  **Logic Layer (Generators):** Algorithms are implemented as TypeScript Generator functions. Instead of running to completion, they `yield` a **Snapshot** at every step.
2.  **Control Layer (Player Hook):** A custom hook (`useAlgorithmPlayer`) consumes these snapshots to drive the timeline (Play, Pause, Step).
3.  **View Layer (Visualizers):** Stateless React components render the current snapshot.

**Shadow Code Mapping:**
To support multi-language code highlighting, the project uses a "Shadow Code" system.
*   **Display Code:** Static string constants define the code shown to the user (with special comments like `// @label:swap`).
*   **Execution Mapping:** The running generator yields a `codeLabel` (e.g., `'swap'`), which the UI uses to find and highlight the corresponding line in the currently selected language.

### Component Architecture: Shell + Runner Pattern

To ensure robust state management and type safety when switching between different algorithm types (e.g., array-based sorting vs. graph-based traversal) and their associated initial data, the application employs a **"Shell + Runner" pattern**:

1.  **Shell Component (`App.tsx`):**
    *   Manages top-level state: `selectedAlgoKey` (which algorithm is chosen) and `language`.
    *   Acts as a container, passing the `selectedAlgoKey` down to the `AlgorithmRunner`.

2.  **Runner Component (`AlgorithmRunner` within `App.tsx`):**
    *   This component encapsulates the entire lifecycle of a single algorithm's execution and visualization.
    *   It receives the specific `AlgoConfig` for the `selectedAlgoKey` as a prop.
    *   **Crucially, the `AlgorithmRunner` is rendered with a `key={selectedAlgoKey}`.** This forces React to:
        *   **Unmount** the previous `AlgorithmRunner` instance when `selectedAlgoKey` changes.
        *   **Mount** a brand new `AlgorithmRunner` instance, which will then correctly initialize its internal state (like `currentInitialData` and the `useAlgorithmPlayer` hook) based on the *new* algorithm's configuration.
    *   This pattern guarantees that the `useAlgorithmPlayer` hook (and the generator it runs) always receives an `initialData` that is perfectly matched in type and content to the currently selected algorithm, preventing crashes and ensuring type consistency.

## UI/UX Design Philosophy

CodeXRay's UI is designed to evoke a "Cyber Lab" aesthetic, combining precision with a futuristic feel. It supports both light and dark modes with distinct, yet cohesive, themes.

### Layout
The interface utilizes a **Dashboard** style with a responsive grid layout. A fixed top navigation bar provides global controls, while the main content area is divided into a central visualization stage and an informational sidebar.

### Dark Mode: "Deep Space" Theme
*   **Concept**: Mimics a high-tech console in deep space, observing cosmic phenomena.
*   **Color Palette**:
    *   **Background**: Deep `Slate-950` base.
    *   **Primary Accent**: Vibrant `Cyan-500` for data flow and energy.
    *   **Secondary Accent**: Deep `Violet-600` for underlying logic and mystery.
    *   **Highlight**: `Emerald-400` for success and confirmation.
*   **Background Effect**: Animated **"X-Ray Scanning Beams"** (conic gradients) slowly rotating, suggesting a high-tech scanning process.
*   **Card Texture**: Glassmorphism cards with subtle, bright borders and soft inner shadows (`dark:shadow-2xl dark:shadow-black/50`) to give a holographic feel.

### Light Mode: "Aurora Lab" Theme
*   **Concept**: A clean, professional laboratory bathed in soft, dawn-like lighting, focusing on clarity and precision.
*   **Color Palette**:
    *   **Background**: Clean `Slate-50` base.
    *   **Primary Accent**: Invigorating `Indigo-500` for wisdom and insight.
    *   **Secondary Accent**: Fresh `Cyan-400` for innovation and clarity.
    *   **Highlight**: `Rose-400` for vitality and attention.
*   **Background Effect**: Soft **"Aurora Glow"** (radial gradient blobs) subtly animating, providing depth and a calm, focused environment.
*   **Card Texture**: Elegant Glassmorphism cards with crisp borders and subtle shadows, maintaining a clean yet layered appearance.

### General Design Elements
*   **Glassmorphism**: Extensive use of frosted glass effects for cards and interactive elements, enhancing depth and focus.
*   **Typography**: Monospaced fonts for code and data (`font-mono`) for precision, modern sans-serif fonts for headings and UI text.
*   **Micro-interactions**: Subtle hover effects, smooth transitions, and animated states for a refined user experience.

## Building and Running

The project uses `npm` for dependency management and `vite` for building.

### Prerequisites
*   Node.js (Latest LTS recommended)
*   npm

### Commands

*   **Install Dependencies:**
    ```bash
    npm install
    ```

*   **Start Development Server:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

*   **Build for Production:**
    ```bash
    npm run build
    ```

*   **Lint Code:**
    ```bash
    npm run lint
    ```

## Directory Structure

The codebase is organized by **functional modules** rather than file types:

```text
src/
├── components/           # Shared UI components
│   └── ui/
│       ├── CodeViewer.tsx    # Renders code with highlighting
│       └── PlayerControls.tsx
├── hooks/                # Global hooks
│   └── useAlgorithmPlayer.ts # Core logic for animation playback
├── modules/              # Feature modules
│   ├── Graph/            # [New] Graph Algorithms module
│   │   ├── algorithms/       # e.g., bfs.ts
│   │   └── components/       # e.g., GraphVisualizer.tsx
│   ├── Sorting/
│   │   ├── algorithms/       # Algorithm generators & code strings
│   │   └── components/       # Visualization components
│   └── ...
├── utils/                # Helper utilities (e.g., code parser)
└── types.ts              # Global type definitions (AlgorithmStep, etc.)
```

## Development Conventions

*   **Algorithm Implementation:** All new algorithms must be implemented as Generators.
*   **Immutability:** Snapshots yielded by generators must contain **copies** of mutable data (e.g., arrays) to ensure time-travel (undo/redo) works correctly.
*   **Multi-Language Support:** When adding an algorithm, you must provide implementations/strings for all supported languages (JS, Python, Go) and ensure `// @label` tags are consistent.
*   **Algorithm Type Safety**: When adding new algorithm categories (e.g., Graph), ensure the `AlgoConfig` in `App.tsx` correctly defines `getInitialData` and `Visualizer` components for that type. If the data type changes significantly, consider if `AlgorithmRunner` needs further generic typing or if the `key` prop adequately handles the reset.