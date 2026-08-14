import { TaskCard } from '@/components/TaskCard'
import { TaskEditCard } from '@/components/TaskEditCard'
import { Task, ProjectMember } from '@/app/lib/definitions'
import Image from 'next/image'

export function List({
    tasks,
    members,
    currentUserId,
    projects = {},
    isEditView = false,
}: {
    tasks: Task[]
    members: ProjectMember[]
    currentUserId?: string
    projects?: Record<string, string>
    isEditView?: boolean
}) {
    return (
        <div className={`flex flex-col w-full gap-4 ${isEditView ? '' : 'bg-white lg:rounded-lg lg:px-15 lg:py-10 border-t lg:border border-(--form-grey)'}`}>
            {!isEditView && (
                <div className="flex flex-col justify-start p-2.5 lg:p-0 lg:flex-row lg:justify-between lg:items-center">
                    <div className="flex flex-col gap-1.5 mb-4">
                        <h2 className="text-lg font-semibold">Mes tâches assignées</h2>
                        <h3 className='text-[16px] text-(--neutral-grey)'>Par ordre de priorité</h3>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full border border-(--form-grey) rounded-lg pl-8 pr-[6vw] py-3 lg:py-6 text-sm"
                                placeholder="Rechercher une tâche"
                                />
                            <Image
                                src="/search-icon.svg"
                                alt="search icon"
                                width={16}
                                height={16}
                                className="absolute right-[2vw] top-1/2 -translate-y-1/2 w-4 h-4"
                                />
                        </div>
                    </div>
                </div>
            )}
            {tasks.map((task) => (
                isEditView ? (
                    <TaskEditCard key={task.id} task={task} members={members} currentUserId={currentUserId} />
                ) : (
                    <TaskCard key={task.id} task={task} members={members} currentUserId={currentUserId} projects={projects} />
                )
            ))}
        </div>
    )
}