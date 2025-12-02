import type { AlgorithmGenerator, AlgorithmStep } from "../../../types";

export const quickSort: AlgorithmGenerator<number[]> = function* (inputArray: number[]) {
  const arr = [...inputArray];
  const n = arr.length;

  yield {
    state: [...arr],
    log: "开始快速排序...",
    highlightIndices: [],
    secondaryIndices: [],
    activeRange: [0, n - 1]
  };

  yield* _quickSort(arr, 0, n - 1);

  yield {
    state: [...arr],
    log: "排序完成!",
    highlightIndices: [],
    secondaryIndices: [],
    activeRange: [0, n - 1]
  };
};

function* _quickSort(arr: number[], low: number, high: number): Generator<AlgorithmStep<number[]>, void, unknown> {
  if (low <= high) {
     // Highlight the current active range immediately upon entering recursion
    yield {
        state: [...arr],
        log: `进入递归分区范围: [${low} - ${high}]`,
        highlightIndices: [],
        secondaryIndices: [],
        activeRange: [low, high]
    };

    if (low < high) {
        // Partition the array and get the pivot index
        const pi = yield* partition(arr, low, high);

        // Recursively sort elements before partition and after partition
        yield* _quickSort(arr, low, pi - 1);
        yield* _quickSort(arr, pi + 1, high);
    } else {
        // Base case: Single element is already sorted
        yield {
            state: [...arr],
            log: `范围 [${low}-${high}] 只有一个元素，已有序`,
            highlightIndices: [low],
            secondaryIndices: [],
            activeRange: [low, high]
        };
    }
  }
}

function* partition(arr: number[], low: number, high: number): Generator<AlgorithmStep<number[]>, number, unknown> {
  const pivot = arr[high]; // Choosing the last element as pivot
  let i = low - 1; // Index of smaller element

  yield {
    state: [...arr],
    log: `分区 [${low}...${high}] 基准值(Pivot): ${pivot}`,
    highlightIndices: [high],
    secondaryIndices: [high], // Pivot indicated by secondary color
    activeRange: [low, high]
  };

  for (let j = low; j < high; j++) {
    // If current element is smaller than the pivot
    yield {
        state: [...arr],
        log: `比较 ${arr[j]} < 基准值 (${pivot})?`,
        highlightIndices: [j, high],
        secondaryIndices: [high],
        activeRange: [low, high]
    };

    if (arr[j] < pivot) {
      i++;
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
      
      if (i !== j) {
          yield {
            state: [...arr],
            log: `交换 ${arr[i]} 和 ${arr[j]}`,
            highlightIndices: [i, j],
            secondaryIndices: [high],
            activeRange: [low, high]
          };
      }
    }
  }

  // Swap arr[i+1] and arr[high] (or pivot)
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  yield {
    state: [...arr],
    log: `基准值 ${pivot} 归位至索引 ${i + 1}`,
    highlightIndices: [i + 1, high],
    secondaryIndices: [i + 1],
    activeRange: [low, high]
  };

  return i + 1;
}
