import * as z from 'zod'

export const SignupFormSchema = z.object({
    name: z
    .string()
    .min(2, { error: 'Le nom doit contenir au moins 2 caractères.' })
    .trim(),
    email: z.email({ error: 'Veuillez entrer un email valide.' }).trim(),
    password: z
    .string()
    .min(8, { error: 'Doit contenir au moins 8 caractères.' })
    .regex(/[a-zA-Z]/, { error: 'Doit contenir au moins une lettre.' })
    .regex(/[0-9]/, { error: 'Doit contenir au moins un chiffre.' })
    .regex(/[^a-zA-Z0-9]/, {
        error: 'Doit contenir au moins un caractère spécial.',
    })
    .trim(),
})

export type FormState =
| {
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
    }
    message?: string
}
| undefined

export type SessionPayload = {
    token: string
    expiresAt: Date
}