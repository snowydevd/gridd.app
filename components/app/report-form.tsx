"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { buttonClass, chipClass, text } from "@/components/app/ui"
import { submitReport } from "@/lib/actions"
import { cn } from "@/lib/utils"

/** Motivos según qué se reporta, en el orden de la app (mobile/src/services/reports.ts). */
const REASONS = {
  event: [
    { value: "fake", label: "Es falso o peligroso" },
    { value: "spam", label: "Es spam o publicidad" },
    { value: "offensive", label: "Es ofensivo" },
    { value: "other", label: "Otro motivo" },
  ],
  user: [
    { value: "fake", label: "Se hace pasar por otro" },
    { value: "spam", label: "Publica spam" },
    { value: "offensive", label: "Es ofensivo o acosa" },
    { value: "other", label: "Otro motivo" },
  ],
} as const

const MAX_NOTE = 500

export function ReportForm({ target, title, back }: { target: { kind: "event" | "user"; id: string }; title?: string; back: string }) {
  const router = useRouter()
  const [reason, setReason] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [sending, startSending] = useTransition()
  const user = target.kind === "user"

  const send = () => {
    if (!reason) return
    setError(null)
    startSending(async () => {
      const result = await submitReport({ target: target.kind, id: target.id, reason, note })
      if (result.ok) setDone(true)
      else if (result.reason === "auth") router.push(`/ingresar?next=${encodeURIComponent(back)}`)
      else setError(result.message)
    })
  }

  if (done) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className={text.title}>Gracias por avisar</p>
        <p className={cn(text.body, "text-muted-foreground")}>
          {user
            ? "Vamos a revisar a este usuario. Si no cumple las reglas, tomamos medidas."
            : "Vamos a revisar el evento. Si no cumple las reglas, lo sacamos."}
        </p>
        <button type="button" onClick={() => router.push(back)} className={buttonClass("secondary", "mt-4 self-stretch")}>
          Volver
        </button>
      </main>
    )
  }

  return (
    <>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4">
        <p className={cn(text.body, "text-muted-foreground")}>
          {title ? `¿Qué pasa con "${title}"?` : user ? "¿Qué pasa con este usuario?" : "¿Qué pasa con este evento?"}{" "}
          {user ? "No le avisamos que lo reportaste." : "El reporte es anónimo para el organizador."}
        </p>
        <div className="flex flex-wrap gap-2">
          {REASONS[target.kind].map((r) => (
            <button key={r.value} type="button" aria-pressed={reason === r.value} onClick={() => setReason(r.value)} className={chipClass(reason === r.value)}>
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <label htmlFor="report-note" className={cn(text.overline, "text-muted-foreground")}>
            Contanos más (opcional)
          </label>
          <textarea
            id="report-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={MAX_NOTE}
            placeholder="Lo que nos ayude a revisarlo"
            className="min-h-[110px] rounded-[12px] border border-border bg-card px-4 py-3 text-[15px] outline-none placeholder:text-disabled focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
        </div>
        {error && (
          <p role="alert" className={cn(text.label, "text-destructive")}>
            {error}
          </p>
        )}
      </main>
      <div className="sticky bottom-0 mx-auto w-full max-w-xl bg-background px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <button type="button" onClick={send} disabled={!reason || sending} className={buttonClass("primary", "w-full")}>
          {sending ? "Enviando…" : "Enviar reporte"}
        </button>
      </div>
    </>
  )
}
