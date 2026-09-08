"use client"

import Link from "next/link"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

/**
 * Aceptación de términos del primer evento que publica una cuenta (GRI-25).
 *
 * El componente sólo muestra y reporta el check; guardar el "ya aceptó" es
 * parte del alta de evento (GRI-13), que hoy no existe.
 */
function TermsAcceptance({
  checked,
  onCheckedChange,
  name = "acceptedTerms",
  className,
}: {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  name?: string
  className?: string
}) {
  return (
    <label
      className={cn(
        "group/field-label flex cursor-pointer items-start gap-3 text-sm leading-6",
        className
      )}
    >
      <Checkbox
        name={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
        required
        className="mt-0.5"
      />
      <span className="text-muted-foreground">
        Confirmo que este evento no es una picada ni una carrera en la vía
        pública, y acepto los{" "}
        <Link
          href="/terminos"
          className="text-foreground underline underline-offset-4 hover:text-brand"
        >
          términos de uso
        </Link>
        , la{" "}
        <Link
          href="/privacidad"
          className="text-foreground underline underline-offset-4 hover:text-brand"
        >
          política de privacidad
        </Link>{" "}
        y las{" "}
        <Link
          href="/normas"
          className="text-foreground underline underline-offset-4 hover:text-brand"
        >
          normas de la comunidad
        </Link>
        .
      </span>
    </label>
  )
}

export { TermsAcceptance }
