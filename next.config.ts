import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Las actualizaciones de Next que proponen los agentes: sólo las de seguridad.
    agentUpgrade: "security",
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
