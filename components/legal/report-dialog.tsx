"use client"

import * as React from "react"
import { Alert02Icon, Flag02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  reasonsNeedingDetail,
  reportReasons,
  type ReportReason,
} from "@/lib/legal"

export type ReportPayload = {
  eventId?: string
  reason: ReportReason
  details: string
}

/**
 * Reporte de un evento con motivos predefinidos (GRI-25).
 *
 * La persistencia todavía no existe: sin `onReport` el envío resuelve solo y
 * queda el aviso al usuario. La ficha de evento (GRI-19) le pasa el handler
 * que escribe el reporte cuando exista el schema.
 */
function ReportDialog({
  eventId,
  eventTitle,
  trigger,
  onReport,
}: {
  eventId?: string
  eventTitle?: string
  trigger?: React.ReactElement
  onReport?: (payload: ReportPayload) => Promise<void> | void
}) {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState<ReportReason | null>(null)
  const [details, setDetails] = React.useState("")
  const [sending, setSending] = React.useState(false)

  const needsDetail = reason !== null && reasonsNeedingDetail.includes(reason)
  const canSend = reason !== null && (!needsDetail || details.trim().length > 0)

  // Cada apertura arranca limpia: un reporte no arrastra el anterior.
  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setReason(null)
      setDetails("")
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend || reason === null) return

    setSending(true)
    try {
      await onReport?.({ eventId, reason, details: details.trim() })
      handleOpenChange(false)
      toast.add({
        title: "Reporte enviado",
        description: "Lo miramos y te avisamos si hace falta algo más.",
        type: "success",
      })
    } catch {
      toast.add({
        title: "No pudimos enviar el reporte",
        description: "Probá de nuevo en un rato.",
        type: "error",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <HugeiconsIcon
                icon={Flag02Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Reportar
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Reportar evento</DialogTitle>
            <DialogDescription>
              {eventTitle
                ? `Contanos qué pasa con “${eventTitle}”. El organizador no ve quién reportó.`
                : "Contanos qué pasa. El organizador no ve quién reportó."}
            </DialogDescription>
          </DialogHeader>

          {/* Tope propio: en pantallas bajas scrollea el cuerpo, no el diálogo,
              y el footer queda siempre a mano. */}
          <div className="-mx-1 flex max-h-[calc(100svh-17rem)] flex-col gap-6 overflow-y-auto px-1">
            <RadioGroup
              value={reason}
              onValueChange={(value) => setReason(value as ReportReason)}
              aria-label="Motivo del reporte"
              className="gap-1"
            >
              {reportReasons.map((option) => (
                <label
                  key={option.value}
                  className="group/field-label flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/50 has-data-checked:bg-muted/50"
                >
                  <RadioGroupItem value={option.value} className="mt-0.5" />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm leading-none font-medium">
                      {option.label}
                    </span>
                    <span className="text-xs leading-5 text-muted-foreground">
                      {option.hint}
                    </span>
                  </span>
                </label>
              ))}
            </RadioGroup>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="report-details"
                className="text-sm leading-none font-medium"
              >
                Detalle{" "}
                {!needsDetail && (
                  <span className="font-normal text-muted-foreground">
                    (opcional)
                  </span>
                )}
              </label>
              <Textarea
                id="report-details"
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                maxLength={500}
                placeholder="Link, capturas, lo que sepas. Cuanto más concreto, más rápido lo resolvemos."
                required={needsDetail}
              />
            </div>
          </div>

          {reason === "picada" && (
            <p className="flex gap-2 text-xs leading-5 text-destructive">
              <HugeiconsIcon
                icon={Alert02Icon}
                strokeWidth={2}
                aria-hidden
                className="mt-0.5 size-3.5 shrink-0"
              />
              Los reportes por picadas se revisan primero. Si hay gente en riesgo
              ahora, llamá al 911.
            </p>
          )}

          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="ghost" disabled={sending}>
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" variant="brand" disabled={!canSend || sending}>
              {sending ? "Enviando…" : "Enviar reporte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { ReportDialog }
