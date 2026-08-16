'use client'

import { useActionState, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { updateTask, deleteTask } from '@/app/actions/tasks'
import { ErrorMessage } from '@/components/ErrorMessage'
import { Modal } from '@/components/Modal'
import { Task, ProjectMember, STATUS_LABELS, STATUS_STYLES } from '@/app/lib/definitions'
import { getInitials } from '@/app/lib/utils'
import { FormField } from '@/components/FormField'
import { CommentsSection } from '@/components/CommentsSection'

export function TaskEditCard({
    task,
    members = [],
    currentUserId,
}: {
    task: Task
    members?: ProjectMember[]
    currentUserId?: string
}) {
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [editing, setEditing] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const dueDate = new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="flex flex-col px-5 pt-3 lg:px-10 lg:py-6.25 border-y lg:border border-(--form-grey) lg:rounded-lg bg-white">
            <div className="flex flex-row justify-between gap-4.5">
                <div className="flex flex-col gap-4.5 w-full">
                    <div className="flex flex-row w-full justify-between items-center mb-3 lg:mb-6">
                        <div>
                            <div className="flex flex-col items-start justify-center lg:flex-row lg:justify-start lg:items-center gap-2 mb-2">
                                <h3 className="font-semibold text-sm lg:text-lg">{task.title}</h3>
                                <span className={`h-fit text-xs rounded-full px-4 py-1 ${STATUS_STYLES[task.status]}`}>
                                    {STATUS_LABELS[task.status]}
                                </span>
                            </div>
                            <p className="text-xs lg:text-sm">{task.description}</p>
                        </div>
                        <div className="flex items-center justify-between border border-(--form-grey) rounded-lg gap-2">
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen((v) => !v)}
                                    aria-label="Options"
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                    className="px-4 py-3 text-(--neutral-grey) cursor-pointer"
                                >
                                    •••
                                </button>
                                {menuOpen && (
                                    <div role="menu" className="absolute right-0 bottom-full mb-1 bg-white border border-(--form-grey) rounded z-10 flex flex-col text-sm w-32">
                                        <button role="menuitem" onClick={() => { setEditing(true); setMenuOpen(false) }} className="px-4 py-2 text-left text-(--dark-orange) hover:bg-(--light-orange) cursor-pointer">
                                            Modifier
                                        </button>
                                        <DeleteTaskButton projectId={task.projectId} taskId={task.id} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6.25 text-xs text-(--neutral-grey)">
                        <div className="flex items-center gap-1">
                            <span>Échéance :</span>
                            <Image src="/black-calendar-icon.svg" alt="calendar icon" width={16} height={16} className="w-4 h-4" />
                            <span className='text-black'>{dueDate}</span>
                        </div>
                        <div>
                            <span>Assignée à :</span>
                            <div className="flex gap-2">
                                {task.assignees.map((a) => (
                                    <div key={a.user.id} className="flex items-center gap-1">
                                        <span
                                            key={a.user.id}
                                            title={a.user.name}
                                            className="flex items-center justify-center w-6.25 h-6.25 rounded-full bg-(--form-grey) text-[10px] text-black"
                                        >
                                            {getInitials(a.user.name)}
                                        </span>
                                        <span className="flex items-center h-6.25 rounded-full bg-(--form-grey) px-2">{a.user.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        aria-expanded={commentsOpen}
                        onClick={() => setCommentsOpen((v) => !v)}
                        className="flex items-center gap-2 text-xs text-(--neutral-grey) cursor-pointer py-3 border-t border-(--form-grey)"
                    >
                        <div className='flex flex-row w-full justify-between items-center'>
                            <span className='text-black'>Commentaire{task.comments.length > 1 ? 's' : ''} ({task.comments.length})</span>
                            {commentsOpen ? (
                                <Image src="/up-black-arrow.svg" alt="flèche vers le haut" width={16} height={8} className="w-4 h-2" />
                            ) : (
                                <Image src="/down-black-arrow.svg" alt="flèche vers le bas" width={16} height={8} className="w-4 h-2" />
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {commentsOpen && (
                <CommentsSection
                    projectId={task.projectId}
                    taskId={task.id}
                    comments={task.comments}
                    currentUserId={currentUserId}
                />
            )}

            {editing && (
                <TaskEditModal task={task} members={members} onClose={() => setEditing(false)} />
            )}
        </div>
    )
}

function TaskEditModal({
    task,
    members,
    onClose,
}: {
    task: Task
    members: ProjectMember[]
    onClose: () => void
}) {
    const updateTaskWithIds = updateTask.bind(null, task.projectId, task.id)
    const [state, action, pending] = useActionState(updateTaskWithIds, undefined)
    const [assigneesOpen, setAssigneesOpen] = useState(false)
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
        task.assignees.map((a) => a.user.id)
    )
    const assigneesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (assigneesRef.current && !assigneesRef.current.contains(e.target as Node)) {
                setAssigneesOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function toggleAssignee(id: string) {
        setSelectedAssignees((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        )
    }

    useEffect(() => {
        if (state?.success) onClose()
    }, [state, onClose])

    return (
        <Modal open onClose={onClose} title="Modifier la tâche">
            {state?.message && <ErrorMessage message={state.message} />}
            <form action={action} className="flex flex-col gap-6">
                <FormField label="Titre*" id="title" type="text" name="title" defaultValue={task.title} required error={state?.errors?.title} />
                <FormField label="Description*" id="description" type="text" name="description" defaultValue={task.description} required error={state?.errors?.description} />
                <div className="flex flex-col flex-1">
                    <label htmlFor="dueDate" className="mb-2">Échéance</label>
                    <input id="dueDate" name="dueDate" type="date" defaultValue={task.dueDate.slice(0, 10)} className="border border-(--form-grey) rounded px-3 py-3 cursor-pointer" />
                </div>
                <div className="flex flex-col flex-1">
                    <label htmlFor="priority" className="mb-2">Priorité</label>
                    <select id="priority" name="priority" defaultValue={task.priority} className="border border-(--form-grey) rounded px-3 py-3.75 cursor-pointer">
                        <option value="LOW">Basse</option>
                        <option value="MEDIUM">Moyenne</option>
                        <option value="HIGH">Haute</option>
                        <option value="URGENT">Urgente</option>
                    </select>
                </div>
                <div className="flex flex-col w-full" ref={assigneesRef}>
                    <span className="mb-2">Assigné à :</span>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setAssigneesOpen((o) => !o)}
                            className="w-full text-left border border-(--form-grey) rounded px-3 py-3 cursor-pointer"
                        >
                            {selectedAssignees.length > 0
                                ? members
                                    .filter((m) => selectedAssignees.includes(m.user.id))
                                    .map((m) => m.user.name)
                                    .join(', ')
                                : 'Sélectionner des membres'}
                        </button>
                        <div className={`absolute z-10 mt-1 w-full max-h-48 overflow-auto border border-(--form-grey) rounded bg-white ${assigneesOpen ? 'block' : 'hidden'}`}>
                            <fieldset>
                                <legend className="sr-only">Membres assignables</legend>
                                {members.map((member) => (
                                    <label key={member.id} className="flex items-center gap-2 text-sm px-3 py-2 cursor-pointer hover:bg-(--form-grey)">
                                        <input
                                            type="checkbox"
                                            name="assigneeIds"
                                            value={member.user.id}
                                            checked={selectedAssignees.includes(member.user.id)}
                                            onChange={() => toggleAssignee(member.user.id)}
                                        />
                                        {member.user.name}
                                    </label>
                                ))}
                            </fieldset>
                        </div>
                    </div>
                </div>
                <fieldset className="flex flex-row gap-2 mb-8">
                    <legend>Statut :</legend>
                    <label htmlFor="todo" className="cursor-pointer">
                        <input id='todo' className='hidden peer' type="radio" name="status" value="TODO" defaultChecked={task.status === 'TODO'} />
                        <span className="flex items-center gap-2 text-sm text-(--error-red) bg-(--error-red-light) rounded-full px-4 py-1 peer-checked:border peer-checked:border-(--error-red)">
                            À faire
                        </span>
                    </label>
                    <label htmlFor="in-progress" className="cursor-pointer">
                        <input id='in-progress' className='hidden peer' type="radio" name="status" value="IN_PROGRESS" defaultChecked={task.status === 'IN_PROGRESS'} />
                        <span className="flex items-center gap-2 text-sm text-(--warning-orange) bg-(--warning-orange-light) rounded-full px-4 py-1 peer-checked:border peer-checked:border-(--warning-orange)">
                            En cours
                        </span>
                    </label>
                    <label htmlFor="done" className="cursor-pointer">
                        <input id='done' className='hidden peer' type="radio" name="status" value="DONE" defaultChecked={task.status === 'DONE'} />
                        <span className="flex items-center gap-2 text-sm text-(--success-green) bg-(--success-green-light) rounded-full px-4 py-1 peer-checked:border peer-checked:border-(--success-green)">
                            Terminée
                        </span>
                    </label>
                </fieldset>
                <button className={`text-white bg-(--button-grey) rounded-[10px] w-fit px-4.5 py-3.75 cursor-pointer ${pending ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={pending}>
                    {pending ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </form>
        </Modal>
    )
}

function DeleteTaskButton({ projectId, taskId }: { projectId: string; taskId: string }) {
    async function handleDelete() {
        if (!confirm('Supprimer définitivement cette tâche ?')) return
        await deleteTask(projectId, taskId)
    }

    return (
        <button onClick={handleDelete} role='menuitem' className="px-4 py-2 text-left text-(--error-red) hover:bg-(--light-orange) cursor-pointer">
            Supprimer
        </button>
    )
}
