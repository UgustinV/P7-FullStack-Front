import { KanbanColumn } from '@/components/KanbanColumn'
import { Task, TaskStatus, STATUS_LABELS } from '@/app/lib/definitions'

const BOARD_COLUMNS: Exclude<TaskStatus, 'CANCELLED'>[] = ['TODO', 'IN_PROGRESS', 'DONE']

export function Kanban({ tasks }: { tasks: Task[] }) {
    return (
        <div className="flex flex-row w-full justify-around items-start gap-5">
            {BOARD_COLUMNS.map((status) => (
                <KanbanColumn
                    key={status}
                    title={STATUS_LABELS[status]}
                    tasks={tasks.filter((task) => task.status === status)}
                />
            ))}
        </div>
    )
}