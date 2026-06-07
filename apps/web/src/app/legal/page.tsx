import type { Metadata } from "next";
import Link from "next/link";
import { legalPages } from "./legal-content";

export const metadata: Metadata = {
  title: "Legal | MC Market",
  description:
    "Consulta los términos, privacidad, reembolsos y proceso DMCA de MC Market.",
};

export default function LegalIndexPage() {
  return (
    <div className="min-h-full bg-[#141311]">
      <section className="border-b border-[#2d2a26] bg-[#0f0e0c]">
        <div className="container mx-auto px-6 py-14 md:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            MC Market
          </p>
          <h1 className="mt-5 max-w-3xl font-outfit text-4xl font-black tracking-normal text-[#f5efe2] md:text-5xl">
            Legal
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#a39c90]">
            Revisa las políticas principales que regulan el uso de la plataforma,
            las compras digitales, la privacidad y los reportes de derechos de
            autor.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {legalPages.map((page) => (
            <Link
              key={page.slug}
              href={`/legal/${page.slug}`}
              className="group border border-[#2d2a26] bg-[#1c1a17] p-6 transition-colors hover:border-amber-400/50"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">
                Actualizado: {page.updatedAt}
              </p>
              <h2 className="mt-4 font-outfit text-2xl font-bold text-[#f5efe2] transition-colors group-hover:text-amber-300">
                {page.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#a39c90]">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
