import { Task, STATUS_LABELS } from '@/app/lib/definitions'

export function TaskCard({ task }: { task: Task }) {
    const dueDate = new Date(task.dueDate).toLocaleDateString('fr-FR')

    return (
        <div className="flex flex-col gap-2 rounded-[10px] border border-(--form-grey) p-4">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold">{task.title}</h4>
                <span className="text-xs rounded-full px-2 py-1 bg-(--light-orange)">
                    {STATUS_LABELS[task.status]}
                </span>
            </div>
            <p className="text-sm">{task.description}</p>
            <div className="flex items-center justify-between text-xs text-(--form-grey)">
                <span>{dueDate}</span>
                <span>{task.comments.length} commentaire{task.comments.length > 1 ? 's' : ''}</span>
            </div>
        </div>
    )
}