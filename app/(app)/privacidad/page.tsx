import type { Metadata } from "next"
import Link from "next/link"

import { LegalShell } from "@/components/legal/legal-shell"
import { Prose } from "@/components/legal/prose"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "Privacidad",
  description:
    "Qué datos guarda Gridd, para qué los usa, con quién los comparte y cómo pedir que los borre.",
  path: "/privacidad",
})

// TODO(GRI-25): revisar contra la implementación real de auth (GRI-11) y de
// analytics (GRI-26) antes del lanzamiento. Hoy describe la intención.
export default function PrivacidadPage() {
  return (
    <LegalShell
      title="Política de privacidad"
      description="Qué guardamos, para qué, y cómo pedís que lo borremos."
    >
      <Prose>
        <h2>1. Quién trata tus datos</h2>
        <p>
          El responsable es el equipo de {site.name}, con contacto en{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. La
          operación se rige por la ley de protección de datos personales de{" "}
          {site.jurisdiction}.
        </p>

        <h2>2. Qué datos guardamos</h2>
        <ul>
          <li>
            <strong>Cuenta:</strong> mail, nombre visible y, si lo cargás, foto
            de perfil.
          </li>
          <li>
            <strong>Eventos:</strong> todo lo que escribís al publicar —
            título, descripción, fecha, lugar y ubicación aproximada.
          </li>
          <li>
            <strong>Reportes:</strong> el motivo y el texto que mandás al
            reportar un evento, junto con la cuenta que lo mandó.
          </li>
          <li>
            <strong>Uso del sitio:</strong> métricas agregadas de páginas
            vistas, sin perfilado ni publicidad.
          </li>
        </ul>
        <p>
          No pedimos ni guardamos datos de tarjetas: en Gridd no se cobra nada.
        </p>

        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Mostrar los eventos y que se puedan buscar.</li>
          <li>Identificarte para que puedas editar y borrar lo tuyo.</li>
          <li>Moderar: revisar reportes y bajar lo que rompe las reglas.</li>
          <li>Entender qué se usa y qué no, para mejorarlo.</li>
        </ul>

        <h2>4. Qué es público</h2>
        <p>
          Todo lo que va en un evento es público, incluido tu nombre visible
          como organizador. La ficha de un evento se puede ver sin cuenta y se
          indexa en buscadores.{" "}
          <strong>
            No pongas tu dirección exacta ni tu teléfono en la descripción si no
            querés que se vean.
          </strong>
        </p>
        <p>Tu mail nunca es público.</p>

        <h2>5. Con quién los compartimos</h2>
        <p>
          Con los proveedores que hacen funcionar el servicio: hosting, base de
          datos y autenticación. Nada de venta ni cesión de datos con fines
          publicitarios. También podemos entregar información cuando nos la
          requiera una autoridad competente por la vía que corresponda.
        </p>

        <h2>6. Cuánto tiempo</h2>
        <ul>
          <li>Datos de cuenta: mientras la cuenta exista.</li>
          <li>Eventos: hasta que los borres o los bajemos por moderación.</li>
          <li>
            Reportes y decisiones de moderación: hasta 12 meses, para poder
            sostener una decisión si la discutís.
          </li>
          <li>
            Respaldos técnicos: hasta 30 días después del borrado, y después se
            pisan solos.
          </li>
        </ul>

        <h2>7. Tus derechos</h2>
        <p>
          Podés pedir acceso a tus datos, corregirlos, borrarlos u oponerte a
          que los usemos. Se hace escribiendo a{" "}
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> desde
          el mail de tu cuenta; respondemos dentro de los 10 días hábiles. El
          detalle de cómo pedir una baja está en{" "}
          <Link href="/contacto">contacto</Link>.
        </p>

        <h2>8. Cookies</h2>
        <p>
          Usamos las cookies necesarias para mantener la sesión iniciada. Las de
          medición, si las hay, son anónimas y agregadas: no te siguen entre
          sitios.
        </p>

        <h2>9. Menores</h2>
        <p>
          Gridd no está pensado para menores de 18 años y no pedimos datos a
          sabiendas de que lo son. Si detectamos una cuenta de un menor, la
          damos de baja.
        </p>

        <h2>10. Cambios</h2>
        <p>
          Si cambiamos esta política actualizamos la fecha de arriba y, cuando
          el cambio sea relevante, lo avisamos en el sitio.
        </p>
      </Prose>
    </LegalShell>
  )
}
