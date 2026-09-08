import type { Metadata } from "next"

import { KitchenSink } from "./kitchen-sink"

export const metadata: Metadata = {
  title: "Kitchen sink · GRIDD",
  description: "Todos los primitivos de Gridd en sus estados.",
  robots: { index: false, follow: false },
}

export default function KitchenSinkPage() {
  return <KitchenSink />
}
