import { TaskCard } from '@/components/TaskCard'
import { Task, ProjectMember } from '@/app/lib/definitions'

export function KanbanColumn({
    title,
    tasks,
    members,
    canManageTasks,
    currentUserId,
    projects = {},
}: {
    title: string
    tasks: Task[]
    members: ProjectMember[]
    canManageTasks: boolean
    currentUserId?: string
    projects?: Record<string, string>
}) {
    return (
        <section className="flex flex-col w-full gap-4">
            <h3>{title}</h3>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} members={members} canManageTasks={canManageTasks} currentUserId={currentUserId} projects={projects} />
            ))}
        </section>
    )
}