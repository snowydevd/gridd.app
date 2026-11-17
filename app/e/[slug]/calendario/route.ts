import { getEvent } from "@/lib/convex"
import { site } from "@/lib/site"

/**
 * "Agregar al calendario" en la web: un .ics del evento. En iPhone, Safari lo abre con "Agregar" al
 * Calendario; en la app es el formulario del calendario del sistema (expo-calendar).
 */
const utc = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")

/** Texto de un campo .ics: barras, comas, punto y coma y saltos de línea escapados. */
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n")

/** Líneas de más de 75 octetos se pliegan (RFC 5545). */
function fold(line: string) {
  const out: string[] = []
  let rest = line
  while (rest.length > 73) {
    out.push(rest.slice(0, 73))
    rest = " " + rest.slice(73)
  }
  out.push(rest)
  return out.join("\r\n")
}

export async function GET(_request: Request, { params }: RouteContext<"/e/[slug]/calendario">) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event || event.status !== "published") return new Response("No encontramos el evento.", { status: 404 })

  const url = `${site.url}/e/${slug}`
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gridd//Encuentros//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event._id}@gridd.app`,
    `DTSTAMP:${utc(Date.now())}`,
    `DTSTART:${utc(event.startsAt)}`,
    `DTEND:${utc(event.endsAt)}`,
    `SUMMARY:${esc(event.title)}`,
    `LOCATION:${esc(event.placeName)}`,
    `GEO:${event.lat};${event.lon}`,
    `DESCRIPTION:${esc(event.description ? `${event.description}\n\n${url}` : url)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n")

  return new Response(ics + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="gridd-${slug}.ics"`,
      "Cache-Control": "no-store",
    },
  })
}
