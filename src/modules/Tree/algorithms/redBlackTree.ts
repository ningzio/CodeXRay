import type { AlgorithmGenerator, GraphData, SupportedLanguage, GraphNode, GraphEdge } from "../../../types";

// --- Display Code ---
export const RED_BLACK_TREE_CODE: Record<SupportedLanguage, string> = {
  javascript: `class RedBlackTree {
  insert(key) {
    const node = new Node(key, 'RED'); // @label:create_node
    this._insert(node); // @label:insert_bst
    this.fixInsert(node); // @label:fix_insert
  }

  fixInsert(node) {
    while (node.parent && node.parent.color === 'RED') { // @label:check_parent_red
      if (node.parent === node.parent.parent.left) {
        const uncle = node.parent.parent.right;
        if (uncle && uncle.color === 'RED') { // @label:case_1_uncle_red
          node.parent.color = 'BLACK';
          uncle.color = 'BLACK';
          node.parent.parent.color = 'RED'; // @label:recolor_grandparent
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) { // @label:case_2_triangle
            node = node.parent;
            this.leftRotate(node); // @label:rotate_left
          }
          node.parent.color = 'BLACK'; // @label:case_3_line
          node.parent.parent.color = 'RED';
          this.rightRotate(node.parent.parent); // @label:rotate_right
        }
      } else {
        // Symmetric case
      }
    }
    this.root.color = 'BLACK'; // @label:root_black
  }

  delete(key) {
     const node = this.search(key);
     if (!node) return;
     let y = node;
     let yOriginalColor = y.color;
     let x;
     if (!node.left) {
        x = node.right;
        this.transplant(node, node.right);
     } else if (!node.right) {
        x = node.left;
        this.transplant(node, node.left);
     } else {
        y = this.minimum(node.right);
        yOriginalColor = y.color;
        x = y.right;
        if (y.parent === node) {
            if(x) x.parent = y;
        } else {
            this.transplant(y, y.right);
            y.right = node.right;
            y.right.parent = y;
        }
        this.transplant(node, y);
        y.left = node.left;
        y.left.parent = y;
        y.color = node.color;
     }
     if (yOriginalColor === 'BLACK') {
        this.deleteFixup(x);
     }
  }
}`,
  python: `class RedBlackTree:
    def insert(self, key):
        node = Node(key, 'RED') # @label:create_node
        self._insert(node) # @label:insert_bst
        self.fix_insert(node) # @label:fix_insert

    def fix_insert(self, node):
        while node.parent and node.parent.color == 'RED': # @label:check_parent_red
            if node.parent == node.parent.parent.left:
                uncle = node.parent.parent.right
                if uncle and uncle.color == 'RED': # @label:case_1_uncle_red
                    node.parent.color = 'BLACK'
                    uncle.color = 'BLACK'
                    node.parent.parent.color = 'RED' # @label:recolor_grandparent
                    node = node.parent.parent
                else:
                    if node == node.parent.right: # @label:case_2_triangle
                        node = node.parent
                        self.left_rotate(node) # @label:rotate_left
                    node.parent.color = 'BLACK' # @label:case_3_line
                    node.parent.parent.color = 'RED'
                    self.right_rotate(node.parent.parent) # @label:rotate_right
            else:
                # Symmetric case
                pass
        self.root.color = 'BLACK' # @label:root_black

    def delete(self, key):
        z = self.search(key)
        if not z: return
        y = z
        y_original_color = y.color
        if not z.left:
            x = z.right
            self.transplant(z, z.right)
        elif not z.right:
            x = z.left
            self.transplant(z, z.left)
        else:
            y = self.minimum(z.right)
            y_original_color = y.color
            x = y.right
            if y.parent == z:
                if x: x.parent = y
            else:
                self.transplant(y, y.right)
                y.right = z.right
                y.right.parent = y
            self.transplant(z, y)
            y.left = z.left
            y.left.parent = y
            y.color = z.color
        if y_original_color == 'BLACK':
            self.delete_fixup(x)`,
  go: `func (t *RedBlackTree) Insert(key int) {
    node := &Node{Key: key, Color: RED} // @label:create_node
    t.insertBST(node) // @label:insert_bst
    t.fixInsert(node) // @label:fix_insert
}

func (t *RedBlackTree) fixInsert(node *Node) {
    for node.Parent != nil && node.Parent.Color == RED { // @label:check_parent_red
        if node.Parent == node.Parent.Parent.Left {
            uncle := node.Parent.Parent.Right
            if uncle != nil && uncle.Color == RED { // @label:case_1_uncle_red
                node.Parent.Color = BLACK
                uncle.Color = BLACK
                node.Parent.Parent.Color = RED // @label:recolor_grandparent
                node = node.Parent.Parent
            } else {
                if node == node.Parent.Right { // @label:case_2_triangle
                    node = node.Parent
                    t.LeftRotate(node) // @label:rotate_left
                }
                node.Parent.Color = BLACK // @label:case_3_line
                node.Parent.Parent.Color = RED
                t.RightRotate(node.Parent.Parent) // @label:rotate_right
            }
        } else {
            // Symmetric case
        }
    }
    t.Root.Color = BLACK // @label:root_black
}

func (t *RedBlackTree) Delete(key int) {
    z := t.Search(key)
    if z == nil { return }
    y := z
    yOriginalColor := y.Color
    var x *Node
    if z.Left == nil {
        x = z.Right
        t.Transplant(z, z.Right)
    } else if z.Right == nil {
        x = z.Left
        t.Transplant(z, z.Left)
    } else {
        y = t.Minimum(z.Right)
        yOriginalColor = y.Color
        x = y.Right
        if y.Parent == z {
            if x != nil { x.Parent = y }
        } else {
            t.Transplant(y, y.Right)
            y.Right = z.Right
            y.Right.Parent = y
        }
        t.Transplant(z, y)
        y.Left = z.Left
        y.Left.Parent = y
        y.Color = z.Color
    }
    if yOriginalColor == BLACK {
        t.DeleteFixup(x)
    }
}`
};

