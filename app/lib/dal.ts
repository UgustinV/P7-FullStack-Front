import 'server-only'
import { cache } from 'react'
import type { Task, Project } from '@/app/lib/definitions'
import { redirect } from 'next/navigation'
 
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
 
export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)
    
    if (!session?.token) {
        redirect('/login')
    }
    
    return { isAuth: true, token: session.token }
})

export const getUser = cache(async () => {
    const API_URL = process.env.API_URL
    const session = await verifySession()
    if (!session) return null
    
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
        })

        const data = await response.json()
        return data.data
    } catch (error) {
        console.log('Failed to fetch user')
        return null
    }
})

export const getAssignedTasks = cache(async (): Promise<Task[]> => {
    const API_URL = process.env.API_URL
    const session = await verifySession()
    if (!session) return []

    try {
        const response = await fetch(`${API_URL}/dashboard/assigned-tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
        })

        const data = await response.json()
        return data.data?.tasks ?? []
    } catch (error) {
        console.log('Failed to fetch assigned tasks')
        return []
    }
})

export const getProjectsWithTasks = cache(async (): Promise<Project[]> => {
    const API_URL = process.env.API_URL
    const session = await verifySession()
    if (!session) return []

    try {
        const response = await fetch(`${API_URL}/dashboard/projects-with-tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
        })

        const data = await response.json()
        return data.data?.projects ?? []
    } catch (error) {
        console.log('Failed to fetch projects with tasks')
        return []
    }
})
