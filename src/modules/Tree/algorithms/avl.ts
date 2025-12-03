import type { AlgorithmGenerator, GraphData, SupportedLanguage, GraphNode, GraphEdge } from "../../../types";

// --- Display Code (Multi-language) ---
export const AVL_CODE: Record<SupportedLanguage, string> = {
  javascript: `class AVLTree {
  insert(node, key) {
    if (!node) return new Node(key); // @label:insert_found

    if (key < node.key) { // @label:insert_search
      node.left = this.insert(node.left, key);
    } else if (key > node.key) {
      node.right = this.insert(node.right, key);
    } else return node;

    node.height = 1 + Math.max(height(node.left), height(node.right)); // @label:update_height
    const balance = getBalance(node); // @label:check_balance

    // Left Left Case
    if (balance > 1 && key < node.left.key) { // @label:check_LL
        return rightRotate(node); // @label:rotate_right
    }
    // Right Right Case
    if (balance < -1 && key > node.right.key) { // @label:check_RR
        return leftRotate(node); // @label:rotate_left
    }
    // Left Right Case
    if (balance > 1 && key > node.left.key) { // @label:check_LR
        node.left = leftRotate(node.left); // @label:rotate_LR_1
        return rightRotate(node); // @label:rotate_LR_2
    }
    // Right Left Case
    if (balance < -1 && key < node.right.key) { // @label:check_RL
        node.right = rightRotate(node.right); // @label:rotate_RL_1
        return leftRotate(node); // @label:rotate_RL_2
    }
    return node;
  }
}`,
  python: `class AVLTree:
    def insert(self, root, key):
        if not root: return Node(key) # @label:insert_found

        if key < root.key: # @label:insert_search
            root.left = self.insert(root.left, key)
        elif key > root.key:
            root.right = self.insert(root.right, key)
        else: return root

        root.height = 1 + max(self.getHeight(root.left), self.getHeight(root.right)) # @label:update_height
        balance = self.getBalance(root) # @label:check_balance

        # Left Left
        if balance > 1 and key < root.left.key: # @label:check_LL
            return self.rightRotate(root) # @label:rotate_right
        # Right Right
        if balance < -1 and key > root.right.key: # @label:check_RR
            return self.leftRotate(root) # @label:rotate_left
        # Left Right
        if balance > 1 and key > root.left.key: # @label:check_LR
            root.left = self.leftRotate(root.left) # @label:rotate_LR_1
            return self.rightRotate(root) # @label:rotate_LR_2
        # Right Left
        if balance < -1 and key < root.right.key: # @label:check_RL
            root.right = self.rightRotate(root.right) # @label:rotate_RL_1
            return self.leftRotate(root) # @label:rotate_RL_2
        return root`,
  go: `func (t *AVLTree) insert(node *Node, key int) *Node {
    if node == nil { return &Node{Key: key, Height: 1} } // @label:insert_found

    if key < node.Key { // @label:insert_search
        node.Left = t.insert(node.Left, key)
    } else if key > node.Key {
        node.Right = t.insert(node.Right, key)
    } else { return node }

    node.Height = 1 + max(height(node.Left), height(node.Right)) // @label:update_height
    balance := getBalance(node) // @label:check_balance

    // Left Left
    if balance > 1 && key < node.Left.Key { // @label:check_LL
        return rightRotate(node) // @label:rotate_right
    }
    // Right Right
    if balance < -1 && key > node.Right.Key { // @label:check_RR
        return leftRotate(node) // @label:rotate_left
    }
    // Left Right
    if balance > 1 && key > node.Left.Key { // @label:check_LR
        node.Left = leftRotate(node.Left) // @label:rotate_LR_1
        return rightRotate(node) // @label:rotate_LR_2
    }
    // Right Left
    if balance < -1 && key < node.Right.Key { // @label:check_RL
        node.Right = rightRotate(node.Right) // @label:rotate_RL_1
        return leftRotate(node) // @label:rotate_RL_2
    }
    return node
}`
};

// --- Internal AVL Logic ---
class AVLNode {
  key: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
  id: string; // Unique ID for visualization stability

  constructor(key: number) {
    this.key = key;
    this.height = 1;
    this.left = null;
    this.right = null;
    this.id = `node-${key}`;
  }
}

