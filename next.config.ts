import type { NextConfig } from "next";

/**
 * Las rutas de la app (Expo Router, mobile/src/app) apuntan a su pantalla en la web, por si alguien
 * pega o comparte una. Los links públicos de eventos ya son iguales: gridd.app/e/<slug>.
 */
const APP_ROUTES: [string, string][] = [
  ["/event/:slug", "/e/:slug"],
  ["/events", "/eventos"],
  ["/map", "/mapa"],
  ["/saved", "/guardados"],
  ["/profile", "/perfil"],
  ["/login", "/ingresar"],
  ["/email", "/ingresar/email"],
  ["/garage", "/perfil/garage"],
  ["/garage/new", "/perfil/garage/nuevo"],
  ["/garage/:id", "/perfil/garage/:id"],
  ["/interests", "/perfil/intereses"],
  ["/account-details", "/perfil/cuenta"],
  ["/organizer/:id", "/organizador/:id"],
  ["/organizer-request", "/perfil/organizar"],
  ["/publish", "/organizadores/panel/nuevo"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return APP_ROUTES.map(([source, destination]) => ({ source, destination, permanent: false }));
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
