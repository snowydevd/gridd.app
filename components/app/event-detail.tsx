"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import {
  Bookmark02Icon,
  BookmarkCheck02Icon,
  Calendar03Icon,
  Cancel01Icon,
  Edit02Icon,
  Flag02Icon,
  MoreHorizontalIcon,
  Navigation03Icon,
  Share08Icon,
} from "@hugeicons/core-free-icons"

import { toggleAttendance } from "@/app/e/[slug]/actions"
import { cancelEvent } from "@/app/organizadores/panel/actions"
import { BackButton } from "@/components/app/back-button"
import { ActionSheet, ConfirmDialog, type SheetAction } from "@/components/app/dialog"
import { PlaceMap } from "@/components/app/place-map"
import { buttonClass, Icon, iconButtonClass, text } from "@/components/app/ui"
import { eventStoryUrl, toggleSave } from "@/lib/actions"
import type { ActionResult } from "@/lib/authed"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

export type DetailEvent = {
  _id: string
  slug: string
  title: string
  placeName: string
  lat: number
  lon: number
  startsAt: number
  endsAt: number
  attendeeCount: number
  /** "Sáb 15 · 21:00 hs", para el texto al compartir. */
  shareWhen: string
}

type Props = {
  event: DetailEvent
  signedIn: boolean
  isOrganizer: boolean
  /** Publicado y sin terminar: el backend rechaza anotarse a uno cancelado o terminado. */
  isOpen: boolean
  cancelled: boolean
  attending: boolean
  saved: boolean
}

const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

/**
 * "Cómo llegar": en iPhone abre Apple Maps (como la app en iOS); en el resto, Google Maps. Con las
 * coordenadas el destino es exacto.
 */
