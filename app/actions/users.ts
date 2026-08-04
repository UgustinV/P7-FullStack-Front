'use server'
import { verifySession } from '@/app/lib/dal'
import { User } from '@/app/lib/definitions'

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