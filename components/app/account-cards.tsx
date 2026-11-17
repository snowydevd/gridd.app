import Link from "next/link"

import { SectionHeader, text } from "@/components/app/ui"
import { cn } from "@/lib/utils"

type Step = { key: string; art: string; artClass?: string; title: string; text: string; action: string; href: string; done: boolean }

/**
 * "Completá tu cuenta" (mobile/src/components/account-cards.tsx): tarjetas flúor deslizables con lo
 * que le falta al usuario. Las completas no se muestran y, con todo completo, la sección desaparece.
 */
export function AccountCards({
  viewer,
  hasCar,
  hasJoinedAny,
}: {
  viewer: { hasImage: boolean; interests: number } | null
  hasCar: boolean
  hasJoinedAny: boolean
}) {
  if (!viewer) {
    return (
      <Section title="Completá tu cuenta">
        <StepCard
          step={{
            key: "signup",
            art: "/account/signup.svg",
            title: "Creá tu cuenta",
            text: "Anotate a meets y armá tu garage",
            action: "Crear",
            href: "/ingresar/email?modo=registro",
            done: false,
          }}
        />
      </Section>
    )
  }

  const steps: Step[] = [
    { key: "photo", art: "/account/photo.svg", title: "Foto de perfil", text: "Que te reconozcan en los meets", action: "Subir", href: "/perfil", done: viewer.hasImage },
    { key: "interests", art: "/account/interests.svg", title: "Tus intereses", text: "Te mostramos primero lo que te gusta", action: "Elegir", href: "/perfil/intereses", done: viewer.interests > 0 },
    { key: "car", art: "/account/car.svg", artClass: "-right-10 -bottom-1.5 h-[99px]", title: "Tu primer auto", text: "Armá tu garage", action: "Agregar", href: "/perfil/garage/nuevo", done: hasCar },
    { key: "meet", art: "/account/meet.svg", title: "Tu primer meet", text: "Anotate a un encuentro", action: "Ver meets", href: "/eventos", done: hasJoinedAny },
  ]
  const pending = steps.filter((s) => !s.done)
  if (pending.length === 0) return null

  return (
    <Section title={`Completá tu cuenta · ${steps.length - pending.length}/${steps.length}`}>
      {pending.map((step) => (
        <StepCard key={step.key} step={step} />
      ))}
    </Section>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <SectionHeader title={title} />
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">{children}</div>
    </section>
  )
}

function StepCard({ step }: { step: Step }) {
  return (
    <div className="relative flex min-h-[132px] w-72 shrink-0 snap-start flex-col justify-center overflow-hidden rounded-[16px] bg-brand p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={step.art} alt="" aria-hidden className={cn("absolute -right-9 -bottom-3 h-[116px] w-44 object-contain object-right-bottom", step.artClass)} />
      <div className="relative flex w-[56%] flex-col gap-1">
        <span className={cn(text.heading, "truncate text-brand-foreground")}>{step.title}</span>
        <span className={cn(text.caption, "line-clamp-2 min-h-8 text-[rgba(11,11,12,0.7)]")}>{step.text}</span>
        <Link
          href={step.href}
          aria-label={`${step.action}: ${step.title}`}
          className={cn(
            text.label,
            "mt-1 flex h-[34px] min-w-[88px] items-center justify-center self-start rounded-full bg-card px-4 text-foreground outline-none active:opacity-80 focus-visible:ring-[3px] focus-visible:ring-black/40"
          )}
        >
          {step.action}
        </Link>
      </div>
    </div>
  )
}
