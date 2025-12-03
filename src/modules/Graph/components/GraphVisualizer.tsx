import React from 'react';
import type { GraphData, AlgorithmStep } from '../../../types';

interface GraphVisualizerProps {
  step: AlgorithmStep<GraphData>;
}

const NODE_RADIUS = 20;
const NODE_COLORS = {
  unvisited: 'fill-slate-200 dark:fill-slate-700',
  visiting: 'fill-yellow-400 dark:fill-yellow-500', 
  visited: 'fill-green-400 dark:fill-green-500',   
  highlighted: 'fill-blue-400 dark:fill-blue-500', 
};

const EDGE_COLORS = {
  default: 'stroke-slate-300 dark:stroke-slate-600',
  traversed: 'stroke-green-400 dark:stroke-green-500', 
  active: 'stroke-yellow-400 dark:stroke-yellow-500',  
};

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ step }) => {
  const { state: graph, highlightIndices, highlightedEdgeId } = step;
  const highlightedNodeId = highlightIndices && highlightIndices.length > 0 ? graph.nodes[highlightIndices[0]]?.id : undefined;

  // Safety check: ensure graph exists
  if (!graph || !graph.nodes) {
    return <div className="w-full h-96 flex items-center justify-center text-slate-500">Loading Graph...</div>;
  }

  // Simple layout: arrange nodes in a circle or fixed positions for now
  // For a more dynamic layout, a force-directed graph library would be used.
  // For demonstration, let's assign some fixed positions if not already present.
  const positionedNodes = graph.nodes.map((node, index) => {
    // If x, y are not provided, arrange in a circle
    if (node.x === undefined || node.y === undefined) {
      const angle = (index / graph.nodes.length) * 2 * Math.PI;
      const radius = 150;
      const centerX = 200;
      const centerY = 200;
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    }
    return node;
  });

  return (
    <div className="relative w-full h-96 flex justify-center items-center overflow-hidden">
      <svg className="absolute w-full h-full" viewBox="0 0 400 400">
        {/* Edges */}
        {graph.edges.map((edge) => {
          const sourceNode = positionedNodes.find(n => n.id === edge.source);
          const targetNode = positionedNodes.find(n => n.id === edge.target);

          if (!sourceNode || !targetNode) return null;

          const midX = ((sourceNode.x ?? 0) + (targetNode.x ?? 0)) / 2;
          const midY = ((sourceNode.y ?? 0) + (targetNode.y ?? 0)) / 2;

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
                className={`${edgeColorClass} transition-colors duration-300`}
                strokeWidth={edge.id === highlightedEdgeId ? 4 : 2}
                markerEnd={graph.directed ? "url(#arrowhead)" : ""}
              />
              {edge.weight !== undefined && (
                 <text
                   x={midX}
                   y={midY}
                   className="fill-slate-500 dark:fill-slate-400 text-xs font-bold stroke-white dark:stroke-slate-950 stroke-2"
                   style={{ paintOrder: 'stroke' }}
                   textAnchor="middle"
                   dy="-5" // Shift slightly up
                 >
                   {edge.weight}
                 </text>
              )}
            </g>
          );
        })}

        {/* Directed Graph Arrowhead (if needed) */}
        {graph.directed && (
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-300 dark:fill-slate-600" />
            </marker>
          </defs>
        )}

        {/* Nodes */}
        {positionedNodes.map((node) => {
          let nodeColorClass = NODE_COLORS.unvisited;
          if (node.status === 'visiting') nodeColorClass = NODE_COLORS.visiting;
          else if (node.status === 'visited') nodeColorClass = NODE_COLORS.visited;
          
          // Highlight overrides status color
          if (node.id === highlightedNodeId) nodeColorClass = NODE_COLORS.highlighted;

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              <circle
                r={NODE_RADIUS}
                className={`${nodeColorClass} transition-colors duration-300`}
                stroke="currentColor" 
                strokeWidth="2"
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                className="fill-slate-600 dark:fill-slate-200 text-xs font-bold pointer-events-none select-none"
              >
                {node.label || node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
