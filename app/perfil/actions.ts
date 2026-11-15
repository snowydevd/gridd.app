"use server"

import { revalidatePath } from "next/cache"

import { withSession, type ActionResult } from "@/lib/authed"
import { mutation } from "@/lib/convex"

const RETRY = "Revisá tu conexión y probá de nuevo."

/** `users.updateProfile`: el nombre (2 a 50 caracteres; lo valida Convex). */
export async function updateName(input: { name: string }): Promise<ActionResult> {
  if (typeof input?.name !== "string") return { ok: false, reason: "error", message: "Escribí tu nombre." }
  const result = await withSession("perfil:nombre", RETRY, (token) =>
    mutation<null>("users:updateProfile", { name: input.name }, token)
  )
  if (result.ok) revalidatePath("/perfil")
  return result
}

/** URL de un solo uso para subir la foto directo a Convex (`files.generateAvatarUploadUrl`). */
export async function avatarUploadUrl(): Promise<ActionResult<string>> {
  return withSession("perfil:upload-url", RETRY, (token) =>
    mutation<string>("files:generateAvatarUploadUrl", {}, token)
  )
}

/** Guarda la foto recién subida y borra la anterior (`users.setAvatar`). */
export async function setAvatar(input: { storageId: string }): Promise<ActionResult> {
  if (typeof input?.storageId !== "string") return { ok: false, reason: "error", message: "Volvé a subir la foto." }
  const result = await withSession("perfil:foto", "No pudimos guardar la foto. " + RETRY, (token) =>
    mutation<null>("users:setAvatar", { storageId: input.storageId }, token)
  )
  if (result.ok) revalidatePath("/perfil")
  return result
}

export async function removeAvatar(): Promise<ActionResult> {
  const result = await withSession("perfil:quitar-foto", RETRY, (token) =>
    mutation<null>("users:removeAvatar", {}, token)
  )
  if (result.ok) revalidatePath("/perfil")
  return result
}

/** `publisherRequests.submit`: pedir permiso para publicar eventos (10 a 500 caracteres). */
export async function submitPublisherRequest(input: { message: string }): Promise<ActionResult> {
  if (typeof input?.message !== "string") return { ok: false, reason: "error", message: "Contanos sobre vos." }
  const result = await withSession("perfil:organizar", "No pudimos enviar la solicitud. " + RETRY, async (token) => {
    await mutation("publisherRequests:submit", { message: input.message }, token)
    return null
  })
  if (result.ok) revalidatePath("/perfil/organizar")
  return result
}
