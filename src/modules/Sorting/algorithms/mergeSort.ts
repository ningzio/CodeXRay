import type { AlgorithmGenerator, AlgorithmStep, SupportedLanguage } from "../../../types";

export const MERGE_SORT_CODE: Record<SupportedLanguage, string> = {
  javascript: `async function mergeSort(arr, left, right) {
  if (left >= right) return;              // @label:base
  const mid = Math.floor((left + right) / 2);

  await mergeSort(arr, left, mid);        // @label:divideLeft
  await mergeSort(arr, mid + 1, right);   // @label:divideRight
  await merge(arr, left, mid, right);     // @label:mergeStart
}

async function merge(arr, left, mid, right) {
  const merged = [];
  let i = left, j = mid + 1;

  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {               // @label:compare
      merged.push(arr[i]);
      i++;
    } else {
      merged.push(arr[j]);
      j++;
    }
  }

  while (i <= mid) merged.push(arr[i++]);   // @label:copyLeft
  while (j <= right) merged.push(arr[j++]); // @label:copyRight

  for (let k = 0; k < merged.length; k++) {
    arr[left + k] = merged[k];              // @label:writeBack
  }
}`,
  python: `def merge_sort(arr, left, right):
    if left >= right:
        return                          # @label:base
    mid = (left + right) // 2

    merge_sort(arr, left, mid)          # @label:divideLeft
    merge_sort(arr, mid + 1, right)     # @label:divideRight
    merge(arr, left, mid, right)        # @label:mergeStart


def merge(arr, left, mid, right):
    merged = []
    i, j = left, mid + 1

    while i <= mid and j <= right:
        if arr[i] <= arr[j]:            # @label:compare
            merged.append(arr[i])
            i += 1
        else:
            merged.append(arr[j])
            j += 1

    while i <= mid:
        merged.append(arr[i])           # @label:copyLeft
        i += 1
    while j <= right:
        merged.append(arr[j])           # @label:copyRight
        j += 1

    for k, val in enumerate(merged):
        arr[left + k] = val             # @label:writeBack
`,
  go: `func mergeSort(arr []int, left, right int) {
    if left >= right {
        return                          // @label:base
    }
    mid := (left + right) / 2

    mergeSort(arr, left, mid)           // @label:divideLeft
    mergeSort(arr, mid+1, right)        // @label:divideRight
    merge(arr, left, mid, right)        // @label:mergeStart
}

func merge(arr []int, left, mid, right int) {
    merged := []int{}
    i, j := left, mid+1

    for i <= mid && j <= right {
        if arr[i] <= arr[j] {           // @label:compare
            merged = append(merged, arr[i])
            i++
        } else {
            merged = append(merged, arr[j])
            j++
        }
    }

    for i <= mid {                      // @label:copyLeft
        merged = append(merged, arr[i])
        i++
    }
    for j <= right {                    // @label:copyRight
        merged = append(merged, arr[j])
        j++
    }

    for k, val := range merged {
        arr[left+k] = val               // @label:writeBack
    }
}`,
};

export const mergeSort: AlgorithmGenerator<number[]> = function* (inputArray: number[]) {
  const arr = [...inputArray];

  yield {
    state: [...arr],
    log: "开始归并排序...",
    highlightIndices: [],
    secondaryIndices: [],
    activeRange: [0, arr.length - 1],
  };

  yield* mergeSortRecursive(arr, 0, arr.length - 1);

  yield {
    state: [...arr],
    log: "排序完成!",
    highlightIndices: [],
    secondaryIndices: [],
    activeRange: [0, arr.length - 1],
  };
};

function* mergeSortRecursive(
  arr: number[],
  left: number,
  right: number,
): Generator<AlgorithmStep<number[]>, void, unknown> {
  if (left >= right) {
    yield {
      state: [...arr],
      log: `区间 [${left}-${right}] 仅一个元素，视为已排序`,
      highlightIndices: [left],
      secondaryIndices: [],
      activeRange: [left, right],
      codeLabel: 'base',
    };
    return;
  }

  const mid = Math.floor((left + right) / 2);

  yield {
    state: [...arr],
    log: `分治: 左半部分 [${left}-${mid}]`,
    highlightIndices: [],
    secondaryIndices: [left, mid],
    activeRange: [left, mid],
    codeLabel: 'divideLeft',
  };
  yield* mergeSortRecursive(arr, left, mid);

  yield {
    state: [...arr],
    log: `分治: 右半部分 [${mid + 1}-${right}]`,
    highlightIndices: [],
    secondaryIndices: [mid + 1, right],
    activeRange: [mid + 1, right],
    codeLabel: 'divideRight',
  };
  yield* mergeSortRecursive(arr, mid + 1, right);

  yield* merge(arr, left, mid, right);
}

function* merge(
  arr: number[],
  left: number,
  mid: number,
  right: number,
): Generator<AlgorithmStep<number[]>, void, unknown> {
  yield {
    state: [...arr],
    log: `合并区间 [${left}-${mid}] 和 [${mid + 1}-${right}]`,
    highlightIndices: [],
    secondaryIndices: [left, mid, right],
    activeRange: [left, right],
    codeLabel: 'mergeStart',
  };

  let i = left;
  let j = mid + 1;
  const merged: number[] = [];

  while (i <= mid && j <= right) {
    yield {
      state: [...arr],
      log: `比较左侧 ${arr[i]} 与右侧 ${arr[j]}`,
      highlightIndices: [i, j],
      secondaryIndices: [left, mid, right],
      activeRange: [left, right],
      codeLabel: 'compare',
    };

    if (arr[i] <= arr[j]) {
      merged.push(arr[i]);
      i++;
    } else {
      merged.push(arr[j]);
      j++;
    }
  }

  while (i <= mid) {
    merged.push(arr[i]);
    yield {
      state: [...arr],
      log: `左半剩余元素 ${arr[i]} 收集`,
      highlightIndices: [i],
      secondaryIndices: [left, mid, right],
      activeRange: [left, right],
      codeLabel: 'copyLeft',
    };
    i++;
  }

  while (j <= right) {
    merged.push(arr[j]);
    yield {
      state: [...arr],
      log: `右半剩余元素 ${arr[j]} 收集`,
      highlightIndices: [j],
      secondaryIndices: [left, mid, right],
      activeRange: [left, right],
      codeLabel: 'copyRight',
    };
    j++;
  }

  for (let offset = 0; offset < merged.length; offset++) {
    arr[left + offset] = merged[offset];
    yield {
      state: [...arr],
      log: `写回位置 ${left + offset} 为 ${merged[offset]}`,
      highlightIndices: [left + offset],
      secondaryIndices: [left, right],
      activeRange: [left, right],
      codeLabel: 'writeBack',
    };
  }

  yield {
    state: [...arr],
    log: `区间 [${left}-${right}] 已整体有序`,
    highlightIndices: [],
    secondaryIndices: [left, right],
    activeRange: [left, right],
    codeLabel: 'writeBack',
  };
}
