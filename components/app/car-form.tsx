"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

import { ConfirmDialog } from "@/components/app/dialog"
import { OptionPicker } from "@/components/app/option-picker"
import { buttonClass, Card, Icon, text } from "@/components/app/ui"
import { removeCar, saveCar, vehicleApiNames } from "@/lib/actions"
import type { ActionResult } from "@/lib/authed"
import type { Car, VehicleType } from "@/lib/convex"
import { cn } from "@/lib/utils"
import { catalogFor, findModel, MIN_YEAR, mergeNames, modelYears, nameKey } from "@/lib/vehicle-catalog"
import { VEHICLE_ICON, vehicleNoun, vehicleType } from "@/lib/vehicle-icons"
const TYPES: { type: VehicleType; label: string }[] = [
  { type: "car", label: "Auto" },
  { type: "motorcycle", label: "Moto" },
]

// Listas de NHTSA ya pedidas en esta pestaña (el backend además las cachea 30 días).
const apiCache = new Map<string, string[]>()

/** Pide una lista a NHTSA una sola vez; mientras tanto (o si falla) es `[]`. */
function useApiList(key: string | null, load: () => Promise<string[]>) {
  const [, rerender] = useState(0)
  useEffect(() => {
    if (!key || apiCache.has(key)) return
    let alive = true
    load()
      .then((names) => apiCache.set(key, names))
      .catch(() => apiCache.set(key, []))
      .finally(() => alive && rerender((n) => n + 1))
    return () => {
      alive = false
    }
    // `load` cambia en cada render; la clave ya identifica el pedido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return { names: (key && apiCache.get(key)) || [], loading: !!key && !apiCache.has(key) }
}

/**
 * Agregar o editar un auto o moto (mobile/src/app/garage/[id].tsx): el catálogo local (con rangos de
 * años) más lo que traiga NHTSA, y marca o modelo escritos a mano si no están.
 */
export function CarForm({ car, currentYear }: { car: Car | null; currentYear: number }) {
  const router = useRouter()
  const [type, setType] = useState<VehicleType>(car ? vehicleType(car) : "car")
  const [make, setMake] = useState<string | null>(car?.make ?? null)
  const [model, setModel] = useState<string | null>(car?.model ?? null)
  const [year, setYear] = useState<number | null>(car?.year ?? null)
  const [version, setVersion] = useState(car?.version ?? "")
  const [isModified, setIsModified] = useState(car?.isModified ?? false)
  const [busy, setBusy] = useState<"save" | "delete" | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const catalog = catalogFor(type)
  const apiMakes = useApiList(`makes:${type}`, () => vehicleApiNames({ type }))
  const apiModels = useApiList(make ? `models:${type}:${nameKey(make)}` : null, () => vehicleApiNames({ type, make: make! }))
  const localMake = make ? catalog.find((m) => nameKey(m.name) === nameKey(make)) : undefined
  const makes = mergeNames(
    catalog.map((m) => m.name),
    apiMakes.names
  )
  const models = mergeNames(localMake?.models.map((m) => m.name) ?? [], apiModels.names)
  // Un modelo que no está en el catálogo local deja elegir cualquier año desde MIN_YEAR.
  const localModel = localMake && model ? findModel(localMake.name, model, type) : undefined
  const years = model ? modelYears(localModel ?? { name: model, from: MIN_YEAR, to: null }, currentYear) : []
  // Si el modelo nuevo no se fabricó en el año elegido, el año se vuelve a elegir.
  const validYear = year && years.includes(year) ? year : null
  const ready = !!make && !!model && !!validYear
  const noun = vehicleNoun(type)

  // Al cambiar el tipo, la marca o el modelo, lo que dependía de eso puede dejar de valer.
  const pickType = (value: VehicleType) => {
    if (value === type) return
    setType(value)
    setMake(null)
    setModel(null)
    setYear(null)
    setError(null)
  }
  const pickMake = (value: string) => {
    if (value === make) return
    setMake(value)
    setModel(null)
    setYear(null)
    setError(null)
  }
  const pickModel = (value: string) => {
    setModel(value)
    setError(null)
  }

  const done = (result: ActionResult) => {
    if (result.ok) {
      router.push("/perfil/garage")
      return
    }
    setBusy(null)
    if (result.reason === "auth") router.push("/ingresar?next=/perfil/garage")
    else setError(result.message)
  }

  const save = () => {
    if (!make || !model || !validYear || busy) return
    setBusy("save")
    setError(null)
    startTransition(async () => done(await saveCar({ id: car?._id, type, make, model, year: validYear, version, isModified })))
  }

  const remove = () => {
    if (!car) return
    setConfirming(false)
    setBusy("delete")
    setError(null)
    startTransition(async () => done(await removeCar({ id: car._id })))
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
      <fieldset disabled={!!busy} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className={cn(text.overline, "text-muted-foreground")}>Tipo</span>
          <div role="radiogroup" aria-label="Tipo" className="flex gap-2 rounded-[12px] border border-border bg-card p-1">
            {TYPES.map((t) => {
              const selected = t.type === type
              return (
                <button
                  key={t.type}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => pickType(t.type)}
                  className={cn(
                    "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[10px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
                    selected ? "bg-brand-text text-brand-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon icon={VEHICLE_ICON[t.type]} className="size-5" />
                  <span className={text.heading}>{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <OptionPicker
          label="Marca"
          value={make}
          options={makes}
          onChange={pickMake}
          loading={apiMakes.loading}
          searchable
          allowCustom
        />
        <OptionPicker
          label="Modelo"
          value={model}
          options={models}
          onChange={pickModel}
          placeholder={make ? "Elegir" : "Elegí la marca primero"}
          disabled={!make}
          loading={apiModels.loading}
          searchable
          allowCustom
        />
        <OptionPicker
          label="Año"
          value={validYear}
          options={years}
          onChange={setYear}
          placeholder={model ? "Elegir" : "Elegí el modelo primero"}
          disabled={!model}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="car-version" className={cn(text.overline, "text-muted-foreground")}>
            Versión (opcional)
          </label>
          <input
            id="car-version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="Ej: G5 1.6, GTI, Type R"
            maxLength={40}
            className="min-h-14 rounded-[12px] border border-border bg-card px-4 text-[17px] font-medium outline-none placeholder:text-disabled focus-visible:ring-[3px] focus-visible:ring-ring/60"
          />
        </div>
        <Card className="flex items-center gap-3 p-4">
          <label htmlFor="car-modified" className="flex flex-1 flex-col">
            <span className={text.heading}>Modificado</span>
            <span className={cn(text.caption, "text-muted-foreground")}>Tuning, stance, motor, escape…</span>
          </label>
          <Switch id="car-modified" checked={isModified} onChange={setIsModified} />
        </Card>
      </fieldset>

      {error && (
        <p role="alert" className={cn(text.label, "mt-4 text-destructive")}>
          {error}
        </p>
      )}

      <button type="button" onClick={save} disabled={!ready || busy === "delete"} className={buttonClass("primary", "mt-6")}>
        {busy === "save" ? "Guardando…" : car ? "Guardar cambios" : "Agregar al garage"}
      </button>
      {car && (
        <button type="button" onClick={() => setConfirming(true)} disabled={busy === "save"} className={buttonClass("ghost", "mt-3")}>
          {busy === "delete" ? "Eliminando…" : `Eliminar ${noun}`}
        </button>
      )}

      <ConfirmDialog
        open={confirming}
        title={`Eliminar ${noun}`}
        message={car ? `¿Sacar ${car.make} ${car.model} de tu garage?` : ""}
        confirmLabel="Eliminar"
        destructive
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      />
    </main>
  )
}

/** Interruptor como el `Switch` de Android en la app. */
function Switch({ id, checked, onChange }: { id: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/60",
        checked ? "bg-brand-text" : "bg-raised"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 left-1 size-5 rounded-full shadow transition-transform",
          checked ? "translate-x-5 bg-brand-foreground" : "bg-muted-foreground"
        )}
      />
    </button>
  )
}
