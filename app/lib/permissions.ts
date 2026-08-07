import { Project, ProjectMember } from '@/app/lib/definitions'

type Role = ProjectMember['role']

export function canEditProject(role?: Role) {
    return role === 'OWNER' || role === 'ADMIN'
}

export function canDeleteProject(role?: Role) {
    return role === 'OWNER'
}

export function canManageContributors(role?: Role) {
    return role === 'OWNER' || role === 'ADMIN'
}

export function getAssignableMembers(project: Project): ProjectMember[] {
    const hasOwnerMember = project.members.some((member) => member.user.id === project.owner.id)
    if (hasOwnerMember) return project.members

    return [
        {
            id: `owner-${project.owner.id}`, // synthetic id: owner has no ProjectMember row
            role: 'OWNER',
            user: project.owner,
            joinedAt: project.createdAt,
        },
        ...project.members,
    ]
}

export function getUserRole(project: Project, userId?: string): Role | undefined {
    if (!userId) return undefined
    if (project.ownerId === userId) return 'OWNER'
    return project.members.find((member) => member.user.id === userId)?.role
}