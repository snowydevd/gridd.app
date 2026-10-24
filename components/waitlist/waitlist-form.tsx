"use client"

import { useState, useTransition } from "react"

import { joinWaitlist, type Crowd } from "@/app/organizadores/actions"
import { cn } from "@/lib/utils"

const CROWDS: { value: Crowd; label: string }[] = [
  { value: "lt30", label: "Menos de 30" },
  { value: "30_100", label: "30–100" },
  { value: "100_300", label: "100–300" },
  { value: "gt300", label: "Más de 300" },
]

const STEPS = 3

/** Waitlist en tres pasos (Instagram, tipos de evento, gente) y la pantalla de "listo". */
export function WaitlistForm({ kinds, instagram }: { kinds: { value: string; label: string }[]; instagram: string }) {
  const [step, setStep] = useState(0)
  const [handle, setHandle] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [crowd, setCrowd] = useState<Crowd | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()

  const ready = [handle.trim().replace(/^@/, "").length > 0, selected.length > 0, crowd !== null][step]

  const toggleKind = (value: string) =>
    setSelected((list) => (list.includes(value) ? list.filter((k) => k !== value) : [...list, value]))

  const next = () => {
    if (!ready || pending) return
    setError(null)
    if (step < STEPS - 1) return setStep(step + 1)
    startTransition(async () => {
      const result = await joinWaitlist({ instagram: handle, kinds: selected, crowd: crowd! })
      if (result.ok) setDone(true)
      // El error más común es el usuario de Instagram: se vuelve a ese paso para corregirlo.
      else {
        setError(result.message)
        if (result.message.includes("Instagram")) setStep(0)
      }
    })
  }

  if (done) {
    return (
      <div className="flex flex-1 flex-col justify-center gap-4 py-10">
        <span className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">Anotado</span>
        <h1 className="text-[2rem] leading-[1.05] tracking-[-0.02em] uppercase">¡Listo!</h1>
        <p className="text-base leading-7 text-muted-foreground">
          Te vamos a escribir por Instagram apenas la app esté publicada, para que seas de los primeros en publicar
          tus encuentros.
        </p>
        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 rounded-2xl bg-brand px-5 py-4 text-center font-semibold text-brand-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40"
        >
          Seguir a @{instagram}
        </a>
      </div>
    )
  }

  return (
    <form
      className="flex flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault()
        next()
      }}
    >
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: STEPS }, (_, i) => (
          <div key={i} className={cn("h-[3px] flex-1 rounded-full", i <= step ? "bg-brand" : "bg-border")} />
        ))}
      </div>
      <span className="mt-8 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        Paso {step + 1} de {STEPS}
      </span>

      {step === 0 && (
        <Step title="¿Cuál es tu Instagram?" hint="Por ahí te vamos a escribir.">
          <label className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 focus-within:border-foreground/40">
            <span className="text-muted-foreground">@</span>
            <input
              autoFocus
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="tucuenta"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Usuario de Instagram"
              className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
            />
          </label>
        </Step>
      )}

      {step === 1 && (
        <Step title="¿Qué eventos hacés?" hint="Elegí todos los que apliquen.">
          <div className="flex flex-wrap gap-2">
            {kinds.map((k) => (
              <Chip key={k.value} selected={selected.includes(k.value)} onClick={() => toggleKind(k.value)}>
                {k.label}
              </Chip>
            ))}
          </div>
        </Step>
      )}

      {step === 2 && (
        <Step title="¿Cuánta gente suele ir?" hint="Más o menos, en un encuentro normal.">
          <div className="flex flex-wrap gap-2">
            {CROWDS.map((c) => (
              <Chip key={c.value} selected={crowd === c.value} onClick={() => setCrowd(c.value)}>
                {c.label}
              </Chip>
            ))}
          </div>
        </Step>
      )}

      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-10">
        <button
          type="submit"
          disabled={!ready || pending}
          className="rounded-2xl bg-brand px-5 py-4 font-semibold text-brand-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40 disabled:opacity-40"
        >
          {step < STEPS - 1 ? "Siguiente" : pending ? "Anotando…" : "Anotarme"}
        </button>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={pending}
            className="py-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
          >
            Volver
          </button>
        )}
      </div>
    </form>
  )
}

function Step({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <h1 className="text-[1.75rem] leading-[1.05] tracking-[-0.02em] uppercase">{title}</h1>
      <p className="text-sm text-muted-foreground">{hint}</p>
      <div className="mt-5">{children}</div>
    </div>
  )
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        selected ? "border-foreground bg-foreground font-medium text-background" : "border-border bg-card"
      )}
    >
      {children}
    </button>
  )
}
