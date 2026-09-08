import type { Metadata } from "next"
import Link from "next/link"

import { GridLines } from "@/components/landing/grid-lines"
import { IntroCurtain } from "@/components/landing/intro-curtain"
import { LandingNav } from "@/components/landing/landing-nav"
import {
  ListScreen,
  MapScreen,
  Phone,
  SplashScreen,
} from "@/components/landing/phone"
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
    body: "El mapa te muestra lo que se viene alrededor tuyo, con fecha, hora y punto de encuentro. Sin cuenta y sin vueltas.",
  },
  {
    n: "02",
    title: "Guardalo y andá",
    body: "Cada evento tiene su ficha con cómo llegar. Compartila por WhatsApp y el que la abre ve lo mismo que vos.",
  },
  {
    n: "03",
    title: "Publicá el tuyo",
    body: "Fecha, lugar y poco más. Sale en menos de dos minutos desde el celular y queda a la vista de todos.",
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

export default function Home() {
  return (
    <>
      {/* Corre antes de pintar: evita que el contenido aparezca y recién
          después se esconda para animarse. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'try{var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("js-anim");setTimeout(function(){if(!d.dataset.hydrated){d.classList.remove("js-anim")}},2500)}}catch(e){}',
        }}
      />

      <LandingNav />

      <main className="relative flex flex-1 flex-col">
        <IntroCurtain />

        {/* ---------------- La app ---------------- */}
        <section id="app" className={`relative border-t border-border ${PAD} py-24 sm:py-32`}>
          <GridLines />
          <div className="relative flex flex-col gap-16 xl:flex-row xl:items-center xl:gap-20">
            <div className="flex max-w-xl flex-col gap-8">
              <Reveal>
                <p className="font-mono text-[0.72rem] tracking-[0.06em] text-muted-foreground uppercase">
                  La app
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.95] font-bold tracking-[-0.04em] text-balance">
                  Todos los encuentros fierreros de Uruguay, en un mapa.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="max-w-md text-base leading-7 text-muted-foreground">
                  Junadas, rodadas, expos y fechas de pista. Enterate de lo que
                  pasa cerca tuyo y publicá el tuyo en menos de dos minutos.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <StoreButtons />
              </Reveal>
            </div>

            <Reveal delay={200} className="flex-1">
              <div className="flex items-end justify-center gap-4 sm:gap-6">
                <Phone float={1} className="mt-12 hidden w-[25%] max-w-[186px] sm:block">
                  <ListScreen />
                </Phone>
                <Phone float={0} className="w-[56%] max-w-[224px] sm:w-[34%] sm:max-w-[268px]">
                  <SplashScreen />
                </Phone>
                <Phone float={2} className="mt-12 hidden w-[25%] max-w-[186px] sm:block">
                  <MapScreen />
                </Phone>
              </div>
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
              <p className="font-mono text-[0.72rem] tracking-[0.06em] text-muted-foreground uppercase">
                Cómo funciona
              </p>
            </Reveal>
            <ol className="grid gap-12 md:grid-cols-3 md:gap-10">
              {steps.map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 120} className="flex flex-col gap-4">
                  <span className="font-mono text-[0.72rem] tracking-[0.06em] text-brand">
                    {step.n}
                  </span>
                  <div aria-hidden className="rule-draw h-px w-full bg-border" />
                  <h2 className="text-xl font-semibold tracking-[-0.02em]">
                    {step.title}
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- Tipos ---------------- */}
        <section className={`relative border-t border-border ${PAD} py-24 sm:py-32`}>
          <GridLines />
          <div className="relative flex flex-col gap-10">
            <Reveal>
              <p className="font-mono text-[0.72rem] tracking-[0.06em] text-muted-foreground uppercase">
                Qué vas a encontrar
              </p>
            </Reveal>
            <ul className="flex flex-wrap gap-2.5">
              {kinds.map((kind, i) => (
                <Reveal as="li" key={kind} delay={i * 45}>
                  <span className="inline-flex rounded-4xl border border-border bg-input/30 px-4 py-2 font-mono text-[0.78rem] tracking-[0.02em] text-foreground transition-colors hover:border-brand/40 hover:text-brand">
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
              <p className="font-mono text-[0.72rem] tracking-[0.06em] text-muted-foreground uppercase">
                Una sola regla dura
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="max-w-3xl text-[clamp(1.9rem,4.6vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.035em] text-balance">
                Acá no se publican picadas ni carreras en la vía pública.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                Encuentros, junadas, rodadas y fechas de pista en predio
                habilitado, todas las que quieras. Competir en velocidad en la
                calle no, y publicarlo acá termina en el evento borrado y la
                cuenta bloqueada.{" "}
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
                <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
                  Bajate Gridd y no te pierdas la próxima.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="max-w-md text-sm leading-7 text-muted-foreground">
                  Gratis, sin publicidad y sin cuenta para mirar. La cuenta hace
                  falta sólo para publicar.
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
        className={`relative flex flex-col gap-6 border-t border-border ${PAD} py-8 font-mono text-[0.72rem] tracking-[0.06em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between`}
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
