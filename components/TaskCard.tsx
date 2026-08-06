'use client'

import { useActionState, useState, useEffect } from 'react'
import Image from 'next/image'
import { updateTask, deleteTask, createComment, updateComment, deleteComment } from '@/app/actions/tasks'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Button } from '@/components/Button'
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
    CANCELLED: 'bg-(--success-green-light) text-(--success-green)',
}

export function TaskCard({
    task,
    members = [],
    canManageTasks = false,
    currentUserId,
    projects = {},
}: {
    task: Task
    members?: ProjectMember[]
    canManageTasks?: boolean
    currentUserId?: string
    projects?: Record<string, string>
}) {
    const [open, setOpen] = useState(false)
    const dueDate = new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    return (
        <div className="flex flex-row justify-between gap-4.5 px-10 py-6.25 border border-(--form-grey) rounded-lg bg-white">
            <div>
                <h4 className="font-semibold text-lg mb-2">{task.title}</h4>
                <p className="text-sm mb-8">{task.description}</p>
                <div className="flex items-center gap-3.75 text-xs text-(--neutral-grey)">
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
            </div>
            <div className="flex flex-col items-end justify-between gap-2">
                <span className={`text-xs rounded-full px-4 py-1 ${STATUS_STYLES[task.status]}`}>
                    {STATUS_LABELS[task.status]}
                </span>
                <button
                    onClick={() => setOpen(true)}
                    className="px-12 py-3.75 rounded-[10px] bg-foreground text-[16px] text-white cursor-pointer"
                >
                    Voir
                </button>
            </div>
            {open && (
                <TaskDetailModal
                    task={task}
                    members={members}
                    canManageTasks={canManageTasks}
                    currentUserId={currentUserId}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    )
}

function TaskDetailModal({
    task,
    members,
    canManageTasks,
    currentUserId,
    onClose,
}: {
    task: Task
    members: ProjectMember[]
    canManageTasks: boolean
    currentUserId?: string
    onClose: () => void
}) {
    const updateTaskWithIds = updateTask.bind(null, task.projectId, task.id)
    const [state, action, pending] = useActionState(updateTaskWithIds, undefined)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (state?.success) setEditing(false)
    }, [state])

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-[10px] p-8 w-140 max-h-[85vh] overflow-auto flex flex-col gap-5">
                {state?.message && <ErrorMessage message={state.message} />}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{task.title}</h2>
                    <button onClick={onClose} aria-label="Fermer" className="cursor-pointer">✕</button>
                </div>

                {editing ? (
                    <form action={action} className="flex flex-col gap-4">
                        <div className="flex flex-col w-full">
                            <label htmlFor="title" className="mb-2">Titre</label>
                            <input id="title" name="title" defaultValue={task.title} className="border border-(--form-grey) rounded px-3 py-3" />
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="description" className="mb-2">Description</label>
                            <textarea id="description" name="description" rows={3} defaultValue={task.description} className="border border-(--form-grey) rounded px-3 py-3" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col flex-1">
                                <label htmlFor="status" className="mb-2">Statut</label>
                                <select id="status" name="status" defaultValue={task.status} className="border border-(--form-grey) rounded px-3 py-3">
                                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col flex-1">
                                <label htmlFor="priority" className="mb-2">Priorité</label>
                                <select id="priority" name="priority" defaultValue={task.priority} className="border border-(--form-grey) rounded px-3 py-3">
                                    {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <label htmlFor="dueDate" className="mb-2">Échéance</label>
                            <input id="dueDate" name="dueDate" type="date" defaultValue={task.dueDate.slice(0, 10)} className="border border-(--form-grey) rounded px-3 py-3" />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="mb-2">Assignés</label>
                            <div className="flex flex-wrap gap-3">
                                {members.map((member) => (
                                    <label key={member.id} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            name="assigneeIds"
                                            value={member.user.id}
                                            defaultChecked={task.assignees.some((a) => a.user.id === member.user.id)}
                                        />
                                        {member.user.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button style="w-full py-3" content={pending ? 'Enregistrement...' : 'Enregistrer'} />
                            <button type="button" onClick={() => setEditing(false)} className="w-full cursor-pointer">Annuler</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <p>{task.description}</p>
                        <div className="flex gap-6 text-sm text-(--neutral-grey)">
                            <span>Statut : {STATUS_LABELS[task.status]}</span>
                            <span>Priorité : {PRIORITY_LABELS[task.priority]}</span>
                            <span>Échéance : {new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="text-sm text-(--neutral-grey)">
                            Assignés : {task.assignees.map((a) => a.user.name).join(', ') || 'Aucun'}
                        </div>
                        {canManageTasks && (
                            <div className="flex gap-4">
                                <button onClick={() => setEditing(true)} className="text-sm text-(--dark-orange) underline cursor-pointer">
                                    Modifier
                                </button>
                                <DeleteTaskButton projectId={task.projectId} taskId={task.id} onDeleted={onClose} />
                            </div>
                        )}
                    </>
                )}

                <CommentsSection
                    projectId={task.projectId}
                    taskId={task.id}
                    comments={task.comments}
                    canManageTasks={canManageTasks}
                    currentUserId={currentUserId}
                />
            </div>
        </div>
    )
}

function DeleteTaskButton({ projectId, taskId, onDeleted }: { projectId: string; taskId: string; onDeleted: () => void }) {
    async function handleDelete() {
        if (!confirm('Supprimer définitivement cette tâche ?')) return
        await deleteTask(projectId, taskId)
        onDeleted()
    }

    return (
        <button onClick={handleDelete} className="text-sm text-(--error-red) underline cursor-pointer">
            Supprimer
        </button>
    )
}

function CommentsSection({
    projectId,
    taskId,
    comments,
    canManageTasks,
    currentUserId,
}: {
    projectId: string
    taskId: string
    comments: TaskComment[]
    canManageTasks: boolean
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
                        canDelete={canManageTasks || comment.authorId === currentUserId}
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
    canDelete,
    canEdit,
}: {
    projectId: string
    taskId: string
    comment: TaskComment
    canDelete: boolean
    canEdit: boolean
}) {
    const updateCommentWithIds = updateComment.bind(null, projectId, taskId, comment.id)
    const [state, action, pending] = useActionState(updateCommentWithIds, undefined)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        if (state?.success) setEditing(false)
    }, [state])

    async function handleDelete() {
        if (!confirm('Supprimer ce commentaire ?')) return
        await deleteComment(projectId, taskId, comment.id)
    }

    return (
        <li className="flex flex-col gap-1 text-sm">
            <div className="flex items-center justify-between">
                <span className="font-medium">{comment.author.name}</span>
                <div className="flex gap-3 text-xs">
                    {canEdit && (
                        <button onClick={() => setEditing((v) => !v)} className="text-(--dark-orange) underline cursor-pointer">
                            Modifier
                        </button>
                    )}
                    {canDelete && (
                        <button onClick={handleDelete} className="text-(--error-red) underline cursor-pointer">
                            Supprimer
                        </button>
                    )}
                </div>
            </div>
            {editing ? (
                <form action={action} className="flex flex-col gap-2">
                    {state?.message && <ErrorMessage message={state.message} />}
                    <textarea name="content" rows={2} defaultValue={comment.content} className="border border-(--form-grey) rounded px-3 py-2" />
                    <button type="submit" className="self-end px-3 py-1 rounded bg-(--light-orange) text-xs cursor-pointer">
                        {pending ? '...' : 'Enregistrer'}
                    </button>
                </form>
            ) : (
                <p>{comment.content}</p>
            )}
        </li>
    )
}