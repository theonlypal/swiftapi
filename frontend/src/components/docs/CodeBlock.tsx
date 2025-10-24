import React, { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Language icons (you can replace these with actual SVG icons or import from an icon library)
const languageIcons = {
  python: '🐍',
  typescript: '🟦',
  curl: '💻'
};

interface CodeBlockProps {
  title?: string;
  code: string | {
    python?: string;
    typescript?: string;
    curl?: string;
  };
  showLineNumbers?: boolean;
  language?: 'python' | 'typescript' | 'curl' | 'bash' | 'json';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  title,
  code,
  showLineNumbers = false,
  language = 'typescript'
}) => {
  const [activeLanguage, setActiveLanguage] = useState<string>(language);
  const [copied, setCopied] = useState(false);

  // Safely get the code for the active language
  const currentCode = typeof code === 'string' ? code : (code[activeLanguage as keyof typeof code] || '');

  // Copy to clipboard handler
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currentCode]);

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg my-4 border border-gray-800">
      {/* Optional Title */}
      {title && (
        <div className="px-4 py-2 bg-gray-800 text-gray-200 font-semibold text-sm">
          {title}
        </div>
      )}

      {/* Language Tabs */}
      {typeof code === 'object' && Object.keys(code).length > 1 && (
        <div className="flex bg-gray-800 px-4 pt-2">
          {(Object.keys(code) as Array<keyof typeof code>).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLanguage(lang as string)}
              className={`
                px-3 py-1 rounded-t-md mr-2 text-sm flex items-center
                ${activeLanguage === lang
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}
              `}
              aria-label={`Switch to ${lang} code`}
            >
              <span className="mr-2">{languageIcons[lang as keyof typeof languageIcons]}</span>
              {String(lang).charAt(0).toUpperCase() + String(lang).slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Code Highlighter Container */}
      <div className="relative">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="
            absolute top-2 right-2 z-10
            bg-gray-700 text-gray-300
            hover:bg-gray-600
            px-3 py-1 rounded
            text-xs transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          aria-label="Copy code"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>

        {/* Syntax Highlighter */}
        <SyntaxHighlighter
          language={activeLanguage}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            backgroundColor: 'transparent',
            fontSize: '0.875rem',
            overflowX: 'auto',
          }}
          lineNumberStyle={{
            color: '#6272a4',
            marginRight: '1rem',
          }}
        >
          {currentCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;