export function openDirections(lat: number, lon: number, place: string) {
  const url = isIOS()
    ? `https://maps.apple.com/?daddr=${lat},${lon}&q=${encodeURIComponent(place)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
  window.open(url, "_blank", "noopener")
}

function useLoginRedirect(slug: string) {
  const router = useRouter()
  return () => router.push(`/ingresar?next=${encodeURIComponent(`/e/${slug}`)}`)
}

/** Los botones redondos sobre la foto: volver, editar, calendario, compartir y más opciones. */
export function EventTopBar({ event, signedIn, isOrganizer, isOpen }: Pick<Props, "event" | "signedIn" | "isOrganizer" | "isOpen">) {
  const toLogin = useLoginRedirect(event.slug)
  const router = useRouter()
  const [sheet, setSheet] = useState<"calendar" | "share" | "more" | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [story, setStory] = useState(false)
  const url = `${site.url}/e/${event.slug}`

  const shareLink = async () => {
    const message = `${event.title} · ${event.shareWhen} en ${event.placeName}`
    try {
      if (navigator.share) return void (await navigator.share({ title: event.title, text: message, url }))
      await navigator.clipboard.writeText(`${message}\n${url}`)
      setNotice("Copiamos el link.")
    } catch {
      // Cerró el menú de compartir: no pasa nada.
    }
  }

  /** La imagen para historia de Instagram (la misma que genera la app), con el menú de compartir. */
  const shareStory = async () => {
    setStory(true)
    try {
      const result = await eventStoryUrl({ slug: event.slug })
      if (!result.ok) throw new Error(result.reason === "error" ? result.message : "auth")
      const blob = await (await fetch(result.value)).blob()
      const file = new File([blob], `gridd-historia-${event.slug}.jpg`, { type: "image/jpeg" })
      setStory(false)
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: event.title })
      } else {
        // Sin compartir archivos (escritorio): se descarga.
        const a = document.createElement("a")
        a.href = URL.createObjectURL(file)
        a.download = file.name
        a.click()
        URL.revokeObjectURL(a.href)
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setNotice("No pudimos armar la imagen. Revisá tu conexión y probá de nuevo.")
    } finally {
      setStory(false)
    }
  }

  const start = new Date(event.startsAt).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const end = new Date(event.endsAt).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const googleCalendar = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    location: event.placeName,
    details: url,
  })}`

  const sheets: Record<NonNullable<typeof sheet>, { title: string; actions: SheetAction[] }> = {
    calendar: {
      title: "Agregar al calendario",
      actions: [
        { label: "Calendario del teléfono", onSelect: () => void window.open(`/e/${event.slug}/calendario`, "_self") },
        { label: "Google Calendar", style: "ghost", onSelect: () => window.open(googleCalendar, "_blank", "noopener") },
      ],
    },
    share: {
      title: "Compartir",
      actions: [
        { label: "Compartir link", onSelect: () => void shareLink() },
        { label: "Imagen para historia", style: "ghost", onSelect: () => void shareStory() },
      ],
    },
    more: {
      title: event.title,
      actions: [
        {
          label: "Reportar evento",
          style: "destructive",
          // Un invitado primero tiene que iniciar sesión.
          onSelect: () =>
            signedIn
              ? router.push(`/reportar?evento=${event._id}&titulo=${encodeURIComponent(event.title)}&volver=${encodeURIComponent(`/e/${event.slug}`)}`)
              : toLogin(),
        },
      ],
    },
  }

  return (
    <>
      <div data-theme="dark" className="absolute inset-x-4 top-[calc(env(safe-area-inset-top)+0.5rem)] z-20 flex justify-between bg-transparent">
        <BackButton overlay fallback="/" />
        <div className="flex gap-2">
          {isOrganizer && isOpen && (
            <Link href={`/organizadores/panel/${event.slug}/editar`} aria-label="Editar evento" className={iconButtonClass({ overlay: true })}>
              <Icon icon={Edit02Icon} />
            </Link>
          )}
          {isOpen && (
            <button type="button" aria-label="Agregar al calendario" onClick={() => setSheet("calendar")} className={iconButtonClass({ overlay: true })}>
              <Icon icon={Calendar03Icon} />
            </button>
          )}
          <button type="button" aria-label="Compartir" onClick={() => setSheet("share")} className={iconButtonClass({ overlay: true })}>
            <Icon icon={Share08Icon} />
          </button>
          {!isOrganizer && (
            <button type="button" aria-label="Más opciones" onClick={() => setSheet("more")} className={iconButtonClass({ overlay: true })}>
              <Icon icon={MoreHorizontalIcon} />
            </button>
          )}
        </div>
      </div>

      <ActionSheet open={sheet !== null} title={sheet ? sheets[sheet].title : undefined} actions={sheet ? sheets[sheet].actions : []} onClose={() => setSheet(null)} />

      {/* Generar la imagen tarda unos segundos la primera vez: sin esto parece que no pasó nada. */}
      {story && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="status" aria-live="polite">
          <div className="flex min-w-56 flex-col items-center gap-2 rounded-[12px] bg-card px-6 py-6">
            <span className="size-6 animate-spin rounded-full border-2 border-brand-text border-t-transparent" aria-hidden />
            <p className={text.label}>Armando tu historia…</p>
            <p className={cn(text.caption, "text-center text-muted-foreground")}>Puede tardar unos segundos.</p>
          </div>
        </div>
      )}

      {notice && (
        <button
          type="button"
          onClick={() => setNotice(null)}
          className={cn(text.label, "fixed inset-x-4 top-[calc(env(safe-area-inset-top)+4rem)] z-50 mx-auto max-w-md rounded-[12px] bg-foreground px-4 py-3 text-background shadow-lg")}
        >
          {notice}
        </button>
      )}
    </>
  )
}

/** El mapita de la ficha: tocarlo abre "Cómo llegar". */
export function EventPlaceMap({ event, mapsKey }: { event: DetailEvent; mapsKey?: string }) {
  return (
    <PlaceMap
      lat={event.lat}
      lon={event.lon}
      label={event.placeName}
      mapsKey={mapsKey}
      onOpen={() => openDirections(event.lat, event.lon, event.placeName)}
    />
  )
}

