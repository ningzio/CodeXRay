import type { AlgorithmGenerator, GraphData, SupportedLanguage } from "../../../types";

// --- Display Code for DFS (Multi-language) ---
export const DFS_CODE: Record<SupportedLanguage, string> = {
  javascript: `async function dfs(graph, startNodeId) {
  const visited = new Set();
  const stack = [startNodeId]; // @label:initStack

  while (stack.length > 0) { // @label:loopStack
    const currentNodeId = stack.pop(); // @label:popStack

    if (!visited.has(currentNodeId)) { // @label:checkVisited
      visited.add(currentNodeId); // @label:visitNode

      const neighbors = graph.getNeighbors(currentNodeId);
      // Process neighbors in reverse order to simulate recursion
      for (const neighborId of neighbors.reverse()) { // @label:loopNeighbors
        if (!visited.has(neighborId)) { // @label:checkNeighbor
          stack.push(neighborId); // @label:pushStack
        }
      }
    }
  }
}`,
  python: `def dfs(graph, start_node_id):
    visited = set()
    stack = [start_node_id]  # @label:initStack

    while stack:  # @label:loopStack
        current_node_id = stack.pop()  # @label:popStack

        if current_node_id not in visited:  # @label:checkVisited
            visited.add(current_node_id)  # @label:visitNode

            # Iterate neighbors in reverse
            neighbors = graph.get_neighbors(current_node_id)
            for neighbor_id in reversed(neighbors):  # @label:loopNeighbors
                if neighbor_id not in visited:  # @label:checkNeighbor
                    stack.append(neighbor_id)  # @label:pushStack
`,
  go: `func dfs(graph *Graph, startNodeID string) {
    visited := make(map[string]bool)
    stack := []string{startNodeID} // @label:initStack

    for len(stack) > 0 { // @label:loopStack
        // Pop from stack
        n := len(stack) - 1
        currentNodeID := stack[n]
        stack = stack[:n] // @label:popStack

        if !visited[currentNodeID] { // @label:checkVisited
            visited[currentNodeID] = true // @label:visitNode

            // Iterate neighbors in reverse
            neighbors := graph.getNeighbors(currentNodeID)
            for i := len(neighbors) - 1; i >= 0; i-- { // @label:loopNeighbors
                neighborID := neighbors[i]
                if !visited[neighborID] { // @label:checkNeighbor
                    stack = append(stack, neighborID) // @label:pushStack
                }
            }
        }
    }
}`
};

// Helper function to create an adjacency list (internal use)
const getAdjacencyList = (graphData: GraphData): Map<string, string[]> => {
  const adjList = new Map<string, string[]>();
  graphData.nodes.forEach(node => adjList.set(node.id, []));
  graphData.edges.forEach(edge => {
    adjList.get(edge.source)?.push(edge.target);
    // If undirected, add reverse edge
    if (!graphData.directed) {
      adjList.get(edge.target)?.push(edge.source);
    }
  });
  return adjList;
};

// --- DFS Algorithm Generator ---
export const dfsAlgorithm: AlgorithmGenerator<GraphData> = function* (initialGraph: GraphData, startNodeId: string = initialGraph.nodes[0]?.id) {
  if (!startNodeId) {
    throw new Error("DFS requires a start node ID.");
  }

  const graph = JSON.parse(JSON.stringify(initialGraph)) as GraphData; // Deep copy
  const adjList = getAdjacencyList(graph);

  // Initialize all nodes as unvisited
  graph.nodes.forEach(node => node.status = 'unvisited');
  graph.edges.forEach(edge => edge.status = 'default');

  const startNode = graph.nodes.find(node => node.id === startNodeId);
  if (!startNode) {
    throw new Error(`Start node with ID ${startNodeId} not found.`);
  }

  const stack: string[] = [];
  const visited = new Set<string>();

  yield {
    state: graph,
    log: "开始 DFS 算法...",
    codeLabel: 'initStack'
  };

  stack.push(startNodeId);
  startNode.status = 'visiting'; // Mark as visiting (in stack)

  yield {
    state: graph,
    log: `将起始节点 ${startNodeId} 压入栈。`,
    codeLabel: 'initStack',
    highlightIndices: [graph.nodes.findIndex(n => n.id === startNodeId)],
  };

  while (stack.length > 0) {
    yield {
      state: graph,
      log: "检查栈，如果非空则继续。",
      codeLabel: 'loopStack',
    };

    const currentNodeId = stack.pop()!;
    const currentNode = graph.nodes.find(node => node.id === currentNodeId)!;

    yield {
      state: graph,
      log: `从栈中弹出节点 ${currentNodeId}。`,
      codeLabel: 'popStack',
      highlightIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
    };

    yield {
      state: graph,
      log: `检查节点 ${currentNodeId} 是否已访问。`,
      codeLabel: 'checkVisited',
      highlightIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
    };

    if (!visited.has(currentNodeId)) {
      visited.add(currentNodeId);
      currentNode.status = 'visited';

      yield {
        state: graph,
        log: `节点 ${currentNodeId} 未被访问，标记为已访问。`,
        codeLabel: 'visitNode',
        highlightIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
      };

      // Get neighbors and reverse them
      let neighbors = adjList.get(currentNodeId) || [];
      neighbors = [...neighbors].reverse(); // Copy and reverse

      // Highlight edges from current node
      const currentEdges = graph.edges.filter(edge => edge.source === currentNodeId || (!graph.directed && edge.target === currentNodeId));
      currentEdges.forEach(edge => edge.status = 'active');

      yield {
        state: graph,
        log: `获取节点 ${currentNodeId} 的所有邻居 (逆序)。`,
        codeLabel: 'loopNeighbors',
        highlightIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
      };

      currentEdges.forEach(edge => edge.status = 'default');

      for (const neighborId of neighbors) {
        const neighborNode = graph.nodes.find(node => node.id === neighborId)!;

        const connectingEdge = graph.edges.find(e =>
          (e.source === currentNodeId && e.target === neighborId) ||
          (!graph.directed && e.source === neighborId && e.target === currentNodeId)
        );
        if (connectingEdge) connectingEdge.status = 'active';

        yield {
          state: graph,
          log: `检查邻居节点 ${neighborId}。`,
          codeLabel: 'checkNeighbor',
          highlightIndices: [graph.nodes.findIndex(n => n.id === neighborId)],
          secondaryIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
          highlightedEdgeId: connectingEdge?.id,
        };

        if (!visited.has(neighborId)) {
           stack.push(neighborId);
           neighborNode.status = 'visiting'; // Mark as in-stack
           if (connectingEdge) connectingEdge.status = 'traversed';

           yield {
             state: graph,
             log: `邻居 ${neighborId} 未被访问，压入栈中。`,
             codeLabel: 'pushStack',
             highlightIndices: [graph.nodes.findIndex(n => n.id === neighborId)],
             secondaryIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
             highlightedEdgeId: connectingEdge?.id,
           };
        }
        if (connectingEdge) connectingEdge.status = 'default';
      }
    } else {
      yield {
        state: graph,
        log: `节点 ${currentNodeId} 已被访问，跳过。`,
        codeLabel: 'checkVisited',
        highlightIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
      };
    }
  }

  yield {
    state: graph,
    log: "DFS 算法完成!",
  };
};
