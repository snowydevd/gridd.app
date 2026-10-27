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
// analytics (GRI-26) antes del lanzamiento. Confirmar con un abogado la
// transferencia internacional (ley 18.331) y en qué país está cada proveedor.
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
          <a href={`mailto:${site.emails.privacidad}`}>
            {site.emails.privacidad}
          </a>
          . La
          operación se rige por la ley de protección de datos personales de{" "}
          {site.jurisdiction}.
        </p>

        <h2>2. Qué datos guardamos</h2>
        <ul>
          <li>
            <strong>Cuenta:</strong> mail, nombre visible y, si la cargás, foto
            de perfil. Si entrás con Google o Apple, recibimos de ese servicio
            tu nombre, tu mail y, si la tenés, tu foto. Si entrás con mail y
            contraseña, la guardamos como un hash: ni nosotros podemos verla.
          </li>
          <li>
            <strong>Perfil:</strong> los autos que cargás en el garage (marca,
            modelo, versión, año y si está modificado), los tipos de evento que
            te interesan y el radio de &ldquo;Cerca tuyo&rdquo;.
          </li>
          <li>
            <strong>Actividad:</strong> los eventos que guardás, los que marcás
            con &ldquo;Voy&rdquo; y los organizadores que seguís.
          </li>
          <li>
            <strong>Eventos:</strong> todo lo que escribís al publicar —
            título, descripción, fecha, lugar, ubicación y portada.
          </li>
          <li>
            <strong>Pedido de organizador:</strong> el mensaje que mandás al
            pedir permiso para publicar.
          </li>
          <li>
            <strong>Reportes:</strong> el motivo y el texto que mandás al
            reportar un evento o un perfil, junto con la cuenta que lo mandó.
          </li>
          <li>
            <strong>Ubicación:</strong> la app te pide permiso para usar la
            ubicación del teléfono al mostrarte el mapa y al marcar el lugar de
            un evento que publicás. La usamos en el momento; no guardamos dónde
            estás.
          </li>
          <li>
            <strong>Lista de organizadores en gridd.app:</strong> si te anotás
            antes del lanzamiento, tu usuario de Instagram, los tipos de evento
            que hacés y cuánta gente suelen juntar.
          </li>
          <li>
            <strong>Beta de la app:</strong> si te anotás en gridd.app/testers,
            tu mail y si tenés Android o iPhone, para avisarte cuando puedas
            probarla.
          </li>
          <li>
            <strong>Uso de la app:</strong> métricas agregadas de pantallas
            vistas.
          </li>
          <li>
            <strong>Anuncios:</strong> la app muestra anuncios de Google AdMob,
            que usan el identificador de publicidad de tu teléfono. El detalle
            está en la sección 6.
          </li>
        </ul>
        <p>
          No pedimos ni guardamos datos de tarjetas: en Gridd no se cobra nada.
        </p>

        <h2>3. Para qué los usamos</h2>
        <ul>
          <li>Mostrar los eventos y que se puedan buscar.</li>
          <li>
            Ordenarte los eventos por cercanía y por lo que te interesa.
          </li>
          <li>Identificarte para que puedas editar y borrar lo tuyo.</li>
          <li>
            Mandarte los mails de la cuenta, como el código para recuperar la
            contraseña.
          </li>
          <li>
            Contactar a los organizadores que se anotaron en gridd.app cuando
            abramos.
          </li>
          <li>Moderar: revisar reportes y bajar lo que rompe las reglas.</li>
          <li>Entender qué se usa y qué no, para mejorarlo.</li>
          <li>Mostrar anuncios, que es lo que permite que Gridd sea gratis.</li>
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
        <p>Lo que ven otros usuarios de la app:</p>
        <ul>
          <li>Tu nombre visible y tu foto de perfil.</li>
          <li>Tu auto principal del garage.</li>
          <li>
            A qué eventos vas: el listado de asistentes de cada evento muestra
            el nombre y la foto de quienes marcaron &ldquo;Voy&rdquo;.
          </li>
          <li>Quiénes siguen a cada organizador.</li>
        </ul>
        <p>
          No es público: tu mail, el resto de tus autos, tus intereses, los
          eventos que guardás ni tus reportes.
        </p>

        <h2>5. Con quién los compartimos</h2>
        <p>
          Con los proveedores que hacen funcionar el servicio, sólo para eso:
        </p>
        <ul>
          <li>
            <strong>Convex:</strong> base de datos, archivos (fotos y portadas)
            y autenticación.
          </li>
          <li>
            <strong>Cloudflare:</strong> este sitio y el reenvío de los mails
            que nos mandás.
          </li>
          <li>
            <strong>Resend:</strong> el envío de los mails de la cuenta.
          </li>
          <li>
            <strong>Google o Apple:</strong> sólo si elegís entrar con ellos.
          </li>
          <li>
            <strong>Google AdMob:</strong> los anuncios de la app (ver la
            sección 6).
          </li>
        </ul>
        <p>
          Estos proveedores tienen sus servidores fuera de {site.jurisdiction},
          así que tus datos se guardan y procesan en el exterior, con las
          garantías que piden sus propios términos. No vendemos tus datos de
          cuenta, de perfil ni de actividad a nadie, y no se los damos a
          anunciantes. También podemos entregar información cuando nos la
          requiera una autoridad competente por la vía que corresponda.
        </p>

        <h2>6. Anuncios</h2>
        <p>
          Gridd es gratis porque la app muestra anuncios de Google AdMob: un
          banner arriba de algunas pantallas y algunas tarjetas marcadas como
          &ldquo;Publicidad&rdquo; entre los eventos. No hay anuncios a pantalla
          completa, ni con video o sonido.
        </p>
        <p>
          Por defecto los anuncios son <strong>personalizados</strong>: Google
          usa el identificador de publicidad de tu teléfono, datos del
          dispositivo y tu ubicación aproximada para elegir qué mostrarte. Gridd
          no le pasa a Google tu mail, tu nombre ni lo que hacés en la app.
        </p>
        <p>Si no querés anuncios personalizados:</p>
        <ul>
          <li>
            En la app: Perfil → cuenta → &ldquo;Anuncios personalizados&rdquo;
            → No. Vas a seguir viendo anuncios, pero no personalizados.
          </li>
          <li>
            En Android: Configuración → Google → Anuncios, donde podés borrar o
            desactivar el identificador de publicidad.
          </li>
        </ul>
        <p>
          Si estás en una región donde la ley lo exige, la app te pide el
          consentimiento la primera vez y podés cambiarlo después desde Perfil.
          Cómo usa Google estos datos:{" "}
          <a href="https://policies.google.com/technologies/ads">
            policies.google.com/technologies/ads
          </a>
          .
        </p>

        <h2>7. Cuánto tiempo</h2>
        <ul>
          <li>
            Datos de cuenta, perfil y actividad: mientras la cuenta exista.
          </li>
          <li>
            Lista de organizadores de gridd.app: hasta el lanzamiento y el
            primer contacto, o hasta que pidas que la borremos.
          </li>
          <li>
            Lista de la beta: hasta que termine la beta, o hasta que pidas que
            la borremos.
          </li>
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

        <h2>8. Tus derechos</h2>
        <p>
          Podés pedir acceso a tus datos, corregirlos, borrarlos u oponerte a
          que los usemos. Se hace escribiendo a{" "}
          <a href={`mailto:${site.emails.privacidad}`}>
            {site.emails.privacidad}
          </a>{" "}
          desde
          el mail de tu cuenta; respondemos dentro de los 10 días hábiles. El
          detalle de cómo pedir una baja está en{" "}
          <Link href="/contacto">contacto</Link>.
        </p>

        <h2>9. Cookies</h2>
        <p>
          Este sitio no usa cookies de sesión: la cuenta vive en la app, que
          guarda la sesión en tu teléfono. Las métricas de uso del sitio, si las
          hay, son anónimas y agregadas: no te siguen entre sitios ni apps. Los
          anuncios de la app se explican en la sección 6.
        </p>

        <h2>10. Menores</h2>
        <p>
          Gridd no está pensado para menores de 18 años y no pedimos datos a
          sabiendas de que lo son. Si detectamos una cuenta de un menor, la
          damos de baja.
        </p>

        <h2>11. Cambios</h2>
        <p>
          Si cambiamos esta política actualizamos la fecha de arriba y, cuando
          el cambio sea relevante, lo avisamos en la app.
        </p>
      </Prose>
    </LegalShell>
  )
}
