import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { BackButton } from "@/components/app/back-button"
import { cn } from "@/lib/utils"

/**
 * Las piezas de la app (mobile/src/components/ui.tsx y text.tsx) en clases de Tailwind, con las mismas
 * medidas: radios de 4 / 8 / 12 / 16 px, botones de 52 px, chips de 38 px y las variantes de texto.
 */

/** Variantes de `Text` en la app. */
export const text = {
  display: "font-heading text-[32px] leading-[34px] font-extrabold tracking-[-0.4px] uppercase",
  title: "font-heading text-[22px] leading-[26px] font-extrabold uppercase",
  heading: "text-[17px] leading-[22px] font-semibold",
  body: "text-[15px] leading-[22px]",
  label: "text-[13px] leading-[18px] font-medium",
  caption: "text-xs leading-4",
  overline: "text-[11px] leading-[14px] font-semibold tracking-[1.2px] uppercase",
} as const

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"

/** `Button` de la app: 52 px de alto, radio 12, ícono a la izquierda. */
export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[12px] px-6 text-base leading-[22px] font-semibold outline-none transition-opacity select-none active:opacity-75 focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:pointer-events-none aria-disabled:pointer-events-none",
    variant === "primary" && "bg-brand text-brand-foreground disabled:bg-raised disabled:text-disabled",
    variant === "secondary" && "border border-border bg-card text-foreground disabled:bg-raised disabled:text-disabled",
    variant === "ghost" && "border border-brand-text bg-brand/16 text-brand-text disabled:opacity-50",
    variant === "danger" && "bg-destructive text-destructive-foreground disabled:opacity-50",
    className
  )
}

/** `IconButton`: redondo de 44 px; `overlay` es oscuro y translúcido, para ir sobre una foto. */
export function iconButtonClass({ overlay, active, size = 44 }: { overlay?: boolean; active?: boolean; size?: 44 | 52 } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full border outline-none transition-opacity active:opacity-75 focus-visible:ring-[3px] focus-visible:ring-ring/60",
    size === 52 ? "size-[52px]" : "size-11",
    overlay
      ? cn("border-white/8 bg-[rgba(11,11,12,0.6)] backdrop-blur-sm", active ? "text-[#e2ff3b]" : "text-[#f2f3f5]")
      : cn("border-border bg-card", active ? "text-brand-text" : "text-foreground")
  )
}

/** `Chip`: seleccionado se invierte (fondo del color del texto). */
export function chipClass(selected: boolean) {
  return cn(
    "inline-flex h-[38px] shrink-0 items-center gap-1.5 rounded-full border px-4 text-[13px] leading-[18px] font-medium whitespace-nowrap outline-none transition-opacity active:opacity-75 focus-visible:ring-[3px] focus-visible:ring-ring/60",
    selected ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground"
  )
}

/** Etiqueta chica (categoría, "Hoy"). `overlay` la deja oscura sobre una foto. */
export function Tag({
  children,
  tone = "default",
  overlay,
  className,
}: {
  children: React.ReactNode
  tone?: "default" | "accent"
  overlay?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        text.overline,
        "inline-flex self-start rounded-[4px] border px-2 py-1",
        tone === "accent"
          ? "border-brand bg-brand text-brand-foreground"
          : overlay
            ? "border-[#2a2c30] bg-[rgba(11,11,12,0.7)] text-[#f2f3f5]"
            : "border-border bg-background/70 text-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-[16px] border border-border bg-card", className)} {...props} />
}

export function Icon({ icon, className, strokeWidth = 1.8 }: { icon: IconSvgElement; className?: string; strokeWidth?: number }) {
  return <HugeiconsIcon icon={icon} strokeWidth={strokeWidth} aria-hidden className={cn("size-5 shrink-0", className)} />
}

/** Encabezado de una pantalla apilada: volver, título centrado y el lugar para una acción. */
export function ScreenHeader({
  title,
  fallback = "/",
  icon = "back",
  action,
}: {
  title?: string
  /** A dónde volver si no hay historial (se abrió el link directo). */
  fallback?: string
  icon?: "back" | "close"
  action?: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-4 pt-2 pb-3">
        <BackButton fallback={fallback} icon={icon} />
        {title && <h1 className={cn(text.title, "min-w-0 truncate text-center")}>{title}</h1>}
        <div className="flex min-w-11 justify-end">{action}</div>
      </div>
    </header>
  )
}

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className={text.title}>{title}</h2>
      {action}
    </div>
  )
}

/** Estado vacío: ícono en un círculo, título y texto. */
export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon: IconSvgElement
  title: string
  children?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 pt-16 text-center">
      <span className="mb-2 flex size-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
        <Icon icon={icon} className="size-6" />
      </span>
      <p className={text.heading}>{title}</p>
      {children && <p className={cn(text.body, "text-muted-foreground")}>{children}</p>}
      {action && <div className="mt-4 flex w-full flex-col">{action}</div>}
    </div>
  )
}

/**
 * Degradé de transparente al fondo, sobre una foto (`Fade` en la app). Dentro de un `data-theme="dark"`
 * termina en el fondo oscuro en los dos temas.
 */
export function Fade({ className, from = "45%" }: { className?: string; from?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 bottom-0", className)}
      style={{
        top: from,
        backgroundImage:
          "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--background) 10%, transparent) 22%, color-mix(in srgb, var(--background) 45%, transparent) 47%, color-mix(in srgb, var(--background) 82%, transparent) 71%, var(--background) 100%)",
      }}
    />
  )
}

/** Separador de filas dentro de una `Card`. */
export const rowClass = "flex min-h-[60px] w-full items-center gap-3 text-left outline-none active:opacity-70 focus-visible:underline"
