import type { Metadata } from "next"
import Link from "next/link"

import { LegalShell } from "@/components/legal/legal-shell"
import { PicadasNotice } from "@/components/legal/picadas-notice"
import { Prose } from "@/components/legal/prose"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Normas de la comunidad",
  description:
    "Gridd no admite picadas ni carreras en la vía pública. Qué sí se puede publicar, qué no, y qué pasa si alguien insiste.",
  path: "/normas",
})

export default function NormasPage() {
  return (
    <LegalShell
      title="Normas de la comunidad"
      description="Una sola regla dura y algunas de sentido común. Esta página es la que manda cuando moderamos."
    >
      <PicadasNotice className="max-w-prose" />
      <Prose>
        <h2>La regla dura</h2>
        <p>
          <strong>
            En Gridd no se publican picadas ni carreras de velocidad en la vía
            pública.
          </strong>{" "}
          Tampoco convocatorias a maniobras peligrosas en calle: derrapes,
          caballitos, quemadas, cortes de tránsito, caravanas que ocupan la
          calzada.
        </p>
        <p>
          No es una postura moral, es la línea que nos separa de ser cómplices:
          en la calle no hay control, no hay asistencia médica y no hay ambiente
          cerrado. Alguien termina lastimado y suele no ser el que maneja.
        </p>

        <h2>Qué sí</h2>
        <ul>
          <li>Junadas, encuentros y exposiciones de autos y motos.</li>
          <li>Rodadas y salidas grupales que respetan las reglas de tránsito.</li>
          <li>
            Tandas, fechas y competencias en autódromos, kartódromos, pistas de
            aceleración y predios habilitados.
          </li>
          <li>Talleres, charlas, ferias de repuestos y eventos de club.</li>
          <li>Actividades solidarias fierreras.</li>
        </ul>

        <h2>Qué no</h2>
        <ul>
          <li>
            Picadas, &ldquo;piques&rdquo; o competencias de velocidad fuera de
            un circuito habilitado, aunque el aviso no use esas palabras.
          </li>
          <li>
            Eventos con el punto de encuentro escondido o entregado sólo por
            privado para esquivar la moderación.
          </li>
          <li>Convocatorias a maniobras peligrosas o a bloquear el tránsito.</li>
          <li>Eventos inventados, duplicados o repetidos para ganar visibilidad.</li>
          <li>Publicidad disfrazada de evento.</li>
          <li>
            Insultos, hostigamiento o contenido que discrimine a una persona o a
            un grupo.
          </li>
        </ul>

        <h2>Si sos organizador</h2>
        <ul>
          <li>
            Poné el lugar real. Si el evento es en un predio habilitado,
            nombralo: ayuda a que no lo confundan con otra cosa.
          </li>
          <li>
            Si cambia la fecha o el lugar, editá el evento. Si se cancela,
            bajalo.
          </li>
          <li>
            Sos responsable de lo que convocás. Gridd sólo lo publica.
          </li>
        </ul>

        <h2>Qué pasa cuando algo rompe las normas</h2>
        <ul>
          <li>
            <strong>Primera vez, caso dudoso:</strong> bajamos el evento y te
            escribimos explicando por qué.
          </li>
          <li>
            <strong>Picada explícita:</strong> baja inmediata y cuenta
            bloqueada. Sin advertencia previa.
          </li>
          <li>
            <strong>Reincidencia:</strong> cuenta bloqueada de forma permanente.
          </li>
          <li>
            Cuando hay riesgo concreto para terceros, damos aviso a la autoridad
            competente.
          </li>
        </ul>
        <p>
          Si te bajamos algo y creés que fue un error, escribinos a{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Lo
          mira una persona.
        </p>

        <h2>Cómo reportar</h2>
        <p>
          Cada evento tiene un botón de reporte con motivos predefinidos. Los
          reportes por picadas y por riesgo a terceros se revisan primero. No
          hace falta cuenta para reportar y el reporte es anónimo para el
          organizador.
        </p>
        <p>
          El detalle de responsabilidades está en los{" "}
          <Link href="/terminos">términos de uso</Link>.
        </p>
      </Prose>
    </LegalShell>
  )
}
