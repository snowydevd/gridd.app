import type { Metadata } from "next"
import Link from "next/link"

import { LegalShell } from "@/components/legal/legal-shell"
import { Prose } from "@/components/legal/prose"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Términos de uso",
  description:
    "Las reglas de uso de Gridd: qué se puede publicar, qué no, y qué pasa cuando alguien se pasa de la raya.",
  path: "/terminos",
})

// TODO(GRI-25): texto redactado por el equipo, falta revisión de un abogado
// antes del lanzamiento. Los puntos 5, 9 y 10 son los sensibles.
export default function TerminosPage() {
  return (
    <LegalShell
      title="Términos de uso"
      description="Qué podés hacer en Gridd, qué no, y qué pasa si alguien se pasa de la raya."
    >
      <Prose>
        <h2>1. Qué es Gridd</h2>
        <p>
          Gridd es un tablón donde cualquiera puede encontrar, y los
          organizadores aprobados pueden publicar, encuentros fierreros: rodadas, expos, cars &amp; coffee, salidas y fechas de
          pista. Gridd <strong>no organiza ninguno de esos eventos</strong>: los
          publica quien los organiza, y es esa persona la responsable de lo que
          pasa antes, durante y después.
        </p>
        <p>
          Usar la app, publicar un evento o crear una cuenta implica aceptar
          estos términos y la{" "}
          <Link href="/privacidad">política de privacidad</Link>.
        </p>

        <h2>2. Quién puede usarlo</h2>
        <ul>
          <li>
            Tenés que ser mayor de 18 años para crear una cuenta. Ver la
            sección de menores de la{" "}
            <Link href="/privacidad">política de privacidad</Link>.
          </li>
          <li>
            Los datos de tu cuenta tienen que ser tuyos y reales. Una cuenta por
            persona.
          </li>
          <li>
            Sos responsable de lo que se haga desde tu cuenta, así que cuidá el
            acceso.
          </li>
        </ul>

        <h2>3. Qué podés publicar</h2>
        <p>
          Para publicar eventos tenés que pedir ser organizador desde la app.
          Lo aprueba una persona del equipo, y podemos quitar ese permiso si no
          se cumplen estos términos o las{" "}
          <Link href="/normas">normas de la comunidad</Link>.
        </p>
        <p>
          Se publican eventos reales, con fecha, hora y lugar concretos, que
          puedas organizar o de los que tengas autorización para difundir. La
          información tiene que ser exacta: si cambia la fecha o el lugar,
          actualizá el evento o bajalo.
        </p>
        <p>
          Cualquier cuenta puede además subir una foto de perfil, cargar sus
          autos en el garage, marcar que va a un evento y seguir a
          organizadores. Todo eso también tiene que cumplir estas reglas.
        </p>

        <h2>4. Qué no podés publicar</h2>
        <ul>
          <li>
            <strong>
              Picadas, carreras o competencias de velocidad en la vía pública.
            </strong>{" "}
            Sin vueltas y sin excepciones. Los detalles están en las{" "}
            <Link href="/normas">normas de la comunidad</Link>.
          </li>
          <li>
            Convocatorias a maniobras peligrosas en calle: derrapes, caballitos,
            cortes de tránsito, quemadas.
          </li>
          <li>
            Eventos que no existen, duplicados, o publicados para hacer spam o
            vender algo.
          </li>
          <li>
            Contenido que discrimine, acose o incite a la violencia contra una
            persona o un grupo.
          </li>
          <li>Material sobre el que no tenés derechos: fotos, logos, videos.</li>
          <li>
            Portadas o fotos de perfil con contenido sexual, desnudos o +18
            (NSFW), violencia explícita, símbolos de odio, armas o drogas.
          </li>
          <li>
            Fotos de personas reconocibles sin su permiso, o datos de terceros
            como teléfonos, direcciones o matrículas.
          </li>
          <li>
            Perfiles que se hagan pasar por otra persona, un club, una marca o
            el equipo de Gridd.
          </li>
          <li>Cualquier cosa que sea delito en {site.jurisdiction}.</li>
        </ul>
        <p>
          El detalle de qué se acepta en fotos y perfiles está en las{" "}
          <Link href="/normas">normas de la comunidad</Link>.
        </p>

        <h2>5. Moderación</h2>
        <p>
          Revisamos lo que se reporta y también lo que nos llama la atención por
          nuestra cuenta. Si un evento, una foto o un perfil rompe estas reglas
          podemos bajarlo o cambiarlo sin aviso previo, quitar el permiso de
          organizador, y si el patrón se repite, suspender o bloquear la
          cuenta. Cuando corresponda, avisamos a la autoridad competente.
        </p>
        <p>
          Cada evento y cada perfil tiene un botón de reporte. Los reportes que
          hablan de picadas o de riesgo para terceros se miran primero.
        </p>
        <p>
          Si creés que bajamos algo por error, escribinos a{" "}
          <a href={`mailto:${site.emails.moderacion}`}>
            {site.emails.moderacion}
          </a>{" "}
          y lo
          revisamos.
        </p>

        <h2>6. Tu contenido</h2>
        <p>
          Lo que publicás sigue siendo tuyo. Al subirlo nos das permiso para
          mostrarlo dentro de Gridd y en las vistas previas que se generan al
          compartir un evento en redes o mensajería, incluida la historia de
          Instagram que arma el botón compartir con la portada del evento. Ese
          permiso termina cuando borrás el contenido, salvo por las copias que
          puedan quedar en respaldos técnicos por un tiempo acotado.
        </p>
        <p>
          Tu nombre visible, tu foto de perfil y tu auto principal se muestran
          a otros usuarios, por ejemplo en el listado de asistentes de un
          evento. Qué es público y qué no está en la{" "}
          <Link href="/privacidad">política de privacidad</Link>.
        </p>

        <h2>7. Tu cuenta</h2>
        <p>
          Podés borrar tu cuenta y tus eventos cuando quieras, desde el perfil o
          escribiéndonos. Ver{" "}
          <Link href="/contacto">contacto y bajas</Link>.
        </p>

        <h2>8. Uso indebido</h2>
        <ul>
          <li>
            Nada de bots, scraping o copiar en masa los eventos o los perfiles.
          </li>
          <li>
            Nada de cuentas falsas o duplicadas para inflar asistentes,
            seguidores o reportes.
          </li>
          <li>
            Gridd no es un lugar para vender autos ni repuestos, ni para mandar
            publicidad a quienes van a un evento.
          </li>
          <li>
            No intentes entrar a cuentas ajenas ni romper o saturar el servicio.
          </li>
        </ul>

        <h2>9. Responsabilidad</h2>
        <p>
          Gridd es un tablón, no un organizador. No verificamos previamente cada
          evento, no controlamos quién asiste y no participamos de lo que ocurra
          en el lugar. Ir a un evento es una decisión tuya y el riesgo es tuyo.
        </p>
        <p>
          En la medida en que la ley lo permita, Gridd no responde por daños,
          pérdidas ni lesiones derivadas de un evento publicado en la
          plataforma, ni por la conducta de organizadores o asistentes.
        </p>
        <p>
          El servicio se ofrece &ldquo;tal cual está&rdquo;. Hacemos lo posible
          para que ande bien, pero no garantizamos disponibilidad continua ni
          ausencia de errores.
        </p>

        <h2>10. Cambios y ley aplicable</h2>
        <p>
          Podemos actualizar estos términos. Cuando el cambio sea relevante lo
          avisamos en la app; la fecha de arriba siempre dice cuándo fue la
          última revisión. Seguir usando Gridd después de un cambio implica
          aceptarlo.
        </p>
        <p>
          Estos términos se rigen por las leyes de {site.jurisdiction} y
          cualquier conflicto se resuelve ante sus tribunales.
        </p>

        <h2>11. Contacto</h2>
        <p>
          Dudas y bajas:{" "}
          <a href={`mailto:${site.emails.soporte}`}>{site.emails.soporte}</a>.
          Reportes y reclamos por moderación:{" "}
          <a href={`mailto:${site.emails.moderacion}`}>
            {site.emails.moderacion}
          </a>
          . Todas las casillas están en{" "}
          <Link href="/contacto">contacto</Link>.
        </p>
      </Prose>
    </LegalShell>
  )
}
