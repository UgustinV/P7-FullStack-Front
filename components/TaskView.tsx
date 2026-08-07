"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Kanban } from '@/components/Kanban'
import { List } from '@/components/List'
import { Task, ProjectMember } from '@/app/lib/definitions'

type View = 'kanban' | 'list'

export function TaskView({
    tasks,
    members = [],
    currentUserId,
    projects = {},
}: {
    tasks: Task[]
    members?: ProjectMember[]
    currentUserId?: string
    projects?: Record<string, string>
}) {
    const [view, setView] = useState<View>('list')

    return (
        <div className="flex flex-col w-full gap-7.5 mb-12">
            <div className="flex flex-row gap-4">
                <button
                    onClick={() => setView('list')}
                    className={`flex flex-row items-center gap-2.5 text-(--dark-orange) px-4 py-3.5 rounded-lg ${view === 'list' ? 'bg-(--light-orange)' : 'bg-white cursor-pointer'}`}
                >
                    <Image src="/list-icon.svg" alt="Liste" width={16} height={16} className="w-4 h-4" />
                    <span>Liste</span>
                </button>
                <button
                    onClick={() => setView('kanban')}
                    className={`flex flex-row items-center gap-2.5 text-(--dark-orange) px-4 py-3.5 rounded-lg ${view === 'kanban' ? 'bg-(--light-orange)' : 'bg-white cursor-pointer'}`}
                >
                    <Image src="/calendar-icon.svg" alt="Kanban" width={16} height={16} className="w-4 h-4" />
                    <span>Kanban</span>
                </button>
            </div>
            {view === 'kanban'
                ? <Kanban tasks={tasks} members={members} currentUserId={currentUserId} projects={projects} />
                : <List tasks={tasks} members={members} currentUserId={currentUserId} projects={projects} />}
        </div>
    )
}