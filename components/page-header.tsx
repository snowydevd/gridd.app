import { cn } from "@/lib/utils"

/**
 * Encabezado de página: micro-label en mono + título ajustado.
 * Es la tipografía de la landing bajada a escala de app.
 */
function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <p className="font-mono text-[0.72rem] tracking-[0.06em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  )
}

export { PageHeader }
