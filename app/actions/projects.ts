'use server'
import { verifySession } from '@/app/lib/dal'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreateProjectFormSchema, UpdateProjectFormSchema, ProjectFormState, ContributorFormState } from '@/app/lib/definitions'

export async function updateProject(projectId: string, _state: ProjectFormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const session = await verifySession()

    const validatedFields = UpdateProjectFormSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
    })

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors }
    }
    const { name, description } = validatedFields.data

    try {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ name, description }),
        })

        const data = await response.json()
        if (!response.ok) {
            return { message: data.message ?? 'Une erreur est survenue.' }
        }
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }

    revalidatePath(`/projects/${projectId}`)
    revalidatePath('/projects')
    return { success: true }
}

export async function deleteProject(projectId: string) {
    const API_URL = process.env.API_URL
    const session = await verifySession()

    try {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
        })
        if (!response.ok) return
    } catch {
        return
    }

    revalidatePath('/projects')
    redirect('/projects')
}

export async function addContributor(projectId: string, _state: ContributorFormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const session = await verifySession()
    const email = formData.get('email') as string
    const role = (formData.get('role') as string) || 'CONTRIBUTOR'

    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/contributors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ email, role }),
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

export async function removeContributor(projectId: string, userId: string) {
    const API_URL = process.env.API_URL
    const session = await verifySession()

    try {
        await fetch(`${API_URL}/projects/${projectId}/contributors/${userId}`, {
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
export async function createProject(_state: ProjectFormState, formData: FormData) {
    const API_URL = process.env.API_URL
    const session = await verifySession()

    const validatedFields = CreateProjectFormSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        contributors: formData.getAll('contributors'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { name, description, contributors } = validatedFields.data

    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            body: JSON.stringify({ name, description, contributors: contributors ?? [] }),
        })

        const data = await response.json()

        if (!response.ok) {
            if (data.details?.length) {
                const errors: NonNullable<ProjectFormState>['errors'] = {}
                for (const detail of data.details as { field: string; message: string }[]) {
                    const field = detail.field as keyof typeof errors
                    errors[field] = [...(errors[field] ?? []), detail.message]
                }
                return { errors, message: data.message }
            }
            return { message: data.message ?? 'Une erreur est survenue.' }
        }
    } catch {
        return { message: 'Une erreur est survenue. Veuillez réessayer.' }
    }

    revalidatePath('/projects')
    return { success: true }
}