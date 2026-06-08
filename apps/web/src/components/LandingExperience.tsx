"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, CheckCircle2, Flame, ShieldCheck, Sparkles, Star } from "lucide-react";

import HeroBanner from "@/components/HeroBanner";
import MinecraftRanksShowcase from "@/components/MinecraftRanksShowcase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, MOCK_PLUGINS, type Plugin } from "@/lib/mockData";

const pageVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const resourceCategories = [
  { icon: "🧩", title: "Plugins", desc: "Plugins únicos optimizados y configurados para rendimiento máximo.", href: "/plugins" },
  { icon: "🖥️", title: "Setups", desc: "Setups completos listos para desplegar tu servidor en minutos.", href: "/setups" },
  { icon: "⚙️", title: "Configs", desc: "Configuraciones profesionales y modelos 3D custom de alta calidad.", href: "/configs" },
  { icon: "🏗️", title: "Builds", desc: "Construcciones premium para lobbies, spawnpoints y más.", href: "/builds" },
  { icon: "🌐", title: "Webs", desc: "Webs y tiendas premium listas para tu servidor.", href: "/webs" },
  { icon: "💻", title: "Paneles", desc: "Temas y paneles personalizados para gestión de servidores.", href: "/webs" },
];

function getLatestPlugins() {
  return [...MOCK_PLUGINS]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);
}

function getTrendingPlugins() {
  return [...MOCK_PLUGINS].sort((a, b) => b.sales - a.sales).slice(0, 3);
}

function getFeaturedPlugins() {
  return MOCK_PLUGINS.filter((plugin) => plugin.featured).slice(0, 3);
}

