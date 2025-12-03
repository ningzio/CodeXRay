export type AlgorithmStep<T> = {
  state: T;
  log?: string;
  highlightIndices?: number[]; // Indices of elements to highlight (e.g., actively comparing)
  secondaryIndices?: number[]; // Indices of secondary interest (e.g., sorted partition)
  activeRange?: [number, number]; // Range [start, end] currently being processed
  codeLabel?: string; // The label of the code line to highlight (e.g., 'compare', 'swap')
  highlightedEdgeId?: string; // [New] For highlighting a specific edge in graph algorithms
};

// The generator function signature now accepts additional optional arguments
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AlgorithmGenerator<T> = (initialData: T, ...args: any[]) => Generator<AlgorithmStep<T>, void, unknown>;

export type SupportedLanguage = 'javascript' | 'python' | 'go';

export type AlgorithmProfile = {
  complexity: {
    time: string;
    space: string;
    bestCase?: string;
    worstCase?: string;
  };
  description: string; // Short summary
  howItWorks: string; // More detailed explanation
  scenarios: string[]; // When to use
  keyConcepts: string[]; // Key ideas (e.g., "Divide and Conquer")
  pitfalls?: string[]; // Common mistakes / limitations
  links?: { label: string; url: string }[]; // External resources
};

export type Algorithm<T> = {
  id: string;
  label: string;
  profile: AlgorithmProfile;
  run: AlgorithmGenerator<T>;
  code: Record<SupportedLanguage, string>; // Map of language to display code with @label comments
};

// --- Graph Types ---
export type GraphNode = {
  id: string;
  label?: string;
  x?: number; // For visualization positioning
  y?: number; // For visualization positioning
  // Add status for visualization (e.g., visited, exploring)
  status?: 'unvisited' | 'visiting' | 'visited';
};

export type GraphEdge = {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  weight?: number; // For weighted graphs (e.g., Dijkstra)
  // Add status for visualization (e.g., traversed)
  status?: 'default' | 'traversed' | 'active';
};

export type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean; // Is it a directed graph?
};
