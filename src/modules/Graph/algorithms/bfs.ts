import type { AlgorithmGenerator, GraphData, SupportedLanguage } from "../../../types";

// --- Display Code for BFS (Multi-language) ---
export const BFS_CODE: Record<SupportedLanguage, string> = {
  javascript: `async function bfs(graph, startNodeId) {
  const visited = new Set();
  const queue = [startNodeId]; // @label:initQueue

  visited.add(startNodeId); // @label:visitStart
  
  while (queue.length > 0) { // @label:loopQueue
    const currentNodeId = queue.shift(); // @label:dequeue

    for (const neighborId of graph.getNeighbors(currentNodeId)) { // @label:loopNeighbors
      if (!visited.has(neighborId)) { // @label:checkVisited
        visited.add(neighborId); // @label:visitNeighbor
        queue.push(neighborId); // @label:enqueue
      }
    }
  }
}`,
  python: `def bfs(graph, start_node_id):
    visited = set()
    queue = [start_node_id]  # @label:initQueue

    visited.add(start_node_id) # @label:visitStart

    while queue:  # @label:loopQueue
        current_node_id = queue.pop(0)  # @label:dequeue

        for neighbor_id in graph.get_neighbors(current_node_id):  # @label:loopNeighbors
            if neighbor_id not in visited:  # @label:checkVisited
                visited.add(neighbor_id)  # @label:visitNeighbor
                queue.append(neighbor_id)  # @label:enqueue
`,
  go: `func bfs(graph *Graph, startNodeID string) {
    visited := make(map[string]bool)
    queue := []string{startNodeID} // @label:initQueue

    visited[startNodeID] = true // @label:visitStart

    for len(queue) > 0 { // @label:loopQueue
        currentNodeID := queue[0]
        queue = queue[1:] // @label:dequeue

        for _, neighborID := range graph.getNeighbors(currentNodeID) { // @label:loopNeighbors
            if !visited[neighborID] { // @label:checkVisited
                visited[neighborID] = true // @label:visitNeighbor
                queue = append(queue, neighborID) // @label:enqueue
            }
        }
    }
}`
};

// Helper function to create an adjacency list (for internal use by generator)
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

const cloneGraph = (graph: GraphData): GraphData => JSON.parse(JSON.stringify(graph));

// --- BFS Algorithm Generator ---
export const bfsAlgorithm: AlgorithmGenerator<GraphData> = function* (initialGraph: GraphData, startNodeId: string = initialGraph.nodes[0]?.id) {
  if (!startNodeId) {
    throw new Error("BFS requires a start node ID.");
  }

  const graph = JSON.parse(JSON.stringify(initialGraph)) as GraphData; // Deep copy
  const adjList = getAdjacencyList(graph);

  // Initialize all nodes as unvisited
  graph.nodes.forEach(node => node.status = 'unvisited');
  graph.edges.forEach(edge => edge.status = 'default');

  // Find start node
  const startNode = graph.nodes.find(node => node.id === startNodeId);
  if (!startNode) {
    throw new Error(`Start node with ID ${startNodeId} not found.`);
  }

  const queue: string[] = [];
  const visited = new Set<string>();

  yield {
    state: cloneGraph(graph),
    log: "开始 BFS 算法...",
    codeLabel: 'initQueue'
  };

  // Enqueue start node
  queue.push(startNodeId);
  visited.add(startNodeId);
  startNode.status = 'visiting'; // Mark as visiting (in queue)

  yield {
    state: cloneGraph(graph),
    log: `将起始节点 ${startNodeId} 加入队列并标记为访问中。`,
    codeLabel: 'visitStart',
    highlightIndices: [graph.nodes.findIndex(n => n.id === startNodeId)],
  };

  while (queue.length > 0) {
    yield {
      state: cloneGraph(graph),
      log: "检查队列，如果非空则继续。",
      codeLabel: 'loopQueue',
    };

    const currentNodeId = queue.shift()!; // Dequeue
    const currentNode = graph.nodes.find(node => node.id === currentNodeId)!;
    currentNode.status = 'visited'; // Mark as visited

    yield {
      state: cloneGraph(graph),
      log: `从队列中取出节点 ${currentNodeId}，标记为已访问。`,
      codeLabel: 'dequeue',
      highlightIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
    };

    // Highlight edges from current node
    const currentEdges = graph.edges.filter(edge => edge.source === currentNodeId || (!graph.directed && edge.target === currentNodeId));
    currentEdges.forEach(edge => edge.status = 'active'); // Mark connected edges as active

    yield {
      state: cloneGraph(graph),
      log: `遍历节点 ${currentNodeId} 的所有邻居。`,
      codeLabel: 'loopNeighbors',
      highlightIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
    };
    
    currentEdges.forEach(edge => edge.status = 'default'); // Reset edge status after check

    for (const neighborId of adjList.get(currentNodeId) || []) {
      const neighborNode = graph.nodes.find(node => node.id === neighborId)!;
      
      // Highlight the edge being considered
      const connectingEdge = graph.edges.find(e => 
        (e.source === currentNodeId && e.target === neighborId) || 
        (!graph.directed && e.source === neighborId && e.target === currentNodeId)
      );
      if (connectingEdge) connectingEdge.status = 'active';

      yield {
        state: cloneGraph(graph),
        log: `检查邻居节点 ${neighborId} 是否已被访问。`,
        codeLabel: 'checkVisited',
        highlightIndices: [graph.nodes.findIndex(n => n.id === neighborId)],
        secondaryIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
        highlightedEdgeId: connectingEdge?.id,
      };

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
        neighborNode.status = 'visiting'; // Mark as visiting (in queue)
        if (connectingEdge) connectingEdge.status = 'traversed'; // Mark edge as part of BFS tree

        yield {
          state: cloneGraph(graph),
          log: `节点 ${neighborId} 未访问，加入队列并标记为访问中。`,
          codeLabel: 'enqueue',
          highlightIndices: [graph.nodes.findIndex(n => n.id === neighborId)],
          secondaryIndices: [graph.nodes.findIndex(n => n.id === currentNodeId)],
          highlightedEdgeId: connectingEdge?.id,
        };
      }
      if (connectingEdge) connectingEdge.status = 'default'; // Reset edge status after check/enqueue
    }
  }

  yield {
    state: cloneGraph(graph),
    log: "BFS 算法完成!",
  };
};