function PluginMiniCard({ plugin }: { plugin: Plugin }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
      <Card className="h-full border border-[#2d2a26] bg-[#1c1a17] shadow-[4px_4px_0_rgba(0,0,0,0.35)] transition-colors hover:border-amber-500/40">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge variant="outline" className="mb-3 border-amber-500/20 bg-amber-500/10 text-amber-300">
                {plugin.category}
              </Badge>
              <CardTitle className="text-lg text-[#e8e4db]">{plugin.title}</CardTitle>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-400">
              <Star className="size-4 fill-current" />
              {plugin.rating.toFixed(1)}
            </div>
          </div>
          <CardDescription className="text-[#8c8278]">{plugin.shortDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3 text-sm text-[#a39c90]">
          <span>{plugin.creator.username}</span>
          <span className="font-semibold text-[#e8e4db]">{plugin.isFree ? "Gratis" : `$${plugin.price.toFixed(2)}`}</span>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-[#2d2a26] bg-black/10">
          <span className="text-xs uppercase tracking-widest text-[#6b6459]">{plugin.sales} ventas</span>
          <Link href={`/plugins/${plugin.slug}`} className="text-sm font-bold text-amber-400 transition-colors hover:text-amber-300">
            Ver recurso
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function EmptyCollection() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-sm border border-dashed border-[#3d3830] bg-[#1c1a17]/70 px-6 py-12 text-center">
      <h3 className="font-outfit text-xl font-bold text-[#e8e4db]">Catálogo listo para recursos reales</h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#8c8278]">
        Aún no hay productos publicados. Cuando cargues recursos desde el panel de administración, aparecerán aquí automáticamente.
      </p>
      <Link
        href="/admin/plugins/new"
        className="mt-5 rounded-sm border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-400 transition-colors hover:border-amber-500/50 hover:text-amber-300"
      >
        Cargar primer recurso
      </Link>
    </div>
  );
}

export default function LandingExperience() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const featuredPlugins = useMemo(() => getFeaturedPlugins(), []);
  const trendingPlugins = useMemo(() => getTrendingPlugins(), []);
  const latestPlugins = useMemo(() => getLatestPlugins(), []);

  useEffect(() => {
    if (reduceMotion || !rootRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(".hero-orb", {
        y: -18,
        x: 14,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.35,
      });

    }, rootRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <motion.div ref={rootRef} initial="hidden" animate="show" variants={pageVariants} className="relative w-full max-w-full overflow-hidden">
      <section className="relative isolate flex h-[450px] w-full min-w-0 flex-col items-center justify-center overflow-hidden px-4 pb-8 pt-20 text-center sm:px-6">
        <HeroBanner />
        <div className="hero-orb absolute left-1/2 top-[-8%] h-95 w-170 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="hero-orb absolute left-[12%] top-[24%] h-65 w-65 rounded-full bg-yellow-700/10 blur-[110px]" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
            transition={reduceMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-3 flex items-center justify-center p-0"
          >
            <div className="relative h-10 w-10 overflow-hidden sm:h-14 sm:w-14 md:h-16 md:w-16">
              <Image src="/logo.png" alt="MC Market" fill sizes="112px" className="object-contain" priority />
            </div>
          </motion.div>

          <Badge variant="outline" className="mb-3 flex h-auto min-h-5 max-w-full items-center justify-center gap-1 whitespace-normal border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-center text-[9px] font-semibold uppercase leading-relaxed tracking-[0.08em] text-amber-300 sm:text-[11px] sm:tracking-[0.3em]">
            <Sparkles className="size-3 shrink-0" />
            <span className="min-w-0 break-words">Recursos premium verificados para servidores serios</span>
          </Badge>

          <h1 className="w-full max-w-5xl px-1 font-outfit text-2xl font-black leading-[1.05] tracking-tight text-[#e8e4db] drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] sm:px-0 sm:text-4xl md:text-6xl">
            Compra recursos que hacen que tu servidor{" "}
            <br className="hidden md:block" />
            <span className="bg-linear-to-b from-amber-300 via-yellow-400 to-amber-600 bg-clip-text text-transparent block sm:inline mt-2 sm:mt-0">
              cargue mejor y venda más
            </span>
          </h1>

          <p className="mt-3 w-full max-w-3xl px-1 text-xs leading-relaxed text-zinc-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] sm:px-0 sm:text-base md:text-lg">
            Plugins, setups, configs, builds y webs curadas para acelerar el setup, mejorar la experiencia del jugador y dar una apariencia premium desde el primer clic.
          </p>

          <div className="mt-5 flex w-full max-w-sm flex-col gap-3 px-1 sm:w-auto sm:max-w-none sm:flex-row sm:px-0">
            <Button
              size="lg"
              className="h-10 w-full rounded-sm bg-linear-to-b from-amber-400 to-yellow-600 px-5 text-xs font-black text-[#141311] shadow-[0_4px_0_#92400e,inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110 sm:h-11 sm:w-auto sm:px-6 sm:text-sm"
              onClick={() => router.push("/plugins")}
            >
              Ver plugins premium
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-10 w-full rounded-sm border-[#3d3830] bg-[#1c1a17]/90 px-5 text-xs font-black text-[#e8e4db] hover:border-amber-500/30 hover:bg-[#242118] sm:h-11 sm:w-auto sm:px-6 sm:text-sm"
              onClick={() => router.push("/membership")}
            >
              Ver membresía VIP+
            </Button>
          </div>

          <div className="mt-4 hidden w-full min-w-0 flex-wrap items-center justify-center gap-2 px-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#d6d0c5] sm:flex sm:text-[11px] sm:tracking-widest">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-[#1c1a17]/80 px-3 py-1.5 backdrop-blur-sm">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span className="min-w-0 break-words">Entrega instantánea</span>
            </span>
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-[#1c1a17]/80 px-3 py-1.5 backdrop-blur-sm">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span className="min-w-0 break-words">Updates vitalicios</span>
            </span>
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-[#1c1a17]/80 px-3 py-1.5 backdrop-blur-sm">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span className="min-w-0 break-words">Soporte prioritario</span>
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="relative z-20 w-full isolate">
          <MinecraftRanksShowcase />
        </div>

        <div className="mt-14 w-full border-y border-[#2d2a26] py-8">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="text-left">
                <Badge variant="outline" className="mb-5 border-amber-500/20 bg-amber-500/10 text-amber-300">
                  <Sparkles className="mr-1 size-3" />
                  Comunidad MC Market
                </Badge>
                <h2 className="bg-gradient-to-r from-white via-[#f2eee6] to-[#a8a19a] bg-clip-text font-outfit text-3xl font-black leading-tight text-transparent md:text-5xl">
                  Creadores que le dan cara a la comunidad
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#8c8278]">
                  Harlex y Onze son parte de la identidad visual de MC Market. Sus skins viven en el inicio como protagonistas de la comunidad.
                </p>
              </div>

              <div className="grid items-end gap-6 sm:grid-cols-2">
                <div className="group relative flex flex-col items-center">
                  <div className="absolute bottom-16 h-44 w-44 rounded-full bg-amber-500 opacity-15 blur-3xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-35" />
                  <div className="absolute bottom-16 h-3 w-44 rounded-full bg-amber-500/25 blur-lg transition-all duration-500 ease-out group-hover:h-4 group-hover:w-52 group-hover:bg-amber-500/45" />
                  <div className="absolute bottom-16 h-2 w-40 rounded-full bg-black/60 blur-md transition-all duration-500 ease-out group-hover:w-48" />
                  <Image
                    src="/community-creators/harlex.png"
                    alt="Skin de Harlex"
                    width={320}
                    height={480}
                    sizes="(max-width: 640px) 220px, (max-width: 1280px) 280px, 320px"
                    className="relative h-auto w-[220px] object-contain opacity-100 drop-shadow-[0_28px_34px_rgba(0,0,0,0.65)] transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-105 group-hover:drop-shadow-[0_34px_42px_rgba(245,158,11,0.24)] sm:w-[250px] lg:w-[280px] xl:w-[320px]"
                  />
                  <div className="relative mt-3 w-full max-w-xs pt-4 text-center">
                    <div className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-500/55 to-transparent transition-all duration-500 ease-out group-hover:via-amber-400 group-hover:shadow-[0_0_18px_rgba(245,158,11,0.35)]" />
                    <h3 className="font-outfit text-3xl font-black text-[#e8e4db] transition-all duration-500 ease-out group-hover:text-white group-hover:drop-shadow-[0_0_14px_rgba(245,158,11,0.45)]">Harlex</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-amber-400 transition-all duration-500 ease-out group-hover:text-amber-300 group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.45)]">Creador de la comunidad</p>
                  </div>
                </div>

                <div className="group relative flex flex-col items-center">
                  <div className="absolute bottom-16 h-44 w-44 rounded-full bg-emerald-500 opacity-15 blur-3xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-35" />
                  <div className="absolute bottom-16 h-3 w-44 rounded-full bg-emerald-500/25 blur-lg transition-all duration-500 ease-out group-hover:h-4 group-hover:w-52 group-hover:bg-emerald-500/45" />
                  <div className="absolute bottom-16 h-2 w-40 rounded-full bg-black/60 blur-md transition-all duration-500 ease-out group-hover:w-48" />
                  <Image
                    src="/community-creators/onze.png"
                    alt="Skin de Onze"
                    width={320}
                    height={480}
                    sizes="(max-width: 640px) 220px, (max-width: 1280px) 280px, 320px"
                    className="relative h-auto w-[220px] object-contain opacity-100 drop-shadow-[0_28px_34px_rgba(0,0,0,0.65)] transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:scale-105 group-hover:drop-shadow-[0_34px_42px_rgba(16,185,129,0.24)] sm:w-[250px] lg:w-[280px] xl:w-[320px]"
                  />
                  <div className="relative mt-3 w-full max-w-xs pt-4 text-center">
                    <div className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/55 to-transparent transition-all duration-500 ease-out group-hover:via-emerald-400 group-hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]" />
                    <h3 className="font-outfit text-3xl font-black text-[#e8e4db] transition-all duration-500 ease-out group-hover:text-white group-hover:drop-shadow-[0_0_14px_rgba(16,185,129,0.45)]">Onze</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-emerald-400 transition-all duration-500 ease-out group-hover:text-emerald-300 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]">Creador de la comunidad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

      </section>

      <motion.section className="section-reveal mx-auto w-full max-w-7xl px-6 py-12" variants={sectionVariants}>
        <div className="mb-8 flex items-end justify-between border-b border-[#2d2a26] pb-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-500">Lo que necesita tu servidor</p>
            <h2 className="font-outfit text-3xl font-black text-[#e8e4db]">Todo en un solo lugar</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resourceCategories.map((category) => (
            <motion.div key={category.title} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 280, damping: 24 }}>
              <Card className="h-full border-[#2d2a26] bg-[#1c1a17] shadow-[4px_4px_0_rgba(0,0,0,0.35)] transition-colors hover:border-amber-500/40">
                <CardHeader>
                  <div className="text-4xl">{category.icon}</div>
                  <CardTitle className="text-xl text-[#e8e4db]">{category.title}</CardTitle>
                  <CardDescription className="text-[#8c8278]">{category.desc}</CardDescription>
                </CardHeader>
                <CardFooter className="border-t border-[#2d2a26] bg-black/10">
                  <Link href={category.href} className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 transition-colors hover:text-amber-300">
                    Explorar
                    <ArrowRight className="size-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="section-reveal mx-auto w-full max-w-7xl px-6 py-12" variants={sectionVariants}>
        <div className="mb-8 flex items-end justify-between border-b border-[#2d2a26] pb-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-500">Colecciones curadas</p>
            <h2 className="font-outfit text-3xl font-black text-[#e8e4db]">Descubre los recursos que más convierten</h2>
          </div>
        </div>

        <Tabs defaultValue="featured" className="flex flex-col gap-6">
          <TabsList className="w-full justify-start rounded-sm border border-[#2d2a26] bg-[#1c1a17] p-1">
            <TabsTrigger value="featured" className="rounded-sm px-4 py-2 text-sm font-bold uppercase tracking-wider">
              Destacados
            </TabsTrigger>
            <TabsTrigger value="trending" className="rounded-sm px-4 py-2 text-sm font-bold uppercase tracking-wider">
              Tendencia
            </TabsTrigger>
            <TabsTrigger value="latest" className="rounded-sm px-4 py-2 text-sm font-bold uppercase tracking-wider">
              Recién actualizados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="outline-none">
            {featuredPlugins.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {featuredPlugins.map((plugin) => (
                  <PluginMiniCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            ) : (
              <EmptyCollection />
            )}
          </TabsContent>

          <TabsContent value="trending" className="outline-none">
            {trendingPlugins.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {trendingPlugins.map((plugin) => (
                  <PluginMiniCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            ) : (
              <EmptyCollection />
            )}
          </TabsContent>

          <TabsContent value="latest" className="outline-none">
            {latestPlugins.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {latestPlugins.map((plugin) => (
                  <PluginMiniCard key={plugin.id} plugin={plugin} />
                ))}
              </div>
            ) : (
              <EmptyCollection />
            )}
          </TabsContent>
        </Tabs>
      </motion.section>

      <motion.section className="section-reveal mx-auto w-full max-w-7xl px-6 py-12" variants={sectionVariants}>
        <div className="relative overflow-hidden rounded-sm border border-[#3d3830] bg-linear-to-r from-[#1c1a17] via-[#23201c] to-[#1c1a17] p-10 text-center md:p-16">
          <div className="hero-orb absolute left-1/2 top-[-45%] h-70 w-130 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <Badge variant="outline" className="mb-5 border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <ShieldCheck className="mr-1 size-3" />
              Recursos verificados y listos para producción
            </Badge>
            <h2 className="font-outfit text-4xl font-black text-[#e8e4db] md:text-5xl">Una experiencia más rápida, visual y creíble</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#8c8278]">
              Esta actualización suma motion con Framer Motion, ambientación dinámica con GSAP y una capa de componentes shadcn/ui para que la web tenga más intención visual.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-14 rounded-sm bg-linear-to-b from-amber-400 to-yellow-600 px-8 text-base font-black text-[#141311] shadow-[0_4px_0_#92400e,inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110"
                onClick={() => router.push("/membership")}
              >
                Ver membresía
                <Flame className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-sm border-[#3d3830] bg-[#1c1a17] px-8 text-base font-black text-[#e8e4db] hover:border-amber-500/30 hover:bg-[#242118]"
                onClick={() => router.push("/plugins")}
              >
                Explorar catálogo
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="section-reveal mx-auto w-full max-w-7xl px-6 py-12" variants={sectionVariants}>
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-500">Browse by type</p>
          <h2 className="font-outfit text-3xl font-black text-[#e8e4db]">Categorías</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/plugins?category=${category}`}
              className="rounded-sm border border-[#2d2a26] bg-[#1c1a17] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#a39c90] transition-all hover:-translate-y-0.5 hover:border-amber-500/40 hover:text-amber-400"
            >
              {category}
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
