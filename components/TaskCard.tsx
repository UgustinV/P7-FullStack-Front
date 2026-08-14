'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { createComment, updateComment } from '@/app/actions/tasks'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Task, TaskComment, ProjectMember, STATUS_LABELS, TaskPriority } from '@/app/lib/definitions'

const PRIORITY_LABELS: Record<TaskPriority, string> = {
    LOW: 'Basse',
    MEDIUM: 'Moyenne',
    HIGH: 'Haute',
    URGENT: 'Urgente',
}

const STATUS_STYLES: Record<Task['status'], string> = {
    TODO: 'bg-(--error-red-light) text-(--error-red)',
    IN_PROGRESS: 'bg-(--warning-orange-light) text-(--warning-orange)',
    DONE: 'bg-(--success-green-light) text-(--success-green)',
    CANCELLED: 'bg-(--error-red-light) text-(--error-red)',
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
                    <p className="text-xs lg:text-sm text-center text-(--neutral-grey)">{task.description}</p>
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
                    className="py-2 w-full lg:w-fit lg:px-12 lg:py-3.75 rounded-[10px] bg-foreground text-sm lg:text-[16px] text-white cursor-pointer"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className="bg-white rounded-[10px] p-8 w-140 max-h-[85vh] overflow-auto flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{task.title}</h2>
                    <button onClick={onClose} aria-label="Fermer" className="cursor-pointer">✕</button>
                </div>
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
            </div>
        </div>
    )
}

function CommentsSection({
    projectId,
    taskId,
    comments,
    currentUserId,
}: {
    projectId: string
    taskId: string
    comments: TaskComment[]
    currentUserId?: string
}) {
    const createCommentWithIds = createComment.bind(null, projectId, taskId)
    const [state, action, pending] = useActionState(createCommentWithIds, undefined)

    return (
        <div className="flex flex-col gap-3 border-t border-(--form-grey) pt-4">
            <h3 className="font-semibold">Commentaires</h3>
            <ul className="flex flex-col gap-3">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        projectId={projectId}
                        taskId={taskId}
                        comment={comment}
                        canDelete={comment.authorId === currentUserId}
                        canEdit={comment.authorId === currentUserId}
                    />
                ))}
            </ul>
            <form action={action} className="flex flex-col gap-2">
                {state?.message && <ErrorMessage message={state.message} />}
                <textarea
                    name="content"
                    rows={2}
                    placeholder="Ajouter un commentaire"
                    className="border border-(--form-grey) rounded px-3 py-2 text-sm"
                />
                {state?.errors?.content && <ErrorMessage message={state.errors.content.join(', ')} />}
                <button type="submit" className="self-end px-4 py-2 rounded bg-(--light-orange) text-sm cursor-pointer">
                    {pending ? 'Envoi...' : 'Commenter'}
                </button>
            </form>
        </div>
    )
}

function CommentItem({
    projectId,
    taskId,
    comment,
}: {
    projectId: string
    taskId: string
    comment: TaskComment
    canDelete: boolean
    canEdit: boolean
}) {
    const updateCommentWithIds = updateComment.bind(null, projectId, taskId, comment.id)

    return (
        <li className="flex flex-col gap-1 text-sm">
            <div className="flex items-center justify-between">
                <span className="font-medium">{comment.author.name}</span>
            </div>
            <p>{comment.content}</p>
        </li>
    )
}