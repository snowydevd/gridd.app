"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon, Edit02Icon, Image01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  coverUploadUrl,
  createEvent,
  resolvePlace,
  updateEvent,
  type EventFormInput,
} from "@/app/organizadores/panel/actions"
import { Wordmark } from "@/components/brand/wordmark"
import { iconButtonClass } from "@/components/app/ui"
import { PlacePicker } from "@/components/organizer/place-picker"
import type { ActionResult } from "@/lib/authed"
import { KIND_LABELS, type GriddEvent } from "@/lib/convex"
import { fromTimestamp, toTimestamp } from "@/lib/event-time"
import { embedUrl, inUruguay, placeUrl } from "@/lib/maps"
import { IMAGE_ACCEPT, uploadImage } from "@/lib/upload"
import { ui } from "@/lib/ui"
import { cn } from "@/lib/utils"

const STEPS = ["Evento", "Cuándo", "Dónde", "Portada"] as const
const REVIEW = STEPS.length
/**
 * La portada se sube entera, con su forma (sin recorte), achicada como en la app: a `COVER_WIDTH` de
 * ancho, o por alto si pasaría `COVER_MAX_HEIGHT` (una historia 9:16 a ese ancho).
 */
const COVER_WIDTH = 1280
const COVER_MAX_HEIGHT = 2276
const KINDS = Object.entries(KIND_LABELS)

const TZ = "America/Montevideo"
const dayFmt = new Intl.DateTimeFormat("es-UY", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: TZ,
})

type Cover = { kind: "existing"; url: string } | { kind: "new"; file: File; preview: string } | null

/**
 * Publicar o editar un evento (mobile/src/app/publish.tsx): cuatro pasos y una revisión. Al editar se
 * arranca en la revisión y desde ahí se toca la sección a cambiar. `now` viene del server para que el
 * HTML y la hidratación coincidan. Con `mapsKey` el lugar se marca en un mapa de Google; sin ella (o si
 * Google la rechaza) se pega un link de Maps o las coordenadas.
 */
