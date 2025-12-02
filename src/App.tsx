import { useState } from 'react';
import { bubbleSort, BUBBLE_SORT_CODE } from './modules/Sorting/algorithms/bubbleSort';
import { quickSort, QUICK_SORT_CODE } from './modules/Sorting/algorithms/quickSort';
import { SortingVisualizer } from './modules/Sorting/components/SortingVisualizer';
import { PlayerControls } from './components/ui/PlayerControls';
import { CodeViewer } from './components/ui/CodeViewer';
import { useAlgorithmPlayer } from './hooks/useAlgorithmPlayer';
import type { AlgorithmGenerator, SupportedLanguage } from './types';

// Generate a random array of distinct numbers
const generateRandomArray = (length = 10) => {
  const arr = Array.from({ length }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const ALGORITHMS: Record<string, { name: string; func: AlgorithmGenerator<number[]>; complexity: string; description: string; code: Record<SupportedLanguage, string> }> = {
  bubble: {
    name: '冒泡排序 (Bubble Sort)',
    func: bubbleSort,
    complexity: 'O(n²)',
    description: '核心思路：重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。"冒泡"这个名字由来是因为越小的元素会经由交换慢慢"浮"到数列的顶端。',
    code: BUBBLE_SORT_CODE,
  },
  quick: {
    name: '快速排序 (Quick Sort)',
    func: quickSort,
    complexity: 'O(n log n)',
    description: '核心思路：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以达到整个数据变成有序序列。',
    code: QUICK_SORT_CODE,
  },
};

const LANGUAGES: Record<SupportedLanguage, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  go: 'Go',
};

function App() {
  // Initial data state
  const [data, setData] = useState(() => generateRandomArray(12));
  const [selectedAlgoKey, setSelectedAlgoKey] = useState<string>('bubble');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');

  const selectedAlgo = ALGORITHMS[selectedAlgoKey];

  // Initialize the player hook
  const player = useAlgorithmPlayer({
    algorithm: selectedAlgo.func,
    initialData: data,
    initialSpeed: 300,
  });

  const handleShuffle = () => {
    const newData = generateRandomArray(12);
    setData(newData);
    // The hook will automatically reset when data changes due to its dependency array
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-12 px-4 font-sans">
      
      <header className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          CodeXRay
        </h1>
        <p className="text-slate-500 text-sm">算法原理可视化 (Algorithm Mechanics Visualized)</p>
      </header>

      <main className="w-full max-w-3xl space-y-6">
        {/* Top Bar: Algorithm Info & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 pb-4 border-b border-slate-800">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">当前算法</label>
            <select 
              value={selectedAlgoKey}
              onChange={(e) => setSelectedAlgoKey(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-lg font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:min-w-[200px]"
            >
              {Object.entries(ALGORITHMS).map(([key, algo]) => (
                <option key={key} value={key}>
                  {algo.name}
                </option>
              ))}
            </select>
            <p className="text-slate-400 text-xs">{selectedAlgo.complexity} 时间复杂度</p>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">语言</label>
                <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-slate-900 border border-slate-700 text-white text-sm font-semibold rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[120px]"
                >
                {Object.entries(LANGUAGES).map(([key, label]) => (
                    <option key={key} value={key}>
                    {label}
                    </option>
                ))}
                </select>
            </div>

            <button 
                onClick={handleShuffle}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
            >
                随机重置数据
            </button>
          </div>
        </div>

        {/* Algorithm Description */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50 text-sm text-slate-400 leading-relaxed">
          <p><span className="text-slate-300 font-semibold">算法简介：</span>{selectedAlgo.description}</p>
        </div>

        {/* Code Viewer (now above visualization) */}
        <div className="h-full min-h-[300px]">
             <CodeViewer 
                code={selectedAlgo.code[language]} 
                activeLabel={player.currentStep.codeLabel} 
             />
        </div>

        {/* Visualization Area + Controls (now below code viewer) */}
        <div className="flex flex-col gap-6">
             <div className="relative group">
              <SortingVisualizer step={player.currentStep} />
              
              {/* Log Overlay */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-xs font-mono text-blue-200 px-3 py-1.5 rounded-full border border-blue-500/20 opacity-80">
                {player.currentStep.log || "准备就绪"}
              </div>
            </div>

            {/* Controls */}
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
      </main>
    </div>
  );
}

export default App;