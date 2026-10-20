import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Add01Icon,
  Bookmark02Icon,
  Calendar03Icon,
  Cancel01Icon,
  Car01Icon,
  Edit02Icon,
  Flag02Icon,
  Location01Icon,
  MapsIcon,
  Navigation03Icon,
  Share08Icon,
  SparklesIcon,
  Tick02Icon,
  UserGroupIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import heroBg from "@/public/gridd-bg.jpeg"
import eventShot from "@/public/screens/evento.jpeg"
import garageShot from "@/public/screens/garage.jpeg"
import homeShot from "@/public/screens/inicio.jpeg"

import { InlineScript } from "@/components/inline-script"
import { GridLines } from "@/components/landing/grid-lines"
import { IntroCurtain } from "@/components/landing/intro-curtain"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingNav } from "@/components/landing/landing-nav"
import { MapMock, NearbyMock, PublishMock, TasteMock } from "@/components/landing/mocks"
import { PhoneShot } from "@/components/landing/phone-shot"
import { Reveal } from "@/components/landing/reveal"
import {
  CONTAINER,
  EYEBROW,
  H2,
  IconTile,
  Section,
  SectionHeader,
} from "@/components/landing/section"
import { StoreButtons } from "@/components/landing/store-buttons"
import { site } from "@/lib/site"
import { cn } from "@/lib/utils"

// La landing mantiene su título propio: no lleva el sufijo del template.
export const metadata: Metadata = {
  title: { absolute: "GRIDD — Encuentros fierreros de Uruguay" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "GRIDD",
    locale: "es_UY",
    type: "website",
    title: "GRIDD — Encuentros fierreros de Uruguay",
    description: site.description,
    url: "/",
  },
}

const facts = [
  { value: "Gratis", label: "Sin publicidad" },
  { value: "19", label: "Departamentos" },
  { value: "Sin cuenta", label: "Para mirar" },
  { value: "0", label: "Picadas" },
] as const

const kinds = [
  "Junadas",
  "Rodadas",
  "Cars & Coffee",
  "Expos",
  "Clásicos",
  "JDM",
  "VAG",
  "Tuning",
  "4x4",
  "Motos",
  "Fechas de pista",
] as const

const steps = [
  {
    n: "01",
    icon: Navigation03Icon,
    title: "Elegí tu radio",
    body: "Decile hasta dónde manejás. Inicio te muestra el próximo encuentro y los que van con lo tuyo. Sin cuenta y sin vueltas.",
  },
  {
    n: "02",
    icon: Calendar03Icon,
    title: "Abrí la ficha",
    body: "Fecha, horario, lugar, a cuántos km te queda y cuántos van. Todo lo que precisás para decidir.",
  },
  {
    n: "03",
    icon: Bookmark02Icon,
    title: "Guardalo y pasalo",
    body: "Guardalo en tu lista y mandalo al grupo de WhatsApp con un toque.",
  },
  {
    n: "04",
    icon: Car01Icon,
    title: "Llegá con tu auto",
    body: "Cómo llegar te abre el mapa con el destino puesto. Del resto te encargás vos.",
  },
] as const

const fichaDetails = [
  { icon: Calendar03Icon, title: "Fecha y horario", body: "El día, a qué hora arranca y a qué hora termina." },
  { icon: Location01Icon, title: "Lugar y distancia", body: "La dirección y a cuántos km te queda desde donde estás." },
  { icon: UserGroupIcon, title: "Cuántos van", body: "Para saber de antemano qué tan grande se pone." },
  { icon: MapsIcon, title: "Mapa y Cómo llegar", body: "Lo ves en el mapa y con un toque arrancás la ruta." },
  { icon: Share08Icon, title: "Guardar y compartir", body: "Tenelo a mano o pasalo a tu grupo con la foto y los datos." },
  { icon: Flag02Icon, title: "Reportar", body: "Si algo no cierra, avisá. No hace falta cuenta y es anónimo." },
] as const

const garageFacts = [
  { value: "10", label: "autos por perfil" },
  { value: "Marca, modelo y año", label: "para cada uno" },
  { value: "Modificado", label: "para los que tienen mano encima" },
  { value: "Tu perfil", label: "donde queda todo a la vista" },
] as const

const organizerSteps = [
  {
    icon: Add01Icon,
    title: "Cargalo en un momento",
    body: "Título, categoría, fecha, horario, lugar y una foto de portada. Nada más.",
  },
  {
    icon: Share08Icon,
    title: "Pasá el link",
    body: "Cada evento tiene su ficha con link propio para mandar a grupos y redes.",
  },
  {
    icon: Edit02Icon,
    title: "Mantenelo al día",
    body: "Si cambia la fecha o el lugar, editalo. Si se cancela, bajalo.",
  },
] as const