export function EventForm({ initial, now, mapsKey }: { initial?: GriddEvent; now: number; mapsKey?: string }) {
  const router = useRouter()
  const [step, setStep] = useState(initial ? REVIEW : 0)
  const isFirst = step === 0 || (!!initial && step === REVIEW)
  const today = fromTimestamp(now).day

  const start0 = initial ? fromTimestamp(initial.startsAt) : null
  const [title, setTitle] = useState(initial?.title ?? "")
  const [kind, setKind] = useState<string | null>(initial?.kind ?? null)
  const [day, setDay] = useState(start0?.day ?? "")
  const [start, setStart] = useState(start0?.time ?? "")
  const [end, setEnd] = useState(initial && !initial.noEndTime ? fromTimestamp(initial.endsAt).time : "")
  const [noEndTime, setNoEndTime] = useState(initial?.noEndTime ?? false)
  const [placeName, setPlaceName] = useState(initial?.placeName ?? "")
  const [placeQuery, setPlaceQuery] = useState("")
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    initial ? { lat: initial.lat, lon: initial.lon } : null
  )
  const [cover, setCover] = useState<Cover>(initial?.imageUrl ? { kind: "existing", url: initial.imageUrl } : null)
  const [description, setDescription] = useState(initial?.description ?? "")
  const [paidEvent, setPaidEvent] = useState(initial?.paidEvent ?? false)
  const [entryCost, setEntryCost] = useState(initial?.entryCost ?? 0)
  const [isSolidary, setIsSolidary] = useState(initial?.isSolidary ?? false)
  const [error, setError] = useState<string | null>(null)
  const [placeError, setPlaceError] = useState<string | null>(null)
  const [mapsFailed, setMapsFailed] = useState(false)
  const withMap = !!mapsKey && !mapsFailed
  const [searching, startSearch] = useTransition()
  const [publishing, startPublish] = useTransition()
  const fileInput = useRef<HTMLInputElement>(null)

  // La vista previa de una portada nueva es un object URL: se libera al cambiarla.
  useEffect(() => {
    if (cover?.kind !== "new") return
    return () => URL.revokeObjectURL(cover.preview)
  }, [cover])

  const startsAt = toTimestamp(day, start)
  // El fin es el mismo día; si el evento pasa la medianoche se marca "Sin hora de fin".
  const endsAt = !noEndTime ? toTimestamp(day, end) : null
  // Al editar sólo se exige fecha futura si se cambió (igual que en events.update).
  const startPassed = startsAt !== null && startsAt <= now && startsAt !== initial?.startsAt
  const endBeforeStart = startsAt !== null && endsAt !== null && endsAt <= startsAt
  const whenError = startPassed
    ? "Ese horario ya pasó. Elegí uno más adelante."
    : endBeforeStart
      ? 'La hora de fin tiene que ser después de la de inicio. Si termina pasada la medianoche, marcá "Sin hora de fin".'
      : null
  const outsideUruguay = coords !== null && !inUruguay(coords.lat, coords.lon)

  const canContinue = [
    title.trim().length >= 3 && !!kind && (!paidEvent || entryCost > 0),
    startsAt !== null && (noEndTime || endsAt !== null) && !whenError,
    placeName.trim().length >= 2 && coords !== null && !outsideUruguay,
    true,
    true,
  ][step]

  const onAuth = (result: ActionResult<unknown>) => {
    if (result.ok) return false
    if (result.reason === "auth") {
      router.push(`/ingresar?next=${encodeURIComponent(window.location.pathname)}`)
      return true
    }
    return false
  }

  const searchPlace = () => {
    const text = placeQuery.trim()
    if (!text || searching) return
    setPlaceError(null)
    startSearch(async () => {
      const result = await resolvePlace({ text })
      if (onAuth(result)) return
      if (result.ok) {
        setCoords(result.value)
        setPlaceQuery("")
      } else if (result.reason === "error") setPlaceError(result.message)
    })
  }

  const pickCover = (file: File | undefined) => {
    if (!file) return
    if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
      setError("La portada tiene que ser JPG, PNG o WebP.")
      return
    }
    setError(null)
    setCover({ kind: "new", file, preview: URL.createObjectURL(file) })
  }

  const submit = () => {
    if (!kind || startsAt === null || !coords || publishing) return
    setError(null)
    startPublish(async () => {
      let image: { imageId: string; imageWidth: number; imageHeight: number } | undefined
      if (cover?.kind === "new") {
        const url = await coverUploadUrl()
        if (onAuth(url)) return
        if (!url.ok) return setError(url.reason === "error" ? url.message : null)
        try {
          const uploaded = await uploadImage(url.value, cover.file, { maxWidth: COVER_WIDTH, maxHeight: COVER_MAX_HEIGHT })
          image = { imageId: uploaded.storageId, imageWidth: uploaded.width, imageHeight: uploaded.height }
        } catch (e) {
          console.error("[panel] subir portada falló:", e)
          return setError("No pudimos subir la portada. Probá con otra imagen.")
        }
      }

      const fields: EventFormInput = {
        title,
        description,
        kind,
        day,
        start,
        end: noEndTime ? null : end,
        noEndTime,
        placeName,
        lat: coords.lat,
        lon: coords.lon,
        paidEvent,
        entryCost: paidEvent ? entryCost : undefined,
        isSolidary,
      }

      if (initial) {
        const result = await updateEvent({
          ...fields,
          id: initial._id,
          slug: initial.slug,
          cover: image ?? (cover === null && initial.imageUrl ? "remove" : "keep"),
        })
        if (onAuth(result)) return
        if (!result.ok) return setError(result.reason === "error" ? result.message : null)
        router.replace(`/e/${initial.slug}`)
        return
      }

      const result = await createEvent({ ...fields, ...image })
      if (onAuth(result)) return
      if (!result.ok) return setError(result.reason === "error" ? result.message : null)
      router.replace(`/e/${result.value}`)
    })
  }

  const next = () => (step < REVIEW ? setStep(step + 1) : submit())
  const back = () => {
    if (publishing) return
    if (isFirst) router.back()
    else setStep(step - 1)
  }

  const coverSrc = cover?.kind === "new" ? cover.preview : cover?.kind === "existing" ? cover.url : null

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button type="button" onClick={back} aria-label={isFirst ? "Cerrar" : "Atrás"} className={iconButtonClass()}>
            <HugeiconsIcon icon={isFirst ? Cancel01Icon : ArrowLeft01Icon} strokeWidth={2} aria-hidden className="size-5" />
          </button>
          <span className="text-[11px] font-semibold tracking-[1.2px] text-muted-foreground uppercase">
            {step < REVIEW ? `Paso ${step + 1} de ${STEPS.length}` : "Revisión"}
          </span>
          <span className="w-11" />
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((s, i) => (
            <span key={s} className={cn("h-[3px] flex-1 rounded-full", i <= step ? "bg-brand" : "bg-border")} />
          ))}
        </div>
      </div>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (canContinue) next()
        }}
      >
        {step === 0 && (
          <>
            <StepTitle>¿Cómo se llama?</StepTitle>
            <div className="flex flex-col gap-2">
              <label htmlFor="ev-title" className={ui.label}>
                Nombre
              </label>
              <input
                id="ev-title"
                autoFocus={!initial}
                maxLength={60}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Juntada Nocturna Pocitos"
                className={ui.input}
              />
            </div>
            <div className="flex flex-col gap-3">
              <span className={ui.label}>Tipo</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo">
                {KINDS.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={kind === value}
                    onClick={() => setKind(value)}
                    className={cn(ui.chip, kind === value ? ui.chipOn : ui.chipOff)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* Como en la app (publish.tsx): entrada paga con su precio y evento solidario. */}
            <div className="flex flex-col gap-3">
              <span className={ui.label}>Entrada</span>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={paidEvent}
                  onChange={(e) => setPaidEvent(e.target.checked)}
                  className="size-4 accent-[var(--brand)]"
                />
                Hay que pagar entrada
              </label>
              {paidEvent && (
                <div className="relative">
                  <span aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <input
                    aria-label="Precio de entrada"
                    inputMode="numeric"
                    maxLength={7}
                    value={entryCost === 0 ? "" : String(entryCost)}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "")
                      setEntryCost(digits === "" ? 0 : parseInt(digits, 10))
                    }}
                    placeholder="Precio de entrada"
                    className={cn(ui.input, "pl-8")}
                  />
                </div>
              )}
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={isSolidary}
                  onChange={(e) => setIsSolidary(e.target.checked)}
                  className="size-4 accent-[var(--brand)]"
                />
                Evento solidario
              </label>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <StepTitle>¿Cuándo es?</StepTitle>
            <div className="flex flex-col gap-2">
              <label htmlFor="ev-day" className={ui.label}>
                Día
              </label>
              <input
                id="ev-day"
                type="date"
                min={today}
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className={cn(ui.input)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="ev-start" className={ui.label}>
                  Hora de inicio
                </label>
                <input
                  id="ev-start"
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className={cn(ui.input)}
                />
              </div>
              {!noEndTime && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="ev-end" className={ui.label}>
                    Hora de fin
                  </label>
                  <input
                    id="ev-end"
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className={cn(ui.input)}
                  />
                </div>
              )}
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={noEndTime}
                onChange={(e) => setNoEndTime(e.target.checked)}
                className="size-4 accent-[var(--brand)]"
              />
              Sin hora de fin
            </label>
            <p className={ui.hint}>Hora de Uruguay.</p>
            {whenError && (
              <p role="alert" className={ui.error}>
                {whenError}
              </p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <StepTitle>¿Dónde?</StepTitle>
            <div className="flex flex-col gap-2">
              <label htmlFor="ev-place" className={ui.label}>
                Nombre del lugar
              </label>
              <input
                id="ev-place"
                maxLength={120}
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Ej: Explanada de Kibón"
                className={ui.input}
              />
            </div>
            {withMap ? (
              <>
                <PlacePicker
                  apiKey={mapsKey}
                  value={coords}
                  onChange={setCoords}
                  // El nombre de Places sólo completa el campo si todavía está vacío.
                  onPlaceName={(name) => setPlaceName((current) => (current.trim() ? current : name.slice(0, 120)))}
                  onUnavailable={() => setMapsFailed(true)}
                />
                {outsideUruguay && (
                  <p role="alert" className={ui.error}>
                    El lugar tiene que estar en Uruguay.
                  </p>
                )}
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    ¿Ya tenés el link de Google Maps?
                  </summary>
                  <div className="pt-3">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="ev-coords" className={ui.label}>
                        {coords ? "Cambiar ubicación" : "Ubicación en el mapa"}
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="ev-coords"
                          inputMode="url"
                          value={placeQuery}
                          onChange={(e) => setPlaceQuery(e.target.value)}
                          onKeyDown={(e) => {
                            // Enter busca, no avanza de paso.
                            if (e.key === "Enter") {
                              e.preventDefault()
                              searchPlace()
                            }
                          }}
                          placeholder="Link de Google Maps o -34.91, -56.15"
                          className={ui.input}
                        />
                        <button
                          type="button"
                          onClick={searchPlace}
                          disabled={!placeQuery.trim() || searching}
                          className={cn(ui.secondary, "shrink-0 py-0")}
                        >
                          {searching ? "Buscando…" : "Usar"}
                        </button>
                      </div>
                      <p className={ui.hint}>
                        En Google Maps buscá el lugar, tocá <strong>Compartir</strong> y pegá el link acá. También podés
                        pegar las coordenadas.
                      </p>
                      {placeError && (
                        <p role="alert" className={ui.error}>
                          {placeError}
                        </p>
                      )}
                    </div>
                  </div>
                </details>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="ev-coords" className={ui.label}>
                    {coords ? "Cambiar ubicación" : "Ubicación en el mapa"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="ev-coords"
                      inputMode="url"
                      value={placeQuery}
                      onChange={(e) => setPlaceQuery(e.target.value)}
                      onKeyDown={(e) => {
                        // Enter busca, no avanza de paso.
                        if (e.key === "Enter") {
                          e.preventDefault()
                          searchPlace()
                        }
                      }}
                      placeholder="Link de Google Maps o -34.91, -56.15"
                      className={ui.input}
                    />
                    <button
                      type="button"
                      onClick={searchPlace}
                      disabled={!placeQuery.trim() || searching}
                      className={cn(ui.secondary, "shrink-0 py-0")}
                    >
                      {searching ? "Buscando…" : "Usar"}
                    </button>
                  </div>
                  <p className={ui.hint}>
                    En Google Maps buscá el lugar, tocá <strong>Compartir</strong> y pegá el link acá. También podés
                    pegar las coordenadas.
                  </p>
                  {placeError && (
                    <p role="alert" className={ui.error}>
                      {placeError}
                    </p>
                  )}
                </div>
                {coords && (
                  <div className="flex flex-col gap-2">
                    <iframe
                      title="Vista previa del lugar"
                      src={embedUrl(coords.lat, coords.lon)}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="aspect-[16/10] w-full rounded-3xl border border-border bg-muted"
                    />
                    {outsideUruguay ? (
                      <p role="alert" className={ui.error}>
                        El lugar tiene que estar en Uruguay.
                      </p>
                    ) : (
                      <a
                        href={placeUrl(coords.lat, coords.lon)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start text-sm font-medium text-brand-text hover:underline"
                      >
                        Revisar el punto en Google Maps →
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <StepTitle>Elegí una portada</StepTitle>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              aria-label={coverSrc ? "Cambiar portada" : "Subir portada"}
              className={cn(
                "relative flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-[16px] bg-card outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                !coverSrc && "aspect-[16/10] border-2 border-dashed border-border"
              )}
            >
              {coverSrc ? (
                // El flyer entero, con su forma: se sube así, sin recorte.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverSrc} alt="" className="max-h-[60dvh] w-full object-contain" />
              ) : (
                <>
                  <HugeiconsIcon
                    icon={Image01Icon}
                    strokeWidth={1.8}
                    aria-hidden
                    className="size-7 text-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground">Subir foto (opcional)</span>
                </>
              )}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept={IMAGE_ACCEPT}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                pickCover(e.target.files?.[0])
                e.target.value = ""
              }}
            />
            {coverSrc ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className={cn(ui.secondary, "flex-1 py-3")}
                >
                  Cambiar
                </button>
                <button type="button" onClick={() => setCover(null)} className={cn(ui.secondary, "flex-1 py-3")}>
                  Quitar
                </button>
              </div>
            ) : (
              <p className={ui.hint}>Si no subís una, el evento usa la portada de Gridd.</p>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="ev-description" className={ui.label}>
                Descripción (opcional)
              </label>
              <textarea
                id="ev-description"
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Algo que la gente tenga que saber"
                className={ui.textarea}
              />
            </div>
          </>
        )}

        {step === REVIEW && (
          <>
            <StepTitle>{initial ? "Revisá los cambios" : "Revisá tu evento"}</StepTitle>
            <div className="relative flex h-80 flex-col justify-end overflow-hidden rounded-[16px] bg-card">
              {coverSrc ? (
                <>
                  {/* Entero sobre el mismo flyer desenfocado, como en la ficha. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverSrc} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover blur-xl" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverSrc} alt="" className="absolute inset-0 size-full object-contain" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Wordmark className="h-8 text-muted-foreground" mono />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              <div className="relative flex flex-col gap-1 p-5 text-white">
                <div className="flex flex-wrap gap-1.5">
                  {kind && (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.12em] uppercase backdrop-blur">
                      {KIND_LABELS[kind]}
                    </span>
                  )}
                  {paidEvent && entryCost > 0 && (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.12em] uppercase backdrop-blur">
                      ${entryCost.toLocaleString("es-UY")}
                    </span>
                  )}
                  {isSolidary && (
                    <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-[0.68rem] font-semibold tracking-[0.12em] text-[var(--brand-foreground)] uppercase">
                      Solidario
                    </span>
                  )}
                </div>
                <span className="font-heading text-2xl leading-tight">{title}</span>
                <span className="text-sm text-white/70">
                  {startsAt !== null && (
                    <span className="capitalize">{dayFmt.format(startsAt).replace(/\./g, "")}</span>
                  )}
                  {" · "}
                  {start}
                  {!noEndTime && end ? ` – ${end}` : ""} hs
                </span>
                <span className="truncate text-sm text-white/70">{placeName}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(i)}
                  className={cn(ui.chip, ui.chipOff, "inline-flex items-center gap-1.5 py-1.5")}
                >
                  <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} aria-hidden className="size-3.5" />
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {error && (
          <p role="alert" className={ui.error}>
            {error}
          </p>
        )}

        <button type="submit" disabled={!canContinue || publishing} className={cn(ui.primary, "mt-2")}>
          {step === REVIEW
            ? publishing
              ? initial
                ? "Guardando…"
                : "Publicando…"
              : initial
                ? "Guardar cambios"
                : "Publicar evento"
            : "Siguiente"}
          {step < REVIEW && <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} aria-hidden className="size-5" />}
        </button>
      </form>
    </div>
  )
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-[32px] leading-[34px] tracking-[-0.4px] uppercase">{children}</h1>
}
