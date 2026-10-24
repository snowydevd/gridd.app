import type { Metadata } from "next"
import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { WaitlistForm } from "@/components/waitlist/waitlist-form"
import { KIND_LABELS } from "@/lib/convex"
import { site } from "@/lib/site"

// Waitlist de organizadores antes del lanzamiento. El link se reparte por DM de Instagram,
// así que no se indexa ni se enlaza desde la landing.

export const metadata: Metadata = {
  title: "Organizadores",
  description: "Anotá tus encuentros en Gridd antes del lanzamiento.",
  robots: { index: false },
}

export default function OrganizadoresPage() {
  const kinds = Object.entries(KIND_LABELS).map(([value, label]) => ({ value, label }))
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-14 items-center px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Gridd — inicio"
          className="rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Wordmark className="h-3.5 text-foreground" />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-4 pb-10">
        <WaitlistForm kinds={kinds} instagram={site.instagram} />
      </main>
    </div>
  )
}
