import { describe, it, expect } from 'vitest';
import { dijkstraAlgorithm } from './dijkstra';
import type { GraphData } from '../../../types';

describe('Dijkstra Algorithm Visualization', () => {
  it('should not have multiple traversed edges for a single node', () => {
    // Setup a graph where a shorter path is found later
    // A -> B (weight 10)
    // A -> C (weight 1)
    // C -> B (weight 2)
    // Path A->B is 10. Path A->C->B is 3.
    // B should update its parent from A to C.
    const graph: GraphData = {
      nodes: [
        { id: 'A', x: 0, y: 0 },
        { id: 'B', x: 100, y: 0 },
        { id: 'C', x: 50, y: 50 },
      ],
      edges: [
        { id: 'AB', source: 'A', target: 'B', weight: 10, status: 'default' },
        { id: 'AC', source: 'A', target: 'C', weight: 1, status: 'default' },
        { id: 'CB', source: 'C', target: 'B', weight: 2, status: 'default' },
      ],
      directed: true,
    };

    const generator = dijkstraAlgorithm(graph, 'A');

    let finalState: GraphData | null = null;
    for (const step of generator) {
      if (step.log && step.log.includes('Dijkstra 算法完成')) {
        finalState = step.state;
      }
    }

    expect(finalState).not.toBeNull();
    if (!finalState) return;

    // Check edges pointing to B
    const edgesToB = finalState.edges.filter(e => e.target === 'B');
    const traversedEdgesToB = edgesToB.filter(e => e.status === 'traversed');

    // Should only have one traversed edge (CB), not AB
    expect(traversedEdgesToB.length).toBe(1);
    expect(traversedEdgesToB[0].id).toBe('CB');

    // Specifically check AB is NOT traversed
    const ab = finalState.edges.find(e => e.id === 'AB');
    expect(ab?.status).not.toBe('traversed');
  });
});
