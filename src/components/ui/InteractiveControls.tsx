import { useState } from 'react';

export const InteractiveControls = ({ onRun }: { onRun: (type: string, value: number) => void }) => {
    const [value, setValue] = useState(10);
    const [type, setType] = useState('insert');

    return (
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 shadow-lg rounded-xl p-1.5 border border-slate-200 dark:border-slate-800">
            <div className="relative">
                <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                    <option value="insert">Insert</option>
                    <option value="delete">Delete</option>
                    <option value="search">Search</option>
                </select>
                {/* Custom arrow for better look */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"/>
                    </svg>
                </div>
            </div>

            <input
                type="number"
                value={value}
                onChange={e => setValue(parseInt(e.target.value) || 0)}
                className="w-16 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono text-center rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />

            <button
                onClick={() => onRun(type, value)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-1.5 px-4 rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-1"
            >
                <span>Run</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
            </button>
        </div>
    );
};
