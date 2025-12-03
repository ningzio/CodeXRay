import React from 'react';
import type { GraphData, AlgorithmStep } from '../../../types';

interface TreeVisualizerProps {
  step: AlgorithmStep<GraphData>;
}

const NODE_RADIUS = 22;
const NODE_COLORS = {
  unvisited: 'fill-slate-200 dark:fill-slate-700',
  visiting: 'fill-yellow-400 dark:fill-yellow-500',
  visited: 'fill-green-400 dark:fill-green-500',
  highlighted: 'fill-blue-400 dark:fill-blue-500',
  deleted: 'fill-red-400 dark:fill-red-500',
};

const EDGE_COLORS = {
  default: 'stroke-slate-300 dark:stroke-slate-600',
  traversed: 'stroke-green-400 dark:stroke-green-500',
  active: 'stroke-yellow-400 dark:stroke-yellow-500',
};

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ step }) => {
  const { state: graph, highlightIndices, highlightedEdgeId } = step;
  const highlightedNodeId = highlightIndices && highlightIndices.length > 0 ? graph.nodes[highlightIndices[0]]?.id : undefined;

  // Safety check: ensure graph exists
  if (!graph || !graph.nodes) {
    return <div className="w-full h-96 flex items-center justify-center text-slate-500">Loading Tree...</div>;
  }

  return (
    <div className="relative w-full h-96 flex justify-center items-center overflow-hidden">
      <svg className="absolute w-full h-full" viewBox="0 0 800 400">
        {/* Edges */}
        {graph.edges.map((edge) => {
          const sourceNode = graph.nodes.find(n => n.id === edge.source);
          const targetNode = graph.nodes.find(n => n.id === edge.target);

          if (!sourceNode || !targetNode || sourceNode.x === undefined || sourceNode.y === undefined || targetNode.x === undefined || targetNode.y === undefined) return null;

          let edgeColorClass = EDGE_COLORS.default;
          if (edge.status === 'traversed') edgeColorClass = EDGE_COLORS.traversed;
          else if (edge.status === 'active') edgeColorClass = EDGE_COLORS.active;

          return (
            <g key={edge.id}>
              <line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                className={`${edgeColorClass} transition-all duration-300`}
                strokeWidth={edge.id === highlightedEdgeId ? 4 : 2}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((node) => {
          let nodeColorClass = NODE_COLORS.unvisited;
          if (node.status === 'visiting') nodeColorClass = NODE_COLORS.visiting;
          else if (node.status === 'visited') nodeColorClass = NODE_COLORS.visited;

          // Highlight overrides status color
          if (node.id === highlightedNodeId) nodeColorClass = NODE_COLORS.highlighted;

          return (
            <g key={node.id} transform={`translate(${node.x || 0}, ${node.y || 0})`} className="transition-all duration-500 ease-in-out">
              <circle
                r={NODE_RADIUS}
                className={`${nodeColorClass} transition-colors duration-300 shadow-md`}
                stroke="currentColor"
                strokeWidth="2"
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                className="fill-slate-600 dark:fill-slate-200 text-xs font-bold pointer-events-none select-none font-mono"
              >
                {node.label || node.id}
              </text>
              {/* Optional: We could render extra info below the node if we extended the type,
                  but for now we stick to the standard GraphNode */}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
