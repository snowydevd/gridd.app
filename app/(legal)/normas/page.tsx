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
          <li>Encuentros y exposiciones de autos y motos.</li>
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

        <h2>Fotos y portadas</h2>
        <p>
          Vale para la portada de un evento y para tu foto de perfil, que se ve
          en el listado de asistentes. No se suben:
        </p>
        <ul>
          <li>
            Contenido sexual, desnudos o fotos +18 (NSFW), aunque sea
            &ldquo;en joda&rdquo; o esté tapado a medias.
          </li>
          <li>Violencia explícita, sangre, accidentes con heridos o gore.</li>
          <li>Símbolos de odio, armas o drogas.</li>
          <li>
            Imágenes que muestren o festejen picadas, quemadas en la calle o
            maniobras peligrosas, aunque el evento en sí sea legal.
          </li>
          <li>
            Fotos que promuevan tomar alcohol en un evento al que se va
            manejando.
          </li>
          <li>
            Fotos de personas que se puedan reconocer, si no te dieron permiso,
            y menos si son menores.
          </li>
          <li>
            Logos, flyers o fotos de otros (un club, una marca, un fotógrafo)
            sin su permiso.
          </li>
        </ul>

        <h2>Perfiles y trato entre usuarios</h2>
        <ul>
          <li>
            Usá tu nombre o tu apodo de la escena. No te hagas pasar por otra
            persona, un club, una marca o el equipo de Gridd.
          </li>
          <li>
            Nombres o fotos de perfil ofensivos se cambian o se bajan.
          </li>
          <li>
            Nada de acosar, amenazar o escrachar a otro usuario: ni en un
            evento, ni con su foto, ni con la matrícula de su auto.
          </li>
          <li>
            No publiques datos de otros: teléfono, dirección, matrícula o
            dónde guarda el auto.
          </li>
          <li>
            El garage es para tus autos. Venderlos o venderle repuestos a la
            gente que va a los eventos no es para acá.
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
            <strong>Primera vez, caso dudoso:</strong> bajamos el evento o la
            foto y te escribimos explicando por qué.
          </li>
          <li>
            <strong>Foto o portada +18, violenta o de odio:</strong> la bajamos
            sin aviso. Si se repite, la cuenta se bloquea.
          </li>
          <li>
            <strong>Acoso o escrache a otro usuario:</strong> cuenta suspendida
            mientras lo revisamos.
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
          <a href={`mailto:${site.emails.moderacion}`}>
            {site.emails.moderacion}
          </a>
          . Lo
          mira una persona.
        </p>

        <h2>Cómo reportar</h2>
        <p>
          Cada evento y cada perfil tiene un botón de reporte: elegís el motivo
          (spam, falso, ofensivo u otro) y podés agregar un comentario. Si
          contás que es una picada o que hay riesgo para terceros, lo revisamos
          primero. Para reportar hace falta estar con tu cuenta, y quien recibe
          el reporte no sabe quién lo mandó.
        </p>
        <p>
          El detalle de responsabilidades está en los{" "}
          <Link href="/terminos">términos de uso</Link>.
        </p>
      </Prose>
    </LegalShell>
  )
}
