import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

/**
 * Carga genérica con spinner. Para esperas cortas o acciones puntuales.
 */
function LoadingState({
  label = "Cargando",
  className,
  ...props
}: React.ComponentProps<"div"> & { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 p-12 text-muted-foreground",
        className
      )}
      {...props}
    >
      <Spinner className="size-5" />
      <span className="font-mono text-[0.72rem] tracking-[0.06em]">{label}</span>
    </div>
  )
}

/**
 * Esqueleto de una tarjeta de contenido. Replica la silueta real
 * para que no haya salto de layout cuando llegan los datos.
 */
function CardSkeleton({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn("gap-4", className)} aria-hidden {...props}>
      <CardHeader className="gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-5 w-16 rounded-4xl" />
        <Skeleton className="h-5 w-20 rounded-4xl" />
      </CardFooter>
    </Card>
  )
}

/**
 * Grilla de esqueletos para listados.
 */
function LoadingCards({
  count = 3,
  className,
  ...props
}: React.ComponentProps<"div"> & { count?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando contenido"
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export { LoadingState, LoadingCards, CardSkeleton }
