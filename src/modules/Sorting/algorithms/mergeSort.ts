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
  const temp = [];
  let i = left, j = mid + 1;

  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {               // @label:compare
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }

  while (i <= mid) temp.push(arr[i++]);   // @label:copyLeft
  while (j <= right) temp.push(arr[j++]); // @label:copyRight

  for (let k = 0; k < temp.length; k++) {
    arr[left + k] = temp[k];              // @label:writeBack
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
    temp = []
    i, j = left, mid + 1

    while i <= mid and j <= right:
        if arr[i] <= arr[j]:            # @label:compare
            temp.append(arr[i])
            i += 1
        else:
            temp.append(arr[j])
            j += 1

    while i <= mid:
        temp.append(arr[i])             # @label:copyLeft
        i += 1
    while j <= right:
        temp.append(arr[j])             # @label:copyRight
        j += 1

    for k, val in enumerate(temp):
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
    temp := []int{}
    i, j := left, mid+1

    for i <= mid && j <= right {
        if arr[i] <= arr[j] {           // @label:compare
            temp = append(temp, arr[i])
            i++
        } else {
            temp = append(temp, arr[j])
            j++
        }
    }

    for i <= mid {                      // @label:copyLeft
        temp = append(temp, arr[i])
        i++
    }
    for j <= right {                    // @label:copyRight
        temp = append(temp, arr[j])
        j++
    }

    for k, val := range temp {
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

  const leftSlice = arr.slice(left, mid + 1);
  const rightSlice = arr.slice(mid + 1, right + 1);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftSlice.length && j < rightSlice.length) {
    const leftVal = leftSlice[i];
    const rightVal = rightSlice[j];

    yield {
      state: [...arr],
      log: `比较左侧 ${leftVal} 与右侧 ${rightVal}`,
      highlightIndices: [left + i, mid + 1 + j],
      secondaryIndices: [left, mid, right],
      activeRange: [left, right],
      codeLabel: 'compare',
    };

    if (leftVal <= rightVal) {
      arr[k] = leftVal;
      i++;
    } else {
      arr[k] = rightVal;
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

  while (i < leftSlice.length) {
    arr[k] = leftSlice[i];
    yield {
      state: [...arr],
      log: `左半剩余元素 ${arr[k]} 写回`,
      highlightIndices: [k],
      secondaryIndices: [left, mid, right],
      activeRange: [left, right],
      codeLabel: 'copyLeft',
    };
    i++;
    k++;
  }

  while (j < rightSlice.length) {
    arr[k] = rightSlice[j];
    yield {
      state: [...arr],
      log: `右半剩余元素 ${arr[k]} 写回`,
      highlightIndices: [k],
      secondaryIndices: [left, mid, right],
      activeRange: [left, right],
      codeLabel: 'copyRight',
    };
    j++;
    k++;
  }
}
