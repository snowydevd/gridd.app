import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import heroBg from "@/public/gridd-bg.jpeg"
import eventShot from "@/public/screens/evento.jpeg"
import garageShot from "@/public/screens/garage.jpeg"
import homeShot from "@/public/screens/inicio.jpeg"

import { InlineScript } from "@/components/inline-script"
import { GridLines } from "@/components/landing/grid-lines"
import { IntroCurtain } from "@/components/landing/intro-curtain"
import { LandingNav } from "@/components/landing/landing-nav"
import { PhoneShot } from "@/components/landing/phone-shot"
import { Reveal } from "@/components/landing/reveal"
import { StoreButtons } from "@/components/landing/store-buttons"
import { legalNav } from "@/lib/legal"
import { site } from "@/lib/site"

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

const steps = [
  {
    n: "01",
    title: "Mirá qué hay cerca",
    body: "Inicio te muestra el próximo encuentro y los que van con lo tuyo, dentro del radio que elijas. Sin cuenta y sin vueltas.",
  },
  {
    n: "02",
    title: "Anotate y llegá",
    body: "Cada evento tiene su ficha con fecha, lugar y cuántos van. Guardalo, compartilo por WhatsApp y abrí el mapa para llegar.",
  },
  {
    n: "03",
    title: "Armá tu garage",
    body: "Sumá tus autos por marca, modelo y año, y marcá cuáles están modificados. Quedan en tu perfil.",
  },
] as const

const kinds = [
  "Junadas",
  "Rodadas",
  "Cars & Coffee",
  "Expos",
  "Clásicos",
  "JDM",
  "Tuning",
  "4x4",
  "Motos",
  "Fechas de pista",
] as const

