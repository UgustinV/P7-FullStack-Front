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

export function canManageTasks(role?: Role) {
    return role === 'OWNER' || role === 'ADMIN' || role === 'CONTRIBUTOR'
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