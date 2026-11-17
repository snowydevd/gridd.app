"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { buttonClass, chipClass, text } from "@/components/app/ui"
import { setInterests } from "@/lib/actions"
import { KIND_LABELS } from "@/lib/convex"
import { cn } from "@/lib/utils"

// "Otro" no dice nada de los gustos del usuario.
const KINDS = Object.keys(KIND_LABELS).filter((k) => k !== "otro")

/** Tus intereses (mobile/src/app/interests.tsx): las categorías que van primero en "Para vos". */
export function InterestsForm({ initial }: { initial: string[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()

  const toggle = (kind: string) =>
    setSelected((prev) => (prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]))

  const save = () =>
    startSaving(async () => {
      setError(null)
      const result = await setInterests({ interests: selected })
      if (result.ok) router.push("/perfil")
      else if (result.reason === "auth") router.push("/ingresar?next=/perfil/intereses")
      else setError(result.message)
    })

  return (
    <>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4">
        <p className={cn(text.body, "text-muted-foreground")}>Elegí qué encuentros te gustan y te los mostramos primero en Inicio.</p>
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button key={k} type="button" aria-pressed={selected.includes(k)} onClick={() => toggle(k)} className={chipClass(selected.includes(k))}>
              {KIND_LABELS[k]}
            </button>
          ))}
        </div>
        {error && (
          <p role="alert" className={cn(text.label, "text-destructive")}>
            {error}
          </p>
        )}
      </main>
      <div className="sticky bottom-0 mx-auto w-full max-w-xl bg-background px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <button type="button" onClick={save} disabled={saving} className={buttonClass("primary", "w-full")}>
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </>
  )
}
