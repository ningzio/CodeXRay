import type { AlgorithmGenerator, AlgorithmStep, SupportedLanguage } from "../../../types";

export const QUICK_SORT_CODE: Record<SupportedLanguage, string> = {
  javascript: `async function quickSort(arr, low, high) {
  if (low < high) {
    // Partition the array
    const pi = await partition(arr, low, high); // @label:partition
    
    // Recursively sort elements
    await quickSort(arr, low, pi - 1); // @label:recurse
    await quickSort(arr, pi + 1, high);
  }
}

async function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) { // @label:compare
      i++;
      swap(arr, i, j);    // @label:swap
    }
  }
  swap(arr, i + 1, high); // @label:pivotSwap
  return i + 1;
}`,
  python: `def quick_sort(arr, low, high):
    if low < high:
        # Partition the array
        pi = partition(arr, low, high)  # @label:partition

        # Recursively sort elements
        quick_sort(arr, low, pi - 1)    # @label:recurse
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:              # @label:compare
            i += 1
            arr[i], arr[j] = arr[j], arr[i] # @label:swap
    arr[i + 1], arr[high] = arr[high], arr[i + 1] # @label:pivotSwap
    return i + 1`,
  go: `func quickSort(arr []int, low, high int) {
    if low < high {
        // Partition the array
        pi := partition(arr, low, high) // @label:partition

        // Recursively sort elements
        quickSort(arr, low, pi-1)       // @label:recurse
        quickSort(arr, pi+1, high)
    }
}

func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low - 1

    for j := low; j < high; j++ {
        if arr[j] < pivot {             // @label:compare
            i++
            arr[i], arr[j] = arr[j], arr[i] // @label:swap
        }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1] // @label:pivotSwap
    return i + 1
}`
};

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
      activeRange: [low, high],
      codeLabel: 'recurse'
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
    activeRange: [low, high],
    codeLabel: 'partition'
  };

  for (let j = low; j < high; j++) {
    // If current element is smaller than the pivot
    yield {
      state: [...arr],
      log: `比较 ${arr[j]} < 基准值 (${pivot})?`,
      highlightIndices: [j, high],
      secondaryIndices: [high],
      activeRange: [low, high],
      codeLabel: 'compare'
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
          activeRange: [low, high],
          codeLabel: 'swap'
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
    activeRange: [low, high],
    codeLabel: 'pivotSwap'
  };

  return i + 1;
}