import type { AlgorithmGenerator, SupportedLanguage } from "../../../types";

export const BUBBLE_SORT_CODE: Record<SupportedLanguage, string> = {
  javascript: `async function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) { // @label:compare
        // Swap elements
        let temp = arr[j];       // @label:swap
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
    // Element is sorted         // @label:sorted
  }
}`,
  python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:  # @label:compare
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]  # @label:swap
        
        # Element is sorted at n-i-1 # @label:sorted`,
  go: `func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] { // @label:compare
                // Swap elements
                arr[j], arr[j+1] = arr[j+1], arr[j] // @label:swap
            }
        }
        // Element is sorted at n-i-1 // @label:sorted
    }
}`
};

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
        secondaryIndices: [n - i], // Boundary of sorted portion
        codeLabel: 'compare'
      };

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        yield {
          state: [...arr],
          log: `交换 ${arr[j]} 和 ${arr[j+1]}`,
          highlightIndices: [j, j + 1],
          secondaryIndices: [n - i],
          codeLabel: 'swap'
        };
      }
    }
    // Element at n-i-1 is now sorted
    yield {
      state: [...arr],
      log: `元素 ${arr[n - i - 1]} 已归位`,
      highlightIndices: [],
      secondaryIndices: [n - i - 1], // Mark as sorted
      codeLabel: 'sorted'
    };
  }

  yield {
    state: [...arr],
    log: "排序完成!",
    highlightIndices: [],
    secondaryIndices: []
  };
};