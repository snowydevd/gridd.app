import { cn } from "@/lib/utils"

/**
 * Tipografía para texto largo. No usamos @tailwindcss/typography,
 * así que los estilos van acá y valen para todas las páginas legales.
 */
function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-prose text-sm leading-7 text-muted-foreground",
        "[&>h2]:mt-10 [&>h2]:mb-3 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:tracking-[-0.01em] [&>h2]:text-foreground",
        "[&>h3]:mt-6 [&>h3]:mb-2 [&>h3]:text-sm [&>h3]:font-medium [&>h3]:text-foreground",
        "[&>p]:mb-4 [&>ul]:mb-4 [&>ul]:flex [&>ul]:flex-col [&>ul]:gap-2 [&>ul]:pl-5",
        "[&_li]:list-disc [&_li]:marker:text-muted-foreground/40",
        "[&_strong]:font-medium [&_strong]:text-foreground",
        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-brand",
        className
      )}
      {...props}
    />
  )
}

export { Prose }
