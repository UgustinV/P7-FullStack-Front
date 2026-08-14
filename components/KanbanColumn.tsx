import { TaskCard } from '@/components/TaskCard'
import { Task, ProjectMember } from '@/app/lib/definitions'

export function KanbanColumn({
    title,
    tasks,
    members,
    currentUserId,
    projects = {},
}: {
    title: string
    tasks: Task[]
    members: ProjectMember[]
    currentUserId?: string
    projects?: Record<string, string>
}) {
    return (
        <section className="flex flex-col w-full gap-4 bg-white px-6 py-10 lg:rounded-[10px]">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold">{title}</h3>
                <span className="text-sm text-(--neutral-grey) bg-(--form-grey) px-4 py-1 rounded-full">{tasks.length}</span>
            </div>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} members={members} currentUserId={currentUserId} projects={projects} />
            ))}
        </section>
    )
}