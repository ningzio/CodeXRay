import type { AlgorithmGenerator } from "../../../types";

export const bubbleSort: AlgorithmGenerator<number[]> = function* (inputArray: number[]) {
  // Work on a copy of the array
  const arr = [...inputArray];
  const n = arr.length;

  yield {
    state: [...arr],
    log: "开始冒泡排序...",
    highlightIndices: [],
    secondaryIndices: []
  };

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare arr[j] and arr[j+1]
      yield {
        state: [...arr],
        log: `比较 ${arr[j]} 和 ${arr[j + 1]}`,
        highlightIndices: [j, j + 1],
        secondaryIndices: [n - i] // Boundary of sorted portion
      };

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        yield {
          state: [...arr],
          log: `交换 ${arr[j]} 和 ${arr[j+1]}`,
          highlightIndices: [j, j + 1],
          secondaryIndices: [n - i]
        };
      }
    }
    // Element at n-i-1 is now sorted
    yield {
      state: [...arr],
      log: `元素 ${arr[n - i - 1]} 已归位`,
      highlightIndices: [],
      secondaryIndices: [n - i - 1] // Mark as sorted
    };
  }

  yield {
    state: [...arr],
    log: "排序完成!",
    highlightIndices: [],
    secondaryIndices: []
  };
};
