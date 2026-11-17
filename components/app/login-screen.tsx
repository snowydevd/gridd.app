"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { ArrowRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons"

import { startGoogleSignIn } from "@/app/ingresar/actions"
import { buttonClass, Icon, text } from "@/components/app/ui"
import { Wordmark } from "@/components/brand/wordmark"
import { cn } from "@/lib/utils"

/** Foto a pantalla completa, oscura en los dos temas, como el login de la app. */
export function LoginScreen({ next, googleFailed }: { next: string; googleFailed: boolean }) {
  const [error, setError] = useState<string | null>(
    googleFailed ? "No pudimos entrar con Google. Probá de nuevo o entrá con tu email." : null
  )
  const [busy, startBusy] = useTransition()

  const google = () =>
    startBusy(async () => {
      setError(null)
      const result = await startGoogleSignIn({ next })
      if (result.ok && result.url) window.location.href = result.url
      else if (!result.ok) setError(result.message)
    })

  return (
    <div data-theme="dark" className="flex min-h-dvh flex-col bg-background text-foreground">
      <div className="relative flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app/login.jpg" alt="" className="absolute inset-0 size-full object-cover" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-[30%] bottom-0"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(11,11,12,0) 0%, rgba(11,11,12,0.5) 47%, #0b0b0c 100%)" }}
        />
      </div>
      <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <Wordmark className="h-8 self-start text-foreground" />
        <h1 className={cn(text.display, "text-[30px] leading-[34px] normal-case")}>Todos los encuentros, en un solo lugar.</h1>
        {error && (
          <p role="alert" className={cn(text.label, "text-destructive")}>
            {error}
          </p>
        )}
        <div className="mt-2 flex flex-col gap-3">
          <Link href={`/ingresar/email?next=${encodeURIComponent(next)}`} className={buttonClass("primary")}>
            <Icon icon={Mail01Icon} className="size-[18px]" />
            Continuar con email
          </Link>
          <button type="button" onClick={google} disabled={busy} className={buttonClass("secondary")}>
            {busy ? "Conectando con Google…" : "Continuar con Google"}
          </button>
          <Link href={next} className={cn(text.label, "flex items-center justify-center gap-1.5 py-3 text-muted-foreground")}>
            Explorar sin cuenta
            <Icon icon={ArrowRight01Icon} className="size-4" />
          </Link>
        </div>
      </main>
    </div>
  )
}
