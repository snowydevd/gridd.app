import { cn } from "@/lib/utils"

const COLUMNS = 5

/**
 * Retícula de fondo alineada al margen del contenido. Es el gesto que ya
 * tenía la landing y el origen del nombre; se repite en toda la página.
 */
function GridLines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 flex justify-between px-8 sm:px-12 lg:px-16",
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
