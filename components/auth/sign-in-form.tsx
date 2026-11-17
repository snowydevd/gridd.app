"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { resetPassword, sendResetCode, signIn, signUp } from "@/app/ingresar/actions"
import { validateCredentials, type PasswordFlow } from "@/lib/auth-errors"
import { ui } from "@/lib/ui"

const COPY: Record<PasswordFlow, { title: string; subtitle: string; submit: string; busy: string }> = {
  signIn: { title: "Entrar", subtitle: "Con tu email y contraseña.", submit: "Entrar", busy: "Entrando…" },
  signUp: {
    title: "Crear cuenta",
    subtitle: "Te lleva menos de un minuto.",
    submit: "Crear cuenta",
    busy: "Creando tu cuenta…",
  },
  reset: {
    title: "Recuperar contraseña",
    subtitle: "Te mandamos un código de 8 dígitos a tu email.",
    submit: "Mandar código",
    busy: "Mandando código…",
  },
  "reset-verification": {
    title: "Nueva contraseña",
    subtitle: "Poné el código que te llegó y elegí una contraseña nueva.",
    submit: "Cambiar contraseña",
    busy: "Cambiando contraseña…",
  },
}

/** Email + contraseña, con los mismos cuatro flujos que la pantalla de email de la app. */
export function SignInForm({ next, initialMode = "signIn" }: { next: string; initialMode?: PasswordFlow }) {
  const router = useRouter()
  const [mode, setMode] = useState<PasswordFlow>(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pending, startTransition] = useTransition()

  const switchMode = (to: PasswordFlow) => {
    setMode(to)
    setError(null)
    setNotice(null)
    setPassword("")
    setConfirmPassword("")
    setAccepted(false)
    setCode("")
  }

  // Al escribir se borra el error anterior, así no queda un mensaje viejo en pantalla.
  const edit = (set: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    set(e.target.value)
    if (error) setError(null)
  }

  const ready =
    email.trim().length > 0 &&
    (mode === "reset" || password.length > 0) &&
    (mode !== "signUp" || (name.trim().length > 0 && confirmPassword.length > 0 && accepted)) &&
    (mode !== "reset-verification" || code.trim().length > 0)

  const submit = () => {
    if (!ready || pending || success) return
    // Lo que se puede revisar acá no viaja al servidor.
    const invalid = validateCredentials(mode, { name, email, password, confirmPassword, code })
    if (invalid) return setError(invalid)
    setError(null)
    setNotice(null)
    startTransition(async () => {
      const result =
        mode === "signIn"
          ? await signIn({ email, password })
          : mode === "signUp"
            ? await signUp({ name, email, password })
            : mode === "reset"
              ? await sendResetCode({ email })
              : await resetPassword({ email, code, password })

      if (!result.ok) {
        setError(result.message)
        if (mode === "signIn" || mode === "reset-verification") setPassword("")
        return
      }
      if (mode === "reset") {
        switchMode("reset-verification")
        setNotice(`Te mandamos un código a ${email.trim()}. Puede tardar un minuto en llegar.`)
        return
      }
      setSuccess(true)
      router.replace(next)
      router.refresh()
    })
  }

  const copy = COPY[mode]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[2rem] leading-[1.05] tracking-[-0.02em] uppercase">{copy.title}</h1>
        <p className="text-base leading-7 text-muted-foreground">{copy.subtitle}</p>
      </div>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        {mode === "signUp" && (
          <Field id="auth-name" label="Nombre">
            <input
              id="auth-name"
              autoComplete="name"
              maxLength={50}
              value={name}
              onChange={edit(setName)}
              className={ui.input}
            />
          </Field>
        )}
        <Field id="auth-email" label="Email">
          <input
            id="auth-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={edit(setEmail)}
            disabled={mode === "reset-verification"}
            placeholder="vos@gmail.com"
            className={ui.input}
          />
        </Field>
        {mode === "reset-verification" && (
          <Field id="auth-code" label="Código">
            <input
              id="auth-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={code}
              onChange={edit(setCode)}
              className={ui.input}
            />
          </Field>
        )}
        {mode !== "reset" && (
          <Field id="auth-password" label={mode === "reset-verification" ? "Contraseña nueva" : "Contraseña"}>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              value={password}
              onChange={edit(setPassword)}
              className={ui.input}
            />
          </Field>
        )}
        {mode === "signUp" && (
          <Field id="auth-confirm" label="Repetir contraseña">
            <input
              id="auth-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={edit(setConfirmPassword)}
              className={ui.input}
            />
          </Field>
        )}
        {(mode === "signUp" || mode === "reset-verification") && (
          <p className={ui.hint}>Al menos 8 caracteres, con letras y números.</p>
        )}

        {mode === "signUp" && (
          <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 size-4 shrink-0 accent-[var(--brand)]"
            />
            <span>
              Acepto los{" "}
              <Link href="/terminos" className="text-foreground underline underline-offset-4">
                términos de uso
              </Link>
              , la{" "}
              <Link href="/privacidad" className="text-foreground underline underline-offset-4">
                política de privacidad
              </Link>{" "}
              y las{" "}
              <Link href="/normas" className="text-foreground underline underline-offset-4">
                normas de la comunidad
              </Link>
              .
            </span>
          </label>
        )}

        {notice && (
          <p role="status" className="text-sm text-brand-text">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" className={ui.error}>
            {error}
          </p>
        )}

        <button type="submit" disabled={!ready || pending || success} className={ui.primary}>
          {success ? "¡Listo!" : pending ? copy.busy : copy.submit}
        </button>
      </form>

      <div className="flex flex-col items-center gap-3">
        {mode === "signIn" && (
          <>
            <ModeLink onClick={() => switchMode("reset")}>Me olvidé la contraseña</ModeLink>
            <ModeLink onClick={() => switchMode("signUp")}>¿No tenés cuenta? Creá una</ModeLink>
          </>
        )}
        {mode === "signUp" && <ModeLink onClick={() => switchMode("signIn")}>¿Ya tenés cuenta? Entrá</ModeLink>}
        {mode === "reset-verification" && <ModeLink onClick={() => switchMode("reset")}>Reenviar código</ModeLink>}
        {(mode === "reset" || mode === "reset-verification") && (
          <ModeLink onClick={() => switchMode("signIn")}>Volver a entrar</ModeLink>
        )}
      </div>
    </div>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={ui.label}>
        {label}
      </label>
      {children}
    </div>
  )
}

function ModeLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={ui.link}>
      {children}
    </button>
  )
}
