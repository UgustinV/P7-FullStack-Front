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
            Non implémenté pour le moment
        </div>
    )
}