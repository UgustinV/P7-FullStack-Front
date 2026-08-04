import { TaskCard } from '@/components/TaskCard'
import { Task } from '@/app/lib/definitions'

export function KanbanColumn({ title, tasks }: { title: string; tasks: Task[] }) {
    return (
        <section className="flex flex-col w-full gap-4">
            <h3>{title}</h3>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </section>
    )
}