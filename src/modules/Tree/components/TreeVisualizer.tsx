import React from 'react';
import type { GraphData, AlgorithmStep } from '../../../types';

interface TreeVisualizerProps {
  step: AlgorithmStep<GraphData>;
}

const NODE_RADIUS = 18;
const CHAR_WIDTH = 7; // Approximate width for mono font
const NODE_COLORS = {
  unvisited: 'fill-slate-200 dark:fill-slate-700',
  visiting: 'fill-yellow-400 dark:fill-yellow-500',
  visited: 'fill-green-400 dark:fill-green-500',
  highlighted: 'fill-blue-400 dark:fill-blue-500',
  deleted: 'fill-red-400 dark:fill-red-500',
  red: 'fill-red-500 dark:fill-red-600',
  black: 'fill-slate-800 dark:fill-slate-950',
};

const EDGE_COLORS = {
  default: 'stroke-slate-300 dark:stroke-slate-600',
  traversed: 'stroke-green-400 dark:stroke-green-500',
  active: 'stroke-yellow-400 dark:stroke-yellow-500', // Used for leaf links
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

          const isLeafLink = edge.status === 'active';

          return (
            <g key={edge.id}>
              <line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                className={`${edgeColorClass} transition-all duration-300`}
                strokeWidth={edge.id === highlightedEdgeId ? 4 : (isLeafLink ? 2 : 2)}
                strokeDasharray={isLeafLink ? "4 2" : "none"} // Dashed for leaf links
                markerEnd={isLeafLink ? "url(#arrowhead)" : ""}
              />
            </g>
          );
        })}

        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#facc15" />
            </marker>
        </defs>

        {/* Nodes */}
        {graph.nodes.map((node) => {
          let nodeColorClass = NODE_COLORS.unvisited;

          if (node.color === 'red') nodeColorClass = NODE_COLORS.red;
          else if (node.color === 'black') nodeColorClass = NODE_COLORS.black;
          else if (node.status === 'visiting') nodeColorClass = NODE_COLORS.visiting;
          else if (node.status === 'visited') nodeColorClass = NODE_COLORS.visited;

          // Highlight overrides status color
          if (node.id === highlightedNodeId) nodeColorClass = NODE_COLORS.highlighted;

          let label = node.label || node.id;

          // Check for B+ Tree Block Flag
          const isBPlus = label.startsWith("B+:");
          if (isBPlus) {
             label = label.substring(3); // Remove prefix
          }

          // Force block node if B+ prefix found OR if pipe delimited (legacy fallback)
          const isBlockNode = isBPlus || label.includes('|');

          if (isBlockNode) {
              const keys = label.length > 0 ? label.split('|') : [];
              const cellWidth = 25;
              const cellHeight = 25;
              const nodeWidth = Math.max(keys.length * cellWidth, cellWidth); // At least one cell width
              const nodeHeight = cellHeight;

              const startX = -(nodeWidth / 2);
              const startY = -(nodeHeight / 2);

              return (
                <g key={node.id} transform={`translate(${node.x || 0}, ${node.y || 0})`} className="transition-all duration-500 ease-in-out">
                    {/* Main Container */}
                    <rect
                        x={startX}
                        y={startY}
                        width={nodeWidth}
                        height={nodeHeight}
                        rx="4"
                        className={`${nodeColorClass} stroke-slate-600 dark:stroke-slate-400 transition-colors duration-300 shadow-md`}
                        strokeWidth="1"
                    />

                    {/* Dividers & Text */}
                    {keys.map((k, i) => (
                        <g key={i}>
                            {i > 0 && (
                                <line
                                    x1={startX + i * cellWidth}
                                    y1={startY}
                                    x2={startX + i * cellWidth}
                                    y2={startY + cellHeight}
                                    stroke="currentColor"
                                    className="stroke-slate-400 dark:stroke-slate-600"
                                />
                            )}
                            <text
                                x={startX + i * cellWidth + cellWidth / 2}
                                y={startY + cellHeight / 2 + 4}
                                textAnchor="middle"
                                className={`${(nodeColorClass.includes('slate-200') || nodeColorClass.includes('green-400') || nodeColorClass.includes('yellow-400')) ? 'fill-slate-800' : 'fill-white'} dark:fill-slate-100 text-xs font-bold pointer-events-none select-none font-mono`}
                            >
                                {k}
                            </text>
                        </g>
                    ))}
                </g>
              );
          }

          // Check for AVL style label: "Value (H:Height)"
          const avlMatch = label.match(/^(.*)\s+\((H:\d+)\)$/);

          let content;
          let rx = NODE_RADIUS;

          if (avlMatch) {
            const [, val, heightInfo] = avlMatch;

            // Calculate width needed
            const valWidth = val.length * CHAR_WIDTH;
            const heightWidth = heightInfo.length * (CHAR_WIDTH * 0.85); // smaller font
            const maxContentWidth = Math.max(valWidth, heightWidth);
            rx = Math.max(NODE_RADIUS, maxContentWidth / 2 + 8);

            content = (
              <text
                x="0"
                y="0"
                textAnchor="middle"
                className="fill-slate-600 dark:fill-slate-200 text-xs font-bold pointer-events-none select-none font-mono"
              >
                <tspan x="0" dy="-0.2em">{val}</tspan>
                <tspan x="0" dy="1.3em" fontSize="0.85em" className="opacity-80">{heightInfo}</tspan>
              </text>
            );
          } else {
            // Standard label
            const textWidth = label.length * CHAR_WIDTH;
            rx = Math.max(NODE_RADIUS, textWidth / 2 + 8);

            // Determine text color based on node color (black/red nodes usually need white text)
            let textColorClass = "fill-slate-600 dark:fill-slate-200";
            if (node.color === 'black' || node.color === 'red') {
                textColorClass = "fill-white dark:fill-slate-200";
            }

            content = (
              <text
                x="0"
                y="5"
                textAnchor="middle"
                className={`${textColorClass} text-xs font-bold pointer-events-none select-none font-mono`}
              >
                {label}
              </text>
            );
          }

          return (
            <g key={node.id} transform={`translate(${node.x || 0}, ${node.y || 0})`} className="transition-all duration-500 ease-in-out">
              <ellipse
                rx={rx}
                ry={NODE_RADIUS}
                className={`${nodeColorClass} transition-colors duration-300 shadow-md`}
                stroke="currentColor"
                strokeWidth="2"
              />
              {content}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