const allowed = [
  "Junadas, encuentros y exposiciones de autos y motos",
  "Rodadas y salidas grupales que respetan el tránsito",
  "Tandas y fechas en autódromos y predios habilitados",
  "Talleres, charlas, ferias de repuestos y eventos de club",
] as const

const forbidden = [
  "Picadas o piques fuera de un circuito habilitado",
  "Derrapes, quemadas, caballitos o cortes de tránsito",
  "Puntos de encuentro escondidos o pasados por privado",
  "Eventos inventados, duplicados o publicidad disfrazada",
] as const

const faqs = [
  {
    q: "¿Cuánto sale?",
    a: "Nada. Gridd es gratis y no tiene publicidad.",
  },
  {
    q: "¿Necesito cuenta?",
    a: "Para mirar, no: abrís la app y ya ves lo que hay cerca. Con cuenta guardás encuentros, armás tu garage y podés publicar los tuyos.",
  },
  {
    q: "¿Gridd organiza los eventos?",
    a: "No. Gridd es un tablón: cada evento lo publica quien lo organiza, y es esa persona la responsable de lo que pasa antes, durante y después.",
  },
  {
    q: "¿Cómo publico un encuentro?",
    a: "Desde la app, con tu cuenta. Tenés que ser mayor de 18 y el evento tiene que ser real, con fecha, hora y lugar concretos.",
  },
  {
    q: "¿Qué pasa si veo una picada publicada?",
    a: "Reportala desde la ficha. No hace falta cuenta, el organizador no se entera de quién fue y los reportes por picadas se miran primero.",
  },
  {
    q: "¿Cuándo sale?",
    a: "Muy pronto en Google Play y App Store. Apenas esté, la vas a poder bajar desde acá.",
  },
] as const

const CARD = "rounded-3xl border border-border bg-card"

