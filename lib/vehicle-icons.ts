import { Car01Icon, Motorbike01Icon } from "@hugeicons/core-free-icons"

import type { Car, VehicleType } from "@/lib/convex"

/** El ícono de cada tipo de vehículo del garage (sin `type` es un auto, como en la app). */
export const VEHICLE_ICON = { car: Car01Icon, motorcycle: Motorbike01Icon } as const

export const vehicleType = (car: Pick<Car, "type">): VehicleType => car.type ?? "car"

/** "auto" o "moto", para los textos. */
export const vehicleNoun = (type: VehicleType) => (type === "motorcycle" ? "moto" : "auto")
