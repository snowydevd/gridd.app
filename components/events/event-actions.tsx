"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Cancel01Icon, Edit02Icon, Flag02Icon, Navigation03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { toggleAttendance } from "@/app/e/[slug]/actions"
import { cancelEvent } from "@/app/organizadores/panel/actions"
import type { ActionResult } from "@/lib/authed"
import { directionsUrl } from "@/lib/maps"
import { ui } from "@/lib/ui"

type Props = {
  eventId: string
  slug: string
  lat: number
  lon: number
  /** Viene del server tras cada revalidación: no se copia a un estado local que se desincronice. */
  attending: boolean
  attendeeCount: number
  /** Publicado y sin terminar: el backend rechaza anotarse a uno cancelado o terminado. */
  isOpen: boolean
  cancelled: boolean
  isOrganizer: boolean
}

/**
 * La barra de acciones de la ficha (mobile/src/app/event/[id].tsx): "Cómo llegar" siempre, y al lado
 * "Voy!" / "Cancelar" para el público, o "Editar" / "Cancelar evento" para el organizador.
 */
export function EventActions({
  eventId,
  slug,
  lat,
  lon,
  attending,
  attendeeCount,
  isOpen,
  cancelled,
  isOrganizer,
}: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [pending, startTransition] = useTransition()

  const handle = (result: ActionResult<unknown>) => {
    if (result.ok) return
    if (result.reason === "auth") router.push(`/ingresar?next=${encodeURIComponent(`/e/${slug}`)}`)
    else setError(result.message)
  }

  const toggle = () => {
    if (pending) return
    setError(null)
    startTransition(async () => handle(await toggleAttendance({ eventId, slug })))
  }

  const cancel = () => {
    setError(null)
    startTransition(async () => {
      const result = await cancelEvent({ id: eventId, slug })
      setConfirming(false)
      handle(result)
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={directionsUrl(lat, lon)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${isOpen && !isOrganizer ? ui.secondary : ui.primary} flex-1`}
        >
          <HugeiconsIcon icon={Navigation03Icon} strokeWidth={1.8} aria-hidden className="size-5" />
          Cómo llegar
        </a>

        {isOrganizer && isOpen ? (
          <>
            <Link href={`/organizadores/panel/${slug}/editar`} className={`${ui.secondary} flex-1`}>
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} aria-hidden className="size-5" />
              Editar
            </Link>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={pending}
              className={`${ui.danger} flex-1`}
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.8} aria-hidden className="size-5" />
              Cancelar evento
            </button>
          </>
        ) : !isOpen ? (
          <button type="button" disabled className={`${ui.secondary} flex-1`}>
            {cancelled ? "Cancelado" : attending ? "Fuiste" : "Terminó"}
          </button>
        ) : (
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            aria-pressed={attending}
            className={`${attending ? ui.secondary : ui.primary} flex-1`}
          >
            <HugeiconsIcon
              icon={attending ? Cancel01Icon : Flag02Icon}
              strokeWidth={1.8}
              aria-hidden
              className="size-5"
            />
            {pending ? (attending ? "Cancelando…" : "Anotando…") : attending ? "Cancelar" : "Voy!"}
          </button>
        )}
      </div>

      {attending && isOpen && !isOrganizer && (
        <p className="text-sm text-muted-foreground">Estás anotado. Si al final no podés ir, tocá Cancelar.</p>
      )}

      {confirming && (
        <div role="alertdialog" aria-labelledby="cancel-title" className="flex flex-col gap-3 rounded-3xl border border-destructive/40 bg-destructive/10 p-5">
          <p id="cancel-title" className="font-medium">
            ¿Cancelar el evento?
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {attendeeCount > 0
              ? `${attendeeCount === 1 ? "Hay 1 persona anotada" : `Hay ${attendeeCount} personas anotadas`}. El evento va a figurar como cancelado y nadie más se va a poder anotar. No se puede deshacer.`
              : "El evento va a figurar como cancelado y nadie se va a poder anotar. No se puede deshacer."}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirming(false)} disabled={pending} className={`${ui.secondary} flex-1 py-3`}>
              Volver
            </button>
            <button type="button" onClick={cancel} disabled={pending} className={`${ui.danger} flex-1 py-3`}>
              {pending ? "Cancelando…" : "Cancelar evento"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className={ui.error}>
          {error}
        </p>
      )}
    </div>
  )
}
