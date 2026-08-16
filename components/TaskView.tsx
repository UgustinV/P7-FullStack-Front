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
            <div className="flex flex-row gap-4 w-full px-2.5 lg:px-0">
                <button
                    onClick={() => setView('list')}
                    aria-pressed={view === 'list'}
                    className={`flex flex-row w-1/2 lg:w-fit justify-center items-center gap-2.5 text-sm lg:text-lg text-(--dark-orange) py-2 lg:px-4 lg:py-3.5 rounded-lg ${view === 'list' ? 'bg-(--light-orange)' : 'bg-white cursor-pointer'}`}
                >
                    <Image src="/list-icon.svg" alt="Icone de liste" width={16} height={16} className="w-4 h-4" />
                    <span>Liste</span>
                </button>
                <button
                    onClick={() => setView('kanban')}
                    aria-pressed={view === 'kanban'}
                    className={`flex flex-row w-1/2 lg:w-fit justify-center items-center gap-2.5 text-sm lg:text-lg text-(--dark-orange) py-2 lg:px-4 lg:py-3.5 rounded-lg ${view === 'kanban' ? 'bg-(--light-orange)' : 'bg-white cursor-pointer'}`}
                >
                    <Image src="/calendar-icon.svg" alt="Icone de calendrier" width={16} height={16} className="w-4 h-4" />
                    <span>Kanban</span>
                </button>
            </div>
            {view === 'kanban'
                ? <Kanban tasks={tasks} members={members} currentUserId={currentUserId} projects={projects} />
                : <List tasks={tasks} members={members} currentUserId={currentUserId} projects={projects} />}
        </div>
    )
}