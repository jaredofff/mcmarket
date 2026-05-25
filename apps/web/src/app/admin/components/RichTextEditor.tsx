'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Link2, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write markdown here...',
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    const newValue =
      value.substring(0, start) + before + selected + after + value.substring(end);

    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Bold',
      action: () => insertMarkdown('**', '**'),
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => insertMarkdown('_', '_'),
    },
    {
      icon: Code,
      label: 'Code',
      action: () => insertMarkdown('`', '`'),
    },
    {
      icon: Link2,
      label: 'Link',
      action: () => insertMarkdown('[', '](url)'),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap">
        {toolbarButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              title={btn.label}
              className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg transition-colors"
            >
              <Icon size={18} />
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="ml-auto px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg transition-colors text-sm font-medium"
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Editor / Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Textarea */}
        <textarea
          id="markdown-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-64 p-4 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] placeholder-[#a89968] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 font-mono text-sm ${
            showPreview ? 'hidden lg:block' : ''
          }`}
        />

        {/* Preview */}
        <div
          className={`h-64 p-4 bg-[#0f0e0b] border border-amber-500/20 rounded-lg overflow-y-auto ${
            showPreview ? '' : 'hidden lg:block'
          }`}
        >
          <div className="prose prose-invert max-w-none prose-sm">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="text-[#e8e4db] mb-2">{children}</p>,
                strong: ({ children }) => <strong className="text-amber-500">{children}</strong>,
                em: ({ children }) => <em className="italic text-amber-500/80">{children}</em>,
                code: ({ children }) => (
                  <code className="bg-amber-500/10 px-2 py-1 rounded text-amber-400 font-mono text-xs">
                    {children}
                  </code>
                ),
                a: ({ children, href }) => (
                  <a href={href} className="text-amber-400 hover:underline">
                    {children}
                  </a>
                ),
                h1: ({ children }) => <h1 className="text-xl font-bold text-amber-500 mb-2 mt-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold text-amber-500 mb-2 mt-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold text-amber-500 mb-1">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc list-inside text-[#e8e4db] mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-[#e8e4db] mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-amber-500 pl-4 italic text-[#a89968] my-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {value || '*Write markdown to see preview...*'}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#a89968]">
        Supports Markdown: **bold**, _italic_, `code`, [links](url)
      </p>
    </div>
  );
}
