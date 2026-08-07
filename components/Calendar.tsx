import { TaskCard } from '@/components/TaskCard'
import { Task, ProjectMember } from '@/app/lib/definitions'
import Image from 'next/image'

export function Calendar({
    tasks,
    members,
    currentUserId,
    projects = {},
}: {
    tasks: Task[]
    members: ProjectMember[]
    currentUserId?: string
    projects?: Record<string, string>
}) {
    return (
        <div className="flex flex-col w-full gap-4 bg-white rounded-lg px-15 py-10 border border-(--form-grey)">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col gap-1.5 mb-4">
                    <h2 className="text-lg font-semibold">Mes tâches assignées</h2>
                    <h3 className='text-[16px] text-(--neutral-grey)'>Par ordre de priorité</h3>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="w-full border border-(--form-grey) rounded-lg pl-8 pr-[6vw] py-6 text-sm"
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
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} members={members} currentUserId={currentUserId} projects={projects} />
            ))}
        </div>
    )
}