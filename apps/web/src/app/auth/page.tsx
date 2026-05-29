'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0b18] text-white">
        Cargando...
      </div>
    );
  }

  if (session) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.28),_transparent_36%),linear-gradient(135deg,#120b2f_0%,#0f1227_55%,#12111a_100%)] px-6 py-10 text-white">
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center">
          <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#151422]/90 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                <Image src="/logo.png" alt="MC Market" fill sizes="64px" className="object-contain" priority />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-300/80">Sesión activa</p>
                <h1 className="font-outfit text-3xl font-black text-white">Bienvenido de vuelta</h1>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Usuario</p>
                <p className="mt-2 text-lg font-bold text-white">{session.user?.name ?? 'Sin nombre'}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Discord ID</p>
                <p className="mt-2 break-all text-lg font-bold text-white">{session.user?.discordId}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-[#5865F2] px-5 font-bold text-white transition hover:brightness-110"
              >
                Cerrar sesión
              </button>
              <Link
                href="/dashboard"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 font-bold text-white transition hover:bg-white/10"
              >
                Ir al dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.45),_transparent_30%),radial-gradient(circle_at_right,_rgba(96,165,250,0.3),_transparent_35%),linear-gradient(135deg,#1d0b46_0%,#10102a_50%,#0b0b14_100%)] px-6 py-8 text-white">
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute left-[8%] top-[20%] h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute right-[10%] top-[18%] h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center gap-10 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-white/70 backdrop-blur">
            <ShieldCheck className="size-4 text-cyan-300" />
            Acceso seguro
          </div>
          <h1 className="max-w-xl font-outfit text-6xl font-black leading-[0.95] tracking-tight text-white xl:text-7xl">
            Entra a tu cuenta y sigue con tus recursos.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
            Inicia sesión con Discord para entrar al dashboard, ver tus descargas y administrar tu biblioteca premium.
          </p>
        </div>

        <div className="w-full max-w-[520px] rounded-[30px] border border-white/10 bg-[#1a1a21]/90 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white">
              <ArrowLeft className="size-4" />
              Volver
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.3em] text-violet-200">
              <Sparkles className="size-3" />
              MC Market
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="relative h-20 w-20 overflow-hidden sm:h-24 sm:w-24">
              <Image src="/logo.png" alt="MC Market" fill sizes="96px" className="object-contain" priority />
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-outfit text-4xl font-black text-white">Iniciar sesión</h2>
            <p className="mt-3 text-sm text-white/55">
              ¿No tienes cuenta? <Link href="/membership" className="font-semibold text-violet-300 hover:text-violet-200">Regístrate</Link>
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#5865F2] px-5 text-base font-bold text-white shadow-[0_10px_30px_rgba(88,101,242,0.35)] transition hover:brightness-110"
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1 .009-.119c.125-.093.25-.19.371-.287a.075.075 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 0 1 .079.009c.12.098.246.195.371.288a.072.072 0 0 1 .009.118a12.973 12.973 0 0 1-1.872.892a.07.07 0 0 0-.038.099a14.048 14.048 0 0 0 1.293 2.1a.078.078 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.057c.5-4.761-.838-8.895-3.549-12.55a.061.061 0 0 0-.031-.028z" />
              </svg>
              Continuar con Discord
            </button>

            <button
              type="button"
              disabled
              className="flex h-14 w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/95 px-5 text-base font-bold text-[#4b4b56] opacity-75"
            >
              <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.1-1.3 3.2-5.5 3.2a6.6 6.6 0 1 1 0-13.2c1.9 0 3.2.8 4 1.5l2.7-2.6C16.9 1.4 14.7.5 12 .5 5.9.5.9 5.5.9 11.6S5.9 22.7 12 22.7c6.3 0 10.5-4.4 10.5-10.6 0-.7-.1-1.2-.2-1.7H12Z" />
              </svg>
              Continuar con Google
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-white/25">
            <span className="h-px flex-1 bg-white/10" />
            O continúa con email
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">Email</label>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white/35">tu@email.com</div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white/70">
                <label>Contraseña</label>
                <span className="text-violet-300">¿Olvidaste tu contraseña?</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white/35">••••••••</div>
            </div>
          </div>

          <button className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-violet-600 px-5 text-base font-black text-white transition hover:brightness-110">
            Iniciar sesión
          </button>

          <p className="mt-4 text-center text-xs text-white/35">
            El acceso real ya está conectado a Discord.
          </p>
        </div>
      </div>
    </div>
  );
}
