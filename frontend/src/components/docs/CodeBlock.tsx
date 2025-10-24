import React, { useState, useCallback } from 'react';

interface CodeBlockProps {
  title?: string;
  code?: string;
  children?: string;
  language?: string;
}

export default function CodeBlock({
  title,
  code,
  children,
  language = 'typescript'
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeContent = children || code || '';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [codeContent]);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg my-4 border border-gray-800">
      {title && (
        <div className="px-4 py-2 bg-gray-800 text-gray-200 font-semibold text-sm">
          {title}
        </div>
      )}

      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10 bg-gray-700 text-gray-300 hover:bg-gray-600 px-3 py-1 rounded text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <pre className="p-4 overflow-x-auto">
          <code className="text-gray-100 text-sm font-mono">
            {codeContent}
          </code>
        </pre>
      </div>
    </div>
  );
}
