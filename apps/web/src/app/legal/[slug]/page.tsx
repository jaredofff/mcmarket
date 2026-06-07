import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLegalPage, legalPages } from "../legal-content";

type LegalPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);

  if (!page) {
    return {
      title: "Legal | MC Market",
    };
  }

  return {
    title: `${page.title} | MC Market`,
    description: page.description,
  };
}

export default async function LegalDetailPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const page = getLegalPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-full bg-[#141311]">
      <section className="border-b border-[#2d2a26] bg-[#0f0e0c]">
        <div className="container mx-auto px-6 py-14 md:py-20">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-amber-400 transition-colors hover:text-amber-300"
          >
            MC Market Legal
          </Link>
          <h1 className="mt-5 max-w-3xl font-outfit text-4xl font-black tracking-normal text-[#f5efe2] md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#a39c90]">
            {page.description}
          </p>
          <p className="mt-5 text-sm text-[#6b6459]">
            Última actualización: {page.updatedAt}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 border-l border-[#2d2a26] pl-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#a39c90]">
                Legal
              </p>
              <nav className="space-y-3">
                {legalPages.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/legal/${item.slug}`}
                    className={`block text-sm transition-colors ${
                      item.slug === page.slug
                        ? "text-amber-400"
                        : "text-[#6b6459] hover:text-[#e8e4db]"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <div className="max-w-3xl">
            <div className="space-y-6">
              {page.sections.map((section) => (
                <article
                  key={section.title}
                  className="border border-[#2d2a26] bg-[#1c1a17] p-6"
                >
                  <h2 className="font-outfit text-xl font-bold text-[#f5efe2]">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#a39c90]">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 border-t border-[#2d2a26] pt-6">
              <p className="text-sm leading-7 text-[#6b6459]">
                Esta información sirve como referencia general de la plataforma.
                Para casos específicos, solicitudes legales o soporte de una
                compra, contacta al equipo de MC Market por los canales oficiales.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
