import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"

/**
 * Captura de la app dentro de un marco de teléfono simple: borde de la paleta
 * y esquinas redondeadas, sin dibujar un celular entero.
 */
function PhoneShot({
  src,
  alt,
  priority = false,
  className,
}: {
  src: StaticImageData
  alt: string
  priority?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[300px] overflow-hidden rounded-[2.25rem] border border-border bg-card p-2 shadow-[0_40px_120px_-40px_color-mix(in_srgb,var(--brand)_25%,transparent)]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        sizes="300px"
        placeholder="blur"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className="h-auto w-full rounded-[1.75rem]"
      />
    </div>
  )
}

export { PhoneShot }
