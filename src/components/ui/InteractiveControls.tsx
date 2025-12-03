import { useState } from 'react';

export const InteractiveControls = ({ onRun }: { onRun: (type: string, value: number) => void }) => {
    const [value, setValue] = useState(10);
    const [type, setType] = useState('insert');

    return (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-lg p-1 border border-white/10">
            <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="bg-transparent text-slate-600 dark:text-slate-300 text-xs font-medium focus:outline-none px-1"
            >
                <option value="insert">Insert</option>
                <option value="delete">Delete</option>
                <option value="search">Search</option>
            </select>
            <input
                type="number"
                value={value}
                onChange={e => setValue(parseInt(e.target.value) || 0)}
                className="w-12 bg-white/20 text-slate-600 dark:text-slate-300 text-xs text-center rounded focus:outline-none"
            />
            <button
                onClick={() => onRun(type, value)}
                className="px-2 py-0.5 bg-blue-500/80 hover:bg-blue-600/80 text-white text-xs rounded transition-colors"
            >
                Run
            </button>
        </div>
    );
};
