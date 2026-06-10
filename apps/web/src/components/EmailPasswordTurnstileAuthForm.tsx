'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { getSupabaseBrowserClient } from '@/lib/auth-supabase-client';

const TURNSTILE_SITE_KEY = '0x4AAAAAADiOe005wPAShmwE';

type AuthMode = 'sign-in' | 'sign-up';
type CaptchaStatus = 'idle' | 'solved' | 'expired' | 'failed';

export function EmailPasswordTurnstileAuthForm() {
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaStatus, setCaptchaStatus] = useState<CaptchaStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLabel = useMemo(
    () => (mode === 'sign-in' ? 'Iniciar sesion' : 'Crear cuenta'),
    [mode],
  );

  const resetCaptcha = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaStatus('idle');
    turnstileRef.current?.reset();
  }, []);

  const handleCaptchaSuccess = useCallback((token: string) => {
    setCaptchaToken(token);
    setCaptchaStatus('solved');
    setErrorMessage(null);
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaStatus('expired');
    setErrorMessage('El captcha expiro. Resuelvelo de nuevo para continuar.');
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaStatus('failed');
    setErrorMessage('No se pudo validar Turnstile. Intentalo de nuevo.');
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage('Supabase no esta configurado en el cliente.');
      return;
    }

    if (!captchaToken || captchaStatus !== 'solved') {
      setErrorMessage('Completa el captcha antes de continuar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result =
        mode === 'sign-up'
          ? await supabase.auth.signUp({
              email,
              password,
              options: {
                captchaToken,
              },
            })
          : await supabase.auth.signInWithPassword({
              email,
              password,
              options: {
                captchaToken,
              },
            });

      if (result.error) {
        setErrorMessage(result.error.message);
        resetCaptcha();
        return;
      }

      setSuccessMessage(
        mode === 'sign-up'
          ? 'Cuenta creada. Revisa tu correo si tienes confirmacion por email activada.'
          : 'Sesion iniciada correctamente.',
      );
      resetCaptcha();
    } catch {
      setErrorMessage('Ocurrio un error inesperado al autenticarte.');
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/20 p-1">
        <button
          type="button"
          onClick={() => setMode('sign-in')}
          className={`h-10 rounded-lg text-sm font-bold transition ${
            mode === 'sign-in' ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          Iniciar sesion
        </button>
        <button
          type="button"
          onClick={() => setMode('sign-up')}
          className={`h-10 rounded-lg text-sm font-bold transition ${
            mode === 'sign-up' ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
          }`}
        >
          Registro
        </button>
      </div>

      <div>
        <label htmlFor="auth-email" className="mb-2 block text-sm font-semibold text-white/70">
          Email
        </label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-400"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="auth-password" className="mb-2 block text-sm font-semibold text-white/70">
          Contrasena
        </label>
        <input
          id="auth-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
          minLength={6}
          required
          className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-violet-400"
          placeholder="••••••••"
        />
      </div>

      <Turnstile
        ref={turnstileRef}
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={handleCaptchaSuccess}
        onExpire={handleCaptchaExpire}
        onError={handleCaptchaError}
        onTimeout={handleCaptchaExpire}
        options={{
          theme: 'dark',
          size: 'flexible',
          refreshExpired: 'manual',
        }}
      />

      {errorMessage ? (
        <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || !captchaToken}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Procesando...' : submitLabel}
      </button>
    </form>
  );
}