// Reconstruct tree from GraphData
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rebuildTreeFromData = (data: GraphData): any => {
    if (!data || !data.nodes || data.nodes.length === 0) return null;

    // This is tricky because GraphData is flattened.
    // However, if we preserve the tree structure in our logic we don't need to rebuild.
    // BUT: The generator receives a SNAPSHOT (deep copy) of GraphData.
    // It does NOT receive the internal `AVLNode` structure.
    // So we MUST rebuild the `AVLNode` tree from `GraphData` to perform operations on it,
    // OR we pass the `AVLNode` root as a hidden part of the state?
    // GraphData is pure JSON.
    // We can rebuild it if we assume a standard structure or traverse edges.

    // Simpler approach:
    // We can assume we start with an empty tree if it's the first run.
    // If it's a subsequent run, we need the `root` from the previous state.
    // `useAlgorithmPlayer` passes `initialData` which is `GraphData`.
    // Rebuilding AVL from purely visual nodes/edges is possible but tedious (parsing edges).

    // Strategy: Rebuild from Edges.
    // Find root (node with no incoming edges).
    // Recursively build children.

    const nodeMap = new Map<string, AVLNode>();
    data.nodes.forEach(n => {
        // Parse key from label or id? ID is `node-{key}`
        const key = parseInt(n.id.replace('node-', ''), 10);
        const node = new AVLNode(key);
        // We might lose height info if not careful, but we can recalculate.
        // Or parse from label "key (H:h)"
        const match = /\(H:(\d+)\)/.exec(n.label || '');
        if (match) node.height = parseInt(match[1], 10);
        nodeMap.set(n.id, node);
    });

    const childIds = new Set<string>();
    data.edges.forEach(e => {
        childIds.add(e.target);
        const source = nodeMap.get(e.source);
        const target = nodeMap.get(e.target);
        if (source && target) {
            if (target.key < source.key) source.left = target;
            else source.right = target;
        }
    });

    const rootId = data.nodes.find(n => !childIds.has(n.id))?.id;
    return rootId ? nodeMap.get(rootId) : null;
};


// --- Helper for Random Generation ---
class AVLTree {
  root: AVLNode | null = null;

  getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  getBalance(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rightRotate(y: AVLNode): AVLNode {
    const x = y.left!;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  leftRotate(x: AVLNode): AVLNode {
    const y = x.right!;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  insert(key: number) {
    this.root = this._insert(this.root, key);
  }

  private _insert(node: AVLNode | null, key: number): AVLNode {
    if (!node) return new AVLNode(key);
    if (key < node.key) node.left = this._insert(node.left, key);
    else if (key > node.key) node.right = this._insert(node.right, key);
    else return node;

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && key < node.left!.key) return this.rightRotate(node);
    if (balance < -1 && key > node.right!.key) return this.leftRotate(node);
    if (balance > 1 && key > node.left!.key) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    if (balance < -1 && key < node.right!.key) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }
    return node;
  }

  toGraphData(): GraphData {
      const nodes: GraphNode[] = [];
      const edges: GraphEdge[] = [];
      const traverse = (node: AVLNode | null, x: number, y: number, offset: number) => {
          if (!node) return;
          nodes.push({
              id: node.id,
              label: `${node.key} (H:${node.height})`,
              x, y,
              status: 'unvisited'
          });
          if (node.left) {
              edges.push({ id: `e-${node.id}-${node.left.id}`, source: node.id, target: node.left.id, status: 'default' });
              traverse(node.left, x - offset, y + 60, offset / 1.8);
          }
          if (node.right) {
              edges.push({ id: `e-${node.id}-${node.right.id}`, source: node.id, target: node.right.id, status: 'default' });
              traverse(node.right, x + offset, y + 60, offset / 1.8);
          }
      };
      traverse(this.root, 400, 50, 160);
      return { nodes, edges, directed: true };
  }
}

export const generateRandomAVLTree = (count: number): GraphData => {
  const avl = new AVLTree();
  const values: number[] = [];
  while(values.length < count) {
      const val = Math.floor(Math.random() * 100) + 1;
      if(!values.includes(val)) values.push(val);
  }
  values.forEach(val => avl.insert(val));
  return avl.toGraphData();
};

// --- Generator ---
export const avlAlgorithm: AlgorithmGenerator<GraphData> = function* (initialData: GraphData, operation?: { type: 'insert' | 'delete' | 'search', value: number }) {

  // Rebuild the tree structure from the visual state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let root: any = rebuildTreeFromData(initialData);

  // Helper functions (inline to capture yields)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getHeight(node: any): number { return node ? node.height : 0; }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getBalance(node: any): number { return node ? getHeight(node.left) - getHeight(node.right) : 0; }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function rightRotate(y: any) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    return x;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function leftRotate(x: any) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    return y;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function toGraphData(currentRoot: any, highlightIds: string[] = []): GraphData {
      const nodes: GraphNode[] = [];
      const edges: GraphEdge[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const traverse = (node: any, x: number, y: number, offset: number) => {
          if (!node) return;
          nodes.push({
              id: node.id,
              label: `${node.key} (H:${node.height})`,
              x, y,
              status: highlightIds.includes(node.id) ? 'visiting' : 'visited'
          });
          if (node.left) {
              edges.push({ id: `e-${node.id}-${node.left.id}`, source: node.id, target: node.left.id, status: 'default' });
              traverse(node.left, x - offset, y + 60, offset / 1.8);
          }
          if (node.right) {
              edges.push({ id: `e-${node.id}-${node.right.id}`, source: node.id, target: node.right.id, status: 'default' });
              traverse(node.right, x + offset, y + 60, offset / 1.8);
          }
      };
      traverse(currentRoot, 400, 50, 160);
      return { nodes, edges, directed: true };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function* insert(node: any, key: number): Generator<any, any, any> {
      if (!node) {
          yield {
             log: `找到位置，插入节点 ${key}`,
             codeLabel: 'insert_found',
             highlights: [`node-${key}`]
          };
          return { key, height: 1, left: null, right: null, id: `node-${key}` };
      }

      yield {
          log: `比较 ${key} 与当前节点 ${node.key}`,
          codeLabel: 'insert_search',
          highlights: [node.id]
      };

      if (key < node.key) {
          node.left = yield* insert(node.left, key);
      } else if (key > node.key) {
          node.right = yield* insert(node.right, key);
      } else {
          return node;
      }

      node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
      const balance = getBalance(node);

      yield {
          log: `更新节点 ${node.key} 高度为 ${node.height}, 平衡因子: ${balance}`,
          codeLabel: 'check_balance',
          highlights: [node.id]
      };

      // LL
      if (balance > 1 && key < node.left.key) {
          yield { log: `触发 LL 旋转 (右旋节点 ${node.key})`, codeLabel: 'check_LL', highlights: [node.id] };
          return rightRotate(node);
      }
      // RR
      if (balance < -1 && key > node.right.key) {
          yield { log: `触发 RR 旋转 (左旋节点 ${node.key})`, codeLabel: 'check_RR', highlights: [node.id] };
          return leftRotate(node);
      }
      // LR
      if (balance > 1 && key > node.left.key) {
          yield { log: `触发 LR 旋转`, codeLabel: 'check_LR', highlights: [node.id] };
          node.left = leftRotate(node.left);
          yield { log: `子节点左旋完成，准备右旋`, codeLabel: 'rotate_LR_1', highlights: [node.id] };
          return rightRotate(node);
      }
      // RL
      if (balance < -1 && key < node.right.key) {
          yield { log: `触发 RL 旋转`, codeLabel: 'check_RL', highlights: [node.id] };
          node.right = rightRotate(node.right);
          yield { log: `子节点右旋完成，准备左旋`, codeLabel: 'rotate_RL_1', highlights: [node.id] };
          return leftRotate(node);
      }

      return node;
  }

  // Minimal logic class for delete (since inline is complex)
  // We can just reuse the one above but adapted to be a generator if we want steps
  // For now, let's keep deletion somewhat atomic or use the same class logic but wrapped.
  // Actually, let's just use the previous logic class for Delete, it's easier.
  // But we need to yield steps.
  // Let's implement a simple recursive delete generator.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function minValueNode(node: any): any {
      let current = node;
      while (current.left) current = current.left;
      return current;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function* deleteNode(root: any, key: number): Generator<any, any, any> {
      if (!root) return root;

      yield { log: `在节点 ${root.key} 处查找删除目标 ${key}`, highlights: [root.id], codeLabel: 'insert_search' };

      if (key < root.key) {
          root.left = yield* deleteNode(root.left, key);
      } else if (key > root.key) {
          root.right = yield* deleteNode(root.right, key);
      } else {
          yield { log: `找到目标节点 ${key}，准备删除`, highlights: [root.id], codeLabel: 'insert_found' };

          if ((!root.left) || (!root.right)) {
              const temp = root.left ? root.left : root.right;
              if (!temp) {
                  // No child case
                  root = null;
              } else {
                  // One child case
                  root = temp;
              }
              yield { log: `节点删除完成`, codeLabel: 'insert_found' }; // Snapshot will be yielded by caller
          } else {
              // Two child case
              const temp = minValueNode(root.right);
              yield { log: `双子节点情况：找到右子树最小值 ${temp.key} 替换`, highlights: [temp.id], codeLabel: 'insert_found' };
              // Avoid duplicate IDs during the transition
              temp.id = `node-${temp.key}-del`;
              root.key = temp.key;
              root.id = `node-${temp.key}`; // stable ID
              root.right = yield* deleteNode(root.right, temp.key);
          }
      }

      if (!root) return root;

      root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));
      const balance = getBalance(root);

      // Balancing
      if (balance > 1 && getBalance(root.left) >= 0) return rightRotate(root);
      if (balance > 1 && getBalance(root.left) < 0) {
          root.left = leftRotate(root.left);
          return rightRotate(root);
      }
      if (balance < -1 && getBalance(root.right) <= 0) return leftRotate(root);
      if (balance < -1 && getBalance(root.right) > 0) {
          root.right = rightRotate(root.right);
          return leftRotate(root);
      }

      return root;
  }

