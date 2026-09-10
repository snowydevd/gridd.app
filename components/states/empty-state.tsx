import { HugeiconsIcon } from "@hugeicons/react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

type HugeIcon = React.ComponentProps<typeof HugeiconsIcon>["icon"]

/**
 * Estado vacío genérico: mismo tono en toda la app.
 * La acción opcional es el único lugar donde puede aparecer el flúor.
 */
function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Empty>, "title" | "children"> & {
  icon?: HugeIcon
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <Empty className={cn("border border-dashed border-border", className)} {...props}>
      <EmptyHeader>
        {icon && (
          <EmptyMedia variant="icon" className="text-muted-foreground">
            <HugeiconsIcon icon={icon} strokeWidth={1.5} />
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  )
}

export { EmptyState }
