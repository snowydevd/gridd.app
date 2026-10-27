"use client"

import Link from "next/link"
import { useState, useTransition } from "react"

import { joinTesters, type Platform } from "@/app/testers/actions"
import { cn } from "@/lib/utils"

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "android", label: "Android" },
  { value: "ios", label: "iPhone" },
]

/** Formulario de la beta: mail, plataforma y consentimiento; después, la pantalla de "listo". */
export function TestersForm({ instagram }: { instagram: string }) {
  const [email, setEmail] = useState("")
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()

  const ready = email.trim().length > 0 && platform !== null && accepted

  const submit = () => {
    if (!ready || pending) return
    setError(null)
    startTransition(async () => {
      const result = await joinTesters({ email, platform: platform! })
      if (result.ok) setDone(true)
      else setError(result.message)
    })
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4 py-6">
        <span className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">Anotado</span>
        <h2 className="text-[2rem] leading-[1.05] tracking-[-0.02em] uppercase">¡Listo!</h2>
        <p className="text-base leading-7 text-muted-foreground">
          {platform === "android"
            ? "Te vamos a escribir a ese mail cuando abramos la prueba en Google Play, con el link para instalarla."
            : "En iPhone la app llega más adelante. Te avisamos a ese mail cuando esté para probar."}
        </p>
        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-2xl bg-brand px-5 py-4 text-center font-semibold text-brand-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40"
        >
          Seguir a @{instagram}
        </a>
      </div>
    )
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="tester-email" className="text-sm font-medium">
          Tu mail
        </label>
        <input
          id="tester-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vos@gmail.com"
          className="h-14 rounded-2xl border border-border bg-card px-4 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
        />
        {platform === "android" && (
          <p className="text-xs leading-5 text-muted-foreground">
            Tiene que ser el de la cuenta de Google de tu teléfono: es la que Google Play usa para darte acceso a
            la prueba.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Tu teléfono</span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tu teléfono">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              type="button"
              aria-pressed={platform === p.value}
              onClick={() => setPlatform(p.value)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                platform === p.value
                  ? "bg-brand text-brand-foreground"
                  : "border border-border bg-input/30 text-muted-foreground hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 size-4 shrink-0 accent-[var(--brand)]"
        />
        <span>
          Acepto que me escriban a este mail por la beta de Gridd. Más info en la{" "}
          <Link href="/privacidad" className="text-foreground underline underline-offset-4">
            política de privacidad
          </Link>
          .
        </span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!ready || pending}
        className="rounded-2xl bg-brand px-5 py-4 font-semibold text-brand-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40 disabled:opacity-40"
      >
        {pending ? "Anotando…" : "Anotarme a la beta"}
      </button>
    </form>
  )
}
