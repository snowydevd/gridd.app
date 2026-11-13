import { cookies } from "next/headers";

const COOKIE_NAME = "GRIDD_SESSION_JWT"

export async function saveSession(authToken: string) {
    const cookieList = await cookies()
    cookieList.set(COOKIE_NAME, authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24
    })
}

export async function clearSession(){
    const cookieList = await cookies()
    cookieList.delete(COOKIE_NAME)
}

export async function getToken(): Promise<string | undefined> {
    const cookieList = await cookies()
    return cookieList.get(COOKIE_NAME)?.value
}

