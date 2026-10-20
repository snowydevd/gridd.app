import { Navigation03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/lib/utils"

/*
 * Maquetas chiquitas de la app para las tarjetas de la landing. Son
 * ilustrativas: reusan la paleta y los gestos de la app (chips, pins flúor)
 * sin pretender ser capturas. Todas son decorativas para lectores de
 * pantalla; lo que cuentan ya está en el texto de cada tarjeta.
 */

const nearby = [
  { day: "Sáb", date: "24", title: "Expo Fierros del Sur", place: "Parque Roosevelt, Canelones", km: "25 km" },
  { day: "Sáb", date: "31", title: "Euro Meet & Dyno", place: "Zona Franca MVD, Montevideo", km: "21 km" },
  { day: "Dom", date: "1", title: "Clásicos en la rambla", place: "Rambla de Pocitos, Montevideo", km: "6 km" },
] as const

/** Radio alrededor tuyo con los encuentros que caen adentro, y la lista. */
function NearbyMock() {
  return (
    <div aria-hidden className="grid items-center gap-6 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="relative mx-auto aspect-square w-full max-w-[270px]">
        {[100, 68, 36].map((size) => (
          <div
            key={size}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
            style={{ width: `${size}%`, height: `${size}%` }}
          />
        ))}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_10%,transparent),transparent_70%)]" />
        <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-4 ring-foreground/15" />
        {[
          { top: "40%", left: "62%", label: "6 km" },
          { top: "78%", left: "24%", label: "21 km" },
          { top: "10%", left: "30%", label: "25 km" },
        ].map((pin) => (
          <span
            key={pin.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5"
            style={{ top: pin.top, left: pin.left }}
          >
            <span className="size-2.5 rounded-full bg-brand ring-4 ring-brand/20" />
            <span className="text-[0.62rem] font-semibold text-muted-foreground">{pin.label}</span>
          </span>
        ))}
        <span className="absolute -top-1 right-0 inline-flex items-center gap-1.5 rounded-4xl border border-border bg-background px-3 py-1.5 text-xs font-medium">
          <HugeiconsIcon icon={Navigation03Icon} strokeWidth={1.8} className="size-3.5" />
          25 km
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {nearby.map((event, i) => (
          <li
            key={event.title}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-2.5",
              i === 0 ? "border-brand/30 bg-brand/[0.06]" : "border-border bg-background/60"
            )}
          >
            <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl bg-muted leading-none">
              <span className="text-[0.55rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {event.day}
              </span>
              <span className="mt-1 text-base font-bold">{event.date}</span>
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{event.title}</span>
              <span className="truncate text-xs text-muted-foreground">
                {event.place} · {event.km}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** El mapa de la app: calles finitas sobre negro y pins flúor. */
function MapMock() {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-2xl border border-border bg-background"
    >
      <svg viewBox="0 0 320 150" className="block h-auto w-full" fill="none">
        <g stroke="var(--border)" strokeWidth="1.2">
          <path d="M0 38 L320 22" />
          <path d="M0 96 L320 118" />
          <path d="M0 132 L320 136" />
          <path d="M58 0 L44 150" />
          <path d="M150 0 L162 150" />
          <path d="M248 0 L232 150" />
          <path d="M0 70 C80 60 120 84 320 66" />
        </g>
        <g stroke="color-mix(in srgb, var(--border) 60%, transparent)" strokeWidth="0.8">
          <path d="M100 0 L96 150" />
          <path d="M200 0 L206 150" />
          <path d="M0 112 L320 92" />
        </g>
        {[
          [96, 52, 1],
          [206, 86, 0.6],
          [268, 40, 0.6],
          [52, 118, 0.6],
          [170, 128, 0.6],
        ].map(([cx, cy, o]) => (
          <g key={`${cx}-${cy}`} opacity={o}>
            <circle cx={cx} cy={cy} r="11" fill="var(--brand)" opacity="0.2" />
            <circle cx={cx} cy={cy} r="5" fill="var(--brand)" />
            <circle cx={cx} cy={cy} r="2" fill="var(--brand-foreground)" />
          </g>
        ))}
      </svg>
      <span className="absolute top-[18%] left-[34%] rounded-xl border border-border bg-card/95 px-3 py-2 text-xs leading-tight shadow-lg">
        <span className="block font-medium">Euro Meet &amp; Dyno</span>
        <span className="text-muted-foreground">Sáb 31 · 21 km</span>
      </span>
    </div>
  )
}

const tastes = [
  { name: "JDM", on: true },
  { name: "Clásicos", on: true },
  { name: "Tuning", on: false },
  { name: "VAG", on: false },
  { name: "Cars & Coffee", on: true },
  { name: "4x4", on: false },
  { name: "Motos", on: false },
] as const

/** Los gustos marcados en flúor, como los chips de la app. */
function TasteMock() {
  return (
    <ul aria-hidden className="flex flex-wrap gap-2">
      {tastes.map((taste) => (
        <li
          key={taste.name}
          className={cn(
            "rounded-4xl px-3.5 py-1.5 text-xs font-medium",
            taste.on
              ? "bg-brand text-brand-foreground"
              : "border border-border bg-background/60 text-muted-foreground"
          )}
        >
          {taste.name}
        </li>
      ))}
    </ul>
  )
}

/** Alta de un evento, resumida a lo que se carga. */
function PublishMock() {
  const fields = [
    { label: "Título", value: "Clásicos en la rambla" },
    { label: "Cuándo", value: "Domingo 1 de noviembre · 09:00 – 13:00" },
    { label: "Dónde", value: "Rambla de Pocitos, Montevideo" },
  ] as const

  return (
    <div
      aria-hidden
      className="mx-auto flex w-full max-w-[440px] flex-col gap-4 rounded-[1.75rem] border border-border bg-background p-5 shadow-[0_40px_120px_-40px_color-mix(in_srgb,var(--brand)_25%,transparent)] sm:p-6"
    >
      <div className="flex items-center justify-between">
        <span className="font-heading text-lg font-extrabold uppercase">Nuevo evento</span>
        <span className="rounded-4xl border border-border px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Borrador
        </span>
      </div>

      <div className="grid h-24 place-items-center rounded-2xl border border-dashed border-border bg-card text-xs text-muted-foreground">
        + Foto de portada
      </div>

      {fields.map((field) => (
        <div key={field.label} className="flex flex-col gap-1.5">
          <span className="text-[0.62rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {field.label}
          </span>
          <span className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm">
            {field.value}
          </span>
        </div>
      ))}

      <div className="flex flex-col gap-1.5">
        <span className="text-[0.62rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Categoría
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["Clásicos", "Cars & Coffee", "Tuning", "JDM"].map((kind, i) => (
            <span
              key={kind}
              className={cn(
                "rounded-4xl px-3 py-1 text-xs font-medium",
                i === 0
                  ? "bg-brand text-brand-foreground"
                  : "border border-border text-muted-foreground"
              )}
            >
              {kind}
            </span>
          ))}
        </div>
      </div>

      <span className="mt-1 rounded-4xl bg-brand py-3 text-center text-sm font-medium text-brand-foreground">
        Publicar
      </span>
    </div>
  )
}

export { MapMock, NearbyMock, PublishMock, TasteMock }
