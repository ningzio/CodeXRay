import type { AlgorithmGenerator } from "../../../types";

export const bubbleSort: AlgorithmGenerator<number[]> = function* (inputArray: number[]) {
  // Work on a copy of the array
  const arr = [...inputArray];
  const n = arr.length;

  yield {
    state: [...arr],
    log: "Starting Bubble Sort...",
    highlightIndices: [],
    secondaryIndices: []
  };

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare arr[j] and arr[j+1]
      yield {
        state: [...arr],
        log: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        highlightIndices: [j, j + 1],
        secondaryIndices: [n - i] // Boundary of sorted portion
      };

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        yield {
          state: [...arr],
          log: `Swapped ${arr[j]} (was ${arr[j+1]}) and ${arr[j+1]} (was ${arr[j]})`,
          highlightIndices: [j, j + 1],
          secondaryIndices: [n - i]
        };
      }
    }
    // Element at n-i-1 is now sorted
    yield {
      state: [...arr],
      log: `Element ${arr[n - i - 1]} is now in its sorted position`,
      highlightIndices: [],
      secondaryIndices: [n - i - 1] // Mark as sorted
    };
  }

  yield {
    state: [...arr],
    log: "Sorting completed!",
    highlightIndices: [],
    secondaryIndices: []
  };
};
