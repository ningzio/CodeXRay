import { useState, useCallback, useMemo } from 'react';
import { Code2, GitGraph } from 'lucide-react';
import { bubbleSort, BUBBLE_SORT_CODE } from './modules/Sorting/algorithms/bubbleSort';
import { quickSort, QUICK_SORT_CODE } from './modules/Sorting/algorithms/quickSort';
import { SortingVisualizer } from './modules/Sorting/components/SortingVisualizer';
import { bfsAlgorithm, BFS_CODE } from './modules/Graph/algorithms/bfs';
import { dfsAlgorithm, DFS_CODE } from './modules/Graph/algorithms/dfs';
import { dijkstraAlgorithm, DIJKSTRA_CODE } from './modules/Graph/algorithms/dijkstra';
import { GraphVisualizer } from './modules/Graph/components/GraphVisualizer';
import { PlayerControls } from './components/ui/PlayerControls';
import { CodeViewer } from './components/ui/CodeViewer';
import { Sidebar, type SidebarGroup } from './components/layout/Sidebar';
import { useAlgorithmPlayer } from './hooks/useAlgorithmPlayer';
import type { AlgorithmGenerator, SupportedLanguage, GraphData, AlgorithmStep, AlgorithmProfile } from './types';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { Card } from './components/ui/Card';
import { AlgorithmIntel } from './components/ui/AlgorithmIntel';

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

const SAMPLE_WEIGHTED_GRAPH: GraphData = {
  nodes: [
    { id: 'A', label: 'A', x: 50, y: 150 },
    { id: 'B', label: 'B', x: 150, y: 50 },
    { id: 'C', label: 'C', x: 150, y: 250 },
    { id: 'D', label: 'D', x: 250, y: 50 },
    { id: 'E', label: 'E', x: 250, y: 250 },
    { id: 'F', label: 'F', x: 350, y: 150 },
  ],
  edges: [
    { id: 'AB', source: 'A', target: 'B', weight: 4 },
    { id: 'AC', source: 'A', target: 'C', weight: 2 },
    { id: 'BD', source: 'B', target: 'D', weight: 3 },
    { id: 'BC', source: 'B', target: 'C', weight: 1 },
    { id: 'CE', source: 'C', target: 'E', weight: 5 },
    { id: 'DE', source: 'D', target: 'E', weight: 1 },
    { id: 'DF', source: 'D', target: 'F', weight: 2 },
    { id: 'EF', source: 'E', target: 'F', weight: 4 },
  ],
  directed: false,
};

// --- Algorithm Configuration ---
type AlgoConfig<T> = {
  name: string;
  func: AlgorithmGenerator<T>;
  profile: AlgorithmProfile;
  code: Record<SupportedLanguage, string>;
  getInitialData: () => T;
  Visualizer: React.ComponentType<{ step: AlgorithmStep<T> }>;
  type: 'sorting' | 'graph';
  startNodeId?: string;
};

