import { useState, useCallback } from 'react';
import { bubbleSort, BUBBLE_SORT_CODE } from './modules/Sorting/algorithms/bubbleSort';
import { quickSort, QUICK_SORT_CODE } from './modules/Sorting/algorithms/quickSort';
import { SortingVisualizer } from './modules/Sorting/components/SortingVisualizer';
import { bfsAlgorithm, BFS_CODE } from './modules/Graph/algorithms/bfs';
import { dfsAlgorithm, DFS_CODE } from './modules/Graph/algorithms/dfs';
import { GraphVisualizer } from './modules/Graph/components/GraphVisualizer';
import { PlayerControls } from './components/ui/PlayerControls';
import { CodeViewer } from './components/ui/CodeViewer';
import { Dropdown } from './components/ui/Dropdown'; // Add this import
import { useAlgorithmPlayer } from './hooks/useAlgorithmPlayer';
import type { AlgorithmGenerator, SupportedLanguage, GraphData, AlgorithmStep } from './types';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { Card } from './components/ui/Card';

// --- Helper Functions ---
const generateRandomArray = (length = 10) => {
  const arr = Array.from({ length }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const SAMPLE_GRAPH: GraphData = {
  nodes: [
    { id: 'A', label: 'A', x: 50, y: 50 },
    { id: 'B', label: 'B', x: 150, y: 50 },
    { id: 'C', label: 'C', x: 250, y: 50 },
    { id: 'D', label: 'D', x: 100, y: 150 },
    { id: 'E', label: 'E', x: 200, y: 150 },
    { id: 'F', label: 'F', x: 150, y: 250 },
  ],
  edges: [
    { id: 'AB', source: 'A', target: 'B' },
    { id: 'AC', source: 'A', target: 'C' },
    { id: 'BD', source: 'B', target: 'D' },
    { id: 'CD', source: 'C', target: 'D' },
    { id: 'DE', source: 'D', target: 'E' },
    { id: 'EF', source: 'E', target: 'F' },
  ],
  directed: false,
};

// --- Algorithm Configuration ---
type AlgoConfig<T> = {
  name: string;
  func: AlgorithmGenerator<T>;
  complexity: string;
  description: string;
  code: Record<SupportedLanguage, string>;
  getInitialData: () => T;
  Visualizer: React.ComponentType<{ step: AlgorithmStep<T> }>;
  type: 'sorting' | 'graph';
  startNodeId?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ALGORITHMS: Record<string, AlgoConfig<any>> = {
  bubble: {
    name: '冒泡排序 (Bubble Sort)',
    func: bubbleSort,
    complexity: 'O(n²)',
    description: '重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。"冒泡"这个名字由来是因为越小的元素会经由交换慢慢"浮"到数列的顶端。',
    code: BUBBLE_SORT_CODE,
    getInitialData: () => generateRandomArray(12),
    Visualizer: SortingVisualizer,
    type: 'sorting',
  },
  quick: {
    name: '快速排序 (Quick Sort)',
    func: quickSort,
    complexity: 'O(n log n)',
    description: '通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以达到整个数据变成有序序列。',
    code: QUICK_SORT_CODE,
    getInitialData: () => generateRandomArray(12),
    Visualizer: SortingVisualizer,
    type: 'sorting',
  },
  bfs: {
    name: '广度优先搜索 (BFS)',
    func: bfsAlgorithm,
    complexity: 'O(V + E)',
    description: '从图的某个节点出发，首先访问该节点本身，然后访问其所有未访问的邻居节点，再依次访问这些邻居节点的未访问邻居，以此类推。BFS 总是优先探索离起始节点最近的节点，因此常用于查找最短路径或遍历连通分量。',
    code: BFS_CODE,
    getInitialData: () => SAMPLE_GRAPH,
    Visualizer: GraphVisualizer,
    type: 'graph',
    startNodeId: 'A',
  },
  dfs: {
    name: '深度优先搜索 (DFS)',
    func: dfsAlgorithm,
    complexity: 'O(V + E)',
    description: '从图的某个节点出发，尽可能深地搜索树的分支。当节点v的所在边都已被探寻过，搜索将回溯到发现节点v的那条边的起始节点。这一过程一直进行到已发现从源节点可达的所有节点为止。DFS常用于拓扑排序、连通性检测等。',
    code: DFS_CODE,
    getInitialData: () => SAMPLE_GRAPH,
    Visualizer: GraphVisualizer,
    type: 'graph',
    startNodeId: 'A',
  },
};

const LANGUAGES: Record<SupportedLanguage, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  go: 'Go',
};

// --- AlgorithmRunner Component ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AlgorithmRunner = ({ config, language }: { config: AlgoConfig<any>, language: SupportedLanguage }) => {
  const [currentInitialData, setCurrentInitialData] = useState(() => config.getInitialData());

  const player = useAlgorithmPlayer({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    algorithm: useCallback((initialData: any) => {
      if (config.type === 'graph') {
        return (config.func as AlgorithmGenerator<GraphData>)(initialData, config.startNodeId);
      } else {
        return (config.func as AlgorithmGenerator<number[]>)(initialData);
      }
    }, [config.func, config.type, config.startNodeId]),
    initialData: currentInitialData,
    initialSpeed: 300,
  });

  const handleDataReset = () => {
    let newData;
    if (config.type === 'sorting') {
      newData = generateRandomArray(12);
    } else if (config.type === 'graph') {
      newData = JSON.parse(JSON.stringify(config.getInitialData())) as GraphData;
      newData.nodes.forEach(node => node.status = 'unvisited');
      newData.edges.forEach(edge => edge.status = 'default');
    }
    setCurrentInitialData(newData);
    player.controls.reset();
  };

  const VisualizerComponent = config.Visualizer;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Stage: 8 columns */}
      <div className="lg:col-span-8 flex flex-col gap-6">

        {/* Visualizer Window */}
        <Card className="relative overflow-hidden min-h-[400px] flex flex-col p-0">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleDataReset}
              className="px-3 py-1.5 bg-white/10 backdrop-blur hover:bg-white/20 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors border border-white/10"
            >
              {config.type === 'sorting' ? '随机重置数据' : '重置图'}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 relative">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            <div className="relative z-0 w-full px-8">
              <VisualizerComponent step={player.currentStep} />
            </div>
          </div>

          {/* Player Controls Bar (Floating-like at bottom) */}
          <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
            <PlayerControls
              isPlaying={player.isPlaying}
              currentStep={player.currentStepIndex}
              totalSteps={player.totalSteps}
              speed={player.speed}
              onTogglePlay={player.controls.togglePlay}
              onNext={player.controls.next}
              onPrev={player.controls.prev}
              onReset={player.controls.reset}
              onSeek={player.controls.seek}
              onSpeedChange={player.setSpeed}
            />
          </div>
        </Card>

        {/* Log Console */}
        <Card title="执行日志" className="min-h-[100px] font-mono text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="text-blue-500">➜</span>
            <span>{player.currentStep.log || "准备就绪"}</span>
          </div>
        </Card>
      </div>

      {/* Sidebar: 4 columns */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full">
        {/* Code X-Ray */}
        <Card title="代码透视" className="flex-1 min-h-[400px] flex flex-col p-0 overflow-hidden">
          <CodeViewer
            code={config.code[language]}
            activeLabel={player.currentStep.codeLabel}
          />
        </Card>

        {/* Algorithm Intel */}
        <Card title="算法情报" className="min-h-[150px]">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">时间复杂度</span>
              <p className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-1 font-mono">{config.complexity}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">核心思路</span>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {config.description}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

function App() {
  const [selectedAlgoKey, setSelectedAlgoKey] = useState<string>('bubble');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const { theme, toggleTheme } = useTheme();

  const selectedAlgo = ALGORITHMS[selectedAlgoKey];

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-200 selection:bg-blue-500/30 relative">
        
                          {/* Background Gradients (X-Ray Beams) */}
        
                          <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        
                            {/* Primary Beam */}
        
                            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_140deg,var(--color-beam)_160deg,transparent_180deg)] opacity-30 dark:opacity-20 animate-beam-rotate [--color-beam:#818cf8] dark:[--color-beam:#a78bfa]"></div>
        
                            
        
                            {/* Secondary Beam */}
        
                            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_180deg,transparent_0deg,transparent_140deg,var(--color-beam-2)_160deg,transparent_180deg)] opacity-20 dark:opacity-10 animate-beam-rotate-reverse [--color-beam-2:#22d3ee] dark:[--color-beam-2:#2dd4bf]"></div>
        
                            
        
                            
        
                          </div>        <div className="relative z-10">
          <Header theme={theme} toggleTheme={toggleTheme} />
  
          <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
          {/* Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative group">
              <Dropdown
                options={Object.entries(ALGORITHMS).map(([key, algo]) => ({
                  value: key,
                  label: algo.name,
                }))}
                value={selectedAlgoKey}
                onChange={(value) => setSelectedAlgoKey(value)}
                placeholder="选择算法"
                className="min-w-[240px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {Object.entries(LANGUAGES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLanguage(key as SupportedLanguage)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${language === key
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <AlgorithmRunner
          key={selectedAlgoKey}
          config={selectedAlgo}
          language={language}
        />

        </main>
      </div>
    </div>
  );
}

export default App;
