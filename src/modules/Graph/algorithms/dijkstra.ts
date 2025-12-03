import type { AlgorithmGenerator, GraphData, SupportedLanguage } from "../../../types";

export const DIJKSTRA_CODE: Record<SupportedLanguage, string> = {
  javascript: `async function dijkstra(graph, startNodeId) {
  const distances = {};
  const pq = new PriorityQueue();

  // Init distances
  for (const node of graph.nodes) {
    distances[node.id] = Infinity; // @label:initDist
  }
  distances[startNodeId] = 0;
  pq.enqueue(startNodeId, 0); // @label:initPQ

  while (!pq.isEmpty()) { // @label:loopPQ
    const { node: u } = pq.dequeue(); // @label:dequeue

    for (const neighbor of graph.getNeighbors(u)) { // @label:loopNeighbors
      const alt = distances[u] + neighbor.weight; // @label:calcDist
      if (alt < distances[neighbor.id]) { // @label:checkDist
        distances[neighbor.id] = alt; // @label:updateDist
        pq.enqueue(neighbor.id, alt); // @label:enqueue
      }
    }
  }
}`,
  python: `import heapq

def dijkstra(graph, start_node_id):
    distances = {node: float('inf') for node in graph.nodes} # @label:initDist
    distances[start_node_id] = 0
    pq = [(0, start_node_id)] # @label:initPQ

    while pq: # @label:loopPQ
        current_dist, u = heapq.heappop(pq) # @label:dequeue

        for neighbor, weight in graph.get_neighbors(u): # @label:loopNeighbors
            alt = current_dist + weight # @label:calcDist
            if alt < distances[neighbor.id]: # @label:checkDist
                distances[neighbor.id] = alt # @label:updateDist
                heapq.heappush(pq, (alt, neighbor.id)) # @label:enqueue
`,
  go: `func dijkstra(graph *Graph, startNodeID string) {
    distances := make(map[string]int)
    for _, node := range graph.Nodes {
        distances[node.ID] = math.MaxInt32 // @label:initDist
    }
    distances[startNodeID] = 0
    pq := &PriorityQueue{}
    heap.Push(pq, &Item{value: startNodeID, priority: 0}) // @label:initPQ

    for pq.Len() > 0 { // @label:loopPQ
        u := heap.Pop(pq).(*Item).value // @label:dequeue

        for _, neighbor := range graph.GetNeighbors(u) { // @label:loopNeighbors
            alt := distances[u] + neighbor.Weight // @label:calcDist
            if alt < distances[neighbor.ID] { // @label:checkDist
                distances[neighbor.ID] = alt // @label:updateDist
                heap.Push(pq, &Item{value: neighbor.ID, priority: alt}) // @label:enqueue
            }
        }
    }
}`
};

// Helper to get neighbors with weights
const getAdjacencyList = (graphData: GraphData): Map<string, { id: string; weight: number }[]> => {
  const adjList = new Map<string, { id: string; weight: number }[]>();
  graphData.nodes.forEach(node => adjList.set(node.id, []));
  graphData.edges.forEach(edge => {
    const weight = edge.weight ?? 1; // Default weight 1 if undefined
    adjList.get(edge.source)?.push({ id: edge.target, weight });
    if (!graphData.directed) {
      adjList.get(edge.target)?.push({ id: edge.source, weight });
    }
  });
  return adjList;
};