// Use unknown instead of any to satisfy linter, or just disable for this map where types are mixed (sorting vs graph)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ALGORITHMS: Record<string, AlgoConfig<any>> = {
  bubble: {
    name: '冒泡排序 (Bubble Sort)',
    func: bubbleSort,
    profile: {
      complexity: {
        time: 'O(n²)',
        space: 'O(1)',
        bestCase: 'O(n) (已排序)',
        worstCase: 'O(n²) (逆序)'
      },
      description: '最简单的排序算法之一，通过重复交换相邻逆序元素将最大值"冒泡"到顶端。',
      howItWorks: '外层循环控制轮数，内层循环进行比较和交换。每轮结束保证当前最大元素归位。像鱼缸里的气泡一样，大的元素会慢慢"浮"到最上面。',
      keyConcepts: ['交换排序', '稳定排序', '原地算法'],
      scenarios: ['教学演示与算法入门', '数据量极小 (n < 20)', '检测数据是否已基本有序'],
      pitfalls: ['效率极低，不适合大数据量', '忘记优化：如果一轮没有交换，应提前结束'],
      links: [
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Bubble_sort' },
        { label: 'VisuAlgo', url: 'https://visualgo.net/en/sorting' }
      ]
    },
    code: BUBBLE_SORT_CODE,
    getInitialData: () => generateRandomArray(12),
    Visualizer: SortingVisualizer,
    type: 'sorting',
  },
  quick: {
    name: '快速排序 (Quick Sort)',
    func: quickSort,
    profile: {
      complexity: {
        time: 'O(n log n)',
        space: 'O(log n)',
        bestCase: 'O(n log n)',
        worstCase: 'O(n²) (Pivot 选得不好)'
      },
      description: '高效的分治排序算法，通过选取基准值(Pivot)将数组分为两部分，递归排序。',
      howItWorks: '选择一个 Pivot，将小于它的放左边，大于它的放右边，然后对左右两部分递归执行此过程。是实际应用中最常用的排序算法之一。',
      keyConcepts: ['分治法', '递归', '原地算法', '非稳定排序'],
      scenarios: ['通用的大规模数据排序', '标准库默认排序算法的基础 (如 C++ std::sort)'],
      pitfalls: ['最坏情况退化：需随机化 Pivot', '栈溢出：递归深度过大', '不稳定：改变相等元素顺序'],
      links: [
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Quicksort' },
        { label: 'Visualgo', url: 'https://visualgo.net/en/sorting' }
      ]
    },
    code: QUICK_SORT_CODE,
    getInitialData: () => generateRandomArray(12),
    Visualizer: SortingVisualizer,
    type: 'sorting',
  },
  bfs: {
    name: '广度优先搜索 (BFS)',
    func: bfsAlgorithm,
    profile: {
      complexity: {
        time: 'O(V + E)',
        space: 'O(V)',
        worstCase: 'O(V + E) (遍历所有节点)'
      },
      description: '从起点开始，一层一层向外扩展的图遍历算法，像水波纹一样扩散。',
      howItWorks: '使用队列(Queue)维护待访问节点。访问节点 v 时，将其所有未访问邻居加入队列。保证了先访问距离近的节点。',
      keyConcepts: ['图遍历', '队列 (FIFO)', '最短路径(无权图)'],
      scenarios: ['无权图的最短路径查找', '社交网络的好友推荐 (六度分隔)', '网页爬虫', '广播/多播路由'],
      pitfalls: ['内存消耗大：需存储整层节点', '无法处理带权图的最短路径', '忘记标记 Visited 导致死循环'],
      links: [
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Breadth-first_search' },
        { label: 'Visualgo', url: 'https://visualgo.net/en/dfsbfs' }
      ]
    },
    code: BFS_CODE,
    getInitialData: () => SAMPLE_GRAPH,
    Visualizer: GraphVisualizer,
    type: 'graph',
    startNodeId: 'A',
  },
  dfs: {
    name: '深度优先搜索 (DFS)',
    func: dfsAlgorithm,
    profile: {
      complexity: {
        time: 'O(V + E)',
        space: 'O(V)',
        worstCase: 'O(V + E)'
      },
      description: '一条路走到黑，直到无路可走才回溯的图遍历算法。',
      howItWorks: '使用递归或栈(Stack)。访问节点 v，然后递归访问它的第一个邻居，直到没有未访问邻居再回溯到上一个路口。',
      keyConcepts: ['图遍历', '递归/栈 (LIFO)', '回溯法'],
      scenarios: ['迷宫生成与寻路', '拓扑排序 (依赖关系分析)', '连通性检测', '检测图中的环'],
      pitfalls: ['不能保证最短路径', '栈溢出：图过深', '需小心处理环路防止死循环'],
      links: [
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Depth-first_search' },
        { label: 'Visualgo', url: 'https://visualgo.net/en/dfsbfs' }
      ]
    },
    code: DFS_CODE,
    getInitialData: () => SAMPLE_GRAPH,
    Visualizer: GraphVisualizer,
    type: 'graph',
    startNodeId: 'A',
  },
  dijkstra: {
    name: 'Dijkstra 最短路径',
    func: dijkstraAlgorithm,
    profile: {
      complexity: {
        time: 'O((V+E) log V)',
        space: 'O(V)',
        bestCase: 'O(E log V)',
        worstCase: 'O(V²)'
      },
      description: '加权图中单源最短路径的经典算法，是地图导航的核心。',
      howItWorks: '维护到每个节点的当前最短距离。每次从优先队列中选择距离最小的未访问节点，尝试通过它"松弛"(Relax)邻居节点的距离，即发现更短的路径就更新。',
      keyConcepts: ['贪心算法', '优先队列', '松弛操作 (Relaxation)'],
      scenarios: ['地图导航 (Google Maps)', '网络路由协议 (OSPF)', '任务调度延迟最小化'],
      pitfalls: ['无法处理负权边 (需用 Bellman-Ford)', '不适用于存在负权环的图', '性能依赖优先队列实现'],
      links: [
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm' },
        { label: 'Visualgo', url: 'https://visualgo.net/en/sssp' }
      ]
    },
    code: DIJKSTRA_CODE,
    getInitialData: () => SAMPLE_WEIGHTED_GRAPH,
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
const AlgorithmRunner = ({
  config,
  language,
  onLanguageChange
}: {
  config: AlgoConfig<any>,
  language: SupportedLanguage,
  onLanguageChange: (lang: SupportedLanguage) => void
}) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-full content-start">
      {/* Main Stage (Left): 8 columns */}
      <div className="lg:col-span-8 flex flex-col gap-6 lg:h-full lg:overflow-y-auto lg:pr-1 lg:pb-32 lg:scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">

        {/* Visualizer Window */}
        <Card className="relative overflow-hidden min-h-[400px] flex-none flex flex-col p-0">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleDataReset}
              className="px-3 py-1.5 bg-white/10 backdrop-blur hover:bg-white/20 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors border border-white/10"
            >
              {config.type === 'sorting' ? '随机重置数据' : '重置图'}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 relative min-h-[300px]">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            <div className="relative z-0 w-full px-8 py-8">
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

        {/* Algorithm Intel (Moved here) */}
        <Card title="算法情报" className="min-h-[300px] flex flex-col overflow-visible">
          <AlgorithmIntel profile={config.profile} />
        </Card>
      </div>

      {/* Sidebar (Right): 4 columns */}
      <div className="lg:col-span-4 flex flex-col gap-6 lg:h-full lg:overflow-y-auto lg:pr-1 lg:pb-32 lg:scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {/* Code X-Ray */}
        <Card
          title="代码透视"
          className="min-h-[200px] flex flex-col p-0 overflow-visible"
          action={
            <div className="flex items-center gap-1">
              {Object.entries(LANGUAGES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => onLanguageChange(key as SupportedLanguage)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${language === key
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          }
        >
          <CodeViewer
            code={config.code[language]}
            activeLabel={player.currentStep.codeLabel}
          />
        </Card>

        {/* Log Console (Moved here) */}
        <Card title="执行日志" className="min-h-[100px] flex-none font-mono text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="text-blue-500">➜</span>
            <span>{player.currentStep.log || "准备就绪"}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

function App() {
  const [selectedAlgoKey, setSelectedAlgoKey] = useState<string>('bubble');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const selectedAlgo = ALGORITHMS[selectedAlgoKey];

  // Group algorithms by type for Sidebar
  const algoGroups = useMemo<SidebarGroup[]>(() => {
    const groups: Record<string, { value: string; label: string }[]> = {
      sorting: [],
      graph: [],
    };

    Object.entries(ALGORITHMS).forEach(([key, algo]) => {
      if (groups[algo.type]) {
        groups[algo.type].push({ value: key, label: algo.name });
      }
    });

    return [
      { id: 'sorting', label: '排序算法', icon: Code2, items: groups.sorting },
      { id: 'graph', label: '图算法', icon: GitGraph, items: groups.graph },
    ];
  }, []);

    return (
      <div className="min-h-screen lg:h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-200 selection:bg-blue-500/30 relative flex flex-col lg:overflow-hidden">
        
        {/* Background Gradients (X-Ray Beams) */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {/* Primary Beam */}
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_140deg,var(--color-beam)_160deg,transparent_180deg)] opacity-30 dark:opacity-20 animate-beam-rotate [--color-beam:#818cf8] dark:[--color-beam:#a78bfa]"></div>

          {/* Secondary Beam */}
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_180deg,transparent_0deg,transparent_140deg,var(--color-beam-2)_160deg,transparent_180deg)] opacity-20 dark:opacity-10 animate-beam-rotate-reverse [--color-beam-2:#22d3ee] dark:[--color-beam-2:#2dd4bf]"></div>
        </div>
        
        {/* Header */}
        <div className="relative z-50 flex-none">
          <Header
            theme={theme}
            toggleTheme={toggleTheme}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        </div>

        <div className="flex flex-1 relative z-10 pt-16 max-w-[1920px] mx-auto w-full lg:overflow-hidden">
           {/* Sidebar */}
           <Sidebar
             groups={algoGroups}
             value={selectedAlgoKey}
             onChange={setSelectedAlgoKey}
             isOpen={isSidebarOpen}
             onClose={() => setIsSidebarOpen(false)}
           />

           {/* Main Content Area */}
           <main className="flex-1 flex flex-col lg:overflow-hidden">
             {/* Header Title (Mobile only) */}
             <div className="p-4 pb-0 lg:hidden flex-none">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedAlgo.name}</h1>
             </div>

             <div className="flex-1 p-4 sm:p-6 lg:p-8 lg:overflow-hidden">
               <AlgorithmRunner
                 key={selectedAlgoKey}
                 config={selectedAlgo}
                 language={language}
                 onLanguageChange={setLanguage}
               />
             </div>
           </main>
        </div>
      </div>
    );
}

export default App;