export default function Home() {
  return (
    <>
      {/* Corre antes de pintar: evita que el contenido aparezca y recién
          después se esconda para animarse, y prende la cortina de entrada.
          El failsafe es importante: si React nunca hidrata, el controlador de
          la cortina no existe y sin esto quedaría el scroll bloqueado detrás
          de una portada que no se mueve más. */}
      <InlineScript
        html='(function(){try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("js-anim");d.setAttribute("data-intro","play");setTimeout(function(){if(!d.dataset.hydrated){d.classList.remove("js-anim");d.setAttribute("data-intro","skip")}},2500)}catch(e){}})()'
      />

      <LandingNav />

      <main className="relative flex flex-1 flex-col">
        <IntroCurtain />

        {/* ---------------- La app ---------------- */}
        <section id="app" className="relative overflow-hidden border-t border-border pt-24 pb-16 sm:pb-20 lg:pt-28">
          {/* Foto de un meet de fondo, oscurecida para que el texto se lea:
              más negro a la izquierda (título) y fundido abajo con la página. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image
              src={heroBg}
              alt=""
              fill
              sizes="100vw"
              placeholder="blur"
              loading="eager"
              className="object-cover object-center opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-background/30" />
            <div className="absolute inset-0 bg-linear-to-b from-background/40 via-transparent to-background" />
          </div>
          <GridLines />
          <div
            className={cn(
              "relative grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8",
              CONTAINER
            )}
          >
            <div className="flex flex-col gap-7">
              <Reveal>
                <p className={EYEBROW}>La app fierrera de Uruguay</p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-[clamp(2.4rem,5.6vw,4.5rem)] leading-[0.95] tracking-[-0.02em] text-balance">
                  Todos los encuentros fierreros de Uruguay, en un solo lugar.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="max-w-lg text-base leading-7 text-muted-foreground">
                  Junadas, rodadas, expos, cars &amp; coffee y fechas de pista.
                  Gridd te muestra lo que pasa cerca tuyo, con fecha, lugar y
                  cómo llegar, para que no te enteres por una historia cuando
                  ya terminó.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <StoreButtons />
              </Reveal>
              <Reveal delay={320}>
                <dl className="grid grid-cols-2 gap-y-5 border-t border-border pt-6 sm:grid-cols-4">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex flex-col-reverse gap-1 border-border pr-4 sm:border-l sm:pl-4 sm:first:border-l-0 sm:first:pl-0"
                    >
                      <dt className="text-[0.66rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                        {fact.label}
                      </dt>
                      <dd className="font-heading text-xl font-extrabold uppercase">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <div className="relative mx-auto w-full max-w-[480px]">
                <PhoneShot
                  src={eventShot}
                  alt=""
                  className="absolute top-14 right-0 hidden w-[56%] max-w-none rotate-[5deg] opacity-70 sm:block"
                />
                <PhoneShot
                  src={homeShot}
                  alt="Inicio de Gridd: el próximo encuentro destacado, la lista Para vos y las tarjetas para completar la cuenta."
                  priority
                  className="relative z-10 w-[72%] max-w-[300px] sm:mx-0 sm:w-[62%]"
                />
                <div
                  aria-hidden
                  className="absolute right-0 bottom-10 z-20 hidden items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:flex"
                >
                  <IconTile icon={UserGroupIcon} className="size-9 rounded-xl" />
                  <span className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">95 van</span>
                    <span className="text-xs text-muted-foreground">Euro Meet &amp; Dyno · 21 km</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Cinta de tipos ---------------- */}
        <div className="relative overflow-hidden border-t border-border bg-card py-5">
          <p className="sr-only">Tipos de encuentro: {kinds.join(", ")}.</p>
          <div aria-hidden className="marquee flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0 items-center"
              >
                {kinds.map((kind) => (
                  <li
                    key={kind}
                    className="flex items-center gap-8 pr-8 font-heading text-lg font-extrabold whitespace-nowrap uppercase sm:text-xl"
                  >
                    {kind}
                    <span className="size-1.5 rounded-full bg-brand" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* ---------------- Funciones ---------------- */}
        <Section id="funciones">
          <SectionHeader
            eyebrow="Qué hace Gridd"
            title="Todo lo que precisás para no perderte la próxima."
          >
            Hoy los encuentros están desparramados entre grupos de WhatsApp,
            historias y flyers. Gridd los junta en una sola app, ordenados por
            fecha y por cercanía.
          </SectionHeader>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            <Reveal className={cn(CARD, "flex flex-col gap-6 p-6 sm:p-7 md:col-span-2 lg:col-span-7 lg:row-span-2")}>
              <div className="flex items-start gap-4">
                <IconTile icon={Location01Icon} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">Lo que hay cerca tuyo</h3>
                  <p className="max-w-md text-sm leading-6 text-muted-foreground">
                    Elegí un radio en km y Gridd te muestra lo que pasa
                    adentro: el próximo encuentro bien grande y abajo los que
                    van con lo tuyo.
                  </p>
                </div>
              </div>
              <div className="flex flex-1 items-center">
                <div className="w-full">
                  <NearbyMock />
                </div>
              </div>
            </Reveal>

            <Reveal delay={80} className={cn(CARD, "flex flex-col gap-5 p-6 sm:p-7 lg:col-span-5")}>
              <div className="flex items-start gap-4">
                <IconTile icon={MapsIcon} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">El mapa fierrero</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Mirá dónde cae cada encuentro y qué tenés cerca, en una
                    pestaña propia.
                  </p>
                </div>
              </div>
              <MapMock />
            </Reveal>

            <Reveal delay={160} className={cn(CARD, "flex flex-col gap-5 p-6 sm:p-7 lg:col-span-5")}>
              <div className="flex items-start gap-4">
                <IconTile icon={SparklesIcon} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">Para vos</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Contale qué te mueve y Gridd te pone primero lo tuyo, sea
                    JDM, clásicos o un cars &amp; coffee de domingo.
                  </p>
                </div>
              </div>
              <TasteMock />
            </Reveal>

            {[
              {
                icon: Bookmark02Icon,
                title: "Guardados",
                body: "Marcá los que te interesan y quedan juntos en su pestaña, a mano para el día del evento.",
              },
              {
                icon: WhatsappIcon,
                title: "Pasalo al grupo",
                body: "Compartí la ficha por WhatsApp o redes: llega con la foto, la fecha y el lugar.",
              },
              {
                icon: Navigation03Icon,
                title: "Cómo llegar",
                body: "Un toque y se abre el mapa con el destino puesto. Nada de copiar direcciones.",
              },
            ].map((feature, i) => (
              <Reveal
                key={feature.title}
                delay={i * 80}
                className={cn(
                  CARD,
                  "flex flex-col gap-4 p-6 sm:p-7 lg:col-span-4",
                  i === 2 && "md:col-span-2 lg:col-span-4"
                )}
              >
                <IconTile icon={feature.icon} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">{feature.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{feature.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ---------------- Cómo funciona ---------------- */}
        <Section id="como-funciona">
          <SectionHeader eyebrow="Cómo funciona" title="Del sillón al encuentro en cuatro pasos.">
            No hace falta registrarse para mirar. La cuenta la creás cuando
            quieras guardar, armar tu garage o publicar.
          </SectionHeader>

          {/* El `gap-px` sobre fondo de borde dibuja las divisiones entre pasos. */}
          <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal
                as="li"
                key={step.n}
                delay={i * 100}
                className="flex flex-col gap-5 bg-background p-6 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-3xl font-extrabold text-brand">{step.n}</span>
                  <HugeiconsIcon
                    icon={step.icon}
                    strokeWidth={1.8}
                    aria-hidden
                    className="size-5 text-muted-foreground"
                  />
                </div>
                <div aria-hidden className="rule-draw h-px w-full bg-border" />
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Section>

        {/* ---------------- La ficha ---------------- */}
        <Section id="eventos">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal delay={120} className="order-last lg:order-first">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute top-1/2 left-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl"
                />
                <PhoneShot
                  src={eventShot}
                  alt="Ficha de un evento en Gridd: foto, categoría, fecha y hora, lugar con la distancia, mapa y el botón Cómo llegar."
                  className="relative"
                />
              </div>
            </Reveal>

            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <Reveal>
                  <p className={EYEBROW}>Cada encuentro, una ficha</p>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className={H2}>Cuándo, dónde y cómo llegar.</h2>
                </Reveal>
                <Reveal delay={160}>
                  <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                    Nada de flyers borrosos ni “¿alguien sabe dónde es?”. Cada
                    evento tiene una ficha con todo lo que importa, siempre
                    igual y siempre al día.
                  </p>
                </Reveal>
              </div>

              <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {fichaDetails.map((detail, i) => (
                  <Reveal as="li" key={detail.title} delay={i * 60} className="flex gap-4">
                    <IconTile icon={detail.icon} />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold">{detail.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{detail.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ---------------- Garage ---------------- */}
        <Section id="garage">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <Reveal>
                  <p className={EYEBROW}>Tu garage</p>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className={H2}>Mostrá con qué llegás.</h2>
                </Reveal>
                <Reveal delay={160}>
                  <p className="max-w-md text-sm leading-7 text-muted-foreground">
                    Cargá tus autos por marca, modelo y año, y marcá los que
                    tienen mano encima. Quedan en tu perfil para que el resto
                    sepa qué traés al próximo encuentro.
                  </p>
                </Reveal>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {garageFacts.map((fact, i) => (
                  <Reveal
                    key={fact.value}
                    delay={i * 60}
                    className={cn(CARD, "flex flex-col-reverse justify-end gap-1 p-5")}
                  >
                    <dt className="text-xs leading-5 text-muted-foreground">{fact.label}</dt>
                    <dd
                      className={cn(
                        "font-semibold",
                        fact.value === "Modificado"
                          ? "self-start rounded-md bg-brand px-2 py-0.5 text-[0.68rem] tracking-[0.12em] text-brand-foreground uppercase"
                          : fact.value === "10"
                            ? "font-heading text-3xl font-extrabold text-brand"
                            : "text-base"
                      )}
                    >
                      {fact.value}
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>

            <Reveal delay={120}>
              <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.75rem] border border-border bg-card p-2 shadow-[0_40px_120px_-40px_color-mix(in_srgb,var(--brand)_25%,transparent)]">
                <Image
                  src={garageShot}
                  alt="Mi garage en Gridd: un Citroën Saxo 2000 marcado como modificado, un BMW Serie 3 2020 y el botón Agregar auto."
                  sizes="(min-width: 1024px) 560px, 92vw"
                  placeholder="blur"
                  className="h-auto w-full rounded-[1.25rem]"
                />
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ---------------- Organizadores ---------------- */}
        <Section id="organizadores" className="bg-card/40">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <Reveal>
                  <p className={EYEBROW}>Para organizadores</p>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className={H2}>¿Armás un encuentro? Publicalo en Gridd.</h2>
                </Reveal>
                <Reveal delay={160}>
                  <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                    Clubes, grupos de amigos, autódromos, cafeterías. Si
                    organizás algo fierrero, cargalo y llegale a la gente que
                    está cerca y le gusta lo mismo que a vos.
                  </p>
                </Reveal>
              </div>

              <ol className="flex flex-col gap-3">
                {organizerSteps.map((step, i) => (
                  <Reveal
                    as="li"
                    key={step.title}
                    delay={i * 80}
                    className={cn(CARD, "flex items-start gap-4 p-5")}
                  >
                    <IconTile icon={step.icon} />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold">{step.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>

              <Reveal>
                <p className="text-xs leading-5 text-muted-foreground">
                  Para publicar tenés que ser mayor de 18. Gridd publica, no
                  organiza: lo que convocás es responsabilidad tuya.{" "}
                  <Link
                    href="/terminos"
                    className="text-foreground underline underline-offset-4 transition-colors hover:text-brand"
                  >
                    Ver términos
                  </Link>
                  .
                </p>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <PublishMock />
            </Reveal>
          </div>
        </Section>

        {/* ---------------- La regla ---------------- */}
        <Section id="normas">
          <Reveal className="relative overflow-hidden rounded-3xl border border-brand/25 bg-card">
            <div
              aria-hidden
              className="absolute -top-32 -left-32 size-96 rounded-full bg-brand/10 blur-3xl"
            />
            <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-12">
              <div className="flex flex-col gap-5">
                <p className={cn(EYEBROW, "text-brand")}>Una sola regla dura</p>
                <h2 className={H2}>Acá no se publican picadas ni carreras en la vía pública.</h2>
                <p className="max-w-md text-sm leading-7 text-muted-foreground">
                  No es una postura moral: en la calle no hay control ni
                  asistencia, y el que termina lastimado suele no ser el que
                  maneja. Publicar una picada termina en el evento borrado y la
                  cuenta bloqueada, sin advertencia previa.
                </p>
                <Link
                  href="/normas"
                  className="self-start rounded-4xl border border-border px-4 py-2 text-sm font-medium transition-colors outline-none hover:border-brand/50 hover:text-brand focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  Leer las normas
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Sí", items: allowed, icon: Tick02Icon, tone: "text-brand bg-brand/10" },
                  { title: "No", items: forbidden, icon: Cancel01Icon, tone: "text-destructive bg-destructive/10" },
                ].map((list) => (
                  <div
                    key={list.title}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-background/60 p-5"
                  >
                    <p className="font-heading text-xl font-extrabold uppercase">{list.title}</p>
                    <ul className="flex flex-col gap-3">
                      {list.items.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <span
                            className={cn(
                              "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                              list.tone
                            )}
                          >
                            <HugeiconsIcon icon={list.icon} strokeWidth={2.2} aria-hidden className="size-3" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Section>

        {/* ---------------- Preguntas ---------------- */}
        <Section id="preguntas">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
              <Reveal>
                <p className={EYEBROW}>Preguntas frecuentes</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className={H2}>Lo que siempre preguntan.</h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="max-w-sm text-sm leading-7 text-muted-foreground">
                  ¿Te quedó otra duda? Escribinos a{" "}
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="text-foreground underline underline-offset-4 transition-colors hover:text-brand"
                  >
                    {site.contactEmail}
                  </a>
                  .
                </p>
              </Reveal>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <Reveal key={faq.q} delay={i * 50}>
                  <details className={cn(CARD, "group open:border-brand/25")}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-3xl p-5 text-base font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:px-6 [&::-webkit-details-marker]:hidden">
                      {faq.q}
                      <HugeiconsIcon
                        icon={Add01Icon}
                        strokeWidth={1.8}
                        aria-hidden
                        className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45 group-open:text-brand"
                      />
                    </summary>
                    <p className="-mt-1 px-5 pb-5 text-sm leading-7 text-muted-foreground sm:px-6">
                      {faq.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* ---------------- Descargar ---------------- */}
        <Section id="descargar">
          <Reveal className="relative overflow-hidden rounded-3xl border border-border">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <Image
                src={heroBg}
                alt=""
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                placeholder="blur"
                className="object-cover object-center opacity-50"
              />
              <div className="absolute inset-0 bg-linear-to-r from-card via-card/90 to-card/40" />
            </div>
            <div className="relative flex flex-col gap-10 p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-14">
              <div className="flex max-w-xl flex-col gap-5">
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] tracking-[-0.02em] text-balance">
                  Bajate Gridd y no te pierdas la próxima.
                </h2>
                <p className="max-w-md text-sm leading-7 text-muted-foreground">
                  Gratis, sin publicidad y sin cuenta para mirar. Con cuenta
                  guardás encuentros, armás tu garage y publicás los tuyos.
                </p>
              </div>
              <StoreButtons />
            </div>
          </Reveal>
        </Section>
      </main>

      <LandingFooter />
    </>
  )
}
