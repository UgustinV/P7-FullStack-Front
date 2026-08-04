import { KanbanColumn } from '@/components/KanbanColumn'
import { Task, TaskStatus, STATUS_LABELS, ProjectMember } from '@/app/lib/definitions'

const BOARD_COLUMNS: Exclude<TaskStatus, 'CANCELLED'>[] = ['TODO', 'IN_PROGRESS', 'DONE']

export function Kanban({
    tasks,
    members,
    canManageTasks,
    currentUserId,
}: {
    tasks: Task[]
    members: ProjectMember[]
    canManageTasks: boolean
    currentUserId?: string
}) {
    return (
        <div className="flex flex-row w-full justify-around items-start gap-5">
            {BOARD_COLUMNS.map((status) => (
                <KanbanColumn
                    key={status}
                    title={STATUS_LABELS[status]}
                    tasks={tasks.filter((task) => task.status === status)}
                    members={members}
                    canManageTasks={canManageTasks}
                    currentUserId={currentUserId}
                />
            ))}
        </div>
    )
}