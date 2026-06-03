"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  emptyText?: string;
}

export default function MarkdownRenderer({
  content,
  emptyText = "Escribe una descripcion para ver la vista previa...",
}: MarkdownRendererProps) {
  return (
    <div className="space-y-4 text-[#d8d2c7]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-outfit text-3xl font-black leading-tight text-amber-400">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-outfit text-2xl font-bold leading-tight text-amber-400">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-outfit text-xl font-bold leading-tight text-amber-400">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="leading-7 text-[#d8d2c7]">{children}</p>,
          strong: ({ children }) => <strong className="font-black text-amber-300">{children}</strong>,
          em: ({ children }) => <em className="italic text-amber-300/90">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-amber-400 underline decoration-amber-500/40 underline-offset-4 hover:text-amber-300"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="ml-5 list-disc space-y-2 text-[#d8d2c7] marker:text-amber-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-5 list-decimal space-y-2 text-[#d8d2c7] marker:text-amber-400">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-amber-500 bg-amber-500/5 px-4 py-3 italic text-[#c9bda8]">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded-sm border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-sm text-amber-300">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-sm border border-[#2d2a26] bg-[#11100e] p-4 text-sm leading-6 text-[#e8e4db]">
              {children}
            </pre>
          ),
          img: ({ src, alt }) => {
            if (!src) return null;

            return (
              <span className="my-5 block overflow-hidden rounded-sm border border-[#2d2a26] bg-[#11100e]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt || "Imagen del recurso"}
                  className="max-h-[520px] w-full object-contain"
                  loading="lazy"
                />
              </span>
            );
          },
          hr: () => <hr className="border-[#2d2a26]" />,
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-sm border border-[#2d2a26]">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-[#2d2a26] bg-[#181512] px-3 py-2 text-left font-bold text-amber-400">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border-b border-[#2d2a26] px-3 py-2">{children}</td>,
        }}
      >
        {content.trim() || `_${emptyText}_`}
      </ReactMarkdown>
    </div>
  );
}
