import { useState } from 'react';
import { bubbleSort } from './modules/Sorting/algorithms/bubbleSort';
import { SortingVisualizer } from './modules/Sorting/components/SortingVisualizer';
import { PlayerControls } from './components/ui/PlayerControls';
import { useAlgorithmPlayer } from './hooks/useAlgorithmPlayer';

// Generate a random array of distinct numbers
const generateRandomArray = (length = 10) => {
  const arr = Array.from({ length }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function App() {
  // Initial data state
  const [data, setData] = useState(() => generateRandomArray(12));

  // Initialize the player hook
  const player = useAlgorithmPlayer({
    algorithm: bubbleSort,
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
      
      <header className="mb-10 text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          CodeXRay
        </h1>
        <p className="text-slate-500 text-sm">Algorithm Mechanics Visualized</p>
      </header>

      <main className="w-full max-w-3xl space-y-6">
        {/* Top Bar: Algorithm Info & Actions */}
        <div className="flex justify-between items-end pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-semibold text-white">Bubble Sort</h2>
            <p className="text-slate-400 text-sm">O(n²) Time Complexity</p>
          </div>
          <button 
            onClick={handleShuffle}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            Shuffle Data
          </button>
        </div>

        {/* Visualization Area */}
        <div className="relative group">
          <SortingVisualizer step={player.currentStep} />
          
          {/* Log Overlay */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-xs font-mono text-blue-200 px-3 py-1.5 rounded-full border border-blue-500/20 opacity-80">
            {player.currentStep.log || "Ready"}
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
      </main>
    </div>
  );
}

export default App;