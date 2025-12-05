import type { AlgorithmGenerator, AlgorithmStep, GraphData, GraphNode, GraphEdge } from "../../../types";

const ORDER = 4; // Max children = 4, Max keys = 3. Min children = 2, Min keys = 1 (except root)

class BPlusNode {
  keys: number[];
  children: BPlusNode[]; // For internal nodes
  next: BPlusNode | null = null; // For leaf nodes
  isLeaf: boolean;
  parent: BPlusNode | null = null;
  id: string;

  constructor(isLeaf: boolean = false) {
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
    this.id = `node-${Math.random().toString(36).substr(2, 9)}`;
  }
}

class BPlusTree {
  root: BPlusNode;

  constructor() {
    this.root = new BPlusNode(true);
  }

  // --- Synchronous Logic for Generation ---
  insertSync(key: number) {
      if (this.root.keys.length === 0 && this.root.isLeaf) {
          this.root.keys.push(key);
          return;
      }

      let current = this.root;
      while (!current.isLeaf) {
          let i = 0;
          while (i < current.keys.length && key >= current.keys[i]) i++;
          current = current.children[i];
      }

      if (current.keys.includes(key)) return;

      let insertPos = 0;
      while (insertPos < current.keys.length && current.keys[insertPos] < key) insertPos++;
      current.keys.splice(insertPos, 0, key);

      if (current.keys.length >= ORDER) {
          this.splitLeafSync(current);
      }
  }

  splitLeafSync(node: BPlusNode) {
      const newLeaf = new BPlusNode(true);
      const mid = Math.floor(node.keys.length / 2);
      newLeaf.keys = node.keys.splice(mid);
      newLeaf.next = node.next;
      node.next = newLeaf;
      this.insertParentSync(node, newLeaf.keys[0], newLeaf);
  }

  insertParentSync(left: BPlusNode, key: number, right: BPlusNode) {
      const parent = left.parent;
      if (!parent) {
          const newRoot = new BPlusNode(false);
          newRoot.keys = [key];
          newRoot.children = [left, right];
          left.parent = newRoot;
          right.parent = newRoot;
          this.root = newRoot;
          return;
      }

      let insertPos = 0;
      while (insertPos < parent.keys.length && parent.keys[insertPos] < key) insertPos++;
      parent.keys.splice(insertPos, 0, key);
      parent.children.splice(insertPos + 1, 0, right);
      right.parent = parent;

      if (parent.keys.length >= ORDER) {
          this.splitInternalSync(parent);
      }
  }

  splitInternalSync(node: BPlusNode) {
      const newInternal = new BPlusNode(false);
      const mid = Math.floor(node.keys.length / 2);
      const upKey = node.keys[mid];
      newInternal.keys = node.keys.splice(mid + 1);
      node.keys.pop();
      newInternal.children = node.children.splice(mid + 1);
      newInternal.children.forEach(c => c.parent = newInternal);
      this.insertParentSync(node, upKey, newInternal);
  }


  // --- Search ---
  search(key: number): { node: BPlusNode, index: number } | null {
    let current = this.root;
    while (!current.isLeaf) {
      let i = 0;
      while (i < current.keys.length && key >= current.keys[i]) {
        i++;
      }
      current = current.children[i];
    }

    // In leaf
    for (let i = 0; i < current.keys.length; i++) {
      if (current.keys[i] === key) {
        return { node: current, index: i };
      }
    }
    return null;
  }