// --- Internal Logic ---
type Color = 'RED' | 'BLACK';

class RBNode {
    key: number;
    color: Color;
    left: RBNode | null = null;
    right: RBNode | null = null;
    parent: RBNode | null = null;
    id: string;

    constructor(key: number, color: Color = 'RED', id?: string) {
        this.key = key;
        this.color = color;
        this.id = id || `node-${key}`;
    }
}

class RedBlackTree {
    root: RBNode | null = null;

    // Helper to rotate left
    leftRotate(x: RBNode) {
        const y = x.right;
        if (!y) return;
        x.right = y.left;
        if (y.left) y.left.parent = x;
        y.parent = x.parent;
        if (!x.parent) this.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x;
        x.parent = y;
    }

    // Helper to rotate right
    rightRotate(y: RBNode) {
        const x = y.left;
        if (!x) return;
        y.left = x.right;
        if (x.right) x.right.parent = y;
        x.parent = y.parent;
        if (!y.parent) this.root = x;
        else if (y === y.parent.left) y.parent.left = x;
        else y.parent.right = x;
        x.right = y;
        y.parent = x;
    }

    // BST Insert
    insertBST(node: RBNode) {
        let y: RBNode | null = null;
        let x = this.root;
        while (x) {
            y = x;
            if (node.key < x.key) x = x.left;
            else x = x.right;
        }
        node.parent = y;
        if (!y) this.root = node;
        else if (node.key < y.key) y.left = node;
        else y.right = node;
    }

    // Convert to GraphData for visualization
    toGraphData(highlightIds: string[] = []): GraphData {
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];

