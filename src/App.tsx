import { useState, useCallback, useMemo } from 'react';
import { Code2, GitGraph, Network } from 'lucide-react';
import { bubbleSort, BUBBLE_SORT_CODE } from './modules/Sorting/algorithms/bubbleSort';
import { quickSort, QUICK_SORT_CODE } from './modules/Sorting/algorithms/quickSort';
import { mergeSort, MERGE_SORT_CODE } from './modules/Sorting/algorithms/mergeSort';
import { SortingVisualizer } from './modules/Sorting/components/SortingVisualizer';
import { bfsAlgorithm, BFS_CODE } from './modules/Graph/algorithms/bfs';
import { dfsAlgorithm, DFS_CODE } from './modules/Graph/algorithms/dfs';
import { dijkstraAlgorithm, DIJKSTRA_CODE } from './modules/Graph/algorithms/dijkstra';
import { GraphVisualizer } from './modules/Graph/components/GraphVisualizer';
import { avlAlgorithm, AVL_CODE, generateRandomAVLTree } from './modules/Tree/algorithms/avl';
import { redBlackTreeAlgorithm, RED_BLACK_TREE_CODE, generateRandomRedBlackTree } from './modules/Tree/algorithms/redBlackTree';
import { bPlusTreeAlgorithm, generateRandomBPlusTree } from './modules/Tree/algorithms/bplusTree';
import { B_PLUS_TREE_CODE } from './modules/Tree/algorithms/bplusTreeCode';
import { TreeVisualizer } from './modules/Tree/components/TreeVisualizer';
import { PlayerControls } from './components/ui/PlayerControls';
import { CodeViewer } from './components/ui/CodeViewer';
import { Sidebar, type SidebarGroup } from './components/layout/Sidebar';
import { useAlgorithmPlayer } from './hooks/useAlgorithmPlayer';
import type { AlgorithmGenerator, SupportedLanguage, GraphData, AlgorithmStep, AlgorithmProfile } from './types';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { Card } from './components/ui/Card';
import { AlgorithmIntel } from './components/ui/AlgorithmIntel';
import { InteractiveControls } from './components/ui/InteractiveControls';

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
  type: 'sorting' | 'graph' | 'tree';
  startNodeId?: string;
  interactive?: boolean;
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
  merge: {
    name: '归并排序 (Merge Sort)',
    func: mergeSort,
    profile: {
      complexity: {
        time: 'O(n log n)',
        space: 'O(n)',
        bestCase: 'O(n log n)',
        worstCase: 'O(n log n)',
      },
      description: '经典的分治排序算法，将数组一分为二分别排序，再线性归并。',
      howItWorks: '递归地将数组分成左右两半，直到子数组长度为1，再通过双指针线性合并。归并阶段会使用辅助数组暂存有序结果。',
      keyConcepts: ['分治法', '稳定排序', '外部排序友好', '需要额外空间'],
      scenarios: ['需要稳定性的排序需求', '链表排序 (易于合并)', '外部排序/磁盘排序', '并行化友好 (左右分支可并行)'],
      pitfalls: ['额外 O(n) 空间开销', '递归实现可能导致深度开销', '合并时指针边界容易出错'],
      links: [
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Merge_sort' },
        { label: 'VisuAlgo', url: 'https://visualgo.net/en/sorting' },
      ],
    },
    code: MERGE_SORT_CODE,
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
  avl: {
    name: '平衡二叉树 (AVL Tree)',
    func: avlAlgorithm,
    profile: {
      complexity: {
        time: 'O(log n)',
        space: 'O(n)',
        bestCase: 'O(1) (Hash-like)',
        worstCase: 'O(log n)'
      },
      description: '一种自平衡二叉搜索树，保证任何节点的左右子树高度差不超过1。',
      howItWorks: '在插入或删除节点后，计算每个节点的平衡因子。如果平衡因子绝对值大于1，通过旋转（LL, RR, LR, RL）来恢复平衡。',
      keyConcepts: ['二叉搜索树', '平衡因子', '左旋/右旋', '自平衡'],
      scenarios: ['需要频繁查找且数据变动不频繁的场景', '数据库索引', '集合(Set)和映射(Map)的底层实现'],
      pitfalls: ['实现复杂，旋转逻辑容易出错', '插入删除开销比红黑树大（维护严格平衡）', '额外存储高度信息'],
      links: [
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/AVL_tree' },
        { label: 'Visualgo', url: 'https://visualgo.net/en/bst' }
      ]
    },
    code: AVL_CODE,
    getInitialData: () => generateRandomAVLTree(12),
    Visualizer: TreeVisualizer,
    type: 'tree',
    interactive: true,
  },
  rbt: {
    name: '红黑树 (Red-Black Tree)',
    func: redBlackTreeAlgorithm,
    profile: {
      complexity: {
        time: 'O(log n)',
        space: 'O(n)',
        bestCase: 'O(log n)',
        worstCase: 'O(log n)'
      },
      description: '一种广泛应用的自平衡二叉搜索树，通过节点颜色约束来维持大致平衡。',
      howItWorks: '每个节点被标记为红色或黑色。通过五条关键性质来约束树高：1. 节点是红色或黑色。2. 根节点是黑色。3. 所有叶子节点(NIL)是黑色。4. 红色节点的子节点必须是黑色。5. 从任一节点到其每个叶子的所有简单路径都包含相同数目的黑色节点。',
      keyConcepts: ['颜色标记', '黑高 (Black Height)', '颜色翻转', '旋转'],
      scenarios: ['Java TreeMap/TreeSet', 'C++ std::map/set', 'Linux 进程调度 (CFS)'],
      pitfalls: ['实现极为繁琐，边界情况多', '理解"黑高"概念有难度', '删除操作的修复逻辑非常复杂'],
      links: [
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Red%E2%80%93black_tree' },
        { label: 'USFCA Visualization', url: 'https://www.cs.usfca.edu/~galles/visualization/RedBlack.html' }
      ]
    },
    code: RED_BLACK_TREE_CODE,
    getInitialData: () => generateRandomRedBlackTree(12),
    Visualizer: TreeVisualizer,
    type: 'tree',
    interactive: true,
  },
  bplus: {
    name: 'B+ 树 (B+ Tree)',
    func: bPlusTreeAlgorithm,
    profile: {
      complexity: {
        time: 'O(log n)',
        space: 'O(n)',
        bestCase: 'O(1) (Root)',
        worstCase: 'O(log n)'
      },
      description: '专为磁盘存储设计的自平衡树，所有数据都在叶子节点，适合范围查询。',
      howItWorks: '每个节点包含多个键值 (Block)。内部节点仅做索引，叶子节点存储数据并用链表连接。插入满时分裂，删除少时合并或借位，保证树高度极低且平衡。',
      keyConcepts: ['多路搜索树', '磁盘 I/O 优化', '叶子链表', '分裂与合并'],
      scenarios: ['数据库索引 (MySQL InnoDB)', '文件系统 (NTFS, Ext4)', '需要大量范围查询的场景'],
      pitfalls: ['实现极为复杂 (分裂/合并情况多)', '节点大小需与磁盘页大小匹配', '内存中优势不如红黑树'],
      links: [
        { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/B%2B_tree' },
        { label: 'USFCA Visualization', url: 'https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html' }
      ]
    },
    code: B_PLUS_TREE_CODE,
    getInitialData: () => generateRandomBPlusTree(5),
    Visualizer: TreeVisualizer,
    type: 'tree',
    interactive: true,
  },
};

const LANGUAGES: Record<SupportedLanguage, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  go: 'Go',
};

