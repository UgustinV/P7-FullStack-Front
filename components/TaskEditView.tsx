"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Calendar } from '@/components/Calendar'
import { List } from '@/components/List'
import { Task, ProjectMember } from '@/app/lib/definitions'

type View = 'calendar' | 'list'

export function TaskEditView({
    tasks,
    members = [],
    currentUserId,
    projects = {},
}: {
    tasks: Task[]
    members?: ProjectMember[]
    currentUserId?: string
    projects?: Record<string, string>
    isEditView?: boolean
}) {
    const [view, setView] = useState<View>('list')

    return (
        <div className="flex flex-col w-full gap-7.5 mb-12">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col justify-center items-start">
                    <h2 className="text-lg font-semibold">Tâches</h2>
                    <h3>Par ordre de priorité</h3>
                </div>
                <div className="flex flex-row gap-4">
                    <button
                        onClick={() => setView('list')}
                        className={`flex flex-row items-center gap-2.5 text-(--dark-orange) px-4 py-3.5 rounded-lg ${view === 'list' ? 'bg-(--light-orange)' : 'bg-white cursor-pointer'}`}
                    >
                        <Image src="/list-icon.svg" alt="Liste" width={16} height={16} className="w-4 h-4" />
                        <span>Liste</span>
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`flex flex-row items-center gap-2.5 text-(--dark-orange) px-4 py-3.5 rounded-lg ${view === 'calendar' ? 'bg-(--light-orange)' : 'bg-white cursor-pointer'}`}
                    >
                        <Image src="/calendar-icon.svg" alt="Calendrier" width={16} height={16} className="w-4 h-4" />
                        <span>Calendrier</span>
                    </button>
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
            </div>
            {view === 'calendar'
                ? <Calendar tasks={tasks} members={members} currentUserId={currentUserId} projects={projects} />
                : <List isEditView={true} tasks={tasks} members={members} currentUserId={currentUserId} projects={projects} />}
        </div>
    )
}