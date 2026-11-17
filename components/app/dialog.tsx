"use client"

import { useEffect } from "react"

import { buttonClass, text } from "@/components/app/ui"
import { cn } from "@/lib/utils"

export type SheetAction = {
  label: string
  onSelect: () => void
  style?: "default" | "destructive" | "ghost"
}

/**
 * Hoja de opciones (el `showDialog` de la app con varios botones): fondo oscurecido, tarjeta abajo y
 * "Cancelar" al final. Se cierra tocando afuera o con Escape.
 */
export function ActionSheet({
  open,
  title,
  message,
  actions,
  onClose,
}: {
  open: boolean
  title?: string
  message?: string
  actions: SheetAction[]
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", esc)
    return () => document.removeEventListener("keydown", esc)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex w-full max-w-md flex-col gap-3 rounded-[16px] bg-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <p className={cn(text.heading, "text-center")}>{title}</p>}
        {message && <p className={cn(text.body, "text-center text-muted-foreground")}>{message}</p>}
        <div className="mt-1 flex flex-col gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => {
                onClose()
                a.onSelect()
              }}
              className={buttonClass(a.style === "destructive" ? "danger" : a.style === "ghost" ? "ghost" : "primary")}
            >
              {a.label}
            </button>
          ))}
          <button type="button" onClick={onClose} className={buttonClass("secondary")}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

/** Confirmación de una acción que no se puede deshacer. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  destructive,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  destructive?: boolean
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCancel()
    document.addEventListener("keydown", esc)
    return () => document.removeEventListener("keydown", esc)
  }, [open, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" onClick={busy ? undefined : onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="flex w-full max-w-sm flex-col gap-3 rounded-[12px] bg-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className={text.heading}>{title}</p>
        <p className={cn(text.body, "text-muted-foreground")}>{message}</p>
        <div className="mt-2 flex gap-2">
          <button type="button" disabled={busy} onClick={onCancel} className={buttonClass("secondary", "min-h-11 flex-1 px-3")}>
            Volver
          </button>
          <button type="button" disabled={busy} onClick={onConfirm} className={buttonClass(destructive ? "danger" : "primary", "min-h-11 flex-1 px-3")}>
            {busy ? "Un momento…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