  if (!operation) {
      // Initial load or reset
      yield {
          state: toGraphData(root),
          log: "AVL 树就绪",
          codeLabel: 'insert_found'
      };
      return;
  }

  if (operation.type === 'insert') {
      yield { state: toGraphData(root), log: `准备插入 ${operation.value}...` };

      const generator = insert(root, operation.value);
      let result = generator.next();

      while (!result.done) {
          const stepInfo = result.value;
          const graphData = toGraphData(root, stepInfo.highlights);
          const highlightIndices = graphData.nodes
              .map((n, i) => stepInfo.highlights?.includes(n.id) ? i : -1)
              .filter(i => i !== -1);

          yield {
              state: graphData,
              log: stepInfo.log,
              codeLabel: stepInfo.codeLabel,
              highlightIndices
          };
          result = generator.next();
      }
      root = result.value;
      yield { state: toGraphData(root), log: `插入 ${operation.value} 完成` };
  }
  else if (operation.type === 'search') {
       yield { state: toGraphData(root), log: `搜索值 ${operation.value}...`, codeLabel: 'insert_search' };
       let current = root;
       while(current) {
           const graphData = toGraphData(root, [current.id]);
           const highlightIndices = graphData.nodes.findIndex(n => n.id === current.id);
           yield {
               state: graphData,
               log: `访问节点 ${current.key}`,
               codeLabel: 'insert_search',
               highlightIndices: [highlightIndices]
           };
           if (operation.value === current.key) {
               yield { state: graphData, log: '找到目标值!', codeLabel: 'insert_found', highlightIndices: [highlightIndices] };
               break;
           }
           if (operation.value < current.key) current = current.left;
           else current = current.right;
       }
  }
  else if (operation.type === 'delete') {
      yield { state: toGraphData(root), log: `准备删除 ${operation.value}...` };
      const generator = deleteNode(root, operation.value);
      let result = generator.next();
       while (!result.done) {
          const stepInfo = result.value;
          // During delete, 'root' might be partially modifying, but since we are recursive,
          // the 'root' variable at top level isn't updated until the end.
          // However, we can visualize the *current traversal path* using highlights.
          // Re-rendering the *whole* tree structure during partial recursion is hard without a persistent state object.
          // For now, we yield the OLD structure but with updated highlights,
          // OR we accept that structural updates pop in at the end of each recursion level.

          // Actually, since we don't update 'root' until the end of the top-level call,
          // visual updates to structure won't be seen until the end!
          // This is a limitation of functional recursion without a mutable container.
          // Fix: We can use a mutable wrapper or just rebuild graph from `root` (which is not changing yet).

          // To visualize structural changes *during* rebalancing (rotations deep in tree),
          // we need the recursion to update the reference held by the parent.

          // Simplified: We just visualize the search/traversal. Structural update happens at the end.
          const graphData = toGraphData(root, stepInfo.highlights);
          const highlightIndices = graphData.nodes
              .map((n, i) => stepInfo.highlights?.includes(n.id) ? i : -1)
              .filter(i => i !== -1);

          yield {
              state: graphData,
              log: stepInfo.log,
              codeLabel: stepInfo.codeLabel,
              highlightIndices
          };
          result = generator.next();
      }
      root = result.value;
      yield { state: toGraphData(root), log: `删除 ${operation.value} 完成` };
  }
};
