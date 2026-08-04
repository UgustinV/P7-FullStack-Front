'use server'
import { CreateTaskFormSchema, UpdateTaskFormSchema, TaskFormState, CommentFormState } from '@/app/lib/definitions'
import { verifySession } from '@/app/lib/dal'
import { revalidatePath } from 'next/cache'

export async function createTask(projectId: string, _state: TaskFormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const session = await verifySession()

    const validatedFields = CreateTaskFormSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        dueDate: formData.get('dueDate'),
        assigneeIds: formData.getAll('assigneeIds'),
    })

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }
    const { title, description, priority, dueDate, assigneeIds } = validatedFields.data

    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ title, description, priority, dueDate, assigneeIds }),
        })

        const data = await response.json()
        if (!response.ok) {
            return { message: data.message ?? 'Une erreur est survenue.' }
        }
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
}

export async function updateTask(projectId: string, taskId: string, _state: TaskFormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const session = await verifySession()

    const validatedFields = UpdateTaskFormSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        priority: formData.get('priority'),
        dueDate: formData.get('dueDate'),
        assigneeIds: formData.getAll('assigneeIds'),
    })

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }
    const { title, description, status, priority, dueDate, assigneeIds } = validatedFields.data

    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ title, description, status, priority, dueDate, assigneeIds }),
        })

        const data = await response.json()
        if (!response.ok) {
            return { message: data.message ?? 'Une erreur est survenue.' }
        }
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
}

export async function deleteTask(projectId: string, taskId: string) {
    const API_URL = process.env.API_URL
    const session = await verifySession()

    try {
        await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
        })
    } catch {
        return
    }

    revalidatePath(`/projects/${projectId}`)
}

export async function createComment(projectId: string, taskId: string, _state: CommentFormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const session = await verifySession()
    const content = formData.get('content') as string

    if (!content?.trim()) {
        return { errors: { content: ['Le commentaire ne peut pas être vide.'] } }
    }

    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ content }),
        })

        const data = await response.json()
        if (!response.ok) {
            return { message: data.message ?? 'Une erreur est survenue.' }
        }
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
}

export async function updateComment(projectId: string, taskId: string, commentId: string, _state: CommentFormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const session = await verifySession()
    const content = formData.get('content') as string

    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ content }),
        })

        const data = await response.json()
        if (!response.ok) {
            return { message: data.message ?? 'Une erreur est survenue.' }
        }
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
}

export async function deleteComment(projectId: string, taskId: string, commentId: string) {
    const API_URL = process.env.API_URL
    const session = await verifySession()

    try {
        await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
        })
    } catch {
        return
    }

    revalidatePath(`/projects/${projectId}`)
}