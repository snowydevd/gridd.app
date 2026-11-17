"use client"

import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"
import { Camera01Icon, CheckmarkBadge01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { avatarUploadUrl, removeAvatar, setAvatar, updateName } from "@/app/perfil/actions"
import type { ActionResult } from "@/lib/authed"
import { IMAGE_ACCEPT, uploadImage } from "@/lib/upload"
import { ui } from "@/lib/ui"

/** Lado de la foto de perfil, como `AVATAR_SIZE` en la app (~50–150 KB). */
const AVATAR_SIZE = 512

type Props = {
  name: string | null
  email: string | null
  image: string | null
  hasAvatar: boolean
  verified: boolean
}

/** Foto (cambiar / quitar), nombre editable y email: el encabezado del perfil de la app. */
export function ProfileIdentity({ name, email, image, hasAvatar, verified }: Props) {
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name ?? "")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  /** Sin sesión, a ingresar; con error, el mensaje. */
  const handle = (result: ActionResult<unknown>) => {
    if (result.ok) return true
    if (result.reason === "auth") router.push("/ingresar?next=/perfil")
    else setError(result.message)
    return false
  }

  const pickPhoto = (file: File | undefined) => {
    if (!file) return
    setError(null)
    startTransition(async () => {
      const url = await avatarUploadUrl()
      if (!handle(url) || !url.ok) return
      let storageId: string
      try {
        storageId = await uploadImage(url.value, file, { width: AVATAR_SIZE, aspect: 1 })
      } catch (e) {
        console.error("[perfil] subir foto falló:", e)
        setError("No pudimos subir la foto. Probá con otra imagen.")
        return
      }
      handle(await setAvatar({ storageId }))
    })
  }

  const saveName = () => {
    if (pending) return
    setError(null)
    startTransition(async () => {
      if (handle(await updateName({ name: draft }))) setEditing(false)
    })
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative mb-3">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={pending}
          aria-label="Cambiar foto de perfil"
          className="relative block size-24 overflow-hidden rounded-full border-2 border-border bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {/* Sin foto, la misma de reemplazo que la app (assets/images/meets/avatar.jpg). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image ?? "/app/avatar.jpg"} alt="" className="size-full object-cover" />
          {pending && <span className="absolute inset-0 animate-pulse bg-black/55" aria-hidden />}
        </button>
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-brand text-brand-foreground"
        >
          <HugeiconsIcon icon={Camera01Icon} strokeWidth={2} className="size-4" />
        </span>
        <input
          ref={fileInput}
          type="file"
          accept={IMAGE_ACCEPT}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            pickPhoto(e.target.files?.[0])
            e.target.value = ""
          }}
        />
      </div>

      {editing ? (
        <form
          className="flex w-full max-w-sm flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            saveName()
          }}
        >
          <label htmlFor="profile-name" className="sr-only">
            Nombre
          </label>
          <input
            id="profile-name"
            autoFocus
            autoComplete="name"
            maxLength={50}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={ui.input}
          />
          <div className="flex gap-2">
            <button type="submit" disabled={pending || draft.trim().length < 2} className={`${ui.primary} flex-1 py-3`}>
              {pending ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setDraft(name ?? "")
                setError(null)
              }}
              className={`${ui.secondary} flex-1 py-3`}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-1.5">
          <h1 className="text-[22px] leading-[26px]">{name ?? "Sin nombre"}</h1>
          {verified && (
            <HugeiconsIcon
              icon={CheckmarkBadge01Icon}
              strokeWidth={2}
              aria-label="Organizador verificado"
              className="size-5 text-brand-text"
            />
          )}
        </div>
      )}
      {email && <p className="text-sm text-muted-foreground">{email}</p>}

      {!editing && (
        <div className="mt-1 flex gap-4">
          <button type="button" onClick={() => setEditing(true)} className={ui.link}>
            Editar nombre
          </button>
          {hasAvatar && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setError(null)
                startTransition(async () => void handle(await removeAvatar()))
              }}
              className={ui.link}
            >
              Quitar foto
            </button>
          )}
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
