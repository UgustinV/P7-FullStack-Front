'use server'

import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '@/lib/session'

const API_URL = process.env.API_URL ?? 'http://localhost:8000'

export type AuthFormState =
    | {
        errors?: {
            name?: string[]
            email?: string[]
            password?: string[]
        }
        message?: string
        }
    | undefined

export async function login(
    _state: AuthFormState,
    formData: FormData
): Promise<AuthFormState> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    let token: string
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
        return { message: data.message ?? 'Identifiants invalides.' }
        }

        token = data.data.token
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }

    await createSession(token)
    redirect('/dashboard')
}

export async function signup(
    _state: AuthFormState,
    formData: FormData
): Promise<AuthFormState> {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    let token: string
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
        if (data.details?.length) {
            const errors: NonNullable<AuthFormState>['errors'] = {}
            for (const detail of data.details as { field: string; message: string }[]) {
            const field = detail.field as keyof typeof errors
            errors[field] = [...(errors[field] ?? []), detail.message]
            }
            return { errors, message: data.message }
        }
        return { message: data.message ?? 'Une erreur est survenue.' }
        }

        token = data.data.token
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }

    await createSession(token)
    redirect('/dashboard')
}

export async function logout(): Promise<void> {
    await deleteSession()
    redirect('/login')
}