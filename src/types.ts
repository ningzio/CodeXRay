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
export type AlgorithmGenerator<T> = (initialData: T, ...args: any[]) => Generator<AlgorithmStep<T>, void, unknown>;

export type SupportedLanguage = 'javascript' | 'python' | 'go';

export type Algorithm<T> = {
  id: string;
  label: string;
  description?: string;
  run: AlgorithmGenerator<T>;
  complexity?: {
    time: string;
    space: string;
  };
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
