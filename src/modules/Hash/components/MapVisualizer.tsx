import React from 'react';
import type { GraphData, AlgorithmStep } from '../../../types';

interface MapVisualizerProps {
  step: AlgorithmStep<GraphData>;
}

const CELL_WIDTH = 40;
const CELL_HEIGHT = 24;
const HEADER_HEIGHT = 24;

const BUCKET_COLORS = {
    header: 'fill-slate-200 dark:fill-slate-700',
    headerText: 'fill-slate-600 dark:fill-slate-300',
    slotEmpty: 'fill-white dark:fill-slate-800',
    slotFilled: 'fill-blue-50 dark:fill-blue-900/30',
    text: 'fill-slate-600 dark:fill-slate-200',
    label: 'fill-slate-400 dark:fill-slate-500',
    border: 'stroke-slate-300 dark:stroke-slate-600',
    highlight: 'stroke-blue-500 dark:stroke-blue-400 stroke-2',
    visiting: 'fill-yellow-100 dark:fill-yellow-900/30'
};

export const MapVisualizer: React.FC<MapVisualizerProps> = ({ step }) => {
    const { state: graph } = step;

    if (!graph || !graph.nodes) {
        return <div className="w-full h-96 flex items-center justify-center text-slate-500">Loading Map...</div>;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseNode = (node: any) => {
        const parts = (node.label || "").split('|');
        const headerParts = parts[0].split(':');
        const index = headerParts[1];
        const type = headerParts[2];

        const slots = parts.slice(1).map((s: string) => {
            if (s === 'EMPTY') return null;
            const [th, k, v] = s.split(':');
            return { th, k, v };
        });

        return { index, type, slots, x: node.x, y: node.y, id: node.id, status: node.status };
    };

    return (
        <div className="relative w-full h-96 flex justify-center items-center overflow-auto bg-slate-50 dark:bg-slate-950/50">
            <svg className="absolute min-w-full min-h-full" width="1000" height="600" viewBox="-100 -50 1200 700">
                <defs>
                     <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-400 dark:fill-slate-500" />
                     </marker>
                </defs>

                {graph.edges.map(edge => {
                    const source = graph.nodes.find(n => n.id === edge.source);
                    const target = graph.nodes.find(n => n.id === edge.target);
                    if (!source || !target) return null;

                    const sourceHeight = HEADER_HEIGHT + 4 * CELL_HEIGHT;
                    const x1 = source.x! + (CELL_WIDTH * 3) / 2;
                    const y1 = source.y! + sourceHeight;
                    const x2 = target.x! + (CELL_WIDTH * 3) / 2;
                    const y2 = target.y!;

                    return (
                        <path
                            key={edge.id}
                            d={`M ${x1} ${y1} C ${x1} ${y1+20}, ${x2} ${y2-20}, ${x2} ${y2}`}
                            fill="none"
                            stroke="currentColor"
                            className="text-slate-300 dark:text-slate-600"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                        />
                    );
                })}

                {graph.nodes.map(node => {
                    const data = parseNode(node);
                    const width = CELL_WIDTH * 3;
                    const height = HEADER_HEIGHT + data.slots.length * CELL_HEIGHT;

                    const isVisiting = data.status === 'visiting';
                    const baseClass = isVisiting ? BUCKET_COLORS.visiting : (data.type === 'OLD' ? 'fill-slate-100 dark:fill-slate-900 opacity-60' : 'fill-white dark:fill-slate-950');

                    return (
                        <g key={data.id} transform={`translate(${data.x}, ${data.y})`} className="transition-all duration-300">
                            <rect
                                x="0" y="0"
                                width={width}
                                height={height}
                                rx="4"
                                className={`${baseClass} stroke-slate-300 dark:stroke-slate-700 shadow-sm`}
                                strokeWidth={isVisiting ? 3 : 1}
                                stroke={isVisiting ? '#3b82f6' : undefined}
                            />

                            <rect x="0" y="0" width={width} height={HEADER_HEIGHT} className={`${BUCKET_COLORS.header} rounded-t`} />
                            <text x={width/2} y={HEADER_HEIGHT/2 + 4} textAnchor="middle" className={`text-xs font-bold font-mono ${BUCKET_COLORS.headerText}`}>
                                {data.type === 'MAIN' ? `Bucket ${data.index}` : (data.type === 'OLD' ? `Old ${data.index}` : 'Overflow')}
                            </text>

                            <g transform={`translate(0, ${HEADER_HEIGHT})`}>
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {data.slots.map((slot: any, i: number) => (
                                    <g key={i} transform={`translate(0, ${i * CELL_HEIGHT})`}>
                                        <line x1="0" y1="0" x2={width} y2="0" className={BUCKET_COLORS.border} />

                                        <rect x="0" y="0" width={CELL_WIDTH} height={CELL_HEIGHT} fill="none" className={BUCKET_COLORS.border} strokeWidth="0.5" />
                                        <text x={CELL_WIDTH/2} y={CELL_HEIGHT/2+4} textAnchor="middle" className={`text-[10px] font-mono ${BUCKET_COLORS.label}`}>
                                           {slot ? slot.th : ''}
                                        </text>

                                        <rect x={CELL_WIDTH} y="0" width={CELL_WIDTH} height={CELL_HEIGHT} fill="none" className={BUCKET_COLORS.border} strokeWidth="0.5" />
                                        <text x={CELL_WIDTH * 1.5} y={CELL_HEIGHT/2+4} textAnchor="middle" className={`text-xs font-bold ${BUCKET_COLORS.text}`}>
                                           {slot ? slot.k : ''}
                                        </text>

                                        <rect x={CELL_WIDTH*2} y="0" width={CELL_WIDTH} height={CELL_HEIGHT} fill="none" className={BUCKET_COLORS.border} strokeWidth="0.5" />
                                        <text x={CELL_WIDTH * 2.5} y={CELL_HEIGHT/2+4} textAnchor="middle" className={`text-xs ${BUCKET_COLORS.text} opacity-80`}>
                                           {slot ? slot.v : ''}
                                        </text>
                                    </g>
                                ))}

                                <line x1={CELL_WIDTH} y1="0" x2={CELL_WIDTH} y2={data.slots.length * CELL_HEIGHT} className={BUCKET_COLORS.border} />
                                <line x1={CELL_WIDTH*2} y1="0" x2={CELL_WIDTH*2} y2={data.slots.length * CELL_HEIGHT} className={BUCKET_COLORS.border} />
                            </g>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