        const traverse = (node: RBNode | null, x: number, y: number, offset: number) => {
            if (!node) {
                // Optionally visualize NIL nodes (usually black squares).
                // For simplicity, we skip them or could render them if needed.
                return;
            }

            nodes.push({
                id: node.id,
                label: `${node.key}`,
                x, y,
                color: node.color === 'RED' ? 'red' : 'black',
                status: highlightIds.includes(node.id) ? 'visiting' : 'visited' // highlights override status in visualizer
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

// Rebuilds tree structure from GraphData (approximate, since we lose parent pointers in JSON)
const rebuildTree = (data: GraphData): RedBlackTree => {
    const tree = new RedBlackTree();
    if (!data || !data.nodes || data.nodes.length === 0) return tree;

    const nodeMap = new Map<string, RBNode>();

    // 1. Create nodes
    data.nodes.forEach(n => {
        const key = parseInt(n.label || '0', 10);
        const color = n.color === 'red' ? 'RED' : 'BLACK';
        const node = new RBNode(key, color, n.id);
        nodeMap.set(n.id, node);
    });

    // 2. Link edges
    data.edges.forEach(e => {
        const source = nodeMap.get(e.source);
        const target = nodeMap.get(e.target);
        if (source && target) {
            // Determine left or right based on key
            if (target.key < source.key) source.left = target;
            else source.right = target;
            target.parent = source;
        }
    });

    // 3. Find root
    const rootId = data.nodes.find(n => !nodeMap.get(n.id)?.parent)?.id;
    if (rootId) tree.root = nodeMap.get(rootId) || null;

    return tree;
};


// --- Generator ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const redBlackTreeAlgorithm: AlgorithmGenerator<GraphData> = function* (initialData: GraphData, operation?: { type: 'insert' | 'delete' | 'search' | 'modify', value: number, targetValue?: number }) {

    const tree = rebuildTree(initialData);

    // Helper to yield state
    function* yieldState(log: string, codeLabel?: string, highlights: string[] = []) {
        const graphData = tree.toGraphData(highlights);
        const highlightIndices = graphData.nodes
            .map((n, i) => highlights.includes(n.id) ? i : -1)
            .filter(i => i !== -1);

        yield {
            state: graphData,
            log,
            codeLabel,
            highlightIndices
        };
    }

    // Insert Logic with Yields
    function* insert(key: number) {
        // Check for duplicates
        let temp = tree.root;
        while(temp) {
            if (temp.key === key) {
                yield* yieldState(`键值 ${key} 已存在，忽略插入`, 'insert_bst', [temp.id]);
                return;
            }
            if (key < temp.key) temp = temp.left;
            else temp = temp.right;
        }

        const node = new RBNode(key, 'RED');

        yield* yieldState(`创建新节点 ${key} (红色)`, 'create_node', [node.id]);

        // Standard BST Insert
        let y: RBNode | null = null;
        let x = tree.root;

        yield* yieldState(`开始 BST 插入查找位置...`, 'insert_bst', x ? [x.id] : []);

        while (x) {
            y = x;
            if (node.key < x.key) {
                 yield* yieldState(`比较: ${node.key} < ${x.key}, 向左走`, 'insert_bst', [x.id]);
                 x = x.left;
            }
            else {
                 yield* yieldState(`比较: ${node.key} > ${x.key}, 向右走`, 'insert_bst', [x.id]);
                 x = x.right;
            }
        }

        node.parent = y;
        if (!y) {
             tree.root = node;
             yield* yieldState(`树为空，${key} 成为根节点`, 'insert_bst', [node.id]);
        }
        else if (node.key < y.key) {
             y.left = node;
             yield* yieldState(`${key} 插入到 ${y.key} 的左侧`, 'insert_bst', [node.id, y.id]);
        }
        else {
             y.right = node;
             yield* yieldState(`${key} 插入到 ${y.key} 的右侧`, 'insert_bst', [node.id, y.id]);
        }

        // Fix Violations
        yield* yieldState(`检查红黑树性质...`, 'fix_insert', [node.id]);

        let z = node;
        while (z.parent && z.parent.color === 'RED') {
            const parent = z.parent;
            const grandparent = parent.parent; // Must exist if parent is RED (root is BLACK)

            if (!grandparent) break; // Should not happen if properties held before

            yield* yieldState(`父节点 ${parent.key} 是红色，违反性质 (双红)`, 'check_parent_red', [z.id, parent.id]);

            if (parent === grandparent.left) {
                const uncle = grandparent.right;
                if (uncle && uncle.color === 'RED') {
                    // Case 1: Uncle is RED
                    yield* yieldState(`叔叔节点 ${uncle.key} 也是红色 -> 变色`, 'case_1_uncle_red', [uncle.id, parent.id, grandparent.id]);
                    parent.color = 'BLACK';
                    uncle.color = 'BLACK';
                    grandparent.color = 'RED';
                    z = grandparent;
                    yield* yieldState(`祖父节点变红，继续向上检查`, 'recolor_grandparent', [z.id]);
                } else {
                    // Case 2: Uncle is BLACK (or NIL)
                    if (z === parent.right) {
                        yield* yieldState(`叔叔是黑色，且当前节点是右子节点 -> 左旋`, 'case_2_triangle', [z.id, parent.id]);
                        z = parent;
                        tree.leftRotate(z);
                        yield* yieldState(`左旋完成`, 'rotate_left', [z.id]);
                        // Now z is left child, parent is right child of z.
                        // Actually logic: z became the bottom node.
                    }
                    // Case 3
                    yield* yieldState(`叔叔是黑色，当前节点是左子节点 -> 变色并右旋`, 'case_3_line', [z.parent!.id, grandparent.id]);
                    z.parent!.color = 'BLACK';
                    grandparent.color = 'RED';
                    tree.rightRotate(grandparent);
                    yield* yieldState(`右旋完成，平衡恢复`, 'rotate_right');
                }
            } else {
                // Symmetric Case
                const uncle = grandparent.left;
                if (uncle && uncle.color === 'RED') {
                    yield* yieldState(`叔叔节点 ${uncle.key} 也是红色 -> 变色`, 'case_1_uncle_red', [uncle.id, parent.id, grandparent.id]);
                    parent.color = 'BLACK';
                    uncle.color = 'BLACK';
                    grandparent.color = 'RED';
                    z = grandparent;
                     yield* yieldState(`祖父节点变红，继续向上检查`, 'recolor_grandparent', [z.id]);
                } else {
                    if (z === parent.left) {
                         yield* yieldState(`叔叔是黑色，且当前节点是左子节点 -> 右旋`, 'case_2_triangle', [z.id, parent.id]);
                        z = parent;
                        tree.rightRotate(z);
                         yield* yieldState(`右旋完成`, 'rotate_left', [z.id]);
                    }
                    yield* yieldState(`叔叔是黑色，当前节点是右子节点 -> 变色并左旋`, 'case_3_line', [z.parent!.id, grandparent.id]);
                    z.parent!.color = 'BLACK';
                    grandparent.color = 'RED';
                    tree.leftRotate(grandparent);
                    yield* yieldState(`左旋完成，平衡恢复`, 'rotate_right');
                }
            }
        }

        if (tree.root && tree.root.color === 'RED') {
            tree.root.color = 'BLACK';
            yield* yieldState(`确保根节点为黑色`, 'root_black', [tree.root.id]);
        } else {
            yield* yieldState(`插入修复完成`, 'fix_insert');
        }
    }

    // Search
    function* search(key: number) {
        let current = tree.root;
        yield* yieldState(`开始搜索 ${key}`, 'insert_bst', current ? [current.id] : []);
        while (current) {
            yield* yieldState(`访问节点 ${current.key}`, 'insert_bst', [current.id]);
            if (key === current.key) {
                yield* yieldState(`找到节点 ${key}!`, 'insert_bst', [current.id]);
                return;
            }
            if (key < current.key) current = current.left;
            else current = current.right;
        }
        yield* yieldState(`未找到节点 ${key}`, 'insert_bst');
    }

    // Modify (Mocked as Delete + Insert for Visualization)
    function* modify(oldKey: number, newKey: number) {
        yield* yieldState(`准备修改节点: ${oldKey} -> ${newKey}`, 'insert_bst');

        // 1. Search to confirm existence
        let current = tree.root;
        let found = false;
        while (current) {
             if (oldKey === current.key) { found = true; break; }
             if (oldKey < current.key) current = current.left;
             else current = current.right;
        }

        if (!found) {
            yield* yieldState(`未找到节点 ${oldKey}，无法修改`, 'insert_bst');
            return;
        }

        // 2. Delete
        yield* yieldState(`第一步：删除旧节点 ${oldKey}`, 'fix_insert');
        yield* deleteNode(oldKey);

        // 3. Insert
        yield* yieldState(`第二步：插入新节点 ${newKey}`, 'fix_insert');
        yield* insert(newKey);

        yield* yieldState(`修改完成`, 'fix_insert');
    }

    // Delete Helpers
    function transplant(u: RBNode, v: RBNode | null) {
        if (!u.parent) tree.root = v;
        else if (u === u.parent.left) u.parent.left = v;
        else u.parent.right = v;
        if (v) v.parent = u.parent;
    }

    function minimum(node: RBNode): RBNode {
        while (node.left) node = node.left;
        return node;
    }

    function* deleteFixup(x: RBNode | null, xParent: RBNode | null) {
        // x is the node that moved up or null.
        // If x is null, we need to know its parent to navigate siblings.
        // We handle the 'double black' node x.

        let node = x;
        let parent = xParent;

        while (node !== tree.root && (!node || node.color === 'BLACK')) {
            if (node === parent!.left) {
                let sibling = parent!.right;
                if (sibling && sibling.color === 'RED') {
                     yield* yieldState(`兄弟节点 ${sibling.key} 是红色 -> 变色 + 左旋`, 'fix_insert', [sibling.id]);
                    sibling.color = 'BLACK';
                    parent!.color = 'RED';
                    tree.leftRotate(parent!);
                    sibling = parent!.right;
                }
                if ((!sibling?.left || sibling.left.color === 'BLACK') &&
                    (!sibling?.right || sibling.right.color === 'BLACK')) {
                     yield* yieldState(`兄弟节点的子节点全黑 -> 兄弟变红，向上回溯`, 'fix_insert', sibling ? [sibling.id] : []);
                    if (sibling) sibling.color = 'RED';
                    node = parent!;
                    parent = node.parent;
                } else {
                    if (!sibling?.right || sibling.right.color === 'BLACK') {
                         yield* yieldState(`兄弟右子黑，左子红 -> 兄弟右旋`, 'fix_insert');
                        if (sibling?.left) sibling.left.color = 'BLACK';
                        if (sibling) sibling.color = 'RED';
                        if (sibling) tree.rightRotate(sibling);
                        sibling = parent!.right;
                    }
                     yield* yieldState(`兄弟右子红 -> 变色 + 左旋`, 'fix_insert');
                    if (sibling) sibling.color = parent!.color;
                    parent!.color = 'BLACK';
                    if (sibling?.right) sibling.right.color = 'BLACK';
                    tree.leftRotate(parent!);
                    node = tree.root; // terminate
                }
            } else {
                // Symmetric
                let sibling = parent!.left;
                if (sibling && sibling.color === 'RED') {
                    yield* yieldState(`兄弟节点 ${sibling.key} 是红色 -> 变色 + 右旋`, 'fix_insert', [sibling.id]);
                    sibling.color = 'BLACK';
                    parent!.color = 'RED';
                    tree.rightRotate(parent!);
                    sibling = parent!.left;
                }
                if ((!sibling?.right || sibling.right.color === 'BLACK') &&
                    (!sibling?.left || sibling.left.color === 'BLACK')) {
                    yield* yieldState(`兄弟节点的子节点全黑 -> 兄弟变红，向上回溯`, 'fix_insert', sibling ? [sibling.id] : []);
                    if (sibling) sibling.color = 'RED';
                    node = parent!;
                    parent = node.parent;
                } else {
                    if (!sibling?.left || sibling.left.color === 'BLACK') {
                        yield* yieldState(`兄弟左子黑，右子红 -> 兄弟左旋`, 'fix_insert');
                        if (sibling?.right) sibling.right.color = 'BLACK';
                        if (sibling) sibling.color = 'RED';
                        if (sibling) tree.leftRotate(sibling);
                        sibling = parent!.left;
                    }
                    yield* yieldState(`兄弟左子红 -> 变色 + 右旋`, 'fix_insert');
                    if (sibling) sibling.color = parent!.color;
                    parent!.color = 'BLACK';
                    if (sibling?.left) sibling.left.color = 'BLACK';
                    tree.rightRotate(parent!);
                    node = tree.root; // terminate
                }
            }
        }
        if (node) node.color = 'BLACK';
        yield* yieldState(`删除修复完成`, 'fix_insert');
    }

    function* deleteNode(key: number) {
        let z: RBNode | null = tree.root;
        while (z && z.key !== key) {
             if (key < z.key) z = z.left;
             else z = z.right;
        }

        if (!z) {
             yield* yieldState(`未找到节点 ${key}，无需删除`, 'insert_bst');
             return;
        }

        yield* yieldState(`找到节点 ${key}，准备删除`, 'insert_bst', [z.id]);

        let y = z;
        let yOriginalColor = y.color;
        let x: RBNode | null;
        let xParent: RBNode | null;

        if (!z.left) {
            x = z.right;
            xParent = z.parent;
            transplant(z, z.right);
        } else if (!z.right) {
            x = z.left;
            xParent = z.parent;
            transplant(z, z.left);
        } else {
            y = minimum(z.right);
            yOriginalColor = y.color;
            x = y.right;
            if (y.parent === z) {
                xParent = y; // x might be null, but parent is y
            } else {
                xParent = y.parent;
                transplant(y, y.right);
                y.right = z.right;
                if (y.right) y.right.parent = y;
            }
            transplant(z, y);
            y.left = z.left;
            if (y.left) y.left.parent = y;
            y.color = z.color;
        }

        yield* yieldState(`节点已移除，检查是否违反黑高性质...`, 'fix_insert');

        if (yOriginalColor === 'BLACK') {
            yield* deleteFixup(x, xParent);
        } else {
            yield* yieldState(`删除的是红色节点，无需修复`, 'fix_insert');
        }
    }


    if (!operation) {
        yield* yieldState("红黑树就绪", 'insert_found');
        return;
    }

    if (operation.type === 'insert') {
        yield* insert(operation.value);
    } else if (operation.type === 'search') {
        yield* search(operation.value);
    } else if (operation.type === 'delete') {
        yield* deleteNode(operation.value);
    } else if (operation.type === 'modify') {
         // Assuming the UI sends targetValue
         if (operation.targetValue !== undefined) {
             yield* modify(operation.value, operation.targetValue);
         } else {
             yield* yieldState(`修改操作需要目标值`, 'insert_bst');
         }
    }
};

export const generateRandomRedBlackTree = (count: number): GraphData => {
    // Generate simple BST then fix it? No, just run the logic.
    const tree = new RedBlackTree();
    const values: number[] = [];
    while(values.length < count) {
        const val = Math.floor(Math.random() * 100) + 1;
        if(!values.includes(val)) values.push(val);
    }

    // Since we don't have the logic exposed as a simple sync function (it's in generator),
    // we should ideally duplicate the sync logic or expose it.
    // For now, I'll copy a simple sync insert to the class for generation usage.

    // Quick and dirty Sync Insert for generation:
    const syncInsert = (key: number) => {
         const node = new RBNode(key, 'RED');
         tree.insertBST(node);

         // Fix
         let z = node;
         while (z.parent && z.parent.color === 'RED') {
            const parent = z.parent;
            const grandparent = parent.parent;
             if (!grandparent) break;
             if (parent === grandparent.left) {
                 const uncle = grandparent.right;
                 if (uncle && uncle.color === 'RED') {
                     parent.color = 'BLACK';
                     uncle.color = 'BLACK';
                     grandparent.color = 'RED';
                     z = grandparent;
                 } else {
                     if (z === parent.right) {
                         z = parent;
                         tree.leftRotate(z);
                     }
                     z.parent!.color = 'BLACK';
                     grandparent.color = 'RED';
                     tree.rightRotate(grandparent);
                 }
             } else {
                 const uncle = grandparent.left;
                 if (uncle && uncle.color === 'RED') {
                     parent.color = 'BLACK';
                     uncle.color = 'BLACK';
                     grandparent.color = 'RED';
                     z = grandparent;
                 } else {
                     if (z === parent.left) {
                         z = parent;
                         tree.rightRotate(z);
                     }
                     z.parent!.color = 'BLACK';
                     grandparent.color = 'RED';
                     tree.leftRotate(grandparent);
                 }
             }
         }
         if (tree.root) tree.root.color = 'BLACK';
    };

    values.forEach(v => syncInsert(v));
    return tree.toGraphData();
};
