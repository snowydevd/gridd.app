"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { submitPublisherRequest } from "@/app/perfil/actions"
import { ui } from "@/lib/ui"

/** Lo mismo que `REQUEST_MIN` / `REQUEST_MAX` de la app; el límite real lo pone Convex. */
const REQUEST_MIN = 10
const REQUEST_MAX = 500

export function OrganizerRequestForm() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const length = message.trim().length

  const submit = () => {
    if (pending || length < REQUEST_MIN) return
    setError(null)
    startTransition(async () => {
      const result = await submitPublisherRequest({ message })
      if (result.ok) return // la página se revalida y muestra "en revisión"
      if (result.reason === "auth") router.push("/ingresar?next=/perfil/organizar")
      else setError(result.message)
    })
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <label htmlFor="request-message" className={ui.label}>
        Sobre vos o tu grupo
      </label>
      <textarea
        id="request-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={REQUEST_MAX}
        placeholder="Ej: Organizo la junada de los jueves en Pocitos, @juntadapocitos"
        className={ui.textarea}
      />
      <p className={`${ui.hint} text-right`}>
        {length < REQUEST_MIN ? `Mínimo ${REQUEST_MIN} caracteres` : `${length}/${REQUEST_MAX}`}
      </p>
      {error && (
        <p role="alert" className={ui.error}>
          {error}
        </p>
      )}
      <button type="submit" disabled={pending || length < REQUEST_MIN} className={ui.primary}>
        {pending ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  )
}
