/**
 * Script de la cortina de la landing (`/nosotros`). Corre antes de pintar: evita que el contenido
 * aparezca y recién después se esconda para animarse, y prende la cortina de entrada.
 *
 * Va en el <head> del root layout y no en la página: el layout se renderiza en el server y se hidrata
 * una sola vez, así que React nunca crea el <script> en el cliente (si lo hiciera, avisa que no se
 * ejecuta). Por eso mira la ruta él mismo. Al llegar a `/nosotros` navegando desde otra página no
 * corre, y lo repone `IntroCurtain` desde un efecto.
 *
 * El failsafe es importante: si React nunca hidrata, el controlador de la cortina no existe y sin
 * esto quedaría el scroll bloqueado detrás de una portada que no se mueve más.
 */
export const INTRO_SCRIPT =
  `(function(){try{if(location.pathname!=="/nosotros")return;var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("js-anim");d.setAttribute("data-intro","play");setTimeout(function(){if(!d.dataset.hydrated){d.classList.remove("js-anim");d.setAttribute("data-intro","skip")}},2500)}catch(e){}})()`