// --- AlgorithmRunner Component ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AlgorithmRunner = ({ config, language, onLanguageChange, theme }: { config: AlgoConfig<any>, language: SupportedLanguage, onLanguageChange: (lang: SupportedLanguage) => void, theme: 'light' | 'dark' }) => {
  const [currentInitialData, setCurrentInitialData] = useState(() => config.getInitialData());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [interactiveOp, setInteractiveOp] = useState<{ type: string, value: any } | null>(null);

  const player = useAlgorithmPlayer({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    algorithm: useCallback((initialData: any) => {
      if (config.interactive && interactiveOp) {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         return (config.func as any)(initialData, interactiveOp);
      }
      if (config.type === 'graph' || config.type === 'tree') {
        return (config.func as AlgorithmGenerator<GraphData>)(initialData, config.startNodeId);
      } else {
        return (config.func as AlgorithmGenerator<number[]>)(initialData);
      }
    }, [config.func, config.type, config.startNodeId, config.interactive, interactiveOp]),
    initialData: currentInitialData,
    initialSpeed: 300,
    autoPlay: !!interactiveOp, // Auto-play when interactive operation is triggered
  });

  const handleDataReset = () => {
    let newData;
    if (config.type === 'sorting') {
      newData = generateRandomArray(12);
    } else if (config.type === 'graph' || config.type === 'tree') {
      newData = JSON.parse(JSON.stringify(config.getInitialData())) as GraphData;
      newData.nodes.forEach(node => node.status = 'unvisited');
      newData.edges.forEach(edge => edge.status = 'default');
    }
    setCurrentInitialData(newData);
    setInteractiveOp(null); // Reset any pending op
    player.controls.reset();
  };

  const handleInteractiveRun = (type: string, value: number) => {
      // 1. Capture current state as the new initial state
      const currentState = player.currentStep.state;
      setCurrentInitialData(currentState);

      // 2. Set the operation to trigger the new run
      setInteractiveOp({ type, value });

      // Force play immediately
      player.controls.reset();
  };

  const VisualizerComponent = config.Visualizer;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-full content-start min-h-0">
      {/* Main Stage (Left): 8 columns */}
      <div className="lg:col-span-8 flex flex-col gap-6 lg:h-full lg:overflow-y-auto lg:pr-1 lg:pb-32 lg:scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 min-h-0">

        {/* Visualizer Window */}
        <Card className="relative overflow-hidden min-h-[400px] flex-none flex flex-col p-0">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {config.interactive && (
               <InteractiveControls onRun={handleInteractiveRun} />
            )}
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

        {/* Log Console (below animation) */}
        <Card title="执行日志" className="min-h-[100px] flex-none font-mono text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="text-blue-500">➜</span>
            <span>{player.currentStep.log || "准备就绪"}</span>
          </div>
        </Card>

        {/* Algorithm Intel */}
        <Card title="算法情报" className="min-h-[300px] flex flex-col overflow-hidden">
          <AlgorithmIntel profile={config.profile} />
        </Card>
      </div>

      {/* Sidebar (Right): 4 columns */}
      <div className="lg:col-span-4 flex flex-col gap-6 lg:h-full lg:overflow-y-auto lg:pr-1 lg:pb-32 lg:scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 min-h-0">
        {/* Code X-Ray */}
        <Card
          title="代码透视"
          className="min-h-[200px] flex flex-col p-0 overflow-hidden"
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
            language={language}
            theme={theme}
          />
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
      tree: [],
    };

    Object.entries(ALGORITHMS).forEach(([key, algo]) => {
      if (groups[algo.type]) {
        groups[algo.type].push({ value: key, label: algo.name });
      }
    });

    return [
      { id: 'sorting', label: '排序算法', icon: Code2, items: groups.sorting },
      { id: 'graph', label: '图算法', icon: GitGraph, items: groups.graph },
      { id: 'tree', label: '树算法', icon: Network, items: groups.tree },
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
                 theme={theme}
               />
             </div>
           </main>
        </div>
      </div>
    );
}

export default App;
