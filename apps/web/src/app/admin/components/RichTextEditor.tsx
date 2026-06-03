'use client';

import { useRef, useState } from 'react';
import { Bold, Code, ImageIcon, Italic, Link2 } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type EditorTab = 'write' | 'preview';

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Describe que incluye, como se instala, requisitos y soporte...',
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('write');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateSelection = (start: number, end: number) => {
    window.setTimeout(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.focus();
      textarea.selectionStart = start;
      textarea.selectionEnd = end;
    }, 0);
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const nextValue = `${value.slice(0, start)}${text}${value.slice(end)}`;

    onChange(nextValue);
    updateSelection(start + text.length, start + text.length);
  };

  const insertMarkdown = (before: string, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const nextValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;

    onChange(nextValue);
    updateSelection(start + before.length, start + before.length + selected.length);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/admin/uploads/markdown-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'No se pudo subir la imagen');
    }

    const data = await response.json();
    return data.url as string;
  };

  const insertImageMarkdown = (url: string, alt = 'imagen') => {
    const prefix = value && !value.endsWith('\n') ? '\n\n' : '';
    insertText(`${prefix}![${alt}](${url})\n`);
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const imageItem = Array.from(event.clipboardData.items).find((item) =>
      item.type.startsWith('image/')
    );

    if (!imageItem) return;

    const file = imageItem.getAsFile();
    if (!file) return;

    event.preventDefault();
    setUploadError('');
    setUploadingImage(true);

    try {
      const url = await uploadImage(file);
      insertImageMarkdown(url, file.name.replace(/\.[^.]+$/, '') || 'imagen');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'No se pudo subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Negrita',
      action: () => insertMarkdown('**', '**'),
    },
    {
      icon: Italic,
      label: 'Italica',
      action: () => insertMarkdown('_', '_'),
    },
    {
      icon: Code,
      label: 'Codigo',
      action: () => insertMarkdown('`', '`'),
    },
    {
      icon: Link2,
      label: 'Link',
      action: () => insertMarkdown('[', '](https://)'),
    },
    {
      icon: ImageIcon,
      label: 'Imagen',
      action: () => insertMarkdown('![descripcion](', ')'),
    },
  ];

  return (
    <div className="overflow-hidden rounded-sm border border-[#3d3830] bg-[#11100e]">
      <div className="flex flex-col gap-3 border-b border-[#2d2a26] bg-[#181512] p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {toolbarButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.label}
                type="button"
                onClick={btn.action}
                title={btn.label}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-amber-500/20 bg-amber-500/10 text-amber-400 transition-colors hover:bg-amber-500/20"
              >
                <Icon size={17} />
              </button>
            );
          })}
        </div>

        <div className="grid h-9 grid-cols-2 rounded-sm border border-[#3d3830] bg-[#11100e] p-1">
          {[
            { value: 'write' as const, label: 'Escribir' },
            { value: 'preview' as const, label: 'Vista previa' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-sm px-3 text-sm font-bold transition-colors ${
                activeTab === tab.value
                  ? 'bg-amber-500 text-[#141311]'
                  : 'text-[#a89968] hover:text-amber-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-80">
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onPaste={handlePaste}
            placeholder={placeholder}
            className="block h-80 w-full resize-y border-0 bg-[#11100e] p-4 font-mono text-sm leading-6 text-[#e8e4db] outline-none placeholder:text-[#6b6459]"
          />
        ) : (
          <div className="h-80 overflow-y-auto bg-[#0f0e0b] p-5">
            <MarkdownRenderer content={value} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-[#2d2a26] bg-[#181512] px-4 py-3 text-xs text-[#a89968] sm:flex-row sm:items-center sm:justify-between">
        <span>Markdown: **negrita**, _italica_, `codigo`, [links](url), ![imagen](url)</span>
        <span className={uploadError ? 'font-bold text-red-400' : 'font-bold text-amber-400'}>
          {uploadingImage ? 'Subiendo imagen...' : uploadError || 'Puedes pegar imagenes desde el portapapeles'}
        </span>
      </div>
    </div>
  );
}
