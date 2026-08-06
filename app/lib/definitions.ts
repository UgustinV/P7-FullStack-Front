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
    role: 'OWNER' | 'ADMIN' | 'CONTRIBUTOR'
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
    userRole?: ProjectMember['role']
    createdAt: string
    updatedAt: string
}

export const CreateProjectFormSchema = z.object({
    name: z.string().min(2, { error: 'Le nom doit contenir au moins 2 caractères.' }).trim(),
    description: z.string().trim().optional(),
    contributors: z.array(z.email({ error: 'Email invalide.' })).optional(),
})

export type ProjectFormState =
| {
    errors?: {
        name?: string[]
        description?: string[]
        contributors?: string[]
    }
    message?: string
    success?: boolean
}
| undefined


export const UpdateProjectFormSchema = z.object({
    name: z.string().min(2, { error: 'Le nom doit contenir au moins 2 caractères.' }).trim().optional(),
    description: z.string().trim().optional(),
})

export type ContributorFormState =
| {
    errors?: {
        email?: string[]
        role?: string[]
    }
    message?: string
    success?: boolean
}
| undefined

export const STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: 'A faire',
    IN_PROGRESS: 'En cours',
    DONE: 'Terminée',
    CANCELLED: 'Annulée',
}

export const CreateTaskFormSchema = z.object({
    title: z.string().min(2, { error: 'Le titre doit contenir au moins 2 caractères.' }).trim(),
    description: z.string().trim().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueDate: z.string().trim().optional(),
    assigneeIds: z.array(z.string()).optional(),
})

export const UpdateTaskFormSchema = z.object({
    title: z.string().min(2, { error: 'Le titre doit contenir au moins 2 caractères.' }).trim().optional(),
    description: z.string().trim().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueDate: z.string().trim().optional(),
    assigneeIds: z.array(z.string()).optional(),
})

export type TaskFormState =
| {
    errors?: {
        title?: string[]
        description?: string[]
        priority?: string[]
        dueDate?: string[]
        assigneeIds?: string[]
        status?: string[]
    }
    message?: string
    success?: boolean
}
| undefined

export type CommentFormState =
| {
    errors?: { content?: string[] }
    message?: string
    success?: boolean
}
| undefined