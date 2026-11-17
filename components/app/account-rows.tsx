"use client"

import { useRouter } from "next/navigation"
import { useState, useSyncExternalStore, useTransition } from "react"
import { ArrowRight01Icon, ContrastIcon, Delete02Icon, Mail01Icon, Tick02Icon } from "@hugeicons/core-free-icons"

import { ConfirmDialog } from "@/components/app/dialog"
import { Icon, rowClass, text } from "@/components/app/ui"
import { deleteAccount } from "@/lib/actions"
import { site } from "@/lib/site"
import { applyPreference, readPreference, THEME_LABELS, THEME_PREFERENCES, type ThemePreference } from "@/lib/theme"
import { cn } from "@/lib/utils"

const THEME_EVENT = "gridd:theme"
const subscribeTheme = (listener: () => void) => {
  window.addEventListener(THEME_EVENT, listener)
  return () => window.removeEventListener(THEME_EVENT, listener)
}

/** "Apariencia": Sistema, Claro u Oscuro. Es del dispositivo, como en la app. */
export function AppearanceRow() {
  const [open, setOpen] = useState(false)
  // Se lee de localStorage; en el server (y al hidratar) es "Sistema".
  const value = useSyncExternalStore(subscribeTheme, readPreference, () => "system" as ThemePreference)
  return (
    <>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className={cn(rowClass, "min-h-14", open && "border-b border-border")}>
        <Icon icon={ContrastIcon} className="text-muted-foreground" />
        <span className={cn(text.heading, "flex-1 text-base")}>Apariencia</span>
        <span className={cn(text.label, "text-muted-foreground")}>{THEME_LABELS[value]}</span>
        <Icon icon={ArrowRight01Icon} className={cn("size-[18px] text-muted-foreground transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <ul>
          {THEME_PREFERENCES.map((option, i) => {
            const selected = option === value
            return (
              <li key={option}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    applyPreference(option)
                    window.dispatchEvent(new Event(THEME_EVENT))
                    setOpen(false)
                  }}
                  className={cn("flex min-h-12 w-full items-center gap-2 pl-9 text-left outline-none active:opacity-70", i < 2 && "border-b border-border")}
                >
                  <span className={cn(text.label, "flex-1", selected ? "text-brand-text" : "text-foreground")}>{THEME_LABELS[option]}</span>
                  {option === "system" && <span className={cn(text.caption, "text-muted-foreground")}>Como tu teléfono</span>}
                  {selected && <Icon icon={Tick02Icon} className="size-[18px] text-brand-text" strokeWidth={2} />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

/** Mail a soporte con los datos del navegador, para que no tengan que preguntarlos. */
export function ReportProblemRow() {
  const send = () => {
    const body = ["", "", "---", "Gridd web", navigator.userAgent].join("\n")
    window.location.href = `mailto:${site.emails.hola}?subject=${encodeURIComponent("Problema en la app")}&body=${encodeURIComponent(body)}`
  }
  return (
    <button type="button" onClick={send} className={cn(rowClass, "min-h-14")}>
      <Icon icon={Mail01Icon} className="text-muted-foreground" />
      <span className={cn(text.heading, "flex-1 text-base")}>Reportar un problema</span>
      <Icon icon={ArrowRight01Icon} className="size-[18px] text-muted-foreground" />
    </button>
  )
}

/** "Eliminar cuenta", con confirmación. Si tiene eventos próximos publicados, Convex no deja y lo dice. */
export function DeleteAccountRow() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const remove = () =>
    startTransition(async () => {
      const result = await deleteAccount()
      setConfirming(false)
      if (result.ok) router.replace("/?cuenta=eliminada")
      else if (result.reason === "auth") router.push("/ingresar?next=/perfil/cuenta")
      else setError(result.message)
    })

  return (
    <>
      <button type="button" disabled={pending} onClick={() => setConfirming(true)} className={cn(rowClass, "min-h-14 text-destructive")}>
        <Icon icon={Delete02Icon} />
        <span className={cn(text.heading, "flex-1 text-base")}>{pending ? "Eliminando…" : "Eliminar cuenta"}</span>
      </button>
      {error && (
        <p role="alert" className={cn(text.label, "text-destructive")}>
          {error}
        </p>
      )}
      <ConfirmDialog
        open={confirming}
        title="Eliminar cuenta"
        message="Se borran tu perfil, tus autos, tus anotaciones, tus guardados y los eventos que organizaste. No se puede deshacer."
        confirmLabel="Eliminar"
        destructive
        busy={pending}
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
    </>
  )
}
