'use client';

import React, { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!content) return null;

  // Split content by code fences ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  const copyCode = (codeText: string, idx: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`space-y-2.5 text-sm leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Code block
          const lines = part.slice(3, -3).trim().split('\n');
          const language = lines[0]?.trim() || '';
          const codeContent = language && /^[a-zA-Z0-9_-]+$/.test(language)
            ? lines.slice(1).join('\n')
            : lines.join('\n');

          return (
            <div key={index} className="my-3 rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-md font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                  {language || 'kod'}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(codeContent, index)}
                  className="text-[10px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {copiedIndex === index ? "✓ Nusxalandi" : "Nusxa olish"}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-emerald-300 leading-relaxed">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        // Regular markdown text
        const paragraphs = part.split(/\n\n+/);

        return (
          <React.Fragment key={index}>
            {paragraphs.map((para, pIdx) => {
              const lines = para.split('\n');

              return (
                <div key={pIdx} className="space-y-1">
                  {lines.map((line, lIdx) => {
                    const trimmed = line.trim();

                    // Heading 3
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h4 key={lIdx} className="font-display font-bold text-sm md:text-base text-slate-900 dark:text-white mt-2 mb-1">
                          {renderInline(trimmed.substring(4))}
                        </h4>
                      );
                    }

                    // Heading 2 or 1
                    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
                      const text = trimmed.replace(/^#+\s*/, '');
                      return (
                        <h3 key={lIdx} className="font-display font-bold text-base md:text-lg text-slate-900 dark:text-white mt-2 mb-1">
                          {renderInline(text)}
                        </h3>
                      );
                    }

                    // Bullet items
                    if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                      return (
                        <div key={lIdx} className="flex items-start gap-2 pl-2 text-slate-800 dark:text-slate-200">
                          <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 mt-0.5">•</span>
                          <span>{renderInline(trimmed.substring(2))}</span>
                        </div>
                      );
                    }

                    // Citation or SOW Box highlight
                    if (trimmed.startsWith('📚') || trimmed.startsWith('📌') || trimmed.startsWith('✅') || trimmed.startsWith('⚠️')) {
                      return (
                        <p key={lIdx} className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-slate-800 dark:text-blue-200 text-xs font-medium my-1">
                          {renderInline(trimmed)}
                        </p>
                      );
                    }

                    // Regular line
                    if (!trimmed) return null;

                    return (
                      <p key={lIdx} className="leading-relaxed text-slate-800 dark:text-slate-200">
                        {renderInline(line)}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode[] {
  // Parses **bold** and `code` inline
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-800 dark:text-blue-300 font-mono text-xs border border-slate-200 dark:border-slate-700">
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}
