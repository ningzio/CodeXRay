# CodeXRay

## Project Overview

CodeXRay is an interactive, web-based algorithm visualization platform built with **React**, **TypeScript**, and **Vite**. Its primary goal is to provide an "X-Ray vision" into the mechanics of code, helping users understand algorithms and system internals through animations synchronized with source code.

**Key Features:**
*   **Algorithm Visualization:** Dynamic animations for sorting algorithms (Bubble Sort, Quick Sort).
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
