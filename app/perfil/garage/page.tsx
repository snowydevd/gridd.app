import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Add01Icon, Car01Icon, Edit02Icon } from "@hugeicons/core-free-icons"

import { buttonClass, Card, EmptyState, Icon, ScreenHeader, Tag, text } from "@/components/app/ui"
import { carTitle, getViewer, query, type Car } from "@/lib/convex"
import { loginUrl, pageToken } from "@/lib/session"
import { VEHICLE_ICON, vehicleNoun, vehicleType } from "@/lib/vehicle-icons"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Mi garage", robots: { index: false } }

/** Tope del backend (`MAX_CARS` en mobile/convex/cars.ts). */
const MAX_CARS = 10

/** Mi garage (mobile/src/app/garage/index.tsx). */
export default async function GaragePage() {
  const token = await pageToken("/perfil/garage")
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl("/perfil/garage"))
  const cars = await query<Car[]>("cars:listMine", {}, token)
  const full = cars.length >= MAX_CARS

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title="Mi garage" fallback="/perfil" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-3 px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        {cars.length === 0 ? (
          <EmptyState
            icon={Car01Icon}
            title="Tu garage está vacío"
            action={
              <Link href="/perfil/garage/nuevo" className={buttonClass("primary")}>
                <Icon icon={Add01Icon} className="size-[18px]" strokeWidth={2} />
                Agregar vehículo
              </Link>
            }
          >
            Sumá tus autos y motos para mostrarlos en tu perfil y en los encuentros.
          </EmptyState>
        ) : (
          <>
            {cars.map((car) => (
              <Link
                key={car._id}
                href={`/perfil/garage/${car._id}`}
                aria-label={`Editar ${vehicleNoun(vehicleType(car))}: ${carTitle(car)}`}
                className="rounded-[16px] outline-none active:opacity-75 focus-visible:ring-[3px] focus-visible:ring-ring/60"
              >
                <Card className="flex items-center gap-3 p-4">
                  <span className="flex size-10 items-center justify-center rounded-[8px] bg-raised text-brand-text">
                    <Icon icon={VEHICLE_ICON[vehicleType(car)]} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className={cn(text.heading, "truncate")}>{carTitle(car)}</span>
                    <span className={cn(text.caption, "text-muted-foreground")}>{car.year}</span>
                  </span>
                  {car.isModified && <Tag tone="accent">Modificado</Tag>}
                  <Icon icon={Edit02Icon} className="size-[18px] text-muted-foreground" />
                </Card>
              </Link>
            ))}
            {full ? (
              <span aria-disabled className={buttonClass("secondary", "text-disabled")}>
                Llegaste al máximo de {MAX_CARS} vehículos
              </span>
            ) : (
              <Link href="/perfil/garage/nuevo" className={buttonClass("secondary")}>
                <Icon icon={Add01Icon} className="size-[18px]" strokeWidth={2} />
                Agregar vehículo
              </Link>
            )}
          </>
        )}
      </main>
    </div>
  )
}
