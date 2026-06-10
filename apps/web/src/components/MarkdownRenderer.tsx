"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo, useState } from "react";

interface MarkdownRendererProps {
  content: string;
  emptyText?: string;
}

function getMarkdownImageSrc(src: string) {
  if (src.includes("/storage/v1/object/public/plugin-media/markdown/")) {
    return `/api/media/markdown?src=${encodeURIComponent(src)}`;
  }

  return src;
}

function MarkdownImage({ src, alt }: { src: string; alt?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageSrc = useMemo(() => getMarkdownImageSrc(src), [src]);

  return (
    <span className="relative my-5 block min-h-40 overflow-hidden rounded-sm border border-[#2d2a26] bg-[#11100e]">
      {!loaded && !failed ? (
        <span className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#181512] to-[#0f0e0c] text-sm font-bold text-[#6b6459]">
          Cargando imagen...
        </span>
      ) : null}

      {failed ? (
        <span className="flex min-h-40 items-center justify-center px-4 text-center text-sm font-bold text-red-200">
          No se pudo cargar esta imagen. Revisa que exista en Supabase Storage.
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt || "Imagen del recurso"}
          className={`max-h-[520px] w-full object-contain transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
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
            if (typeof src !== "string" || !src) return null;

            return <MarkdownImage src={src} alt={alt || undefined} />;
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
