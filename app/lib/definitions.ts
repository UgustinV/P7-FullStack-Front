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

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type User = {
    id: string
    email: string
    name: string
    createdAt: string
    updatedAt: string
}

export type TaskAssignee = {
    id: string
    userId: string
    taskId: string
    user: User
    assignedAt: string
}

export type TaskComment = {
    id: string
    content: string
    taskId: string
    authorId: string
    author: User
    createdAt: string
    updatedAt: string
}

export type Task = {
    id: string
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    dueDate: string
    projectId: string
    creatorId: string
    assignees: TaskAssignee[]
    comments: TaskComment[]
    createdAt: string
    updatedAt: string
}

export type ProjectMember = {
    id: string
    role: 'OWNER' | 'MEMBER' // only OWNER seen in the sample, adjust if there are more roles
    user: User
    joinedAt: string
}

export type Project = {
    id: string
    name: string
    description: string
    ownerId: string
    owner: User
    members: ProjectMember[]
    tasks?: Task[]
    createdAt: string
    updatedAt: string
}

// Display label for every status; CANCELLED is excluded from the board columns (see Kanban.tsx)
export const STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: 'A faire',
    IN_PROGRESS: 'En cours',
    DONE: 'Terminés',
    CANCELLED: 'Annulée',
}