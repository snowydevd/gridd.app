"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { ConfirmDialog } from "@/components/app/dialog"
import { OptionPicker } from "@/components/app/option-picker"
import { buttonClass, Card, text } from "@/components/app/ui"
import { removeCar, saveCar } from "@/lib/actions"
import type { ActionResult } from "@/lib/authed"
import type { Car } from "@/lib/convex"
import { cn } from "@/lib/utils"
import { findModel, modelYears, VEHICLE_CATALOG } from "@/lib/vehicle-catalog"

const MAKES = VEHICLE_CATALOG.map((m) => m.name)

/** Agregar o editar un auto (mobile/src/app/garage/[id].tsx): marca, modelo y año del catálogo. */
export function CarForm({ car, currentYear }: { car: Car | null; currentYear: number }) {
  const router = useRouter()
  const [make, setMake] = useState<string | null>(car?.make ?? null)
  const [model, setModel] = useState<string | null>(car?.model ?? null)
  const [year, setYear] = useState<number | null>(car?.year ?? null)
  const [version, setVersion] = useState(car?.version ?? "")
  const [isModified, setIsModified] = useState(car?.isModified ?? false)
  const [busy, setBusy] = useState<"save" | "delete" | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const models = VEHICLE_CATALOG.find((m) => m.name === make)?.models.map((m) => m.name) ?? []
  const catalogModel = make && model ? findModel(make, model) : undefined
  const years = catalogModel ? modelYears(catalogModel, currentYear) : []
  const ready = !!make && !!model && !!year

  // Al cambiar la marca o el modelo, lo que dependía de eso puede dejar de valer.
  const pickMake = (value: string) => {
    if (value === make) return
    setMake(value)
    setModel(null)
    setYear(null)
    setError(null)
  }
  const pickModel = (value: string) => {
    setModel(value)
    const found = make ? findModel(make, value) : undefined
    if (year && found && !modelYears(found, currentYear).includes(year)) setYear(null)
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
    if (!make || !model || !year || busy) return
    setBusy("save")
    setError(null)
    startTransition(async () => done(await saveCar({ id: car?._id, make, model, year, version, isModified })))
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
        <OptionPicker label="Marca" value={make} options={MAKES} onChange={pickMake} searchable />
        <OptionPicker
          label="Modelo"
          value={model}
          options={models}
          onChange={pickModel}
          placeholder={make ? "Elegir" : "Elegí la marca primero"}
          disabled={!make}
          searchable
        />
        <OptionPicker
          label="Año"
          value={year}
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
          {busy === "delete" ? "Eliminando…" : "Eliminar auto"}
        </button>
      )}

      <ConfirmDialog
        open={confirming}
        title="Eliminar auto"
        message={car ? `¿Sacar el ${car.make} ${car.model} de tu garage?` : ""}
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
