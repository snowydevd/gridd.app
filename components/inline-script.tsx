/**
 * Script que corre sincrónico mientras el browser parsea el HTML, antes del
 * primer pintado. Es la única forma de tocar el DOM antes de que se vea algo:
 * `useLayoutEffect` ya llega tarde, porque corre después de hidratar y el
 * browser pinta el HTML del server mucho antes de que React cargue.
 *
 * El baile con `type` es para callar el warning de React en desarrollo, que
 * avisa —con razón— que un `<script>` renderizado por un componente no se
 * ejecuta en el cliente. En el server sale como `text/javascript` y el browser
 * lo corre al parsear; en el cliente sale como `text/plain` y React lo trata
 * como texto inerte. `suppressHydrationWarning` es por esa diferencia de tipo.
 *
 * Como no corre en navegaciones cliente, lo que el script deje puesto tiene que
 * poder reponerse desde un efecto. Ver `intro-curtain.tsx`.
 */
function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export { InlineScript }
