import {
  Calendar03Icon,
  MapsIcon,
  PlusSignIcon,
  User03Icon,
} from "@hugeicons/core-free-icons"

/**
 * Destinos principales de la app. Se usan en el header (desktop),
 * en la nav inferior (mobile) y en el menú lateral.
 */
export const primaryNav = [
  { href: "/eventos", label: "Eventos", icon: Calendar03Icon },
  { href: "/mapa", label: "Mapa", icon: MapsIcon },
  { href: "/publicar", label: "Publicar", icon: PlusSignIcon },
  { href: "/perfil", label: "Perfil", icon: User03Icon },
] as const

export type NavItem = (typeof primaryNav)[number]

/** ¿La ruta actual corresponde a este destino? */
export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}
