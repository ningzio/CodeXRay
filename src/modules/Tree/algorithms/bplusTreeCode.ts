import type { SupportedLanguage } from "../../../types";

export const B_PLUS_TREE_CODE: Record<SupportedLanguage, string> = {
  javascript: `class BPlusTree {
  insert(key) {
    if (!this.root) { // @label:new_root
        this.root = new Node([key]);
        return;
    }
    const leaf = this.findLeaf(key); // @label:insert_start
    // Search within leaf
    if (leaf.keys.includes(key)) return; // @label:insert_duplicate

    leaf.insertKey(key); // @label:insert_add_key

    if (leaf.keys.length >= ORDER) { // @label:split_leaf
        this.splitLeaf(leaf);
    }
  }

  splitLeaf(leaf) {
    const newLeaf = new Node();
    const mid = Math.floor(leaf.keys.length / 2);
    newLeaf.keys = leaf.keys.splice(mid); // @label:split_move_keys
    newLeaf.next = leaf.next;
    leaf.next = newLeaf;

    this.insertParent(leaf, newLeaf.keys[0], newLeaf); // @label:promote_key
  }

  insertParent(left, key, right) {
    const parent = left.parent;
    if (!parent) {
        this.root = new Node([key], [left, right]); // @label:new_root
        left.parent = right.parent = this.root;
        return;
    }

    parent.insertKeyAndChild(key, right); // @label:parent_inserted
    if (parent.keys.length >= ORDER) { // @label:split_internal
        this.splitInternal(parent);
    }
  }

  splitInternal(node) {
    const mid = Math.floor(node.keys.length / 2);
    const upKey = node.keys[mid]; // @label:split_internal_exec
    const newInternal = new Node();

    newInternal.keys = node.keys.splice(mid + 1);
    node.keys.pop(); // Remove mid key
    newInternal.children = node.children.splice(mid + 1);

    this.insertParent(node, upKey, newInternal);
  }

  delete(key) {
    const leaf = this.findLeaf(key);
    if (!leaf.contains(key)) return; // @label:delete_not_found

    leaf.removeKey(key); // @label:delete_found
    if (leaf === this.root && leaf.keys.length === 0) { // @label:tree_empty
        this.root = null;
        return;
    }

    if (leaf.keys.length < MIN_KEYS) { // @label:underflow
        this.handleUnderflow(leaf);
    }
  }

  handleUnderflow(node) {
    if (node === this.root) {
        if (node.keys.length === 0 && !node.isLeaf) {
            this.root = node.children[0]; // @label:root_shrink
        }
        return;
    }

    const { left, right } = this.getSiblings(node);

    if (left && left.canLend()) { // @label:borrow_left
        this.borrowFromLeft(node, left); // @label:borrow_done
    } else if (right && right.canLend()) { // @label:borrow_right
        this.borrowFromRight(node, right); // @label:borrow_done
    } else if (left) { // @label:merge_left
        this.merge(left, node); // @label:merge_done
    } else { // @label:merge_right
        this.merge(node, right); // @label:merge_done
    }
  }

  search(key) {
    let current = this.root; // @label:search_start
    while (!current.isLeaf) {
        current = current.findChild(key); // @label:search_traverse
    }
    // @label:search_leaf
    return current.keys.includes(key) ? current : null; // @label:search_found
  }
}`,
  python: `class BPlusTree:
    def insert(self, key):
        if not self.root: # @label:new_root
            self.root = Node([key])
            return
        leaf = self.find_leaf(key) # @label:insert_start
        if key in leaf.keys: return # @label:insert_duplicate

        leaf.insert_key(key) # @label:insert_add_key

        if len(leaf.keys) >= ORDER: # @label:split_leaf
            self.split_leaf(leaf)

    def split_leaf(self, leaf):
        mid = len(leaf.keys) // 2
        new_leaf = Node()
        new_leaf.keys = leaf.keys[mid:] # @label:split_move_keys
        leaf.keys = leaf.keys[:mid]

        new_leaf.next = leaf.next
        leaf.next = new_leaf

        self.insert_parent(leaf, new_leaf.keys[0], new_leaf) # @label:promote_key

    def insert_parent(self, left, key, right):
        parent = left.parent
        if not parent:
            self.root = Node([key], [left, right]) # @label:new_root
            left.parent = right.parent = self.root
            return

        parent.insert_key_and_child(key, right) # @label:parent_inserted
        if len(parent.keys) >= ORDER: # @label:split_internal
            self.split_internal(parent)

    def split_internal(self, node):
        mid = len(node.keys) // 2
        up_key = node.keys[mid] # @label:split_internal_exec
        new_internal = Node()

        new_internal.keys = node.keys[mid+1:]
        node.keys = node.keys[:mid]
        new_internal.children = node.children[mid+1:]

        self.insert_parent(node, up_key, new_internal)

    def delete(self, key):
        leaf = self.find_leaf(key)
        if key not in leaf.keys: return # @label:delete_not_found

        leaf.remove_key(key) # @label:delete_found
        if leaf == self.root and len(leaf.keys) == 0: # @label:tree_empty
            self.root = None
            return

        if len(leaf.keys) < MIN_KEYS: # @label:underflow
            self.handle_underflow(leaf)

    def handle_underflow(self, node):
        if node == self.root:
            if len(node.keys) == 0 and not node.is_leaf:
                self.root = node.children[0] # @label:root_shrink
            return

        left, right = self.get_siblings(node)

        if left and left.can_lend(): # @label:borrow_left
            self.borrow_from_left(node, left) # @label:borrow_done
        elif right and right.can_lend(): # @label:borrow_right
            self.borrow_from_right(node, right) # @label:borrow_done
        elif left: # @label:merge_left
            self.merge(left, node) # @label:merge_done
        else: # @label:merge_right
            self.merge(node, right) # @label:merge_done

    def search(self, key):
        current = self.root # @label:search_start
        while not current.is_leaf:
            current = current.find_child(key) # @label:search_traverse
        # @label:search_leaf
        return current if key in current.keys else None # @label:search_found`,
  go: `func (t *BPlusTree) Insert(key int) {
    if t.Root == nil { // @label:new_root
        t.Root = NewNode([]int{key})
        return
    }
    leaf := t.FindLeaf(key) // @label:insert_start
    if leaf.Contains(key) { return } // @label:insert_duplicate

    leaf.InsertKey(key) // @label:insert_add_key

    if len(leaf.Keys) >= ORDER { // @label:split_leaf
        t.SplitLeaf(leaf)
    }
}

func (t *BPlusTree) SplitLeaf(leaf *Node) {
    mid := len(leaf.Keys) / 2
    newLeaf := NewNode()
    newLeaf.Keys = leaf.Keys[mid:] // @label:split_move_keys
    leaf.Keys = leaf.Keys[:mid]

    newLeaf.Next = leaf.Next
    leaf.Next = newLeaf

    t.InsertParent(leaf, newLeaf.Keys[0], newLeaf) // @label:promote_key
}

func (t *BPlusTree) InsertParent(left *Node, key int, right *Node) {
    parent := left.Parent
    if parent == nil {
        t.Root = NewNode([]int{key}, []*Node{left, right}) // @label:new_root
        left.Parent = t.Root
        right.Parent = t.Root
        return
    }

    parent.InsertKeyAndChild(key, right) // @label:parent_inserted
    if len(parent.Keys) >= ORDER { // @label:split_internal
        t.SplitInternal(parent)
    }
}

func (t *BPlusTree) SplitInternal(node *Node) {
    mid := len(node.Keys) / 2
    upKey := node.Keys[mid] // @label:split_internal_exec
    newInternal := NewNode()

    newInternal.Keys = node.Keys[mid+1:]
    node.Keys = node.Keys[:mid]
    newInternal.Children = node.Children[mid+1:]

    t.InsertParent(node, upKey, newInternal)
}

func (t *BPlusTree) Delete(key int) {
    leaf := t.FindLeaf(key)
    if !leaf.Contains(key) { return } // @label:delete_not_found

    leaf.RemoveKey(key) // @label:delete_found
    if leaf == t.Root && len(leaf.Keys) == 0 { // @label:tree_empty
        t.Root = nil
        return
    }

    if len(leaf.Keys) < MIN_KEYS { // @label:underflow
        t.HandleUnderflow(leaf)
    }
}

func (t *BPlusTree) HandleUnderflow(node *Node) {
    if node == t.Root {
        if len(node.Keys) == 0 && !node.IsLeaf {
            t.Root = node.Children[0] // @label:root_shrink
        }
        return
    }

    left, right := t.GetSiblings(node)

    if left != nil && left.CanLend() { // @label:borrow_left
        t.BorrowFromLeft(node, left) // @label:borrow_done
    } else if right != nil && right.CanLend() { // @label:borrow_right
        t.BorrowFromRight(node, right) // @label:borrow_done
    } else if left != nil { // @label:merge_left
        t.Merge(left, node) // @label:merge_done
    } else { // @label:merge_right
        t.Merge(node, right) // @label:merge_done
    }
}

func (t *BPlusTree) Search(key int) *Node {
    current := t.Root // @label:search_start
    for !current.IsLeaf {
        current = current.FindChild(key) // @label:search_traverse
    }
    // @label:search_leaf
    if current.Contains(key) { return current } // @label:search_found
    return nil
}`
};
