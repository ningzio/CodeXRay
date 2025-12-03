import React, { useMemo, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { parseCodeWithLabels } from '../../utils/codeParser';
import type { SupportedLanguage } from '../../types';

type CodeViewerProps = {
  code: string;
  activeLabel?: string;
  language?: SupportedLanguage;
  theme: 'light' | 'dark';
};

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, activeLabel, language = 'javascript', theme }) => {
  const { cleanCode, labelMap } = useMemo(() => parseCodeWithLabels(code), [code]);
  const activeLineIndex = activeLabel ? labelMap[activeLabel] : -1;

  // Determine style based on theme
  const syntaxStyle = theme === 'dark' ? vscDarkPlus : prism;

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineIndex !== -1) {
      // We use a timeout to ensure the DOM has updated if the code changed
      const timer = setTimeout(() => {
        // Disable auto-scroll on mobile (screen width < 1024px) to prevent page jumping
        // while the user is watching the visualizer animation.
        const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
        if (!isDesktop) return;

        const element = document.getElementById(`code-line-${activeLineIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeLineIndex, code]); // Re-run if active line or code changes

  return (
    <div className="h-full overflow-y-auto font-mono text-xs sm:text-sm">
      <SyntaxHighlighter
        key={`${theme}-${language}`}
        language={language}
        style={syntaxStyle}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          margin: 0,
          padding: 0,
          background: 'transparent', // Let parent handle background
          fontSize: 'inherit',
          lineHeight: '1.5',
        }}
        lineNumberStyle={(lineNumber: number) => {
          const index = lineNumber - 1;
          const isActive = index === activeLineIndex;
          return {
            minWidth: '2.5rem',
            paddingRight: '1rem',
            textAlign: 'right',
            userSelect: 'none',
            // Colors matching Tailwind slate-400/600 and blue-500/300
            color: isActive
              ? (theme === 'dark' ? '#93c5fd' : '#3b82f6')
              : (theme === 'dark' ? '#475569' : '#94a3b8'),
          };
        }}
        lineProps={(lineNumber: number) => {
          const index = lineNumber - 1;
          const isActive = index === activeLineIndex;
          return {
            id: `code-line-${index}`,
            style: { display: 'block' },
            className: `px-4 py-0.5 transition-colors duration-200 border-l-2 ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 dark:border-blue-400'
                : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`
          };
        }}
      >
        {cleanCode}
      </SyntaxHighlighter>
    </div>
  );
};
