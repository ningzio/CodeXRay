import type { AlgorithmGenerator, AlgorithmStep } from "../../../types";

export const quickSort: AlgorithmGenerator<number[]> = function* (inputArray: number[]) {
  const arr = [...inputArray];
  const n = arr.length;

  yield {
    state: [...arr],
    log: "Starting Quick Sort...",
    highlightIndices: [],
    secondaryIndices: []
  };

  yield* _quickSort(arr, 0, n - 1);

  yield {
    state: [...arr],
    log: "Sorting completed!",
    highlightIndices: [],
    secondaryIndices: [] 
  };
};

function* _quickSort(arr: number[], low: number, high: number): Generator<AlgorithmStep<number[]>, void, unknown> {
  if (low < high) {
    // Partition the array and get the pivot index
    const pi = yield* partition(arr, low, high);

    // Recursively sort elements before partition and after partition
    yield* _quickSort(arr, low, pi - 1);
    yield* _quickSort(arr, pi + 1, high);
  }
}

function* partition(arr: number[], low: number, high: number): Generator<AlgorithmStep<number[]>, number, unknown> {
  const pivot = arr[high]; // Choosing the last element as pivot
  let i = low - 1; // Index of smaller element

  yield {
    state: [...arr],
    log: `Partitioning [${low}...${high}] with Pivot ${pivot}`,
    highlightIndices: [high],
    secondaryIndices: [high] // Pivot indicated by secondary color
  };

  for (let j = low; j < high; j++) {
    // If current element is smaller than the pivot
    yield {
        state: [...arr],
        log: `Comparing ${arr[j]} < Pivot (${pivot})?`,
        highlightIndices: [j, high],
        secondaryIndices: [high]
    };

    if (arr[j] < pivot) {
      i++;
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
      
      if (i !== j) {
          yield {
            state: [...arr],
            log: `Swapped ${arr[i]} and ${arr[j]}`,
            highlightIndices: [i, j],
            secondaryIndices: [high]
          };
      }
    }
  }

  // Swap arr[i+1] and arr[high] (or pivot)
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  yield {
    state: [...arr],
    log: `Placed Pivot ${pivot} at index ${i + 1}`,
    highlightIndices: [i + 1, high],
    secondaryIndices: [i + 1]
  };

  return i + 1;
}
