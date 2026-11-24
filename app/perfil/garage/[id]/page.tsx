import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { CarForm } from "@/components/app/car-form"
import { buttonClass, ScreenHeader, text } from "@/components/app/ui"
import { getViewer, query, type Car } from "@/lib/convex"
import { loginUrl, pageToken } from "@/lib/session"
import { vehicleNoun, vehicleType } from "@/lib/vehicle-icons"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Vehículo", robots: { index: false } }

/** `/perfil/garage/nuevo` agrega un auto; `/perfil/garage/<id>` edita uno (mobile/src/app/garage/[id].tsx). */
export default async function CarPage({ params }: PageProps<"/perfil/garage/[id]">) {
  const { id } = await params
  const path = `/perfil/garage/${id}`
  const token = await pageToken(path)
  const viewer = await getViewer(token)
  if (!token || !viewer) redirect(loginUrl(path))

  const isNew = id === "nuevo"
  const car = isNew ? null : ((await query<Car[]>("cars:listMine", {}, token)).find((c) => c._id === id) ?? null)

  return (
    <div className="flex min-h-dvh flex-col">
      <ScreenHeader title={isNew ? "Nuevo vehículo" : `Editar ${car ? vehicleNoun(vehicleType(car)) : "vehículo"}`} icon="close" fallback="/perfil/garage" />
      {!isNew && !car ? (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className={cn(text.body, "text-muted-foreground")}>Este vehículo ya no está en tu garage.</p>
          <Link href="/perfil/garage" className={buttonClass("secondary")}>
            Volver
          </Link>
        </main>
      ) : (
        <CarForm car={car} currentYear={new Date().getFullYear()} />
      )}
    </div>
  )
}