  // --- Layout & Graph Conversion ---
  toGraphData(highlightIds: string[] = []): GraphData {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    const nodePositions = new Map<string, {x: number, y: number}>();

    const getNodeWidth = (node: BPlusNode) => {
        // Base width + key width.
        // Assume roughly 25px per key + 20px padding
        return Math.max(60, node.keys.length * 25 + 20);
    };

    let nextX = 0;
    const Y_SPACING = 100;

    const calculatePositions = (node: BPlusNode, depth: number) => {
       if (node.isLeaf) {
           const width = getNodeWidth(node);
           nodePositions.set(node.id, { x: nextX + width / 2, y: depth * Y_SPACING + 40 });
           nextX += width + 20; // 20px gap between leaves
           return;
       }

       let firstChildX = -1;
       let lastChildX = -1;

       node.children.forEach((child, i) => {
           calculatePositions(child, depth + 1);
           const pos = nodePositions.get(child.id)!;
           if (i === 0) firstChildX = pos.x;
           if (i === node.children.length - 1) lastChildX = pos.x;
       });

       // Center parent above children
       const x = (firstChildX !== -1 && lastChildX !== -1)
          ? (firstChildX + lastChildX) / 2
          : nextX; // Fallback

       nodePositions.set(node.id, { x, y: depth * Y_SPACING + 40 });
    };

    // Reset nextX for layout
    nextX = 50;
    calculatePositions(this.root, 0);

    // Center the whole tree on 800px canvas
    const maxX = nextX;
    const offset = Math.max(0, (800 - maxX) / 2);

    // Build GraphData
    const processNode = (node: BPlusNode) => {
       const pos = nodePositions.get(node.id);
       if (!pos) return;

       const x = pos.x + offset;
       const y = pos.y;

       // Encode keys as label with prefix: "B+:10|20|30"
       const label = `B+:${node.keys.join('|')}`;

       nodes.push({
           id: node.id,
           label,
           x,
           y,
           status: highlightIds.includes(node.id) ? 'visiting' : 'visited',
           color: 'black'
       });

       if (!node.isLeaf) {
           node.children.forEach(child => {
               edges.push({
                   id: `e-${node.id}-${child.id}`,
                   source: node.id,
                   target: child.id,
                   status: 'default'
               });
               processNode(child);
           });
       } else if (node.next) {
           // Leaf link
           edges.push({
               id: `link-${node.id}-${node.next.id}`,
               source: node.id,
               target: node.next.id,
               status: 'active'
           });
       }
    };

    processNode(this.root);

    return { nodes, edges, directed: true };
  }
}

