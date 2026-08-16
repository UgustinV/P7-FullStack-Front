"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Calendar } from '@/components/Calendar'
import { List } from '@/components/List'
import { Task, ProjectMember, TaskStatus } from '@/app/lib/definitions'

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
}) {
    const [view, setView] = useState<View>('list')
    const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "">("")
    const [searchQuery, setSearchQuery] = useState('')

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col w-full gap-2 lg:gap-7.5 lg:mb-12 bg-white lg:rounded-[10px] lg:p-6 border-t lg:border border-(--form-grey)">
            <div className="flex flex-col px-6 pt-6 lg:flex-row justify-between items-center">
                <div className="flex flex-col justify-start w-full lg:w-fit lg:justify-center mb-2 lg:mb-0 items-start">
                    <h2 className="text-lg font-semibold">Tâches</h2>
                    <h3>Par ordre de priorité</h3>
                </div>
                <div className="flex flex-col lg:flex-row w-full lg:w-fit gap-2">
                    <button
                        onClick={() => setView('list')}
                        aria-pressed={view === 'list'}
                        className={`flex flex-row items-center gap-2.5 text-(--dark-orange) px-4 py-3.5 rounded-lg ${view === 'list' ? 'bg-(--light-orange)' : 'bg-white cursor-pointer'}`}
                    >
                        <Image src="/list-icon.svg" alt="Icone de case cochée" width={16} height={16} className="w-4 h-4" />
                        <span>Liste</span>
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        aria-pressed={view === 'calendar'}
                        className={`flex flex-row items-center gap-2.5 text-(--dark-orange) px-4 py-3.5 rounded-lg ${view === 'calendar' ? 'bg-(--light-orange)' : 'bg-white cursor-pointer'}`}
                    >
                        <Image src="/calendar-icon.svg" alt="Icone de calendrier" width={16} height={16} className="w-4 h-4" />
                        <span>Calendrier</span>
                    </button>
                    <label htmlFor="task-status" className="sr-only">Trier les status</label>
                    <select
                        id="task-status"
                        className="border border-(--form-grey) text-(--neutral-grey) rounded-lg px-8 py-3.75 cursor-pointer"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')}
                    >
                        <option value="">Status</option>
                        <option value="TODO">À faire</option>
                        <option value="IN_PROGRESS">En cours</option>
                        <option value="DONE">Terminé</option>
                    </select>
                    <div className="flex flex-row gap-4">
                    <div className="relative w-full">
                        <label htmlFor="task-search" className="sr-only">Rechercher une tâche</label>
                        <input
                            id="task-search"
                            type="text"
                            className="w-full border border-(--form-grey) rounded-lg pl-8 pr-[6vw] py-4 lg:py-6 text-sm"
                            placeholder="Rechercher une tâche"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                : <List isEditView={true} tasks={selectedStatus !== "" ? filteredTasks.filter(task => task.status === selectedStatus) : filteredTasks} members={members} currentUserId={currentUserId} projects={projects} />}
        </div>
    )
}