export type AlgorithmStep<T> = {
  state: T;
  log?: string;
  highlightIndices?: number[]; // Indices of elements to highlight (e.g., actively comparing)
  secondaryIndices?: number[]; // Indices of secondary interest (e.g., sorted partition)
  activeRange?: [number, number]; // Range [start, end] currently being processed
  codeLabel?: string; // The label of the code line to highlight (e.g., 'compare', 'swap')
};

// The generator function signature
export type AlgorithmGenerator<T> = (initialData: T) => Generator<AlgorithmStep<T>, void, unknown>;

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
