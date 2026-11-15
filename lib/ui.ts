/** Clases de los formularios, las mismas de `TestersForm` / `WaitlistForm`, para no repetirlas. */
export const ui = {
  input:
    "h-14 w-full rounded-2xl border border-border bg-card px-4 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40 disabled:text-muted-foreground",
  textarea:
    "min-h-28 w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40",
  label: "text-sm font-medium",
  hint: "text-xs leading-5 text-muted-foreground",
  primary:
    "inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-4 text-center font-semibold text-brand-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40 disabled:opacity-40",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-4 text-center font-semibold outline-none hover:bg-input/30 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-40",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-2xl bg-destructive/15 px-5 py-4 text-center font-semibold text-destructive outline-none hover:bg-destructive/25 focus-visible:ring-[3px] focus-visible:ring-destructive/40 disabled:opacity-40",
  link: "text-sm font-medium text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline",
  chip: "rounded-full px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  chipOn: "bg-brand text-brand-foreground",
  chipOff: "border border-border bg-input/30 text-muted-foreground hover:text-foreground",
  error: "text-sm text-destructive",
} as const
