import { cookies } from 'next/headers'

export async function createSession(token: string): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        path: '/',
    })
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function getSession(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get('session')?.value ?? null
}