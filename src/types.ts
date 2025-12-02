export type AlgorithmStep<T> = {
  state: T;
  log?: string;
  highlightIndices?: number[]; // Indices of elements to highlight (e.g., actively comparing)
  secondaryIndices?: number[]; // Indices of secondary interest (e.g., sorted partition)
};

// The generator function signature
export type AlgorithmGenerator<T> = (initialData: T) => Generator<AlgorithmStep<T>, void, unknown>;

export type Algorithm<T> = {
  id: string;
  label: string;
  description?: string;
  run: AlgorithmGenerator<T>;
  complexity?: {
    time: string;
    space: string;
  };
};
