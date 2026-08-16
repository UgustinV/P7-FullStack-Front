'use server'
import { SignupFormSchema, FormState } from '@/app/lib/definitions'
import { createSession, deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
 
export async function signup(_state: FormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { name, email, password } = validatedFields.data
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
            if (data.details?.length) {
                const errors: NonNullable<FormState>['errors'] = {}
                for (const detail of data.details as { field: string; message: string }[]) {
                    const field = detail.field as keyof typeof errors
                    errors[field] = [...(errors[field] ?? []), detail.message]
                }
                return { errors, message: data.message ?? 'Veuillez corriger les champs invalides.' }
            }
            return { message: data.message ?? 'Une erreur est survenue.' }
        }

        const user = data.data
        if (!user) {
            return {
            message: 'Une erreur est survenue lors de la création de compte. Veuillez réessayer.',
            }
        }
        await createSession(user.token)
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }
    return redirect('/dashboard')
}

export async function login(_state: FormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
            if (data.details?.length) {
                const errors: NonNullable<FormState>['errors'] = {}
                for (const detail of data.details as { field: string; message: string }[]) {
                    const field = detail.field as keyof typeof errors
                    errors[field] = [...(errors[field] ?? []), detail.message]
                }
                return { errors, message: data.message }
            }
            return { message: data.message ?? 'Une erreur est survenue.' }
        }
        const user = data.data
        if (!user) {
            return {
            message: 'Une erreur est survenue lors de la création de compte. Veuillez réessayer.',
            }
        }
        await createSession(user.token)
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }
    return redirect('/dashboard')
}

export async function logout() {
    await deleteSession()
    return redirect('/login')
}