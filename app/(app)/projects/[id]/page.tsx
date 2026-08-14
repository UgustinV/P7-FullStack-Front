import { notFound } from 'next/navigation'
import { getProject, getProjectTasks, getUser } from '@/app/lib/dal'
import Image from 'next/image'
import { TaskEditView } from '@/components/TaskEditView'
import { EditProjectModal } from '@/components/EditProjectModal'
import { DeleteProjectButton } from '@/components/DeleteProjectButton'
import { CreateTaskModal } from '@/components/CreateTaskModal'
import { canEditProject, canDeleteProject, getAssignableMembers, getUserRole } from '@/app/lib/permissions'
import Link from 'next/dist/client/link'
import { getInitials } from '@/app/lib/utils'

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
        <div className="lg:mx-25">
            <div className="flex flex-col gap-3.5 mb-3.5 lg:mb-8.5 mt-2 lg:mt-23">
                <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row items-center justify-between mx-2 lg:mx-0 lg:mb-12.5">
                    <div className="lg:relative flex flex-col gap-2">
                        <Link className="lg:-translate-x-[calc(100%+16px)] lg:top-0 lg:absolute flex items-center lg:px-4 lg:py-5.5 w-fit lg:w-auto lg:mr-4 rounded-[10px] lg:bg-white lg:border border-(--form-grey)" href="/projects">
                            <Image src="/back-arrow-icon.svg" alt="Back" width={24} height={12} className='h-3 w-6' />
                        </Link>
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
                            <h1 className='text-xl lg:text-2xl font-semibold'>{project.name}</h1>
                            <div className="flex items-center gap-4">
                                {canEditProject(userRole) && <EditProjectModal project={project} />}
                                {canDeleteProject(userRole) && <DeleteProjectButton projectId={project.id} />}
                            </div>
                        </div>
                        <p className="text-(--neutral-grey) lg:mt-3.5">{project.description}</p>
                    </div>
                    <CreateTaskModal projectId={project.id} members={assignableMembers} />
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-(--neutral-grey) bg-[#F3F4F6] lg:rounded-[10px] px-6 py-4">
                    <div className="flex flex-col lg:flex-row items-center gap-2">
                        <span className='text-black text-lg font-semibold'>Contributeurs</span>
                        <span>{project.members.length + 1} personnes</span>
                    </div>
                    <div className="grid grid-cols-2 lg:flex gap-2">
                        <div className="flex items-center gap-1">
                            <span
                                key={project.owner.id}
                                title={project.owner.name}
                                className="flex items-center justify-center w-6.25 h-6.25 rounded-full bg-(--light-orange) text-[10px] text-black"
                            >
                                {getInitials(project.owner.name)}
                            </span>
                            <span className='flex items-center h-6.25 rounded-full bg-(--light-orange) text-(--dark-orange) px-2'>Propriétaire</span>
                        </div>
                        {project.members.map((member) => (
                            <div key={member.user.id} className="flex items-center gap-1">
                                <span
                                    key={member.user.id}
                                    title={member.user.name}
                                    className="flex items-center justify-center w-6.25 h-6.25 rounded-full bg-(--form-grey) text-[10px] text-black"
                                >
                                    {getInitials(member.user.name)}
                                </span>
                                <span className="flex items-center h-6.25 rounded-full bg-(--form-grey) px-2">{member.user.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <TaskEditView
                tasks={tasks}
                members={assignableMembers}
                currentUserId={user?.user.id}
            />
        </div>
    )
}