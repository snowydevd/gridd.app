import { PageHeader } from "@/components/page-header"
import { site } from "@/lib/site"

/**
 * Encabezado común de las páginas legales: eyebrow, título, bajada y la
 * fecha de última revisión. El cuerpo lo pone cada página con <Prose>.
 */
function LegalShell({
  title,
  description,
  updated = true,
  children,
}: {
  title: string
  description?: React.ReactNode
  /** La fecha de revisión no aplica en páginas que no son un texto legal. */
  updated?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Legal" title={title} description={description} />
      <div className="flex flex-col gap-6">
        {updated && (
          <p className="text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-muted-foreground">
            Última actualización: {site.legalUpdatedAt}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

export { LegalShell }
