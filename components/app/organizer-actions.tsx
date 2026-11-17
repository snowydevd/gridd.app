"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Add01Icon, MoreHorizontalIcon, Tick02Icon } from "@hugeicons/core-free-icons"

import { ActionSheet, type SheetAction } from "@/components/app/dialog"
import { buttonClass, Icon, iconButtonClass, text } from "@/components/app/ui"
import { toggleFollow } from "@/lib/actions"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

/** "Seguir" / "Siguiendo", al instante (como el optimistic update de la app). */
export function OrganizerActions({ id, following, signedIn }: { id: string; following: boolean; signedIn: boolean }) {
  const router = useRouter()
  const [value, setValue] = useState(following)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const follow = () => {
    if (!signedIn) return router.push(`/ingresar?next=${encodeURIComponent(`/organizador/${id}`)}`)
    setError(null)
    setValue(!value)
    startTransition(async () => {
      const result = await toggleFollow({ organizerId: id })
      if (result.ok) return
      setValue(value)
      if (result.reason === "auth") router.push(`/ingresar?next=${encodeURIComponent(`/organizador/${id}`)}`)
      else setError(result.message)
    })
  }

  return (
    <>
      <button type="button" onClick={follow} aria-pressed={value} className={buttonClass(value ? "secondary" : "primary")}>
        <Icon icon={value ? Tick02Icon : Add01Icon} className="size-[18px]" strokeWidth={2} />
        {value ? "Siguiendo" : "Seguir"}
      </button>
      {error && (
        <p role="alert" className={cn(text.label, "text-destructive")}>
          {error}
        </p>
      )}
    </>
  )
}

/** "Más opciones": compartir el perfil y reportar al usuario. */
export function OrganizerMore({ id, name, upcoming, isMe, signedIn }: { id: string; name: string; upcoming: number; isMe: boolean; signedIn: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const path = `/organizador/${id}`

  const share = async () => {
    const message =
      upcoming > 0
        ? `Mirá los encuentros de ${name} en Gridd: tiene ${upcoming === 1 ? "1 próximo" : `${upcoming} próximos`}.`
        : `Seguí a ${name} en Gridd para enterarte de sus próximos encuentros.`
    const url = `${site.url}${path}`
    try {
      if (navigator.share) await navigator.share({ title: name, text: message, url })
      else await navigator.clipboard.writeText(`${message}\n${url}`)
    } catch {
      // Cerró el menú de compartir.
    }
  }

  const actions: SheetAction[] = [
    { label: "Compartir perfil", onSelect: () => void share() },
    ...(isMe
      ? []
      : [
          {
            label: "Reportar usuario",
            style: "destructive" as const,
            onSelect: () =>
              signedIn
                ? router.push(`/reportar?usuario=${id}&titulo=${encodeURIComponent(name)}&volver=${encodeURIComponent(path)}`)
                : router.push(`/ingresar?next=${encodeURIComponent(path)}`),
          },
        ]),
  ]

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Más opciones" className={iconButtonClass()}>
        <Icon icon={MoreHorizontalIcon} />
      </button>
      <ActionSheet open={open} title={name} actions={actions} onClose={() => setOpen(false)} />
    </>
  )
}
