import { cn } from "@/lib/utils"

const COLUMNS = 5

/**
 * Retícula de fondo alineada al margen del contenido. Es el gesto que ya
 * tenía la landing y el origen del nombre; se repite en toda la página.
 * Usa el mismo ancho que `CONTAINER` (ver section.tsx) para que las líneas
 * caigan sobre los bordes del contenido.
 */
function GridLines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 mx-auto flex max-w-7xl justify-between px-5 sm:px-8 lg:px-12",
        className
      )}
    >
      {Array.from({ length: COLUMNS }, (_, i) => (
        <div key={i} className="w-px bg-white/[0.055]" />
      ))}
    </div>
  )
}

export { GridLines }