/** La barra de abajo: guardar, "Cómo llegar" y "Voy!" (o "Cancelar evento" para el organizador). */
export function EventActionBar({ event, signedIn, isOrganizer, isOpen, cancelled, attending, saved }: Props) {
  const toLogin = useLoginRedirect(event.slug)
  const [savedNow, setSaved] = useState(saved)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState<"attend" | "cancel" | null>(null)
  const [, startTransition] = useTransition()

  const handle = (result: ActionResult<unknown>) => {
    if (result.ok) return true
    if (result.reason === "auth") toLogin()
    else setError(result.message)
    return false
  }

  const save = () => {
    if (!signedIn) return toLogin()
    setError(null)
    // Guardar es optimista, como en la app; si falla, vuelve atrás.
    setSaved(!savedNow)
    startTransition(async () => {
      const result = await toggleSave({ eventId: event._id })
      if (!handle(result)) setSaved(savedNow)
    })
  }

  const attend = () => {
    if (!signedIn) return toLogin()
    if (busy) return
    setError(null)
    setBusy("attend")
    startTransition(async () => {
      handle(await toggleAttendance({ eventId: event._id, slug: event.slug }))
      setBusy(null)
    })
  }

  const cancel = () => {
    setBusy("cancel")
    startTransition(async () => {
      const result = await cancelEvent({ id: event._id, slug: event.slug })
      setConfirming(false)
      setBusy(null)
      handle(result)
    })
  }

  const going = event.attendeeCount

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      {error && (
        <p role="alert" className={cn(text.label, "mx-auto mb-2 max-w-xl text-destructive")}>
          {error}
        </p>
      )}
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <button
          type="button"
          onClick={save}
          aria-pressed={savedNow}
          aria-label={savedNow ? "Quitar de guardados" : "Guardar"}
          className={iconButtonClass({ size: 52, active: savedNow })}
        >
          <Icon icon={savedNow ? BookmarkCheck02Icon : Bookmark02Icon} />
        </button>
        <button type="button" onClick={() => openDirections(event.lat, event.lon, event.placeName)} className={buttonClass("primary", "min-w-0 flex-1 gap-1.5 px-2")}>
          <Icon icon={Navigation03Icon} className="size-[18px]" />
          Cómo llegar
        </button>
        {isOrganizer && isOpen ? (
          <button type="button" onClick={() => setConfirming(true)} disabled={!!busy} className={buttonClass("danger", "min-w-0 flex-1 gap-1.5 px-2")}>
            <Icon icon={Cancel01Icon} className="size-[18px]" />
            {busy === "cancel" ? "Cancelando…" : "Cancelar evento"}
          </button>
        ) : !isOpen ? (
          <button type="button" disabled className={buttonClass("primary", "min-w-0 flex-1 gap-1.5 px-2")}>
            {cancelled ? "Cancelado" : attending ? "Fuiste" : "Terminó"}
          </button>
        ) : (
          <button
            type="button"
            onClick={attend}
            disabled={busy === "attend"}
            aria-pressed={attending}
            className={buttonClass(attending ? "secondary" : "primary", "min-w-0 flex-1 gap-1.5 px-2")}
          >
            <Icon icon={attending ? Cancel01Icon : Flag02Icon} className="size-[18px]" />
            {busy === "attend" ? (attending ? "Cancelando…" : "Anotando…") : attending ? "Cancelar" : "Voy!"}
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirming}
        title="Cancelar evento"
        message={
          going > 0
            ? `${going === 1 ? "Hay 1 persona anotada" : `Hay ${going} personas anotadas`}. El evento va a figurar como cancelado y nadie más se va a poder anotar. No se puede deshacer.`
            : "El evento va a figurar como cancelado y nadie se va a poder anotar. No se puede deshacer."
        }
        confirmLabel="Cancelar evento"
        destructive
        busy={busy === "cancel"}
        onConfirm={cancel}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}
