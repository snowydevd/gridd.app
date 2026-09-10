import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

/**
 * Aviso sobre carreras ilegales. Va donde alguien está por publicar (GRI-13)
 * y en la ficha pública del evento (GRI-19), no escondido en los términos.
 */
function PicadasNotice({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      className={cn(
        "flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm",
        className
      )}
      {...props}
    >
      <HugeiconsIcon
        icon={Alert02Icon}
        strokeWidth={2}
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-destructive"
      />
      <div className="flex flex-col gap-1.5">
        <p className="font-medium text-foreground">
          Gridd no admite picadas ni carreras en la vía pública.
        </p>
        <p className="text-muted-foreground">
          Los encuentros, junadas, rodadas y expos son bienvenidos. Competir en
          velocidad fuera de un circuito habilitado no, y publicarlo acá termina
          en el evento borrado y la cuenta bloqueada.{" "}
          <Link
            href="/normas"
            className="text-foreground underline underline-offset-4 hover:text-brand"
          >
            Leer las normas
          </Link>
          .
        </p>
      </div>
    </aside>
  )
}

export { PicadasNotice }
