"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, CheckCircle2, Flame, ShieldCheck, Sparkles, Star } from "lucide-react";

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

const stats = [
  { label: "Recursos curados", value: "0" },
  { label: "Creadores verificados", value: "0" },
  { label: "Descargas mensuales", value: "0" },
  { label: "Satisfacción", value: "0%" },
];

const resourceCategories = [
  { icon: "🧩", title: "Plugins", desc: "Plugins únicos optimizados y configurados para rendimiento máximo.", href: "/plugins" },
  { icon: "🖥️", title: "Setups", desc: "Setups completos listos para desplegar tu servidor en minutos.", href: "/setups" },
  { icon: "⚙️", title: "Configs", desc: "Configuraciones profesionales y modelos 3D custom de alta calidad.", href: "/configs" },
  { icon: "🏗️", title: "Builds", desc: "Construcciones premium para lobbies, spawnpoints y más.", href: "/builds" },
  { icon: "🌐", title: "Webs", desc: "Webs y tiendas premium listas para tu servidor.", href: "/webs" },
  { icon: "💻", title: "Paneles", desc: "Temas y paneles personalizados para gestión de servidores.", href: "/webs" },
];

const communityCreators = [
  {
    name: "Harlex",
    role: "Creador de la comunidad",
    image: "/community-creators/harlex.png",
    accent: "bg-amber-400",
  },
  {
    name: "Onze",
    role: "Creador de la comunidad",
    image: "/community-creators/onze.png",
    accent: "bg-emerald-400",
  },
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

      gsap.from(".stat-card", {
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.2,
      });

      gsap.from(".section-reveal", {
        opacity: 0,
        y: 20,
        duration: 0.75,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.15,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <motion.div ref={rootRef} initial="hidden" animate="show" variants={pageVariants} className="relative w-full max-w-full overflow-hidden">
      <section className="relative flex w-full min-w-0 flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-24 text-center sm:px-6 sm:pt-28">
        <div className="hero-orb absolute left-1/2 top-[-8%] h-95 w-170 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="hero-orb absolute left-[12%] top-[24%] h-65 w-65 rounded-full bg-yellow-700/10 blur-[110px]" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
            transition={reduceMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 flex items-center justify-center p-0"
          >
            <div className="relative h-22 w-22 overflow-hidden md:h-28 md:w-28">
              <Image src="/logo.png" alt="MC Market" fill sizes="112px" className="object-contain" priority />
            </div>
          </motion.div>

          <Badge variant="outline" className="mb-8 flex h-auto min-h-5 max-w-full items-center justify-center gap-1 whitespace-normal border-amber-500/20 bg-amber-500/10 px-3 py-2 text-center text-[10px] font-semibold uppercase leading-relaxed tracking-[0.08em] text-amber-300 sm:text-[11px] sm:tracking-[0.3em]">
            <Sparkles className="size-3 shrink-0" />
            <span className="min-w-0 break-words">Recursos premium verificados para servidores serios</span>
          </Badge>

          <h1 className="w-full max-w-5xl px-1 font-outfit text-4xl font-black leading-[1.05] tracking-tight text-[#e8e4db] sm:px-0 sm:text-5xl md:text-7xl">
            Compra recursos que hacen que tu servidor{" "}
            <br className="hidden md:block" />
            <span className="bg-linear-to-b from-amber-300 via-yellow-400 to-amber-600 bg-clip-text text-transparent block sm:inline mt-2 sm:mt-0">
              cargue mejor y venda más
            </span>
          </h1>

          <p className="mt-6 w-full max-w-3xl px-1 text-base leading-relaxed text-[#8c8278] sm:px-0 sm:text-lg md:text-xl">
            Plugins, setups, configs, builds y webs curadas para acelerar el setup, mejorar la experiencia del jugador y dar una apariencia premium desde el primer clic.
          </p>

          <div className="mt-10 flex w-full max-w-sm flex-col gap-4 px-1 sm:w-auto sm:max-w-none sm:flex-row sm:px-0">
            <Button
              size="lg"
              className="h-14 w-full sm:w-auto rounded-sm bg-linear-to-b from-amber-400 to-yellow-600 px-8 text-base font-black text-[#141311] shadow-[0_4px_0_#92400e,inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110"
              onClick={() => router.push("/plugins")}
            >
              Ver plugins premium
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full sm:w-auto rounded-sm border-[#3d3830] bg-[#1c1a17] px-8 text-base font-black text-[#e8e4db] hover:border-amber-500/30 hover:bg-[#242118]"
              onClick={() => router.push("/membership")}
            >
              Ver membresía VIP+
            </Button>
          </div>

          <div className="mt-6 flex w-full min-w-0 flex-wrap items-center justify-center gap-3 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a39c90] sm:text-xs sm:tracking-widest">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#2d2a26] bg-[#1c1a17] px-3 py-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span className="min-w-0 break-words">Entrega instantánea</span>
            </span>
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#2d2a26] bg-[#1c1a17] px-3 py-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span className="min-w-0 break-words">Updates vitalicios</span>
            </span>
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#2d2a26] bg-[#1c1a17] px-3 py-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span className="min-w-0 break-words">Soporte prioritario</span>
            </span>
          </div>

          <div className="mt-16 grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-px">
            {stats.map((stat) => (
              <Card key={stat.label} className="stat-card border-[#2d2a26] bg-[#1c1a17]/90 text-left shadow-[3px_3px_0_rgba(0,0,0,0.28)]">
                <CardContent className="p-5">
                  <div className="font-outfit text-3xl font-black text-amber-400">{stat.value}</div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-widest text-[#6b6459]">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="grid items-center gap-6 border-y border-[#2d2a26] py-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-5 border-amber-500/20 bg-amber-500/10 text-amber-300">
              <Sparkles className="mr-1 size-3" />
              Comunidad MC Market
            </Badge>
            <h2 className="font-outfit text-3xl font-black leading-tight text-[#e8e4db] md:text-5xl">
              Creadores que le dan cara a la comunidad
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#8c8278]">
              Las skins aparecen como protagonistas del inicio, limpias y sin fondo, listas para acompañar la información de cada creador cuando la tengamos.
            </p>
          </div>

          <div className="grid items-end gap-5 sm:grid-cols-2 lg:gap-6">
            {communityCreators.map((creator) => (
              <motion.div
                key={creator.name}
                animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                whileHover={{ y: -12, scale: 1.03 }}
                transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="group relative flex flex-col items-center overflow-visible"
              >
                <div className={`absolute bottom-16 h-40 w-40 rounded-full ${creator.accent} opacity-10 blur-3xl transition-opacity group-hover:opacity-20`} />
                <div className="absolute bottom-16 h-2 w-40 rounded-full bg-black/55 blur-md" />
                <div className="relative aspect-[2/3] w-[220px] transition-transform duration-300 group-hover:-translate-y-3 sm:w-[250px] lg:w-[280px] xl:w-[300px]">
                  <Image
                    src={creator.image}
                    alt={`Skin de ${creator.name}`}
                    fill
                    sizes="(max-width: 640px) 220px, (max-width: 1280px) 280px, 300px"
                    className="object-contain drop-shadow-[0_28px_34px_rgba(0,0,0,0.65)]"
                  />
                </div>
                <div className="relative mt-3 w-full max-w-xs border-t border-[#2d2a26] pt-3 text-center">
                  <h3 className="font-outfit text-3xl font-black text-[#e8e4db]">{creator.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-amber-400">{creator.role}</p>
                </div>
              </motion.div>
            ))}
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