const PAD = "px-8 sm:px-12 lg:px-16"
const EYEBROW = "text-[0.72rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase"

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
        <section
          id="app"
          className={`relative overflow-hidden border-t border-border ${PAD} py-24 sm:py-32`}
        >
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
          <div className="relative flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-20">
            <div className="flex max-w-xl flex-col gap-8">
              <Reveal>
                <p className={EYEBROW}>La app</p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.95] tracking-[-0.02em] text-balance">
                  Todos los encuentros fierreros de Uruguay, en un solo lugar.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="max-w-md text-base leading-7 text-muted-foreground">
                  Junadas, rodadas, expos y fechas de pista. Enterate de lo que
                  pasa cerca tuyo, anotate y llegá con tu auto.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <StoreButtons />
              </Reveal>
            </div>

            <Reveal delay={200} className="flex-1">
              <PhoneShot
                src={homeShot}
                alt="Inicio de Gridd: el próximo encuentro destacado, la lista Para vos y las tarjetas para completar la cuenta."
                priority
              />
            </Reveal>
          </div>
        </section>

        {/* ---------------- Cómo funciona ---------------- */}
        <section
          id="como-funciona"
          className={`relative border-t border-border ${PAD} py-24 sm:py-32`}
        >
          <GridLines />
          <div className="relative flex flex-col gap-14">
            <Reveal>
              <p className={EYEBROW}>Cómo funciona</p>
            </Reveal>
            <ol className="grid gap-12 md:grid-cols-3 md:gap-10">
              {steps.map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 120} className="flex flex-col gap-4">
                  <span className="text-[0.72rem] font-semibold tracking-[0.12em] text-brand">
                    {step.n}
                  </span>
                  <div aria-hidden className="rule-draw h-px w-full bg-border" />
                  <h2 className="text-xl tracking-[-0.01em]">{step.title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- La ficha ---------------- */}
        <section id="eventos" className={`relative border-t border-border ${PAD} py-24 sm:py-32`}>
          <GridLines />
          <div className="relative flex flex-col-reverse gap-16 lg:flex-row lg:items-center lg:gap-20">
            <Reveal delay={120} className="flex-1">
              <PhoneShot
                src={eventShot}
                alt="Ficha de un evento en Gridd: foto, categoría, fecha y hora, lugar con la distancia, mapa y el botón Cómo llegar."
              />
            </Reveal>
            <div className="flex max-w-xl flex-1 flex-col gap-6">
              <Reveal>
                <p className={EYEBROW}>Cada encuentro, una ficha</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-[clamp(1.9rem,4.6vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-balance">
                  Cuándo, dónde y cómo llegar.
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
                  <li>Fecha y horario, con el lugar y a cuántos km te queda.</li>
                  <li>Cuántos van, para saber qué tan grande se pone.</li>
                  <li>Un toque en Cómo llegar y te abre el mapa.</li>
                  <li>Guardalo para tenerlo a mano o compartilo con tu grupo.</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- Garage ---------------- */}
        <section id="garage" className={`relative border-t border-border ${PAD} py-24 sm:py-32`}>
          <GridLines />
          <div className="relative flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-20">
            <div className="flex max-w-xl flex-1 flex-col gap-6">
              <Reveal>
                <p className={EYEBROW}>Tu garage</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-[clamp(1.9rem,4.6vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-balance">
                  Mostrá con qué llegás.
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="max-w-md text-sm leading-7 text-muted-foreground">
                  Cargá tus autos por marca, modelo y año, y marcá los que
                  tienen mano encima. Hasta diez autos, todos a mano en tu
                  perfil.
                </p>
              </Reveal>
            </div>
            <Reveal delay={120} className="flex-1">
              <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[1.75rem] border border-border bg-card p-2">
                <Image
                  src={garageShot}
                  alt="Mi garage en Gridd: un Citroën Saxo 2000 marcado como modificado, un BMW Serie 3 2020 y el botón Agregar auto."
                  sizes="(min-width: 1024px) 520px, 92vw"
                  placeholder="blur"
                  className="h-auto w-full rounded-[1.25rem]"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Tipos ---------------- */}
        <section className={`relative border-t border-border ${PAD} py-24 sm:py-32`}>
          <GridLines />
          <div className="relative flex flex-col gap-10">
            <Reveal>
              <p className={EYEBROW}>Qué vas a encontrar</p>
            </Reveal>
            <ul className="flex flex-wrap gap-2.5">
              {kinds.map((kind, i) => (
                <Reveal as="li" key={kind} delay={i * 45}>
                  <span className="inline-flex rounded-4xl border border-border bg-input/30 px-4 py-2 text-[0.82rem] font-medium text-foreground transition-colors hover:border-brand/40 hover:text-brand">
                    {kind}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- La regla ---------------- */}
        <section className={`relative border-t border-border ${PAD} py-24 sm:py-32`}>
          <GridLines />
          <div className="relative flex flex-col gap-8">
            <Reveal>
              <p className={EYEBROW}>Una sola regla dura</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="max-w-3xl text-[clamp(1.9rem,4.6vw,3.25rem)] leading-[1.02] tracking-[-0.02em] text-balance">
                Acá no se publican picadas ni carreras en la vía pública.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                Encuentros, junadas, rodadas y fechas de pista en predio
                habilitado, todas las que quieras. Competir en velocidad en la
                calle no, y publicarlo termina en el evento borrado y la cuenta
                bloqueada.{" "}
                <Link
                  href="/normas"
                  className="text-foreground underline underline-offset-4 transition-colors hover:text-brand"
                >
                  Leer las normas
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Descargar ---------------- */}
        <section
          id="descargar"
          className={`relative border-t border-border bg-card ${PAD} py-24 sm:py-32`}
        >
          <GridLines />
          <div className="relative flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex max-w-xl flex-col gap-6">
              <Reveal>
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] tracking-[-0.02em] text-balance">
                  Bajate Gridd y no te pierdas la próxima.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="max-w-md text-sm leading-7 text-muted-foreground">
                  Gratis, sin publicidad y sin cuenta para mirar. Con cuenta te
                  anotás, guardás encuentros y armás tu garage.
                </p>
              </Reveal>
            </div>
            <Reveal delay={180}>
              <StoreButtons />
            </Reveal>
          </div>
        </section>
      </main>

      <footer
        className={`relative flex flex-col gap-6 border-t border-border ${PAD} py-8 text-[0.72rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between`}
      >
        <span>2026 · {site.name}</span>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
          {legalNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <span>gridd.app</span>
      </footer>
    </>
  )
}
