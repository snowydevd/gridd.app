import { cn } from "@/lib/utils"

/**
 * Maqueta de iPhone. Es un placeholder a propósito: las pantallas son formas
 * planas en los colores de marca, no capturas falsas. Cuando existan las
 * pantallas reales se reemplaza el contenido, no el marco.
 */
function Phone({
  children,
  className,
  float,
}: {
  children: React.ReactNode
  className?: string
  /** Escalona el flotado para que las tres no suban y bajen a la vez. */
  float?: 0 | 1 | 2
}) {
  return (
    <div
      data-float={float}
      className={cn(
        "phone relative aspect-[9/19] w-full rounded-[2.4rem] bg-[#08080a] p-[4px] ring-1 ring-white/12",
        "shadow-[0_50px_90px_-45px_rgba(0,0,0,0.95)]",
        className
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-background">
        <div
          aria-hidden
          className="absolute top-[10px] left-1/2 z-20 h-[16px] w-[58px] -translate-x-1/2 rounded-full bg-[#08080a]"
        />
        {children}
      </div>
    </div>
  )
}

/** Pantalla de arranque: el ícono de la app sobre el fondo de marca. */
function SplashScreen() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="relative aspect-square w-[38%] rounded-[22%] bg-brand">
        <div className="absolute top-[19%] bottom-[19%] left-1/2 w-[18.5%] -translate-x-1/2 bg-background" />
      </div>
    </div>
  )
}

/** Listado de eventos, en bloques. */
function ListScreen() {
  return (
    <div className="flex h-full w-full flex-col gap-3 bg-background px-3 pt-11 pb-4">
      <div className="flex items-center justify-between">
        <div className="h-2 w-12 rounded-full bg-foreground/70" />
        <div className="size-4 rounded-full bg-muted" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-1.5 rounded-xl bg-card p-2">
          <div className="aspect-[16/9] w-full rounded-md bg-muted" />
          <div className={cn("h-1.5 rounded-full bg-foreground/45", i === 1 ? "w-3/5" : "w-4/5")} />
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-6 rounded-full bg-brand" />
            <div className="h-1.5 w-10 rounded-full bg-muted-foreground/35" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Mapa con pines. Las posiciones son fijas: es una maqueta, no datos. */
function MapScreen() {
  const pins = [
    { top: "26%", left: "30%", on: true },
    { top: "42%", left: "62%", on: false },
    { top: "58%", left: "38%", on: false },
    { top: "70%", left: "68%", on: false },
  ]
  return (
    <div className="relative h-full w-full bg-card">
      <div aria-hidden className="absolute inset-0 flex justify-between px-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="w-px bg-white/[0.05]" />
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 flex flex-col justify-between py-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-px bg-white/[0.05]" />
        ))}
      </div>
      {pins.map((pin, i) => (
        <span
          key={i}
          style={{ top: pin.top, left: pin.left }}
          className={cn(
            "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
            pin.on ? "bg-brand ring-4 ring-brand/20" : "bg-muted-foreground/50"
          )}
        />
      ))}
      <div className="absolute inset-x-3 bottom-3 flex flex-col gap-1.5 rounded-xl bg-background/95 p-2">
        <div className="h-1.5 w-3/5 rounded-full bg-foreground/50" />
        <div className="h-1.5 w-2/5 rounded-full bg-muted-foreground/35" />
      </div>
    </div>
  )
}

export { Phone, SplashScreen, ListScreen, MapScreen }
