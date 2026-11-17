"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { iconButtonClass } from "@/components/app/ui"

/**
 * "Volver" de las pantallas apiladas. Si se llegó navegando dentro de Gridd vuelve atrás, como en la
 * app; si la página se abrió de un link (WhatsApp, Instagram) no hay a dónde volver y va a `fallback`.
 */
export function BackButton({
  fallback = "/",
  icon = "back",
  overlay,
}: {
  fallback?: string
  icon?: "back" | "close"
  overlay?: boolean
}) {
  const router = useRouter()
  const back = () => {
    const internal = document.referrer && new URL(document.referrer).origin === window.location.origin
    if (internal && window.history.length > 1) router.back()
    else router.push(fallback)
  }
  return (
    <button type="button" onClick={back} aria-label={icon === "close" ? "Cerrar" : "Volver"} className={iconButtonClass({ overlay })}>
      <HugeiconsIcon icon={icon === "close" ? Cancel01Icon : ArrowLeft01Icon} strokeWidth={2} aria-hidden className="size-5" />
    </button>
  )
}
