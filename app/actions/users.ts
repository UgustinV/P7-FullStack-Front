'use server'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/app/lib/dal'
import { User, UpdateAccountFormSchema, AccountFormState } from '@/app/lib/definitions'

export async function searchUsers(query: string): Promise<User[]> {
    if (!query.trim()) return []
    const API_URL = process.env.API_URL
    const session = await verifySession()

    try {
        const response = await fetch(`${API_URL}/users/search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
        })

        const data = await response.json()
        return data.data?.users ?? []
    } catch {
        return []
    }
}

export async function updateAccount(_state: AccountFormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const session = await verifySession()

    const validatedFields = UpdateAccountFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
    })

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }
    const { name, email, currentPassword, newPassword } = validatedFields.data

    try {
        const profileResponse = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ name, email }),
        })
        const profileData = await profileResponse.json()
        if (!profileResponse.ok) {
            return { message: profileData.message ?? 'Une erreur est survenue.' }
        }

        if (newPassword) {
            const passwordResponse = await fetch(`${API_URL}/auth/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            const passwordData = await passwordResponse.json()
            if (!passwordResponse.ok) {
                return { message: passwordData.message ?? 'Une erreur est survenue.' }
            }
        }
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }

    revalidatePath('/account')
    return { success: true }
}