// --- Generator ---
export const bPlusTreeAlgorithm: AlgorithmGenerator<GraphData> = function* (initialData: GraphData, operation?: { type: 'insert' | 'delete' | 'search', value: number }) {

    const tree = new BPlusTree();

    // Helper: Rebuild tree from visual state
    function rebuildFromGraphData(data: GraphData) {
        if (!data || !data.nodes || data.nodes.length === 0) return;

        const nodeMap = new Map<string, BPlusNode>();
        const potentialRoots = new Set<string>();

        // 1. Create Nodes
        data.nodes.forEach(n => {
            // Strip B+: prefix if present
            let cleanLabel = n.label || "";
            if (cleanLabel.startsWith("B+:")) cleanLabel = cleanLabel.substring(3);

            const keys = cleanLabel.length > 0 ? cleanLabel.split('|').map(k => parseInt(k)) : [];
            const node = new BPlusNode();
            node.id = n.id;
            node.keys = keys;
            node.isLeaf = false;
            nodeMap.set(n.id, node);
            potentialRoots.add(n.id);
        });

        // 2. Connect Edges
        data.edges.forEach(e => {
            const source = nodeMap.get(e.source);
            const target = nodeMap.get(e.target);
            if (!source || !target) return;

            if (e.status === 'active') {
                // Leaf Link
                source.next = target;
                source.isLeaf = true;
                target.isLeaf = true;
            } else {
                // Parent-Child
                source.children.push(target);
                target.parent = source;
                potentialRoots.delete(target.id);
            }
        });

        // 3. Identify Root
        if (potentialRoots.size > 0) {
            const rootId = potentialRoots.values().next().value;
            // potentialRoots is Set<string>, rootId is string
            if (rootId) {
                const rootNode = nodeMap.get(rootId);
                if (rootNode) tree.root = rootNode;
            }
        } else if (nodeMap.size > 0) {
             const fallbackRoot = nodeMap.values().next().value;
             if (fallbackRoot) tree.root = fallbackRoot;
        }

        // 4. Refine Structure
        nodeMap.forEach(node => {
            if (node.children.length === 0) node.isLeaf = true;
            if (!node.isLeaf) {
                node.children.sort((a, b) => {
                     const kA = a.keys.length > 0 ? a.keys[0] : 0;
                     const kB = b.keys.length > 0 ? b.keys[0] : 0;
                     return kA - kB;
                });
            }
        });
    }

    rebuildFromGraphData(initialData);


    function* yieldState(log: string, codeLabel?: string, highlights: string[] = []) {
        yield {
            state: tree.toGraphData(highlights),
            log,
            codeLabel,
            highlightIndices: []
        };
    }

    // --- Core Logic ---

    function* insert(key: number) {
        // 1. Search for leaf
        let current = tree.root;

        yield* yieldState(`插入 ${key}: 从根节点开始`, 'insert_start', [current.id]);

        while (!current.isLeaf) {
            let i = 0;
            while (i < current.keys.length && key >= current.keys[i]) {
                i++;
            }
            yield* yieldState(`比较键值，进入第 ${i} 个子节点`, 'insert_search', [current.id]);
            current = current.children[i];
        }

        // 2. Insert into leaf
        yield* yieldState(`到达叶子节点，准备插入`, 'insert_found_leaf', [current.id]);

        let insertPos = 0;
        while (insertPos < current.keys.length && current.keys[insertPos] < key) insertPos++;

        if (insertPos < current.keys.length && current.keys[insertPos] === key) {
             yield* yieldState(`键值 ${key} 已存在`, 'insert_duplicate', [current.id]);
             return;
        }

        current.keys.splice(insertPos, 0, key);
        yield* yieldState(`键值 ${key} 插入叶子节点`, 'insert_add_key', [current.id]);

        // 3. Split if needed
        if (current.keys.length >= ORDER) {
            yield* yieldState(`节点已满 (${current.keys.length} >= ${ORDER})，开始分裂`, 'split_leaf', [current.id]);
            yield* splitLeaf(current);
        } else {
            yield* yieldState(`插入完成`, 'insert_done');
        }
    }

    function* splitLeaf(node: BPlusNode) {
        const newLeaf = new BPlusNode(true);
        const mid = Math.floor(node.keys.length / 2);

        // Move second half to newLeaf
        newLeaf.keys = node.keys.splice(mid);

        // Link leaves
        newLeaf.next = node.next;
        node.next = newLeaf;

        yield* yieldState(`创建新叶子节点，移动一半键值`, 'split_move_keys', [node.id, newLeaf.id]);

        // Propagate to parent
        const splitKey = newLeaf.keys[0]; // Copy up
        yield* insertParent(node, splitKey, newLeaf);
    }

    function* insertParent(left: BPlusNode, key: number, right: BPlusNode): Generator<AlgorithmStep<GraphData>, void, unknown> {
        const parent = left.parent;

        if (!parent) {
            const newRoot = new BPlusNode(false);
            newRoot.keys = [key];
            newRoot.children = [left, right];
            left.parent = newRoot;
            right.parent = newRoot;
            tree.root = newRoot;
            yield* yieldState(`创建新根节点 [${key}]`, 'new_root', [newRoot.id, left.id, right.id]);
            return;
        }

        yield* yieldState(`向上提升键值 ${key}`, 'promote_key', [parent.id]);

        let insertPos = 0;
        while (insertPos < parent.keys.length && parent.keys[insertPos] < key) insertPos++;

        parent.keys.splice(insertPos, 0, key);
        parent.children.splice(insertPos + 1, 0, right);
        right.parent = parent;

        yield* yieldState(`键值插入父节点`, 'parent_inserted', [parent.id]);

        if (parent.keys.length >= ORDER) {
             yield* yieldState(`父节点已满，继续分裂`, 'split_internal', [parent.id]);
             yield* splitInternal(parent);
        }
    }

    function* splitInternal(node: BPlusNode): Generator<AlgorithmStep<GraphData>, void, unknown> {
        const newInternal = new BPlusNode(false);
        const mid = Math.floor(node.keys.length / 2);

        const upKey = node.keys[mid]; // Push up

        // Right side keys
        newInternal.keys = node.keys.splice(mid + 1);
        node.keys.pop(); // Remove mid key

        // Right side children
        newInternal.children = node.children.splice(mid + 1);
        newInternal.children.forEach(c => c.parent = newInternal);

        yield* yieldState(`分裂内部节点`, 'split_internal_exec', [node.id, newInternal.id]);

        yield* insertParent(node, upKey, newInternal);
    }

    function* deleteKey(key: number) {
        let current = tree.root;
        while (!current.isLeaf) {
            let i = 0;
            while (i < current.keys.length && key >= current.keys[i]) i++;
            current = current.children[i];
        }

        const index = current.keys.indexOf(key);
        if (index === -1) {
            yield* yieldState(`未找到 ${key}`, 'delete_not_found');
            return;
        }

        yield* yieldState(`在叶子节点找到 ${key}，删除`, 'delete_found', [current.id]);
        current.keys.splice(index, 1);

        const minKeys = Math.ceil(ORDER / 2) - 1;

        if (current === tree.root) {
             if (current.keys.length === 0) yield* yieldState(`树变空`, 'tree_empty');
             else yield* yieldState(`删除完成`, 'delete_done');
             return;
        }

        if (current.keys.length < minKeys) {
             yield* yieldState(`节点下溢 (keys < ${minKeys})`, 'underflow', [current.id]);
             yield* handleUnderflow(current);
        } else {
             yield* yieldState(`删除完成`, 'delete_done');
        }
    }

    function* handleUnderflow(node: BPlusNode): Generator<AlgorithmStep<GraphData>, void, unknown> {
        if (node === tree.root) {
            if (node.keys.length === 0 && !node.isLeaf) {
                tree.root = node.children[0];
                tree.root.parent = null;
                yield* yieldState(`根节点为空，树高降低`, 'root_shrink');
            }
            return;
        }

        const parent = node.parent!;
        let childIdx = 0;
        while (childIdx < parent.children.length && parent.children[childIdx] !== node) childIdx++;

        const leftSibling = childIdx > 0 ? parent.children[childIdx - 1] : null;
        const rightSibling = childIdx < parent.children.length - 1 ? parent.children[childIdx + 1] : null;

        const minKeys = Math.ceil(ORDER / 2) - 1;

        if (leftSibling && leftSibling.keys.length > minKeys) {
             yield* yieldState(`向左兄弟借位`, 'borrow_left', [node.id, leftSibling.id]);

             if (node.isLeaf) {
                 const borrowed = leftSibling.keys.pop()!;
                 node.keys.unshift(borrowed);
                 parent.keys[childIdx - 1] = node.keys[0]; // Update sep
             } else {
                 const separator = parent.keys[childIdx - 1];
                 const borrowed = leftSibling.keys.pop()!;
                 const borrowedChild = leftSibling.children.pop()!;

                 node.keys.unshift(separator);
                 node.children.unshift(borrowedChild);
                 borrowedChild.parent = node;
                 parent.keys[childIdx - 1] = borrowed;
             }
             yield* yieldState(`借位完成`, 'borrow_done');
             return;
        }

        if (rightSibling && rightSibling.keys.length > minKeys) {
             yield* yieldState(`向右兄弟借位`, 'borrow_right', [node.id, rightSibling.id]);
             if (node.isLeaf) {
                 const borrowed = rightSibling.keys.shift()!;
                 node.keys.push(borrowed);
                 parent.keys[childIdx] = rightSibling.keys[0];
             } else {
                 const separator = parent.keys[childIdx];
                 const borrowed = rightSibling.keys.shift()!;
                 const borrowedChild = rightSibling.children.shift()!;

                 node.keys.push(separator);
                 node.children.push(borrowedChild);
                 borrowedChild.parent = node;
                 parent.keys[childIdx] = borrowed;
             }
             yield* yieldState(`借位完成`, 'borrow_done');
             return;
        }

        if (leftSibling) {
            yield* yieldState(`合并左兄弟`, 'merge_left', [node.id, leftSibling.id]);
            yield* merge(leftSibling, node, childIdx - 1);
        } else if (rightSibling) {
             yield* yieldState(`合并右兄弟`, 'merge_right', [node.id, rightSibling.id]);
            yield* merge(node, rightSibling, childIdx);
        }
    }

    function* merge(left: BPlusNode, right: BPlusNode, separatorIdx: number): Generator<AlgorithmStep<GraphData>, void, unknown> {
        const parent = left.parent!;
        const separator = parent.keys[separatorIdx];

        if (left.isLeaf) {
            left.keys = [...left.keys, ...right.keys];
            left.next = right.next;
        } else {
            left.keys = [...left.keys, separator, ...right.keys];
            left.children = [...left.children, ...right.children];
            left.children.forEach(c => c.parent = left);
        }

        parent.keys.splice(separatorIdx, 1);
        parent.children.splice(separatorIdx + 1, 1);

        yield* yieldState(`合并完成`, 'merge_done', [left.id]);

        if (parent.keys.length < Math.ceil(ORDER / 2) - 1) {
             yield* handleUnderflow(parent);
        }
    }

    function* search(key: number) {
        let current = tree.root;
        yield* yieldState(`搜索 ${key}`, 'search_start', [current.id]);

        while (!current.isLeaf) {
            let i = 0;
            while (i < current.keys.length && key >= current.keys[i]) i++;
            yield* yieldState(`比较...`, 'search_traverse', [current.id]);
            current = current.children[i];
        }

        yield* yieldState(`在叶子节点检查`, 'search_leaf', [current.id]);
        if (current.keys.includes(key)) yield* yieldState(`找到 ${key}`, 'search_found', [current.id]);
        else yield* yieldState(`未找到 ${key}`, 'search_not_found', [current.id]);
    }

    if (operation) {
        if (operation.type === 'insert') yield* insert(operation.value);
        if (operation.type === 'delete') yield* deleteKey(operation.value);
        if (operation.type === 'search') yield* search(operation.value);
    } else {
        yield* yieldState('B+ 树就绪');
    }
};

export const generateRandomBPlusTree = (_count: number): GraphData => {
    const tree = new BPlusTree();

    // Generate 12-15 random numbers
    const count = 12 + Math.floor(Math.random() * 4);
    const values: number[] = [];
    while (values.length < count) {
        const val = Math.floor(Math.random() * 100) + 1;
        if (!values.includes(val)) values.push(val);
    }

    values.forEach(v => tree.insertSync(v));

    return tree.toGraphData();
};
