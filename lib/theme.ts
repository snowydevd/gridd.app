/**
 * Apariencia, como en la app (mobile/src/theme): "Sistema" sigue al teléfono y "Claro" / "Oscuro" lo
 * fijan. La preferencia es del dispositivo, no de la cuenta, así que vive en localStorage (misma clave
 * que la app usa en SecureStore). Sin preferencia guardada no hace falta JS: el CSS sigue a
 * `prefers-color-scheme` (app/globals.css).
 */
export type ThemePreference = "system" | "light" | "dark"

export const THEME_STORAGE_KEY = "gridd.themePreference"

export const THEME_PREFERENCES: ThemePreference[] = ["system", "light", "dark"]

export const THEME_LABELS: Record<ThemePreference, string> = { system: "Sistema", light: "Claro", dark: "Oscuro" }

/** Fondo de cada tema, para la barra del navegador (`theme-color`). */
export const THEME_CANVAS = { light: "#F6F5F0", dark: "#0B0B0C" } as const

export function parsePreference(raw: string | null | undefined): ThemePreference {
  return raw === "light" || raw === "dark" ? raw : "system"
}

/**
 * Corre antes del primer pintado (ver `InlineScript`): con una preferencia guardada pone `data-theme`
 * en <html> y ajusta `theme-color`, así no hay un destello del tema equivocado.
 */
export const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(p!=="light"&&p!=="dark")return;document.documentElement.setAttribute("data-theme",p);var c=p==="light"?${JSON.stringify(THEME_CANVAS.light)}:${JSON.stringify(THEME_CANVAS.dark)};var f=function(){document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",c);m.removeAttribute("media")})};f();document.addEventListener("DOMContentLoaded",f)}catch(e){}})();`

/** Aplica una preferencia elegida en Cuenta → Apariencia, sin recargar. */
export function applyPreference(preference: ThemePreference) {
  const root = document.documentElement
  try {
    if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // Navegación privada sin storage: el cambio vale hasta recargar.
  }
  const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
  if (preference === "system") {
    root.removeAttribute("data-theme")
    // Vuelven los dos `theme-color` con su `media`, como los deja el layout.
    metas.forEach((m, i) => {
      const scheme = i === 0 ? "light" : "dark"
      m.setAttribute("media", `(prefers-color-scheme: ${scheme})`)
      m.setAttribute("content", THEME_CANVAS[scheme])
    })
    return
  }
  root.setAttribute("data-theme", preference)
  metas.forEach((m) => {
    m.setAttribute("content", THEME_CANVAS[preference])
    m.removeAttribute("media")
  })
}

export function readPreference(): ThemePreference {
  try {
    return parsePreference(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return "system"
  }
}
