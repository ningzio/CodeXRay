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
  const leftPart = arr.slice(left, mid + 1);
  const rightPart = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < leftPart.length && j < rightPart.length) {
    const leftVal = leftPart[i];
    const rightVal = rightPart[j];

    if (leftVal <= rightVal) {             // @label:compare
      arr[k++] = leftPart[i++];            // @label:writeBack
    } else {
      arr[k++] = rightPart[j++];           // @label:writeBack
    }
  }

  while (i < leftPart.length) {
    arr[k++] = leftPart[i++];              // @label:copyLeft
  }

  while (j < rightPart.length) {
    arr[k++] = rightPart[j++];             // @label:copyRight
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
    left_part = arr[left:mid+1]
    right_part = arr[mid+1:right+1]
    i, j, k = 0, 0, left

    while i < len(left_part) and j < len(right_part):
        if left_part[i] <= right_part[j]:    # @label:compare
            arr[k] = left_part[i]
            i += 1
        else:
            arr[k] = right_part[j]
            j += 1
        k += 1                              # @label:writeBack

    while i < len(left_part):               # @label:copyLeft
        arr[k] = left_part[i]
        i += 1
        k += 1

    while j < len(right_part):              # @label:copyRight
        arr[k] = right_part[j]
        j += 1
        k += 1
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
    leftPart := append([]int{}, arr[left:mid+1]...)
    rightPart := append([]int{}, arr[mid+1:right+1]...)
    i, j, k := 0, 0, left

    for i < len(leftPart) && j < len(rightPart) {
        if leftPart[i] <= rightPart[j] {     // @label:compare
            arr[k] = leftPart[i]
            i++
        } else {
            arr[k] = rightPart[j]
            j++
        }
        k++                                  // @label:writeBack
    }

    for i < len(leftPart) {                  // @label:copyLeft
        arr[k] = leftPart[i]
        i++
        k++
    }
    for j < len(rightPart) {                 // @label:copyRight
        arr[k] = rightPart[j]
        j++
        k++
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

  const leftPart = arr.slice(left, mid + 1);
  const rightPart = arr.slice(mid + 1, right + 1);
  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftPart.length && j < rightPart.length) {
    const leftIndex = left + i;
    const rightIndex = mid + 1 + j;
    const nextWrite = k;

    yield {
      state: [...arr],
      log: `比较左侧 ${leftPart[i]} 与右侧 ${rightPart[j]}`,
      highlightIndices: [leftIndex, rightIndex],
      secondaryIndices: [left, mid, right, nextWrite],
      activeRange: [left, right],
      codeLabel: 'compare',
    };

    if (leftPart[i] <= rightPart[j]) {
      arr[k] = leftPart[i];
      i++;
    } else {
      arr[k] = rightPart[j];
      j++;
    }

    yield {
      state: [...arr],
      log: `写回位置 ${k} 为 ${arr[k]}`,
      highlightIndices: [k],
      secondaryIndices: [left, right],
      activeRange: [left, right],
      codeLabel: 'writeBack',
    };

    k++;
  }

  while (i < leftPart.length) {
    arr[k] = leftPart[i];

    yield {
      state: [...arr],
      log: `左半剩余元素 ${arr[k]} 写回位置 ${k}`,
      highlightIndices: [k],
      secondaryIndices: [left, mid, right],
      activeRange: [left, right],
      codeLabel: 'copyLeft',
    };

    i++;
    k++;
  }

  while (j < rightPart.length) {
    arr[k] = rightPart[j];

    yield {
      state: [...arr],
      log: `右半剩余元素 ${arr[k]} 写回位置 ${k}`,
      highlightIndices: [k],
      secondaryIndices: [left, mid, right],
      activeRange: [left, right],
      codeLabel: 'copyRight',
    };

    j++;
    k++;
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