export const dijkstraAlgorithm: AlgorithmGenerator<GraphData> = function* (initialGraph: GraphData, startNodeId: string = initialGraph.nodes[0]?.id) {
  if (!startNodeId) throw new Error("Dijkstra requires a start node ID.");

  const graph = JSON.parse(JSON.stringify(initialGraph)) as GraphData;
  const adjList = getAdjacencyList(graph);

  // 1. Initialize
  const distances = new Map<string, number>();
  const pq: { id: string, dist: number }[] = [];
  const visited = new Set<string>();

  graph.nodes.forEach(node => {
    distances.set(node.id, Infinity);
    node.status = 'unvisited';
    node.label = `${node.id} (∞)`;
  });
  graph.edges.forEach(edge => edge.status = 'default');

  yield {
    state: graph,
    log: "初始化距离：起点为 0，其他为 ∞。",
    codeLabel: 'initDist'
  };

  const startNode = graph.nodes.find(n => n.id === startNodeId)!;
  distances.set(startNodeId, 0);
  startNode.label = `${startNodeId} (0)`;
  pq.push({ id: startNodeId, dist: 0 });

  yield {
    state: graph,
    log: `将起点 ${startNodeId} 加入优先队列，距离 0。`,
    codeLabel: 'initPQ',
    highlightIndices: [graph.nodes.findIndex(n => n.id === startNodeId)]
  };

  while (pq.length > 0) {
    // Sort to simulate Priority Queue (min distance first)
    pq.sort((a, b) => a.dist - b.dist);

    yield {
      state: graph,
      log: "检查优先队列...",
      codeLabel: 'loopPQ'
    };

    const { id: uId, dist: uDist } = pq.shift()!;
    const uNode = graph.nodes.find(n => n.id === uId)!;

    if (visited.has(uId)) continue;
    visited.add(uId);
    uNode.status = 'visited';

    yield {
      state: graph,
      log: `取出当前距离最小节点 ${uId} (dist: ${uDist})，标记为已确定。`,
      codeLabel: 'dequeue',
      highlightIndices: [graph.nodes.findIndex(n => n.id === uId)]
    };

    const neighbors = adjList.get(uId) || [];

    // Highlight edges
    yield {
      state: graph,
      log: `遍历节点 ${uId} 的所有邻居。`,
      codeLabel: 'loopNeighbors',
      highlightIndices: [graph.nodes.findIndex(n => n.id === uId)]
    };

    for (const neighbor of neighbors) {
        const neighborNode = graph.nodes.find(n => n.id === neighbor.id)!;
        if (visited.has(neighbor.id)) continue;

        const connectingEdge = graph.edges.find(e =>
            (e.source === uId && e.target === neighbor.id) ||
            (!graph.directed && e.source === neighbor.id && e.target === uId)
        );
        if (connectingEdge) connectingEdge.status = 'active';

        const alt = uDist + neighbor.weight;

        yield {
            state: graph,
            log: `计算通过 ${uId} 到达 ${neighbor.id} 的距离: ${uDist} + ${neighbor.weight} = ${alt}。`,
            codeLabel: 'calcDist',
            highlightIndices: [graph.nodes.findIndex(n => n.id === neighbor.id)],
            secondaryIndices: [graph.nodes.findIndex(n => n.id === uId)],
            highlightedEdgeId: connectingEdge?.id
        };

        const currentNeighborDist = distances.get(neighbor.id)!;

        yield {
            state: graph,
            log: `比较新距离 ${alt} 与当前距离 ${currentNeighborDist === Infinity ? '∞' : currentNeighborDist}。`,
            codeLabel: 'checkDist',
            highlightIndices: [graph.nodes.findIndex(n => n.id === neighbor.id)],
            highlightedEdgeId: connectingEdge?.id
        };

        if (alt < currentNeighborDist) {
            distances.set(neighbor.id, alt);

            // Update node visual
            neighborNode.label = `${neighbor.id} (${alt})`;
            neighborNode.status = 'visiting'; // Temporary status showing it's "active/reachable"

            if (connectingEdge) connectingEdge.status = 'traversed'; // Mark edge as part of the shortest path tree candidate

            pq.push({ id: neighbor.id, dist: alt });

            yield {
                state: graph,
                log: `更新 ${neighbor.id} 的最短距离为 ${alt}，并加入优先队列。`,
                codeLabel: 'updateDist',
                highlightIndices: [graph.nodes.findIndex(n => n.id === neighbor.id)],
                highlightedEdgeId: connectingEdge?.id
            };
        } else {
            if (connectingEdge) connectingEdge.status = 'default'; // Revert if not better
        }
    }
  }

  yield {
      state: graph,
      log: "Dijkstra 算法完成！所有节点的最短路径已确定。",
  };
};
