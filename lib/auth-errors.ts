/**
 * Mensajes de login, los mismos que la app (mobile/src/lib/auth-errors.ts).
 * Sin `"use server"` ni imports de server: lo usan el formulario y las actions.
 */

/** Los flujos del provider Password de mobile/convex/auth.ts. */
export type PasswordFlow = "signIn" | "signUp" | "reset" | "reset-verification"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Mismas reglas que mobile/convex/lib/validation.ts, para avisar antes de ir al servidor. */
export function validateCredentials(
  flow: PasswordFlow,
  {
    name = "",
    email,
    password = "",
    confirmPassword,
    code = "",
  }: { name?: string; email: string; password?: string; confirmPassword?: string; code?: string }
): string | null {
  if (!EMAIL_RE.test(email.trim())) return "Revisá el email, parece que está mal escrito."
  if (flow === "signUp") {
    const n = name.trim().length
    if (n < 2 || n > 50) return "El nombre tiene que tener entre 2 y 50 caracteres."
  }
  if (flow === "reset-verification" && !/^\d{8}$/.test(code.trim())) return "El código tiene 8 números."
  if (flow === "signUp" || flow === "reset-verification") {
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return "La contraseña tiene que tener al menos 8 caracteres, con letras y números."
    }
  }
  if (flow === "signUp" && confirmPassword !== undefined && password !== confirmPassword) {
    return "Las contraseñas no coinciden."
  }
  return null
}

// Convex Auth tira `Error`s comunes con estos textos. En desarrollo llegan tal cual;
// en producción Convex los tapa con "Server Error" y caemos en FALLBACK.
const KNOWN: { match: RegExp; message: (flow: PasswordFlow) => string }[] = [
  { match: /TooManyFailedAttempts/, message: () => "Demasiados intentos. Esperá unos minutos y probá de nuevo." },
  { match: /already exists/, message: () => "Ya existe una cuenta con ese email. Probá entrar." },
  {
    match: /InvalidAccountId|InvalidSecret|Invalid credentials/,
    message: (flow) =>
      flow === "reset" ? "No encontramos una cuenta con ese email." : "Email o contraseña incorrectos.",
  },
  {
    match: /Invalid code|Could not verify code|Invalid verification code/i,
    message: () => "El código no es válido o ya venció.",
  },
  { match: /recuperación|Resend|API key/i, message: () => "No pudimos mandar el mail. Probá de nuevo en un rato." },
]

const FALLBACK: Record<PasswordFlow, string> = {
  signIn: "Email o contraseña incorrectos.",
  signUp: "No pudimos crear la cuenta. Puede que ya exista una con ese email.",
  reset: "No pudimos mandar el código. Revisá el email.",
  "reset-verification": "El código no es válido o ya venció.",
}

/** Convierte el texto de error de `auth:signIn` en un mensaje para mostrar. */
export function authErrorMessage(errorText: string, flow: PasswordFlow): string {
  return KNOWN.find((k) => k.match.test(errorText))?.message(flow) ?? FALLBACK[flow]
}
