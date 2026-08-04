import { notFound } from 'next/navigation'
import { getProject, getProjectTasks, getUser } from '@/app/lib/dal'
import { TaskView } from '@/components/TaskView'
import { EditProjectModal } from '@/components/EditProjectModal'
import { DeleteProjectButton } from '@/components/DeleteProjectButton'
import { ContributorsManager } from '@/components/ContributorsManager'
import { CreateTaskModal } from '@/components/CreateTaskModal'
import { canEditProject, canDeleteProject, canManageContributors, canManageTasks, getAssignableMembers } from '@/app/lib/permissions'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [project, user] = await Promise.all([getProject(id), getUser()])

    if (!project) {
        notFound()
    }

    const tasks = await getProjectTasks(id)
    const canEditTasks = canManageTasks(project.userRole)
    const assignableMembers = getAssignableMembers(project)

    return (
        <div>
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between">
                    <h1>{project.name}</h1>
                    <div className="flex items-center gap-4">
                        {canEditProject(project.userRole) && <EditProjectModal project={project} />}
                        {canDeleteProject(project.userRole) && <DeleteProjectButton projectId={project.id} />}
                    </div>
                </div>
                <p className="text-(--neutral-grey)">{project.description}</p>
                <div className="flex items-center gap-4 text-sm text-(--neutral-grey)">
                    <span>Propriétaire : {project.owner.name}</span>
                    <div className="flex -space-x-2">
                        {project.members.map((member) => (
                            <span
                                key={member.id}
                                title={member.user.name}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-(--light-orange) border-2 border-white text-[10px]"
                            >
                                {member.user.name.slice(0, 2).toUpperCase()}
                            </span>
                        ))}
                    </div>
                </div>
                {canManageContributors(project.userRole) && <ContributorsManager project={project} />}
                {canEditTasks && <CreateTaskModal projectId={project.id} members={assignableMembers} />}
            </div>
            <TaskView
                tasks={tasks}
                members={assignableMembers}
                canManageTasks={canEditTasks}
                currentUserId={user?.user.id}
            />
        </div>
    )
}