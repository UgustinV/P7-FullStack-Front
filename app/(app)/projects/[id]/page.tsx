import { notFound } from 'next/navigation'
import { getProject, getProjectTasks, getUser } from '@/app/lib/dal'
import Image from 'next/image'
import { TaskEditView } from '@/components/TaskEditView'
import { EditProjectModal } from '@/components/EditProjectModal'
import { DeleteProjectButton } from '@/components/DeleteProjectButton'
import { ContributorsManager } from '@/components/ContributorsManager'
import { CreateTaskModal } from '@/components/CreateTaskModal'
import { canEditProject, canDeleteProject, canManageContributors, getAssignableMembers, getUserRole } from '@/app/lib/permissions'
import Link from 'next/dist/client/link'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [project, user] = await Promise.all([getProject(id), getUser()])

    if (!project) {
        notFound()
    }

    const tasks = await getProjectTasks(id)
    const userRole = getUserRole(project, user?.user.id)
    const assignableMembers = getAssignableMembers(project)

    return (
        <div className="mx-25">
            <div className="flex flex-col gap-3.5 mb-4 mt-23">
                <div className="flex items-center justify-between mb-12.5">
                    <div className="relative">
                        <Link className="-translate-x-[calc(100%+16px)] top-0 absolute flex items-center px-4 py-5.5 mr-4 rounded-[10px] bg-white border border-(--form-grey)" href="/projects">
                            <Image src="/back-arrow-icon.svg" alt="Back" width={24} height={12} className='h-3 w-6' />
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className='text-2xl font-semibold'>{project.name}</h1>
                            <div className="flex items-center gap-4">
                                {canEditProject(userRole) && <EditProjectModal project={project} />}
                                {canDeleteProject(userRole) && <DeleteProjectButton projectId={project.id} />}
                            </div>
                        </div>
                        <p className="text-(--neutral-grey) mt-3.5">{project.description}</p>
                    </div>
                    <CreateTaskModal projectId={project.id} members={assignableMembers} />
                </div>
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
                {canManageContributors(userRole) && <ContributorsManager project={project} />}
            </div>
            <TaskEditView
                tasks={tasks}
                members={assignableMembers}
                currentUserId={user?.user.id}
            />
        </div>
    )
}