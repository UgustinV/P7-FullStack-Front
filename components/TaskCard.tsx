'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Task, ProjectMember, STATUS_LABELS, STATUS_STYLES, TaskPriority } from '@/app/lib/definitions'
import { CommentsSection } from '@/components/CommentsSection'
import { Modal } from '@/components/Modal'

const PRIORITY_LABELS: Record<TaskPriority, string> = {
    LOW: 'Basse',
    MEDIUM: 'Moyenne',
    HIGH: 'Haute',
    URGENT: 'Urgente',
}

export function TaskCard({
    task,
    members = [],
    currentUserId,
    projects = {},
}: {
    task: Task
    members?: ProjectMember[]
    currentUserId?: string
    projects?: Record<string, string>
}) {
    const [open, setOpen] = useState(false)
    const dueDate = new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    return (
        <div className="flex flex-row justify-between px-2 py-2 lg:gap-4.5 lg:px-10 lg:py-6.25 border-y lg:border border-(--form-grey) lg:rounded-lg bg-white">
            <div className="w-full flex flex-col items-center lg:block">
                <div className="flex flex-col justify-start items-start mb-8">
                    <div className="flex flex-row w-full justify-between items-center mb-2">
                        <h4 className="font-semibold text-[16px] lg:text-lg">{task.title}</h4>
                        <span className={`text-xs rounded-full px-4 py-1 ${STATUS_STYLES[task.status]}`}>
                            {STATUS_LABELS[task.status]}
                        </span>
                    </div>
                    <p className="text-xs lg:text-sm text-left text-(--neutral-grey)">{task.description}</p>
                </div>
                <div className="flex items-center gap-2 lg:gap-3.75 text-xs text-(--neutral-grey) mb-8">
                    <div className="flex items-center gap-2">
                        <Image src="/folder-icon.svg" alt="project icon" width={16} height={16} className="w-4 h-4" />
                        <span>{projects[task.projectId] ?? task.projectId}</span>
                    </div>
                    <div className='border-r border-[#9CA3AF] h-2.75'></div>
                    <div className="flex items-center gap-2">
                        <Image src="/grey-calendar-icon.svg" alt="calendar icon" width={16} height={16} className="w-4 h-4" />
                        <span>{dueDate}</span>
                    </div>
                    <div className='border-r border-[#9CA3AF] h-2.75'></div>
                    <div className="flex items-center gap-2">
                        <Image src="/comment-icon.svg" alt="comment icon" width={16} height={16} className="w-4 h-4" />
                        <span>{task.comments.length}</span>
                    </div>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="py-2 w-full md:w-fit md:px-12 md:py-3.75 rounded-[10px] bg-foreground text-sm lg:text-[16px] text-white cursor-pointer"
                >
                    Voir
                </button>
            </div>
            {open && (
                <TaskDetailModal
                    task={task}
                    members={members}
                    currentUserId={currentUserId}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    )
}

function TaskDetailModal({
    task,
    currentUserId,
    onClose,
}: {
    task: Task
    members: ProjectMember[]
    currentUserId?: string
    onClose: () => void
}) {

    return (
        <Modal open={true} onClose={onClose} title={task.title}>
            <p>{task.description}</p>
            <div className="flex gap-6 text-sm text-(--neutral-grey)">
                <span>Statut : {STATUS_LABELS[task.status]}</span>
                <span>Priorité : {PRIORITY_LABELS[task.priority]}</span>
                <span>Échéance : {new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="text-sm text-(--neutral-grey)">
                Assignés : {task.assignees.map((a) => a.user.name).join(', ') || 'Aucun'}
            </div>
            <CommentsSection
                projectId={task.projectId}
                taskId={task.id}
                comments={task.comments}
                currentUserId={currentUserId}
            />
        </Modal>
    )
}