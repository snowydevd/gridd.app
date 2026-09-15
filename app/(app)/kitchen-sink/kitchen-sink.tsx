"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar03Icon,
  Location01Icon,
  PlusSignIcon,
  Search01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"

import { PicadasNotice } from "@/components/legal/picadas-notice"
import { ReportDialog } from "@/components/legal/report-dialog"
import { TermsAcceptance } from "@/components/legal/terms-acceptance"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/states/empty-state"
import { LoadingCards, LoadingState } from "@/components/states/loading-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

const tiposDeEvento = {
  junada: "Junada",
  picada: "Picada",
  rodada: "Rodada",
  expo: "Expo",
}

const paleta = [
  { token: "--background", value: "#0B0B0C", nombre: "Fondo" },
  { token: "--card", value: "#17181B", nombre: "Superficie" },
  { token: "--border", value: "#2A2C30", nombre: "Borde" },
  { token: "--foreground", value: "#F2F3F5", nombre: "Texto" },
  { token: "--muted-foreground", value: "#8A8F98", nombre: "Texto sec." },
  { token: "--brand", value: "#DFFF00", nombre: "Acento" },
]

function Section({
  title,
  hint,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  title: string
  hint?: React.ReactNode
}) {
  return (
    <section
      className={cn("flex flex-col gap-5 border-t border-border pt-8", className)}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="font-mono text-[0.72rem] tracking-[0.06em] text-muted-foreground">
          {title}
        </h2>
        {hint && <p className="max-w-prose text-sm text-muted-foreground/80">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

function Row({ label, className, children }: React.ComponentProps<"div"> & { label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="font-mono text-[0.625rem] tracking-[0.06em] text-muted-foreground/60">
          {label}
        </span>
      )}
      <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>
    </div>
  )
}

function KitchenSink() {
  const [cargando, setCargando] = React.useState(false)

  function simularGuardado() {
    setCargando(true)
    const id = toast.add({
      title: "Publicando evento",
      type: "loading",
      timeout: 0,
    })
    window.setTimeout(() => {
      setCargando(false)
      toast.close(id)
      toast.add({
        title: "Evento publicado",
        description: "Ya se puede ver en el listado.",
        type: "success",
        actionProps: { children: "Ver" },
      })
    }, 1600)
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Interno · GRI-5"
        title="Kitchen sink"
        description="Todos los primitivos en sus estados. Se revisa a 380px antes que en desktop."
        className="border-b-0 pb-0"
        action={
          <Badge variant="outline" className="font-mono">
            dark-only
          </Badge>
        }
      />

      <Section title="Paleta" hint="Los tokens de GRI-4. El flúor es señal, no decoración.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {paleta.map((c) => (
            <div key={c.token} className="flex flex-col gap-2">
              <div
                className="h-14 rounded-xl ring-1 ring-foreground/10"
                style={{ background: `var(${c.token})` }}
              />
              <div className="flex flex-col">
                <span className="text-xs">{c.nombre}</span>
                <span className="font-mono text-[0.625rem] tracking-[0.04em] text-muted-foreground">
                  {c.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Botones"
        hint="La variante brand es la acción primaria de la vista: una sola por pantalla."
      >
        <Row label="Variantes">
          <Button variant="brand">Publicar</Button>
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Eliminar</Button>
          <Button variant="link">Link</Button>
        </Row>

        <Row label="Tamaños">
          <Button size="xs" variant="secondary">
            xs
          </Button>
          <Button size="sm" variant="secondary">
            sm
          </Button>
          <Button variant="secondary">default</Button>
          <Button size="lg" variant="secondary">
            lg
          </Button>
        </Row>

        <Row label="Con ícono / sólo ícono">
          <Button variant="brand">
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} data-icon="inline-start" />
            Nuevo evento
          </Button>
          <Button variant="outline">
            Buscar
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} data-icon="inline-end" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Eliminar">
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          </Button>
        </Row>

        <Row label="Estados">
          <Button variant="brand" disabled={cargando} onClick={simularGuardado}>
            {cargando && <Spinner />}
            {cargando ? "Publicando…" : "Simular publicación"}
          </Button>
          <Button variant="secondary" disabled>
            Deshabilitado
          </Button>
          <Button variant="outline" disabled>
            <Spinner />
            Cargando
          </Button>
        </Row>
      </Section>

      <Section title="Badges">
        <Row>
          <Badge>Hoy</Badge>
          <Badge variant="secondary">Junada</Badge>
          <Badge variant="outline">Zona sur</Badge>
          <Badge variant="ghost">Borrador</Badge>
          <Badge variant="destructive">Cancelado</Badge>
          <Badge variant="outline" className="text-brand">
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            En vivo
          </Badge>
        </Row>
      </Section>

      <Section title="Formularios" hint="Input, Label y Select en sus estados.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ks-titulo">Título</Label>
            <Input id="ks-titulo" placeholder="Junada en el puerto" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ks-lugar">Lugar</Label>
            <Input id="ks-lugar" defaultValue="Costanera Sur, CABA" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ks-error">Fecha</Label>
            <Input id="ks-error" aria-invalid defaultValue="32/13/2026" />
            <p className="text-xs text-destructive">Esa fecha no existe.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ks-disabled">Organizador</Label>
            <Input id="ks-disabled" disabled placeholder="Requiere sesión" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tipo de evento</Label>
            <Select items={tiposDeEvento} defaultValue="junada">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Elegí un tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(tiposDeEvento).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Distancia</Label>
            <Select items={{ "5": "Hasta 5 km", "25": "Hasta 25 km", "100": "Hasta 100 km" }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sin límite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Hasta 5 km</SelectItem>
                <SelectItem value="25">Hasta 25 km</SelectItem>
                <SelectItem value="100">Hasta 100 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription className="font-mono text-[0.72rem] tracking-[0.06em]">
                Sáb 12 · 21:00
              </CardDescription>
              <CardTitle>Junada en el puerto</CardTitle>
              <CardAction>
                <Badge variant="outline">Junada</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Punto de encuentro en la rotonda. Se sale 21:30 en punto.
            </CardContent>
            <CardFooter className="gap-2 text-muted-foreground">
              <HugeiconsIcon icon={Location01Icon} strokeWidth={2} className="size-4" />
              <span className="text-xs">Costanera Sur, CABA</span>
            </CardFooter>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Card compacta</CardTitle>
              <CardDescription>Variante compacta, para listados densos.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button size="sm" variant="secondary">
                Ver detalle
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Section title="Sheet" hint="Menú y filtros en mobile. Lateral en desktop, desde abajo al alcance del pulgar.">
        <Row>
          <Sheet>
            <SheetTrigger render={<Button variant="outline">Abrir lateral</Button>} />
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>Acotá lo que ves en el listado.</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ks-sheet-buscar">Buscar</Label>
                  <Input id="ks-sheet-buscar" placeholder="Nombre del evento" />
                </div>
              </div>
              <SheetFooter>
                <Button variant="brand">Aplicar</Button>
                <Button variant="ghost">Limpiar</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger render={<Button variant="outline">Abrir desde abajo</Button>} />
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Compartir evento</SheetTitle>
                <SheetDescription>Se copia el link al portapapeles.</SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <Button variant="brand">Copiar link</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Row>
      </Section>

      <Section title="Toast" hint="Aparecen abajo en mobile, abajo a la derecha en desktop.">
        <Row>
          <Button
            variant="secondary"
            onClick={() =>
              toast.add({
                title: "Evento guardado",
                description: "Lo vas a encontrar en tu perfil.",
                type: "success",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.add({
                title: "No se pudo publicar",
                description: "Revisá la conexión y probá de nuevo.",
                type: "error",
              })
            }
          >
            Error
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.add({ title: "Faltan datos del lugar", type: "warning" })}
          >
            Warning
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.add({
                title: "Evento eliminado",
                type: "info",
                actionProps: { children: "Deshacer" },
              })
            }
          >
            Con acción
          </Button>
        </Row>
      </Section>

      <Section title="Estados de carga" hint="Spinner para esperas cortas, esqueletos para listados.">
        <Row label="Spinner">
          <Spinner />
          <Spinner className="size-5 text-brand" />
        </Row>
        <LoadingState label="Buscando eventos" className="rounded-2xl bg-card ring-1 ring-foreground/10" />
        <Separator />
        <Row label="Esqueletos sueltos">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-4xl" />
        </Row>
        <LoadingCards count={3} />
      </Section>

      <Section title="Estado vacío" hint="Mismo tono en toda la app: qué falta y qué se puede hacer.">
        <EmptyState
          icon={Calendar03Icon}
          title="Todavía no hay eventos"
          description="Cuando alguien publique algo cerca tuyo, va a aparecer acá."
          action={<Button variant="brand">Publicar el primero</Button>}
        />
        <EmptyState
          icon={Search01Icon}
          title="Sin resultados"
          description="Probá con menos filtros o ampliá la distancia."
          className="p-8"
        />
      </Section>

      <Section
        title="Legal"
        hint="Las piezas de GRI-25. El reporte todavía no persiste: avisa y cierra."
      >
        <PicadasNotice />
        <Row label="Reportar">
          <ReportDialog eventTitle="Junada en el Prado" eventId="demo" />
        </Row>
        <Separator />
        <TermsAcceptance className="max-w-prose" />
      </Section>
    </div>
  )
}

export { KitchenSink }
