/** Clases de los formularios, las mismas de `TestersForm` / `WaitlistForm`, para no repetirlas. */
export const ui = {
  input:
    "h-14 w-full rounded-[12px] border border-border bg-card px-4 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40 disabled:text-muted-foreground",
  textarea:
    "min-h-28 w-full rounded-[12px] border border-border bg-card px-4 py-3 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40",
  label: "text-sm font-medium",
  hint: "text-xs leading-5 text-muted-foreground",
  primary:
    "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[12px] bg-brand px-6 py-3 text-center font-semibold text-brand-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-brand/40 disabled:bg-raised disabled:text-disabled",
  secondary:
    "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[12px] border border-border bg-card px-6 py-3 text-center font-semibold outline-none hover:bg-input/30 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-40",
  danger:
    "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[12px] bg-destructive px-6 py-3 text-center font-semibold text-destructive-foreground outline-none hover:opacity-90 focus-visible:ring-[3px] focus-visible:ring-destructive/40 disabled:opacity-40",
  link: "text-sm font-medium text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline",
  // Como `Chip` en la app: el elegido se invierte (fondo del color del texto).
  chip: "inline-flex h-[38px] items-center rounded-full border px-4 text-[13px] font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  chipOn: "border-foreground bg-foreground text-background",
  chipOff: "border-border bg-card text-foreground",
  error: "text-sm text-destructive",
} as const
